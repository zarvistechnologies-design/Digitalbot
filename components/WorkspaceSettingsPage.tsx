"use client";

import Sidebar from "@/components/Sidebar";
import { authAPI, workspaceAiAPI, type WorkspaceAiReadiness } from "@/lib/api";
import { CheckCircle2, CircleAlert, Loader2, Menu, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

type Config = Record<string, any>;

const defaults: Config = {
  business: { name: "", address: "", contactPhone: "", timezone: "Asia/Kolkata", workingDays: [1, 2, 3, 4, 5, 6], workingHours: { start: "09:00", end: "18:00" }, closedDates: [] },
  policies: { cancellation: "", rescheduling: "", confirmation: "", escalation: "" },
  lead: { qualificationQuestions: [], requiredFields: ["customerName", "phoneNumber"], hotThreshold: 70, warmThreshold: 40, pipelineStages: ["new", "contacted", "qualified", "converted", "lost"], followUpHours: 24 },
  event: { bookingLink: "", detailsLink: "", paymentLink: "" },
  pathology: { branches: [] },
  realEstate: { visitDurationMinutes: 60, visitBufferMinutes: 30, executives: [] },
  support: { products: [], ticketCategories: ["general"], slaHours: 24, team: [], knowledge: [], resources: [] },
  active: true,
};

const mergeConfig = (value?: Config | null): Config => ({
  ...defaults,
  ...(value || {}),
  business: { ...defaults.business, ...(value?.business || {}), workingHours: { ...defaults.business.workingHours, ...(value?.business?.workingHours || {}) } },
  policies: { ...defaults.policies, ...(value?.policies || {}) },
  lead: { ...defaults.lead, ...(value?.lead || {}) },
  event: { ...defaults.event, ...(value?.event || {}) },
  pathology: { ...defaults.pathology, ...(value?.pathology || {}) },
  realEstate: { ...defaults.realEstate, ...(value?.realEstate || {}) },
  support: { ...defaults.support, ...(value?.support || {}) },
});

const splitComma = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);
const splitLines = (value: string) => value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const pretty = (value: string) => value.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function serviceLabel(service: string) {
  const names: Record<string, string> = {
    "event-booking-crm": "Event Booking CRM",
    "pathology-diagnostic": "Pathology Diagnostic",
    "hospitality-crm": "Hotel & Restaurant CRM",
    "lead-analysis": "Lead Analysis",
    "real-estate-crm": "Real Estate CRM",
    "customer-support": "Customer Support",
  };
  return names[service] || pretty(service || "Workspace");
}

function setupTitle(service: string) {
  const names: Record<string, string> = {
    "event-booking-crm": "Booking Settings",
    "pathology-diagnostic": "Lab & Collection Setup",
    "hospitality-crm": "Hotel & Restaurant Settings",
    "lead-analysis": "Lead Qualification Setup",
    "real-estate-crm": "Site Visit & Team Settings",
    "customer-support": "Support Settings",
  };
  return names[service] || "Workspace Settings";
}

