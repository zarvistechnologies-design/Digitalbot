'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULT_WS_URL = 'wss://digital-api-46ss.onrender.com/ws';
const RECONNECT_DELAY = 3000;

function getWebSocketUrl() {
  if (process.env.NEXT_PUBLIC_WS_URL) return process.env.NEXT_PUBLIC_WS_URL;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return DEFAULT_WS_URL;

  try {
    const url = new URL(apiUrl);
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    url.pathname = '/ws';
    url.search = '';
    url.hash = '';
    return url.toString();
  } catch {
    return DEFAULT_WS_URL;
  }
}

interface UseWebSocketOptions {
  /** Event types to listen for */
  onMessage?: (data: any) => void;
  /** Auto-reconnect on disconnect (default: true) */
  reconnect?: boolean;
}

interface Subscriber {
  onMessage: (data: any) => void;
  onConnectionChange: (connected: boolean) => void;
  reconnect: boolean;
}

// Every dashboard consumer shares one transport. This keeps the connection
// alive between route changes and avoids opening a new socket for each page.
const subscribers = new Set<Subscriber>();
let sharedSocket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let sharedConnected = false;

function publishConnection(connected: boolean) {
  sharedConnected = connected;
  subscribers.forEach((subscriber) => subscriber.onConnectionChange(connected));
}

function shouldReconnect() {
  return Array.from(subscribers).some((subscriber) => subscriber.reconnect);
}

function scheduleReconnect() {
  if (reconnectTimer || !shouldReconnect()) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connectSharedSocket();
  }, RECONNECT_DELAY);
}

function connectSharedSocket() {
  if (typeof window === 'undefined' || subscribers.size === 0) return;
  if (
    sharedSocket?.readyState === WebSocket.OPEN ||
    sharedSocket?.readyState === WebSocket.CONNECTING
  ) return;

  try {
    const socket = new WebSocket(getWebSocketUrl());
    sharedSocket = socket;

    socket.onopen = () => publishConnection(true);
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        subscribers.forEach((subscriber) => subscriber.onMessage(data));
      } catch {
        // Ignore non-JSON messages.
      }
    };
    socket.onclose = () => {
      if (sharedSocket === socket) sharedSocket = null;
      publishConnection(false);
      scheduleReconnect();
    };
    socket.onerror = () => socket.close();
  } catch {
    sharedSocket = null;
    publishConnection(false);
    scheduleReconnect();
  }
}

function subscribe(subscriber: Subscriber) {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
  subscribers.add(subscriber);
  subscriber.onConnectionChange(sharedConnected);
  connectSharedSocket();

  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size > 0) return;

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    // A short grace period preserves the socket during Next.js route swaps.
    closeTimer = setTimeout(() => {
      if (subscribers.size > 0) return;
      const socket = sharedSocket;
      sharedSocket = null;
      if (socket) {
        socket.onclose = null;
        socket.onerror = null;
        socket.onmessage = null;
        socket.onopen = null;
        socket.close();
      }
      publishConnection(false);
    }, 1500);
  };
}

export function useWebSocket({ onMessage, reconnect = true }: UseWebSocketOptions = {}) {
  const onMessageRef = useRef(onMessage);
  const [connected, setConnected] = useState(sharedConnected);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => subscribe({
    onMessage: (data) => onMessageRef.current?.(data),
    onConnectionChange: setConnected,
    reconnect,
  }), [reconnect]);

  return { connected };
}
