"use client";
import Sidebar from "@/components/Sidebar";
import { appointmentsAPI, availabilityAPI, doctorsAPI } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Coffee,
  FileText,
  Menu,
  Phone,
  Plus,
  RefreshCw,
  Sparkles,
  Stethoscope,
  User,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ==================== TYPES ====================
interface BlockedTime {
  start: string;
  end: string;
  reason: string;
}

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
  phone: string;
  slotDuration: number;
  defaultWorkingHours: { start: string; end: string };
  workingDays: number[];
  weeklySchedule?: WeeklySchedule;
  defaultBlockedTimes?: BlockedTime[];
  allowMultipleBookings?: boolean;
  maxPatientsPerSlot?: number;
  active: boolean;
}

interface FormData {
  patientName: string;
  patientPhone: string;
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
  id?: string;
}

const initialFormData: FormData = {
  patientName: "",
  patientPhone: "",
  doctorId: "",
  doctorName: "",
  date: "",
  time: "",
  reason: "",
  notes: "",
};

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

const getDayHours = (doctor: Doctor, dayOfWeek: number): { start: string; end: string } | null => {
  const dayKey = DAY_KEYS[dayOfWeek];
  const ws = doctor.weeklySchedule;
  if (ws && ws[dayKey] && ws[dayKey].start && ws[dayKey].end) {
    if (!ws[dayKey].isWorking) return null;
    return { start: ws[dayKey].start, end: ws[dayKey].end };
  }
  // Fallback to default
  if (!doctor.workingDays?.includes(dayOfWeek)) return null;
  return doctor.defaultWorkingHours;
};

