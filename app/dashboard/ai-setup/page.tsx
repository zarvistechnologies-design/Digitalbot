"use client";

import Sidebar from "@/components/Sidebar";
import { authAPI, workspaceAiAPI, type WorkspaceAiReadiness } from "@/lib/api";
import { CheckCircle2, CircleAlert, Loader2, Menu, Save, Sparkles, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
    "lead-analysis": "Lead Analysis",
    "real-estate-crm": "Real Estate CRM",
    "customer-support": "Customer Support",
  };
  return names[service] || pretty(service || "Workspace");
}

export default function AiToolSetupPage() {
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
      .catch((loadError) => setError(loadError.response?.data?.error || "Could not load AI workspace setup."))
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

  const branchText = useMemo(() => (config.pathology.branches || []).map((branch: any) => [branch.name, branch.workingHours?.start || "07:00", branch.workingHours?.end || "19:00", (branch.homeCollectionAreas || []).join(","), branch.simultaneousCollections || 1, branch.homeCollectionCharge || 0].join(" | ")).join("\n"), [config.pathology.branches]);
  const executiveText = useMemo(() => (config.realEstate.executives || []).map((member: any) => [member.name, member.role || "Sales Executive", member.workingHours?.start || "09:00", member.workingHours?.end || "18:00", (member.workingDays || [1, 2, 3, 4, 5, 6]).join(",")].join(" | ")).join("\n"), [config.realEstate.executives]);
  const knowledgeText = useMemo(() => (config.support.knowledge || []).map((article: any) => [article.title, article.category || "general", article.product || "", article.answer].join(" | ")).join("\n"), [config.support.knowledge]);
  const resourceText = useMemo(() => (config.support.resources || []).map((resource: any) => [resource.name, resource.type || "link", resource.url, resource.product || ""].join(" | ")).join("\n"), [config.support.resources]);

  const save = async () => {
    try {
      setSaving(true); setError(""); setMessage("");
      const response = await workspaceAiAPI.save(config);
      setConfig(mergeConfig(response.data.config));
      setReadiness(response.data.readiness);
      setMessage("AI workspace setup saved. Connected Vozon agents will read the updated data automatically.");
    } catch (saveError: any) {
      setError(saveError.response?.data?.error || "Could not save AI workspace setup.");
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
            <div><p className="text-xs font-bold uppercase tracking-widest text-orange-700">{serviceLabel(service)}</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">AI & Tool Setup</h1><p className="mt-2 max-w-3xl text-sm text-slate-500">This is the live source of truth for your workspace tools. Enter it once; Vozon reads the current data through DigitalBot.</p></div>
            <button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-bold text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving" : "Save setup"}</button>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
          {error && <Notice tone="error" text={error} />}{message && <Notice tone="success" text={message} />}

          <section className={`rounded-xl border p-5 ${readiness?.ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3">{readiness?.ready ? <CheckCircle2 className="h-7 w-7 text-emerald-700" /> : <CircleAlert className="h-7 w-7 text-amber-700" />}<div><h2 className="font-black">{readiness?.ready ? "Workspace ready for AI tools" : "Complete the required setup"}</h2><p className="mt-1 text-sm opacity-75">{readiness?.toolCount || 0} workspace-specific tools will be selected automatically.</p></div></div><span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-black"><Wrench className="h-3.5 w-3.5" />Vozon auto-sync</span></div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">{readiness?.checks.map((check) => <div key={check.key} className="rounded-lg border border-black/10 bg-white/80 p-3"><p className="flex items-center gap-2 text-sm font-bold">{check.complete ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <CircleAlert className="h-4 w-4 text-amber-600" />}{check.label}</p><p className="mt-1 pl-6 text-xs text-slate-500">{check.detail}</p></div>)}</div>
          </section>

          <Section title="Business source of truth" description="Shared identity, hours and closures used by this workspace's AI tools.">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Business name" value={config.business.name} onChange={(value) => setBusiness("name", value)} /><Field label="Contact phone" value={config.business.contactPhone} onChange={(value) => setBusiness("contactPhone", value)} /><Field label="Address" value={config.business.address} onChange={(value) => setBusiness("address", value)} span /><Field label="Timezone" value={config.business.timezone} onChange={(value) => setBusiness("timezone", value)} /><div className="grid grid-cols-2 gap-3"><Field label="Opening" type="time" value={config.business.workingHours.start} onChange={(value) => setBusiness("workingHours", { ...config.business.workingHours, start: value })} /><Field label="Closing" type="time" value={config.business.workingHours.end} onChange={(value) => setBusiness("workingHours", { ...config.business.workingHours, end: value })} /></div></div>
            <div className="mt-4"><p className="mb-2 text-sm font-bold text-slate-700">Working days</p><div className="flex flex-wrap gap-2">{days.map((day, index) => <button key={day} type="button" onClick={() => toggleDay(index)} className={`h-9 rounded-md border px-3 text-xs font-bold ${config.business.workingDays.includes(index) ? "border-slate-950 bg-slate-950 text-white" : "border-slate-300 bg-white text-slate-500"}`}>{day}</button>)}</div></div>
            <div className="mt-4"><Field label="Closed dates" value={(config.business.closedDates || []).join(", ")} placeholder="2026-10-02, 2026-12-25" onChange={(value) => setBusiness("closedDates", splitComma(value))} /></div>
          </Section>

          <Section title="Customer policies" description="The AI uses these approved rules when customers ask to change or cancel an operation."><div className="grid gap-4 md:grid-cols-2"><Area label="Cancellation policy" value={config.policies.cancellation} onChange={(value) => setPolicy("cancellation", value)} /><Area label="Rescheduling policy" value={config.policies.rescheduling} onChange={(value) => setPolicy("rescheduling", value)} /><Area label="Confirmation rules" value={config.policies.confirmation} onChange={(value) => setPolicy("confirmation", value)} /><Area label="Human escalation rules" value={config.policies.escalation} onChange={(value) => setPolicy("escalation", value)} /></div></Section>

          {service === "event-booking-crm" && <Section title="Booking links" description="Services, resources and availability remain managed in Booking Workspace. Add approved delivery links here."><div className="grid gap-4 md:grid-cols-3"><Field label="Booking link" type="url" value={config.event.bookingLink} onChange={(value) => setDomain("event", "bookingLink", value)} /><Field label="Event/details link" type="url" value={config.event.detailsLink} onChange={(value) => setDomain("event", "detailsLink", value)} /><Field label="Payment link" type="url" value={config.event.paymentLink} onChange={(value) => setDomain("event", "paymentLink", value)} /></div></Section>}

          {service === "pathology-diagnostic" && <Section title="Branches and collection capacity" description="One branch per line: Name | Start | End | Home areas comma-separated | Capacity | Home charge"><Area label="Diagnostic branches" rows={7} value={branchText} onChange={(value) => setDomain("pathology", "branches", splitLines(value).map((line) => { const [name, start = "07:00", end = "19:00", areas = "", capacity = "1", charge = "0"] = line.split("|").map((part) => part.trim()); return { name, workingDays: config.business.workingDays, workingHours: { start, end }, homeCollectionAreas: splitComma(areas), simultaneousCollections: Number(capacity || 1), homeCollectionCharge: Number(charge || 0), active: true }; }))} /></Section>}

          {service === "lead-analysis" && <Section title="Lead qualification" description="Structured CRM rules are more reliable than keeping all qualification logic inside the prompt."><div className="grid gap-4 md:grid-cols-2"><Area label="Qualification questions — one per line" value={(config.lead.qualificationQuestions || []).join("\n")} onChange={(value) => setDomain("lead", "qualificationQuestions", splitLines(value))} /><div className="grid gap-4"><Field label="Pipeline stages" value={(config.lead.pipelineStages || []).join(", ")} onChange={(value) => setDomain("lead", "pipelineStages", splitComma(value))} /><div className="grid grid-cols-2 gap-3"><Field label="Hot score" type="number" value={String(config.lead.hotThreshold)} onChange={(value) => setDomain("lead", "hotThreshold", Number(value))} /><Field label="Warm score" type="number" value={String(config.lead.warmThreshold)} onChange={(value) => setDomain("lead", "warmThreshold", Number(value))} /></div><Field label="Default follow-up hours" type="number" value={String(config.lead.followUpHours)} onChange={(value) => setDomain("lead", "followUpHours", Number(value))} /></div></div></Section>}

          {service === "real-estate-crm" && <Section title="Site-visit availability" description="One executive per line: Name | Role | Start | End | Working-day numbers"><div className="grid gap-4 md:grid-cols-[1fr_280px]"><Area label="Sales executives" rows={7} value={executiveText} onChange={(value) => setDomain("realEstate", "executives", splitLines(value).map((line) => { const [name, role = "Sales Executive", start = "09:00", end = "18:00", workingDays = "1,2,3,4,5,6"] = line.split("|").map((part) => part.trim()); return { name, role, workingHours: { start, end }, workingDays: splitComma(workingDays).map(Number), active: true }; }))} /><div className="grid content-start gap-4"><Field label="Visit duration (minutes)" type="number" value={String(config.realEstate.visitDurationMinutes)} onChange={(value) => setDomain("realEstate", "visitDurationMinutes", Number(value))} /><Field label="Travel buffer (minutes)" type="number" value={String(config.realEstate.visitBufferMinutes)} onChange={(value) => setDomain("realEstate", "visitBufferMinutes", Number(value))} /></div></div></Section>}

          {service === "customer-support" && <Section title="Support CRM source of truth" description="Configure products, approved answers, ticket rules and customer resources."><div className="grid gap-4 md:grid-cols-2"><Field label="Products/services" value={(config.support.products || []).join(", ")} onChange={(value) => setDomain("support", "products", splitComma(value))} /><Field label="Ticket categories" value={(config.support.ticketCategories || []).join(", ")} onChange={(value) => setDomain("support", "ticketCategories", splitComma(value))} /><Field label="SLA hours" type="number" value={String(config.support.slaHours)} onChange={(value) => setDomain("support", "slaHours", Number(value))} /><div /></div><div className="mt-5 grid gap-4 lg:grid-cols-2"><Area label="Knowledge — Title | Category | Product | Approved answer" rows={9} value={knowledgeText} onChange={(value) => setDomain("support", "knowledge", splitLines(value).map((line) => { const [title, category = "general", product = "", ...answer] = line.split("|").map((part) => part.trim()); return { title, category, product, answer: answer.join(" | "), active: true }; }))} /><Area label="Resources — Name | Type | HTTPS URL | Product" rows={9} value={resourceText} onChange={(value) => setDomain("support", "resources", splitLines(value).map((line) => { const [name, type = "link", url = "", product = ""] = line.split("|").map((part) => part.trim()); return { name, type, url, product, active: true }; }))} /></div></Section>}

          <div className="flex justify-end pb-8"><button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-md bg-orange-600 px-6 text-sm font-black text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Save and update AI tools</button></div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-4"><h2 className="font-black">{title}</h2><p className="mt-1 text-sm text-slate-500">{description}</p></div><div className="p-5">{children}</div></section>; }
function Field({ label, value, onChange, type = "text", placeholder = "", span = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; span?: boolean }) { return <label className={span ? "sm:col-span-2" : ""}><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><input type={type} value={value || ""} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>; }
function Area({ label, value, onChange, rows = 5 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) { return <label><span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span><textarea value={value || ""} rows={rows} onChange={(event) => onChange(event.target.value)} className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>; }
function Notice({ tone, text }: { tone: "success" | "error"; text: string }) { return <div className={`rounded-md border px-4 py-3 text-sm font-semibold ${tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{text}</div>; }
