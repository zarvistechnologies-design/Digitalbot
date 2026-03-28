'use client';

import { cachedFetch, getStaleCache, invalidateCache, isCacheStale, subscribeCache } from '@/lib/cache';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCachedFetchOptions<T> {
  /** Cache key */
  key: string;
  /** Fetcher function that returns the data */
  fetcher: () => Promise<T>;
  /** TTL in ms (default: 30s) */
  ttl?: number;
  /** Whether to fetch on mount (default: true) */
  enabled?: boolean;
}

/**
 * Hook with stale-while-revalidate pattern:
 * 1. Returns stale cached data instantly (no loading spinner)
 * 2. Fetches fresh data in background
 * 3. Updates when fresh data arrives
 */
export function useCachedFetch<T>({ key, fetcher, ttl = 30000, enabled = true }: UseCachedFetchOptions<T>) {
  const [data, setData] = useState<T | null>(() => getStaleCache<T>(key));
  const [loading, setLoading] = useState<boolean>(!getStaleCache<T>(key));
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refresh = useCallback(async (silent = false) => {
    if (!silent && !data) setLoading(true);
    setError(null);
    try {
      // Invalidate so cachedFetch re-fetches
      invalidateCache(key);
      const result = await cachedFetch(key, fetcherRef.current, ttl);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Fetch failed');
    } finally {
      setLoading(false);
    }
  }, [key, ttl, data]);

  useEffect(() => {
    if (!enabled) return;

    const stale = getStaleCache<T>(key);
    if (stale) {
      setData(stale);
      setLoading(false);
    }

    if (isCacheStale(key)) {
      // Fetch in background — if we have stale data, don't show spinner
      const hasStale = !!stale;
      if (!hasStale) setLoading(true);

      cachedFetch(key, fetcherRef.current, ttl)
        .then(result => {
          setData(result);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }

    // Subscribe to external cache updates (e.g. from WebSocket invalidation)
    const unsub = subscribeCache(key, () => {
      const fresh = getStaleCache<T>(key);
      if (fresh) setData(fresh);
    });

    return unsub;
  }, [key, ttl, enabled]);

  return { data, loading, error, refresh };
}
