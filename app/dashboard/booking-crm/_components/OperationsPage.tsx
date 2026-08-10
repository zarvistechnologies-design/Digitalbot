"use client";

import Sidebar from "@/components/Sidebar";
import { bookingCrmAPI, campaignsAPI } from "@/lib/api";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ListTodo,
  Loader2,
  Megaphone,
  Menu,
  Pause,
  Phone,
  PhoneIncoming,
  Play,
  RefreshCw,
  Search,
  TimerReset,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export type OperationsPageKind = "campaigns" | "followups";

interface Terminology {
  booking: string;
  bookings: string;
  customer: string;
  customers: string;
}

interface BookingProfile {
  timezone?: string;
  assignedPhoneNumber?: string;
  terminology?: Partial<Terminology>;
  onboardingComplete?: boolean;
}

interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  followUpAt?: string | null;
  followUpStatus?: "not_scheduled" | "scheduled" | "processing" | "initiated" | "completed" | "failed" | "cancelled";
  followUpProvider?: string;
  followUpAttempts?: number;
  followUpCallId?: string;
  followUpLastError?: string;
  customFields?: Record<string, unknown>;
}

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";
  targetAudience?: string;
  totalContacts: number;
  contacted: number;
  successful: number;
  failed: number;
  pending: number;
  performance?: { conversionRate?: number };
  metadata?: {
    outboundProvider?: string;
    callResults?: Array<{ status?: string; callId?: string; error?: string }>;
  };
}

const defaultTerms: Terminology = {
  booking: "Booking",
  bookings: "Bookings",
  customer: "Customer",
  customers: "Customers",
};

const pageConfig: Record<OperationsPageKind, { title: string; eyebrow: string; description: string; icon: LucideIcon }> = {
  campaigns: {
    title: "Bulk Campaigns",
    eyebrow: "Outbound operations",
    description: "Launch and monitor outbound voice campaigns for bookings and follow-ups.",
    icon: Megaphone,
  },
  followups: {
    title: "Follow-ups",
    eyebrow: "Booking operations",
    description: "Schedule callbacks, clear overdue work, and keep every booking lead moving.",
    icon: ListTodo,
  },
};

function pretty(value?: string) {
  return String(value || "Unknown").replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function getErrorMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: { error?: string; message?: string } } };
  return apiError.response?.data?.error || apiError.response?.data?.message || fallback;
}

