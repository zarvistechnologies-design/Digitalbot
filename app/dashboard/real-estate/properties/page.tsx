"use client";

import { realEstateAPI, type RealEstateProperty } from "@/lib/api";
import { AlertCircle, Building2, CheckCircle2, Edit3, Home, IndianRupee, Loader2, MapPin, Package, Plus, RefreshCw, Search, X } from "lucide-react";
import { FormEvent, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import RealEstatePageShell, { apiErrorMessage, formatCurrency, pretty } from "../_components/RealEstatePageShell";

interface PropertyForm {
  projectName: string;
  title: string;
  developerName: string;
  reraNumber: string;
  transactionType: string;
  propertyType: string;
  configurations: string;
  city: string;
  locality: string;
  address: string;
  priceMin: string;
  priceMax: string;
  carpetAreaMin: string;
  carpetAreaMax: string;
  possessionStatus: string;
  possessionDate: string;
  totalUnits: string;
  availableUnits: string;
  amenities: string;
  brochureUrl: string;
  status: string;
}

const emptyForm: PropertyForm = {
  projectName: "", title: "", developerName: "", reraNumber: "", transactionType: "sale", propertyType: "apartment",
  configurations: "", city: "", locality: "", address: "", priceMin: "", priceMax: "", carpetAreaMin: "", carpetAreaMax: "",
  possessionStatus: "under_construction", possessionDate: "", totalUnits: "", availableUnits: "", amenities: "", brochureUrl: "", status: "active",
};

function toForm(property?: RealEstateProperty | null): PropertyForm {
  if (!property) return emptyForm;
  return {
    projectName: property.projectName || "", title: property.title || "", developerName: property.developerName || "", reraNumber: property.reraNumber || "",
    transactionType: property.transactionType || "sale", propertyType: property.propertyType || "apartment", configurations: property.configurations?.join(", ") || "",
    city: property.city || "", locality: property.locality || "", address: property.address || "", priceMin: String(property.priceMin || ""), priceMax: String(property.priceMax || ""),
    carpetAreaMin: String(property.carpetAreaMin || ""), carpetAreaMax: String(property.carpetAreaMax || ""), possessionStatus: property.possessionStatus || "under_construction",
    possessionDate: property.possessionDate ? property.possessionDate.slice(0, 10) : "", totalUnits: String(property.totalUnits || ""), availableUnits: String(property.availableUnits || ""),
    amenities: property.amenities?.join(", ") || "", brochureUrl: property.brochureUrl || "", status: property.status || "active",
  };
}

function payload(form: PropertyForm) {
  return {
    ...form,
    configurations: form.configurations.split(",").map((value) => value.trim()).filter(Boolean),
    amenities: form.amenities.split(",").map((value) => value.trim()).filter(Boolean),
    priceMin: Number(form.priceMin || 0), priceMax: Number(form.priceMax || 0), carpetAreaMin: Number(form.carpetAreaMin || 0), carpetAreaMax: Number(form.carpetAreaMax || 0),
    totalUnits: Number(form.totalUnits || 0), availableUnits: Number(form.availableUnits || 0), possessionDate: form.possessionDate || null, currency: "INR", areaUnit: "sq_ft",
  };
}

function Field({ label, children, span = false }: { label: string; children: ReactNode; span?: boolean }) {
  return <label className={span ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-xs font-black uppercase tracking-wide text-slate-500">{label}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export default function RealEstatePropertiesPage() {
  const [properties, setProperties] = useState<RealEstateProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<RealEstateProperty | null>(null);
  const [form, setForm] = useState<PropertyForm>(emptyForm);

  const loadProperties = useCallback(async () => {
    try {
      setLoading(true); setError("");
      const response = await realEstateAPI.getProperties({ limit: 500 });
      setProperties(response.data.properties || []);
    } catch (loadError) {
      setError(apiErrorMessage(loadError, "Property inventory could not be loaded."));
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    void loadProperties();
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("create") === "1") setShowForm(true);
  }, [loadProperties]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return properties.filter((property) => status === "all" || property.status === status).filter((property) => !term || [property.projectName, property.title, property.developerName, property.city, property.locality, property.configurations?.join(" ")].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [properties, search, status]);

  const openForm = (property?: RealEstateProperty) => { setEditing(property || null); setForm(toForm(property)); setShowForm(true); setError(""); };
  const closeForm = () => { if (!saving) { setShowForm(false); setEditing(null); setForm(emptyForm); } };

  const saveProperty = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true); setError("");
      if (editing) await realEstateAPI.updateProperty(editing._id, payload(form));
      else await realEstateAPI.createProperty(payload(form));
      setMessage(editing ? "Property updated." : "Property added to inventory.");
      setShowForm(false);
      setEditing(null);
      setForm(emptyForm);
      await loadProperties();
      window.setTimeout(() => setMessage(""), 3000);
    } catch (saveError) { setError(apiErrorMessage(saveError, "Property could not be saved.")); }
    finally { setSaving(false); }
  };

  const inventory = useMemo(() => properties.reduce((sum, property) => sum + Number(property.availableUnits || 0), 0), [properties]);

  return (
    <RealEstatePageShell eyebrow="Inventory operations" title="Projects & Properties" description="Keep pricing, configurations, possession, RERA details, and sellable availability ready for your AI and sales team." icon={Building2} actions={<><button onClick={() => void loadProperties()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button><button onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-800"><Plus className="h-4 w-4" />Add property</button></>}>
      {message && <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"><CheckCircle2 className="h-4 w-4" />{message}</div>}
      {error && !showForm && <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800"><AlertCircle className="h-4 w-4" />{error}</div>}

      <section className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Properties</p><p className="mt-2 text-3xl font-black">{properties.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Active inventory</p><p className="mt-2 flex items-center gap-2 text-3xl font-black"><Home className="h-6 w-6 text-emerald-700" />{inventory}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase text-slate-500">Cities</p><p className="mt-2 text-3xl font-black">{new Set(properties.map((property) => property.city).filter(Boolean)).size}</p></div>
      </section>

      <section className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative w-full sm:max-w-md"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search project, locality, city or BHK" className={`${inputClass} pl-10`} /></label>
        <div className="flex flex-wrap gap-2">{["all", "active", "paused", "sold_out", "archived"].map((value) => <button key={value} onClick={() => setStatus(value)} className={`rounded-lg px-3 py-2 text-xs font-black capitalize ${status === value ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{pretty(value)}</button>)}</div>
      </section>

      {loading ? <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-white"><Loader2 className="h-7 w-7 animate-spin text-emerald-700" /></div> : visible.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((property) => <article key={property._id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-md"><div className="h-2 bg-gradient-to-r from-emerald-700 via-teal-500 to-sky-500" /><div className="p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{property.projectName}</p><h2 className="mt-1 truncate text-lg font-black text-slate-950">{property.title}</h2><p className="mt-1 text-xs text-slate-500">{property.developerName || "Developer not set"}</p></div><span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${property.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{pretty(property.status)}</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">Price range</p><p className="mt-1 text-sm font-black">{formatCurrency(property.priceMin)}{property.priceMax ? ` – ${formatCurrency(property.priceMax)}` : ""}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] font-black uppercase text-slate-400">Available</p><p className="mt-1 text-sm font-black">{property.availableUnits} / {property.totalUnits || "—"} units</p></div></div><div className="mt-4 space-y-2 text-xs text-slate-600"><p><MapPin className="mr-2 inline h-3.5 w-3.5 text-slate-400" />{[property.locality, property.city].filter(Boolean).join(", ") || "Location not set"}</p><p><Package className="mr-2 inline h-3.5 w-3.5 text-slate-400" />{property.configurations?.join(", ") || pretty(property.propertyType)}</p><p><IndianRupee className="mr-2 inline h-3.5 w-3.5 text-slate-400" />{pretty(property.possessionStatus)}{property.reraNumber ? ` · RERA ${property.reraNumber}` : ""}</p></div><button onClick={() => openForm(property)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"><Edit3 className="h-4 w-4" />Edit property</button></div></article>)}
        </section>
      ) : <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center"><Building2 className="mx-auto h-9 w-9 text-slate-300" /><h2 className="mt-4 font-black">No properties found</h2><p className="mt-2 text-sm text-slate-500">Add your first project or adjust the filters.</p></div>}

      {showForm && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm" onMouseDown={closeForm}><form onSubmit={saveProperty} onMouseDown={(event) => event.stopPropagation()} className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5"><div><p className="text-xs font-black uppercase tracking-widest text-emerald-700">Inventory record</p><h2 className="mt-1 text-2xl font-black">{editing ? "Edit property" : "Add property"}</h2></div><button type="button" onClick={closeForm} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><div className="grid gap-5 p-6 sm:grid-cols-2">
        {error && <div className="sm:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">{error}</div>}
        <Field label="Project name"><input required value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className={inputClass} /></Field><Field label="Property title"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></Field>
        <Field label="Developer"><input value={form.developerName} onChange={(e) => setForm({ ...form, developerName: e.target.value })} className={inputClass} /></Field><Field label="RERA number"><input value={form.reraNumber} onChange={(e) => setForm({ ...form, reraNumber: e.target.value })} className={inputClass} /></Field>
        <Field label="Transaction"><select value={form.transactionType} onChange={(e) => setForm({ ...form, transactionType: e.target.value })} className={inputClass}>{["sale", "resale", "rent", "lease"].map((v) => <option key={v} value={v}>{pretty(v)}</option>)}</select></Field><Field label="Property type"><select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className={inputClass}>{["apartment", "villa", "plot", "office", "shop", "warehouse", "other"].map((v) => <option key={v} value={v}>{pretty(v)}</option>)}</select></Field>
        <Field label="Configurations" span><input value={form.configurations} onChange={(e) => setForm({ ...form, configurations: e.target.value })} placeholder="2 BHK, 3 BHK, 4 BHK" className={inputClass} /></Field>
        <Field label="City"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} /></Field><Field label="Locality"><input value={form.locality} onChange={(e) => setForm({ ...form, locality: e.target.value })} className={inputClass} /></Field><Field label="Address" span><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} /></Field>
        <Field label="Minimum price"><input type="number" min="0" value={form.priceMin} onChange={(e) => setForm({ ...form, priceMin: e.target.value })} className={inputClass} /></Field><Field label="Maximum price"><input type="number" min="0" value={form.priceMax} onChange={(e) => setForm({ ...form, priceMax: e.target.value })} className={inputClass} /></Field>
        <Field label="Minimum carpet area"><input type="number" min="0" value={form.carpetAreaMin} onChange={(e) => setForm({ ...form, carpetAreaMin: e.target.value })} className={inputClass} /></Field><Field label="Maximum carpet area"><input type="number" min="0" value={form.carpetAreaMax} onChange={(e) => setForm({ ...form, carpetAreaMax: e.target.value })} className={inputClass} /></Field>
        <Field label="Possession"><select value={form.possessionStatus} onChange={(e) => setForm({ ...form, possessionStatus: e.target.value })} className={inputClass}>{["ready_to_move", "under_construction", "new_launch", "resale"].map((v) => <option key={v} value={v}>{pretty(v)}</option>)}</select></Field><Field label="Possession date"><input type="date" value={form.possessionDate} onChange={(e) => setForm({ ...form, possessionDate: e.target.value })} className={inputClass} /></Field>
        <Field label="Total units"><input type="number" min="0" value={form.totalUnits} onChange={(e) => setForm({ ...form, totalUnits: e.target.value })} className={inputClass} /></Field><Field label="Available units"><input type="number" min="0" value={form.availableUnits} onChange={(e) => setForm({ ...form, availableUnits: e.target.value })} className={inputClass} /></Field>
        <Field label="Amenities" span><input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Clubhouse, pool, gym, parking" className={inputClass} /></Field><Field label="Brochure URL"><input type="url" value={form.brochureUrl} onChange={(e) => setForm({ ...form, brochureUrl: e.target.value })} className={inputClass} /></Field><Field label="Status"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>{["active", "paused", "sold_out", "archived"].map((v) => <option key={v} value={v}>{pretty(v)}</option>)}</select></Field>
      </div><div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4"><button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-black text-slate-700">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-950 px-5 py-2.5 text-sm font-black text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Save changes" : "Add property"}</button></div></form></div>}
    </RealEstatePageShell>
  );
}
