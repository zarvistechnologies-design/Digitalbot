"use client";

import Sidebar from "@/components/Sidebar";
import { tankroAPI } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Droplets,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TankroLocation {
  _id: string;
  name: string;
  district: string;
  active: boolean;
  bookingCount?: number;
}

interface TankroBooking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  locationId: string;
  locationName: string;
  district: string;
  propertyType?: string;
  serviceType: "tank_cleaning" | "roof_care" | "callback" | "complaint" | "other";
  tankCapacityLitres?: number;
  quotedPrice?: number;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "rescheduled";
  source: string;
  notes?: string;
  createdAt: string;
}

interface Slot {
  start: string;
  end: string;
  display: string;
  available: boolean;
  bookedCount?: number;
  maxBookings?: number;
  spotsLeft?: number;
}

interface BookingForm {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  locationId: string;
  propertyType: string;
  serviceType: string;
  tankCapacityLitres: string;
  date: string;
  time: string;
  notes: string;
}

const initialForm: BookingForm = {
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  locationId: "",
  propertyType: "Home",
  serviceType: "tank_cleaning",
  tankCapacityLitres: "",
  date: "",
  time: "",
  notes: "",
};

const statusStyles: Record<TankroBooking["status"], string> = {
  scheduled: "bg-orange-100 text-orange-700 border-orange-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-blue-100 text-blue-700 border-blue-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  rescheduled: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const serviceLabels: Record<string, string> = {
  tank_cleaning: "Tank Cleaning",
  roof_care: "Roof Care",
  callback: "Callback",
  complaint: "Complaint",
  other: "Other",
};

const sourceLabels: Record<string, string> = {
  millis_ai_auto: "AI",
  manual: "Manual",
  web: "Web",
  api: "API",
  whatsapp_bot: "WhatsApp",
};

