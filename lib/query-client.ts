import { QueryClient } from "@tanstack/react-query";

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: { retry: 0 },
    },
  });
}

export function getDashboardQueryClient() {
  if (typeof window === "undefined") return createQueryClient();
  if (!browserQueryClient) browserQueryClient = createQueryClient();
  return browserQueryClient;
}
