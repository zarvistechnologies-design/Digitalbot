"use client";

import Sidebar from "@/components/Sidebar";
import { getAuthToken } from "@/lib/auth";
import {
  ChevronDown,
  ChevronUp,
  Download,
  Flame,
  Headphones,
  Mail,
  Menu,
  Phone,
  RefreshCw,
  Search,
  Snowflake,
  Sun,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://digital-api-46ss.onrender.com/api";

type LeadQuality = "hot" | "warm" | "cold";

type Lead = {
  _id: string;
  callId?: string;
  customerName?: string;
  phoneNumber?: string;
  alternatePhoneNumber?: string;
  email?: string;
  company?: string;
  callDate?: string;
  callDuration?: number;
  agentName?: string;
  summary?: string;
  isQualifiedLead?: boolean;
  leadScore?: number;
  leadQuality?: string;
  leadStatus?: string;
  leadPriority?: string;
  leadSource?: string;
  interests?: string[];
  productsInterested?: string[];
  painPoints?: string[];
  intents?: string[];
  budget?: string;
  timeline?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  followUpNotes?: string;
  nextAction?: string;
  createdAt?: string;
};

const qualityMeta = {
  hot: {
    label: "Hot leads",
    description: "High-intent opportunities requiring immediate follow-up",
    icon: Flame,
    iconClass: "bg-rose-100 text-rose-700",
    dotClass: "bg-rose-500",
    scoreClass: "bg-rose-50 text-rose-700",
    cardClass: "from-rose-500 to-orange-500 text-white",
    sectionClass: "border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50",
    rowClass: "hover:bg-rose-50/60",
  },
  warm: {
    label: "Warm leads",
    description: "Interested prospects that need continued engagement",
    icon: Sun,
    iconClass: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-500",
    scoreClass: "bg-amber-50 text-amber-700",
    cardClass: "from-amber-400 to-yellow-500 text-white",
    sectionClass: "border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50",
    rowClass: "hover:bg-amber-50/60",
  },
  cold: {
    label: "Cold leads",
    description: "Early-stage prospects for long-term nurturing",
    icon: Snowflake,
    iconClass: "bg-sky-100 text-sky-700",
    dotClass: "bg-sky-500",
    scoreClass: "bg-sky-50 text-sky-700",
    cardClass: "from-sky-500 to-cyan-500 text-white",
    sectionClass: "border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50",
    rowClass: "hover:bg-sky-50/60",
  },
} as const;

function getLeadQuality(lead: Lead): LeadQuality {
  const savedQuality = String(lead.leadQuality || "").toLowerCase();
  if (savedQuality === "hot" || savedQuality === "warm" || savedQuality === "cold") return savedQuality;
  const score = Number(lead.leadScore || 0);
  if (score > 80) return "hot";
  if (score > 50) return "warm";
  return "cold";
}

function formatDate(value?: string) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
}

function formatPhone(value?: string) {
  if (!value) return "No phone";
  const digits = value.replace(/\D/g, "");
  const nationalNumber = digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.length === 11 && digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  if (nationalNumber.length === 10) {
    return `+91 ${nationalNumber.slice(0, 3)}-${nationalNumber.slice(3, 6)}-${nationalNumber.slice(6)}`;
  }

  return value;
}

function formatExportDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function csvCell(value: unknown) {
  const joined = Array.isArray(value) ? value.filter(Boolean).join(" | ") : value;
  let text = String(joined ?? "").replace(/\r?\n/g, " ").trim();
  // Prevent spreadsheet formula execution for user/AI supplied text.
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

function csvPhone(value?: string) {
  if (!value) return csvCell("");
  // A leading tab keeps Excel from converting long phone numbers to numeric
  // notation or stripping the plus sign. It remains visually unobtrusive.
  return csvCell(`\t${formatPhone(value)}`);
}

function LeadRow({ lead }: { lead: Lead }) {
  const [expanded, setExpanded] = useState(false);
  const [recordingError, setRecordingError] = useState("");
  const quality = getLeadQuality(lead);
  const meta = qualityMeta[quality];
  const interest = lead.productsInterested?.[0] || lead.interests?.[0] || "Not specified";
  const need = lead.painPoints?.[0] || "Not specified";
  const token = getAuthToken();
  const recordingUrl = lead.callId
    ? `${API_BASE_URL}/calls/${encodeURIComponent(lead.callId)}/recording${token ? `?token=${encodeURIComponent(token)}` : ""}`
    : "";

  return (
    <article className="border-b border-slate-100 last:border-b-0">
      <div className={`grid gap-4 px-4 py-4 transition-colors sm:px-5 lg:grid-cols-[1.25fr_1fr_1fr_100px_110px] lg:items-center ${meta.rowClass}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full shadow-sm ${meta.dotClass}`} />
            <h3 className="truncate font-bold text-slate-900">{lead.customerName || "Unknown customer"}</h3>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${meta.scoreClass}`}>{quality}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 pl-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{formatPhone(lead.phoneNumber)}</span>
            {lead.alternatePhoneNumber && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />Alt: {formatPhone(lead.alternatePhoneNumber)}</span>}
            {lead.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{lead.email}</span>}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Interest</p>
          <p className="mt-1 truncate text-sm text-slate-700">{interest}</p>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Customer need</p>
          <p className="mt-1 truncate text-sm text-slate-700">{need}</p>
        </div>

        <div>
          <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black shadow-sm ${meta.scoreClass}`}>
            {Math.round(Number(lead.leadScore || 0))}/100
          </span>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-orange-700 lg:justify-end"
          aria-expanded={expanded}
        >
          {expanded ? "Hide details" : "View details"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-5 lg:pl-10">
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs font-semibold text-slate-500">Status</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{lead.leadStatus || "new"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Priority</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{lead.leadPriority || "medium"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Source</dt><dd className="mt-1 text-sm font-medium capitalize text-slate-800">{String(lead.leadSource || "call").replace(/_/g, " ")}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Created</dt><dd className="mt-1 text-sm font-medium text-slate-800">{formatDate(lead.callDate || lead.createdAt)}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Primary phone</dt><dd className="mt-1 text-sm text-slate-700">{formatPhone(lead.phoneNumber)}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Alternate / WhatsApp</dt><dd className="mt-1 text-sm text-slate-700">{lead.alternatePhoneNumber ? formatPhone(lead.alternatePhoneNumber) : "Not provided"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Company</dt><dd className="mt-1 text-sm text-slate-700">{lead.company || "Not specified"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Timeline</dt><dd className="mt-1 text-sm text-slate-700">{lead.timeline || "Not specified"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Budget</dt><dd className="mt-1 text-sm text-slate-700">{lead.budget || "Not specified"}</dd></div>
            <div><dt className="text-xs font-semibold text-slate-500">Next action</dt><dd className="mt-1 text-sm text-slate-700">{lead.nextAction || "Contact the lead"}</dd></div>
          </dl>

          {(lead.summary || lead.followUpNotes || lead.intents?.length) && (
            <div className="mt-5 grid gap-5 border-t border-slate-200 pt-5 lg:grid-cols-3">
              {lead.summary && <div><p className="text-xs font-semibold text-slate-500">Summary</p><p className="mt-1 text-sm leading-6 text-slate-700">{lead.summary}</p></div>}
              {lead.followUpNotes && <div><p className="text-xs font-semibold text-slate-500">Follow-up notes</p><p className="mt-1 text-sm leading-6 text-slate-700">{lead.followUpNotes}</p></div>}
              {lead.intents?.length ? <div><p className="text-xs font-semibold text-slate-500">Detected intents</p><p className="mt-1 text-sm leading-6 text-slate-700">{lead.intents.join(", ")}</p></div> : null}
            </div>
          )}

          <div className="mt-5 border-t border-slate-200 pt-5">
            <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Headphones className="h-4 w-4" />Call recording
            </p>
            {recordingUrl ? (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                <audio
                  controls
                  preload="metadata"
                  className="w-full"
                  src={recordingUrl}
                  onError={() => setRecordingError("Recording is unavailable or still processing.")}
                  onCanPlay={() => setRecordingError("")}
                >
                  Your browser does not support audio playback.
                </audio>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={recordingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-orange-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                  >
                    Open recording
                  </a>
                  {recordingError && <span className="text-sm font-medium text-amber-700">{recordingError}</span>}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No call recording is linked to this lead.</p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function QualifiedLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState<"all" | LeadQuality>("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/leads?limit=1000`, {
        headers: { Authorization: `Bearer ${getAuthToken()}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Unable to load leads (${response.status})`);
      const payload = await response.json();
      const savedLeads = Array.isArray(payload.data?.leads) ? payload.data.leads : [];
      setLeads(savedLeads.filter((lead: Lead) => String(lead.leadStatus || "").toLowerCase() !== "unqualified"));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    return leads
      .filter((lead) => qualityFilter === "all" || getLeadQuality(lead) === qualityFilter)
      .filter((lead) => !term || [lead.customerName, lead.phoneNumber, lead.alternatePhoneNumber, lead.email, lead.company, lead.productsInterested?.[0], lead.interests?.[0], lead.painPoints?.[0]].some((value) => String(value || "").toLowerCase().includes(term)))
      .sort((a, b) => Number(b.leadScore || 0) - Number(a.leadScore || 0));
  }, [leads, qualityFilter, search]);

  const groups = useMemo(() => ({
    hot: filteredLeads.filter((lead) => getLeadQuality(lead) === "hot"),
    warm: filteredLeads.filter((lead) => getLeadQuality(lead) === "warm"),
    cold: filteredLeads.filter((lead) => getLeadQuality(lead) === "cold"),
  }), [filteredLeads]);

  const totalByQuality = useMemo(() => ({
    hot: leads.filter((lead) => getLeadQuality(lead) === "hot").length,
    warm: leads.filter((lead) => getLeadQuality(lead) === "warm").length,
    cold: leads.filter((lead) => getLeadQuality(lead) === "cold").length,
  }), [leads]);
  const averageScore = useMemo(() => {
    if (!leads.length) return 0;
    return Math.round(leads.reduce((sum, lead) => sum + Number(lead.leadScore || 0), 0) / leads.length);
  }, [leads]);
  const followUpCount = useMemo(() => leads.filter((lead) => lead.followUpRequired).length, [leads]);

  const exportCsv = () => {
    if (!filteredLeads.length) return;
    const headings = [
      "Name", "Primary Phone", "Alternate / WhatsApp Number", "Email", "Company", "Quality", "Lead Score", "Interest",
      "Customer Need", "Summary", "Status", "Priority", "Source", "Budget", "Timeline",
      "Next Action", "Follow-up Required", "Follow-up Date", "Follow-up Notes", "Intents",
      "Agent", "Call Duration (seconds)", "Call Date", "Created At", "Call ID"
    ];
    const rows = filteredLeads.map((lead) => [
      csvCell(lead.customerName || "Unknown"),
      csvPhone(lead.phoneNumber),
      csvPhone(lead.alternatePhoneNumber),
      csvCell(lead.email),
      csvCell(lead.company),
      csvCell(getLeadQuality(lead)),
      csvCell(Number(lead.leadScore || 0)),
      csvCell(lead.productsInterested?.length ? lead.productsInterested : lead.interests),
      csvCell(lead.painPoints),
      csvCell(lead.summary),
      csvCell(lead.leadStatus || "new"),
      csvCell(lead.leadPriority || "medium"),
      csvCell(String(lead.leadSource || "call").replace(/_/g, " ")),
      csvCell(lead.budget),
      csvCell(lead.timeline),
      csvCell(lead.nextAction),
      csvCell(lead.followUpRequired ? "Yes" : "No"),
      csvCell(formatExportDate(lead.followUpDate)),
      csvCell(lead.followUpNotes),
      csvCell(lead.intents),
      csvCell(lead.agentName),
      csvCell(Number(lead.callDuration || 0)),
      csvCell(formatExportDate(lead.callDate)),
      csvCell(formatExportDate(lead.createdAt)),
      csvCell(lead.callId),
    ].join(","));
    const csv = `\uFEFF${[headings.map(csvCell).join(","), ...rows].join("\r\n")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qualified-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <button onClick={() => setSidebarOpen((value) => !value)} className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm md:hidden" aria-label="Toggle navigation"><Menu className="h-5 w-5" /></button>
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-40 w-60 transition-transform duration-300 md:translate-x-0`}><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="w-full p-4 pt-20 md:ml-60 md:pt-8 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative grid gap-6 bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500 p-6 text-white sm:p-8 lg:grid-cols-[1.4fr_auto] lg:items-end">
              <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/15 blur-2xl" />
              <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-200/20 blur-2xl" />
              <div className="relative">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white/90">
                  <Users className="h-4 w-4" />
                  Lead service dashboard
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Qualified Leads</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">
                  Track hot prospects, follow-up priorities, customer intent, and call recordings in one colorful sales pipeline.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full bg-white/15 px-3 py-1">AI scored</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">CSV export</span>
                  <span className="rounded-full bg-white/15 px-3 py-1">Call recording</span>
                </div>
              </div>
              <div className="relative flex gap-2">
                <button onClick={fetchLeads} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/25 disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button onClick={exportCsv} disabled={!filteredLeads.length} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">All leads</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{leads.length}</p>
                <p className="mt-1 text-xs text-slate-500">Total qualified records</p>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Average score</p>
                <p className="mt-2 text-3xl font-black text-emerald-700">{averageScore}/100</p>
                <p className="mt-1 text-xs text-emerald-700/75">Lead quality health</p>
              </div>
              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Follow-ups</p>
                <p className="mt-2 text-3xl font-black text-violet-700">{followUpCount}</p>
                <p className="mt-1 text-xs text-violet-700/75">Require next action</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-sky-700">Visible now</p>
                <p className="mt-2 text-3xl font-black text-sky-700">{filteredLeads.length}</p>
                <p className="mt-1 text-xs text-sky-700/75">After filters/search</p>
              </div>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-3">
            {(["hot", "warm", "cold"] as LeadQuality[]).map((quality) => {
              const meta = qualityMeta[quality];
              const Icon = meta.icon;
              return (
                <button
                  key={quality}
                  type="button"
                  onClick={() => setQualityFilter(quality)}
                  className={`rounded-2xl bg-gradient-to-br p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${meta.cardClass}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="rounded-xl bg-white/20 p-2"><Icon className="h-5 w-5" /></span>
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-black">{totalByQuality[quality]}</span>
                  </div>
                  <p className="mt-5 text-xl font-black">{meta.label}</p>
                  <p className="mt-1 text-sm leading-5 text-white/80">{meta.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, company or interest" className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100" /></div>
            <div className="flex flex-wrap gap-2">{(["all", "hot", "warm", "cold"] as const).map((quality) => <button key={quality} onClick={() => setQualityFilter(quality)} className={`rounded-lg border px-3.5 py-2 text-sm font-semibold capitalize ${qualityFilter === quality ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{quality === "all" ? "All leads" : quality}</button>)}</div>
          </div>

          {error && <div className="border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

          {loading ? (
            <div className="py-20 text-center"><div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-600" /><p className="mt-3 text-sm text-slate-500">Loading qualified leads...</p></div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-20 text-center"><Users className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 font-bold text-slate-900">No qualified leads found</h2><p className="mt-1 text-sm text-slate-500">Analyze calls or change the current search filters.</p></div>
          ) : (
            <div className="space-y-8">
              {(["hot", "warm", "cold"] as LeadQuality[]).map((quality) => {
                const group = groups[quality];
                if (!group.length) return null;
                const meta = qualityMeta[quality];
                const Icon = meta.icon;
                return (
                  <section key={quality}>
                    <div className={`mb-3 flex items-center justify-between rounded-2xl border px-4 py-3 ${meta.sectionClass}`}>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-xl p-2 shadow-sm ${meta.iconClass}`}><Icon className="h-4 w-4" /></span>
                        <div>
                          <h2 className="font-black text-slate-900">{meta.label}</h2>
                          <p className="text-xs text-slate-600">{meta.description}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-700 shadow-sm">{group.length}</span>
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">{group.map((lead) => <LeadRow key={lead._id} lead={lead} />)}</div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
