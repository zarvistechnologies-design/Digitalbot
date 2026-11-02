"use client";

import { realEstateAPI, type RealEstateLead, type RealEstatePipelineStage } from "@/lib/api";
import { AlertCircle, ArrowRight, Flame, GitBranch, Loader2, Pencil, Phone, RefreshCw, Search, Trash2, UserRound, WalletCards } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import RealEstatePageShell, { apiErrorMessage, formatCurrency, pretty } from "../_components/RealEstatePageShell";

const stages: Array<{ id: RealEstatePipelineStage; label: string; tone: string }> = [
  { id: "new", label: "New", tone: "bg-sky-500" },
  { id: "contacted", label: "Contacted", tone: "bg-blue-500" },
  { id: "qualified", label: "Qualified", tone: "bg-violet-500" },
  { id: "property_matched", label: "Matched", tone: "bg-cyan-500" },
  { id: "site_visit_scheduled", label: "Visit scheduled", tone: "bg-amber-500" },
  { id: "site_visit_completed", label: "Visit completed", tone: "bg-orange-500" },
  { id: "negotiation", label: "Negotiation", tone: "bg-fuchsia-500" },
  { id: "booking", label: "Booking", tone: "bg-indigo-500" },
  { id: "won", label: "Won", tone: "bg-emerald-600" },
  { id: "lost", label: "Lost", tone: "bg-rose-500" },
  { id: "nurture", label: "Nurture", tone: "bg-slate-500" },
];

function getStage(lead: RealEstateLead): RealEstatePipelineStage {
  const saved = lead.customFields?.realEstate?.pipelineStage;
  if (saved) return saved;
  if (lead.leadStatus === "converted") return "won";
  if (lead.leadStatus === "lost") return "lost";
  if (lead.leadStatus === "qualified") return "qualified";
  return "new";
}

function leadBudget(lead: RealEstateLead) {
  const details = lead.customFields?.realEstate;
  if (details?.budgetMax) return formatCurrency(details.budgetMax);
  return lead.budget || "Budget open";
}

