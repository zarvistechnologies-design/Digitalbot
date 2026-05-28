"use client";

import { useWebSocket } from "@/components/hooks/use-websocket";
import { visivaBotAPI } from "@/lib/api";
import {
  AlertTriangle,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
  Send,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VisivaPageShell } from "../_components/VisivaPageShell";
import { formatPhone, interestClass, interestLabels, modalityLabels, statusLabels, timeAgo } from "../_components/visiva-utils";

interface VisivaLead {
  _id: string;
  phone: string;
  name: string;
  programInterest: string;
  currentStatus: string;
  modality: string;
  desiredStartDate: string;
  appointmentAvailability: string;
  interestLevel: string;
  status: string;
  lastMessage: string;
  conversationSummary: string;
  adminContacted: boolean;
  assignedTo: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  appointments: number;
  highIntent: number;
  byInterest?: Record<string, number>;
  byModality?: Record<string, number>;
  byProgram?: Record<string, number>;
}

const statusClass: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  contacted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  appointment_scheduled: "bg-violet-50 text-violet-700 border-violet-200",
  not_interested: "bg-slate-100 text-slate-600 border-slate-200",
  escalated: "bg-red-50 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

function leadScore(lead: VisivaLead) {
  let score = 18;
  if (lead.interestLevel === "alto") score += 30;
  if (lead.interestLevel === "medio") score += 18;
  if (lead.programInterest) score += 14;
  if (lead.modality && lead.modality !== "unknown") score += 8;
  if (lead.appointmentAvailability) score += 18;
  if (lead.desiredStartDate) score += 8;
  if (lead.adminContacted) score += 8;
  return Math.min(score, 100);
}