export default function TankroBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState<TankroLocation[]>([]);
  const [locationSummaries, setLocationSummaries] = useState<TankroLocation[]>([]);
  const [bookings, setBookings] = useState<TankroBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checkingSlots, setCheckingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [assignedPhone, setAssignedPhone] = useState("");

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setAssignedPhone(user?.assignedPhoneNumber || "");
      const params = new URLSearchParams(window.location.search);
      const locationId = params.get("locationId");
      if (locationId) {
        setLocationFilter(locationId);
        setForm((prev) => ({ ...prev, locationId }));
      }
    } catch {
      setAssignedPhone("");
    }
  }, []);

  const fetchLocations = useCallback(async () => {
    const [locationsResponse, summaryResponse] = await Promise.all([
      tankroAPI.getLocations({ active: true }),
      tankroAPI.getSummary(),
    ]);
    const activeLocations = locationsResponse.data.locations || [];
    const summaryLocations = (summaryResponse.data.locations || activeLocations).filter(
      (location: TankroLocation) => location.active !== false
    );

    setLocations(activeLocations);
    setLocationSummaries(summaryLocations.length ? summaryLocations : activeLocations);
    setForm((prev) => (
      prev.locationId || activeLocations.length === 0
        ? prev
        : { ...prev, locationId: activeLocations[0]._id }
    ));
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tankroAPI.getBookings({
        limit: 200,
        status: statusFilter !== "All" ? statusFilter : undefined,
        locationId: locationFilter || undefined,
        search: search || undefined,
      });
      setBookings(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load Tankro bookings");
    } finally {
      setLoading(false);
    }
  }, [locationFilter, search, statusFilter]);

  useEffect(() => {
    fetchLocations().catch((err: any) => setError(err.response?.data?.error || "Failed to load locations"));
  }, [fetchLocations]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const statusCounts = useMemo(() => {
    return bookings.reduce<Record<string, number>>((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
  }, [bookings]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.filter((booking) => new Date(booking.date).toDateString() === today).length;
  }, [bookings]);

  const selectedLocation = useMemo(() => {
    if (!locationFilter) return null;
    return (
      locationSummaries.find((location) => location._id === locationFilter) ||
      locations.find((location) => location._id === locationFilter) ||
      null
    );
  }, [locationFilter, locationSummaries, locations]);

  const getMinimumDate = () => new Date().toISOString().split("T")[0];

  const checkAvailability = useCallback(async (nextForm: BookingForm) => {
    if (!assignedPhone || !nextForm.locationId || !nextForm.date) {
      setSlots([]);
      return;
    }

    try {
      setCheckingSlots(true);
      const response = await tankroAPI.checkAvailability({
        assignedPhoneNumber: assignedPhone,
        locationId: nextForm.locationId,
        date: nextForm.date,
      });
      setSlots(response.data.slots || []);
    } catch (err: any) {
      setSlots([]);
      setError(err.response?.data?.error || "Failed to check availability");
    } finally {
      setCheckingSlots(false);
    }
  }, [assignedPhone]);

  const updateForm = (updates: Partial<BookingForm>) => {
    const nextForm = { ...form, ...updates };
    if (updates.locationId || updates.date) nextForm.time = "";
    setForm(nextForm);
    if (updates.locationId || updates.date) checkAvailability(nextForm);
  };

  const openBookingForm = () => {
    setForm((prev) => ({
      ...initialForm,
      locationId: locationFilter || prev.locationId || locations[0]?._id || "",
    }));
    setSlots([]);
    setShowForm(true);
  };

  const clearLocationSelection = () => {
    setLocationFilter("");
  };

  const handleLocationFilterChange = (locationId: string) => {
    setLocationFilter(locationId);
    if (locationId) {
      setForm((prev) => ({ ...prev, locationId }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await tankroAPI.createBooking({
        customerName: form.customerName,
        customerPhone: form.customerPhone,
        customerAddress: form.customerAddress,
        locationId: form.locationId,
        propertyType: form.propertyType,
        serviceType: form.serviceType,
        tankCapacityLitres: form.tankCapacityLitres ? Number(form.tankCapacityLitres) : undefined,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });

      setMessage("Booking saved");
      setShowForm(false);
      setForm(initialForm);
      setSlots([]);
      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save booking");
    } finally {
      setSaving(false);
    }
  };

  const updateBookingStatus = async (booking: TankroBooking, status: TankroBooking["status"]) => {
    try {
      await tankroAPI.updateBooking(booking._id, { status });
      setMessage("Booking updated");
      fetchBookings();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update booking");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <ClipboardList className="w-8 h-8 text-orange-600" />
                Tankro Service Bookings
              </h1>
              <p className="text-gray-600 mt-1">Bookings grouped by district and service location</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchBookings}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={openBookingForm}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
          </div>

          {message && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setMessage(null)} className="p-1 hover:bg-green-100 rounded-md">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Showing</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{todayCount}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Confirmed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.confirmed || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{statusCounts.completed || 0}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                value={locationFilter}
                onChange={(event) => handleLocationFilterChange(event.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">All locations</option>
                {(locationSummaries.length ? locationSummaries : locations).map((location) => (
                  <option key={location._id} value={location._id}>
                    {location.name}{location.bookingCount !== undefined ? ` (${location.bookingCount})` : ""}
                  </option>
                ))}
              </select>
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, phone, district"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            {selectedLocation && (
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2 font-medium text-gray-900">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  {selectedLocation.name}
                </span>
                <span>{selectedLocation.bookingCount || 0} total bookings</span>
                <button
                  type="button"
                  onClick={clearLocationSelection}
                  className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No bookings found</h3>
              <button
                onClick={openBookingForm}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
                Add Booking
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const bookingLocation = booking.locationName || booking.district;

                return (
                  <div key={booking._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:justify-between">
                      <div className="flex gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                          <Droplets className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-gray-900">{booking.customerName}</h2>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[booking.status]}`}>
                              {booking.status}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              {serviceLabels[booking.serviceType] || booking.serviceType}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                            <span className="inline-flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              {booking.customerPhone}
                            </span>
                            {bookingLocation && (
                              <span className="inline-flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {bookingLocation}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </span>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {booking.propertyType && (
                              <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200">{booking.propertyType}</span>
                            )}
                            {booking.tankCapacityLitres ? (
                              <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100">{booking.tankCapacityLitres} L</span>
                            ) : null}
                            {booking.quotedPrice ? (
                              <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100">Rs. {booking.quotedPrice}</span>
                            ) : null}
                            {booking.source && (
                              <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-600 border border-gray-200">
                                {formatSourceLabel(booking.source)}
                              </span>
                            )}
                          </div>
                          {booking.notes && (
                            <p className="mt-3 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-3">{booking.notes}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        {booking.status !== "confirmed" && (
                          <button
                            onClick={() => updateBookingStatus(booking, "confirmed")}
                            className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status !== "completed" && (
                          <button
                            onClick={() => updateBookingStatus(booking, "completed")}
                            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => updateBookingStatus(booking, "cancelled")}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Plus className="w-5 h-5 text-orange-600" />
                Add Tankro Booking
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Customer Name</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      required
                      value={form.customerName}
                      onChange={(event) => updateForm({ customerName: event.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Phone Number</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      required
                      value={form.customerPhone}
                      onChange={(event) => updateForm({ customerPhone: event.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </label>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Address / Area</span>
                <input
                  value={form.customerAddress}
                  onChange={(event) => updateForm({ customerAddress: event.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Location</span>
                  <select
                    required
                    value={form.locationId}
                    onChange={(event) => updateForm({ locationId: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select location</option>
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>{location.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Property Type</span>
                  <select
                    value={form.propertyType}
                    onChange={(event) => updateForm({ propertyType: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Home">Home</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospital">Hospital</option>
                    <option value="School or College">School or College</option>
                    <option value="Hotel">Hotel</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Service</span>
                  <select
                    value={form.serviceType}
                    onChange={(event) => updateForm({ serviceType: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="tank_cleaning">Tank Cleaning</option>
                    <option value="roof_care">Roof Care</option>
                    <option value="callback">Callback</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Tank Litres</span>
                  <input
                    type="number"
                    min={0}
                    value={form.tankCapacityLitres}
                    onChange={(event) => updateForm({ tankCapacityLitres: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Date</span>
                  <input
                    required
                    type="date"
                    min={getMinimumDate()}
                    value={form.date}
                    onChange={(event) => updateForm({ date: event.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
              </div>

              {form.locationId && form.date && (
                <div className="rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-700">Available Slots</span>
                    {checkingSlots && <Loader2 className="w-4 h-4 animate-spin text-orange-600" />}
                  </div>
                  {slots.length === 0 && !checkingSlots ? (
                    <p className="text-sm text-gray-500">No slots loaded for this date.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.start}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => updateForm({ time: slot.start })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            form.time === slot.start
                              ? "bg-orange-600 border-orange-600 text-white"
                              : slot.available
                                ? "bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300"
                                : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          <span>{slot.display || slot.start}</span>
                          {slot.available && slot.spotsLeft !== undefined && (
                            <span className="block text-[10px] opacity-75">{slot.spotsLeft} left</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Selected Time</span>
                <input
                  required
                  value={form.time}
                  onChange={(event) => updateForm({ time: event.target.value })}
                  placeholder="09:00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </label>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm({ notes: event.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function formatSourceLabel(source?: string) {
  if (!source) return "";
  return sourceLabels[source] || source.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
