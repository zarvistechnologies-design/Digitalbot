import { getDashboardQueryClient } from "@/lib/query-client";
import { invalidateDashboardResource } from "@/lib/dashboard-query";

const CACHE_TTL = 60_000;
let installed = false;

interface CachedResponse {
  body: string | ArrayBuffer | null;
  headers: [string, string][];
  status: number;
  statusText: string;
}

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function requestMethod(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.method) return init.method.toUpperCase();
  if (typeof Request !== "undefined" && input instanceof Request) {
    return input.method.toUpperCase();
  }
  return "GET";
}

function requestHeaders(input: RequestInfo | URL, init?: RequestInit) {
  if (init?.headers) return new Headers(init.headers);
  if (typeof Request !== "undefined" && input instanceof Request) {
    return input.headers;
  }
  return new Headers();
}

function isDashboardApiRequest(url: string) {
  const configuredApi = process.env.NEXT_PUBLIC_API_URL;
  if (configuredApi && url.startsWith(configuredApi)) return true;
  return /\/api(?:\/v1)?\/[a-z0-9-]+(?:\/|\?|$)/i.test(url);
}

function hashScope(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash.toString(36);
}

function toResponse(cached: CachedResponse) {
  const body = cached.body instanceof ArrayBuffer ? cached.body.slice(0) : cached.body;
  return new Response(body, {
    headers: cached.headers,
    status: cached.status,
    statusText: cached.statusText,
  });
}

export function installDashboardFetchCache() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  const nativeFetch = window.fetch.bind(window);
  const queryClient = getDashboardQueryClient();

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = requestUrl(input);
    const method = requestMethod(input, init);

    if (!isDashboardApiRequest(url)) {
      return nativeFetch(input, init);
    }

    if (method !== "GET") {
      const response = await nativeFetch(input, init);
      if (response.ok) await invalidateDashboardResource(queryClient, url);
      return response;
    }

    const headers = requestHeaders(input, init);
    const authScope = headers.get("authorization") || "anonymous";
    const queryKey = ["network", "fetch", method, url, hashScope(authScope)] as const;
    const queryOptions = {
      queryKey,
      staleTime: CACHE_TTL,
      gcTime: 5 * 60_000,
      queryFn: async () => {
        const response = await nativeFetch(input, init);
        const bodyless = [204, 205, 304].includes(response.status);
        const contentType = response.headers.get("content-type") || "";
        const textResponse = /(?:json|text|xml|javascript)/i.test(contentType);
        return {
          body: bodyless ? null : textResponse ? await response.text() : await response.arrayBuffer(),
          headers: Array.from(response.headers.entries()),
          status: response.status,
          statusText: response.statusText,
        };
      },
    } as const;
    const state = queryClient.getQueryState<CachedResponse>(queryKey);
    let cached = state?.data;
    if (cached && state && !state.isInvalidated) {
      if (Date.now() - state.dataUpdatedAt >= CACHE_TTL) {
        void queryClient.fetchQuery<CachedResponse>(queryOptions).catch(() => {});
      }
    } else {
      cached = await queryClient.fetchQuery<CachedResponse>(queryOptions);
    }
    if (cached.status < 200 || cached.status >= 300) {
      queryClient.removeQueries({ queryKey, exact: true });
    }

    return toResponse(cached);
  };
}