export default function VisivaLeadsPage() {
  const [leads, setLeads] = useState<VisivaLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterInterest, setFilterInterest] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [messageDrafts, setMessageDrafts] = useState<Record<string, string>>({});
  const [sendingPhone, setSendingPhone] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await visivaBotAPI.getLeads({
        page,
        limit: 30,
        search: search || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        interestLevel: filterInterest !== "all" ? filterInterest : undefined,
      });
      setLeads(res.data?.data || []);
      setStats(res.data?.stats || null);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch Visiva leads:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filterInterest, filterStatus, page, search]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterInterest]);

  useWebSocket({
    onMessage: useCallback((data: { type?: string }) => {
      if (data.type === "visiva_lead_update" || data.type === "visiva_session_update") fetchLeads(true);
    }, [fetchLeads]),
  });

  const handleUpdate = async (id: string, data: { status?: string; interestLevel?: string }) => {
    setUpdatingId(id);
    try {
      const res = await visivaBotAPI.updateLead(id, data);
      setLeads((prev) => prev.map((lead) => lead._id === id ? res.data.data : lead));
    } catch (err) {
      console.error("Failed to update lead:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleContacted = async (id: string) => {
    setUpdatingId(id);
    try {
      const res = await visivaBotAPI.markLeadContacted(id);
      setLeads((prev) => prev.map((lead) => lead._id === id ? res.data.data : lead));
      fetchLeads(true);
    } catch (err) {
      console.error("Failed to mark contacted:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSend = async (phone: string) => {
    const message = (messageDrafts[phone] || "").trim();
    if (!message) return;
    setSendingPhone(phone);
    try {
      await visivaBotAPI.sendMessage({ phone, message });
      setMessageDrafts((prev) => ({ ...prev, [phone]: "" }));
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingPhone(null);
    }
  };

  const leadRates = useMemo(() => {
    const count = stats?.total || 0;
    return {
      contacted: count ? Math.round((stats!.contacted / count) * 100) : 0,
      appointments: count ? Math.round((stats!.appointments / count) * 100) : 0,
      highIntent: count ? Math.round((stats!.highIntent / count) * 100) : 0,
      open: count ? Math.round((stats!.new / count) * 100) : 0,
    };
  }, [stats]);

  const topPrograms = useMemo(() => {
    return Object.entries(stats?.byProgram || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [stats]);

  const interestRows = useMemo(() => Object.entries(stats?.byInterest || {}).sort((a, b) => b[1] - a[1]), [stats]);
  const modalityRows = useMemo(() => Object.entries(stats?.byModality || {}).sort((a, b) => b[1] - a[1]), [stats]);
  const maxProgramCount = Math.max(...topPrograms.map(([, count]) => count), 1);
  const maxModalityCount = Math.max(...modalityRows.map(([, count]) => count), 1);

  const statusRows = useMemo(() => {
    const rows: Record<string, number> = {};
    leads.forEach((lead) => {
      const key = lead.status || "new";
      rows[key] = (rows[key] || 0) + 1;
    });
    return Object.entries(rows).sort((a, b) => b[1] - a[1]);
  }, [leads]);

  const priorityLeads = useMemo(() => {
    return [...leads]
      .sort((a, b) => leadScore(b) - leadScore(a))
      .slice(0, 4);
  }, [leads]);

  return (
    <VisivaPageShell
      title="Visiva Bot Leads"
      description="Admissions prospects captured by Valeria"
      icon={<Users className="w-5 h-5 text-white" />}
      actions={
        <button onClick={() => fetchLeads()} className="h-10 px-4 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      }
    >
      {stats && (
        <>
          <section className="grid grid-cols-2 xl:grid-cols-5 gap-3">
            {[
              { label: "Total Leads", value: stats.total, detail: `${total} matching`, icon: Users, color: "bg-slate-100 text-slate-700" },
              { label: "New", value: stats.new, detail: `${leadRates.open}% open`, icon: Clock, color: "bg-sky-50 text-sky-700" },
              { label: "Contacted", value: stats.contacted, detail: `${leadRates.contacted}% touched`, icon: UserCheck, color: "bg-emerald-50 text-emerald-700" },
              { label: "Appointments", value: stats.appointments, detail: `${leadRates.appointments}% booked`, icon: CalendarCheck, color: "bg-violet-50 text-violet-700" },
              { label: "High Intent", value: stats.highIntent, detail: `${leadRates.highIntent}% warm`, icon: Target, color: "bg-amber-50 text-amber-700" },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-slate-300 transition-colors">
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
            <div className="xl:col-span-2 bg-slate-950 rounded-xl p-5 text-white">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <h2 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-300" />
                    Admissions Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Lead readiness from WhatsApp conversations</p>
                </div>
                <span className="w-fit px-2.5 py-1 rounded-md bg-emerald-400/10 border border-emerald-300/20 text-[11px] font-semibold text-emerald-200">
                  {stats.appointments} appointment ready
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { label: "Contact rate", value: leadRates.contacted, icon: Phone, color: "bg-emerald-400" },
                  { label: "Booking rate", value: leadRates.appointments, icon: CalendarCheck, color: "bg-sky-400" },
                  { label: "High intent rate", value: leadRates.highIntent, icon: Target, color: "bg-amber-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-white/10 border border-white/10 p-4">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs text-slate-400">{item.label}</span>
                      <item.icon className="w-4 h-4 text-slate-200" />
                    </div>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-bold">{item.value}</span>
                      <span className="text-sm text-slate-400 mb-1">%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden mt-3">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Priority Queue
              </h2>
              <div className="space-y-3">
                {priorityLeads.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">No priority leads yet</div>
                ) : priorityLeads.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{lead.name || formatPhone(lead.phone)}</p>
                      <p className="text-xs text-slate-400 truncate">{lead.programInterest || "Program pending"}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-700 shrink-0">{leadScore(lead)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4 text-sky-600" />
                Top Programs
              </h2>
              <div className="space-y-3">
                {topPrograms.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">Program interest has not been captured yet</div>
                ) : topPrograms.map(([program, count]) => (
                  <div key={program}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-sm font-medium text-slate-700 truncate">{program}</span>
                      <span className="text-xs font-semibold text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${Math.max(8, Math.round((count / maxProgramCount) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Modality Mix
              </h2>
              <div className="space-y-3">
                {modalityRows.length === 0 ? (
                  <div className="py-8 text-center text-sm text-slate-400">No modality captured yet</div>
                ) : modalityRows.map(([modality, count]) => (
                  <div key={modality}>
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-sm font-medium text-slate-700">{modalityLabels[modality] || modality}</span>
                      <span className="text-xs font-semibold text-slate-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(8, Math.round((count / maxModalityCount) * 100))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, phone, program, appointment window..."
              className="w-full h-11 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            />
          </div>
          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="h-11 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
            <option value="all">All status</option>
            {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
          <select value={filterInterest} onChange={(event) => setFilterInterest(event.target.value)} className="h-11 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
            <option value="all">All interest</option>
            {Object.entries(interestLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${filterStatus === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"}`}
          >
            All status
          </button>
          {statusRows.map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${filterStatus === status ? "bg-emerald-600 text-white border-emerald-600" : statusClass[status] || statusClass.new}`}
            >
              {statusLabels[status] || status} - {count}
            </button>
          ))}
        </div>

        {interestRows.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterInterest("all")}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${filterInterest === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200"}`}
            >
              All interest
            </button>
            {interestRows.map(([interest, count]) => (
              <button
                key={interest}
                onClick={() => setFilterInterest(interest)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${filterInterest === interest ? "bg-emerald-600 text-white border-emerald-600" : interestClass(interest)}`}
              >
                {interestLabels[interest] || interest} - {count}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">Lead Workspace</h2>
            <p className="text-xs text-slate-400">{leads.length} shown from {total} matching leads</p>
          </div>
          <span className="w-fit px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
            Page {page} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="w-9 h-9 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No leads found</p>
            <p className="text-xs text-slate-400 mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const score = leadScore(lead);
              const draft = messageDrafts[lead.phone] || "";
              const isSending = sendingPhone === lead.phone;
              return (
                <div key={lead._id} className="p-5 hover:bg-slate-50/70 transition-colors">
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 xl:items-start">
                    <div className="xl:col-span-3 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-sm font-bold shrink-0">
                        {(lead.name || lead.phone || "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{lead.name || "Unnamed prospect"}</p>
                        <p className="text-sm text-slate-500">{formatPhone(lead.phone)}</p>
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(lead.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="xl:col-span-4">
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${statusClass[lead.status] || statusClass.new}`}>
                          {statusLabels[lead.status] || lead.status || "New"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${interestClass(lead.interestLevel)}`}>
                          {interestLabels[lead.interestLevel] || lead.interestLevel || "Unknown"}
                        </span>
                        {lead.modality && <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">{modalityLabels[lead.modality] || lead.modality}</span>}
                        {lead.adminContacted && <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">Admin contacted</span>}
                      </div>
                      <p className="text-sm font-medium text-slate-800">{lead.programInterest || "Program not captured yet"}</p>
                      {lead.conversationSummary ? (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lead.conversationSummary}</p>
                      ) : (
                        <p className="text-xs text-slate-400 mt-1">Waiting for Valeria to capture more context.</p>
                      )}
                    </div>

                    <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-2 text-sm">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Start</p>
                        <p className="text-slate-700 truncate">{lead.desiredStartDate || "Pending"}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Availability</p>
                        <p className="text-slate-700 truncate">{lead.appointmentAvailability || "Pending"}</p>
                      </div>
                      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Current</p>
                        <p className="text-slate-700 truncate">{lead.currentStatus || "Pending"}</p>
                      </div>
                    </div>

                    <div className="xl:col-span-2 flex xl:flex-col items-center xl:items-stretch justify-between gap-3">
                      <div className="flex items-center gap-3 xl:justify-between">
                        <div
                          className="w-14 h-14 rounded-full p-1 shrink-0"
                          style={{ background: `conic-gradient(#059669 ${score * 3.6}deg, #e2e8f0 0deg)` }}
                        >
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-sm font-bold text-slate-900">{score}</span>
                          </div>
                        </div>
                        <div className="xl:hidden">
                          <p className="text-xs font-semibold text-slate-500">Lead score</p>
                          <p className="text-xs text-slate-400">Readiness</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleContacted(lead._id)}
                        disabled={updatingId === lead._id || lead.adminContacted}
                        className="h-9 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {updatingId === lead._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                        {lead.adminContacted ? "Done" : "Contacted"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1fr_180px_110px] gap-2 mt-4">
                    <input
                      value={draft}
                      onChange={(event) => setMessageDrafts((prev) => ({ ...prev, [lead.phone]: event.target.value }))}
                      placeholder="Send WhatsApp follow-up..."
                      className="h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                      onKeyDown={(event) => event.key === "Enter" && handleSend(lead.phone)}
                    />
                    <select
                      value={lead.status || "new"}
                      onChange={(event) => handleUpdate(lead._id, { status: event.target.value })}
                      className="h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm"
                    >
                      {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                    </select>
                    <button onClick={() => handleSend(lead.phone)} disabled={!draft.trim() || isSending} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1 disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1 disabled:opacity-40">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>
    </VisivaPageShell>
  );
}
