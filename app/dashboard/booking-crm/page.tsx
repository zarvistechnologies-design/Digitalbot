"use client";

import Sidebar from "@/components/Sidebar";
import { bookingCrmAPI } from "@/lib/api";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutDashboard,
  Loader2,
  MapPin,
  Menu,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Store,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type TabId = "overview" | "bookings" | "customers" | "catalog" | "availability" | "settings";
type ModalId = "booking" | "service" | "resource" | null;

interface Terminology {
  booking: string;
  bookings: string;
  customer: string;
  customers: string;
  service: string;
  services: string;
  resource: string;
  resources: string;
}

interface BookingProfile {
  _id?: string;
  businessName: string;
  businessType: string;
  bookingMode: string;
  terminology: Terminology;
  timezone: string;
  defaultStatus: string;
  collectPartySize: boolean;
  confirmationMessage: string;
  assignedPhoneNumber?: string;
  onboardingComplete?: boolean;
  businessTypeLockedAt?: string | null;
}

interface BookingService {
  _id: string;
  name: string;
  category?: string;
  description?: string;
  bookingMode: string;
  durationMinutes: number;
  capacity: number;
  resourceRequired: boolean;
  color?: string;
  active: boolean;
}

interface BookingResource {
  _id: string;
  name: string;
  resourceType: string;
  capacity: number;
  description?: string;
  city?: string;
  address?: string;
  slotDuration: number;
  maxBookingsPerSlot: number;
  allowMultipleBookings: boolean;
  defaultWorkingHours?: { start: string; end: string };
  workingDays?: number[];
  active: boolean;
  color?: string;
}

interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceName: string;
  bookingMode?: string;
  bookingDate: string;
  bookingTime: string;
  endTime?: string;
  resourceName?: string;
  location?: string;
  quantity?: number;
  currency?: string;
  status: string;
  source?: string;
  notes?: string;
  specialRequirements?: string;
  createdAt?: string;
  followUpAt?: string | null;
  customFields?: Record<string, unknown>;
}

interface Customer {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCompany?: string;
  lastBookingAt?: string;
  bookings: number;
  services: string[];
}

interface Totals {
  bookings: number;
  upcoming: number;
  confirmed: number;
  customers: number;
  services: number;
  resources: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
}

const defaultTerms: Terminology = {
  booking: "Booking",
  bookings: "Bookings",
  customer: "Customer",
  customers: "Customers",
  service: "Service",
  services: "Services",
  resource: "Resource",
  resources: "Resources",
};

const defaultProfile: BookingProfile = {
  businessName: "DigitalBot Booking Workspace",
  businessType: "events",
  bookingMode: "time_slot",
  terminology: defaultTerms,
  timezone: "Asia/Kolkata",
  defaultStatus: "tentative",
  collectPartySize: true,
  confirmationMessage: "Your booking request has been saved successfully.",
};

const emptyTotals: Totals = {
  bookings: 0,
  upcoming: 0,
  confirmed: 0,
  customers: 0,
  services: 0,
  resources: 0,
  byStatus: {},
  bySource: {},
};

const emptyBooking = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  serviceId: "",
  resourceId: "",
  bookingDate: "",
  bookingTime: "",
  quantity: "1",
  notes: "",
  specialRequirements: "",
};

const emptyService = {
  name: "",
  category: "",
  description: "",
  bookingMode: "time_slot",
  durationMinutes: "60",
  capacity: "1",
};

const emptyResource = {
  name: "",
  resourceType: "venue",
  city: "",
  address: "",
  description: "",
  capacity: "1",
  slotDuration: "60",
  maxBookingsPerSlot: "1",
  start: "09:00",
  end: "18:00",
};

const tabs: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "customers", label: "Customers", icon: Users },
  { id: "catalog", label: "Catalog", icon: Package },
  { id: "availability", label: "Availability", icon: Clock3 },
];

const statusClass: Record<string, string> = {
  new_lead: "border-amber-200 bg-amber-50 text-amber-700",
  tentative: "border-sky-200 bg-sky-50 text-sky-700",
  confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-indigo-200 bg-indigo-50 text-indigo-700",
  cancelled: "border-rose-200 bg-rose-50 text-rose-700",
};

const sourceLabel: Record<string, string> = {
  millis_ai_auto: "AI Voice",
  manual: "Manual",
  web: "Website",
  api: "API",
  whatsapp_bot: "WhatsApp",
};

