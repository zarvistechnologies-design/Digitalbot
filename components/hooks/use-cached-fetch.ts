"use client";

import { getStaleCache, setCache } from "@/lib/cache";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

interface UseCachedFetchOptions<T> {
  key: string;
  fetcher: () => Promise<T>;
  ttl?: number;
  enabled?: boolean;
}

/**
 * Compatibility wrapper backed by TanStack Query.
 * Existing callers keep their API while gaining shared request deduplication,
 * stale-while-revalidate data, and cache reuse across dashboard routes.
 */
export function useCachedFetch<T>({
  key,
  fetcher,
  ttl = 30_000,
  enabled = true,
}: UseCachedFetchOptions<T>) {
  const queryClient = useQueryClient();
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const query = useQuery<T, Error>({
    queryKey: [key],
    queryFn: () => fetcherRef.current(),
    enabled,
    staleTime: ttl,
    initialData: () => getStaleCache<T>(key) ?? undefined,
    initialDataUpdatedAt: 0,
  });

  useEffect(() => {
    if (query.data !== undefined) setCache(key, query.data, ttl);
  }, [key, query.data, ttl]);

  const refresh = useCallback(
    async (_silent = false) => {
      await queryClient.invalidateQueries({ queryKey: [key], exact: true });
    },
    [key, queryClient]
  );

  return {
    data: query.data ?? null,
    loading: query.isPending && query.data === undefined,
    fetching: query.isFetching,
    error: query.error?.message ?? null,
    refresh,
  };
}
