"use client";

import Sidebar from "@/components/Sidebar";
import { eventBookingAPI } from "@/lib/api";
import { AlertCircle, Calendar, CheckCircle2, Clock, IndianRupee, Loader2, MapPin, Menu, Phone, Plus, RefreshCw, Search, Sparkles, User, Users, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface EventVenue {
  _id: string;
  name: string;
  city?: string;
  active: boolean;
}

interface EventBooking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventType: string;
  guestCount?: number;
  budget?: number;
  packageName?: string;
  venueId: string;
  venueName: string;
  city?: string;
  eventDate: string;
  eventTime: string;
  status: "new_lead" | "tentative" | "confirmed" | "completed" | "cancelled";
  source: string;
  notes?: string;
  specialRequirements?: string;
}

interface Slot {
  start: string;
  display: string;
  available: boolean;
  spotsLeft?: number;
}

interface BookingForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: string;
  budget: string;
  packageName: string;
  venueId: string;
  city: string;
  notes: string;
  specialRequirements: string;
}

const initialForm: BookingForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  eventType: "Birthday",
  eventDate: "",
  eventTime: "",
  guestCount: "",
  budget: "",
  packageName: "",
  venueId: "",
  city: "",
  notes: "",
  specialRequirements: "",
};

const statusStyles: Record<EventBooking["status"], string> = {
  new_lead: "bg-orange-100 text-orange-700 border-orange-200",
  tentative: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const sourceLabels: Record<string, string> = {
  millis_ai_auto: "AI Voice",
  manual: "Manual",
  web: "Web",
  api: "API",
  whatsapp_bot: "WhatsApp",
};

function formatSource(source?: string) {
  if (!source) return "";
  return sourceLabels[source] || source.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(date?: string) {
  if (!date) return "Not set";
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}

export default function EventBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [venues, setVenues] = useState<EventVenue[]>([]);
  const [bookings, setBookings] = useState<EventBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [venueFilter, setVenueFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [assignedPhone, setAssignedPhone] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAssignedPhone(user?.assignedPhoneNumber || "");
    } catch {
      setAssignedPhone("");
    }
  }, []);

  const fetchVenues = useCallback(async () => {
    const response = await eventBookingAPI.getSummary();
    const activeVenues = (response.data.venues || []).filter((venue: EventVenue) => venue.active !== false);
    setVenues(activeVenues);
    setForm((prev) => (
      prev.venueId || activeVenues.length === 0
        ? prev
        : { ...prev, venueId: activeVenues[0]._id, city: activeVenues[0].city || "" }
    ));
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventBookingAPI.getBookings({
        limit: 200,
        status: statusFilter !== "All" ? statusFilter : undefined,
        venueId: venueFilter || undefined,
        search: search || undefined,
      });
      setBookings(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load event bookings");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, venueFilter]);

  useEffect(() => {
    fetchVenues().catch((err: any) => setError(err.response?.data?.error || "Failed to load event calendars"));
  }, [fetchVenues]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const statusCounts = useMemo(() => {
    return bookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  }, [bookings]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.filter((booking) => new Date(booking.eventDate).toDateString() === today).length;
  }, [bookings]);

  const checkAvailability = useCallback(async (nextForm: BookingForm) => {
    if (!assignedPhone || !nextForm.eventDate) {
      setSlots([]);
      return;
    }
    try {
      setCheckingSlots(true);
      const venue = venues.find((item) => item._id === nextForm.venueId);
      const response = await eventBookingAPI.checkAvailability({
        assignedPhoneNumber: assignedPhone,
        eventDate: nextForm.eventDate,
        venueId: nextForm.venueId || undefined,
        venueName: venue?.name,
        city: venue?.city || nextForm.city || undefined,
      });
      setSlots(response.data.availableSlots || []);
    } catch (err: any) {
      setSlots([]);
      setError(err.response?.data?.error || "Failed to check event availability");
    } finally {
      setCheckingSlots(false);
    }
  }, [assignedPhone, venues]);

  const updateForm = (updates: Partial<BookingForm>) => {
    const nextForm = { ...form, ...updates };
    if (updates.venueId) {
      const selectedVenue = venues.find((venue) => venue._id === updates.venueId);
      nextForm.city = selectedVenue?.city || nextForm.city;
    }
    if (updates.venueId || updates.eventDate) nextForm.eventTime = "";
    setForm(nextForm);
    if (updates.venueId || updates.eventDate) void checkAvailability(nextForm);
  };

  const openBookingForm = () => {
    const selectedVenue = venues.find((venue) => venue._id === venueFilter) || venues[0];
    setForm({ ...initialForm, venueId: selectedVenue?._id || "", city: selectedVenue?.city || "" });
    setSlots([]);
    setShowForm(true);
  };

  const seedDefaultVenue = async () => {
    try {
      await eventBookingAPI.seedDefaultVenue();
      setMessage("Default event calendar is ready");
      await fetchVenues();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create default event calendar");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const venue = venues.find((item) => item._id === form.venueId);
      await eventBookingAPI.createBooking({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerEmail: form.customerEmail || undefined,
        eventType: form.eventType,
        eventDate: form.eventDate,
        eventTime: form.eventTime,
        guestCount: form.guestCount ? Number(form.guestCount) : undefined,
        budget: form.budget ? Number(form.budget) : undefined,
        packageName: form.packageName || undefined,
        venueId: form.venueId || undefined,
        venueName: venue?.name,
        city: form.city || venue?.city,
        notes: form.notes,
        specialRequirements: form.specialRequirements,
      });
      setMessage("Event booking saved");
      setShowForm(false);
      setForm(initialForm);
      setSlots([]);
      await fetchBookings();
      await fetchVenues();
    } catch (err: any) {
      const availableSlots = err.response?.data?.availableSlots;
      const suffix = Array.isArray(availableSlots) && availableSlots.length ? ` Available slots: ${availableSlots.join(", ")}` : "";
      setError(`${err.response?.data?.error || "Failed to save event booking"}${suffix}`);
    } finally {
      setSaving(false);
    }
  };

  const updateBookingStatus = async (booking: EventBooking, status: EventBooking["status"]) => {
    try {
      await eventBookingAPI.updateBooking(booking._id, { status });
      setMessage("Event booking updated");
      await fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update event booking");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="lg:pl-64">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-orange-600" />
                Event Bookings
              </h1>
              <p className="text-gray-600 mt-1">Manage event enquiries, customers, and confirmed bookings</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void fetchBookings()} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              {venues.length === 0 && (
                <button onClick={seedDefaultVenue} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg border border-orange-200 transition-colors">
                  <Plus className="w-4 h-4" />
                  Default Calendar
                </button>
              )}
              <button onClick={openBookingForm} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
          </div>

          {message && <Notice tone="success" message={message} onClose={() => setMessage(null)} />}
          {error && <Notice tone="error" message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Stat label="Showing" value={bookings.length} />
            <Stat label="Today" value={todayCount} />
            <Stat label="Confirmed" value={statusCounts.confirmed || 0} />
            <Stat label="New Leads" value={statusCounts.new_lead || 0} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select value={venueFilter} onChange={(event) => setVenueFilter(event.target.value)} className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="">All calendars</option>
                {venues.map((venue) => <option key={venue._id} value={venue._id}>{venue.name}</option>)}
              </select>
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer, phone, event type, city" className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="All">All status</option>
                <option value="new_lead">New Lead</option>
                <option value="tentative">Tentative</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="w-10 h-10 animate-spin text-orange-600" /></div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl">
              <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No event bookings found</h3>
              <button onClick={openBookingForm} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:justify-between">
                    <div className="flex gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0"><Calendar className="w-6 h-6 text-orange-600" /></div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-lg font-bold text-gray-900">{booking.customerName}</h2>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[booking.status]}`}>{formatStatus(booking.status)}</span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{booking.eventType}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                          <IconText icon={<Phone className="w-4 h-4" />} text={booking.customerPhone} />
                          <IconText icon={<Calendar className="w-4 h-4" />} text={formatDate(booking.eventDate)} />
                          <IconText icon={<Clock className="w-4 h-4" />} text={booking.eventTime} />
                          {booking.guestCount ? <IconText icon={<Users className="w-4 h-4" />} text={`${booking.guestCount} guests`} /> : null}
                          {booking.venueName ? <IconText icon={<MapPin className="w-4 h-4" />} text={booking.venueName} /> : null}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs">
                          {booking.budget ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100"><IndianRupee className="w-3 h-3" />{booking.budget}</span> : null}
                          {booking.packageName && <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100">{booking.packageName}</span>}
                          {booking.source && <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-200">{formatSource(booking.source)}</span>}
                        </div>
                        {(booking.notes || booking.specialRequirements) && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">{[booking.notes, booking.specialRequirements].filter(Boolean).join(" ")}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {booking.status !== "confirmed" && <button onClick={() => updateBookingStatus(booking, "confirmed")} className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium">Confirm</button>}
                      {booking.status !== "completed" && <button onClick={() => updateBookingStatus(booking, "completed")} className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">Complete</button>}
                      {booking.status !== "cancelled" && <button onClick={() => updateBookingStatus(booking, "cancelled")} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium">Cancel</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5 text-orange-600" />Add Event Booking</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <IconField label="Customer Name" icon={<User className="w-5 h-5 text-gray-400" />} required value={form.customerName} onChange={(value) => updateForm({ customerName: value })} />
                <IconField label="Phone Number" icon={<Phone className="w-5 h-5 text-gray-400" />} required value={form.customerPhone} onChange={(value) => updateForm({ customerPhone: value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Event Type</span>
                  <select value={form.eventType} onChange={(event) => updateForm({ eventType: event.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option>Birthday</option>
                    <option>Wedding</option>
                    <option>Corporate Event</option>
                    <option>Engagement</option>
                    <option>Private Party</option>
                    <option>Other</option>
                  </select>
                </label>
                <Field label="Email" type="email" value={form.customerEmail} onChange={(value) => updateForm({ customerEmail: value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Calendar</span>
                  <select value={form.venueId} onChange={(event) => updateForm({ venueId: event.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Default calendar</option>
                    {venues.map((venue) => <option key={venue._id} value={venue._id}>{venue.name}</option>)}
                  </select>
                </label>
                <Field label="Date" type="date" required min={new Date().toISOString().split("T")[0]} value={form.eventDate} onChange={(value) => updateForm({ eventDate: value })} />
                <Field label="City" value={form.city} onChange={(value) => updateForm({ city: value })} />
              </div>
              {form.eventDate && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Available Slots</span>
                    {checkingSlots && <Loader2 className="w-4 h-4 animate-spin text-orange-600" />}
                  </div>
                  {slots.length === 0 && !checkingSlots ? <p className="text-sm text-gray-500">No slots loaded for this date.</p> : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button key={slot.start} type="button" disabled={!slot.available} onClick={() => updateForm({ eventTime: slot.start })} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${form.eventTime === slot.start ? "bg-orange-600 border-orange-600 text-white" : slot.available ? "bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300" : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"}`}>
                          <span>{slot.display || slot.start}</span>
                          {slot.available && slot.spotsLeft !== undefined && <span className="block text-[10px] opacity-75">{slot.spotsLeft} left</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Selected Time" required value={form.eventTime} onChange={(value) => updateForm({ eventTime: value })} placeholder="18:00" />
                <Field label="Guests" type="number" value={form.guestCount} onChange={(value) => updateForm({ guestCount: value })} />
                <Field label="Budget" type="number" value={form.budget} onChange={(value) => updateForm({ budget: value })} />
              </div>
              <Field label="Package" value={form.packageName} onChange={(value) => updateForm({ packageName: value })} placeholder="Premium decor, DJ, catering" />
              <TextArea label="Special Requirements" value={form.specialRequirements} onChange={(value) => updateForm({ specialRequirements: value })} />
              <TextArea label="Notes" value={form.notes} onChange={(value) => updateForm({ notes: value })} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><CheckCircle2 className="w-4 h-4" />Save Booking</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function Notice({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose?: () => void }) {
  const isSuccess = tone === "success";
  return (
    <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${isSuccess ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
      {!isSuccess && <AlertCircle className="w-5 h-5" />}
      <span className="flex-1">{message}</span>
      {onClose && <button onClick={onClose} className="p-1 hover:bg-white/60 rounded-md"><X className="w-4 h-4" /></button>}
    </div>
  );
}

function IconText({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <span className="inline-flex items-center gap-2">{icon}{text}</span>;
}

function Field({ label, value, onChange, type = "text", required = false, min, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; min?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input required={required} min={min} placeholder={placeholder} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
    </label>
  );
}

function IconField({ label, icon, value, onChange, required = false }: { label: string; icon: React.ReactNode; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        <input required={required} value={value} onChange={(event) => onChange(event.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
      </div>
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" />
    </label>
  );
}