function pretty(value?: string) {
  return String(value || "Not set").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BookingCrmPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [modal, setModal] = useState<ModalId>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<BookingProfile>(defaultProfile);
  const [totals, setTotals] = useState<Totals>(emptyTotals);
  const [upcoming, setUpcoming] = useState<Booking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<BookingService[]>([]);
  const [resources, setResources] = useState<BookingResource[]>([]);
  const [tools, setTools] = useState<Array<{ name: string; endpoint: string; method: string; description: string }>>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookingForm, setBookingForm] = useState(emptyBooking);
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [resourceForm, setResourceForm] = useState(emptyResource);

  const terms = useMemo(() => ({ ...defaultTerms, ...(profile.terminology || {}) }), [profile.terminology]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const profileRes = await bookingCrmAPI.getProfile();
      const nextProfile = { ...defaultProfile, ...profileRes.data.profile, terminology: { ...defaultTerms, ...(profileRes.data.profile?.terminology || {}) } };
      if (!nextProfile.onboardingComplete) {
        router.replace("/dashboard/booking-crm/setup");
        return;
      }
      setProfile(nextProfile);

      const [overviewRes, bookingsRes, customersRes, servicesRes, resourcesRes, toolsRes] = await Promise.all([
        bookingCrmAPI.getOverview(),
        bookingCrmAPI.getBookings({ limit: 300 }),
        bookingCrmAPI.getCustomers(),
        bookingCrmAPI.getServices(),
        bookingCrmAPI.getResources(),
        bookingCrmAPI.getTools(),
      ]);
      setTotals(overviewRes.data.totals || emptyTotals);
      setUpcoming(overviewRes.data.upcoming || []);
      setBookings(bookingsRes.data.bookings || []);
      setCustomers(customersRes.data.customers || []);
      setServices(servicesRes.data.services || []);
      setResources(resourcesRes.data.resources || []);
      setTools(toolsRes.data.tools || []);
    } catch (err: any) {
      if (err.response?.status === 403) {
        router.replace("/dashboard");
        return;
      }
      setError(err.response?.data?.error || "Could not load the Booking Workspace");
    } finally {
      setLoading(false);
    }
  }, [router]);
  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const filteredBookings = useMemo(() => {
    const needle = search.toLowerCase().trim();
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const matchesSearch = !needle || [booking.customerName, booking.customerPhone, booking.serviceName, booking.resourceName, booking.location].some((value) => String(value || "").toLowerCase().includes(needle));
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3500);
  };

  const openModal = (next: ModalId) => {
    setError(null);
    if (next === "booking") {
      setBookingForm({ ...emptyBooking, serviceId: services.find((item) => item.active)?._id || "", resourceId: resources.find((item) => item.active)?._id || "" });
    }
    if (next === "service") setServiceForm({ ...emptyService, bookingMode: profile.bookingMode });
    if (next === "resource") setResourceForm(emptyResource);
    setModal(next);
  };

  const createBooking = async (event: React.FormEvent) => {
    event.preventDefault();
    const service = services.find((item) => item._id === bookingForm.serviceId);
    const resource = resources.find((item) => item._id === bookingForm.resourceId);
    try {
      setSaving(true);
      await bookingCrmAPI.createBooking({
        ...bookingForm,
        serviceName: service?.name,
        resourceName: resource?.name,
        quantity: Number(bookingForm.quantity || 1),
      });
      setModal(null);
      notify(`${terms.booking} created successfully`);
      await loadDashboard();
    } catch (err: any) {
      const slots = err.response?.data?.availableSlots;
      setError(`${err.response?.data?.error || `Could not create ${terms.booking.toLowerCase()}`}${slots?.length ? `. Available: ${slots.join(", ")}` : ""}`);
    } finally {
      setSaving(false);
    }
  };

  const createService = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      await bookingCrmAPI.createService({ ...serviceForm, durationMinutes: Number(serviceForm.durationMinutes), capacity: Number(serviceForm.capacity) });
      setModal(null);
      notify(`${terms.service} added`);
      await loadDashboard();
    } catch (err: any) {
      setError(err.response?.data?.error || `Could not add ${terms.service.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  };

  const createResource = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      const capacity = Number(resourceForm.capacity || 1);
      await bookingCrmAPI.createResource({
        ...resourceForm,
        capacity,
        slotDuration: Number(resourceForm.slotDuration),
        maxBookingsPerSlot: Math.max(capacity, Number(resourceForm.maxBookingsPerSlot || 1)),
        allowMultipleBookings: capacity > 1,
        defaultWorkingHours: { start: resourceForm.start, end: resourceForm.end },
        workingDays: [0, 1, 2, 3, 4, 5, 6],
      });
      setModal(null);
      notify(`${terms.resource} added`);
      await loadDashboard();
    } catch (err: any) {
      setError(err.response?.data?.error || `Could not add ${terms.resource.toLowerCase()}`);
    } finally {
      setSaving(false);
    }
  };

  const updateBooking = async (id: string, data: Record<string, unknown>, successText: string) => {
    try {
      await bookingCrmAPI.updateBooking(id, data);
      notify(successText);
      await loadDashboard();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not update booking");
    }
  };

  const toggleService = async (service: BookingService) => {
    await bookingCrmAPI.updateService(service._id, { active: !service.active });
    notify(`${service.name} ${service.active ? "disabled" : "enabled"}`);
    await loadDashboard();
  };

  const toggleResource = async (resource: BookingResource) => {
    await bookingCrmAPI.updateResource(resource._id, { active: !resource.active });
    notify(`${resource.name} ${resource.active ? "disabled" : "enabled"}`);
    await loadDashboard();
  };


  const saveProfile = async () => {
    try {
      setSaving(true);
      const response = await bookingCrmAPI.updateProfile(profile as unknown as Record<string, unknown>);
      setProfile({ ...response.data.profile, terminology: { ...defaultTerms, ...(response.data.profile.terminology || {}) } });
      notify("Booking Workspace settings saved");
      await loadDashboard();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not save settings");
    } finally {
      setSaving(false);
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
                  <span>{pretty(profile.businessType)}</span>
                  <span className="text-zinc-300">/</span>
                  <span>{pretty(profile.bookingMode)}</span>
                </div>
                <h1 className="truncate text-2xl font-bold text-zinc-950 lg:text-3xl">DigitalBot Booking Workspace</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500">
                  <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4" />{profile.assignedPhoneNumber || "Voice number connected"}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{profile.timezone}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">

                <button onClick={() => setActiveTab("settings")} className={`inline-flex h-10 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${activeTab === "settings" ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"}`}>
                  <Settings className="h-4 w-4" />Settings
                </button>
                <button onClick={() => void loadDashboard()} disabled={loading} className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh
                </button>
                <button onClick={() => openModal("booking")} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
                  <Plus className="h-4 w-4" />New {terms.booking}
                </button>
              </div>
            </div>

            <nav className="mt-6 flex gap-1 overflow-x-auto" aria-label="Booking Workspace sections">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const label = tab.id === "bookings" ? terms.bookings : tab.id === "customers" ? terms.customers : tab.label;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors ${activeTab === tab.id ? "border-orange-600 text-orange-700" : "border-transparent text-zinc-500 hover:text-zinc-900"}`}>
                    <Icon className="h-4 w-4" />{label}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {message && <Notice tone="success" message={message} onClose={() => setMessage(null)} />}
          {error && <Notice tone="error" message={error} onClose={() => setError(null)} />}

          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-600" /></div>
          ) : (
            <>
              {activeTab === "overview" && <Overview totals={totals} upcoming={upcoming} terms={terms} services={services} resources={resources} onAddBooking={() => openModal("booking")} onNavigate={setActiveTab} />}
              {activeTab === "bookings" && <Bookings bookings={filteredBookings} terms={terms} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAdd={() => openModal("booking")} onUpdate={updateBooking} />}
              {activeTab === "customers" && <Customers customers={customers} terms={terms} />}
              {activeTab === "catalog" && <Catalog services={services} resources={resources} terms={terms} onAddService={() => openModal("service")} onAddResource={() => openModal("resource")} onToggleService={toggleService} onToggleResource={toggleResource} />}
              {activeTab === "availability" && <Availability resources={resources} terms={terms} tools={tools} />}
              {activeTab === "settings" && <ProfileSettings profile={profile} setProfile={setProfile} saving={saving} onSave={saveProfile} />}
            </>
          )}
        </div>
      </main>

      {modal === "booking" && (
        <Modal title={`New ${terms.booking}`} subtitle={`Create a manual ${terms.booking.toLowerCase()} using the same rules as the voice agent.`} onClose={() => setModal(null)}>
          <form onSubmit={createBooking} className="space-y-5">
            <FormSection title={terms.customer}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={bookingForm.customerName} onChange={(value) => setBookingForm({ ...bookingForm, customerName: value })} required />
                <Field label="Phone" value={bookingForm.customerPhone} onChange={(value) => setBookingForm({ ...bookingForm, customerPhone: value })} required />
                <Field label="Email" type="email" value={bookingForm.customerEmail} onChange={(value) => setBookingForm({ ...bookingForm, customerEmail: value })} className="sm:col-span-2" />
              </div>
            </FormSection>
            <FormSection title="Schedule">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField label={terms.service} value={bookingForm.serviceId} onChange={(value) => setBookingForm({ ...bookingForm, serviceId: value })} options={services.filter((item) => item.active).map((item) => ({ value: item._id, label: item.name }))} required />
                <SelectField label={terms.resource} value={bookingForm.resourceId} onChange={(value) => setBookingForm({ ...bookingForm, resourceId: value })} options={resources.filter((item) => item.active).map((item) => ({ value: item._id, label: item.name }))} required />
                <Field label="Date" type="date" value={bookingForm.bookingDate} onChange={(value) => setBookingForm({ ...bookingForm, bookingDate: value })} required />
                <Field label="Time" type="time" value={bookingForm.bookingTime} onChange={(value) => setBookingForm({ ...bookingForm, bookingTime: value })} required />
                <Field label="Quantity / party size" type="number" value={bookingForm.quantity} onChange={(value) => setBookingForm({ ...bookingForm, quantity: value })} />
              </div>
            </FormSection>
            <FormSection title="Notes">
              <TextArea label="Internal notes" value={bookingForm.notes} onChange={(value) => setBookingForm({ ...bookingForm, notes: value })} />
              <TextArea label="Special requirements" value={bookingForm.specialRequirements} onChange={(value) => setBookingForm({ ...bookingForm, specialRequirements: value })} />
            </FormSection>
            <ModalActions saving={saving} onCancel={() => setModal(null)} submitLabel={`Create ${terms.booking}`} />
          </form>
        </Modal>
      )}

      {modal === "service" && (
        <Modal title={`Add ${terms.service}`} subtitle="Define what customers can book, including duration, capacity, and booking mode." onClose={() => setModal(null)}>
          <form onSubmit={createService} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`${terms.service} name`} value={serviceForm.name} onChange={(value) => setServiceForm({ ...serviceForm, name: value })} required />
              <Field label="Category" value={serviceForm.category} onChange={(value) => setServiceForm({ ...serviceForm, category: value })} />
              <SelectField label="Booking mode" value={serviceForm.bookingMode} onChange={(value) => setServiceForm({ ...serviceForm, bookingMode: value })} options={bookingModeOptions} />
              <Field label="Duration (minutes)" type="number" value={serviceForm.durationMinutes} onChange={(value) => setServiceForm({ ...serviceForm, durationMinutes: value })} required />
              <Field label="Capacity" type="number" value={serviceForm.capacity} onChange={(value) => setServiceForm({ ...serviceForm, capacity: value })} required />
            </div>
            <TextArea label="Description" value={serviceForm.description} onChange={(value) => setServiceForm({ ...serviceForm, description: value })} />
            <ModalActions saving={saving} onCancel={() => setModal(null)} submitLabel={`Add ${terms.service}`} />
          </form>
        </Modal>
      )}

      {modal === "resource" && (
        <Modal title={`Add ${terms.resource}`} subtitle="Add a venue, room, staff member, table, vehicle, court, or capacity pool." onClose={() => setModal(null)}>
          <form onSubmit={createResource} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`${terms.resource} name`} value={resourceForm.name} onChange={(value) => setResourceForm({ ...resourceForm, name: value })} required />
              <SelectField label="Resource type" value={resourceForm.resourceType} onChange={(value) => setResourceForm({ ...resourceForm, resourceType: value })} options={resourceTypeOptions} />
              <Field label="City / location" value={resourceForm.city} onChange={(value) => setResourceForm({ ...resourceForm, city: value })} />
              <Field label="Capacity" type="number" value={resourceForm.capacity} onChange={(value) => setResourceForm({ ...resourceForm, capacity: value, maxBookingsPerSlot: value })} required />
              <Field label="Slot duration (minutes)" type="number" value={resourceForm.slotDuration} onChange={(value) => setResourceForm({ ...resourceForm, slotDuration: value })} required />
              <Field label="Opening time" type="time" value={resourceForm.start} onChange={(value) => setResourceForm({ ...resourceForm, start: value })} />
              <Field label="Closing time" type="time" value={resourceForm.end} onChange={(value) => setResourceForm({ ...resourceForm, end: value })} />
              <Field label="Address" value={resourceForm.address} onChange={(value) => setResourceForm({ ...resourceForm, address: value })} className="sm:col-span-2" />
            </div>
            <TextArea label="Description" value={resourceForm.description} onChange={(value) => setResourceForm({ ...resourceForm, description: value })} />
            <ModalActions saving={saving} onCancel={() => setModal(null)} submitLabel={`Add ${terms.resource}`} />
          </form>
        </Modal>
      )}
    </div>
  );
}

function Overview({ totals, upcoming, terms, services, resources, onAddBooking, onNavigate }: { totals: Totals; upcoming: Booking[]; terms: Terminology; services: BookingService[]; resources: BookingResource[]; onAddBooking: () => void; onNavigate: (tab: TabId) => void }) {
  const maxStatus = Math.max(1, ...Object.values(totals.byStatus || {}));
  return (
    <div className="space-y-6">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label={`Total ${terms.bookings}`} value={totals.bookings} note={`${totals.upcoming} upcoming`} icon={CalendarDays} tone="orange" />
        <Metric label={terms.customers} value={totals.customers} note={`${totals.confirmed} confirmed`} icon={Users} tone="emerald" />
        <Metric label={`Confirmed ${terms.bookings}`} value={totals.confirmed} note={`${totals.upcoming} upcoming`} icon={CheckCircle2} tone="blue" />
        <Metric label="Active catalog" value={totals.services + totals.resources} note={`${totals.services} ${terms.services.toLowerCase()}, ${totals.resources} ${terms.resources.toLowerCase()}`} icon={Package} tone="violet" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.75fr)]">
        <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
          <SectionHeader title={`Upcoming ${terms.bookings}`} subtitle="The next confirmed and tentative commitments" action={<button onClick={() => onNavigate("bookings")} className="inline-flex items-center gap-1 text-sm font-semibold text-orange-700">View all <ChevronRight className="h-4 w-4" /></button>} />
          {upcoming.length ? (
            <div className="divide-y divide-zinc-100">
              {upcoming.map((booking) => <UpcomingRow key={booking._id} booking={booking} />)}
            </div>
          ) : (
            <EmptyState icon={CalendarDays} title={`No upcoming ${terms.bookings.toLowerCase()}`} text="Create a booking or connect the voice tools to start filling your calendar." actionLabel={`New ${terms.booking}`} onAction={onAddBooking} />
          )}
        </div>

        <div className="rounded-md border border-zinc-200 bg-white">
          <SectionHeader title="Booking pipeline" subtitle="Current status distribution" />
          <div className="space-y-4 p-5">
            {["new_lead", "tentative", "confirmed", "completed", "cancelled"].map((status) => {
              const count = totals.byStatus?.[status] || 0;
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-sm"><span className="font-medium text-zinc-700">{pretty(status)}</span><span className="font-semibold text-zinc-950">{count}</span></div>
                  <div className="h-2 overflow-hidden rounded bg-zinc-100"><div className="h-full rounded bg-orange-500" style={{ width: `${Math.max(count ? 8 : 0, (count / maxStatus) * 100)}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <SetupStep complete={services.length > 0} title={`Add ${terms.services}`} text="Define duration, capacity, and booking mode." onClick={() => onNavigate("catalog")} />
        <SetupStep complete={resources.length > 0} title={`Configure ${terms.resources}`} text="Set locations, capacity, hours, and availability." onClick={() => onNavigate("catalog")} />
        <SetupStep complete={totals.bookings > 0} title="Receive your first booking" text="Use a voice tool, website, or manual entry." onClick={onAddBooking} />
      </section>
    </div>
  );
}

function Bookings({ bookings, terms, search, setSearch, statusFilter, setStatusFilter, onAdd, onUpdate }: { bookings: Booking[]; terms: Terminology; search: string; setSearch: (value: string) => void; statusFilter: string; setStatusFilter: (value: string) => void; onAdd: () => void; onUpdate: (id: string, data: Record<string, unknown>, text: string) => Promise<void> }) {
  return (
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <SectionHeader title={terms.bookings} subtitle="Voice, website, API, WhatsApp, and manual bookings in one queue" action={<button onClick={onAdd} className="inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Add</button>} />
      <div className="grid gap-3 border-b border-zinc-200 bg-zinc-50 p-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${terms.bookings.toLowerCase()}...`} className="h-10 w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500">
          <option value="all">All statuses</option>{["new_lead", "tentative", "confirmed", "completed", "cancelled"].map((status) => <option key={status} value={status}>{pretty(status)}</option>)}
        </select>
      </div>
      {bookings.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-[820px] w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-white text-xs uppercase text-zinc-500"><tr><Th>{terms.customer}</Th><Th>{terms.service}</Th><Th>Schedule</Th><Th>{terms.resource}</Th><Th>Status</Th></tr></thead>
            <tbody className="divide-y divide-zinc-100">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-zinc-50/80">
                  <Td><p className="font-semibold text-zinc-950">{booking.customerName}</p><p className="mt-1 text-xs text-zinc-500">{booking.customerPhone}</p></Td>
                  <Td><p className="font-medium text-zinc-800">{booking.serviceName}</p><p className="mt-1 text-xs text-zinc-500">{sourceLabel[booking.source || ""] || pretty(booking.source)}</p></Td>
                  <Td><p className="font-medium text-zinc-800">{formatDate(booking.bookingDate)}</p><p className="mt-1 text-xs text-zinc-500">{booking.bookingTime}{booking.endTime ? ` - ${booking.endTime}` : ""}</p></Td>
                  <Td><p className="font-medium text-zinc-800">{booking.resourceName || "Unassigned"}</p><p className="mt-1 text-xs text-zinc-500">{booking.quantity || 1} quantity</p></Td>
                  <Td><select value={booking.status} onChange={(event) => void onUpdate(booking._id, { status: event.target.value }, `${terms.booking} status updated`)} className={`h-8 rounded-md border px-2 text-xs font-semibold outline-none ${statusClass[booking.status] || statusClass.tentative}`}>{["new_lead", "tentative", "confirmed", "completed", "cancelled"].map((status) => <option key={status} value={status}>{pretty(status)}</option>)}</select></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <EmptyState icon={CalendarDays} title={`No ${terms.bookings.toLowerCase()} found`} text="Try another filter or create the first booking." actionLabel={`New ${terms.booking}`} onAction={onAdd} />}
    </section>
  );
}

function Customers({ customers, terms }: { customers: Customer[]; terms: Terminology }) {
  return (
    <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
      <SectionHeader title={terms.customers} subtitle={`A unified profile for every ${terms.customer.toLowerCase()} across all booking sources`} />
      {customers.length ? <div className="overflow-x-auto"><table className="min-w-[820px] w-full text-left text-sm"><thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500"><tr><Th>{terms.customer}</Th><Th>Contact</Th><Th>{terms.bookings}</Th><Th>Services used</Th><Th>Last activity</Th></tr></thead><tbody className="divide-y divide-zinc-100">{customers.map((customer) => <tr key={customer._id} className="hover:bg-zinc-50"><Td><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded bg-zinc-100 font-bold text-zinc-600">{customer.customerName?.charAt(0)?.toUpperCase() || "C"}</div><div><p className="font-semibold text-zinc-950">{customer.customerName || "Unknown"}</p><p className="text-xs text-zinc-500">{customer.customerCompany || "Individual"}</p></div></div></Td><Td><p className="font-medium">{customer.customerPhone}</p><p className="text-xs text-zinc-500">{customer.customerEmail || "No email"}</p></Td><Td><span className="font-bold">{customer.bookings}</span></Td><Td><p className="max-w-[240px] truncate text-zinc-600">{customer.services?.filter(Boolean).join(", ") || "General"}</p></Td><Td>{formatDate(customer.lastBookingAt)}</Td></tr>)}</tbody></table></div> : <EmptyState icon={Users} title={`No ${terms.customers.toLowerCase()} yet`} text={`Customer profiles are created automatically from ${terms.bookings.toLowerCase()}.`} />}
    </section>
  );
}

