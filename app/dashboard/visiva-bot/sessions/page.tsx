"use client";

import { useWebSocket } from "@/components/hooks/use-websocket";
import { visivaBotAPI } from "@/lib/api";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  User,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { VisivaPageShell } from "../_components/VisivaPageShell";
import { formatPhone, interestClass, interestLabels, stateClass, stateLabels, timeAgo } from "../_components/visiva-utils";

interface ConversationMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface VisivaMedia {
  mediaId: string;
  type: string;
  mimeType: string;
  marker: string;
}

interface VisivaSession {
  _id: string;
  phone: string;
  state: string;
  prospectName: string;
  programInterest: string;
  currentStatus: string;
  preferredModality: string;
  desiredStartDate: string;
  appointmentAvailability: string;
  interestLevel: string;
  objection: string;
  summary: string;
  conversationHistory: ConversationMessage[];
  mediaUrls: VisivaMedia[];
  adminContacted: boolean;
  lastActivity: string;
  createdAt: string;
}

interface Analytics {
  totalSessions: number;
  activeSessions: number;
  totalLeads: number;
  highIntentLeads: number;
  appointments: number;
  escalated: number;
}

export default function VisivaSessionsPage() {
  const [sessions, setSessions] = useState<VisivaSession[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterInterest, setFilterInterest] = useState("all");
  const [dateRange, setDateRange] = useState("7");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [sendingPhone, setSendingPhone] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionsRes, analyticsRes] = await Promise.all([
        visivaBotAPI.getSessions({ limit: 200 }),
        visivaBotAPI.getAnalytics({ days: parseInt(dateRange, 10) }),
      ]);
      setSessions(sessionsRes.data?.data || []);
      setAnalytics(analyticsRes.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch Visiva sessions:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useWebSocket({
    onMessage: useCallback((data: { type?: string }) => {
      if (data.type === "visiva_session_update" || data.type === "visiva_lead_update") fetchData();
    }, [fetchData]),
  });

  const handleSend = async (phone: string) => {
    if (!messageDraft.trim()) return;
    setSendingPhone(phone);
    try {
      await visivaBotAPI.sendMessage({ phone, message: messageDraft.trim() });
      setMessageDraft("");
      fetchData();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingPhone(null);
    }
  };

  const handleReset = async (phone: string) => {
    try {
      await visivaBotAPI.resetSession(phone);
      fetchData();
    } catch (err) {
      console.error("Failed to reset session:", err);
    }
  };

  const filtered = sessions.filter((session) => {
    const query = search.trim().toLowerCase();
    if (query) {
      const haystack = [
        session.phone,
        session.prospectName,
        session.programInterest,
        session.summary,
      ].join(" ").toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filterState !== "all" && session.state !== filterState) return false;
    if (filterInterest !== "all" && session.interestLevel !== filterInterest) return false;
    return true;
  });

  return (
    <VisivaPageShell
      title="Visiva Bot Sessions"
      description="Valeria admissions conversations"
      icon={<MessageSquare className="w-5 h-5 text-white" />}
      actions={
        <>
          <select value={dateRange} onChange={(event) => setDateRange(event.target.value)} className="h-10 px-3 bg-white rounded-xl border border-slate-200 text-sm">
            <option value="1">Last 24h</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
          <button onClick={fetchData} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 hover:bg-slate-50" aria-label="Refresh sessions">
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
          </button>
        </>
      }
    >
      {analytics && (
        <section className="grid grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            ["Sessions", analytics.totalSessions],
            ["Active", analytics.activeSessions],
            ["Leads", analytics.totalLeads],
            ["High Intent", analytics.highIntentLeads],
            ["Appointments", analytics.appointments],
            ["Escalated", analytics.escalated],
          ].map(([label, value]) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
          ))}
        </section>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search phone, name, program..."
            className="w-full h-10 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        </div>
        <select value={filterState} onChange={(event) => setFilterState(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
          <option value="all">All states</option>
          {Object.entries(stateLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select value={filterInterest} onChange={(event) => setFilterInterest(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
          <option value="all">All interest</option>
          {Object.entries(interestLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </section>

      {loading && sessions.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" />
          Loading sessions...
        </div>
      ) : (
        <section className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 py-16 text-center text-slate-400">No sessions found</div>
          ) : filtered.map((session) => {
            const isExpanded = expanded === session._id;
            return (
              <div key={session._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setExpanded(isExpanded ? null : session._id)}
                  className="w-full text-left p-4 flex items-center gap-4 hover:bg-slate-50"
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${session.state === "APPOINTMENT_SCHEDULED" ? "bg-emerald-500" : session.state === "ESCALATED" ? "bg-red-500" : "bg-amber-500"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900">{formatPhone(session.phone)}</span>
                      {session.prospectName && <span className="text-sm text-slate-500">{session.prospectName}</span>}
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${stateClass(session.state)}`}>{stateLabels[session.state] || session.state}</span>
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${interestClass(session.interestLevel)}`}>{interestLabels[session.interestLevel] || session.interestLevel}</span>
                      {session.programInterest && <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold">{session.programInterest}</span>}
                    </div>
                  </div>
                  <span className="hidden sm:block text-xs text-slate-400">{timeAgo(session.lastActivity)}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      {[
                        ["Name", session.prospectName],
                        ["Program", session.programInterest],
                        ["Current status", session.currentStatus],
                        ["Modality", session.preferredModality],
                        ["Desired start", session.desiredStartDate],
                        ["Availability", session.appointmentAvailability],
                      ].filter(([, value]) => Boolean(value)).map(([label, value]) => (
                        <div key={label} className="bg-white rounded-lg border border-slate-200 p-3">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
                          <p className="text-slate-800 mt-1">{value}</p>
                        </div>
                      ))}
                    </div>

                    {session.summary && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Summary</p>
                        <p className="text-sm text-slate-700">{session.summary}</p>
                      </div>
                    )}

                    {session.mediaUrls?.length > 0 && (
                      <div className="bg-white rounded-lg border border-slate-200 p-3">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Media</p>
                        <div className="flex flex-wrap gap-2">
                          {session.mediaUrls.map((media) => (
                            <a key={media.mediaId} href={visivaBotAPI.getMediaUrl(media.marker)} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                              {media.type || "media"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><User className="w-3 h-3" /> Conversation</p>
                      <div className="max-h-72 overflow-y-auto bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        {session.conversationHistory?.length ? session.conversationHistory.map((message, index) => (
                          <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm border ${message.role === "user" ? "bg-sky-50 border-sky-100 text-slate-800" : "bg-emerald-50 border-emerald-100 text-slate-800"}`}>
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                              <p className="text-[10px] text-slate-400 mt-1">{new Date(message.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                            </div>
                          </div>
                        )) : <p className="text-sm text-slate-400">No conversation yet</p>}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-slate-200 p-3 flex gap-2">
                      <input
                        value={expanded === session._id ? messageDraft : ""}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        placeholder="Send a WhatsApp message..."
                        className="flex-1 h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                        onKeyDown={(event) => event.key === "Enter" && handleSend(session.phone)}
                      />
                      <button onClick={() => handleSend(session.phone)} disabled={!messageDraft.trim() || sendingPhone === session.phone} className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                        {sendingPhone === session.phone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send
                      </button>
                      <button onClick={() => handleReset(session.phone)} className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-semibold flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </VisivaPageShell>
  );
}
