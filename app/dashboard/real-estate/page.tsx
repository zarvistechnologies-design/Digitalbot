"use client";

import { realEstateAPI, type RealEstateLead, type RealEstateProperty } from "@/lib/api";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Flame,
  GitBranch,
  Home,
  IndianRupee,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Sparkles,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import RealEstatePageShell, { apiErrorMessage, formatCurrency, pretty } from "./_components/RealEstatePageShell";

interface Overview {
  totalLeads: number;
  hotLeads: number;
  unassignedLeads: number;
  overdueFollowUps: number;
  activeProperties: number;
  availableUnits: number;
  visitsToday: number;
  wonDeals: number;
  conversionRate: number;
  byStage: Record<string, { count: number; value: number }>;
  upcomingVisits: Array<{
    _id: string;
    customerName: string;
    customerPhone: string;
    visitAt: string;
    status: string;
    assignedTo?: string;
    propertyId?: Pick<RealEstateProperty, "projectName" | "title" | "locality" | "city">;
  }>;
  recentLeads: RealEstateLead[];
}

const EMPTY_OVERVIEW: Overview = {
  totalLeads: 0,
  hotLeads: 0,
  unassignedLeads: 0,
  overdueFollowUps: 0,
  activeProperties: 0,
  availableUnits: 0,
  visitsToday: 0,
  wonDeals: 0,
  conversionRate: 0,
  byStage: {},
  upcomingVisits: [],
  recentLeads: [],
};

const pipelineStages = [
  "new",
  "contacted",
  "qualified",
  "property_matched",
  "site_visit_scheduled",
  "site_visit_completed",
  "negotiation",
  "booking",
  "won",
];