function Catalog({ services, resources, terms, onAddService, onAddResource, onToggleService, onToggleResource }: { services: BookingService[]; resources: BookingResource[]; terms: Terminology; onAddService: () => void; onAddResource: () => void; onToggleService: (service: BookingService) => Promise<void>; onToggleResource: (resource: BookingResource) => Promise<void> }) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <SectionHeader title={terms.services} subtitle="What customers can book" action={<button onClick={onAddService} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold"><Plus className="h-4 w-4" />Add</button>} />
        {services.length ? <div className="divide-y divide-zinc-100">{services.map((service) => <div key={service._id} className="flex items-start justify-between gap-4 p-5"><div className="flex min-w-0 gap-3"><span className="mt-1 h-9 w-1 rounded" style={{ backgroundColor: service.color || "#ea580c" }} /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-zinc-950">{service.name}</h3><Badge value={service.active ? "active" : "inactive"} palette={{ active: "border-emerald-200 bg-emerald-50 text-emerald-700", inactive: "border-zinc-200 bg-zinc-50 text-zinc-500" }} /></div><p className="mt-1 text-sm text-zinc-500">{service.category || pretty(service.bookingMode)} · {service.durationMinutes} min · capacity {service.capacity}</p></div></div><button onClick={() => void onToggleService(service)} className="shrink-0 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">{service.active ? "Disable" : "Enable"}</button></div>)}</div> : <EmptyState icon={Package} title={`No ${terms.services.toLowerCase()}`} text="Add packages, sessions, room types, or bookable services." actionLabel={`Add ${terms.service}`} onAction={onAddService} />}
      </section>
      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white">
        <SectionHeader title={terms.resources} subtitle="Where, with whom, or against what capacity bookings happen" action={<button onClick={onAddResource} className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold"><Plus className="h-4 w-4" />Add</button>} />
        {resources.length ? <div className="divide-y divide-zinc-100">{resources.map((resource) => <div key={resource._id} className="flex items-start justify-between gap-4 p-5"><div className="flex min-w-0 gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded bg-orange-50 text-orange-700"><Building2 className="h-5 w-5" /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-zinc-950">{resource.name}</h3><Badge value={resource.active ? "active" : "inactive"} palette={{ active: "border-emerald-200 bg-emerald-50 text-emerald-700", inactive: "border-zinc-200 bg-zinc-50 text-zinc-500" }} /></div><p className="mt-1 text-sm text-zinc-500">{pretty(resource.resourceType)} · capacity {resource.capacity || resource.maxBookingsPerSlot || 1}</p><p className="mt-2 inline-flex items-center gap-1 text-sm text-zinc-600"><MapPin className="h-4 w-4" />{resource.city || "Location not set"}</p></div></div><button onClick={() => void onToggleResource(resource)} className="shrink-0 rounded-md border border-zinc-200 px-2.5 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-50">{resource.active ? "Disable" : "Enable"}</button></div>)}</div> : <EmptyState icon={Building2} title={`No ${terms.resources.toLowerCase()}`} text="Add venues, staff, rooms, tables, equipment, or seat pools." actionLabel={`Add ${terms.resource}`} onAction={onAddResource} />}
      </section>
    </div>
  );
}

function Availability({ resources, terms, tools }: { resources: BookingResource[]; terms: Terminology; tools: Array<{ name: string; endpoint: string; method: string; description: string }> }) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white"><SectionHeader title={`${terms.resource} availability`} subtitle="Working days, hours, slot duration, and simultaneous capacity" />{resources.length ? <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">{resources.map((resource) => <article key={resource._id} className="rounded-md border border-zinc-200 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{resource.name}</h3><p className="mt-1 text-xs text-zinc-500">{pretty(resource.resourceType)}</p></div><span className={`h-2.5 w-2.5 rounded-full ${resource.active ? "bg-emerald-500" : "bg-zinc-300"}`} /></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><Info label="Hours" value={`${resource.defaultWorkingHours?.start || "09:00"} - ${resource.defaultWorkingHours?.end || "18:00"}`} /><Info label="Slot" value={`${resource.slotDuration || 60} min`} /><Info label="Capacity" value={String(resource.maxBookingsPerSlot || resource.capacity || 1)} /><Info label="Location" value={resource.city || "Any"} /></div><div className="mt-4 flex gap-1">{dayNames.map((day, index) => <span key={day} className={`grid h-7 flex-1 place-items-center rounded text-[10px] font-semibold ${resource.workingDays?.includes(index) ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-400"}`}>{day}</span>)}</div></article>)}</div> : <EmptyState icon={Clock3} title={`No ${terms.resources.toLowerCase()} configured`} text="Add a resource to create an availability calendar." />}</section>
      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white"><SectionHeader title="Voice booking tools" subtitle="One shared tool pair for every configured business type" /><div className="grid gap-4 p-5 lg:grid-cols-2">{tools.map((tool) => <article key={tool.name} className="rounded-md border border-zinc-200 bg-zinc-50 p-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded bg-white text-orange-700 shadow-sm"><Sparkles className="h-4 w-4" /></div><div><h3 className="font-mono text-sm font-bold text-zinc-950">{tool.name}</h3><p className="mt-0.5 text-xs text-zinc-500">{tool.description}</p></div></div><code className="mt-4 block overflow-x-auto rounded bg-zinc-950 px-3 py-2 text-xs text-zinc-100">{tool.method} {tool.endpoint}</code></article>)}</div></section>
    </div>
  );
}

function ProfileSettings({ profile, setProfile, saving, onSave }: { profile: BookingProfile; setProfile: (profile: BookingProfile) => void; saving: boolean; onSave: () => Promise<void> }) {
  const updateTerm = (key: keyof Terminology, value: string) => setProfile({ ...profile, terminology: { ...profile.terminology, [key]: value } });
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-md border border-zinc-200 bg-white"><SectionHeader title="Business configuration" subtitle="Workspace settings for this assigned business" /><div className="space-y-6 p-5"><FormSection title="Business identity"><div className="grid gap-4 sm:grid-cols-2"><Field label="Workspace name" value={profile.businessName} onChange={(value) => setProfile({ ...profile, businessName: value })} /><SelectField label="Default booking mode" value={profile.bookingMode} onChange={(value) => setProfile({ ...profile, bookingMode: value })} options={bookingModeOptions} /><Field label="Timezone" value={profile.timezone} onChange={(value) => setProfile({ ...profile, timezone: value })} /><SelectField label="Default status" value={profile.defaultStatus} onChange={(value) => setProfile({ ...profile, defaultStatus: value })} options={[{ value: "new_lead", label: "New lead" }, { value: "tentative", label: "Tentative" }, { value: "confirmed", label: "Confirmed" }]} /></div></FormSection><FormSection title="Workspace terminology"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Booking (singular)" value={profile.terminology.booking} onChange={(value) => updateTerm("booking", value)} /><Field label="Bookings (plural)" value={profile.terminology.bookings} onChange={(value) => updateTerm("bookings", value)} /><Field label="Customer" value={profile.terminology.customer} onChange={(value) => updateTerm("customer", value)} /><Field label="Customers" value={profile.terminology.customers} onChange={(value) => updateTerm("customers", value)} /><Field label="Service" value={profile.terminology.service} onChange={(value) => updateTerm("service", value)} /><Field label="Services" value={profile.terminology.services} onChange={(value) => updateTerm("services", value)} /><Field label="Resource" value={profile.terminology.resource} onChange={(value) => updateTerm("resource", value)} /><Field label="Resources" value={profile.terminology.resources} onChange={(value) => updateTerm("resources", value)} /></div></FormSection><TextArea label="Booking confirmation message" value={profile.confirmationMessage} onChange={(value) => setProfile({ ...profile, confirmationMessage: value })} /><div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-5"><button onClick={() => void onSave()} disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save settings</button></div></div></section>
      <aside className="space-y-4"><div className="rounded-md border border-orange-200 bg-orange-50 p-5"><Store className="h-6 w-6 text-orange-700" /><p className="mt-3 text-xs font-semibold uppercase text-orange-700">Assigned business</p><h3 className="mt-1 font-bold text-orange-950">{pretty(profile.businessType)}</h3><p className="mt-2 text-sm leading-6 text-orange-800">This business was selected during account setup and is locked to this workspace.</p></div><div className="rounded-md border border-zinc-200 bg-white p-5"><h3 className="font-bold">Workspace isolation</h3><p className="mt-2 text-sm leading-6 text-zinc-600">Bookings, services, resources, and customers belong only to this account and assigned voice number.</p><div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Account protection active</div></div></aside>
    </div>
  );
}
const bookingModeOptions = [{ value: "time_slot", label: "Time slot" }, { value: "capacity", label: "Capacity / seats" }, { value: "resource", label: "Resource reservation" }, { value: "date_range", label: "Date range" }, { value: "enquiry", label: "Enquiry / lead" }];
const resourceTypeOptions = [{ value: "venue", label: "Venue" }, { value: "room", label: "Room" }, { value: "staff", label: "Staff member" }, { value: "table", label: "Table" }, { value: "equipment", label: "Equipment" }, { value: "seat_pool", label: "Seats / capacity pool" }, { value: "vehicle", label: "Vehicle" }, { value: "court", label: "Court / field" }, { value: "other", label: "Other" }];

function Metric({ label, value, note, icon: Icon, tone }: { label: string; value: string | number; note: string; icon: LucideIcon; tone: "orange" | "emerald" | "blue" | "violet" }) {
  const tones = { orange: "bg-orange-50 text-orange-700", emerald: "bg-emerald-50 text-emerald-700", blue: "bg-sky-50 text-sky-700", violet: "bg-violet-50 text-violet-700" };
  return <article className="rounded-md border border-zinc-200 bg-white p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase text-zinc-500">{label}</p><p className="mt-2 text-2xl font-bold text-zinc-950">{value}</p></div><div className={`grid h-9 w-9 place-items-center rounded ${tones[tone]}`}><Icon className="h-5 w-5" /></div></div><p className="mt-3 text-xs text-zinc-500">{note}</p></article>;
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return <div className="flex flex-col gap-3 border-b border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-bold text-zinc-950">{title}</h2>{subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}</div>{action}</div>;
}

function UpcomingRow({ booking }: { booking: Booking }) {
  return <div className="grid gap-3 p-4 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:items-center"><div className="rounded bg-zinc-100 px-2 py-2 text-center"><p className="text-[10px] font-bold uppercase text-zinc-500">{new Date(booking.bookingDate).toLocaleDateString("en-IN", { month: "short" })}</p><p className="text-xl font-bold">{new Date(booking.bookingDate).getDate()}</p></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="truncate font-semibold">{booking.customerName}</p><Badge value={booking.status} palette={statusClass} /></div><p className="mt-1 truncate text-sm text-zinc-500">{booking.serviceName} · {booking.bookingTime} · {booking.resourceName || "Unassigned"}</p></div><div className="text-left text-xs font-semibold text-zinc-500 sm:text-right">{booking.quantity || 1} quantity</div></div>;
}

function SetupStep({ complete, title, text, onClick }: { complete: boolean; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex min-h-[112px] items-start gap-3 rounded-md border border-zinc-200 bg-white p-4 text-left hover:border-zinc-300 hover:shadow-sm"><div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${complete ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{complete ? <Check className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</div><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-5 text-zinc-500">{text}</p></div></button>;
}

function Badge({ value, palette }: { value: string; palette: Record<string, string> }) {
  return <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[11px] font-semibold ${palette[value] || "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>{pretty(value)}</span>;
}

function Notice({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose: () => void }) {
  const success = tone === "success";
  return <div className={`mb-5 flex items-center gap-3 rounded-md border px-4 py-3 text-sm ${success ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>{success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}<span className="flex-1 font-medium">{message}</span><button onClick={onClose} className="rounded p-1 hover:bg-white/60"><X className="h-4 w-4" /></button></div>;
}

function EmptyState({ icon: Icon, title, text, actionLabel, onAction }: { icon: LucideIcon; title: string; text: string; actionLabel?: string; onAction?: () => void }) {
  return <div className="px-6 py-14 text-center"><div className="mx-auto grid h-11 w-11 place-items-center rounded bg-zinc-100 text-zinc-400"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{text}</p>{actionLabel && onAction && <button onClick={onAction} className="mt-5 inline-flex h-9 items-center gap-2 rounded-md bg-zinc-950 px-3 text-sm font-semibold text-white"><Plus className="h-4 w-4" />{actionLabel}</button>}</div>;
}

function Modal({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/45 p-3 sm:p-6"><div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white shadow-2xl"><div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-zinc-200 bg-white px-5 py-4"><div><h2 className="text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-zinc-500">{subtitle}</p></div><button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-md hover:bg-zinc-100"><X className="h-5 w-5" /></button></div><div className="p-5">{children}</div></div></div>;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset><legend className="mb-3 text-xs font-bold uppercase text-zinc-500">{title}</legend>{children}</fieldset>;
}

function Field({ label, value, onChange, type = "text", required = false, className = "" }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-semibold text-zinc-700">{label}</span><input type={type} value={value} required={required} min={type === "number" ? 0 : undefined} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>;
}

function SelectField({ label, value, onChange, options, required = false }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }>; required?: boolean }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold text-zinc-700">{label}</span><select value={value} required={required} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"><option value="">Select {label.toLowerCase()}</option>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="mb-4 block last:mb-0"><span className="mb-1.5 block text-sm font-semibold text-zinc-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>;
}

function ModalActions({ saving, onCancel, submitLabel }: { saving: boolean; onCancel: () => void; submitLabel: string }) {
  return <div className="flex justify-end gap-3 border-t border-zinc-200 pt-5"><button type="button" onClick={onCancel} className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">Cancel</button><button type="submit" disabled={saving} className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{submitLabel}</button></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-[10px] font-semibold uppercase text-zinc-400">{label}</p><p className="mt-1 truncate font-medium text-zinc-700">{value}</p></div>; }
function Th({ children }: { children: React.ReactNode }) { return <th className="px-4 py-3 font-semibold">{children}</th>; }
function Td({ children }: { children: React.ReactNode }) { return <td className="px-4 py-4 align-middle">{children}</td>; }
