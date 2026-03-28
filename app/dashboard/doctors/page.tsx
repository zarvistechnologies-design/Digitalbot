"use client";
import Sidebar from "@/components/Sidebar";
import { calendarAPI, doctorsAPI } from "@/lib/api";
import {
    AlertCircle,
    Calendar,
    Check,
    Clock,
    Edit,
    ExternalLink,
    Mail,
    Menu,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Stethoscope,
    Trash2,
    User,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ==================== TYPES ====================
interface DaySchedule {
  start?: string;
  end?: string;
  isWorking: boolean;
}

interface WeeklySchedule {
  sunday?: DaySchedule;
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  phone: string;
  phone2?: string;
  email?: string;
  calendarId?: string;
  calendarConnected?: boolean;
  slotDuration: number;
  allowMultipleBookings?: boolean;
  maxPatientsPerSlot?: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BlockedTime {
  start: string;
  end: string;
  reason: string;
}

interface DoctorFormData {
  name: string;
  specialization: string;
  phone: string;
  phone2: string;
  email: string;
  slotDuration: number;
  allowMultipleBookings: boolean;
  maxPatientsPerSlot: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  useDifferentTimings: boolean;
  defaultBlockedTimes: BlockedTime[];
  calendarId: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun", key: "sunday" as const },
  { value: 1, label: "Mon", key: "monday" as const },
  { value: 2, label: "Tue", key: "tuesday" as const },
  { value: 3, label: "Wed", key: "wednesday" as const },
  { value: 4, label: "Thu", key: "thursday" as const },
  { value: 5, label: "Fri", key: "friday" as const },
  { value: 6, label: "Sat", key: "saturday" as const },
];

const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  sunday:    { start: "09:00", end: "17:00", isWorking: false },
  monday:    { start: "09:00", end: "17:00", isWorking: true },
  tuesday:   { start: "09:00", end: "17:00", isWorking: true },
  wednesday: { start: "09:00", end: "17:00", isWorking: true },
  thursday:  { start: "09:00", end: "17:00", isWorking: true },
  friday:    { start: "09:00", end: "17:00", isWorking: true },
  saturday:  { start: "09:00", end: "17:00", isWorking: false },
};

const SPECIALIZATIONS = [
  "General Physician",
  "Cardiologist",
  "Urologist",
  "Radiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Gynecologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Neurologist",
  "Psychiatrist",
  "Dentist",
  "Physiotherapist",
  "Neuro Physiotherapist",
  "Other",
];

const initialFormData: DoctorFormData = {
  name: "",
  specialization: "",
  phone: "",
  phone2: "",
  email: "",
  slotDuration: 30,
  allowMultipleBookings: false,
  maxPatientsPerSlot: 1,
  defaultWorkingHours: { start: "09:00", end: "17:00" },
  workingDays: [1, 2, 3, 4, 5],
  weeklySchedule: undefined,
  useDifferentTimings: false,
  defaultBlockedTimes: [],
  calendarId: "",
};

// ==================== MAIN COMPONENT ====================
export default function DoctorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const [saving, setSaving] = useState(false);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsAPI.getAll();
      setDoctors(response.data.doctors || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch doctors";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Filter doctors
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.phone.includes(searchQuery)
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build payload — only include weeklySchedule if different timings are enabled
      const { useDifferentTimings, ...payload } = formData;
      if (!useDifferentTimings) {
        payload.weeklySchedule = undefined;
      }

      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor._id, payload);
      } else {
        await doctorsAPI.create(payload);
      }
      setShowModal(false);
      setEditingDoctor(null);
      setFormData(initialFormData);
      fetchDoctors();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save doctor";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) return;

    try {
      await doctorsAPI.delete(doctor._id);
      fetchDoctors();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete doctor";
      alert(errorMessage);
    }
  };

  // Check if a doctor has weeklySchedule set with any day having start/end
  const hasDifferentTimings = (ws?: WeeklySchedule) => {
    if (!ws) return false;
    return Object.values(ws).some((day) => day && day.start && day.end);
  };

  // Handle edit
  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    const hasDiffTimings = hasDifferentTimings(doctor.weeklySchedule);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      phone2: doctor.phone2 || "",
      email: doctor.email || "",
      slotDuration: doctor.slotDuration,
      allowMultipleBookings: doctor.allowMultipleBookings || false,
      maxPatientsPerSlot: doctor.maxPatientsPerSlot || 1,
      defaultWorkingHours: doctor.defaultWorkingHours,
      workingDays: doctor.workingDays,
      weeklySchedule: hasDiffTimings ? doctor.weeklySchedule : { ...DEFAULT_WEEKLY_SCHEDULE },
      useDifferentTimings: hasDiffTimings,
      defaultBlockedTimes: (doctor as unknown as { defaultBlockedTimes?: BlockedTime[] }).defaultBlockedTimes || [],
      calendarId: doctor.calendarId || "",
    });
    setShowModal(true);
  };

  // Add blocked time
  const addBlockedTime = () => {
    setFormData((prev) => ({
      ...prev,
      defaultBlockedTimes: [
        ...prev.defaultBlockedTimes,
        { start: "12:00", end: "14:00", reason: "Lunch Break" },
      ],
    }));
  };

  // Remove blocked time
  const removeBlockedTime = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      defaultBlockedTimes: prev.defaultBlockedTimes.filter((_, i) => i !== index),
    }));
  };

  // Update blocked time
  const updateBlockedTime = (index: number, field: keyof BlockedTime, value: string) => {
    setFormData((prev) => ({
      ...prev,
      defaultBlockedTimes: prev.defaultBlockedTimes.map((bt, i) =>
        i === index ? { ...bt, [field]: value } : bt
      ),
    }));
  };

  // Toggle working day
  const toggleWorkingDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort(),
    }));
  };

  // Format working days
  const formatWorkingDays = (days: number[]) => {
    return days.map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-purple-50/20">
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-orange-600" />
                Doctors Management
              </h1>
              <p className="text-gray-600 mt-1">Manage your clinic&apos;s doctors and their schedules</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchDoctors}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingDoctor(null);
                  setFormData(initialFormData);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Doctor
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors by name, specialization, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Doctors Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className={`bg-white rounded-xl p-6 border ${
                    doctor.active ? "border-gray-200" : "border-red-200 bg-red-50/30"
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dr. {doctor.name}</h3>
                        <p className="text-sm text-orange-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {doctor.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {doctor.phone}
                      {doctor.phone2 && ` / ${doctor.phone2}`}
                    </div>
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {doctor.email}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {doctor.slotDuration} min slots
                      {doctor.allowMultipleBookings && (
                        <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {doctor.maxPatientsPerSlot || 1} patients/slot
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatWorkingDays(doctor.workingDays)}
                    </div>
                    {hasDifferentTimings(doctor.weeklySchedule) && (
                      <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                        Custom schedule per day
                      </div>
                    )}
                    {/* Google Calendar Status */}
                    <div className="flex items-center gap-2">
                      {doctor.calendarConnected ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          Calendar Connected
                        </span>
                      ) : (
                        <span className="text-gray-400">Calendar not connected</span>
                      )}
                    </div>
                  </div>

                  {/* Google Calendar Connect Button */}
                  {!doctor.calendarConnected && (
                    <button
                      onClick={async () => {
                        try {
                          const response = await calendarAPI.connect(doctor._id);
                          if (response.data.authUrl) {
                            window.open(response.data.authUrl, '_blank');
                          }
                        } catch (err) {
                          console.error('Failed to connect calendar:', err);
                          alert('Failed to connect Google Calendar');
                        }
                      }}
                      className="w-full mb-3 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors border border-green-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect Google Calendar
                    </button>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(doctor)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doctor)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredDoctors.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No doctors found</h3>
                  <p className="text-gray-500 mt-1">
                    {searchQuery ? "Try a different search term" : "Add your first doctor to get started"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter doctor's name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Specialization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  required
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g., +91 98765 43210"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Phone 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone2}
                  onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                  placeholder="e.g., +91 98765 43211 (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Slot Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slot Duration (minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={formData.slotDuration}
                  onChange={(e) =>
                    setFormData({ ...formData, slotDuration: parseInt(e.target.value) || 30 })
                  }
                  placeholder="e.g., 15, 20, 30, 45, 60"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Common values: 15, 20, 30, 45, 60 minutes (or enter custom value)
                </p>
              </div>

              {/* Multiple Bookings Per Slot */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Allow Multiple Patients Per Slot
                    </label>
                    <p className="text-xs text-gray-500">
                      Enable for walk-in clinics or group sessions
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        allowMultipleBookings: !formData.allowMultipleBookings,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.allowMultipleBookings ? "bg-orange-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.allowMultipleBookings ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {formData.allowMultipleBookings && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Patients Per Slot
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.maxPatientsPerSlot}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxPatientsPerSlot: Math.min(20, Math.max(1, parseInt(e.target.value) || 1)),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Up to 20 patients can be booked in the same time slot
                    </p>
                  </div>
                )}
              </div>

              {/* Schedule Mode Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Schedule
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, useDifferentTimings: false })}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      !formData.useDifferentTimings
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Same timing every day
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({
                      ...formData,
                      useDifferentTimings: true,
                      weeklySchedule: formData.weeklySchedule || { ...DEFAULT_WEEKLY_SCHEDULE },
                    })}
                    className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      formData.useDifferentTimings
                        ? "bg-orange-600 text-white border-orange-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Different timing per day
                  </button>
                </div>
              </div>

              {!formData.useDifferentTimings ? (
                <>
                  {/* Default Working Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={formData.defaultWorkingHours.start}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultWorkingHours: { ...formData.defaultWorkingHours, start: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={formData.defaultWorkingHours.end}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            defaultWorkingHours: { ...formData.defaultWorkingHours, end: e.target.value },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Working Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleWorkingDay(day.value)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            formData.workingDays.includes(day.value)
                              ? "bg-orange-600 text-white border-orange-600"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Per-Day Schedule */
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Set timing for each day
                  </label>
                  {DAYS_OF_WEEK.map((day) => {
                    const dayKey = day.key;
                    const schedule = formData.weeklySchedule?.[dayKey];
                    const isWorking = schedule?.isWorking !== false;
                    return (
                      <div
                        key={day.value}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                          isWorking ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        {/* Day toggle */}
                        <button
                          type="button"
                          onClick={() => {
                            const ws = { ...(formData.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE) };
                            ws[dayKey] = {
                              ...ws[dayKey],
                              start: ws[dayKey]?.start || "09:00",
                              end: ws[dayKey]?.end || "17:00",
                              isWorking: !isWorking,
                            };
                            setFormData({ ...formData, weeklySchedule: ws });
                          }}
                          className={`w-14 text-xs font-bold py-1.5 rounded-md border transition-colors ${
                            isWorking
                              ? "bg-orange-600 text-white border-orange-600"
                              : "bg-gray-200 text-gray-500 border-gray-300"
                          }`}
                        >
                          {day.label}
                        </button>

                        {isWorking ? (
                          <>
                            <input
                              type="time"
                              value={schedule?.start || "09:00"}
                              onChange={(e) => {
                                const ws = { ...(formData.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE) };
                                ws[dayKey] = { ...ws[dayKey], start: e.target.value, isWorking: true };
                                setFormData({ ...formData, weeklySchedule: ws });
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <span className="text-gray-400 text-sm">to</span>
                            <input
                              type="time"
                              value={schedule?.end || "17:00"}
                              onChange={(e) => {
                                const ws = { ...(formData.weeklySchedule || DEFAULT_WEEKLY_SCHEDULE) };
                                ws[dayKey] = { ...ws[dayKey], end: e.target.value, isWorking: true };
                                setFormData({ ...formData, weeklySchedule: ws });
                              }}
                              className="px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                          </>
                        ) : (
                          <span className="text-gray-400 text-sm italic">Day off</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Break Times / Blocked Times */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Break Times (Lunch, etc.)
                </label>
                
                {formData.defaultBlockedTimes.map((bt, index) => (
                  <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 mb-2 items-center">
                    <input
                      type="time"
                      value={bt.start}
                      onChange={(e) => updateBlockedTime(index, 'start', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={bt.end}
                      onChange={(e) => updateBlockedTime(index, 'end', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={bt.reason}
                      onChange={(e) => updateBlockedTime(index, 'reason', e.target.value)}
                      placeholder="Reason"
                      className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeBlockedTime(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addBlockedTime}
                  className="flex items-center gap-2 px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg border border-dashed border-orange-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Break Time
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Add lunch breaks or any time slots that should not be available for booking
                </p>
              </div>

              {/* Google Calendar ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Calendar ID (optional)
                </label>
                <input
                  type="email"
                  value={formData.calendarId}
                  onChange={(e) => setFormData({ ...formData, calendarId: e.target.value })}
                  placeholder="doctor@gmail.com (for calendar sync)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the doctor&apos;s Google Calendar email for automatic sync
                </p>
              </div>

              {/* Submit */}
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
                  {saving ? "Saving..." : editingDoctor ? "Update Doctor" : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
