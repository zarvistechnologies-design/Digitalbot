"use client";

import Sidebar from "@/components/Sidebar";
import { tankroAPI } from "@/lib/api";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Clock,
  Loader2,
  Lock,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TankroMessage {
  role: "user" | "assistant" | "admin" | "system";
  text: string;
  messageId?: string;
  createdAt: string;
}

interface TankroBookingDetails {
  _id: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  locationName?: string;
  district?: string;
  propertyType?: string;
  serviceType?: string;
  tankCapacityLitres?: number;
  quotedPrice?: number;
  date?: string;
  time?: string;
  status?: string;
  source?: string;
  notes?: string;
  createdAt?: string;
}

interface TankroSession {
  _id: string;
  phone: string;
  customerName?: string;
  state: string;
  status: "active" | "completed" | "handoff" | "abandoned" | "closed";
  district?: string;
  propertyType?: string;
  serviceType?: string;
  tankCount?: number;
  tankCapacityLitres?: number;
  quotedPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
  preferredDate?: string;
  preferredTime?: string;
  bookingId?: string | TankroBookingDetails | null;
  messages: TankroMessage[];
  lastMessageAt: string;
  createdAt: string;
  replyWindow?: {
    canReply: boolean;
    lastCustomerMessageAt?: string | null;
    expiresAt?: string | null;
    remainingMs?: number;
  };
}

const statusStyles: Record<TankroSession["status"], string> = {
  active: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  handoff: "bg-blue-100 text-blue-700 border-blue-200",
  abandoned: "bg-gray-100 text-gray-700 border-gray-200",
  closed: "bg-slate-100 text-slate-700 border-slate-200",
};

const stateLabels: Record<string, string> = {
  awaiting_district: "District",
  awaiting_property_type: "Property",
  awaiting_tank_count: "Tank Count",
  awaiting_tank_capacity: "Capacity",
  awaiting_date_time: "Date & Time",
  awaiting_slot_confirmation: "Slot Check",
  awaiting_name: "Name",
  completed: "Completed",
  handoff: "Handoff",
  closed_24h: "Closed",
};

const REPLY_WINDOW_MS = 24 * 60 * 60 * 1000;

