"use client";
import Sidebar from "@/components/Sidebar";
import { appointmentsAPI, availabilityAPI, doctorsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  FileText,
  Menu,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

// ==================== TYPES ====================
interface BlockedTime {
  start: string;
  end: string;
  reason: string;
}

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
  slotDuration: number;
  defaultWorkingHours: { start: string; end: string };
  defaultWorkingPeriods?: TimePeriod[];
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  defaultBlockedTimes?: BlockedTime[];
  allowMultipleBookings?: boolean;
  maxPatientsPerSlot?: number;
  queueNumbering?: QueueNumbering;
  active: boolean;
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

interface FormData {
  patientName: string;
  patientPhone: string;
  location: string;
  patientType: "new" | "follow_up";
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
}

interface TimeSlot {
  time: string;
  isBlocked: boolean;
  blockReason?: string;
}

interface BookedAppointment {
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  queueNumber?: string;
  id?: string;
}

const initialFormData: FormData = {
  patientName: "",
  patientPhone: "",
  location: "",
  patientType: "new",
  doctorId: "",
  doctorName: "",
  date: "",
  time: "",
  reason: "",
  notes: "",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const normalizePeriods = (periods?: TimePeriod[], fallback?: { start?: string; end?: string }): TimePeriod[] => {
  if (periods && periods.length > 0) return periods;
  if (fallback?.start && fallback?.end) return [{ start: fallback.start, end: fallback.end }];
  return [];
};

const hasWeeklySchedule = (doctor: Doctor): boolean => Boolean(
  doctor.weeklySchedule && Object.values(doctor.weeklySchedule).some(schedule => (
    schedule && (normalizePeriods(schedule.periods, schedule).length > 0)
  ))
);

const getDayPeriods = (doctor: Doctor, dayOfWeek: number): TimePeriod[] => {
  const dayKey = DAY_KEYS[dayOfWeek];
  const ws = doctor.weeklySchedule;
  if (hasWeeklySchedule(doctor)) {
    const schedule = ws?.[dayKey];
    if (!schedule || schedule.isWorking === false) return [];
    return normalizePeriods(schedule.periods, schedule);
  }
  if (!doctor.workingDays?.includes(dayOfWeek)) return [];
  return normalizePeriods(doctor.defaultWorkingPeriods, doctor.defaultWorkingHours);
};

const isQueueDoctor = (doctor: Doctor | null) => Boolean(doctor?.queueNumbering?.enabled);

// ==================== TIME SLOTS ====================
const generateTimeSlots = (
  periods: TimePeriod[],
  duration: number,
  blockedTimes: BlockedTime[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  for (const period of periods) {
    let currentMinutes = toMinutes(period.start);
    const periodEnd = toMinutes(period.end);
    while (currentMinutes + duration <= periodEnd) {
      const timeStr = `${Math.floor(currentMinutes / 60).toString().padStart(2, "0")}:${(currentMinutes % 60).toString().padStart(2, "0")}`;
      const slotEnd = currentMinutes + duration;
      const blocked = blockedTimes.find(item => (
        currentMinutes < toMinutes(item.end) && slotEnd > toMinutes(item.start)
      ));
      slots.push({
        time: timeStr,
        isBlocked: Boolean(blocked),
        blockReason: blocked?.reason || "",
      });
      currentMinutes += duration;
    }
  }

  return slots;
};

// ==================== SECTION HEADER ====================
function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-slate-900 p-2.5 rounded-lg">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-0.5">{eyebrow}</p>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}

// ==================== DOCTOR CARD ====================
function DoctorCard({
  doctor,
  isSelected,
  onSelect,
}: {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-xl border p-5 transition-all ${
        isSelected
          ? "border-teal-300 bg-teal-50/40 shadow-sm"
          : "border-slate-200 bg-white hover:border-teal-300 hover:shadow-sm"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 bg-teal-600 rounded-full p-1">
          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-3 transition-colors ${isSelected ? "bg-slate-900" : "bg-slate-100"}`}>
          <Stethoscope className={`h-5 w-5 ${isSelected ? "text-white" : "text-slate-500"}`} />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 truncate">Dr. {doctor.name}</h4>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-700 mt-0.5">{doctor.specialization}</p>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wide">
                <Clock className="h-3.5 w-3.5" /> Hours
              </span>
              {hasWeeklySchedule(doctor) ? (
                <span className="font-mono font-semibold text-teal-700">Custom / day</span>
              ) : (
                <span className="font-mono font-semibold text-slate-700">
                  {normalizePeriods(doctor.defaultWorkingPeriods, doctor.defaultWorkingHours).map(period => (
                    `${period.start}-${period.end}`
                  )).join(", ")}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 font-semibold uppercase tracking-wide">
                <Calendar className="h-3.5 w-3.5" /> Slot
              </span>
              <span className="font-mono font-semibold text-slate-700">{doctor.slotDuration} min</span>
            </div>
            {doctor.allowMultipleBookings && (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                <span className="flex items-center gap-1.5 text-emerald-700 font-semibold uppercase tracking-wide">
                  <Users className="h-3.5 w-3.5" /> Capacity
                </span>
                <span className="font-mono font-semibold text-emerald-700">{doctor.maxPatientsPerSlot}/slot</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TIME SLOT GRID ====================
function TimeSlotGrid({
  slots,
  selectedTime,
  onSelectTime,
  allowMultiple,
}: {
  slots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (time: string) => void;
  allowMultiple?: boolean;
  maxPatients?: number;
}) {
  const availableSlots = slots.filter((s) => !s.isBlocked);
  const blockedSlots = slots.filter((s) => s.isBlocked);

  return (
    <div className="space-y-5">
      {/* Available Slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-teal-600" />
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Available Slots
          </span>
          <span className="font-mono text-xs font-bold text-slate-900">({availableSlots.length})</span>
          {allowMultiple && (
            <span className="text-[10px] font-semibold uppercase tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
              Multiple bookings
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              onClick={() => onSelectTime(slot.time)}
              className={`px-3 py-2.5 rounded-lg text-sm font-bold font-mono transition-all border ${
                selectedTime === slot.time
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>

      {/* Break Times */}
      {blockedSlots.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Coffee className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Break Times
            </span>
            <span className="font-mono text-xs font-bold text-slate-900">({blockedSlots.length})</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {blockedSlots.map((slot) => (
              <div
                key={slot.time}
                className="relative px-3 py-2.5 rounded-lg text-sm font-mono font-semibold bg-rose-50 text-rose-400 border border-rose-200 cursor-not-allowed group"
                title={slot.blockReason}
              >
                <span className="line-through">{slot.time}</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[11px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {slot.blockReason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== RECENT BOOKINGS ====================
function RecentBookings({ bookings }: { bookings: BookedAppointment[] }) {
  if (bookings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-emerald-50 border-b border-emerald-100 px-5 py-4 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800">Recently Booked</h3>
        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
          This session
        </span>
      </div>
      <div className="p-4 space-y-2.5">
        {bookings.map((booking, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-slate-50 rounded-lg p-3 border border-slate-200"
          >
            <div className="bg-white border border-slate-200 rounded-lg p-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-900 truncate text-sm">{booking.patientName}</p>
              {booking.queueNumber && (
                <p className="text-xs font-mono font-bold text-teal-700">Queue No. {booking.queueNumber}</p>
              )}
              <p className="text-[11px] text-slate-500 font-mono">
                {booking.doctorName} · {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                {booking.time ? ` · ${booking.time}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function BookAppointmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookedAppointment[]>([]);
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Date/Time, 3: Patient Details

  const {
    data: doctors = [],
    isPending: doctorsLoading,
    error: doctorsError,
    refetch: fetchDoctors,
  } = useQuery<Doctor[], Error, Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await doctorsAPI.getAll();
      return response.data.doctors || [];
    },
    select: (allDoctors) => allDoctors.filter((doctor) => doctor.active),
  });
  const displayError = error || doctorsError?.message || null;

  // ==================== HANDLE DOCTOR SELECTION ====================
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setFormData((prev) => ({
      ...prev,
      doctorId: doctor._id,
      doctorName: doctor.name,
      time: "",
      date: "",
    }));
    setAvailableSlots([]);
    setStep(2);
  };

  // ==================== HANDLE DATE SELECTION ====================
  const handleDateChange = async (date: string) => {
    if (!selectedDoctor) return;

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    // Check if the selected day is a working day for the doctor
    const dayPeriods = getDayPeriods(selectedDoctor, dayOfWeek);
    if (dayPeriods.length === 0) {
      setError(`Doctor is not available on ${DAYS_OF_WEEK[dayOfWeek]}. Please select a working day.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      date,
      time: "",
    }));

    if (isQueueDoctor(selectedDoctor)) {
      setAvailableSlots([]);
      setStep(3);
      return;
    }

    // Fetch actual availability from API (properly filters out blocked/lunch times)
    try {
      setLoading(true);
      const response = await availabilityAPI.check({
        doctorId: selectedDoctor._id,
        date: date,
      });

      const data = response.data;

      if (data.isOnLeave) {
        setError(`Doctor is on leave: ${data.leaveReason || 'Not available'}`);
        setAvailableSlots([]);
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Add blocked times for display (so user can see when breaks are)
      // Only use doctor's configured blocked times - if not set, show all slots
      const blockedTimes = selectedDoctor.defaultBlockedTimes || [];
      const allSlots = generateTimeSlots(
        dayPeriods,
        selectedDoctor.slotDuration || 30,
        blockedTimes
      );

      // Merge: fixed-slot doctors block booked times; multiple/queue doctors trust API capacity.
      const bookedTimes = (data.bookedSlots || []).map((s: { start: string }) => s.start);
      const availableTimes = new Set((data.availableSlots || []).map((s: { start: string }) => s.start));
      const usesSharedSlot = Boolean(selectedDoctor.allowMultipleBookings || selectedDoctor.queueNumbering?.enabled);
      const mergedSlots = allSlots.map((slot) => {
        if (slot.isBlocked) {
          return slot; // Keep break times marked as blocked
        }
        if (usesSharedSlot && !availableTimes.has(slot.time)) {
          return { ...slot, isBlocked: true, blockReason: "Full" };
        }
        if (!usesSharedSlot && bookedTimes.includes(slot.time)) {
          return { ...slot, isBlocked: true, blockReason: "Already Booked" };
        }
        return slot;
      });

      setAvailableSlots(mergedSlots);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      // Fallback to local generation - only use doctor's configured blocked times
      const blockedTimes = selectedDoctor.defaultBlockedTimes || [];
      const slots = generateTimeSlots(
        dayPeriods,
        selectedDoctor.slotDuration || 30,
        blockedTimes
      );
      setAvailableSlots(slots);
    } finally {
      setLoading(false);
    }
  };

  // ==================== HANDLE TIME SELECTION ====================
  const handleTimeSelect = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      time,
    }));
    setStep(3);
  };

  // ==================== HANDLE INPUT CHANGE ====================
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==================== SUBMIT FORM ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.patientName.trim()) {
      setError("Patient name is required");
      return;
    }
    if (!formData.patientPhone.trim()) {
      setError("Patient phone is required");
      return;
    }
    if (!formData.doctorId) {
      setError("Please select a doctor");
      return;
    }
    if (!formData.date) {
      setError("Please select a date");
      return;
    }
    if (!formData.time && !isQueueDoctor(selectedDoctor)) {
      setError("Please select a time slot");
      return;
    }

    setSubmitting(true);

    try {
      const response = await appointmentsAPI.create({
        name: formData.patientName,
        phone: formData.patientPhone,
        location: formData.location.trim() || undefined,
        patientType: formData.patientType,
        doctorId: formData.doctorId,
        doctorName: formData.doctorName,
        date: formData.date,
        time: formData.time,
        reason: formData.reason || "General Consultation",
        notes: formData.notes,
      });

      // Add to recent bookings
      setRecentBookings((prev) => [
        {
          patientName: formData.patientName,
          doctorName: formData.doctorName,
          date: formData.date,
          time: formData.time,
          queueNumber: response.data?.data?.queueNumber,
          id: response.data?.data?._id,
        },
        ...prev,
      ].slice(0, 5));

      setSuccess(true);

      // Reset form for next booking (but keep doctor selected)
      setFormData({
        ...initialFormData,
        doctorId: selectedDoctor?._id || "",
        doctorName: selectedDoctor?.name || "",
        patientType: "new",
      });

      // Clear success after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      // Go back to step 2 to book another
      setStep(2);

    } catch (err: any) {
      console.error("Failed to book appointment:", err);
      setError(err.response?.data?.error || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== GET MINIMUM DATE ====================
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const STEPS = [
    { num: 1, label: "Select Doctor" },
    { num: 2, label: "Choose Date" },
    { num: 3, label: "Patient Details" },
  ];

  // ==================== RENDER ====================
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu className="h-6 w-6 text-slate-600" />
        </button>
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Book Appointment
        </h1>
        <div className="w-10" />
      </div>

      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950/50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header + Progress Steps combined into one compact card */}
          <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Title block */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="rounded-lg border border-slate-200 bg-slate-900 p-2.5 sm:p-3 shrink-0">
                  <Plus className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700 leading-none mb-1">
                    New Entry
                  </p>
                  <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl leading-tight">
                    Book Appointment
                  </h1>
                </div>
              </div>

              {/* Progress steps - inline, compact */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 lg:flex-1 lg:px-6">
                {STEPS.map((s, idx) => (
                  <div key={s.num} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-md font-bold font-mono text-xs transition-all ${
                        step >= s.num
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {step > s.num ? <CheckCircle2 className="h-3.5 w-3.5" /> : String(s.num).padStart(2, "0")}
                    </div>
                    <span
                      className={`ml-1.5 text-[11px] font-bold uppercase tracking-wide hidden md:block ${
                        step >= s.num ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                    {idx < STEPS.length - 1 && (
                      <div
                        className={`w-6 sm:w-10 h-0.5 mx-2 ${
                          step > s.num ? "bg-teal-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Refresh button */}
              <button
                onClick={() => void fetchDoctors()}
                disabled={doctorsLoading}
                className="flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-lg hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition disabled:opacity-50 text-xs font-semibold shrink-0"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${doctorsLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Appointment booked successfully</p>
                <p className="text-xs text-emerald-700">You can book another appointment or view all appointments.</p>
              </div>
            </div>
          )}

          {displayError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="flex-1 text-sm font-medium">{displayError}</p>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-rose-100 rounded-md transition-colors"
              >
                <X className="h-4 w-4 text-rose-600" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select Doctor */}
              <div className={`bg-white rounded-xl border border-slate-200 p-5 sm:p-6 transition-opacity ${step >= 1 ? "opacity-100" : "opacity-50"}`}>
                <SectionHeader
                  icon={Stethoscope}
                  eyebrow="Step 01"
                  title="Select Doctor"
                  subtitle="Choose which doctor the patient will see"
                />
                {doctorsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse bg-slate-100 rounded-xl h-36" />
                    ))}
                  </div>
                ) : doctors.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Stethoscope className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No doctors available. Please add doctors first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {doctors.map((doctor) => (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        isSelected={selectedDoctor?._id === doctor._id}
                        onSelect={() => handleDoctorSelect(doctor)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Date & Time */}
              {step >= 2 && selectedDoctor && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                  <SectionHeader
                    icon={Calendar}
                    eyebrow="Step 02"
                    title={`Choose ${isQueueDoctor(selectedDoctor) ? "Date & Queue" : "Date & Time"}`}
                    subtitle={`For Dr. ${selectedDoctor.name}`}
                  />
                  <div className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                        Select Date <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 self-center">Working Days</span>
                        {DAYS_OF_WEEK.map((dayLabel, idx) => {
                          const periods = getDayPeriods(selectedDoctor, idx);
                          if (periods.length === 0) return null;
                          const periodsLabel = periods.map(period => `${period.start}-${period.end}`).join(", ");
                          return (
                            <span
                              key={idx}
                              className="text-[11px] font-mono font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded"
                              title={periodsLabel}
                            >
                              {dayLabel} {hasWeeklySchedule(selectedDoctor) ? `(${periodsLabel})` : ""}
                            </span>
                          );
                        })}
                      </div>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={getMinDate()}
                        className="w-full max-w-xs px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 font-mono"
                      />
                    </div>

                    {formData.date && isQueueDoctor(selectedDoctor) && (
                      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                        OPD queue is enabled for this doctor. Time is not required; a queue number will be assigned after booking.
                      </div>
                    )}

                    {/* Time Slots */}
                    {loading && (
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Loading availability...
                      </div>
                    )}
                    {formData.date && !isQueueDoctor(selectedDoctor) && availableSlots.length > 0 && (
                      <TimeSlotGrid
                        slots={availableSlots}
                        selectedTime={formData.time}
                        onSelectTime={handleTimeSelect}
                        allowMultiple={selectedDoctor.allowMultipleBookings}
                        maxPatients={selectedDoctor.maxPatientsPerSlot}
                      />
                    )}

                    {/* Break Times Info */}
                    {selectedDoctor.defaultBlockedTimes && selectedDoctor.defaultBlockedTimes.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2.5">
                          <Coffee className="h-4 w-4 text-rose-500" />
                          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Scheduled Breaks</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.defaultBlockedTimes.map((block, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-mono font-semibold bg-white border border-slate-200 text-slate-600 px-2.5 py-1 rounded"
                            >
                              {block.start}-{block.end} ({block.reason})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Patient Details */}
              {step >= 3 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                  <SectionHeader
                    icon={User}
                    eyebrow="Step 03"
                    title="Patient Details"
                    subtitle="Confirm who the appointment is for"
                  />
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                          Patient Name <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.patientName}
                            onChange={(e) => handleInputChange("patientName", e.target.value)}
                            placeholder="Enter patient name"
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                          Phone Number <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                          <input
                            type="tel"
                            value={formData.patientPhone}
                            onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                        Location / Branch <span className="text-slate-400 normal-case">(optional)</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="e.g., Assi, Ramnagar, Main Branch"
                          maxLength={160}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    {selectedDoctor?.queueNumbering?.enabled && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                          Patient Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleInputChange("patientType", "new")}
                            className={`px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                              formData.patientType === "new"
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            New Patient
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInputChange("patientType", "follow_up")}
                            className={`px-4 py-3 rounded-lg border text-sm font-bold transition-all ${
                              formData.patientType === "follow_up"
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                            }`}
                          >
                            Old / Follow-up
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                        Reason / Purpose
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                        <input
                          type="text"
                          value={formData.reason}
                          onChange={(e) => handleInputChange("reason", e.target.value)}
                          placeholder="e.g., General Checkup, Follow-up, Consultation"
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Any special instructions or notes..."
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all resize-none text-slate-900"
                      />
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Booking Summary</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-slate-500 font-medium">Doctor</span>
                        <span className="font-bold text-slate-900 text-right">Dr. {selectedDoctor?.name}</span>
                        <span className="text-slate-500 font-medium">Date</span>
                        <span className="font-bold text-slate-900 font-mono text-right">
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                        <span className="text-slate-500 font-medium">{isQueueDoctor(selectedDoctor) ? "Queue" : "Time"}</span>
                        <span className="font-bold text-slate-900 font-mono text-right">
                          {isQueueDoctor(selectedDoctor) ? "Assigned after booking" : formData.time || "-"}
                        </span>
                        {selectedDoctor?.queueNumbering?.enabled && (
                          <>
                            <span className="text-slate-500 font-medium">Patient Type</span>
                            <span className="font-bold text-slate-900 text-right">
                              {formData.patientType === "follow_up" ? "Old / Follow-up" : "New Patient"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(initialFormData);
                          setSelectedDoctor(null);
                          setAvailableSlots([]);
                          setStep(1);
                          setError(null);
                        }}
                        className="flex-1 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-all font-semibold text-sm"
                      >
                        Start Over
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Plus className="h-4.5 w-4.5" />
                            Confirm Booking
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Sidebar - Recent Bookings */}
            <div className="space-y-6">
              <RecentBookings bookings={recentBookings} />

              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Quick Info</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-sm">
                    <span className="text-slate-500 font-medium">Total Doctors</span>
                    <span className="font-bold text-slate-900 font-mono">{doctors.length}</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-sm">
                    <span className="text-slate-500 font-medium">Booked This Session</span>
                    <span className="font-bold text-emerald-700 font-mono">{recentBookings.length}</span>
                  </div>
                  {selectedDoctor && (
                    <>
                      <hr className="border-slate-100 my-1" />
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-teal-50 border border-teal-100 text-sm">
                        <span className="text-teal-700 font-semibold">Selected Doctor</span>
                        <span className="font-bold text-teal-900">Dr. {selectedDoctor.name}</span>
                      </div>
                      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-sm">
                        <span className="text-slate-500 font-medium">Slot Duration</span>
                        <span className="font-bold text-slate-900 font-mono">{selectedDoctor.slotDuration} mins</span>
                      </div>
                      {selectedDoctor.allowMultipleBookings && (
                        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-sm">
                          <span className="text-slate-500 font-medium">Max Patients/Slot</span>
                          <span className="font-bold text-slate-900 font-mono">{selectedDoctor.maxPatientsPerSlot}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}