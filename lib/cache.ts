'use client';

/**
 * Ultra-fast in-memory data cache with stale-while-revalidate strategy.
 * - Instant page loads from cache
 * - Background refresh for fresh data
 * - Cross-page data sharing (Dashboard ↔ Calls)
 * - WebSocket-driven cache invalidation
 */

type CacheEntry<T> = {
  data: T;
  timestamp: number;
  ttl: number;
};

const cache = new Map<string, CacheEntry<any>>();
const inflight = new Map<string, Promise<any>>();
const listeners = new Map<string, Set<() => void>>();

/** Get cached data if still valid */
export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > entry.ttl) return null;
  return entry.data;
}

/** Get cached data even if stale (for instant display) */
export function getStaleCache<T>(key: string): T | null {
  const entry = cache.get(key);
  return entry ? entry.data : null;
}

/** Check if cache is stale (expired but data exists) */
export function isCacheStale(key: string): boolean {
  const entry = cache.get(key);
  if (!entry) return true;
  return Date.now() - entry.timestamp > entry.ttl;
}

/** Set cache with TTL in milliseconds */
export function setCache<T>(key: string, data: T, ttl = 30000): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
  // Notify subscribers
  listeners.get(key)?.forEach(fn => fn());
}

/** Invalidate a cache key */
export function invalidateCache(key: string): void {
  cache.delete(key);
  listeners.get(key)?.forEach(fn => fn());
}

/** Invalidate all keys matching a prefix */
export function invalidateCachePrefix(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/** Subscribe to cache changes */
export function subscribeCache(key: string, fn: () => void): () => void {
  if (!listeners.has(key)) listeners.set(key, new Set());
  listeners.get(key)!.add(fn);
  return () => listeners.get(key)?.delete(fn);
}

/**
 * Fetch with deduplication + caching.
 * If a request for the same key is already in-flight, reuse it.
 */
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 30000
): Promise<T> {
  // Return fresh cache if available
  const cached = getCache<T>(key);
  if (cached !== null) return cached;

  // Deduplicate in-flight requests
  if (inflight.has(key)) {
    return inflight.get(key) as Promise<T>;
  }

  const promise = fetcher().then(data => {
    setCache(key, data, ttl);
    inflight.delete(key);
    return data;
  }).catch(err => {
    inflight.delete(key);
    throw err;
  });

  inflight.set(key, promise);
  return promise;
}

// Cache keys
export const CACHE_KEYS = {
  CALLS: 'calls',
  CALLS_STATS: 'calls_stats',
  CALLS_AGENTS: 'calls_agents',
  DASHBOARD_ANALYTICS: 'dashboard_analytics',
} as const;