export default function TankroSessionsPage() {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const {
    data: sessionData,
    isPending: loading,
    isFetching,
    error: sessionsError,
    refetch: fetchSessions,
  } = useQuery({
    queryKey: ["tankro", "sessions", statusFilter, search],
    queryFn: async () => {
      const response = await tankroAPI.getSessions({
        limit: 100,
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: search || undefined,
      });
      return {
        sessions: (response.data.data || []) as TankroSession[],
        counts: response.data.counts || {},
      };
    },
    placeholderData: keepPreviousData,
  });
  const sessions = sessionData?.sessions || [];
  const counts = sessionData?.counts || {};
  const error = sessionsError?.message || null;

  useEffect(() => {
    setSelectedId((current) =>
      sessions.some((session) => session._id === current) ? current : sessions[0]?._id || ""
    );
  }, [sessions]);

  const selectedSession = useMemo(() => {
    return sessions.find((session) => session._id === selectedId) || sessions[0] || null;
  }, [selectedId, sessions]);

  const activeCount = counts.byStatus?.active || 0;
  const handoffCount = counts.byStatus?.handoff || 0;
  const closedCount = counts.byStatus?.closed || 0;

  const sendAdminMessage = useCallback(async (sessionId: string, message: string) => {
    try {
      const response = await tankroAPI.sendSessionMessage(sessionId, message);
      const updatedSession = response.data.session;
      if (updatedSession) {
        queryClient.setQueryData<typeof sessionData>(
          ["tankro", "sessions", statusFilter, search],
          (current) => current ? {
            ...current,
            sessions: current.sessions.map((session) =>
              session._id === sessionId ? updatedSession : session
            ),
          } : current
        );
        setSelectedId(updatedSession._id);
      }
    } catch (err: any) {
      const updatedSession = err.response?.data?.session;
      if (updatedSession) {
        queryClient.setQueryData<typeof sessionData>(
          ["tankro", "sessions", statusFilter, search],
          (current) => current ? {
            ...current,
            sessions: current.sessions.map((session) =>
              session._id === sessionId ? updatedSession : session
            ),
          } : current
        );
        setSelectedId(updatedSession._id);
      }
      throw err;
    }
  }, [queryClient, search, statusFilter]);

  return (
    <div className="min-h-screen bg-white lg:h-screen lg:overflow-hidden">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 rounded-xl border border-gray-200 bg-white p-3 shadow-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:h-screen lg:overflow-hidden lg:pl-64">
        <div className="flex min-h-screen flex-col pt-16 lg:h-full lg:min-h-0 lg:p-3 lg:pt-3">
          <div className="grid min-h-0 flex-1 overflow-hidden border border-gray-200 bg-white shadow-xl lg:rounded-xl lg:grid-cols-[420px_minmax(0,1fr)] xl:grid-cols-[440px_minmax(0,1fr)]">
            <aside className="flex min-h-[520px] flex-col overflow-hidden border-r border-gray-200 bg-white lg:min-h-0">
              <div className="shrink-0 border-b border-gray-200 bg-white px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white shadow-sm shadow-orange-200">
                      T
                    </div>
                    <div className="min-w-0">
                      <h1 className="truncate text-base font-bold text-gray-900">Tankro Bot Sessions</h1>
                      <p className="truncate text-xs text-gray-500">{sessions.length} conversations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => void fetchSessions()}
                    disabled={isFetching}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 disabled:opacity-60"
                    aria-label="Refresh sessions"
                  >
                    <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-4 gap-2">
                  <InboxStat label="All" value={sessions.length} />
                  <InboxStat label="Active" value={activeCount} />
                  <InboxStat label="Handoff" value={handoffCount} />
                  <InboxStat label="Closed" value={closedCount} />
                </div>
              </div>

              {error && (
                <div className="m-3 flex shrink-0 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="shrink-0 border-b border-gray-200 bg-white p-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search name, phone, location, or message"
                    className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-11 pr-3 text-sm text-gray-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="mt-2 h-9 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-xs font-semibold text-gray-700 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                >
                  <option value="All">All status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="handoff">Handoff</option>
                  <option value="abandoned">Abandoned</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto bg-white p-2">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                    <MessageSquare className="mb-3 h-11 w-11 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-900">No sessions found</p>
                    <p className="mt-1 text-xs text-gray-500">Try changing search or status.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((session) => (
                      <SessionCard
                        key={session._id}
                        session={session}
                        selected={selectedSession?._id === session._id}
                        onSelect={() => setSelectedId(session._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </aside>

            <SessionDetail session={selectedSession} onSendMessage={sendAdminMessage} />
          </div>
        </div>
      </main>
    </div>
  );
}

function InboxStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50 px-2 py-1.5 text-center">
      <p className="text-sm font-bold leading-none text-orange-700">{value}</p>
      <p className="mt-0.5 truncate text-[10px] font-semibold uppercase text-gray-500">{label}</p>
    </div>
  );
}

function SessionCard({
  session,
  selected,
  onSelect,
}: {
  session: TankroSession;
  selected: boolean;
  onSelect: () => void;
}) {
  const replyWindow = getClientReplyWindow(session);
  const lastMessage = getLastMessage(session);
  const sessionLocation = getSessionLocation(session);
  const stateLabel = stateLabels[session.state] || formatStatusLabel(session.state);

  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
        selected
          ? "border-orange-300 bg-orange-50 shadow-sm ring-2 ring-orange-100"
          : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className="flex min-w-0 gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            replyWindow.canReply ? "bg-orange-600 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {getInitials(session.customerName || session.phone)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900">{session.customerName || "Tankro customer"}</p>
              <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{session.phone}</span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-medium text-gray-400">{formatDateTime(session.lastMessageAt)}</span>
          </div>

          {sessionLocation && (
            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{sessionLocation}</span>
            </div>
          )}

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
            {lastMessage?.text || "No messages captured yet"}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[session.status]}`}>
              {formatStatusLabel(session.status)}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
              {stateLabel}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                replyWindow.canReply ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {replyWindow.canReply ? `${formatWindowRemaining(replyWindow.remainingMs)} left` : "closed"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function SessionDetail({
  session,
  onSendMessage,
}: {
  session: TankroSession | null;
  onSendMessage: (sessionId: string, message: string) => Promise<void>;
}) {
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  useEffect(() => {
    setMessageText("");
    setSendError(null);
  }, [session?._id]);

  if (!session) {
    return (
      <section className="flex min-h-[520px] min-w-0 flex-col items-center justify-center bg-orange-50 px-6 text-center lg:min-h-0">
        <div className="rounded-xl bg-white/90 px-6 py-5 shadow-sm">
          <MessageSquare className="mx-auto mb-3 h-10 w-10 text-orange-500" />
          <p className="text-sm font-semibold text-gray-900">Select a session</p>
          <p className="mt-1 text-xs text-gray-500">The customer conversation will appear here.</p>
        </div>
      </section>
    );
  }

  const sessionLocation = getSessionLocation(session);
  const replyWindow = getClientReplyWindow(session);
  const messages = session.messages || [];

  const handleSend = async () => {
    const cleanMessage = messageText.trim();
    if (!cleanMessage || !replyWindow.canReply) return;

    try {
      setSending(true);
      setSendError(null);
      await onSendMessage(session._id, cleanMessage);
      setMessageText("");
    } catch (err: any) {
      setSendError(err.response?.data?.error || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="flex min-h-[520px] min-w-0 flex-col overflow-hidden bg-orange-50 lg:min-h-0">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
            {getInitials(session.customerName || session.phone)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-900">{session.customerName || session.phone}</h2>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {session.phone}{sessionLocation ? ` / ${sessionLocation}` : ""} / {formatStatusLabel(session.status)}
            </p>
          </div>
        </div>
        <div className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
          replyWindow.canReply ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
        }`}>
          {replyWindow.canReply ? <Clock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
          {replyWindow.canReply ? `${formatWindowRemaining(replyWindow.remainingMs)} left` : "closed"}
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-6 lg:px-8"
        style={{
          backgroundColor: "#fff7ed",
          backgroundImage:
            "radial-gradient(rgba(234,88,12,0.08) 1px, transparent 1px), radial-gradient(rgba(249,115,22,0.05) 1px, transparent 1px)",
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "20px 20px",
        }}
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-xl bg-white/90 px-6 py-5 text-center shadow-sm">
              <MessageSquare className="mx-auto mb-2 h-9 w-9 text-orange-500" />
              <p className="text-sm font-semibold text-gray-900">No messages captured yet</p>
              <p className="mt-1 text-xs text-gray-500">Customer and bot replies will appear here.</p>
            </div>
          </div>
        )}
        <div className="space-y-2">
          {messages.map((message, index) => {
            const isCustomer = message.role === "user";
            const isAdmin = message.role === "admin";
            const bubbleStyle = isCustomer
              ? "rounded-tl-sm bg-white text-gray-900"
              : isAdmin
                ? "rounded-tr-sm bg-orange-600 text-white"
                : "rounded-tr-sm border border-orange-200 bg-orange-100 text-gray-900";
            const metaStyle = isAdmin ? "text-orange-100" : "text-gray-500";

            return (
              <div
                key={`${message.createdAt}-${index}`}
                className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[84%] rounded-lg px-3 py-2 text-sm shadow-sm sm:max-w-[72%] ${bubbleStyle}`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text || "[message]"}</p>
                  <div className="mt-1 flex items-center justify-end gap-2">
                    <span className={`text-[10px] ${metaStyle}`}>
                      {message.role === "admin" ? "Admin" : message.role === "assistant" ? "Bot" : "Customer"}
                    </span>
                    <span className={`text-[10px] ${metaStyle}`}>{formatDateTime(message.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3">
        {sendError && (
          <div className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {sendError}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            disabled={!replyWindow.canReply || sending}
            rows={1}
            placeholder={replyWindow.canReply ? "Type a message" : "Session closed after 24 hours"}
            className="min-h-[44px] flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100 disabled:text-gray-400"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!messageText.trim() || !replyWindow.canReply || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            aria-label={replyWindow.canReply ? "Send message" : "Chat closed"}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : replyWindow.canReply ? <Send className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
}

function getLastMessage(session: TankroSession) {
  return session.messages?.[session.messages.length - 1] || null;
}

function getSessionBooking(session: TankroSession) {
  return typeof session.bookingId === "object" && session.bookingId !== null ? session.bookingId : null;
}

function getSessionLocation(session: TankroSession) {
  const booking = getSessionBooking(session);
  return booking?.locationName || booking?.district || session.district || "";
}

function getInitials(value?: string) {
  const clean = String(value || "T").replace(/[^\w\s+]/g, " ").trim();
  if (!clean) return "T";
  if (clean.startsWith("+")) return clean.slice(-2).toUpperCase();
  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getLastCustomerMessageDate(session: TankroSession) {
  const messages = session.messages || [];
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role === "user" && message.createdAt) {
      const date = new Date(message.createdAt);
      if (!Number.isNaN(date.getTime())) return date;
    }
  }

  const fallback = new Date(session.createdAt || session.lastMessageAt);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function getClientReplyWindow(session: TankroSession) {
  const serverExpiresAt = session.replyWindow?.expiresAt ? new Date(session.replyWindow.expiresAt) : null;
  const lastCustomerDate = getLastCustomerMessageDate(session);
  const expiresAt = serverExpiresAt && !Number.isNaN(serverExpiresAt.getTime())
    ? serverExpiresAt
    : lastCustomerDate
      ? new Date(lastCustomerDate.getTime() + REPLY_WINDOW_MS)
      : null;
  const remainingMs = expiresAt ? Math.max(0, expiresAt.getTime() - Date.now()) : 0;

  return {
    canReply: session.status !== "closed" && Boolean(expiresAt) && remainingMs > 0,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    remainingMs,
  };
}

function formatWindowRemaining(value?: number) {
  const remainingMs = Math.max(0, value || 0);
  const hours = Math.floor(remainingMs / (60 * 60 * 1000));
  const minutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return "less than 1m";
}

function formatStatusLabel(status?: string) {
  if (!status) return "Unknown";
  if (status === "closed") return "Closed";
  return status.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

