"use client";

import Sidebar from "@/components/Sidebar";
import { eventBookingAPI } from "@/lib/api";
import { AlertCircle, CalendarCheck, Check, Clock, Loader2, Menu, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface EventVenue {
  _id: string;
  name: string;
  city?: string;
  address?: string;
  contactPhone?: string;
  email?: string;
  slotDuration: number;
  allowMultipleBookings?: boolean;
  maxBookingsPerSlot?: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  active: boolean;
  bookingCount?: number;
}

interface VenueForm {
  name: string;
  city: string;
  address: string;
  contactPhone: string;
  email: string;
  slotDuration: number;
  allowMultipleBookings: boolean;
  maxBookingsPerSlot: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  active: boolean;
}

const DAYS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const initialForm: VenueForm = {
  name: "",
  city: "",
  address: "",
  contactPhone: "",
  email: "",
  slotDuration: 180,
  allowMultipleBookings: true,
  maxBookingsPerSlot: 0,
  defaultWorkingHours: { start: "10:00", end: "22:00" },
  workingDays: [0, 1, 2, 3, 4, 5, 6],
  active: true,
};

function formatWorkingDays(days: number[] = []) {
  const sorted = [...days].sort();
  if (sorted.join(",") === "0,1,2,3,4,5,6") return "Every day";
  if (sorted.join(",") === "1,2,3,4,5") return "Mon - Fri";
  if (sorted.join(",") === "1,2,3,4,5,6") return "Mon - Sat";
  return sorted.map((day) => DAYS.find((item) => item.value === day)?.label).filter(Boolean).join(", ");
}

export default function EventAvailabilityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [venues, setVenues] = useState<EventVenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVenue, setEditingVenue] = useState<EventVenue | null>(null);
  const [form, setForm] = useState<VenueForm>(initialForm);

  const activeVenues = useMemo(() => venues.filter((venue) => venue.active !== false), [venues]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const summaryResponse = await eventBookingAPI.getSummary();
      setVenues(summaryResponse.data.venues || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load event availability");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const openAddModal = () => {
    setEditingVenue(null);
    setForm(initialForm);
    setShowModal(true);
  };

  const openEditModal = (venue: EventVenue) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name || "",
      city: venue.city || "",
      address: venue.address || "",
      contactPhone: venue.contactPhone || "",
      email: venue.email || "",
      slotDuration: venue.slotDuration || 180,
      allowMultipleBookings: venue.allowMultipleBookings !== false,
      maxBookingsPerSlot: venue.maxBookingsPerSlot ?? 0,
      defaultWorkingHours: venue.defaultWorkingHours || { start: "10:00", end: "22:00" },
      workingDays: venue.workingDays?.length ? venue.workingDays : [0, 1, 2, 3, 4, 5, 6],
      active: venue.active !== false,
    });
    setShowModal(true);
  };

  const toggleWorkingDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((item) => item !== day)
        : [...prev.workingDays, day].sort(),
    }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (editingVenue) {
        await eventBookingAPI.updateVenue(editingVenue._id, form);
        setMessage("Event calendar updated");
      } else {
        await eventBookingAPI.createVenue(form);
        setMessage("Event calendar added");
      }
      setShowModal(false);
      setEditingVenue(null);
      setForm(initialForm);
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save event calendar");
    } finally {
      setSaving(false);
    }
  };

  const seedDefaultVenue = async () => {
    try {
      setSaving(true);
      await eventBookingAPI.seedDefaultVenue();
      setMessage("Default event calendar is ready");
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add default event calendar");
    } finally {
      setSaving(false);
    }
  };

  const disableVenue = async (venue: EventVenue) => {
    if (!confirm(`Disable ${venue.name}? Existing bookings will stay in history.`)) return;
    try {
      await eventBookingAPI.deleteVenue(venue._id);
      setMessage("Event calendar disabled");
      await fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to disable event calendar");
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
                <CalendarCheck className="w-8 h-8 text-orange-600" />
                Event Availability
              </h1>
              <p className="text-gray-600 mt-1">Manage calendars, working hours, capacity, and locations</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => void fetchData()} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button onClick={seedDefaultVenue} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg border border-orange-200 transition-colors">
                <Check className="w-4 h-4" />
                Default Calendar
              </button>
              <button onClick={openAddModal} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
                <Plus className="w-4 h-4" />
                Add Calendar
              </button>
            </div>
          </div>

          {message && <Notice tone="success" message={message} onClose={() => setMessage(null)} />}
          {error && <Notice tone="error" message={error} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Stat label="Active Calendars" value={activeVenues.length} />
            <Stat label="Default Slot" value={`${activeVenues[0]?.slotDuration || 180}m`} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
          ) : (
            <>
              {venues.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl">
                  <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">No event calendar configured</h3>
                  <button onClick={seedDefaultVenue} disabled={saving} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                    <Plus className="w-4 h-4" />
                    Create Default Calendar
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {venues.map((venue) => (
                    <div key={venue._id} className={`bg-white rounded-xl p-5 border ${venue.active ? "border-gray-200" : "border-red-200 bg-red-50/30"} shadow-sm`}>
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0">
                          <h2 className="font-bold text-gray-900 text-lg truncate">{venue.name}</h2>
                          <p className="text-sm text-orange-600 font-medium">{venue.city || "All locations"}</p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${venue.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {venue.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="rounded-lg bg-orange-50 p-3 border border-orange-100">
                          <p className="text-xs text-orange-700 font-medium">Bookings</p>
                          <p className="text-2xl font-bold text-orange-800">{venue.bookingCount || 0}</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                          <p className="text-xs text-gray-500 font-medium">Capacity</p>
                          <p className="text-lg font-bold text-gray-900">{venue.maxBookingsPerSlot ? `${venue.maxBookingsPerSlot}/slot` : "Unlimited"}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatWorkingDays(venue.workingDays)} - {venue.defaultWorkingHours?.start || "10:00"} - {venue.defaultWorkingHours?.end || "22:00"} - {venue.slotDuration || 180} min</span>
                        </div>
                        {venue.address && <p className="text-gray-500">{venue.address}</p>}
                      </div>
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <button onClick={() => openEditModal(venue)} className="flex-1 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors text-sm font-medium">Edit</button>
                        <button onClick={() => disableVenue(venue)} className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Disable calendar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingVenue ? "Edit Event Calendar" : "Add Event Calendar"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Calendar Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} required />
                <Field label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
              </div>
              <Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Phone" value={form.contactPhone} onChange={(value) => setForm({ ...form, contactPhone: value })} />
                <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <NumberField label="Slot Minutes" value={form.slotDuration} min={30} max={720} onChange={(value) => setForm({ ...form, slotDuration: value || 180 })} />
                <NumberField label="Max Per Slot (0 = unlimited)" value={form.maxBookingsPerSlot} min={0} max={500} onChange={(value) => setForm({ ...form, maxBookingsPerSlot: value || 0 })} />
                <label className="flex items-center gap-3 mt-6">
                  <input type="checkbox" checked={form.allowMultipleBookings} onChange={(event) => setForm({ ...form, allowMultipleBookings: event.target.checked })} className="h-4 w-4 accent-orange-600" />
                  <span className="text-sm font-medium text-gray-700">Multiple events</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Start Time" type="time" value={form.defaultWorkingHours.start} onChange={(value) => setForm({ ...form, defaultWorkingHours: { ...form.defaultWorkingHours, start: value } })} />
                <Field label="End Time" type="time" value={form.defaultWorkingHours.end} onChange={(value) => setForm({ ...form, defaultWorkingHours: { ...form.defaultWorkingHours, end: value } })} />
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Working Days</span>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button key={day.value} type="button" onClick={() => toggleWorkingDay(day.value)} className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${form.workingDays.includes(day.value) ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-3">
                <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="h-4 w-4 accent-orange-600" />
                <span className="text-sm font-medium text-gray-700">Active calendar</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50">
                  {saving ? "Saving..." : editingVenue ? "Update Calendar" : "Add Calendar"}
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

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
    </label>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
    </label>
  );
}
