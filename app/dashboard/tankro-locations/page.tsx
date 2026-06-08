"use client";

import Sidebar from "@/components/Sidebar";
import { tankroAPI, tankroCalendarAPI } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  Edit,
  ExternalLink,
  Loader2,
  MapPin,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TankroLocation {
  _id: string;
  name: string;
  district: string;
  address?: string;
  contactPhone?: string;
  email?: string;
  calendarId?: string;
  calendarConnected?: boolean;
  slotDuration: number;
  allowMultipleBookings?: boolean;
  maxBookingsPerSlot?: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  active: boolean;
  bookingCount?: number;
}

interface SummaryTotals {
  locations: number;
  bookings: number;
  todayBookings: number;
  byStatus?: Record<string, number>;
}

interface LocationFormData {
  name: string;
  district: string;
  address: string;
  contactPhone: string;
  email: string;
  calendarId: string;
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

const initialFormData: LocationFormData = {
  name: "",
  district: "",
  address: "",
  contactPhone: "+918448440701",
  email: "",
  calendarId: "",
  slotDuration: 120,
  allowMultipleBookings: true,
  maxBookingsPerSlot: 3,
  defaultWorkingHours: { start: "09:00", end: "18:00" },
  workingDays: [1, 2, 3, 4, 5, 6],
  active: true,
};

const formatWorkingDays = (workingDays: number[] = []) => {
  const sortedDays = [...workingDays].sort();
  if (sortedDays.join(",") === "1,2,3,4,5") return "Mon - Fri";
  if (sortedDays.join(",") === "1,2,3,4,5,6") return "Mon - Sat";
  if (sortedDays.join(",") === "0,1,2,3,4,5,6") return "Every day";
  return sortedDays.map((day) => DAYS.find((item) => item.value === day)?.label).filter(Boolean).join(", ");
};

export default function TankroLocationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [locations, setLocations] = useState<TankroLocation[]>([]);
  const [totals, setTotals] = useState<SummaryTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TankroLocation | null>(null);
  const [formData, setFormData] = useState<LocationFormData>(initialFormData);

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tankroAPI.getSummary();
      setLocations(response.data.locations || []);
      setTotals(response.data.totals || null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load Tankro locations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const filteredLocations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return locations;
    return locations.filter((location) =>
      [location.name, location.district, location.address || "", location.contactPhone || ""]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [locations, search]);

  const openAddModal = () => {
    setEditingLocation(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const openEditModal = (location: TankroLocation) => {
    setEditingLocation(location);
    setFormData({
      name: location.name || "",
      district: location.district || "",
      address: location.address || "",
      contactPhone: location.contactPhone || "+918448440701",
      email: location.email || "",
      calendarId: location.calendarId || "",
      slotDuration: location.slotDuration || 120,
      allowMultipleBookings: location.allowMultipleBookings !== false,
      maxBookingsPerSlot: location.maxBookingsPerSlot || 3,
      defaultWorkingHours: location.defaultWorkingHours || { start: "09:00", end: "18:00" },
      workingDays: location.workingDays?.length ? location.workingDays : [1, 2, 3, 4, 5, 6],
      active: location.active !== false,
    });
    setShowModal(true);
  };

  const toggleWorkingDay = (day: number) => {
    setFormData((prev) => ({
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
      if (editingLocation) {
        await tankroAPI.updateLocation(editingLocation._id, formData);
        setMessage("Location updated");
      } else {
        await tankroAPI.createLocation(formData);
        setMessage("Location added");
      }

      setShowModal(false);
      setEditingLocation(null);
      setFormData(initialFormData);
      await fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (location: TankroLocation) => {
    if (!confirm(`Delete ${location.name}? Existing bookings will stay in booking history.`)) return;

    try {
      await tankroAPI.deleteLocation(location._id);
      setMessage("Location deleted");
      fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete location");
    }
  };

  const seedDefaults = async () => {
    try {
      setSaving(true);
      const response = await tankroAPI.seedDefaultLocations();
      const createdCount = response.data.created?.length || 0;
      setMessage(createdCount ? `${createdCount} Tankro districts added` : "Tankro districts are already added");
      await fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add default districts");
    } finally {
      setSaving(false);
    }
  };

  const connectCalendar = async (location: TankroLocation) => {
    try {
      const response = await tankroCalendarAPI.connect(location._id);
      if (response.data.authUrl) window.open(response.data.authUrl, "_blank");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to connect Google Calendar");
    }
  };

  const syncCalendar = async (location: TankroLocation) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      await tankroCalendarAPI.syncAvailability(location._id, today);
      setMessage(`${location.name} calendar synced for today`);
      fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to sync Google Calendar");
    }
  };

  const disconnectCalendar = async (location: TankroLocation) => {
    if (!confirm(`Disconnect Google Calendar for ${location.name}?`)) return;

    try {
      await tankroCalendarAPI.disconnect(location._id);
      setMessage(`${location.name} calendar disconnected`);
      fetchSummary();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to disconnect Google Calendar");
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
                <MapPin className="w-8 h-8 text-orange-600" />
                Tankro Locations
              </h1>
              <p className="text-gray-600 mt-1">Service districts, booking counts, and location calendars</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={fetchSummary}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={seedDefaults}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg border border-orange-200 transition-colors"
              >
                <Check className="w-4 h-4" />
                Add Default Districts
              </button>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Location
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Locations</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals?.locations || locations.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals?.bookings || 0}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totals?.todayBookings || 0}</p>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by district, address, or phone"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No locations found</h3>
              <button
                onClick={seedDefaults}
                disabled={saving}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <Plus className="w-4 h-4" />
                Add Tankro Districts
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <div
                  key={location._id}
                  className={`bg-white rounded-xl p-5 border ${location.active ? "border-gray-200" : "border-red-200 bg-red-50/30"} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="min-w-0">
                      <h2 className="font-bold text-gray-900 text-lg truncate">{location.name}</h2>
                      <p className="text-sm text-orange-600 font-medium">{location.district}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${location.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {location.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-lg bg-orange-50 p-3 border border-orange-100">
                      <p className="text-xs text-orange-700 font-medium">Bookings</p>
                      <p className="text-2xl font-bold text-orange-800">{location.bookingCount || 0}</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Capacity</p>
                      <p className="text-lg font-bold text-gray-900">{location.maxBookingsPerSlot || 1}/slot</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{location.contactPhone || "+918448440701"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatWorkingDays(location.workingDays)} - {location.defaultWorkingHours?.start || "09:00"} - {location.defaultWorkingHours?.end || "18:00"} - {location.slotDuration || 120} min slots
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {location.calendarConnected ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <Check className="w-4 h-4" />
                          Calendar connected
                        </span>
                      ) : (
                        <span className="text-gray-400">Calendar not connected</span>
                      )}
                    </div>
                  </div>

                  {location.calendarConnected ? (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <button
                        onClick={() => syncCalendar(location)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync Today
                      </button>
                      <button
                        onClick={() => disconnectCalendar(location)}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors text-sm font-medium"
                      >
                        <X className="w-4 h-4" />
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => connectCalendar(location)}
                      className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg border border-green-200 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect Google Calendar
                    </button>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <Link
                      href={`/dashboard/tankro-bookings?locationId=${location._id}`}
                      className="flex-1 text-center px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                    >
                      View Bookings
                    </Link>
                    <button
                      onClick={() => openEditModal(location)}
                      className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                      title="Edit location"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(location)}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{editingLocation ? "Edit Location" : "Add Location"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Location Name</span>
                  <input
                    required
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">District</span>
                  <input
                    required
                    value={formData.district}
                    onChange={(event) => setFormData({ ...formData, district: event.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Address</span>
                <input
                  value={formData.address}
                  onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</span>
                  <input
                    value={formData.contactPhone}
                    onChange={(event) => setFormData({ ...formData, contactPhone: event.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Slot Minutes</span>
                  <input
                    type="number"
                    min={15}
                    max={480}
                    value={formData.slotDuration}
                    onChange={(event) => setFormData({ ...formData, slotDuration: Number(event.target.value) || 120 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Max Per Slot</span>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={formData.maxBookingsPerSlot}
                    onChange={(event) => setFormData({ ...formData, maxBookingsPerSlot: Number(event.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="flex items-center gap-3 mt-6">
                  <input
                    type="checkbox"
                    checked={formData.allowMultipleBookings}
                    onChange={(event) => setFormData({ ...formData, allowMultipleBookings: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Multiple bookings</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Start Time</span>
                  <input
                    type="time"
                    value={formData.defaultWorkingHours.start}
                    onChange={(event) => setFormData({
                      ...formData,
                      defaultWorkingHours: { ...formData.defaultWorkingHours, start: event.target.value },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">End Time</span>
                  <input
                    type="time"
                    value={formData.defaultWorkingHours.end}
                    onChange={(event) => setFormData({
                      ...formData,
                      defaultWorkingHours: { ...formData.defaultWorkingHours, end: event.target.value },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </label>
              </div>

              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">Working Days</span>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleWorkingDay(day.value)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        formData.workingDays.includes(day.value)
                          ? "bg-orange-600 border-orange-600 text-white"
                          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Google Calendar ID</span>
                <input
                  type="email"
                  value={formData.calendarId}
                  onChange={(event) => setFormData({ ...formData, calendarId: event.target.value })}
                  placeholder="location-calendar@gmail.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(event) => setFormData({ ...formData, active: event.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Active location</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingLocation ? "Update Location" : "Add Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
