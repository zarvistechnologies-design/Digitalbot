"use client";
import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/components/hooks/use-websocket";
import { availabilityAPI, doctorsAPI } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    Ban,
    Calendar,
    CalendarX,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Hash,
    Menu,
    RefreshCw,
    User,
    X,
    XCircle
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

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
  slotDuration: number;
  defaultWorkingHours: { start: string; end: string };
  defaultWorkingPeriods?: TimePeriod[];
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  queueNumbering?: {
    enabled?: boolean;
  };
  active: boolean;
}

interface TimeSlot {
  time: string;
  start?: string;
  end?: string;
  available: boolean;
  appointmentId?: string;
  patientName?: string;
  patientPhone?: string;
  patientType?: "new" | "follow_up";
  queueNumber?: string;
}

interface AlternateDoctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  slotDuration?: number;
  availableSlotsCount: number;
  availableSlots?: { time: string; start: string }[];
}

interface BlockedTime {
  start: string;
  end: string;
  reason: string;
}

interface AvailabilityData {
  doctorId: string;
  doctorName: string;
  date: string;
  availableSlots: TimeSlot[];
  bookedSlots: TimeSlot[];
  isOnLeave: boolean;
  workingHours: { start: string; end: string };
  workingPeriods?: TimePeriod[];
  manualBlockedTimes?: BlockedTime[];
  queueNumbering?: {
    enabled?: boolean;
  };
  alternateDoctors?: AlternateDoctor[];
}

const AVAILABILITY_REALTIME_EVENTS = new Set([
  "appointment-created",
  "appointment-update",
  "appointment-deleted",
  "availability-update",
]);

