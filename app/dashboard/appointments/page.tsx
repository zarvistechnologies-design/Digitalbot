"use client";
import Sidebar from "@/components/Sidebar";
import {
    AlertCircle,
    ArrowLeft,
    Bot,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    HeartPulse,
    Menu,
    Phone,
    RefreshCw,
    Search,
    Stethoscope,
    User,
    X,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// ==================== TYPES ====================
interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  purpose: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show" | "rescheduled";
  date: string;
  time: string;
  callId?: string;
  source: "millis_ai_auto" | "manual" | "web" | "api";
  notes?: string;
  transcription?: any;
  metadata?: {
    call_duration?: number;
    agent_id?: string;
    agent_name?: string;
    call_direction?: string;
    confidence_score?: number;
    doctor_name?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ==================== CONSTANTS ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';

const statusStyles: Record<Appointment["status"], string> = {
  scheduled: "bg-orange-100 text-orange-700 border-orange-300",
  confirmed: "bg-green-100 text-green-700 border-green-300",
  completed: "bg-orange-100 text-orange-700 border-orange-300",
  cancelled: "bg-red-100 text-red-700 border-red-300",
  "no-show": "bg-gray-100 text-gray-700 border-gray-300",
  rescheduled: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const statusColors: Record<Appointment["status"], string> = {
  scheduled: "orange",
  confirmed: "green",
  completed: "purple",
  cancelled: "red",
  "no-show": "gray",
  rescheduled: "yellow",
};

// ==================== HELPER FUNCTIONS ====================
function getAuthHeaders() {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token") || "demo-token";
      headers["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      headers["Authorization"] = "Bearer demo-token";
    }
  }
  return headers;
}

// ==================== BADGE COMPONENTS ====================
function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SourceBadge({ source }: { source: Appointment["source"] }) {
  const isAI = source === "millis_ai_auto";
  const isManual = source === "manual";

  const getStyles = () => {
    if (isAI) return "bg-orange-100 text-orange-700";
    if (isManual) return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-600";
  };

  const getLabel = () => {
    if (isAI) return "AI";
    if (isManual) return "Manual";
    return source;
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${getStyles()}`}
    >
      {isAI && <Zap className="w-3 h-3" />}
      {getLabel()}
    </span>
  );
}

// ==================== APPOINTMENT MODAL ====================
function AppointmentModal({
  apt,
  onClose,
  onUpdate,
}: {
  apt: Appointment;
  onClose: () => void;
  onUpdate: (id: string, newStatus: Appointment["status"]) => void;
}) {
  const color = statusColors[apt.status] || "gray";
  const gradientMap = {
    green: "from-green-600 to-green-500",
    yellow: "from-yellow-600 to-yellow-500",
    orange: "from-orange-600 to-orange-500",
    red: "from-red-600 to-red-500",
    purple: "from-orange-600 to-orange-600",
    gray: "from-gray-600 to-gray-500",
  };
  const headerClass = `bg-gradient-to-r ${gradientMap[color as keyof typeof gradientMap]} p-6 flex justify-between items-center`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={headerClass}>
          <div>
            <h2 className="text-xl sm:text-3xl font-bold text-white mb-2">Appointment Details</h2>
            {apt.source === "millis_ai_auto" && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Auto-Created</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2.5 rounded-xl transition">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-200px)] sm:max-h-[calc(90vh-200px)]">
          {/* AI Analysis Section */}
          {apt.source === "millis_ai_auto" && apt.metadata && (
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 border-2 border-orange-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 text-orange-900 flex items-center gap-2">
                <Zap className="w-6 h-6" />
                AI Analysis Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {apt.metadata.confidence_score && (
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-orange-700 font-semibold mb-1">Confidence Score</p>
                    <p className="text-3xl font-bold text-orange-900">
                      {Math.round(apt.metadata.confidence_score * 100)}%
                    </p>
                  </div>
                )}
                {apt.metadata.doctor_name && (
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-orange-700 font-semibold mb-1">Doctor Requested</p>
                    <p className="text-lg font-bold text-orange-900">Dr. {apt.metadata.doctor_name}</p>
                  </div>
                )}
                {apt.metadata.call_duration && (
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-orange-700 font-semibold mb-1">Call Duration</p>
                    <p className="text-lg font-bold text-orange-900">
                      {Math.floor(apt.metadata.call_duration / 60)} minutes
                    </p>
                  </div>
                )}
                {apt.metadata.call_direction && (
                  <div className="bg-white p-4 rounded-xl">
                    <p className="text-sm text-orange-700 font-semibold mb-1">Call Type</p>
                    <p className="text-lg font-bold text-orange-900 capitalize">{apt.metadata.call_direction}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patient Information */}
          <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-orange-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Full Name</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{apt.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Phone Number</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{apt.phone}</p>
              </div>
              {apt.email && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Email Address</p>
                  <p className="text-lg font-bold text-gray-900">{apt.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Appointment Information
            </h3>
            <div className="space-y-4">
              {apt.metadata?.doctor_name && (
                <div className="bg-green-100 border-2 border-green-300 p-4 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold flex items-center gap-2 mb-1">
                    <Stethoscope className="w-4 h-4" />
                    Assigned Doctor
                  </p>
                  <p className="text-2xl font-bold text-green-900">Dr. {apt.metadata.doctor_name}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Date</p>
                  <p className="text-lg font-bold text-gray-900" suppressHydrationWarning>
                    {new Date(apt.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                  <p className="text-sm text-gray-600 font-semibold mb-1">Time</p>
                  <p className="text-lg font-bold text-gray-900">{apt.time}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">Purpose of Visit</p>
                <p className="text-base text-gray-900 font-medium leading-relaxed">{apt.purpose}</p>
              </div>
              {apt.notes && (
                <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                  <p className="text-sm text-yellow-700 font-semibold mb-2">Additional Notes</p>
                  <p className="text-sm text-gray-800">{apt.notes}</p>
                </div>
              )}
            </div>
          </div>

             {/* Transcription */}
           {apt.transcription && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                Call Transcription
              </h3>
              <div className="max-h-96 overflow-y-auto bg-white p-4 rounded-xl border border-gray-200">
                {(() => {
                  // Try to parse if it's a string
                  let transcriptionData = apt.transcription;
                  if (typeof apt.transcription === "string") {
                    try {
                      transcriptionData = JSON.parse(apt.transcription);
                    } catch (e) {
                      // If parsing fails, display as plain text
                      return <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{apt.transcription}</p>;
                    }
                  }

                  // If it's an array, render as conversation
                  if (Array.isArray(transcriptionData)) {
                    return (
                      <div className="space-y-3">
                        {transcriptionData.map((msg: any, idx: number) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-orange-50 border-l-4 border-orange-500"
                                : "bg-orange-50 border-l-4 border-orange-500"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs font-bold uppercase ${
                                  msg.role === "user" ? "text-orange-700" : "text-orange-700"
                                }`}
                              >
                                {msg.role === "user" ? "Patient" : "Assistant"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // If it's an object with text or transcript property
                  if (transcriptionData.text || transcriptionData.transcript) {
                    return (
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {transcriptionData.text || transcriptionData.transcript}
                      </p>
                    );
                  }

                  // Fallback to JSON display
                  return (
                    <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                      {JSON.stringify(transcriptionData, null, 2)}
                    </pre>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Status Management */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5 pb-4 border-b-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Update Status</h3>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <button
                onClick={() => onUpdate(apt._id, "completed")}
                disabled={apt.status === "completed"}
                className="px-4 py-3 text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                ✔ Complete
              </button>
              <button
                onClick={() => onUpdate(apt._id, "rescheduled")}
                disabled={apt.status === "rescheduled"}
                className="px-4 py-3 text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 text-white hover:bg-yellow-600 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                🔄 Reschedule
              </button>
              <button
                onClick={() => onUpdate(apt._id, "cancelled")}
                disabled={apt.status === "cancelled"}
                className="px-4 py-3 text-sm font-bold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                🚫 Cancel
              </button>
            </div>


          </div>

          {/* Follow-up Call Section */}
          <div className="relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-orange-600 px-5 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Patient Follow-up Assistant</h3>
                    <p className="text-orange-200 text-[10px]">Automated post-consultation care</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-[10px] font-medium">Ready</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Patient Info Card */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{apt.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" /> {apt.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500">Last Visit</p>
                  <p className="text-xs font-semibold text-gray-700">{new Date(apt.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Main Action Button */}
              <button
                onClick={() => {
                  // TODO: Connect to AI Agent for automated follow-up call
                  alert(`Follow-up call will be initiated to ${apt.name} at ${apt.phone}`);
                }}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-lg p-3 text-sm font-semibold transition-all hover:shadow-xl hover:shadow-orange-500/25"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-700 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span> AI consultation Follow-up Call</span>
                  <div className="flex items-center gap-0.5 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                    <Zap className="w-2.5 h-2.5" />
                    Auto
                  </div>
                </div>
              </button>

              {/* Follow-up Type Selection */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Select Follow-up Type</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => alert('Health review follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded-lg hover:border-rose-400 hover:shadow-md transition-all group"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-700">Health</span>
                  </button>
                  <button
                    onClick={() => alert('Post-appointment follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gradient-to-br from-sky-50 to-orange-50 border border-sky-200 rounded-lg hover:border-sky-400 hover:shadow-md transition-all group"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-700">Post Visit</span>
                  </button>
                  <button
                    onClick={() => alert('Medication follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg hover:border-amber-400 hover:shadow-md transition-all group"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-medium text-gray-700">Medication</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="text-xs text-gray-500 flex flex-wrap gap-4 justify-between pt-4 border-t-2 border-gray-200">
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <Clock className="w-3 h-3" />
              Created: {new Date(apt.createdAt).toLocaleString()}
            </span>
            <span className="flex items-center gap-1" suppressHydrationWarning>
              <RefreshCw className="w-3 h-3" />
              Updated: {new Date(apt.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t-2 border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-xl font-bold transition shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AppointmentsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | Appointment["status"]>("All");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clinicName, setClinicName] = useState("My Clinic");
  const [filterMonth, setFilterMonth] = useState<string>("All");
  const [filterYear, setFilterYear] = useState<string>("All");

  useEffect(() => {
    setMounted(true);
    // Fetch user data to get clinic name
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const userData = await response.json();
          if (userData.ClinicName) {
            setClinicName(userData.ClinicName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };
    fetchUserData();
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!mounted) return;

    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "10000" });
      if (filterStatus !== "All") params.append("status", filterStatus);
      if (searchTerm) params.append("name", searchTerm);

      const url = `${API_BASE_URL}/appointments?${params.toString()}`;
      const response = await fetch(url, { method: "GET", headers: getAuthHeaders() });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        const sortedAppointments = (data.appointments || []).sort(
          (a: Appointment, b: Appointment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setAppointments(sortedAppointments);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("Failed to fetch appointments");
      setAppointments([]);
    }
    setLoading(false);
  }, [filterStatus, searchTerm, mounted]);

  const updateAppointmentStatus = async (appointmentId: string | undefined, newStatus: Appointment["status"]) => {
    if (!appointmentId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update");
      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          newStatus === "confirmed"
            ? "✅ Appointment confirmed! Email sent to doctor."
            : `Status updated to ${newStatus}!`
        );
        setTimeout(() => setSuccessMessage(null), 5000);
        setSelectedAppointment(null);
        await fetchAppointments();
      }
    } catch (err) {
      setError("Failed to update appointment");
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchAppointments();
    }
  }, [fetchAppointments, mounted]);

  // Group appointments by doctor
  const doctorGroups = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      const doctor = apt.metadata?.doctor_name || "Unassigned";
      if (!groups[doctor]) groups[doctor] = [];
      groups[doctor].push(apt);
    });
    return groups;
  }, [appointments]);

  const doctors = Object.keys(doctorGroups).sort();

  // Get available years from appointments
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    appointments.forEach((apt) => {
      const year = new Date(apt.date).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [appointments]);

  // Filter appointments by selected doctor, date, month and year
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    if (selectedDoctor) {
      filtered = filtered.filter((apt) => (apt.metadata?.doctor_name || "Unassigned") === selectedDoctor);
    }

    if (selectedDate) {
      filtered = filtered.filter(
        (apt) => new Date(apt.date).toDateString() === new Date(selectedDate).toDateString()
      );
    }

    // Filter by month
    if (filterMonth !== "All") {
      filtered = filtered.filter((apt) => {
        const aptMonth = new Date(apt.date).getMonth();
        return aptMonth === parseInt(filterMonth);
      });
    }

    // Filter by year
    if (filterYear !== "All") {
      filtered = filtered.filter((apt) => {
        const aptYear = new Date(apt.date).getFullYear();
        return aptYear === parseInt(filterYear);
      });
    }

    return filtered;
  }, [appointments, selectedDoctor, selectedDate, filterMonth, filterYear]);

  // Get appointments for calendar
  const getAppointmentsForDate = useCallback(
    (date: Date) => {
      return filteredAppointments.filter((apt) => {
        const appointmentDate = new Date(apt.date);
        appointmentDate.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === compareDate.getTime();
      });
    },
    [filteredAppointments]
  );

  const renderCalendar = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 bg-gray-50/50 rounded"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      // Use local date components - not UTC
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const dateAppts = getAppointmentsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate === dateStr;

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(isSelected ? null : dateStr)}
          className={`h-9 flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium transition-all ${
            isSelected
              ? "bg-gradient-to-br from-orange-600 to-orange-500 text-white shadow-lg scale-105"
              : isToday
              ? "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-700 font-bold ring-2 ring-orange-400"
              : dateAppts.length > 0
              ? "bg-green-50 text-green-700 hover:bg-green-100 font-semibold"
              : "hover:bg-gray-100 text-gray-600"
          }`}
        >
          <div className="relative">
            {day}
            {dateAppts.length > 0 && !isSelected && (
              <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                {dateAppts.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-green-500 rounded-full"></div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-50">
        <div className="hidden lg:block w-64 bg-gray-900"></div>
        <main className="flex-1 lg:ml-64"></main>
      </div>
    );
  }

  // ==================== DOCTOR SELECTION VIEW ====================
  if (!selectedDoctor) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-50">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          >
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
          <div className="max-w-[1400px] mx-auto space-y-8">
            {/* Hospital Header */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600 to-pink-500 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

              <div className="relative z-10 p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-5">
                    <div className="bg-white/20 backdrop-blur-md p-3 sm:p-5 rounded-2xl border border-white/30 shadow-xl">
                      <Building2 className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{clinicName}</h1>
                      <p className="text-orange-100 text-sm sm:text-lg font-medium mb-4">
                        Advanced Appointment Management System
                      </p>
                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                        <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/30">
                          <div className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5">Total Appointments</div>
                          <div className="text-white text-lg sm:text-2xl font-bold">{appointments.length}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/30">
                          <div className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5">Active Doctors</div>
                          <div className="text-white text-lg sm:text-2xl font-bold">{doctors.length}</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/30">
                          <div className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5">Today's Schedule</div>
                          <div className="text-white text-lg sm:text-2xl font-bold">
                            {
                              appointments.filter(
                                (a) => new Date(a.date).toDateString() === new Date().toDateString()
                              ).length
                            }
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 rounded-xl border border-white/30">
                          <div className="text-white/80 text-[10px] sm:text-xs font-medium mb-0.5">AI Auto-Created</div>
                          <div className="text-white text-lg sm:text-2xl font-bold flex items-center gap-1">
                            <Zap className="w-5 h-5" />
                            {appointments.filter((a) => a.source === "millis_ai_auto").length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={fetchAppointments}
                    disabled={loading}
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 p-3 rounded-xl transition border border-white/30 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-6 h-6 text-white ${loading ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-medium">{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
                <AlertCircle className="w-6 h-6" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Doctor Selection Grid */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-3 rounded-xl shadow-lg">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Select Doctor</h2>
                  <p className="text-gray-500 text-sm">Click on a doctor card to view their appointments</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {doctors.map((doctor) => {
                    const doctorAppts = doctorGroups[doctor];
                    const todayAppts = doctorAppts.filter(
                      (a) => new Date(a.date).toDateString() === new Date().toDateString()
                    );
                    const confirmedAppts = doctorAppts.filter((a) => a.status === "confirmed").length;

                    return (
                      <div
                        key={doctor}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="group cursor-pointer rounded-2xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-gray-50 to-white shadow-md border-2 border-gray-200 hover:border-orange-300"
                      >
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-orange-100">
                            <User className="w-7 h-7 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold truncate text-gray-900">
                              {doctor === "Unassigned" ? "⚠ Unassigned" : `Dr. ${doctor}`}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {doctor === "Unassigned" ? "No doctor assigned" : "Specialist"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-600">Total</span>
                            </div>
                            <span className="font-bold text-xl text-orange-600">{doctorAppts.length}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-600">Today</span>
                            </div>
                            <span
                              className={`font-bold text-xl ${
                                todayAppts.length > 0 ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {todayAppts.length}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-gray-600">Confirmed</span>
                            </div>
                            <span className="font-bold text-xl text-orange-600">{confirmedAppts}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center text-orange-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                          <span>View Appointments</span>
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== DOCTOR'S APPOINTMENT VIEW ====================
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-50">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        >
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
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Back Button & Doctor Header */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSelectedDoctor(null);
                setSelectedDate(null);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl transition border border-gray-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Doctors</span>
            </button>
          </div>

          {/* Doctor Info Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-600 rounded-2xl shadow-xl p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                <Stethoscope className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-3xl font-bold">Dr. {selectedDoctor}</h1>
                <p className="text-orange-100 mt-1 text-sm sm:text-base">
                  {selectedDate
                    ? `Viewing appointments for ${new Date(selectedDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "All Appointments"}{" "}
                  • {filteredAppointments.length} total
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3">
                {selectedDate && (
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm font-semibold text-sm sm:text-base"
                  >
                    Clear Date
                  </button>
                )}
                <button
                  onClick={fetchAppointments}
                  disabled={loading}
                  className="px-3 sm:px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition backdrop-blur-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3 shadow-md">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Main Content: Calendar + Appointments */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Calendar on the Right */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-gray-900 text-lg">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
                    <div key={i} className="text-center text-xs font-bold text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">{renderCalendar()}</div>

                {/* Quick Stats */}
                <div className="mt-6 pt-5 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Showing:</span>
                    <span className="font-bold text-gray-900 text-lg">{filteredAppointments.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-orange-50 p-2 rounded-lg text-center">
                      <div className="text-xs text-orange-600 font-medium">Scheduled</div>
                      <div className="text-lg font-bold text-orange-700">
                        {filteredAppointments.filter((a) => a.status === "scheduled").length}
                      </div>
                    </div>
                    <div className="bg-green-50 p-2 rounded-lg text-center">
                      <div className="text-xs text-green-600 font-medium">Confirmed</div>
                      <div className="text-lg font-bold text-green-700">
                        {filteredAppointments.filter((a) => a.status === "confirmed").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List on the Left */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
                {/* Search & Filters */}
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex-1 min-w-[160px] sm:min-w-[200px] relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-gray-900 font-medium"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-semibold text-gray-900 bg-white"
                    >
                      <option value="All">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-semibold text-gray-900 bg-white"
                    >
                      <option value="All">All Months</option>
                      <option value="0">January</option>
                      <option value="1">February</option>
                      <option value="2">March</option>
                      <option value="3">April</option>
                      <option value="4">May</option>
                      <option value="5">June</option>
                      <option value="6">July</option>
                      <option value="7">August</option>
                      <option value="8">September</option>
                      <option value="9">October</option>
                      <option value="10">November</option>
                      <option value="11">December</option>
                    </select>
                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 font-semibold text-gray-900 bg-white"
                    >
                      <option value="All">All Years</option>
                      {availableYears.map((year) => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600"></div>
                    </div>
                  ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((apt) => (
                      <div
                        key={apt._id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="group bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="flex gap-4">
                          {/* Patient Avatar */}
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                              <User className="w-7 h-7 text-white" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Name & Status Row */}
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{apt.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span className="font-medium">{apt.phone}</span>
                                  </div>
                                  {/* Quick Follow-up Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      alert(`Follow-up call to ${apt.name}\nPhone: ${apt.phone}\n\nAI Agent integration coming soon!`);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-xs font-bold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                                    title="Follow-up Call"
                                  >
                                    <Bot className="w-3.5 h-3.5" />
                                    <span>Follow-up</span>
                                  </button>
                                </div>
                              </div>
                              <StatusBadge status={apt.status} />
                            </div>

                            {/* Badges Row */}
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <SourceBadge source={apt.source} />
                              {apt.source === "millis_ai_auto" && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-lg text-xs font-bold">
                                  <Zap className="w-3 h-3" />
                                  AI Automated
                                </span>
                              )}
                              {apt.metadata?.confidence_score && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                  {Math.round(apt.metadata.confidence_score * 100)}% Confidence
                                </span>
                              )}
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {new Date(apt.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-lg">
                                <Clock className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-semibold text-gray-700">{apt.time}</span>
                              </div>
                            </div>

                            {/* Purpose */}
                            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="text-xs text-gray-500 font-medium mb-1">Purpose of Visit</div>
                                  <p className="text-sm text-gray-900 font-medium">{apt.purpose}</p>
                                </div>
                              </div>
                            </div>

                            {/* Timestamp */}
                            <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Created{" "}
                              {new Date(apt.createdAt).toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No Appointments Found</h3>
                      <p className="text-gray-500">
                        {selectedDate
                          ? "No appointments scheduled for this date"
                          : "This doctor has no appointments yet"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentModal
          apt={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdate={updateAppointmentStatus}
        />
      )}
    </div>
  );
}


