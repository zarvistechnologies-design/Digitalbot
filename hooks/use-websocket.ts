'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://digital-api-46ss.onrender.com/ws';

interface UseWebSocketOptions {
  /** Event types to listen for */
  onMessage?: (data: any) => void;
  /** Auto-reconnect on disconnect (default: true) */
  reconnect?: boolean;
}

export function useWebSocket({ onMessage, reconnect = true }: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(false);

  // Keep callback ref fresh without re-triggering effect
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_BASE_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        console.log('[WS] Connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessageRef.current?.(data);
        } catch {
          // ignore non-JSON messages
        }
      };

      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (reconnect) {
          reconnectTimer.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch {
      if (reconnect) {
        reconnectTimer.current = setTimeout(connect, 3000);
      }
    }
  }, [reconnect]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { connected };
}