// ==================== HELPERS ====================
const formatDate = (date: Date): string => {
  // Use local date components (IST) - not UTC
  // toISOString() converts to UTC which can shift the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDayName = (date: Date): string => {
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const normalizePeriods = (periods?: TimePeriod[], fallback?: { start?: string; end?: string }): TimePeriod[] => {
  if (periods && periods.length > 0) return periods;
  if (fallback?.start && fallback?.end) return [{ start: fallback.start, end: fallback.end }];
  return [];
};

const hasWeeklySchedule = (doctor: Doctor): boolean => Boolean(
  doctor.weeklySchedule && Object.values(doctor.weeklySchedule).some(schedule => (
    schedule && normalizePeriods(schedule.periods, schedule).length > 0
  ))
);

const getDayPeriods = (doctor: Doctor, date: Date): TimePeriod[] => {
  const dayIndex = date.getDay();
  const dayKey = DAY_KEYS[dayIndex];
  const ws = doctor.weeklySchedule;
  if (hasWeeklySchedule(doctor)) {
    const schedule = ws?.[dayKey];
    if (!schedule || schedule.isWorking === false) return [];
    return normalizePeriods(schedule.periods, schedule);
  }
  if (!doctor.workingDays?.includes(dayIndex)) return [];
  return normalizePeriods(doctor.defaultWorkingPeriods, doctor.defaultWorkingHours);
};

const getMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const isQueueMode = (doctor: Doctor | null, availability: AvailabilityData | null) => {
  return Boolean(availability?.queueNumbering?.enabled || doctor?.queueNumbering?.enabled);
};

const getSlotDisplay = (slot: TimeSlot, queueMode: boolean) => {
  if (queueMode) return slot.queueNumber ? `Queue No. ${slot.queueNumber}` : "Queue number pending";
  return slot.time || slot.start || "No time set";
};

const getQueueNumberParts = (queueNumber?: string) => {
  const parts = String(queueNumber || "").match(/\d+/g) || [];
  return {
    first: parts[0] ? Number(parts[0]) : Number.MAX_SAFE_INTEGER,
    second: parts[1] ? Number(parts[1]) : 0,
    raw: String(queueNumber || ""),
  };
};

const compareQueueNumbers = (a?: string, b?: string) => {
  const left = getQueueNumberParts(a);
  const right = getQueueNumberParts(b);

  if (left.first !== right.first) return left.first - right.first;
  if (left.second !== right.second) return left.second - right.second;

  return left.raw.localeCompare(right.raw, undefined, { numeric: true, sensitivity: "base" });
};

const getDisplayBookedSlots = (slots: TimeSlot[], queueMode: boolean) => {
  if (!queueMode) return slots;

  return [...slots].sort((a, b) => compareQueueNumbers(a.queueNumber, b.queueNumber));
};

const getPatientTypeLabel = (patientType?: TimeSlot["patientType"]) => {
  return patientType === "follow_up" ? "Follow-up" : "New patient";
};

const getPatientInitials = (name?: string) => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "P";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

// ==================== MAIN COMPONENT ====================
export default function AvailabilityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [savingLeave, setSavingLeave] = useState(false);
  const [blockedTimeToUnblock, setBlockedTimeToUnblock] = useState<BlockedTime | null>(null);
  const [unblockingTime, setUnblockingTime] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const realtimeRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    data: doctors = [],
    isPending: loading,
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

  useEffect(() => {
    if (!selectedDoctor && doctors.length > 0) setSelectedDoctor(doctors[0]);
  }, [doctors, selectedDoctor]);

  const availabilityDate = formatDate(selectedDate);
  const {
    data: availability = null,
    isFetching: loadingAvailability,
    refetch: fetchAvailability,
  } = useQuery<AvailabilityData | null>({
    queryKey: ["availability", selectedDoctor?._id, availabilityDate],
    enabled: Boolean(selectedDoctor),
    queryFn: async () => {
      const response = await availabilityAPI.check({
        doctorId: selectedDoctor!._id,
        date: availabilityDate,
      });
      return response.data.success ? response.data : null;
    },
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const error = doctorsError?.message || null;

  const scheduleRealtimeRefresh = useCallback(() => {
    if (realtimeRefreshTimer.current) clearTimeout(realtimeRefreshTimer.current);
    realtimeRefreshTimer.current = setTimeout(() => {
      void fetchAvailability();
    }, 200);
  }, [fetchAvailability]);

  useWebSocket({
    onMessage: useCallback((message: { type?: string }) => {
      if (message?.type && AVAILABILITY_REALTIME_EVENTS.has(message.type)) {
        scheduleRealtimeRefresh();
      }
    }, [scheduleRealtimeRefresh]),
  });

  useEffect(() => () => {
    if (realtimeRefreshTimer.current) clearTimeout(realtimeRefreshTimer.current);
  }, []);

  // Navigate dates
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Cancel appointment
  const handleCancelAppointment = async (slot: TimeSlot) => {
    if (!slot.appointmentId) return;
    if (!confirm(`Cancel appointment for ${slot.patientName} (${getSlotDisplay(slot, queueMode)})?`)) return;

    try {
      await availabilityAPI.cancel({
        appointmentId: slot.appointmentId,
        reason: "Cancelled by admin",
      });
      fetchAvailability();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to cancel appointment";
      alert(errorMessage);
    }
  };

  // Set leave
  const handleSetLeave = async () => {
    if (!selectedDoctor) return;
    setSavingLeave(true);

    try {
      await availabilityAPI.setLeave({
        doctorId: selectedDoctor._id,
        date: formatDate(selectedDate),
        isOnLeave: true,
        reason: leaveReason,
      });
      setShowLeaveModal(false);
      setLeaveReason("");
      fetchAvailability();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to set leave";
      alert(errorMessage);
    } finally {
      setSavingLeave(false);
    }
  };

  // Remove leave
  const handleRemoveLeave = async () => {
    if (!selectedDoctor) return;
    if (!confirm("Remove leave and make doctor available?")) return;

    try {
      await availabilityAPI.setLeave({
        doctorId: selectedDoctor._id,
        date: formatDate(selectedDate),
        isOnLeave: false,
      });
      fetchAvailability();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove leave";
      alert(errorMessage);
    }
  };

  const handleUnblockTime = async () => {
    if (!selectedDoctor || !blockedTimeToUnblock) return;

    setUnblockingTime(true);
    try {
      const response = await availabilityAPI.unblockTime({
        doctorId: selectedDoctor._id,
        date: availabilityDate,
        startTime: blockedTimeToUnblock.start,
        endTime: blockedTimeToUnblock.end,
        reason: blockedTimeToUnblock.reason,
      });
      const data = response.data || {};
      setSuccessMessage(
        data.stillBlocked
          ? `The selected ${blockedTimeToUnblock.start}-${blockedTimeToUnblock.end} block was removed, but another block still overlaps this period.`
          : `${blockedTimeToUnblock.start}-${blockedTimeToUnblock.end} is available for new bookings again. Cancelled appointments remain cancelled.`
      );
      setBlockedTimeToUnblock(null);
      await fetchAvailability();
      setTimeout(() => setSuccessMessage(null), 8000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to unblock time";
      alert(errorMessage);
    } finally {
      setUnblockingTime(false);
    }
  };

  // Generate week view
  const getWeekDates = (): Date[] => {
    const dates: Date[] = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const isToday = formatDate(selectedDate) === formatDate(new Date());
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
  const queueMode = isQueueMode(selectedDoctor, availability);
  const visibleBookedSlots = getDisplayBookedSlots(availability?.bookedSlots || [], queueMode);
  const scheduleTimeCards = [
    ...(availability?.availableSlots || []).map((slot) => ({
      kind: "available" as const,
      sortTime: slot.start || slot.time,
      key: `available-${slot.start || slot.time}`,
      label: slot.time || slot.start || "Available",
      blockedTime: null,
    })),
    ...(availability?.manualBlockedTimes || []).map((blockedTime) => ({
      kind: "blocked" as const,
      sortTime: blockedTime.start,
      key: `blocked-${blockedTime.start}-${blockedTime.end}-${blockedTime.reason}`,
      label: `${blockedTime.start}-${blockedTime.end}`,
      blockedTime,
    })),
  ].sort((left, right) => left.sortTime.localeCompare(right.sortTime));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Menu Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-sm border border-slate-200"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      )}

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <div className="p-4 lg:p-8 pt-20 lg:pt-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-1.5">
                Schedule Ledger
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-950 flex items-center gap-3">
                <div className="bg-slate-900 p-2 rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Availability Management
              </h1>
              <p className="text-slate-500 mt-2 text-sm">View and manage doctor schedules and appointments</p>
            </div>

            <button
              onClick={() => {
                fetchDoctors();
                fetchAvailability();
              }}
              disabled={loading || loadingAvailability}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors text-sm font-semibold text-slate-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading || loadingAvailability ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-3 text-rose-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}

          {/* Doctor Selection */}
          <div className="bg-white rounded-xl p-5 mb-6 border border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Select Doctor</h3>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-32 bg-slate-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                doctors.map((doctor) => (
                  <button
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 text-sm font-semibold ${
                      selectedDoctor?._id === doctor._id
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Dr. {doctor.name}
                  </button>
                ))
              )}
              {!loading && doctors.length === 0 && (
                <p className="text-slate-500 text-sm">No active doctors found. Add doctors first.</p>
              )}
            </div>
          </div>

          {/* Date Navigation */}
          <div className="bg-white rounded-xl p-5 mb-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>

              <div className="text-center">
                <h2 className="text-base font-bold text-slate-900">
                  {getDayName(selectedDate)}, {selectedDate.getDate()} {getMonthYear(selectedDate)}
                </h2>
                {!isToday && (
                  <button
                    onClick={goToToday}
                    className="text-xs font-semibold text-teal-700 hover:underline mt-1"
                  >
                    Go to Today
                  </button>
                )}
              </div>

              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Week View */}
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date) => {
                const isSelected = formatDate(date) === formatDate(selectedDate);
                const isTodayDate = formatDate(date) === formatDate(new Date());
                return (
                  <button
                    key={formatDate(date)}
                    onClick={() => setSelectedDate(date)}
                    className={`py-2 px-1 rounded-lg text-center transition-colors ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : isTodayDate
                        ? "bg-teal-50 text-teal-700 ring-1 ring-teal-300 hover:bg-teal-100"
                        : "hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-wide">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold font-mono">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability View */}
          {selectedDoctor && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900">
                <div>
                  <h3 className="font-bold text-white">
                    Dr. {selectedDoctor.name} <span className="text-slate-400 font-normal">— {selectedDoctor.specialization}</span>
                  </h3>
                  <p className="text-sm text-slate-400 font-mono">
                    {queueMode ? "OPD queue mode" : `${selectedDoctor.slotDuration} min slots`} |{" "}
                    Today: {(() => {
                      const periods = availability?.workingPeriods?.length
                        ? availability.workingPeriods
                        : getDayPeriods(selectedDoctor, selectedDate);
                      return periods.map(period => `${period.start} - ${period.end}`).join(", ") || "Not working";
                    })()}
                  </p>
                  {hasWeeklySchedule(selectedDoctor) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                      {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map((dayLabel, idx) => {
                        const periods = getDayPeriods(selectedDoctor, (() => { const d = new Date(selectedDate); d.setDate(d.getDate() - d.getDay() + idx); return d; })());
                        if (periods.length === 0) return null;
                        const isSelectedDay = selectedDate.getDay() === idx;
                        return (
                          <span key={idx} className={`text-[11px] font-mono ${isSelectedDay ? "text-teal-300 font-semibold" : "text-slate-500"}`}>
                            {dayLabel} {periods.map(period => `${period.start}-${period.end}`).join(", ")}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {availability?.isOnLeave ? (
                    <button
                      onClick={handleRemoveLeave}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <Calendar className="w-4 h-4" />
                      Remove Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold"
                    >
                      <CalendarX className="w-4 h-4" />
                      Mark as Leave
                    </button>
                  )}
                </div>
              </div>

              {!loadingAvailability &&
                !availability?.isOnLeave &&
                !isPast &&
                queueMode &&
                Boolean(availability?.manualBlockedTimes?.length) && (
                  <div className="border-b border-slate-200 bg-rose-50/50 px-4 py-5 sm:px-6">
                    <div className="mb-3 flex items-center gap-2">
                      <Ban className="h-4 w-4 text-rose-600" />
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700">Blocked Periods</h4>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {availability?.manualBlockedTimes?.map((blockedTime) => (
                        <button
                          key={`${blockedTime.start}-${blockedTime.end}-${blockedTime.reason}`}
                          type="button"
                          onClick={() => setBlockedTimeToUnblock(blockedTime)}
                          className="rounded-lg border border-rose-200 bg-white p-4 text-left transition-colors hover:border-rose-300 hover:bg-rose-50"
                        >
                          <div className="flex items-center gap-2 font-bold text-rose-700 text-sm font-mono">
                            <Clock className="h-3.5 w-3.5" />
                            {blockedTime.start}-{blockedTime.end}
                          </div>
                          <p className="mt-1 text-xs text-rose-600">
                            {blockedTime.reason || "Doctor unavailable"}
                          </p>
                          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-rose-500">Click to unblock</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Content */}
              <div className="p-6">
                {loadingAvailability ? (
                  <div className="flex justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
                  </div>
                ) : availability?.isOnLeave ? (
                  <div className="text-center py-8">
                    <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarX className="w-7 h-7 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Doctor on Leave</h3>
                    <p className="text-slate-500 mt-2 text-sm">
                      Dr. {selectedDoctor.name} is on leave for this date.
                    </p>

                    {/* Alternate Doctors Section */}
                    {availability.alternateDoctors && availability.alternateDoctors.length > 0 && (
                      <div className="mt-6 border-t border-slate-200 pt-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                          Available Alternate Doctors · {availability.alternateDoctors[0].specialization}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {availability.alternateDoctors.map((altDoc) => (
                            <div
                              key={altDoc.doctorId}
                              className="bg-white border border-slate-200 rounded-xl p-4 text-left"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-bold text-slate-900 text-sm">
                                  Dr. {altDoc.doctorName}
                                </h5>
                                <span className="text-[11px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-semibold font-mono">
                                  {altDoc.availableSlotsCount} slots
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mb-3">{altDoc.specialization}</p>
                              {altDoc.availableSlots && altDoc.availableSlots.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {altDoc.availableSlots.map((slot) => (
                                    <span
                                      key={slot.start}
                                      className="text-[11px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded font-mono"
                                    >
                                      {slot.time}
                                    </span>
                                  ))}
                                  {altDoc.availableSlotsCount > 5 && (
                                    <span className="text-[11px] text-slate-400 px-2 py-1">
                                      +{altDoc.availableSlotsCount - 5} more
                                    </span>
                                  )}
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  const altDoctor = doctors.find(d => d._id === altDoc.doctorId);
                                  if (altDoctor) setSelectedDoctor(altDoctor);
                                }}
                                className="mt-3 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                              >
                                View Dr. {altDoc.doctorName}&apos;s Schedule
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-400 mt-4">
                          The AI agent will automatically suggest these doctors to callers
                        </p>
                      </div>
                    )}

                    {(!availability.alternateDoctors || availability.alternateDoctors.length === 0) && (
                      <p className="text-sm text-sky-700 mt-4">
                        No alternate doctors with same specialization available
                      </p>
                    )}
                  </div>
                ) : isPast ? (
                  <div className="text-center py-12">
                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-7 h-7 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Past Date</h3>
                    <p className="text-slate-500 mt-2 text-sm">
                      Appointments cannot be managed for past dates.
                    </p>
                  </div>
                ) : queueMode ? (
                  <div className="space-y-5">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-teal-200 bg-teal-50 text-teal-700">
                          <Hash className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">OPD Queue</h4>
                          <p className="text-xs text-slate-500 font-mono">
                            {visibleBookedSlots.length} {visibleBookedSlots.length === 1 ? "patient" : "patients"} for{" "}
                            {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <div className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">Mode</p>
                          <p className="text-sm font-bold text-teal-900">Queue</p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Time Slots</p>
                          <p className="text-sm font-bold text-slate-900">Hidden</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-lg border border-slate-200">
                      <div className="hidden bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-slate-500 sm:grid sm:grid-cols-[140px_minmax(0,1fr)_140px_52px]">
                        <span>Token</span>
                        <span>Patient</span>
                        <span>Type</span>
                        <span className="text-right">Action</span>
                      </div>

                      {visibleBookedSlots.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                          {visibleBookedSlots.map((slot, index) => (
                            <div
                              key={slot.appointmentId || `${slot.queueNumber || "queue"}-${index}`}
                              className="grid grid-cols-1 gap-3 px-4 py-3 transition-colors hover:bg-slate-50 sm:grid-cols-[140px_minmax(0,1fr)_140px_52px] sm:items-center"
                            >
                              <div className="flex items-center gap-2">
                                <span className="inline-flex min-w-16 items-center justify-center rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-bold text-teal-700 font-mono">
                                  {slot.queueNumber || `#${index + 1}`}
                                </span>
                              </div>

                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                                  {getPatientInitials(slot.patientName)}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate font-semibold text-slate-900 text-sm">{slot.patientName || "Patient"}</p>
                                  <p className="truncate text-xs text-slate-500 font-mono">{slot.patientPhone || "No phone"}</p>
                                </div>
                              </div>

                              <div>
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                    slot.patientType === "follow_up"
                                      ? "bg-sky-50 text-sky-700 border border-sky-200"
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  {getPatientTypeLabel(slot.patientType)}
                                </span>
                              </div>

                              <button
                                onClick={() => handleCancelAppointment(slot)}
                                className="justify-self-start rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50 sm:justify-self-end"
                                title="Cancel Appointment"
                              >
                                <XCircle className="h-5 w-5" />
                                <span className="sr-only">Cancel Appointment</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-10 text-center">
                          <Hash className="mx-auto h-8 w-8 text-slate-300" />
                          <h4 className="mt-3 font-bold text-slate-900 text-sm">No queue bookings</h4>
                          <p className="mt-1 text-xs text-slate-500">Patients booked for this date will appear here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-teal-700 font-mono">
                          {queueMode ? "ON" : (availability?.availableSlots?.length || 0)}
                        </div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-teal-700">{queueMode ? "Queue Mode" : "Available Slots"}</div>
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-amber-700 font-mono">
                          {availability?.bookedSlots?.length || 0}
                        </div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">{queueMode ? "Queue Bookings" : "Booked"}</div>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-slate-700 font-mono">
                          {queueMode
                            ? (availability?.bookedSlots?.length || 0)
                            : (availability?.availableSlots?.length || 0) + (availability?.bookedSlots?.length || 0)}
                        </div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{queueMode ? "Total Tokens" : "Total Slots"}</div>
                      </div>
                    </div>

                    {/* Booked Appointments */}
                    {availability?.bookedSlots && availability.bookedSlots.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                          {queueMode ? "OPD Queue Bookings" : "Booked Appointments"}
                        </h4>
                        <div className="space-y-2">
                          {getDisplayBookedSlots(availability.bookedSlots, queueMode).map((slot) => (
                            <div
                              key={slot.appointmentId || slot.queueNumber || slot.time}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200 gap-3">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-amber-700">
                                  {queueMode ? <Hash className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                  <span className="font-bold text-sm font-mono">{getSlotDisplay(slot, queueMode)}</span>
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-900 text-sm">{slot.patientName}</p>
                                  <p className="text-xs text-slate-500 font-mono">
                                    {slot.patientPhone}
                                    {queueMode && slot.patientType ? ` • ${getPatientTypeLabel(slot.patientType)}` : ""}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCancelAppointment(slot)}
                                className="p-2 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                                title="Cancel Appointment"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Slots */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                        {queueMode ? "Queue Availability" : "Time Slots"}
                      </h4>
                      {queueMode ? (
                        <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-800">
                          OPD queue is enabled for this doctor. Fixed time slots are hidden; patients are managed by queue/token number.
                        </div>
                      ) : scheduleTimeCards.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
                          {scheduleTimeCards.map((card) =>
                            card.kind === "blocked" && card.blockedTime ? (
                              <button
                                key={card.key}
                                type="button"
                                onClick={() => setBlockedTimeToUnblock(card.blockedTime)}
                                title={`${card.blockedTime.reason || "Doctor unavailable"} — click to unblock`}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-center transition-colors hover:border-rose-300 hover:bg-rose-100"
                              >
                                <span className="block text-sm font-bold text-rose-700 font-mono">{card.label}</span>
                                <span className="block truncate text-[10px] font-semibold uppercase tracking-wide text-rose-500">Blocked · Unblock</span>
                              </button>
                            ) : (
                              <div
                                key={card.key}
                                className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-center text-sm font-semibold text-teal-700 font-mono"
                              >
                                {card.label}
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4 text-sm">
                          No available or manually blocked slots for this date
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!selectedDoctor && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Doctor Selected</h3>
              <p className="text-slate-500 mt-2 text-sm">
                {doctors.length > 0
                  ? "Select a doctor to view their availability"
                  : "Add doctors first to manage availability"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Unblock Time Modal */}
      {blockedTimeToUnblock && selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => !unblockingTime && setBlockedTimeToUnblock(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Unblock This Time?</h2>
                <p className="mt-1 text-sm text-slate-500 font-mono">
                  Dr. {selectedDoctor.name} · {blockedTimeToUnblock.start}-
                  {blockedTimeToUnblock.end}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBlockedTimeToUnblock(null)}
                disabled={unblockingTime}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                This manual block will be removed and newly free slots can be booked again.
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Previously cancelled appointments will remain cancelled. Other overlapping schedule
                blocks will still apply.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setBlockedTimeToUnblock(null)}
                disabled={unblockingTime}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                Keep Blocked
              </button>
              <button
                type="button"
                onClick={() => void handleUnblockTime()}
                disabled={unblockingTime}
                className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {unblockingTime && <RefreshCw className="h-4 w-4 animate-spin" />}
                {unblockingTime ? "Unblocking..." : "Unblock Time"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="bg-white rounded-xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-6 py-5">
              <h2 className="text-lg font-bold text-white">Mark as Leave</h2>
              <p className="text-slate-400 text-sm mt-1">
                Dr. {selectedDoctor?.name} ·{" "}
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Reason (optional)
                </label>
                <textarea
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="e.g., Personal leave, Conference, Sick leave..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-100 focus:border-rose-500 outline-none text-sm text-slate-900"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowLeaveModal(false);
                    setLeaveReason("");
                  }}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetLeave}
                  disabled={savingLeave}
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 font-semibold text-sm"
                >
                  {savingLeave ? "Saving..." : "Confirm Leave"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}