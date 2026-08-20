"use client";

import { useWebSocket } from "@/components/hooks/use-websocket";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "@/components/dashboard/LazyRecharts";
import { visivaBotAPI } from "@/lib/api";
import {
  Activity,
  BarChart3,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Target,
  User,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  stateBreakdown?: Record<string, number>;
  interestBreakdown?: Record<string, number>;
  dailyStats?: { date: string; sessions: number; leads: number; appointments: number }[];
}

function cleanMessageContent(content: string) {
  return String(content || "")
    .replace(/\n?\[Archivo recibido:\s*__visiva_media_id__:[^\]]+\]/g, "")
    .replace(/^\[(image|video|document|audio)\]\s*$/i, "")
    .trim();
}

function messageMedia(content: string, mediaUrls: VisivaMedia[] = []) {
  return mediaUrls.filter((media) => media.marker && String(content || "").includes(media.marker));
}

function MediaPreview({ media }: { media: VisivaMedia }) {
  const url = visivaBotAPI.getMediaUrl(media.marker);
  const label = media.type || "media";
  const mimeType = media.mimeType || "";

  if (media.type === "image" || mimeType.startsWith("image/")) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
        <img
          src={url}
          alt="WhatsApp image"
          className="max-h-64 w-auto max-w-full rounded-lg border border-slate-200 object-contain bg-white group-hover:opacity-90 transition-opacity"
        />
      </a>
    );
  }

  if (media.type === "video" || mimeType.startsWith("video/")) {
    return <video src={url} controls className="max-h-64 max-w-full rounded-lg border border-slate-200 bg-black" />;
  }

  if (media.type === "audio" || mimeType.startsWith("audio/")) {
    return <audio src={url} controls className="w-full max-w-sm" />;
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
      Open {label}
    </a>
  );
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

  const conversionRate = analytics?.totalLeads ? Math.round((analytics.appointments / analytics.totalLeads) * 100) : 0;
  const highIntentRate = analytics?.totalLeads ? Math.round((analytics.highIntentLeads / analytics.totalLeads) * 100) : 0;
  const escalationRate = analytics?.totalLeads ? Math.round((analytics.escalated / analytics.totalLeads) * 100) : 0;

  const sessionSignals = useMemo(() => {
    const totalMessages = sessions.reduce((sum, session) => sum + (session.conversationHistory?.length || 0), 0);
    return {
      avgMessages: sessions.length ? Math.round(totalMessages / sessions.length) : 0,
      needsFollowUp: sessions.filter((session) => ["NEW", "QUALIFYING", "APPOINTMENT_PENDING"].includes(session.state)).length,
      withProgram: sessions.filter((session) => Boolean(session.programInterest)).length,
      withAvailability: sessions.filter((session) => Boolean(session.appointmentAvailability)).length,
      adminTouched: sessions.filter((session) => session.adminContacted).length,
    };
  }, [sessions]);

  const stateRows = useMemo(() => {
    const breakdown = analytics?.stateBreakdown || {};
    return Object.entries(breakdown)
      .map(([key, value]) => ({
        key,
        label: stateLabels[key] || key,
        value,
        percentage: analytics?.totalSessions ? Math.round((value / analytics.totalSessions) * 100) : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [analytics]);

  const interestRows = useMemo(() => {
    const breakdown = analytics?.interestBreakdown || {};
    return Object.entries(breakdown).map(([key, value]) => ({
      name: interestLabels[key] || key,
      value,
    }));
  }, [analytics]);

  return (
    <VisivaPageShell
      title="Bot Sessions"
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
        <>
          <section className="grid grid-cols-2 xl:grid-cols-6 gap-3">
            {[
              { label: "Sessions", value: analytics.totalSessions, icon: MessageSquare, detail: `${sessionSignals.avgMessages} avg msgs`, color: "bg-sky-50 text-sky-700" },
              { label: "Active", value: analytics.activeSessions, icon: Activity, detail: `${sessionSignals.needsFollowUp} need follow-up`, color: "bg-emerald-50 text-emerald-700" },
              { label: "Leads", value: analytics.totalLeads, icon: Users, detail: `${filtered.length} visible`, color: "bg-slate-100 text-slate-700" },
              { label: "High Intent", value: analytics.highIntentLeads, icon: Target, detail: `${highIntentRate}% of leads`, color: "bg-amber-50 text-amber-700" },
              { label: "Appointments", value: analytics.appointments, icon: CalendarCheck, detail: `${conversionRate}% conversion`, color: "bg-violet-50 text-violet-700" },
              { label: "Escalated", value: analytics.escalated, icon: UserCheck, detail: `${escalationRate}% of leads`, color: "bg-red-50 text-red-700" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{item.value}</p>
                <p className="text-xs text-slate-400 mt-1">{item.detail}</p>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  Session Momentum
                </h2>
                <span className="text-xs font-medium text-slate-400">{dateRange} day view</span>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={analytics.dailyStats || []}>
                  <defs>
                    <linearGradient id="visivaSessionArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="visivaLeadArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="sessions" stroke="#0284c7" fill="url(#visivaSessionArea)" strokeWidth={2} name="Sessions" />
                  <Area type="monotone" dataKey="leads" stroke="#059669" fill="url(#visivaLeadArea)" strokeWidth={2} name="Leads" />
                  <Area type="monotone" dataKey="appointments" stroke="#7c3aed" fill="transparent" strokeWidth={2} name="Appointments" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-amber-600" />
                State Funnel
              </h2>
              <div className="space-y-3">
                {stateRows.length === 0 ? (
                  <div className="h-[230px] flex items-center justify-center text-sm text-slate-400">No state data yet</div>
                ) : stateRows.map((row) => (
                  <div key={row.key}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${stateClass(row.key)}`}>{row.label}</span>
                      <span className="text-xs font-semibold text-slate-500">{row.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="bg-slate-950 rounded-xl p-5 text-white">
              <h2 className="font-semibold mb-4">Session Signals</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Follow-up", sessionSignals.needsFollowUp],
                  ["Program", sessionSignals.withProgram],
                  ["Availability", sessionSignals.withAvailability],
                  ["Admin touched", sessionSignals.adminTouched],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-white/10 border border-white/10 p-3">
                    <p className="text-[11px] text-slate-400">{label}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-sky-600" />
                Interest Breakdown
              </h2>
              {interestRows.length === 0 ? (
                <div className="h-[210px] flex items-center justify-center text-sm text-slate-400">No interest data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={210}>
                  <BarChart data={interestRows} layout="vertical" margin={{ left: 18 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={78} />
                    <Tooltip contentStyle={{ backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px" }} />
                    <Bar dataKey="value" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {session.mediaUrls.map((media) => (
                            <div key={media.mediaId} className="rounded-lg bg-slate-50 border border-slate-200 p-2">
                              <MediaPreview media={media} />
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-2">{media.type || "media"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><User className="w-3 h-3" /> Conversation</p>
                      <div className="max-h-72 overflow-y-auto bg-white rounded-lg border border-slate-200 p-3 space-y-2">
                        {session.conversationHistory?.length ? session.conversationHistory.map((message, index) => {
                          const cleanContent = cleanMessageContent(message.content);
                          const attachedMedia = messageMedia(message.content, session.mediaUrls);
                          return (
                            <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm border ${message.role === "user" ? "bg-sky-50 border-sky-100 text-slate-800" : "bg-emerald-50 border-emerald-100 text-slate-800"}`}>
                                {attachedMedia.length > 0 && (
                                  <div className="space-y-2 mb-2">
                                    {attachedMedia.map((media) => <MediaPreview key={media.mediaId} media={media} />)}
                                  </div>
                                )}
                                {cleanContent && <p className="whitespace-pre-wrap break-words">{cleanContent}</p>}
                                <p className="text-[10px] text-slate-400 mt-1">{new Date(message.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                              </div>
                            </div>
                          );
                        }) : <p className="text-sm text-slate-400">No conversation yet</p>}
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