function StatCard({ label, value, note, icon: Icon, tone }: { label: string; value: string | number; note: string; icon: LucideIcon; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{note}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${tone}`}><Icon className="h-5 w-5" /></span>
      </div>
    </div>
  );
}

function formatVisitDate(value: string) {
  return new Date(value).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export default function RealEstateDashboardPage() {
  const [overview, setOverview] = useState<Overview>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await realEstateAPI.getOverview();
      setOverview(response.data.overview || EMPTY_OVERVIEW);
    } catch (loadError) {
      setError(apiErrorMessage(loadError, "Property command center could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  const pipelineTotal = useMemo(
    () => pipelineStages.reduce((sum, stage) => sum + Number(overview.byStage[stage]?.count || 0), 0),
    [overview.byStage],
  );

  return (
    <RealEstatePageShell
      eyebrow="Real Estate CRM"
      title="Property Command Center"
      description="Turn every analyzed inquiry into a matched property, confirmed site visit, and measurable deal."
      actions={(
        <>
          <button onClick={() => void loadOverview()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Link href="/dashboard/real-estate/properties?create=1" className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">
            <Plus className="h-4 w-4" /> Add property
          </Link>
        </>
      )}
    >
      {error && <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800"><AlertCircle className="h-4 w-4" />{error}</div>}
      {loading && !overview.totalLeads ? (
        <div className="flex min-h-[480px] items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>
      ) : (
        <div className="space-y-7">
          <section className="relative overflow-hidden rounded-3xl bg-emerald-950 p-6 text-white shadow-xl sm:p-8">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-emerald-600/25 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900 px-3 py-1 text-xs font-bold text-emerald-100"><Sparkles className="h-3.5 w-3.5" /> Live sales intelligence</span>
                <h2 className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">Your next booking is already somewhere in the pipeline.</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/75">Focus the team on hot, unassigned, and visit-ready buyers while the existing AI analyzer handles qualification.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/leads" className="rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"><Flame className="h-5 w-5 text-amber-300" /><p className="mt-3 text-sm font-bold">Analyze calls</p><p className="mt-1 text-xs text-emerald-100/60">Reuse Lead Analyzer</p></Link>
                <Link href="/dashboard/real-estate/pipeline" className="rounded-2xl border border-white/15 bg-white/10 p-4 transition hover:bg-white/15"><GitBranch className="h-5 w-5 text-sky-300" /><p className="mt-3 text-sm font-bold">Open pipeline</p><p className="mt-1 text-xs text-emerald-100/60">Move deals forward</p></Link>
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total leads" value={overview.totalLeads} note="Analyzed and saved" icon={Users} tone="bg-sky-50 text-sky-700" />
            <StatCard label="Hot buyers" value={overview.hotLeads} note="High-priority conversations" icon={Flame} tone="bg-orange-50 text-orange-700" />
            <StatCard label="Unassigned" value={overview.unassignedLeads} note="Needs an executive" icon={UserRoundCheck} tone="bg-violet-50 text-violet-700" />
            <StatCard label="Follow-ups overdue" value={overview.overdueFollowUps} note="Needs attention today" icon={Clock3} tone="bg-rose-50 text-rose-700" />
            <StatCard label="Active properties" value={overview.activeProperties} note="Projects and listings" icon={Building2} tone="bg-emerald-50 text-emerald-700" />
            <StatCard label="Available units" value={overview.availableUnits} note="Sellable inventory" icon={Home} tone="bg-cyan-50 text-cyan-700" />
            <StatCard label="Visits today" value={overview.visitsToday} note="Requested or confirmed" icon={CalendarCheck2} tone="bg-amber-50 text-amber-700" />
            <StatCard label="Conversion" value={`${overview.conversionRate}%`} note={`${overview.wonDeals} won deals`} icon={CheckCircle2} tone="bg-teal-50 text-teal-700" />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Conversion funnel</p><h2 className="mt-1 text-xl font-black text-slate-950">Lead movement</h2></div>
              <Link href="/dashboard/real-estate/pipeline" className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-900">Manage pipeline <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-9">
              {pipelineStages.map((stage) => {
                const count = Number(overview.byStage[stage]?.count || 0);
                const percentage = pipelineTotal ? Math.max(8, Math.round((count / pipelineTotal) * 100)) : 8;
                return (
                  <div key={stage} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="min-h-8 text-[10px] font-black uppercase leading-4 tracking-wide text-slate-500">{pretty(stage)}</p>
                    <p className="mt-2 text-2xl font-black text-slate-950">{count}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-xs font-black uppercase tracking-wide text-slate-500">Fresh demand</p><h2 className="mt-1 text-lg font-black">Recent property leads</h2></div><Link href="/dashboard/qualified-leads" className="text-sm font-bold text-emerald-700">View all</Link></div>
              <div className="divide-y divide-slate-100">
                {overview.recentLeads.length ? overview.recentLeads.map((lead) => {
                  const details = lead.customFields?.realEstate;
                  return <div key={lead._id} className="flex items-center gap-4 px-5 py-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 font-black text-emerald-800">{(lead.customerName || "U")[0]}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-black text-slate-900">{lead.customerName || "Unknown buyer"}</p><span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-black uppercase text-orange-700">{lead.leadQuality || "new"}</span></div><p className="mt-1 truncate text-xs text-slate-500">{details?.configurations?.join(", ") || details?.propertyTypes?.join(", ") || "Requirement not captured"} · {details?.preferredLocations?.join(", ") || "Location open"}</p></div><div className="text-right"><p className="text-sm font-black text-slate-900">{details?.budgetMax ? formatCurrency(details.budgetMax) : lead.budget || "—"}</p><p className="text-xs text-slate-400">Score {lead.leadScore || 0}</p></div></div>;
                }) : <div className="px-5 py-12 text-center text-sm text-slate-500">Analyze calls to populate buyer demand.</div>}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-xs font-black uppercase tracking-wide text-slate-500">Field activity</p><h2 className="mt-1 text-lg font-black">Upcoming site visits</h2></div><Link href="/dashboard/real-estate/site-visits" className="text-sm font-bold text-emerald-700">Open calendar</Link></div>
              <div className="divide-y divide-slate-100">
                {overview.upcomingVisits.length ? overview.upcomingVisits.map((visit) => <div key={visit._id} className="flex gap-4 px-5 py-4"><div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-950 text-white"><span className="text-[9px] font-bold uppercase">{new Date(visit.visitAt).toLocaleString("en-IN", { month: "short" })}</span><span className="text-base font-black leading-none">{new Date(visit.visitAt).getDate()}</span></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-black">{visit.customerName}</p><span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">{pretty(visit.status)}</span></div><p className="mt-1 truncate text-xs text-slate-500"><MapPin className="mr-1 inline h-3 w-3" />{visit.propertyId?.projectName || "Property"} · {visit.propertyId?.locality || visit.propertyId?.city || "Location"}</p><p className="mt-1 text-xs font-bold text-slate-700">{formatVisitDate(visit.visitAt)}{visit.assignedTo ? ` · ${visit.assignedTo}` : ""}</p></div></div>) : <div className="px-5 py-12 text-center text-sm text-slate-500">No upcoming site visits. Schedule one from a qualified lead.</div>}
              </div>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/dashboard/real-estate/properties", icon: Building2, title: "Manage inventory", text: "Projects, pricing and availability" },
              { href: "/dashboard/real-estate/site-visits", icon: CalendarCheck2, title: "Schedule a visit", text: "Connect buyers with properties" },
              { href: "/dashboard/campaigns", icon: IndianRupee, title: "Launch campaign", text: "Reactivate and qualify audiences" },
              { href: "/dashboard/agent-knowledge", icon: Sparkles, title: "Update AI knowledge", text: "Pricing, amenities and FAQs" },
            ].map(({ href, icon: Icon, title, text }) => <Link key={href} href={href} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"><Icon className="h-5 w-5 text-emerald-700" /><p className="mt-4 font-black text-slate-950 group-hover:text-emerald-800">{title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></Link>)}
          </section>
        </div>
      )}
    </RealEstatePageShell>
  );
}
