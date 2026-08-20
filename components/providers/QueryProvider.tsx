"use client";

import {
  dehydrate,
  hydrate,
  QueryClientProvider,
} from "@tanstack/react-query";
import { getDashboardQueryClient } from "@/lib/query-client";
import { useEffect, useState, type ReactNode } from "react";

const STORAGE_KEY = "digitalbot-query-cache-v1";
const shouldPersistQuery = (queryKey: readonly unknown[]) =>
  queryKey[0] === "dashboard_calls_summary" ||
  queryKey[0] === "campaigns" ||
  queryKey[0] === "connectors" ||
  queryKey[0] === "doctors" ||
  queryKey[0] === "prompts" ||
  (queryKey[0] === "akiara" && queryKey[1] === "analytics") ||
  (queryKey[0] === "tankro" && queryKey[1] === "summary");

const shouldPersistNetworkQuery = (query: { queryKey: readonly unknown[]; state: { data: unknown } }) => {
  if (query.queryKey[0] !== "network" || query.queryKey[1] !== "fetch") return false;
  const body = (query.state.data as { body?: unknown } | undefined)?.body;
  return typeof body === "string" && body.length <= 200_000;
};

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => {
    const client = getDashboardQueryClient();

    if (typeof window !== "undefined") {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) hydrate(client, JSON.parse(cached));
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    return client;
  });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const state = dehydrate(queryClient, {
          shouldDehydrateQuery: (query) => query.state.status === "success" && (
            shouldPersistQuery(query.queryKey) || shouldPersistNetworkQuery(query)
          ),
        });
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      }, 250);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, [queryClient]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
