"use client";
import Sidebar from "@/components/Sidebar";
import { calendarAPI, doctorsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Edit,
  ExternalLink,
  Hash,
  Mail,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Stethoscope,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

// ==================== TYPES ====================
interface TimePeriod {
  start: string;
  end: string;
}

interface DaySchedule {
  start?: string;
  end?: string;
  periods?: TimePeriod[];
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
  queueNumbering?: QueueNumbering;
  defaultWorkingHours: { start: string; end: string };
  defaultWorkingPeriods?: TimePeriod[];
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

interface QueueNumbering {
  enabled: boolean;
  newPatientStart: number;
  newPatientEnd: number;
  followUpStart: number;
  followUpEnd: number;
  overflowPrefix: number;
  overflowStart: number;
  allowOverflow: boolean;
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
  queueNumbering: QueueNumbering;
  defaultWorkingHours: { start: string; end: string };
  defaultWorkingPeriods: TimePeriod[];
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

const createDaySchedule = (isWorking: boolean): DaySchedule => ({
  start: "09:00",
  end: "17:00",
  periods: [{ start: "09:00", end: "17:00" }],
  isWorking,
});

const createDefaultWeeklySchedule = (): WeeklySchedule => ({
  sunday: createDaySchedule(false),
  monday: createDaySchedule(true),
  tuesday: createDaySchedule(true),
  wednesday: createDaySchedule(true),
  thursday: createDaySchedule(true),
  friday: createDaySchedule(true),
  saturday: createDaySchedule(false),
});

const normalizePeriods = (periods?: TimePeriod[], fallback?: { start?: string; end?: string }): TimePeriod[] => {
  if (periods && periods.length > 0) return periods.map((period) => ({ ...period }));
  if (fallback?.start && fallback?.end) return [{ start: fallback.start, end: fallback.end }];
  return [{ start: "09:00", end: "17:00" }];
};

const getPeriodsLabel = (periods: TimePeriod[]): string =>
  periods.map((period) => `${period.start}-${period.end}`).join(", ");

const getPeriodsError = (periods: TimePeriod[], label: string): string | null => {
  const sorted = [...periods].sort((a, b) => a.start.localeCompare(b.start));
  for (let index = 0; index < sorted.length; index += 1) {
    if (!sorted[index].start || !sorted[index].end || sorted[index].start >= sorted[index].end) {
      return `${label}: end time must be after start time.`;
    }
    if (index > 0 && sorted[index].start < sorted[index - 1].end) {
      return `${label}: timings cannot overlap.`;
    }
  }
  return null;
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
  "Pulmonologist",
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
  queueNumbering: {
    enabled: false,
    newPatientStart: 1,
    newPatientEnd: 10,
    followUpStart: 11,
    followUpEnd: 80,
    overflowPrefix: 81,
    overflowStart: 11,
    allowOverflow: true,
  },
  defaultWorkingHours: { start: "09:00", end: "17:00" },
  defaultWorkingPeriods: [{ start: "09:00", end: "17:00" }],
  workingDays: [1, 2, 3, 4, 5],
  weeklySchedule: undefined,
  useDifferentTimings: false,
  defaultBlockedTimes: [],
  calendarId: "",
};

// ==================== SHARED UI (matches Appointment Ledger theme) ====================
function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
      <Icon className="w-4 h-4 text-teal-600" />
      {children}
    </h3>
  );
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5">
      <span className="block text-sm font-semibold text-slate-700">{children}</span>
      {hint && <span className="block text-[11px] text-slate-400 mt-0.5">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100";

function Toggle({ on, onClick, activeColor = "bg-teal-600" }: { on: boolean; onClick: () => void; activeColor?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
        on ? activeColor : "bg-slate-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ==================== MAIN COMPONENT ====================
export default function DoctorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState<string>("All");
  const [filterActive, setFilterActive] = useState<"All" | "active" | "inactive">("All");
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    data: doctors = [],
    isPending: loading,
    isFetching,
    error: doctorsError,
    refetch: fetchDoctors,
  } = useQuery<Doctor[], Error>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await doctorsAPI.getAll();
      return response.data.doctors || [];
    },
  });
  const error = doctorsError?.message || null;

  const specializations = useMemo(
    () => Array.from(new Set(doctors.map((d) => d.specialization).filter(Boolean))).sort((a, b) => a.localeCompare(b)),
    [doctors]
  );

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    let filtered = doctors;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialization.toLowerCase().includes(q) ||
          doc.phone.includes(searchQuery)
      );
    }
    if (filterSpecialization !== "All") {
      filtered = filtered.filter((doc) => doc.specialization === filterSpecialization);
    }
    if (filterActive !== "All") {
      filtered = filtered.filter((doc) => (filterActive === "active" ? doc.active : !doc.active));
    }
    return filtered;
  }, [doctors, searchQuery, filterSpecialization, filterActive]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let periodsError = getPeriodsError(formData.defaultWorkingPeriods, "Daily timings");
    if (formData.useDifferentTimings) {
      for (const day of DAYS_OF_WEEK) {
        const schedule = formData.weeklySchedule?.[day.key];
        if (schedule?.isWorking !== false) {
          periodsError = getPeriodsError(normalizePeriods(schedule?.periods, schedule), `${day.label} timings`);
          if (periodsError) break;
        }
      }
    }
    if (periodsError) {
      alert(periodsError);
      return;
    }
    setSaving(true);

    try {
      // Build payload — only include weeklySchedule if different timings are enabled
      const { useDifferentTimings, ...payload } = formData;
      const defaultPeriods = [...formData.defaultWorkingPeriods].sort((a, b) => a.start.localeCompare(b.start));
      payload.defaultWorkingPeriods = defaultPeriods;
      payload.defaultWorkingHours = {
        start: defaultPeriods[0].start,
        end: defaultPeriods[defaultPeriods.length - 1].end,
      };

      if (!useDifferentTimings) {
        payload.weeklySchedule = null as unknown as WeeklySchedule;
      } else {
        const weeklySchedule = createDefaultWeeklySchedule();
        DAYS_OF_WEEK.forEach(({ key }) => {
          const schedule = formData.weeklySchedule?.[key];
          if (!schedule || schedule.isWorking === false) {
            weeklySchedule[key] = { isWorking: false, periods: [] };
            return;
          }
          const periods = normalizePeriods(schedule.periods, schedule).sort((a, b) => a.start.localeCompare(b.start));
          weeklySchedule[key] = {
            isWorking: true,
            periods,
            start: periods[0].start,
            end: periods[periods.length - 1].end,
          };
        });
        payload.weeklySchedule = weeklySchedule;
      }

      if (editingDoctor) {
        await doctorsAPI.update(editingDoctor._id, payload);
        setSuccessMessage(`Dr. ${formData.name}'s record was updated.`);
      } else {
        await doctorsAPI.create(payload);
        setSuccessMessage(`Dr. ${formData.name} was added to the roster.`);
      }
      setShowModal(false);
      setEditingDoctor(null);
      setFormData(initialFormData);
      fetchDoctors();
      setTimeout(() => setSuccessMessage(null), 5000);
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
    return Object.values(ws).some((day) => day && ((day.periods?.length || 0) > 0 || (day.start && day.end)));
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
      queueNumbering: {
        ...initialFormData.queueNumbering,
        ...(doctor.queueNumbering || {}),
      },
      defaultWorkingHours: doctor.defaultWorkingHours,
      defaultWorkingPeriods: normalizePeriods(doctor.defaultWorkingPeriods, doctor.defaultWorkingHours),
      workingDays: doctor.workingDays,
      weeklySchedule: hasDiffTimings
        ? DAYS_OF_WEEK.reduce<WeeklySchedule>((schedule, day) => {
            const existing = doctor.weeklySchedule?.[day.key];
            schedule[day.key] = existing
              ? { ...existing, periods: normalizePeriods(existing.periods, existing) }
              : createDaySchedule(false);
            return schedule;
          }, {})
        : createDefaultWeeklySchedule(),
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
      defaultBlockedTimes: [...prev.defaultBlockedTimes, { start: "12:00", end: "14:00", reason: "Lunch Break" }],
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
      defaultBlockedTimes: prev.defaultBlockedTimes.map((bt, i) => (i === index ? { ...bt, [field]: value } : bt)),
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
    return days.map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(" · ");
  };

  const activeCount = doctors.filter((d) => d.active).length;
  const calendarConnectedCount = doctors.filter((d) => d.calendarConnected).length;
  const queueEnabledCount = doctors.filter((d) => d.queueNumbering?.enabled).length;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-sm border border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Compact Healthcare Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Section Identity */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700">
                  <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Clinical Roster
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Staff
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                    Doctors &amp; Schedules
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Practitioner availability, working hours &amp; queue numbering
                  </p>
                </div>
              </div>

              {/* Center: Quick Search & Actions (Responsive on mobile) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:max-w-md">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor, specialty, phone..."
                    className="w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => void fetchDoctors()}
                    disabled={isFetching}
                    aria-label="Refresh doctors"
                    className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-teal-600 ${isFetching ? "animate-spin" : ""}`} />
                    <span>{isFetching ? "Syncing..." : "Sync"}</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingDoctor(null);
                      setFormData(initialFormData);
                      setShowModal(true);
                    }}
                    className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3.5 text-xs font-bold text-white transition hover:bg-teal-700 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Doctor</span>
                  </button>
                </div>
              </div>

              {/* Right: Quick Stats Pills (Grid on mobile, flex on sm+) */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto flex-shrink-0">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <div className="text-xs">
                    <span className="text-slate-500 mr-1">Total:</span>
                    <strong className="font-mono text-slate-900 font-bold">{doctors.length}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <div className="text-xs">
                    <span className="text-emerald-700 mr-1">Active:</span>
                    <strong className="font-mono text-emerald-950 font-bold">{activeCount}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-600" />
                  <div className="text-xs">
                    <span className="text-sky-700 mr-1">Synced:</span>
                    <strong className="font-mono text-sky-950 font-bold">{calendarConnectedCount}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5">
                  <Hash className="h-3.5 w-3.5 text-indigo-600" />
                  <div className="text-xs">
                    <span className="text-indigo-700 mr-1">Queue:</span>
                    <strong className="font-mono text-indigo-950 font-bold">{queueEnabledCount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 sm:px-5 py-3 sm:py-3.5 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Ledger */}
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col">
            {/* Search & Filters */}
            <div className="p-3.5 sm:p-5 border-b border-slate-200">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
                <div className="flex-1 min-w-[200px] relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, specialization, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 text-sm"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                    className="flex-1 sm:flex-initial px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-xs sm:text-sm font-medium text-slate-700 bg-white"
                  >
                    <option value="All">All Specialties</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                  <select
                    value={filterActive}
                    onChange={(e) => setFilterActive(e.target.value as "All" | "active" | "inactive")}
                    className="flex-1 sm:flex-initial px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-xs sm:text-sm font-medium text-slate-700 bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Doctor rows */}
            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => {
                  const periods = normalizePeriods(doctor.defaultWorkingPeriods, doctor.defaultWorkingHours);
                  const customSchedule = hasDifferentTimings(doctor.weeklySchedule);
                  return (
                    <div
                      key={doctor._id}
                      onClick={() => handleEdit(doctor)}
                      className="group relative flex flex-col gap-3 sm:flex-row sm:items-center px-4 sm:px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {/* Status rail */}
                      <div
                        className={`hidden sm:block w-1 self-stretch rounded-full flex-shrink-0 ${
                          doctor.active ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                      />

                      {/* Avatar + name */}
                      <div className="flex items-center gap-3 flex-shrink-0 sm:w-[220px]">
                        <div className="flex-shrink-0 bg-slate-100 group-hover:bg-slate-900 p-2.5 rounded-lg transition-colors">
                          <User className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">Dr. {doctor.name}</p>
                          <p className="text-xs text-teal-700 font-semibold truncate">{doctor.specialization}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="flex flex-col gap-0.5 text-xs text-slate-600 sm:w-[190px] flex-shrink-0">
                        <span className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {doctor.phone}
                          {doctor.phone2 ? ` / ${doctor.phone2}` : ""}
                        </span>
                        {doctor.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{doctor.email}</span>
                          </span>
                        )}
                      </div>

                      {/* Schedule */}
                      <div className="flex-1 min-w-0 text-xs text-slate-600">
                        {customSchedule ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold text-violet-700">
                            <CalendarClock className="w-3.5 h-3.5" />
                            Custom schedule per day
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            <span className="font-mono">{formatWorkingDays(doctor.workingDays)}</span>
                            <span className="text-slate-300">·</span>
                            <span className="font-mono truncate">{getPeriodsLabel(periods)}</span>
                          </span>
                        )}
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 flex-shrink-0">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${
                            doctor.active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${doctor.active ? "bg-emerald-500" : "bg-rose-500"}`} />
                          {doctor.active ? "Active" : "Inactive"}
                        </span>
                        {doctor.queueNumbering?.enabled && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-semibold">
                            <Hash className="w-2.5 h-2.5" />
                            Queue
                          </span>
                        )}
                        {doctor.allowMultipleBookings && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-semibold">
                            <Users className="w-2.5 h-2.5" />
                            {doctor.maxPatientsPerSlot || 1}/slot
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            doctor.calendarConnected
                              ? "bg-sky-50 text-sky-700 border-sky-200"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}
                        >
                          <Check className="w-2.5 h-2.5" />
                          {doctor.calendarConnected ? "Synced" : "Not synced"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                        {!doctor.calendarConnected && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const response = await calendarAPI.connect(doctor._id);
                                if (response.data.authUrl) {
                                  window.open(response.data.authUrl, "_blank");
                                }
                              } catch (err) {
                                console.error("Failed to connect calendar:", err);
                                alert("Failed to connect Google Calendar");
                              }
                            }}
                            title="Connect Google Calendar"
                            className="p-2 rounded-md text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(doctor);
                          }}
                          title="Edit doctor"
                          className="p-2 rounded-md text-teal-600 hover:bg-teal-50 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDelete(doctor);
                          }}
                          title="Delete doctor"
                          className="p-2 rounded-md text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className="hidden sm:block w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-7 h-7 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No Doctors Found</h3>
                  <p className="text-slate-500 text-sm">
                    {searchQuery || filterSpecialization !== "All" || filterActive !== "All"
                      ? "Try a different search or filter"
                      : "Add your first doctor to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add / Edit Doctor Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={() => !saving && setShowModal(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 flex justify-between items-start flex-shrink-0">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
                  {editingDoctor ? `Record · ${editingDoctor._id.slice(-8)}` : "New Record"}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto bg-slate-50 flex-1">
              {/* Identity */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <SectionLabel icon={User}>Doctor Information</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <FieldLabel>Doctor Name *</FieldLabel>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter doctor's name"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>Specialization *</FieldLabel>
                    <select
                      required
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select specialization</option>
                      {SPECIALIZATIONS.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>Phone Number *</FieldLabel>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g., +91 98765 43210"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FieldLabel>Secondary Phone</FieldLabel>
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                      placeholder="Optional"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>Email</FieldLabel>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="doctor@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Booking configuration */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <SectionLabel icon={Clock}>Booking Configuration</SectionLabel>

                <div>
                  <FieldLabel hint="Common values: 15, 20, 30, 45, 60 minutes">Slot Duration (minutes)</FieldLabel>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={formData.slotDuration}
                    onChange={(e) => setFormData({ ...formData, slotDuration: parseInt(e.target.value) || 30 })}
                    className={`${inputClass} max-w-[200px] font-mono`}
                  />
                </div>

                {/* Multiple Bookings Per Slot */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-sm font-semibold text-slate-700">
                        Allow Multiple Patients Per Slot
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        Enable for walk-in clinics or group sessions
                      </span>
                    </div>
                    <Toggle
                      on={formData.allowMultipleBookings}
                      onClick={() =>
                        setFormData({ ...formData, allowMultipleBookings: !formData.allowMultipleBookings })
                      }
                    />
                  </div>

                  {formData.allowMultipleBookings && (
                    <div className="mt-3">
                      <FieldLabel>Max Patients Per Slot</FieldLabel>
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
                        className={`${inputClass} max-w-[160px] font-mono`}
                      />
                    </div>
                  )}
                </div>

                {/* Queue Numbering */}
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                        <Hash className="w-3.5 h-3.5 text-indigo-600" />
                        OPD Queue Numbering
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-0.5">
                        New {formData.queueNumbering.newPatientStart}-{formData.queueNumbering.newPatientEnd} · Old{" "}
                        {formData.queueNumbering.followUpStart}-{formData.queueNumbering.followUpEnd} · Extra{" "}
                        {formData.queueNumbering.overflowPrefix}/{formData.queueNumbering.overflowStart}+
                      </span>
                    </div>
                    <Toggle
                      on={formData.queueNumbering.enabled}
                      activeColor="bg-indigo-600"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          allowMultipleBookings: !formData.queueNumbering.enabled ? true : formData.allowMultipleBookings,
                          maxPatientsPerSlot: !formData.queueNumbering.enabled
                            ? Math.max(formData.maxPatientsPerSlot, formData.queueNumbering.followUpEnd)
                            : formData.maxPatientsPerSlot,
                          queueNumbering: { ...formData.queueNumbering, enabled: !formData.queueNumbering.enabled },
                        })
                      }
                    />
                  </div>

                  {formData.queueNumbering.enabled && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <FieldLabel>New Start</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={formData.queueNumbering.newPatientStart}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              queueNumbering: {
                                ...formData.queueNumbering,
                                newPatientStart: Math.max(1, parseInt(e.target.value) || 1),
                              },
                            })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <FieldLabel>New End</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={formData.queueNumbering.newPatientEnd}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              queueNumbering: {
                                ...formData.queueNumbering,
                                newPatientEnd: Math.max(1, parseInt(e.target.value) || 10),
                              },
                            })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <FieldLabel>Follow-up Start</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={formData.queueNumbering.followUpStart}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              queueNumbering: {
                                ...formData.queueNumbering,
                                followUpStart: Math.max(1, parseInt(e.target.value) || 11),
                              },
                            })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <FieldLabel>Follow-up End</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={formData.queueNumbering.followUpEnd}
                          onChange={(e) => {
                            const value = Math.max(1, parseInt(e.target.value) || 80);
                            setFormData({
                              ...formData,
                              maxPatientsPerSlot: Math.max(formData.maxPatientsPerSlot, value),
                              queueNumbering: {
                                ...formData.queueNumbering,
                                followUpEnd: value,
                                overflowPrefix: value + 1,
                              },
                            });
                          }}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <FieldLabel>Extra New Left</FieldLabel>
                        <input
                          type="number"
                          min="1"
                          value={formData.queueNumbering.overflowPrefix}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              queueNumbering: {
                                ...formData.queueNumbering,
                                overflowPrefix: Math.max(1, parseInt(e.target.value) || 81),
                              },
                            })
                          }
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div>
                        <FieldLabel>Extra New Start</FieldLabel>
                        <input
                          type="text"
                          value={`${formData.queueNumbering.overflowPrefix}/${formData.queueNumbering.overflowStart}`}
                          readOnly
                          className={`${inputClass} font-mono bg-slate-100 text-slate-500`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Working schedule */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <SectionLabel icon={Calendar}>Working Schedule</SectionLabel>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, useDifferentTimings: false })}
                    className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                      !formData.useDifferentTimings
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Same timing every day
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        useDifferentTimings: true,
                        weeklySchedule: formData.weeklySchedule || createDefaultWeeklySchedule(),
                      })
                    }
                    className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                      formData.useDifferentTimings
                        ? "bg-teal-600 text-white border-teal-600"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    Different timing per day
                  </button>
                </div>

                {!formData.useDifferentTimings ? (
                  <>
                    <div>
                      <FieldLabel>Daily appointment timings</FieldLabel>
                      {formData.defaultWorkingPeriods.map((period, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          <input
                            type="time"
                            value={period.start}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                defaultWorkingPeriods: formData.defaultWorkingPeriods.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, start: event.target.value } : item
                                ),
                              })
                            }
                            className={`flex-1 ${inputClass}`}
                          />
                          <span className="text-slate-400 text-sm">to</span>
                          <input
                            type="time"
                            value={period.end}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                defaultWorkingPeriods: formData.defaultWorkingPeriods.map((item, itemIndex) =>
                                  itemIndex === index ? { ...item, end: event.target.value } : item
                                ),
                              })
                            }
                            className={`flex-1 ${inputClass}`}
                          />
                          {formData.defaultWorkingPeriods.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  defaultWorkingPeriods: formData.defaultWorkingPeriods.filter(
                                    (_, itemIndex) => itemIndex !== index
                                  ),
                                })
                              }
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                              aria-label="Remove timing"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            defaultWorkingPeriods: [
                              ...formData.defaultWorkingPeriods,
                              { start: "18:00", end: "20:00" },
                            ],
                          })
                        }
                        className="flex items-center gap-2 px-3 py-2 text-teal-700 hover:bg-teal-50 rounded-lg border border-dashed border-teal-300 text-sm font-semibold"
                      >
                        <Plus className="w-4 h-4" />
                        Add timing
                      </button>
                    </div>

                    <div>
                      <FieldLabel>Working Days</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <button
                            key={day.value}
                            type="button"
                            onClick={() => toggleWorkingDay(day.value)}
                            className={`px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                              formData.workingDays.includes(day.value)
                                ? "bg-teal-600 text-white border-teal-600"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
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
                    <FieldLabel>Set timing for each day</FieldLabel>
                    {DAYS_OF_WEEK.map((day) => {
                      const dayKey = day.key;
                      const schedule = formData.weeklySchedule?.[dayKey];
                      const isWorking = schedule?.isWorking !== false;
                      return (
                        <div
                          key={day.value}
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                            isWorking ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              const ws = { ...(formData.weeklySchedule || createDefaultWeeklySchedule()) };
                              ws[dayKey] = {
                                ...ws[dayKey],
                                start: ws[dayKey]?.start || "09:00",
                                end: ws[dayKey]?.end || "17:00",
                                periods: normalizePeriods(ws[dayKey]?.periods, ws[dayKey]),
                                isWorking: !isWorking,
                              };
                              setFormData({ ...formData, weeklySchedule: ws });
                            }}
                            className={`w-14 text-xs font-bold py-1.5 rounded-md border transition-colors flex-shrink-0 ${
                              isWorking
                                ? "bg-teal-600 text-white border-teal-600"
                                : "bg-slate-200 text-slate-500 border-slate-300"
                            }`}
                          >
                            {day.label}
                          </button>

                          {isWorking ? (
                            <div className="flex-1 space-y-2">
                              {normalizePeriods(schedule?.periods, schedule).map((period, periodIndex, periods) => (
                                <div key={periodIndex} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                                  <input
                                    type="time"
                                    value={period.start}
                                    onChange={(event) => {
                                      const ws = { ...(formData.weeklySchedule || createDefaultWeeklySchedule()) };
                                      const updatedPeriods = periods.map((item, itemIndex) =>
                                        itemIndex === periodIndex ? { ...item, start: event.target.value } : item
                                      );
                                      ws[dayKey] = { ...ws[dayKey], periods: updatedPeriods, isWorking: true };
                                      setFormData({ ...formData, weeklySchedule: ws });
                                    }}
                                    className={`min-w-0 flex-1 py-1.5 text-sm ${inputClass}`}
                                  />
                                  <span className="text-slate-400 text-sm">to</span>
                                  <input
                                    type="time"
                                    value={period.end}
                                    onChange={(event) => {
                                      const ws = { ...(formData.weeklySchedule || createDefaultWeeklySchedule()) };
                                      const updatedPeriods = periods.map((item, itemIndex) =>
                                        itemIndex === periodIndex ? { ...item, end: event.target.value } : item
                                      );
                                      ws[dayKey] = { ...ws[dayKey], periods: updatedPeriods, isWorking: true };
                                      setFormData({ ...formData, weeklySchedule: ws });
                                    }}
                                    className={`min-w-0 flex-1 py-1.5 text-sm ${inputClass}`}
                                  />
                                  {periods.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const ws = { ...(formData.weeklySchedule || createDefaultWeeklySchedule()) };
                                        ws[dayKey] = {
                                          ...ws[dayKey],
                                          periods: periods.filter((_, itemIndex) => itemIndex !== periodIndex),
                                          isWorking: true,
                                        };
                                        setFormData({ ...formData, weeklySchedule: ws });
                                      }}
                                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                                      aria-label={`Remove ${day.label} timing`}
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  const ws = { ...(formData.weeklySchedule || createDefaultWeeklySchedule()) };
                                  const periods = normalizePeriods(ws[dayKey]?.periods, ws[dayKey]);
                                  ws[dayKey] = {
                                    ...ws[dayKey],
                                    periods: [...periods, { start: "18:00", end: "20:00" }],
                                    isWorking: true,
                                  };
                                  setFormData({ ...formData, weeklySchedule: ws });
                                }}
                                className="flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add timing
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-sm italic pt-1.5">Day off</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Break times */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <SectionLabel icon={Coffee}>Break Times</SectionLabel>
                {formData.defaultBlockedTimes.map((bt, index) => (
                  <div key={index} className="flex flex-wrap sm:flex-nowrap gap-2 mb-2 items-center">
                    <input
                      type="time"
                      value={bt.start}
                      onChange={(e) => updateBlockedTime(index, "start", e.target.value)}
                      className={inputClass}
                    />
                    <span className="text-slate-500 text-sm">to</span>
                    <input
                      type="time"
                      value={bt.end}
                      onChange={(e) => updateBlockedTime(index, "end", e.target.value)}
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={bt.reason}
                      onChange={(e) => updateBlockedTime(index, "reason", e.target.value)}
                      placeholder="Reason"
                      className={`flex-1 min-w-[120px] ${inputClass}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeBlockedTime(index)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBlockedTime}
                  className="flex items-center gap-2 px-3 py-2 text-teal-700 hover:bg-teal-50 rounded-lg border border-dashed border-teal-300 text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Break Time
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Lunch breaks or any time slots that should not be available for booking
                </p>
              </div>

              {/* Calendar sync */}
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <SectionLabel icon={Building2}>Calendar Sync</SectionLabel>
                <FieldLabel hint="Enter the doctor's Google Calendar email for automatic sync">
                  Google Calendar ID (optional)
                </FieldLabel>
                <input
                  type="email"
                  value={formData.calendarId}
                  onChange={(e) => setFormData({ ...formData, calendarId: e.target.value })}
                  placeholder="doctor@gmail.com"
                  className={`${inputClass} max-w-md`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-semibold transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {saving && <RefreshCw className="w-4 h-4 animate-spin" />}
                {saving ? "Saving..." : editingDoctor ? "Update Doctor" : "Add Doctor"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}