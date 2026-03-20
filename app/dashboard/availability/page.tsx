"use client";
import Sidebar from "@/components/Sidebar";
import { availabilityAPI, doctorsAPI } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ==================== TYPES ====================
interface DaySchedule {
  start: string;
  end: string;
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
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  active: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
  patientName?: string;
  patientPhone?: string;
}

interface AlternateDoctor {
  doctorId: string;
  doctorName: string;
  specialization: string;
  slotDuration?: number;
  availableSlotsCount: number;
  availableSlots?: { time: string; start: string }[];
}

interface AvailabilityData {
  doctorId: string;
  doctorName: string;
  date: string;
  availableSlots: TimeSlot[];
  bookedSlots: TimeSlot[];
  isOnLeave: boolean;
  workingHours: { start: string; end: string };
  alternateDoctors?: AlternateDoctor[];
}

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

const getDayHours = (doctor: Doctor, date: Date): { start: string; end: string } | null => {
  const dayIndex = date.getDay();
  const dayKey = DAY_KEYS[dayIndex];
  const ws = doctor.weeklySchedule;
  if (ws && ws[dayKey] && ws[dayKey].start && ws[dayKey].end) {
    if (!ws[dayKey].isWorking) return null;
    return { start: ws[dayKey].start, end: ws[dayKey].end };
  }
  // Fallback to default
  if (!doctor.workingDays?.includes(dayIndex)) return null;
  return doctor.defaultWorkingHours;
};

const getMonthYear = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

