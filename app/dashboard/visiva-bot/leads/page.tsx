"use client";

import { useWebSocket } from "@/components/hooks/use-websocket";
import { visivaBotAPI } from "@/lib/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Search,
  Send,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
}

const statusClass: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  contacted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  appointment_scheduled: "bg-violet-50 text-violet-700 border-violet-200",
  not_interested: "bg-slate-100 text-slate-600 border-slate-200",
  escalated: "bg-red-50 text-red-700 border-red-200",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

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
  const [messageDraft, setMessageDraft] = useState("");
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
    if (!messageDraft.trim()) return;
    setSendingPhone(phone);
    try {
      await visivaBotAPI.sendMessage({ phone, message: messageDraft.trim() });
      setMessageDraft("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingPhone(null);
    }
  };

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
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            ["Total", stats.total],
            ["New", stats.new],
            ["Contacted", stats.contacted],
            ["Appointments", stats.appointments],
            ["High Intent", stats.highIntent],
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
            placeholder="Search leads..."
            className="w-full h-10 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
          />
        </div>
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
          <option value="all">All status</option>
          {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
        <select value={filterInterest} onChange={(event) => setFilterInterest(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
          <option value="all">All interest</option>
          {Object.entries(interestLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Leads</h2>
            <p className="text-xs text-slate-400">{total} total</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin mx-auto mb-2" />
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="py-20 text-center text-slate-400">No leads found</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <div key={lead._id} className="p-4 space-y-3 hover:bg-slate-50/70">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:items-start">
                  <div className="lg:col-span-3">
                    <p className="font-semibold text-slate-900">{lead.name || "Unnamed prospect"}</p>
                    <p className="text-sm text-slate-500">{formatPhone(lead.phone)}</p>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(lead.updatedAt)}</p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${statusClass[lead.status] || statusClass.new}`}>
                        {statusLabels[lead.status] || lead.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md border text-[11px] font-semibold ${interestClass(lead.interestLevel)}`}>
                        {interestLabels[lead.interestLevel] || lead.interestLevel}
                      </span>
                      {lead.modality && <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold">{modalityLabels[lead.modality] || lead.modality}</span>}
                    </div>
                    <p className="text-sm text-slate-700">{lead.programInterest || "Program not captured yet"}</p>
                    {lead.conversationSummary && <p className="text-xs text-slate-500 mt-1 line-clamp-2">{lead.conversationSummary}</p>}
                  </div>

                  <div className="lg:col-span-3 text-sm text-slate-600 space-y-1">
                    {lead.desiredStartDate && <p><span className="text-slate-400">Start:</span> {lead.desiredStartDate}</p>}
                    {lead.appointmentAvailability && <p><span className="text-slate-400">Available:</span> {lead.appointmentAvailability}</p>}
                    {lead.currentStatus && <p><span className="text-slate-400">Status:</span> {lead.currentStatus}</p>}
                  </div>

                  <div className="lg:col-span-2 flex lg:justify-end gap-2">
                    <button
                      onClick={() => handleContacted(lead._id)}
                      disabled={updatingId === lead._id || lead.adminContacted}
                      className="h-9 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {updatingId === lead._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {lead.adminContacted ? "Done" : "Contacted"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-2">
                  <input
                    value={sendingPhone === lead.phone ? messageDraft : ""}
                    onFocus={() => setSendingPhone(lead.phone)}
                    onChange={(event) => setMessageDraft(event.target.value)}
                    placeholder="Send WhatsApp follow-up..."
                    className="h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                    onKeyDown={(event) => event.key === "Enter" && handleSend(lead.phone)}
                  />
                  <select
                    value={lead.status}
                    onChange={(event) => handleUpdate(lead._id, { status: event.target.value })}
                    className="h-10 px-3 bg-white rounded-lg border border-slate-200 text-sm"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                  </select>
                  <button onClick={() => handleSend(lead.phone)} disabled={sendingPhone === lead.phone && !messageDraft.trim()} className="h-10 px-4 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                    {sendingPhone === lead.phone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </div>
              </div>
            ))}
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