export default function RealEstatePipelinePage() {
  const [leads, setLeads] = useState<RealEstateLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [editingLead, setEditingLead] = useState<RealEstateLead | null>(null);
  const [savingLead, setSavingLead] = useState(false);
  const [draft, setDraft] = useState({ customerName: "", phoneNumber: "", email: "", budget: "", timeline: "", nextAction: "", preferredLocations: "", propertyTypes: "", configurations: "", budgetMin: "", budgetMax: "" });

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await realEstateAPI.getLeads({ limit: 500 });
      setLeads(response.data.leads || []);
    } catch (loadError) {
      setError(apiErrorMessage(loadError, "Sales pipeline could not be loaded."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadLeads(); }, [loadLeads]);

  const visibleLeads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return leads;
    return leads.filter((lead) => {
      const details = lead.customFields?.realEstate;
      return [lead.customerName, lead.phoneNumber, lead.email, details?.preferredLocations?.join(" "), details?.configurations?.join(" ")]
        .some((value) => String(value || "").toLowerCase().includes(term));
    });
  }, [leads, search]);

  const moveLead = async (leadId: string, stage: RealEstatePipelineStage) => {
    const previous = leads;
    setLeads((rows) => rows.map((lead) => lead._id === leadId ? {
      ...lead,
      customFields: { ...lead.customFields, realEstate: { ...lead.customFields?.realEstate, pipelineStage: stage } },
    } : lead));
    try {
      setSavingId(leadId);
      setError("");
      await realEstateAPI.updateLead(leadId, { stage });
    } catch (updateError) {
      setLeads(previous);
      setError(apiErrorMessage(updateError, "Lead stage could not be updated."));
    } finally {
      setSavingId(null);
      setDraggingId(null);
    }
  };

  const startEdit = (lead: RealEstateLead) => {
    const details = lead.customFields?.realEstate;
    setError("");
    setEditingLead(lead);
    setDraft({
      customerName: lead.customerName || "",
      phoneNumber: lead.phoneNumber || "",
      email: lead.email || "",
      budget: lead.budget || "",
      timeline: lead.timeline || details?.purchaseTimeline || "",
      nextAction: lead.nextAction || "",
      preferredLocations: details?.preferredLocations?.join(", ") || "",
      propertyTypes: details?.propertyTypes?.join(", ") || "",
      configurations: details?.configurations?.join(", ") || "",
      budgetMin: String(details?.budgetMin || ""),
      budgetMax: String(details?.budgetMax || ""),
    });
  };

  const saveLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingLead) return;
    try {
      setSavingLead(true);
      setError("");
      await realEstateAPI.updateLead(editingLead._id, {
        customerName: draft.customerName,
        phoneNumber: draft.phoneNumber,
        email: draft.email,
        budget: draft.budget,
        timeline: draft.timeline,
        nextAction: draft.nextAction,
        requirements: {
          preferredLocations: draft.preferredLocations.split(",").map((item) => item.trim()).filter(Boolean),
          propertyTypes: draft.propertyTypes.split(",").map((item) => item.trim()).filter(Boolean),
          configurations: draft.configurations.split(",").map((item) => item.trim()).filter(Boolean),
          budgetMin: Number(draft.budgetMin) || 0,
          budgetMax: Number(draft.budgetMax) || 0,
          purchaseTimeline: draft.timeline,
        },
      });
      setEditingLead(null);
      await loadLeads();
    } catch (updateError) {
      setError(apiErrorMessage(updateError, "Lead details could not be updated."));
    } finally {
      setSavingLead(false);
    }
  };

  const deleteLead = async (lead: RealEstateLead) => {
    if (!window.confirm(`Delete the lead for ${lead.customerName || lead.phoneNumber || "this buyer"}?`)) return;
    try {
      setError("");
      await realEstateAPI.deleteLead(lead._id);
      setLeads((rows) => rows.filter((row) => row._id !== lead._id));
    } catch (deleteError) {
      setError(apiErrorMessage(deleteError, "Lead could not be deleted."));
    }
  };

  const pipelineValue = useMemo(() => visibleLeads.reduce((sum, lead) => sum + Number(lead.customFields?.realEstate?.budgetMax || 0), 0), [visibleLeads]);

  return (
    <RealEstatePageShell
      eyebrow="Real Estate CRM"
      title="Sales Pipeline"
      description="Drag qualified buyers between stages and keep ownership, requirements, and the next action visible."
      icon={GitBranch}
      actions={<button onClick={() => void loadLeads()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>}
    >
      {error && <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800"><AlertCircle className="h-4 w-4" />{error}</div>}

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Visible opportunities</p><p className="mt-2 text-2xl font-black">{visibleLeads.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Hot buyers</p><p className="mt-2 flex items-center gap-2 text-2xl font-black"><Flame className="h-5 w-5 text-orange-500" />{visibleLeads.filter((lead) => lead.leadQuality === "hot").length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase text-slate-500">Demand value</p><p className="mt-2 text-2xl font-black">{pipelineValue ? formatCurrency(pipelineValue) : "Not captured"}</p></div>
      </div>

      <div className="mb-5 max-w-md">
        <label className="relative block"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search buyer, phone, location or BHK" className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
      </div>

      {loading ? <div className="flex min-h-[480px] items-center justify-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="h-7 w-7 animate-spin text-emerald-700" /></div> : (
        <div className="overflow-x-auto pb-5">
          <div className="flex min-w-max items-start gap-4">
            {stages.map((stage, stageIndex) => {
              const stageLeads = visibleLeads.filter((lead) => getStage(lead) === stage.id);
              return (
                <section
                  key={stage.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => draggingId && void moveLead(draggingId, stage.id)}
                  className="w-[310px] shrink-0 rounded-2xl border border-slate-200 bg-slate-100/70 p-3"
                >
                  <div className="mb-3 flex items-center justify-between px-1"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${stage.tone}`} /><h2 className="text-sm font-black text-slate-900">{stage.label}</h2></div><span className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-slate-600 shadow-sm">{stageLeads.length}</span></div>
                  <div className="min-h-[410px] space-y-3">
                    {stageLeads.map((lead) => {
                      const details = lead.customFields?.realEstate;
                      const nextStage = stages[Math.min(stages.length - 1, stageIndex + 1)];
                      return (
                        <article key={lead._id} draggable onDragStart={() => setDraggingId(lead._id)} onDragEnd={() => setDraggingId(null)} className={`cursor-grab rounded-xl border bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md active:cursor-grabbing ${draggingId === lead._id ? "opacity-50" : "border-slate-200"}`}>
                          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-black text-slate-950">{lead.customerName || "Unknown buyer"}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" />{lead.phoneNumber || "No phone"}</p></div><span className={`rounded-full px-2 py-1 text-[9px] font-black uppercase ${lead.leadQuality === "hot" ? "bg-orange-50 text-orange-700" : lead.leadQuality === "warm" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{lead.leadQuality || "new"}</span></div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg bg-slate-50 p-2"><p className="text-[9px] font-black uppercase text-slate-400">Requirement</p><p className="mt-1 truncate font-bold text-slate-700">{details?.configurations?.join(", ") || details?.propertyTypes?.join(", ") || "Open"}</p></div><div className="rounded-lg bg-slate-50 p-2"><p className="text-[9px] font-black uppercase text-slate-400">Budget</p><p className="mt-1 truncate font-bold text-slate-700">{leadBudget(lead)}</p></div></div>
                          <p className="mt-3 truncate text-xs text-slate-500"><UserRound className="mr-1 inline h-3 w-3" />{details?.assignedExecutive || "Unassigned"}</p>
                          <p className="mt-2 truncate text-xs text-slate-500"><WalletCards className="mr-1 inline h-3 w-3" />{details?.preferredLocations?.join(", ") || "Location open"}</p>
                          <div className="mt-3 flex gap-2"><button onClick={() => startEdit(lead)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"><Pencil className="h-3.5 w-3.5" />Edit</button><button onClick={() => void deleteLead(lead)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-black text-rose-700 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div>
                          {nextStage.id !== stage.id && <button disabled={savingId === lead._id} onClick={() => void moveLead(lead._id, nextStage.id)} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-black text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50">Move to {nextStage.label}<ArrowRight className="h-3.5 w-3.5" /></button>}
                        </article>
                      );
                    })}
                    {!stageLeads.length && <div className="flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 p-4 text-center text-xs font-semibold text-slate-400">Drop leads here</div>}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}
      {editingLead && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-real-estate-lead-title"><form onSubmit={saveLead} className="max-h-[90vh] w-full max-w-3xl space-y-4 overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6"><div><h2 id="edit-real-estate-lead-title" className="text-xl font-black text-slate-950">Edit buyer lead</h2><p className="mt-1 text-sm text-slate-500">Update contact details, requirements, budget and follow-up action.</p></div><div className="grid gap-4 sm:grid-cols-2">{([ ["customerName", "Buyer name"], ["phoneNumber", "Phone number"], ["email", "Email"], ["budget", "Budget display"], ["budgetMin", "Minimum budget"], ["budgetMax", "Maximum budget"], ["preferredLocations", "Preferred locations (comma separated)"], ["propertyTypes", "Property types (comma separated)"], ["configurations", "Configurations (comma separated)"], ["timeline", "Purchase timeline"] ] as const).map(([key, label]) => <label key={key}><span className="mb-1 block text-xs font-black uppercase text-slate-500">{label}</span><input type={key === "budgetMin" || key === "budgetMax" ? "number" : "text"} value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm" /></label>)}<label className="sm:col-span-2"><span className="mb-1 block text-xs font-black uppercase text-slate-500">Next action</span><input value={draft.nextAction} onChange={(event) => setDraft((current) => ({ ...current, nextAction: event.target.value }))} className="h-10 w-full rounded-xl border border-slate-300 px-3 text-sm" /></label></div><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingLead(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700">Cancel</button><button disabled={savingLead} className="rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{savingLead ? "Saving…" : "Save lead"}</button></div></form></div>}
    </RealEstatePageShell>
  );
}
