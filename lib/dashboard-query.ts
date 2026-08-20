import type { QueryClient } from '@tanstack/react-query';

export const DASHBOARD_QUERY_KEYS = {
  campaigns: ['campaigns', 'voice'] as const,
  connectors: ['connectors', 'list'] as const,
};

function apiResource(url = '') {
  const path = String(url).split('?')[0];
  const segments = path.split('/').filter(Boolean);
  const apiIndex = segments.lastIndexOf('api');
  const scoped = apiIndex >= 0 ? segments.slice(apiIndex + 1) : segments;
  if (scoped[0] === 'v1') scoped.shift();
  return scoped[0] || '';
}

export function invalidateDashboardResource(queryClient: QueryClient, url = '') {
  const resource = apiResource(url);
  if (!resource) return Promise.resolve();
  return queryClient.invalidateQueries({
    predicate: (query) => query.queryKey.some((part) =>
      typeof part === 'string' && (part === resource || part.includes(`/${resource}`))
    ),
  });
}