export default function WorkspaceSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [service, setService] = useState("");
  const [config, setConfig] = useState<Config>(mergeConfig());
  const [readiness, setReadiness] = useState<WorkspaceAiReadiness | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([authAPI.getCurrentUser(), workspaceAiAPI.get()])
      .then(([userResponse, setupResponse]) => {
        if (cancelled) return;
        setService(String(userResponse.data.selectedService || "").toLowerCase());
        setConfig(mergeConfig(setupResponse.data.config));
        setReadiness(setupResponse.data.readiness);
      })
      .catch((loadError) => setError(loadError.response?.data?.error || "Could not load workspace settings."))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const setBusiness = (key: string, value: unknown) => setConfig((current) => ({ ...current, business: { ...current.business, [key]: value } }));
  const setPolicy = (key: string, value: unknown) => setConfig((current) => ({ ...current, policies: { ...current.policies, [key]: value } }));
  const setDomain = (domain: string, key: string, value: unknown) => setConfig((current) => ({ ...current, [domain]: { ...current[domain], [key]: value } }));

  const toggleDay = (day: number) => {
    const current = config.business.workingDays || [];
    setBusiness("workingDays", current.includes(day) ? current.filter((item: number) => item !== day) : [...current, day].sort());
  };

  const save = async () => {
    try {
      setSaving(true); setError(""); setMessage("");
      const response = await workspaceAiAPI.save(config);
      setConfig(mergeConfig(response.data.config));
      setReadiness(response.data.readiness);
      setMessage("Workspace settings saved successfully.");
    } catch (saveError: any) {
      setError(saveError.response?.data?.error || "Could not save workspace settings.");
    } finally { setSaving(false); }
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <button type="button" onClick={() => setSidebarOpen(true)} className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-md border bg-white shadow-sm lg:hidden"><Menu className="h-5 w-5" /></button>
      <main className="lg:pl-64">
        <header className="border-b border-slate-200 bg-white px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-7">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">{serviceLabel(service)}</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{setupTitle(service)}</h1><p className="mt-2 max-w-3xl text-sm text-slate-500">Enter the business information your team uses for bookings, availability and customer service.</p></div>
            <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving" : "Save setup"}</button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {error && <Notice tone="error" text={error} />}{message && <Notice tone="success" text={message} />}

          <section className={`rounded-xl border p-5 ${readiness?.ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <div className="flex items-center gap-3">{readiness?.ready ? <CheckCircle2 className="h-7 w-7 text-emerald-700" /> : <CircleAlert className="h-7 w-7 text-amber-700" />}<div><h2 className="font-black">{readiness?.ready ? "Setup complete" : "Complete the required information"}</h2><p className="mt-1 text-sm opacity-75">Keep these details current so bookings and customer responses remain accurate.</p></div></div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">{readiness?.checks.map((check) => <div key={check.key} className="rounded-lg border border-black/10 bg-white/80 p-3"><p className="flex items-center gap-2 text-sm font-bold">{check.complete ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleAlert className="h-4 w-4 text-amber-600" />}{check.label}</p><p className="mt-1 pl-6 text-xs text-slate-500">{check.detail}</p></div>)}</div>
          </section>

          <Section title="Business information" description="Your business identity, operating hours and closed dates.">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Business name" value={config.business.name} onChange={(value) => setBusiness("name", value)} /><Field label="Contact phone" value={config.business.contactPhone} onChange={(value) => setBusiness("contactPhone", value)} /><Field label="Address" value={config.business.address} onChange={(value) => setBusiness("address", value)} span /><Field label="Timezone" value={config.business.timezone} onChange={(value) => setBusiness("timezone", value)} /><div className="grid grid-cols-2 gap-3"><Field label="Opening" type="time" value={config.business.workingHours.start} onChange={(value) => setBusiness("workingHours", { ...config.business.workingHours, start: value })} /><Field label="Closing" type="time" value={config.business.workingHours.end} onChange={(value) => setBusiness("workingHours", { ...config.business.workingHours, end: value })} /></div></div>
            <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-700">Working days</p><div className="flex flex-wrap gap-2">{days.map((day, index) => <button key={day} type="button" onClick={() => toggleDay(index)} className={`h-9 rounded-md border px-3 text-xs font-bold ${config.business.workingDays.includes(index) ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-500"}`}>{day}</button>)}</div></div>
            <div className="mt-4"><Field label="Closed dates" value={(config.business.closedDates || []).join(", ")} placeholder="2026-10-02, 2026-12-25" onChange={(value) => setBusiness("closedDates", splitComma(value))} /></div>
          </Section>

          <Section title="Customer policies" description="Approved rules for confirmations, changes, cancellations and staff assistance."><div className="grid gap-4 md:grid-cols-2"><Area label="Cancellation policy" value={config.policies.cancellation} onChange={(value) => setPolicy("cancellation", value)} /><Area label="Rescheduling policy" value={config.policies.rescheduling} onChange={(value) => setPolicy("rescheduling", value)} /><Area label="Confirmation rules" value={config.policies.confirmation} onChange={(value) => setPolicy("confirmation", value)} /><Area label="When staff should assist" value={config.policies.escalation} onChange={(value) => setPolicy("escalation", value)} /></div></Section>

          {service === "event-booking-crm" && <Section title="Booking links" description="Services, resources and availability remain managed in Booking Workspace. Add approved delivery links here."><div className="grid gap-4 md:grid-cols-3"><Field label="Booking link" type="url" value={config.event.bookingLink} onChange={(value) => setDomain("event", "bookingLink", value)} /><Field label="Event/details link" type="url" value={config.event.detailsLink} onChange={(value) => setDomain("event", "detailsLink", value)} /><Field label="Payment link" type="url" value={config.event.paymentLink} onChange={(value) => setDomain("event", "paymentLink", value)} /></div></Section>}

          {service === "pathology-diagnostic" && <BranchEditor branches={config.pathology.branches || []} workingDays={config.business.workingDays || []} onChange={(branches) => setDomain("pathology", "branches", branches)} />}

          {service === "lead-analysis" && <Section title="Lead qualification" description="Choose the questions, scoring levels and pipeline your sales team follows."><div className="grid gap-4 md:grid-cols-2"><Area label="Qualification questions — one per line" value={(config.lead.qualificationQuestions || []).join("\n")} onChange={(value) => setDomain("lead", "qualificationQuestions", splitLines(value))} /><div className="grid gap-4"><Field label="Pipeline stages" value={(config.lead.pipelineStages || []).join(", ")} onChange={(value) => setDomain("lead", "pipelineStages", splitComma(value))} /><div className="grid grid-cols-2 gap-3"><Field label="Hot score" type="number" value={String(config.lead.hotThreshold)} onChange={(value) => setDomain("lead", "hotThreshold", Number(value))} /><Field label="Warm score" type="number" value={String(config.lead.warmThreshold)} onChange={(value) => setDomain("lead", "warmThreshold", Number(value))} /></div><Field label="Default follow-up hours" type="number" value={String(config.lead.followUpHours)} onChange={(value) => setDomain("lead", "followUpHours", Number(value))} /></div></div></Section>}

          {service === "real-estate-crm" && <RealEstateTeamEditor realEstate={config.realEstate} onChange={(key, value) => setDomain("realEstate", key, value)} />}

          {service === "customer-support" && <SupportEditor support={config.support} onChange={(key, value) => setDomain("support", key, value)} />}

          <div className="flex justify-end pb-8"><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-md bg-orange-600 px-6 text-sm font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save workspace settings</button></div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><div className="p-5">{children}</div></section>; }

function BranchEditor({ branches, workingDays, onChange }: { branches: any[]; workingDays: number[]; onChange: (branches: any[]) => void }) {
  const update = (index: number, key: string, value: unknown) => onChange(branches.map((branch, row) => row === index ? { ...branch, [key]: value } : branch));
  const updateHours = (index: number, key: "start" | "end", value: string) => onChange(branches.map((branch, row) => row === index ? { ...branch, workingHours: { start: branch.workingHours?.start || "07:00", end: branch.workingHours?.end || "19:00", [key]: value } } : branch));
  const add = () => onChange([...branches, { name: "", address: "", phone: "", workingDays, workingHours: { start: "07:00", end: "19:00" }, homeCollectionAreas: [], simultaneousCollections: 1, homeCollectionCharge: 0, active: true }]);
  return <Section title="Branches & home collection" description="Add each centre and the areas where its team can collect samples from home.">
    <div className="space-y-4">
      {branches.map((branch, index) => <div key={branch._id || index} className="rounded-lg border border-slate-200 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Branch name" value={branch.name || ""} onChange={(value) => update(index, "name", value)} />
          <Field label="Branch phone" value={branch.phone || ""} onChange={(value) => update(index, "phone", value)} />
          <Field label="Branch address" value={branch.address || ""} onChange={(value) => update(index, "address", value)} />
          <Field label="Opening time" type="time" value={branch.workingHours?.start || "07:00"} onChange={(value) => updateHours(index, "start", value)} />
          <Field label="Closing time" type="time" value={branch.workingHours?.end || "19:00"} onChange={(value) => updateHours(index, "end", value)} />
          <Field label="Bookings at the same time" type="number" value={String(branch.simultaneousCollections || 1)} onChange={(value) => update(index, "simultaneousCollections", Number(value || 1))} />
          <div className="sm:col-span-2"><Field label="Home collection areas (comma separated)" placeholder="Rohini, Pitampura, Shalimar Bagh" value={(branch.homeCollectionAreas || []).join(", ")} onChange={(value) => update(index, "homeCollectionAreas", splitComma(value))} /></div>
          <Field label="Home collection charge" type="number" value={String(branch.homeCollectionCharge || 0)} onChange={(value) => update(index, "homeCollectionCharge", Number(value || 0))} />
        </div>
        <div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={branch.active !== false} onChange={(event) => update(index, "active", event.target.checked)} /> Branch active</label><button type="button" onClick={() => onChange(branches.filter((_, row) => row !== index))} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700 hover:bg-rose-50"><Trash2 className="h-4 w-4" />Remove</button></div>
      </div>)}
      {!branches.length && <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No branches added. Add your first diagnostic centre to enable collection scheduling.</p>}
      <button type="button" onClick={add} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-bold hover:bg-slate-50"><Plus className="h-4 w-4" />Add branch</button>
    </div>
  </Section>;
}

function RealEstateTeamEditor({ realEstate, onChange }: { realEstate: any; onChange: (key: string, value: unknown) => void }) {
  const executives = realEstate.executives || [];
  const update = (index: number, key: string, value: unknown) => onChange("executives", executives.map((member: any, row: number) => row === index ? { ...member, [key]: value } : member));
  const updateHours = (index: number, key: "start" | "end", value: string) => onChange("executives", executives.map((member: any, row: number) => row === index ? { ...member, workingHours: { start: member.workingHours?.start || "09:00", end: member.workingHours?.end || "18:00", [key]: value } } : member));
  const toggleMemberDay = (index: number, day: number) => {
    const current = executives[index]?.workingDays || [];
    update(index, "workingDays", current.includes(day) ? current.filter((item: number) => item !== day) : [...current, day].sort());
  };
  const add = () => onChange("executives", [...executives, { name: "", role: "Sales Executive", phone: "", email: "", workingDays: [1, 2, 3, 4, 5, 6], workingHours: { start: "09:00", end: "18:00" }, active: true }]);
  return <Section title="Site visits & sales team" description="Set visit timing and the executives who can attend property visits.">
    <div className="grid gap-4 sm:grid-cols-2"><Field label="Standard visit duration (minutes)" type="number" value={String(realEstate.visitDurationMinutes || 60)} onChange={(value) => onChange("visitDurationMinutes", Number(value || 60))} /><Field label="Travel buffer between visits (minutes)" type="number" value={String(realEstate.visitBufferMinutes ?? 30)} onChange={(value) => onChange("visitBufferMinutes", Number(value || 0))} /></div>
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between"><div><h3 className="font-black">Sales executives</h3><p className="text-sm text-slate-500">Availability is calculated from each active executive&apos;s schedule.</p></div><button type="button" onClick={add} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-bold hover:bg-slate-50"><Plus className="h-4 w-4" />Add executive</button></div>
      {executives.map((member: any, index: number) => <div key={member._id || index} className="rounded-lg border border-slate-200 p-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Executive name" value={member.name || ""} onChange={(value) => update(index, "name", value)} /><Field label="Role" value={member.role || "Sales Executive"} onChange={(value) => update(index, "role", value)} /><Field label="Phone" value={member.phone || ""} onChange={(value) => update(index, "phone", value)} /><Field label="Email" type="email" value={member.email || ""} onChange={(value) => update(index, "email", value)} /><Field label="Available from" type="time" value={member.workingHours?.start || "09:00"} onChange={(value) => updateHours(index, "start", value)} /><Field label="Available until" type="time" value={member.workingHours?.end || "18:00"} onChange={(value) => updateHours(index, "end", value)} /></div>
        <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-700">Working days</p><div className="flex flex-wrap gap-2">{days.map((day, dayIndex) => <button key={day} type="button" onClick={() => toggleMemberDay(index, dayIndex)} className={`h-8 rounded-md border px-2.5 text-xs font-bold ${(member.workingDays || []).includes(dayIndex) ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-300 text-slate-500"}`}>{day}</button>)}</div></div>
        <div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={member.active !== false} onChange={(event) => update(index, "active", event.target.checked)} />Available for site visits</label><button type="button" onClick={() => onChange("executives", executives.filter((_: any, row: number) => row !== index))} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Remove</button></div>
      </div>)}
      {!executives.length && <p className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">No sales executives added. Add one to start scheduling site visits.</p>}
    </div>
  </Section>;
}

function SupportEditor({ support, onChange }: { support: any; onChange: (key: string, value: unknown) => void }) {
  const knowledge = support.knowledge || [];
  const resources = support.resources || [];
  const updateKnowledge = (index: number, key: string, value: unknown) => onChange("knowledge", knowledge.map((article: any, row: number) => row === index ? { ...article, [key]: value } : article));
  const updateResource = (index: number, key: string, value: unknown) => onChange("resources", resources.map((resource: any, row: number) => row === index ? { ...resource, [key]: value } : resource));
  return <div className="space-y-6">
    <Section title="Support operations" description="Products, ticket categories and expected response time."><div className="grid gap-4 md:grid-cols-3"><Field label="Products or services" value={(support.products || []).join(", ")} onChange={(value) => onChange("products", splitComma(value))} /><Field label="Ticket categories" value={(support.ticketCategories || []).join(", ")} onChange={(value) => onChange("ticketCategories", splitComma(value))} /><Field label="Response SLA (hours)" type="number" value={String(support.slaHours || 24)} onChange={(value) => onChange("slaHours", Number(value || 24))} /></div></Section>
    <Section title="Approved answers" description="Add the answers your support team has approved for common customer questions."><div className="space-y-4">{knowledge.map((article: any, index: number) => <div key={article._id || index} className="rounded-lg border border-slate-200 p-4"><div className="grid gap-4 sm:grid-cols-3"><Field label="Title" value={article.title || ""} onChange={(value) => updateKnowledge(index, "title", value)} /><Field label="Category" value={article.category || "general"} onChange={(value) => updateKnowledge(index, "category", value)} /><Field label="Product or service" value={article.product || ""} onChange={(value) => updateKnowledge(index, "product", value)} /></div><div className="mt-4"><Area label="Approved answer" rows={4} value={article.answer || ""} onChange={(value) => updateKnowledge(index, "answer", value)} /></div><div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={article.active !== false} onChange={(event) => updateKnowledge(index, "active", event.target.checked)} />Available to support staff</label><button type="button" onClick={() => onChange("knowledge", knowledge.filter((_: any, row: number) => row !== index))} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Remove</button></div></div>)}<button type="button" onClick={() => onChange("knowledge", [...knowledge, { title: "", category: "general", product: "", answer: "", active: true }])} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-bold"><Plus className="h-4 w-4" />Add approved answer</button></div></Section>
    <Section title="Customer resources" description="Add approved links, documents, videos or payment pages that can be shared with customers."><div className="space-y-4">{resources.map((resource: any, index: number) => <div key={resource._id || index} className="rounded-lg border border-slate-200 p-4"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Resource name" value={resource.name || ""} onChange={(value) => updateResource(index, "name", value)} /><label><span className="mb-1.5 block text-sm font-bold text-slate-700">Resource type</span><select value={resource.type || "link"} onChange={(event) => updateResource(index, "type", event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm"><option value="link">Link</option><option value="document">Document</option><option value="video">Video</option><option value="payment">Payment</option><option value="details">Details</option></select></label><Field label="HTTPS URL" type="url" value={resource.url || ""} onChange={(value) => updateResource(index, "url", value)} /><Field label="Product or service" value={resource.product || ""} onChange={(value) => updateResource(index, "product", value)} /></div><div className="mt-4 flex items-center justify-between"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={resource.active !== false} onChange={(event) => updateResource(index, "active", event.target.checked)} />Available to share</label><button type="button" onClick={() => onChange("resources", resources.filter((_: any, row: number) => row !== index))} className="inline-flex h-9 items-center gap-2 rounded-md border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="h-4 w-4" />Remove</button></div></div>)}<button type="button" onClick={() => onChange("resources", [...resources, { name: "", type: "link", url: "", product: "", active: true }])} className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 px-4 text-sm font-bold"><Plus className="h-4 w-4" />Add resource</button></div></Section>
  </div>;
}
function Field({ label, value, onChange, type = "text", placeholder = "", span = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; span?: boolean }) { return <label className={span ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><input type={type} value={value || ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>; }
function Area({ label, value, onChange, rows = 5 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <label><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><textarea value={value || ""} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>; }
function Notice({ tone, text }: { tone: "success" | "error"; text: string }) { return <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{text}</div>; }