export default function OperationsPage({ kind }: { kind: OperationsPageKind }) {
  const router = useRouter();
  const config = pageConfig[kind];
  const PageIcon = config.icon;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<BookingProfile>({ timezone: "Asia/Kolkata" });
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const terms = useMemo(() => ({ ...defaultTerms, ...(profile.terminology || {}) }), [profile.terminology]);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileResponse = await bookingCrmAPI.getProfile();
      const nextProfile = profileResponse.data.profile || {};
      if (!nextProfile.onboardingComplete) {
        router.replace("/dashboard/booking-crm/setup");
        return;
      }
      setProfile(nextProfile);

      if (kind === "campaigns") {
        const campaignsResponse = await campaignsAPI.getCampaigns({ limit: 200 });
        const payload = campaignsResponse.data;
        const rows = payload.data?.campaigns || payload.campaigns || [];
        setCampaigns(Array.isArray(rows) ? rows : []);
      }

      if (kind === "followups") {
        const bookingsResponse = await bookingCrmAPI.getBookings({ limit: 500 });
        setBookings(bookingsResponse.data.bookings || []);
      }
    } catch (loadError: any) {
      if (loadError.response?.status === 403) {
        router.replace("/dashboard");
        return;
      }
      setError(getErrorMessage(loadError, `Could not load ${config.title.toLowerCase()}`));
    } finally {
      setLoading(false);
    }
  }, [config.title, kind, router]);
  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3500);
  };

  const runCampaignAction = async (campaign: Campaign, action: "launch" | "pause" | "resume") => {
    try {
      setSavingId(campaign._id);
      setError(null);
      if (action === "launch") await campaignsAPI.launch(campaign._id);
      if (action === "pause") await campaignsAPI.pause(campaign._id);
      if (action === "resume") await campaignsAPI.resume(campaign._id);
      notify(`${campaign.name} ${action === "launch" ? "launched" : action === "pause" ? "paused" : "resumed"}`);
      await loadPage();
    } catch (actionError) {
      setError(getErrorMessage(actionError, `Could not ${action} campaign`));
    } finally {
      setSavingId(null);
    }
  };

  const updateBooking = async (booking: Booking, data: Record<string, unknown>, successText: string) => {
    try {
      setSavingId(booking._id);
      setError(null);
      await bookingCrmAPI.updateBooking(booking._id, data);
      notify(successText);
      await loadPage();
    } catch (updateError) {
      setError(getErrorMessage(updateError, "Could not update follow-up"));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      {!sidebarOpen && (
        <button aria-label="Open navigation" onClick={() => setSidebarOpen(true)} className="fixed left-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-md border border-zinc-200 bg-white shadow-sm lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64">
        <header className="border-b border-zinc-200 bg-white">
          <div className="px-4 pb-0 pt-20 sm:px-6 lg:px-8 lg:pt-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
                  <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">Live workspace</span>
                  <span>{config.eyebrow}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-orange-50 text-orange-700"><PageIcon className="h-5 w-5" /></div>
                  <div>
                    <h1 className="text-2xl font-bold lg:text-3xl">{config.title}</h1>
                    <p className="mt-1 max-w-2xl text-sm text-zinc-500">{config.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" />{profile.assignedPhoneNumber || "Voice number connected"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{profile.timezone || "Asia/Kolkata"}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/dashboard/booking-crm" className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"><ArrowLeft className="h-4 w-4" />Booking Workspace</Link>
                <button onClick={() => void loadPage()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
                {kind === "campaigns" && <Link href="/dashboard/campaigns" className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">New campaign <ArrowUpRight className="h-4 w-4" /></Link>}
              </div>
            </div>

          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {message && <Notice tone="success" message={message} onClose={() => setMessage(null)} />}
          {error && <Notice tone="error" message={error} onClose={() => setError(null)} />}
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>
          ) : kind === "campaigns" ? (
            <BulkCampaigns campaigns={campaigns} savingId={savingId} onAction={runCampaignAction} />
          ) : (
            <FollowUps bookings={bookings} terms={terms} savingId={savingId} onUpdate={updateBooking} />
          )}
        </div>
      </main>
    </div>
  );
}

function BulkCampaigns({ campaigns, savingId, onAction }: { campaigns: Campaign[]; savingId: string | null; onAction: (campaign: Campaign, action: "launch" | "pause" | "resume") => Promise<void> }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const active = campaigns.filter((campaign) => campaign.status === "active").length;
  const contacts = campaigns.reduce((sum, campaign) => sum + Number(campaign.totalContacts || 0), 0);
  const successful = campaigns.reduce((sum, campaign) => sum + Number(campaign.successful || 0), 0);
  const filtered = campaigns.filter((campaign) => (status === "all" || campaign.status === status) && (!search.trim() || [campaign.name, campaign.targetAudience, campaign.type].some((value) => String(value || "").toLowerCase().includes(search.toLowerCase().trim()))));

  return <div className="space-y-6">
    <Metrics items={[
      { label: "Campaigns", value: campaigns.length, note: "Workspace outbound campaigns", icon: Megaphone, tone: "orange" },
      { label: "Active now", value: active, note: "Campaigns currently calling", icon: PhoneIncoming, tone: "emerald" },
      { label: "Total contacts", value: contacts, note: "Uploaded campaign audience", icon: Users, tone: "blue" },
      { label: "Calls initiated", value: successful, note: contacts ? `${Math.round((successful / contacts) * 100)}% of contacts accepted` : "No contacts yet", icon: CheckCircle2, tone: "violet" },
    ]} />
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <SectionHeader title="Outbound campaign control" subtitle={`${filtered.length} campaigns shown`} action={<Link href="/dashboard/campaigns" className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white">Campaign builder <ArrowUpRight className="h-4 w-4" /></Link>} />
      <FilterBar search={search} setSearch={setSearch} placeholder="Search campaigns" value={status} setValue={setStatus} options={[{ value: "all", label: "All statuses" }, { value: "draft", label: "Draft" }, { value: "scheduled", label: "Scheduled" }, { value: "active", label: "Active" }, { value: "paused", label: "Paused" }, { value: "completed", label: "Completed" }]} />
      {filtered.length ? <div className="overflow-x-auto"><table className="min-w-[1040px] w-full text-left text-sm"><thead className="border-y border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500"><tr><Th>Campaign</Th><Th>Provider</Th><Th>Status</Th><Th>Progress</Th><Th>Initiated</Th><Th>Conversion</Th><Th>Action</Th></tr></thead><tbody className="divide-y divide-zinc-100">{filtered.map((campaign) => {
        const progress = campaign.totalContacts ? Math.min(100, Math.round((Number(campaign.contacted || 0) / campaign.totalContacts) * 100)) : 0;
        const conversion = Number(campaign.performance?.conversionRate || (campaign.contacted ? (campaign.successful / campaign.contacted) * 100 : 0));
        const busy = savingId === campaign._id;
        return <tr key={campaign._id} className="hover:bg-zinc-50"><Td><p className="font-semibold">{campaign.name}</p><p className="text-xs text-zinc-500">{campaign.targetAudience || pretty(campaign.type)}</p></Td><Td><Badge value={campaign.metadata?.outboundProvider || "not started"} /></Td><Td><Badge value={campaign.status} /></Td><Td><div className="w-40"><div className="mb-1 flex justify-between text-xs text-zinc-500"><span>{campaign.contacted || 0}/{campaign.totalContacts || 0}</span><span>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded bg-zinc-100"><div className="h-full rounded bg-orange-500" style={{ width: `${progress}%` }} /></div></div></Td><Td>{campaign.successful || 0}</Td><Td>{conversion.toFixed(1)}%</Td><Td><CampaignAction campaign={campaign} busy={busy} onAction={onAction} /></Td></tr>;
      })}</tbody></table></div> : <EmptyState icon={Megaphone} title="No matching campaigns" text="Create a campaign, upload contacts, choose the voice agent, and launch bulk calls." action={<Link href="/dashboard/campaigns" className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white">Open campaign builder <ArrowUpRight className="h-4 w-4" /></Link>} />}
    </section>
  </div>;
}

function CampaignAction({ campaign, busy, onAction }: { campaign: Campaign; busy: boolean; onAction: (campaign: Campaign, action: "launch" | "pause" | "resume") => Promise<void> }) {
  if (busy) return <Loader2 className="h-4 w-4 animate-spin text-orange-600" />;
  if (campaign.status === "draft") return <button onClick={() => void onAction(campaign, "launch")} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-2.5 text-xs font-semibold text-white"><Play className="h-3.5 w-3.5" />Launch</button>;
  if (campaign.status === "active") return <button onClick={() => void onAction(campaign, "pause")} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 text-xs font-semibold text-amber-700"><Pause className="h-3.5 w-3.5" />Pause</button>;
  if (campaign.status === "paused") return <button onClick={() => void onAction(campaign, "resume")} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-zinc-950 px-2.5 text-xs font-semibold text-white"><Play className="h-3.5 w-3.5" />Resume</button>;
  return <span className="text-xs text-zinc-400">No action</span>;
}

function FollowUps({ bookings, terms, savingId, onUpdate }: { bookings: Booking[]; terms: Terminology; savingId: string | null; onUpdate: (booking: Booking, data: Record<string, unknown>, text: string) => Promise<void> }) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const scheduled = bookings.filter((booking) => booking.followUpAt && !booking.customFields?.followUpCompleted).sort((a, b) => new Date(a.followUpAt as string).getTime() - new Date(b.followUpAt as string).getTime());
  const unscheduled = bookings.filter((booking) => !booking.followUpAt && ["new_lead", "tentative"].includes(booking.status) && !booking.customFields?.followUpCompleted);
  const overdue = scheduled.filter((booking) => new Date(booking.followUpAt as string).getTime() < Date.now()).length;
  const today = scheduled.filter((booking) => new Date(booking.followUpAt as string).toDateString() === new Date().toDateString()).length;
  const needle = search.toLowerCase().trim();
  const visibleScheduled = scheduled.filter((booking) => {
    const due = new Date(booking.followUpAt as string);
    const matchesFilter = filter === "all" || (filter === "today" && due.toDateString() === new Date().toDateString()) || (filter === "overdue" && due.getTime() < Date.now());
    return matchesFilter && (!needle || [booking.customerName, booking.customerPhone, booking.serviceName].some((value) => String(value || "").toLowerCase().includes(needle)));
  });
  const visibleUnscheduled = unscheduled.filter((booking) => !needle || [booking.customerName, booking.customerPhone, booking.serviceName].some((value) => String(value || "").toLowerCase().includes(needle)));

  const schedule = async (booking: Booking) => {
    const value = drafts[booking._id];
    if (!value) return;
    await onUpdate(booking, { followUpAt: new Date(value).toISOString(), customFields: { ...(booking.customFields || {}), followUpCompleted: false } }, "Follow-up scheduled");
    setDrafts((current) => ({ ...current, [booking._id]: "" }));
  };

  const retry = async (booking: Booking) => {
    await onUpdate(booking, {
      followUpAt: new Date().toISOString(),
      customFields: { ...(booking.customFields || {}), followUpCompleted: false },
    }, "Follow-up queued for retry");
  };

  return <div className="space-y-6">
    <Metrics items={[
      { label: "Scheduled", value: scheduled.length, note: "Active follow-up tasks", icon: ListTodo, tone: "orange" },
      { label: "Due today", value: today, note: "Calls to complete today", icon: Clock3, tone: "emerald" },
      { label: "Overdue", value: overdue, note: "Needs immediate attention", icon: TimerReset, tone: "blue" },
      { label: "Needs scheduling", value: unscheduled.length, note: `New and tentative ${terms.bookings.toLowerCase()}`, icon: CalendarDays, tone: "violet" },
    ]} />
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <SectionHeader title="Scheduled follow-ups" subtitle={`${visibleScheduled.length} callbacks shown`} />
      <FilterBar search={search} setSearch={setSearch} placeholder={`Search ${terms.customers.toLowerCase()} or ${terms.bookings.toLowerCase()}`} value={filter} setValue={setFilter} options={[{ value: "all", label: "All scheduled" }, { value: "today", label: "Due today" }, { value: "overdue", label: "Overdue" }]} />
      {visibleScheduled.length ? <div className="overflow-x-auto"><table className="min-w-[980px] w-full text-left text-sm"><thead className="border-y border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500"><tr><Th>{terms.customer}</Th><Th>{terms.booking}</Th><Th>Follow-up time</Th><Th>Call status</Th><Th>Priority</Th><Th>Action</Th></tr></thead><tbody className="divide-y divide-zinc-100">{visibleScheduled.map((booking) => {
        const isOverdue = new Date(booking.followUpAt as string).getTime() < Date.now();
        const callStatus = booking.followUpStatus || "scheduled";
        return <tr key={booking._id} className="hover:bg-zinc-50"><Td><p className="font-semibold">{booking.customerName}</p><p className="text-xs text-zinc-500">{booking.customerPhone}</p></Td><Td><p>{booking.serviceName}</p><p className="text-xs text-zinc-500">{new Date(booking.bookingDate).toLocaleDateString("en-IN")}</p></Td><Td>{new Date(booking.followUpAt as string).toLocaleString("en-IN")}</Td><Td><Badge value={callStatus} />{booking.followUpCallId && <p className="mt-1 max-w-44 truncate text-xs text-zinc-500" title={booking.followUpCallId}>Call {booking.followUpCallId}</p>}{booking.followUpLastError && <p className="mt-1 max-w-56 text-xs text-rose-600" title={booking.followUpLastError}>{booking.followUpLastError}</p>}</Td><Td><Badge value={isOverdue && !["initiated", "completed"].includes(callStatus) ? "overdue" : "scheduled"} /></Td><Td><div className="flex items-center gap-2">{callStatus === "failed" && <button disabled={savingId === booking._id} onClick={() => void retry(booking)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-zinc-950 px-2.5 text-xs font-semibold text-white disabled:opacity-50">{savingId === booking._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}Retry call</button>}<button disabled={savingId === booking._id} onClick={() => void onUpdate(booking, { followUpAt: null, customFields: { ...(booking.customFields || {}), followUpCompleted: true } }, "Follow-up completed")} className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700 disabled:opacity-50">{savingId === booking._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}Complete</button></div></Td></tr>;
      })}</tbody></table></div> : <EmptyState icon={ListTodo} title="No matching scheduled follow-ups" text="Scheduled callbacks will appear here in due-time order." />}
    </section>
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <SectionHeader title="Needs follow-up scheduling" subtitle={`New leads and tentative ${terms.bookings.toLowerCase()} without a callback time`} />
      {visibleUnscheduled.length ? <div className="divide-y divide-zinc-100">{visibleUnscheduled.map((booking) => <div key={booking._id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-center"><div><p className="font-semibold">{booking.customerName}</p><p className="mt-1 text-sm text-zinc-500">{booking.customerPhone} - {booking.serviceName} - {pretty(booking.status)}</p></div><input aria-label={`Follow-up time for ${booking.customerName}`} type="datetime-local" value={drafts[booking._id] || ""} onChange={(event) => setDrafts((current) => ({ ...current, [booking._id]: event.target.value }))} className="h-10 rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /><button disabled={!drafts[booking._id] || savingId === booking._id} onClick={() => void schedule(booking)} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white disabled:opacity-40">{savingId === booking._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock3 className="h-4 w-4" />}Schedule</button></div>)}</div> : <EmptyState icon={CheckCircle2} title="Follow-up queue is clear" text="New leads and tentative bookings will appear here automatically." />}
    </section>
  </div>;
}

type Tone = "orange" | "emerald" | "blue" | "violet";

function Metrics({ items }: { items: Array<{ label: string; value: string | number; note: string; icon: LucideIcon; tone: Tone }> }) {
  const tones: Record<Tone, string> = { orange: "bg-orange-50 text-orange-700", emerald: "bg-emerald-50 text-emerald-700", blue: "bg-sky-50 text-sky-700", violet: "bg-violet-50 text-violet-700" };
  return <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{items.map((item) => { const Icon = item.icon; return <article key={item.label} className="rounded-md border border-zinc-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-zinc-500">{item.label}</p><p className="mt-2 text-2xl font-bold">{item.value}</p></div><div className={`grid h-9 w-9 place-items-center rounded ${tones[item.tone]}`}><Icon className="h-5 w-5" /></div></div><p className="mt-3 text-xs text-zinc-500">{item.note}</p></article>; })}</section>;
}

function FilterBar({ search, setSearch, placeholder, value, setValue, options }: { search: string; setSearch: (value: string) => void; placeholder: string; value: string; setValue: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row"><label className="relative flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={placeholder} className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label><select aria-label="Filter status" value={value} onChange={(event) => setValue(event.target.value)} className="h-10 min-w-44 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 outline-none focus:border-orange-500">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div>;
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold">{title}</h2>{subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}</div>{action}</div>;
}

function Badge({ value }: { value: string }) {
  const colors: Record<string, string> = { completed: "border-emerald-200 bg-emerald-50 text-emerald-700", initiated: "border-emerald-200 bg-emerald-50 text-emerald-700", vozon: "border-emerald-200 bg-emerald-50 text-emerald-700", "user-ended": "border-emerald-200 bg-emerald-50 text-emerald-700", "agent-ended": "border-emerald-200 bg-emerald-50 text-emerald-700", active: "border-emerald-200 bg-emerald-50 text-emerald-700", missed: "border-rose-200 bg-rose-50 text-rose-700", failed: "border-rose-200 bg-rose-50 text-rose-700", overdue: "border-rose-200 bg-rose-50 text-rose-700", cancelled: "border-rose-200 bg-rose-50 text-rose-700", paused: "border-amber-200 bg-amber-50 text-amber-700", processing: "border-amber-200 bg-amber-50 text-amber-700", "no-answer": "border-amber-200 bg-amber-50 text-amber-700", busy: "border-amber-200 bg-amber-50 text-amber-700", scheduled: "border-sky-200 bg-sky-50 text-sky-700", ongoing: "border-sky-200 bg-sky-50 text-sky-700", "in-progress": "border-sky-200 bg-sky-50 text-sky-700", draft: "border-zinc-200 bg-zinc-50 text-zinc-700", "not started": "border-zinc-200 bg-zinc-50 text-zinc-600" };
  return <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[11px] font-semibold ${colors[value] || "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>{pretty(value)}</span>;
}

function Notice({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose: () => void }) {
  const success = tone === "success";
  return <div className={`mb-5 flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}><span className="flex-1 font-medium">{message}</span><button aria-label="Dismiss message" onClick={onClose} className="rounded p-1 hover:bg-white/60"><X className="h-4 w-4" /></button></div>;
}

function EmptyState({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: React.ReactNode }) {
  return <div className="border-t border-zinc-200 px-6 py-14 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded bg-zinc-100 text-zinc-400"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{text}</p>{action}</div>;
}

function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-4 align-middle">{children}</td>; }