// ==================== MAIN COMPONENT ====================
export default function AvailabilityPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [savingLeave, setSavingLeave] = useState(false);

  // Fetch doctors
  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorsAPI.getAll();
      const activeDoctors = (response.data.doctors || []).filter((d: Doctor) => d.active);
      setDoctors(activeDoctors);
      if (activeDoctors.length > 0 && !selectedDoctor) {
        setSelectedDoctor(activeDoctors[0]);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch doctors";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedDoctor]);

  // Fetch availability
  const fetchAvailability = useCallback(async () => {
    if (!selectedDoctor) return;

    try {
      setLoadingAvailability(true);
      const response = await availabilityAPI.check({
        doctorId: selectedDoctor._id,
        date: formatDate(selectedDate),
      });

      if (response.data.success) {
        setAvailability(response.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch availability:", err);
    } finally {
      setLoadingAvailability(false);
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (selectedDoctor) {
      fetchAvailability();
    }
  }, [selectedDoctor, selectedDate, fetchAvailability]);

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
    if (!confirm(`Cancel appointment for ${slot.patientName} at ${slot.time}?`)) return;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-purple-50/20">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-green-600" />
                Availability Management
              </h1>
              <p className="text-gray-600 mt-1">View and manage doctor schedules and appointments</p>
            </div>

            <button
              onClick={() => {
                fetchDoctors();
                fetchAvailability();
              }}
              disabled={loading || loadingAvailability}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading || loadingAvailability ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Doctor Selection */}
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Select Doctor</h3>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : (
                doctors.map((doctor) => (
                  <button
                    key={doctor._id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`px-4 py-2 rounded-lg border transition-colors flex items-center gap-2 ${
                      selectedDoctor?._id === doctor._id
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Dr. {doctor.name}
                  </button>
                ))
              )}
              {!loading && doctors.length === 0 && (
                <p className="text-gray-500">No active doctors found. Add doctors first.</p>
              )}
            </div>
          </div>

          {/* Date Navigation */}
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {getDayName(selectedDate)}, {selectedDate.getDate()} {getMonthYear(selectedDate)}
                </h2>
                {!isToday && (
                  <button
                    onClick={goToToday}
                    className="text-sm text-orange-600 hover:underline mt-1"
                  >
                    Go to Today
                  </button>
                )}
              </div>

              <button
                onClick={goToNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
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
                        ? "bg-green-600 text-white"
                        : isTodayDate
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-xs font-medium">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold">{date.getDate()}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability View */}
          {selectedDoctor && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Dr. {selectedDoctor.name} - {selectedDoctor.specialization}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedDoctor.slotDuration} min slots •{" "}
                    Today: {(() => {
                      const dayHours = getDayHours(selectedDoctor, selectedDate);
                      const start = availability?.workingHours?.start || dayHours?.start || selectedDoctor.defaultWorkingHours.start;
                      const end = availability?.workingHours?.end || dayHours?.end || selectedDoctor.defaultWorkingHours.end;
                      return `${start} - ${end}`;
                    })()}
                  </p>
                  {selectedDoctor.weeklySchedule && Object.values(selectedDoctor.weeklySchedule).some(d => d && d.start && d.end) && (
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                      {(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const).map((dayLabel, idx) => {
                        const hours = getDayHours(selectedDoctor, (() => { const d = new Date(selectedDate); d.setDate(d.getDate() - d.getDay() + idx); return d; })());
                        if (!hours) return null;
                        const isSelectedDay = selectedDate.getDay() === idx;
                        return (
                          <span key={idx} className={`text-xs ${isSelectedDay ? "text-purple-700 font-semibold" : "text-gray-400"}`}>
                            {dayLabel} {hours.start}-{hours.end}
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
                      className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Remove Leave
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowLeaveModal(true)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <CalendarX className="w-4 h-4" />
                      Mark as Leave
                    </button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {loadingAvailability ? (
                  <div className="flex justify-center py-12">
                    <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                ) : availability?.isOnLeave ? (
                  <div className="text-center py-8">
                    <CalendarX className="w-16 h-16 text-red-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">Doctor on Leave</h3>
                    <p className="text-gray-500 mt-2">
                      Dr. {selectedDoctor.name} is on leave for this date.
                    </p>
                    
                    {/* Alternate Doctors Section */}
                    {availability.alternateDoctors && availability.alternateDoctors.length > 0 && (
                      <div className="mt-6 border-t pt-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                          🔄 Available Alternate Doctors ({availability.alternateDoctors[0].specialization})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                          {availability.alternateDoctors.map((altDoc) => (
                            <div
                              key={altDoc.doctorId}
                              className="bg-green-50 border border-green-200 rounded-xl p-4 text-left"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-gray-900">
                                  Dr. {altDoc.doctorName}
                                </h5>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                  {altDoc.availableSlotsCount} slots available
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{altDoc.specialization}</p>
                              {altDoc.availableSlots && altDoc.availableSlots.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {altDoc.availableSlots.map((slot) => (
                                    <span
                                      key={slot.start}
                                      className="text-xs bg-white border border-green-300 text-green-700 px-2 py-1 rounded"
                                    >
                                      {slot.time}
                                    </span>
                                  ))}
                                  {altDoc.availableSlotsCount > 5 && (
                                    <span className="text-xs text-gray-500 px-2 py-1">
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
                                className="mt-3 w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                View Dr. {altDoc.doctorName}&apos;s Schedule
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                          💡 The AI agent will automatically suggest these doctors to callers
                        </p>
                      </div>
                    )}
                    
                    {(!availability.alternateDoctors || availability.alternateDoctors.length === 0) && (
                      <p className="text-sm text-sky-600 mt-4">
                        ⚠️ No alternate doctors with same specialization available
                      </p>
                    )}
                  </div>
                ) : isPast ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">Past Date</h3>
                    <p className="text-gray-500 mt-2">
                      Appointments cannot be managed for past dates.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-700">
                          {availability?.availableSlots?.length || 0}
                        </div>
                        <div className="text-sm text-green-600">Available Slots</div>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-orange-700">
                          {availability?.bookedSlots?.length || 0}
                        </div>
                        <div className="text-sm text-orange-600">Booked</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-gray-700">
                          {(availability?.availableSlots?.length || 0) +
                            (availability?.bookedSlots?.length || 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Slots</div>
                      </div>
                    </div>

                    {/* Booked Appointments */}
                    {availability?.bookedSlots && availability.bookedSlots.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-3">Booked Appointments</h4>
                        <div className="space-y-2">
                          {availability.bookedSlots.map((slot) => (
                            <div
                              key={slot.time}
                              className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-200"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-orange-700">
                                  <Clock className="w-4 h-4" />
                                  <span className="font-semibold">{slot.time}</span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{slot.patientName}</p>
                                  <p className="text-sm text-gray-500">{slot.patientPhone}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCancelAppointment(slot)}
                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
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
                      <h4 className="font-medium text-gray-900 mb-3">Available Time Slots</h4>
                      {availability?.availableSlots && availability.availableSlots.length > 0 ? (
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                          {availability.availableSlots.map((slot) => (
                            <div
                              key={slot.time}
                              className="py-2 px-3 bg-green-50 border border-green-200 rounded-lg text-center text-sm font-medium text-green-700"
                            >
                              {slot.time}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No available slots for this date
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {!selectedDoctor && !loading && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">No Doctor Selected</h3>
              <p className="text-gray-500 mt-2">
                {doctors.length > 0
                  ? "Select a doctor to view their availability"
                  : "Add doctors first to manage availability"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mark as Leave</h2>
            <p className="text-gray-600 mb-4">
              Mark Dr. {selectedDoctor?.name} as on leave for{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (optional)
              </label>
              <textarea
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                placeholder="e.g., Personal leave, Conference, Sick leave..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  setLeaveReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetLeave}
                disabled={savingLeave}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {savingLeave ? "Saving..." : "Confirm Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