// ==================== TIME SLOTS ====================
const generateTimeSlots = (
  start: string,
  end: string,
  duration: number,
  blockedTimes: BlockedTime[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = start.split(":").map(Number);
  const [endHour, endMin] = end.split(":").map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  const isTimeInRange = (time: string, rangeStart: string, rangeEnd: string): boolean => {
    const [h, m] = time.split(":").map(Number);
    const [sh, sm] = rangeStart.split(":").map(Number);
    const [eh, em] = rangeEnd.split(":").map(Number);
    
    const timeMinutes = h * 60 + m;
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    
    return timeMinutes >= startMinutes && timeMinutes < endMinutes;
  };

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMin.toString().padStart(2, "0")}`;
    
    // Check if this time falls within any blocked time
    let isBlocked = false;
    let blockReason = "";
    
    for (const blocked of blockedTimes) {
      if (isTimeInRange(timeStr, blocked.start, blocked.end)) {
        isBlocked = true;
        blockReason = blocked.reason || "Break";
        break;
      }
    }
    
    slots.push({ time: timeStr, isBlocked, blockReason });

    currentMin += duration;
    while (currentMin >= 60) {
      currentMin -= 60;
      currentHour += 1;
    }
  }

  return slots;
};

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
      className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 transform hover:scale-[1.02] ${
        isSelected
          ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-50 shadow-lg shadow-orange-100"
          : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-600 to-orange-600 rounded-full p-1.5">
          <CheckCircle2 className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-3 ${isSelected ? "bg-gradient-to-br from-orange-500 to-orange-600" : "bg-gray-100"}`}>
          <Stethoscope className={`h-6 w-6 ${isSelected ? "text-white" : "text-gray-600"}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{doctor.name}</h4>
          <p className="text-sm text-orange-600 font-medium">{doctor.specialization}</p>
          
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-3.5 w-3.5" />
              {doctor.weeklySchedule && Object.values(doctor.weeklySchedule).some(d => d && d.start && d.end) ? (
                <span className="text-orange-600">Custom hours per day</span>
              ) : (
                <span>{doctor.defaultWorkingHours?.start} - {doctor.defaultWorkingHours?.end}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>{doctor.slotDuration} min slots</span>
            </div>
            {doctor.allowMultipleBookings && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Users className="h-3.5 w-3.5" />
                <span>Up to {doctor.maxPatientsPerSlot} patients/slot</span>
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
  maxPatients,
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
    <div className="space-y-4">
      {/* Available Slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-gray-700">
            Available Slots ({availableSlots.length})
          </span>
          {allowMultiple && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Multiple bookings allowed
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {availableSlots.map((slot) => (
            <button
              key={slot.time}
              type="button"
              onClick={() => onSelectTime(slot.time)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedTime === slot.time
                  ? "bg-gradient-to-r from-orange-600 to-orange-600 text-white shadow-lg shadow-orange-200 scale-105"
                  : "bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-300"
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
            <Coffee className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">
              Break Times ({blockedSlots.length} slots)
            </span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {blockedSlots.map((slot) => (
              <div
                key={slot.time}
                className="relative px-3 py-2.5 rounded-xl text-sm font-medium bg-orange-50 text-orange-400 border border-orange-200 cursor-not-allowed group"
                title={slot.blockReason}
              >
                <span className="line-through">{slot.time}</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-green-600" />
        <h3 className="font-semibold text-green-800">Recently Booked</h3>
        <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
          This session
        </span>
      </div>
      <div className="space-y-3">
        {bookings.map((booking, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-white rounded-xl p-3 border border-green-100"
          >
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{booking.patientName}</p>
              <p className="text-xs text-gray-500">
                {booking.doctorName} • {new Date(booking.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} at {booking.time}
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
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [recentBookings, setRecentBookings] = useState<BookedAppointment[]>([]);
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Date/Time, 3: Patient Details

  // ==================== FETCH DOCTORS ====================
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await doctorsAPI.getAll();
      const activeDoctors = (response.data.doctors || []).filter((d: Doctor) => d.active);
      setDoctors(activeDoctors);
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
      setError("Failed to load doctors. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

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
    const dayHours = getDayHours(selectedDoctor, dayOfWeek);
    if (!dayHours) {
      setError(`Doctor is not available on ${DAYS_OF_WEEK[dayOfWeek]}. Please select a working day.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      date,
      time: "",
    }));

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

      // Convert API response to TimeSlot format
      // availableSlots from API are already filtered (no blocked times)
      const apiSlots: TimeSlot[] = (data.availableSlots || []).map((slot: { time: string; start: string }) => ({
        time: slot.start,
        isBlocked: false,
        blockReason: "",
      }));

      // Add blocked times for display (so user can see when breaks are)
      // Only use doctor's configured blocked times - if not set, show all slots
      const blockedTimes = selectedDoctor.defaultBlockedTimes || [];
      const hours = getDayHours(selectedDoctor, dayOfWeek);
      const allSlots = generateTimeSlots(
        hours?.start || selectedDoctor.defaultWorkingHours?.start || "09:00",
        hours?.end || selectedDoctor.defaultWorkingHours?.end || "17:00",
        selectedDoctor.slotDuration || 30,
        blockedTimes
      );

      // Merge: use blocked status from generated, but filter out booked from API
      const bookedTimes = (data.bookedSlots || []).map((s: { start: string }) => s.start);
      const mergedSlots = allSlots.map((slot) => {
        if (slot.isBlocked) {
          return slot; // Keep break times marked as blocked
        }
        // Check if this slot is booked
        if (bookedTimes.includes(slot.time)) {
          return { ...slot, isBlocked: true, blockReason: "Already Booked" };
        }
        return slot;
      });

      setAvailableSlots(mergedSlots);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      // Fallback to local generation - only use doctor's configured blocked times
      const blockedTimes = selectedDoctor.defaultBlockedTimes || [];
      const hours = getDayHours(selectedDoctor, dayOfWeek);
      const slots = generateTimeSlots(
        hours?.start || selectedDoctor.defaultWorkingHours?.start || "09:00",
        hours?.end || selectedDoctor.defaultWorkingHours?.end || "17:00",
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
    if (!formData.time) {
      setError("Please select a time slot");
      return;
    }

    setSubmitting(true);

    try {
      const response = await appointmentsAPI.create({
        name: formData.patientName,
        phone: formData.patientPhone,
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

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
          Book Appointment
        </h1>
        <div className="w-10" />
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                  Book New Appointment
                </h1>
                <p className="text-gray-600 mt-1">
                  Schedule appointments for patients quickly and easily
                </p>
              </div>
              <button
                onClick={fetchDoctors}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh Doctors
              </button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[
                { num: 1, label: "Select Doctor" },
                { num: 2, label: "Choose Date & Time" },
                { num: 3, label: "Patient Details" },
              ].map((s, idx) => (
                <div key={s.num} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                      step >= s.num
                        ? "bg-gradient-to-r from-orange-600 to-orange-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 className="h-5 w-5" /> : s.num}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium hidden sm:block ${
                      step >= s.num ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < 2 && (
                    <div
                      className={`w-8 sm:w-16 h-0.5 mx-2 ${
                        step > s.num ? "bg-gradient-to-r from-orange-600 to-orange-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-green-800 text-lg">Appointment Booked Successfully! 🎉</p>
                <p className="text-sm text-green-600">You can book another appointment or view all appointments.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-red-800 flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-red-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Select Doctor */}
              <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all ${step >= 1 ? "opacity-100" : "opacity-50"}`}>
                <div className="bg-gradient-to-r from-orange-600 to-pink-600 px-6 py-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Step 1: Select Doctor
                  </h2>
                </div>
                <div className="p-5">
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-100 rounded-2xl h-36" />
                      ))}
                    </div>
                  ) : doctors.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Stethoscope className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No doctors available. Please add doctors first.</p>
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
              </div>

              {/* Step 2: Date & Time */}
              {step >= 2 && selectedDoctor && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-orange-600 to-cyan-600 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Step 2: Choose Date & Time for Dr. {selectedDoctor.name}
                    </h2>
                  </div>
                  <div className="p-5 space-y-6">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs text-gray-500">Working Days:</span>
                        {DAYS_OF_WEEK.map((dayLabel, idx) => {
                          const hours = getDayHours(selectedDoctor, idx);
                          if (!hours) return null;
                          return (
                            <span
                              key={idx}
                              className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full"
                              title={`${hours.start} - ${hours.end}`}
                            >
                              {dayLabel} {selectedDoctor.weeklySchedule ? `(${hours.start}-${hours.end})` : ""}
                            </span>
                          );
                        })}
                      </div>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={getMinDate()}
                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-lg"
                      />
                    </div>

                    {/* Time Slots */}
                    {formData.date && availableSlots.length > 0 && (
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
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Coffee className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-800">Scheduled Breaks</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDoctor.defaultBlockedTimes.map((block, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full"
                            >
                              {block.start} - {block.end} ({block.reason})
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Step 3: Patient Details
                    </h2>
                  </div>
                  <form onSubmit={handleSubmit} className="p-5 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Patient Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.patientName}
                            onChange={(e) => handleInputChange("patientName", e.target.value)}
                            placeholder="Enter patient name"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.patientPhone}
                            onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                            placeholder="Enter phone number"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Reason / Purpose
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.reason}
                          onChange={(e) => handleInputChange("reason", e.target.value)}
                          placeholder="e.g., General Checkup, Follow-up, Consultation"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Any special instructions or notes..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>

                    {/* Booking Summary */}
                    <div className="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl p-4 border border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Booking Summary</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Doctor:</span>
                        <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                        <span className="text-gray-500">Date:</span>
                        <span className="font-medium text-gray-900">
                          {formData.date
                            ? new Date(formData.date).toLocaleDateString("en-IN", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </span>
                        <span className="text-gray-500">Time:</span>
                        <span className="font-medium text-gray-900">{formData.time || "-"}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(initialFormData);
                          setSelectedDoctor(null);
                          setAvailableSlots([]);
                          setStep(1);
                          setError(null);
                        }}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                      >
                        Start Over
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
                      >
                        {submitting ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <Plus className="h-5 w-5" />
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total Doctors</span>
                    <span className="font-semibold text-gray-900">{doctors.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Booked Today</span>
                    <span className="font-semibold text-green-600">{recentBookings.length}</span>
                  </div>
                  {selectedDoctor && (
                    <>
                      <hr className="border-gray-100" />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Selected Doctor</span>
                        <span className="font-semibold text-orange-600">{selectedDoctor.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Slot Duration</span>
                        <span className="font-semibold text-gray-900">{selectedDoctor.slotDuration} mins</span>
                      </div>
                      {selectedDoctor.allowMultipleBookings && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Max Patients/Slot</span>
                          <span className="font-semibold text-orange-600">{selectedDoctor.maxPatientsPerSlot}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
