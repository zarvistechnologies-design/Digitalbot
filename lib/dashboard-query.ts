import type { QueryClient } from '@tanstack/react-query';

export const DASHBOARD_QUERY_KEYS = {
  campaigns: ['campaigns', 'voice'] as const,
  connectors: ['connectors', 'list'] as const,
  analyzerCalls: ['calls', 'analyzer'] as const,
  qualifiedLeads: ['leads', 'qualified'] as const,
};

export function getDashboardWorkspaceScope() {
  if (typeof window === 'undefined') return 'server';
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return String(
      user.workspaceId ||
      user.tenantId ||
      user.assignedPhoneNumber ||
      user.email ||
      'default',
    ).trim().toLowerCase();
  } catch {
    return 'default';
  }
}

export function isCurrentWorkspaceEvent(message: { workspaceId?: unknown } = {}) {
  const eventWorkspaceId = String(message.workspaceId || '').trim();
  if (!eventWorkspaceId || typeof window === 'undefined') return true;

  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentWorkspaceId = String(user.workspaceId || user.tenantId || '').trim();
    return !currentWorkspaceId || currentWorkspaceId === eventWorkspaceId;
  } catch {
    return true;
  }
}

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
