"use client";

import { useWebSocket } from "@/components/hooks/use-websocket";
import { CACHE_KEYS, invalidateCache } from "@/lib/cache";
import {
  DASHBOARD_QUERY_KEYS,
  invalidateDashboardResource,
  isCurrentWorkspaceEvent,
} from "@/lib/dashboard-query";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

const CALL_EVENTS = new Set(["new-call", "call-update"]);

export default function DashboardLiveUpdates() {
  const queryClient = useQueryClient();
  const callRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const invalidateCallData = useCallback(() => {
    if (callRefreshTimer.current) clearTimeout(callRefreshTimer.current);
    callRefreshTimer.current = setTimeout(() => {
      invalidateCache(CACHE_KEYS.CALLS);
      invalidateCache(CACHE_KEYS.CALLS_STATS);
      invalidateCache(CACHE_KEYS.DASHBOARD_CALLS_SUMMARY);
      void invalidateDashboardResource(queryClient, "/calls");
      void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.qualifiedLeads });
    }, 250);
  }, [queryClient]);

  useEffect(() => () => {
    if (callRefreshTimer.current) clearTimeout(callRefreshTimer.current);
  }, []);

  useWebSocket({
    onMessage: useCallback((message: { type?: string; workspaceId?: unknown }) => {
      if (!message?.type || !isCurrentWorkspaceEvent(message)) return;

      if (CALL_EVENTS.has(message.type)) {
        invalidateCallData();
        return;
      }

      if (message.type === "leads-update" || message.type === "lead-update") {
        void invalidateDashboardResource(queryClient, "/leads");
        void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.qualifiedLeads });
      } else if (message.type === "campaign-update") {
        void invalidateDashboardResource(queryClient, "/campaigns");
      } else if (message.type === "agent-knowledge-updated") {
        void invalidateDashboardResource(queryClient, "/agent-knowledge");
      }
    }, [invalidateCallData, queryClient]),
  });

  return null;
}
