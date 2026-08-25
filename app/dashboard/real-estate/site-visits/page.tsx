"use client";

import {
  realEstateAPI,
  type RealEstateLead,
  type RealEstateProperty,
  type RealEstateSiteVisit,
} from "@/lib/api";
import {
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import RealEstatePageShell, { apiErrorMessage, pretty } from "../_components/RealEstatePageShell";

interface VisitForm {
  leadId: string;
  propertyId: string;
  visitAt: string;
  durationMinutes: string;
  assignedTo: string;
  meetingPoint: string;
  notes: string;
}

const emptyForm: VisitForm = {
  leadId: "",
  propertyId: "",
  visitAt: "",
  durationMinutes: "60",
  assignedTo: "",
  meetingPoint: "",
  notes: "",
};

const statusStyles: Record<string, string> = {
  requested: "border-amber-200 bg-amber-50 text-amber-800",
  confirmed: "border-sky-200 bg-sky-50 text-sky-800",
  rescheduled: "border-violet-200 bg-violet-50 text-violet-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  no_show: "border-orange-200 bg-orange-50 text-orange-800",
  cancelled: "border-slate-200 bg-slate-100 text-slate-600",
};

function leadFrom(visit: RealEstateSiteVisit) {
  return typeof visit.leadId === "string" ? null : visit.leadId;
}

function propertyFrom(visit: RealEstateSiteVisit) {
  return typeof visit.propertyId === "string" ? null : visit.propertyId;
}

function formatVisitDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not set";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function RealEstateSiteVisitsPage() {
  const [visits, setVisits] = useState<RealEstateSiteVisit[]>([]);
  const [leads, setLeads] = useState<RealEstateLead[]>([]);
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<VisitForm>(emptyForm);

  const loadWorkspace = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [visitResponse, leadResponse, propertyResponse] = await Promise.all([
        realEstateAPI.getSiteVisits({ limit: 500 }),
        realEstateAPI.getLeads({ limit: 500 }),
        realEstateAPI.getProperties({ limit: 500, status: "active" }),
      ]);
      setVisits(visitResponse.data.visits || []);
      setLeads(leadResponse.data.leads || []);
      setProperties(propertyResponse.data.properties || []);
    } catch (loadError) {
      setError(apiErrorMessage(loadError, "Site-visit workspace could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadWorkspace(); }, [loadWorkspace]);

  const visibleVisits = useMemo(() => {
    const term = search.trim().toLowerCase();
    return visits
      .filter((visit) => status === "all" || visit.status === status)
      .filter((visit) => {
        const property = propertyFrom(visit);
        return !term || [visit.customerName, visit.customerPhone, visit.assignedTo, property?.projectName, property?.locality, property?.city]
          .some((value) => String(value || "").toLowerCase().includes(term));
      });
  }, [search, status, visits]);

  const todayKey = new Date().toDateString();
  const todayCount = visits.filter((visit) => new Date(visit.visitAt).toDateString() === todayKey && !["cancelled", "no_show"].includes(visit.status)).length;
  const upcomingCount = visits.filter((visit) => new Date(visit.visitAt).getTime() > Date.now() && !["cancelled", "completed", "no_show"].includes(visit.status)).length;
  const completedCount = visits.filter((visit) => visit.status === "completed").length;

  const createVisit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await realEstateAPI.createSiteVisit({
        ...form,
        visitAt: new Date(form.visitAt).toISOString(),
        durationMinutes: Number(form.durationMinutes || 60),
        status: "requested",
      });
      setMessage("Site visit scheduled and the lead was moved to Site Visit Scheduled.");
      setShowForm(false);
      setForm(emptyForm);
      await loadWorkspace();
      window.setTimeout(() => setMessage(""), 4000);
    } catch (saveError) {
      setError(apiErrorMessage(saveError, "Site visit could not be scheduled."));
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (visit: RealEstateSiteVisit, nextStatus: string) => {
    try {
      setUpdatingId(visit._id);
      setError("");
      const response = await realEstateAPI.updateSiteVisit(visit._id, {
        status: nextStatus,
        ...(nextStatus === "completed" ? { outcome: "Visit completed", nextAction: "Capture feedback and begin negotiation follow-up" } : {}),
      });
      setVisits((current) => current.map((item) => item._id === visit._id ? response.data.visit : item));
      setMessage(nextStatus === "completed" ? "Visit completed and lead moved to Site Visit Completed." : `Visit marked ${pretty(nextStatus)}.`);
      window.setTimeout(() => setMessage(""), 3500);
    } catch (updateError) {
      setError(apiErrorMessage(updateError, "Visit status could not be updated."));
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <RealEstatePageShell
      eyebrow="Field sales operations"
      title="Site Visit Manager"
      description="Schedule property tours, assign an executive, track attendance, and move buyers forward without losing follow-ups."
      icon={CalendarCheck2}
      actions={(
        <>
          <button onClick={() => void loadWorkspace()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
          </button>
          <button onClick={() => { setShowForm(true); setError(""); }} className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">
            <Plus className="h-4 w-4" />Schedule visit
          </button>
        </>
      )}
    >
      {message && <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" />{message}</div>}
      {error && !showForm && <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800"><AlertCircle className="h-4 w-4" />{error}</div>}

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "All visits", value: visits.length, Icon: CalendarCheck2, color: "text-slate-700" },
          { label: "Today", value: todayCount, Icon: Clock3, color: "text-sky-700" },
          { label: "Upcoming", value: upcomingCount, Icon: MapPin, color: "text-violet-700" },
          { label: "Completed", value: completedCount, Icon: CheckCircle2, color: "text-emerald-700" },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p><Icon className={`h-5 w-5 ${color}`} /></div>
            <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </section>

      <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, phone, project, location, or executive" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-600" /></label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-emerald-600">
          <option value="all">All statuses</option><option value="requested">Requested</option><option value="confirmed">Confirmed</option><option value="rescheduled">Rescheduled</option><option value="completed">Completed</option><option value="no_show">No show</option><option value="cancelled">Cancelled</option>
        </select>
      </section>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-3xl border border-slate-200 bg-white"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></div>
      ) : visibleVisits.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><CalendarCheck2 className="mx-auto h-10 w-10 text-slate-300" /><h2 className="mt-4 text-xl font-black">No site visits yet</h2><p className="mt-2 text-sm text-slate-500">Schedule a property tour when a qualified buyer is ready.</p></div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {visibleVisits.map((visit) => {
            const property = propertyFrom(visit);
            const lead = leadFrom(visit);
            const updating = updatingId === visit._id;
            return (
              <article key={visit._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div><p className="text-xs font-black uppercase tracking-wide text-emerald-700">{property?.projectName || "Property"}</p><h2 className="mt-1 text-xl font-black text-slate-950">{visit.customerName || lead?.customerName || "Customer"}</h2></div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase ${statusStyles[visit.status] || statusStyles.requested}`}>{pretty(visit.status)}</span>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <p className="flex items-start gap-2 font-semibold"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{formatVisitDate(visit.visitAt)}</p>
                  <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />{[property?.title, property?.locality, property?.city].filter(Boolean).join(", ") || visit.meetingPoint || "Meeting point not set"}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-700" />{visit.customerPhone || lead?.phoneNumber || "Phone not set"}</p>
                  <p className="flex items-center gap-2"><UserRound className="h-4 w-4 text-emerald-700" />{visit.assignedTo || "Executive unassigned"}</p>
                </div>
                {visit.notes && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">{visit.notes}</p>}
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                  {visit.status === "requested" && <button disabled={updating} onClick={() => void updateStatus(visit, "confirmed")} className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Confirm</button>}
                  {!["completed", "cancelled", "no_show"].includes(visit.status) && <button disabled={updating} onClick={() => void updateStatus(visit, "completed")} className="rounded-lg bg-emerald-800 px-3 py-2 text-xs font-black text-white disabled:opacity-50">Complete visit</button>}
                  {!["completed", "cancelled", "no_show"].includes(visit.status) && <button disabled={updating} onClick={() => void updateStatus(visit, "no_show")} className="rounded-lg border border-orange-200 px-3 py-2 text-xs font-black text-orange-700 disabled:opacity-50">No show</button>}
                  {!["completed", "cancelled"].includes(visit.status) && <button disabled={updating} onClick={() => void updateStatus(visit, "cancelled")} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 disabled:opacity-50">Cancel</button>}
                  {updating && <Loader2 className="ml-1 h-5 w-5 animate-spin text-emerald-700" />}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={() => !saving && setShowForm(false)}>
          <form onSubmit={createVisit} onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Buyer engagement</p><h2 className="mt-1 text-2xl font-black">Schedule a site visit</h2></div><button type="button" disabled={saving} onClick={() => setShowForm(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {error && <div className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800"><AlertCircle className="h-4 w-4" />{error}</div>}
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Buyer lead</span><select required value={form.leadId} onChange={(event) => setForm((current) => ({ ...current, leadId: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600"><option value="">Choose a lead</option>{leads.map((lead) => <option key={lead._id} value={lead._id}>{lead.customerName || "Unnamed lead"} · {lead.phoneNumber || "No phone"} · {pretty(lead.customFields?.realEstate?.pipelineStage || "new")}</option>)}</select></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Property</span><select required value={form.propertyId} onChange={(event) => setForm((current) => ({ ...current, propertyId: event.target.value }))} className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600"><option value="">Choose a property</option>{properties.map((property) => <option key={property._id} value={property._id}>{property.projectName} · {[property.locality, property.city].filter(Boolean).join(", ")} · {property.availableUnits || 0} available</option>)}</select></label>
              <label><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Date & time</span><input required type="datetime-local" value={form.visitAt} onChange={(event) => setForm((current) => ({ ...current, visitAt: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" /></label>
              <label><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Duration (minutes)</span><input required min="15" step="15" type="number" value={form.durationMinutes} onChange={(event) => setForm((current) => ({ ...current, durationMinutes: event.target.value }))} className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" /></label>
              <label><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Assigned executive</span><input value={form.assignedTo} onChange={(event) => setForm((current) => ({ ...current, assignedTo: event.target.value }))} placeholder="Name or email" className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" /></label>
              <label><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Meeting point</span><input value={form.meetingPoint} onChange={(event) => setForm((current) => ({ ...current, meetingPoint: event.target.value }))} placeholder="Sales office / project gate" className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" /></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-black uppercase text-slate-500">Preparation notes</span><textarea rows={3} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Customer preferences, documents to carry, pickup instructions…" className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-600" /></label>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4"><button type="button" disabled={saving} onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-black text-slate-700">Cancel</button><button disabled={saving || !leads.length || !properties.length} className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Schedule visit</button></div>
          </form>
        </div>
      )}
    </RealEstatePageShell>
  );
}
