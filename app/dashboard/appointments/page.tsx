"use client";
import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/components/hooks/use-websocket";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    ArrowLeft,
    Ban,
    Bot,
    Building2,
    Calendar,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    Hash,
    HeartPulse,
    Menu,
    Phone,
    RefreshCw,
    Search,
    Stethoscope,
    User,
    X,
    XCircle,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

// ==================== TYPES ====================
interface Appointment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  age?: number | string | null;
  patientAge?: number | string | null;
  purpose: string;
  patientType?: "new" | "follow_up";
  queueNumber?: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show" | "rescheduled";
  date: string;
  time?: string;
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
    doctorId?: string;
    doctor_name?: string;
    queueNumberingEnabled?: boolean;
    queueSlot?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface DoctorOption {
  _id: string;
  name: string;
  specialization?: string;
}

interface BlockedTime {
  start: string;
  end: string;
  reason: string;
}

interface AvailabilitySlot {
  time: string;
  start: string;
  end: string;
}

interface QueueAvailabilitySection {
  remaining: number;
  canBook: boolean;
}

interface DoctorAvailabilityResponse {
  success: boolean;
  manualBlockedTimes?: BlockedTime[];
  availableSlots?: AvailabilitySlot[];
  isOnLeave?: boolean;
  leaveReason?: string;
  isNotWorkingDay?: boolean;
  queueNumbering?: {
    enabled?: boolean;
  };
  queueAvailability?: {
    newPatient?: QueueAvailabilitySection;
    followUp?: QueueAvailabilitySection;
  };
}

// ==================== CONSTANTS ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
const APPOINTMENT_REALTIME_EVENTS = new Set([
  "appointment-created",
  "appointment-update",
  "appointment-deleted",
  "availability-update",
]);

// Professional "clinical ledger" theme — muted, flat, high-legibility.
// Every status token pairs a soft surface with a saturated 600-weight ink
// so the ledger stays scannable without resorting to bright fills.
const statusStyles: Record<Appointment["status"], string> = {
  scheduled: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-teal-50 text-teal-700 border-teal-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  "no-show": "bg-slate-100 text-slate-600 border-slate-300",
  rescheduled: "bg-violet-50 text-violet-700 border-violet-200",
};

const statusDotColors: Record<Appointment["status"], string> = {
  scheduled: "bg-amber-500",
  confirmed: "bg-emerald-500",
  completed: "bg-teal-500",
  cancelled: "bg-rose-500",
  "no-show": "bg-slate-400",
  rescheduled: "bg-violet-500",
};

const statusRailColors: Record<Appointment["status"], string> = {
  scheduled: "bg-amber-400",
  confirmed: "bg-emerald-400",
  completed: "bg-teal-400",
  cancelled: "bg-rose-400",
  "no-show": "bg-slate-300",
  rescheduled: "bg-violet-400",
};

const statusLabels: Record<Appointment["status"], string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
  rescheduled: "Rescheduled",
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

function getLocalDateInputValue(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function normalizeDoctorName(name: string) {
  return name.replace(/^(doctor\.?\s*|dr\.?\s*)/i, "").trim().toLowerCase();
}

function getPatientAge(apt: Pick<Appointment, "age" | "patientAge">) {
  const rawAge = apt.age ?? apt.patientAge;
  const age = typeof rawAge === "string" ? Number(rawAge.trim()) : rawAge;
  return typeof age === "number" && Number.isFinite(age) && age > 0 ? age : null;
}

function hasPatientAge(apt: Pick<Appointment, "age" | "patientAge">) {
  return getPatientAge(apt) !== null;
}

function hasPatientLocation(location: Appointment["location"]) {
  return Boolean(location?.trim());
}

function isQueueAppointment(apt: Pick<Appointment, "queueNumber" | "metadata">) {
  return Boolean(apt.queueNumber || apt.metadata?.queueNumberingEnabled);
}

function getScheduleLabel(apt: Pick<Appointment, "time" | "queueNumber" | "metadata">) {
  if (isQueueAppointment(apt)) {
    return apt.queueNumber ? `Queue No. ${apt.queueNumber}` : "Queue number pending";
  }

  return apt.time?.trim() || "No time set";
}

function getScheduleTitle(apt: Pick<Appointment, "queueNumber" | "metadata">) {
  return isQueueAppointment(apt) ? "Queue Number" : "Time";
}

// ==================== BADGE COMPONENTS ====================
function StatusBadge({ status }: { status: Appointment["status"] }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border ${statusStyles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${statusDotColors[status]}`} />
      {statusLabels[status]}
    </span>
  );
}

function SourceBadge({ source }: { source: Appointment["source"] }) {
  const isAI = source === "millis_ai_auto";
  const isManual = source === "manual";

  const getStyles = () => {
    if (isAI) return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    if (isManual) return "bg-slate-100 text-slate-600 border border-slate-200";
    return "bg-slate-50 text-slate-500 border border-slate-200";
  };

  const getLabel = () => {
    if (isAI) return "AI Agent";
    if (isManual) return "Manual Entry";
    return source;
  };

  return (
    <span
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide ${getStyles()}`}
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
  onReschedule,
}: {
  apt: Appointment;
  onClose: () => void;
  onUpdate: (id: string, newStatus: Appointment["status"]) => void;
  onReschedule: (appointment: Appointment) => void;
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 flex justify-between items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Record · {apt._id.slice(-8)}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white">Appointment Details</h2>
            <div className="flex items-center gap-2 mt-3">
              <StatusBadge status={apt.status} />
              {apt.source === "millis_ai_auto" && (
                <span className="flex items-center gap-1.5 bg-indigo-500/15 border border-indigo-400/30 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-300">
                  <Zap className="w-3.5 h-3.5" />
                  AI Auto-Created
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-8 space-y-5 sm:space-y-6 overflow-y-auto max-h-[calc(95vh-190px)] sm:max-h-[calc(90vh-190px)] bg-slate-50">
          {/* AI Analysis Section */}
          {apt.source === "millis_ai_auto" && apt.metadata && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-500" />
                AI Call Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {apt.metadata.confidence_score && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Confidence Score</p>
                    <p className="text-2xl font-bold text-slate-900 font-mono">
                      {Math.round(apt.metadata.confidence_score * 100)}%
                    </p>
                  </div>
                )}
                {apt.metadata.doctor_name && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Doctor Requested</p>
                    <p className="text-base font-bold text-slate-900">Dr. {apt.metadata.doctor_name}</p>
                  </div>
                )}
                {apt.metadata.call_duration && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Call Duration</p>
                    <p className="text-base font-bold text-slate-900 font-mono">
                      {Math.floor(apt.metadata.call_duration / 60)} min
                    </p>
                  </div>
                )}
                {apt.metadata.call_direction && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Call Type</p>
                    <p className="text-base font-bold text-slate-900 capitalize">{apt.metadata.call_direction}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patient Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Full Name</p>
                <p className="text-lg font-bold text-slate-900">{apt.name}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Phone Number</p>
                <p className="text-lg font-bold text-slate-900 font-mono">{apt.phone}</p>
              </div>
              {hasPatientAge(apt) && (
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Age</p>
                  <p className="text-lg font-bold text-slate-900 font-mono">{getPatientAge(apt)}</p>
                </div>
              )}
              {hasPatientLocation(apt.location) && (
                <div>
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Location</p>
                  <p className="text-lg font-bold text-slate-900">{apt.location}</p>
                </div>
              )}
              {apt.email && (
                <div className="col-span-2">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Email Address</p>
                  <p className="text-base font-bold text-slate-900">{apt.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Appointment Information
            </h3>
            <div className="space-y-4">
              {apt.metadata?.doctor_name && (
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                  <p className="text-[11px] text-teal-700 font-semibold uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Stethoscope className="w-3.5 h-3.5" />
                    Assigned Doctor
                  </p>
                  <p className="text-xl font-bold text-teal-900">Dr. {apt.metadata.doctor_name}</p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Date</p>
                  <p className="text-base font-bold text-slate-900" suppressHydrationWarning>
                    {new Date(apt.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">{getScheduleTitle(apt)}</p>
                  <p className="text-base font-bold text-slate-900 font-mono">{getScheduleLabel(apt)}</p>
                </div>
                {apt.queueNumber && (
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-[11px] text-teal-700 font-semibold uppercase tracking-wide mb-1">Queue Number</p>
                    <p className="text-base font-bold text-teal-900 font-mono">{apt.queueNumber}</p>
                  </div>
                )}
                {apt.queueNumber && (
                  <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                    <p className="text-[11px] text-teal-700 font-semibold uppercase tracking-wide mb-1">Patient Type</p>
                    <p className="text-base font-bold text-teal-900">
                      {apt.patientType === "follow_up" ? "Old / Follow-up" : "New Patient"}
                    </p>
                  </div>
                )}
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Purpose of Visit</p>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">{apt.purpose}</p>
              </div>
              {apt.notes && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <p className="text-[11px] text-amber-700 font-semibold uppercase tracking-wide mb-2">Additional Notes</p>
                  <p className="text-sm text-slate-800">{apt.notes}</p>
                </div>
              )}
            </div>
          </div>

             {/* Transcription */}
           {apt.transcription && (
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                Call Transcription
              </h3>
              <div className="max-h-96 overflow-y-auto bg-slate-50 p-4 rounded-lg border border-slate-200">
                {(() => {
                  // Try to parse if it's a string
                  let transcriptionData = apt.transcription;
                  if (typeof apt.transcription === "string") {
                    try {
                      transcriptionData = JSON.parse(apt.transcription);
                    } catch (e) {
                      // If parsing fails, display as plain text
                      return <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{apt.transcription}</p>;
                    }
                  }

                  // If it's an array, render as conversation
                  if (Array.isArray(transcriptionData)) {
                    return (
                      <div className="space-y-2.5">
                        {transcriptionData.map((msg: any, idx: number) => {
                          const messageText = typeof msg === "string"
                            ? msg
                            : msg.content || msg.text || msg.message || msg.transcript || msg.value || msg.utterance || "";

                          if (!String(messageText).trim()) return null;

                          return (
                            <div
                              key={idx}
                              className="bg-white p-3 rounded-lg border-l-2 border-teal-400"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wide text-teal-700">
                                  {msg.role === "user" ? "Patient" : "Assistant"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-800 leading-relaxed">{messageText}</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // If it's an object with text or transcript property
                  if (transcriptionData.text || transcriptionData.transcript) {
                    return (
                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {transcriptionData.text || transcriptionData.transcript}
                      </p>
                    );
                  }

                  // Fallback to JSON display
                  return (
                    <pre className="text-xs text-slate-600 font-mono whitespace-pre-wrap">
                      {JSON.stringify(transcriptionData, null, 2)}
                    </pre>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Status Management */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Update Status</h3>
              <StatusBadge status={apt.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
              <button
                onClick={() => onUpdate(apt._id, "completed")}
                disabled={apt.status === "completed"}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed bg-teal-600 text-white hover:bg-teal-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Complete
              </button>
              <button
                onClick={() => onReschedule(apt)}
                disabled={["completed", "cancelled", "no-show"].includes(apt.status)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed bg-violet-600 text-white hover:bg-violet-700"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reschedule
              </button>
              <button
                onClick={() => onUpdate(apt._id, "no-show")}
                disabled={apt.status === "no-show"}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed bg-slate-600 text-white hover:bg-slate-700"
              >
                <AlertCircle className="w-3.5 h-3.5" /> No Show
              </button>
              <button
                onClick={() => onUpdate(apt._id, "cancelled")}
                disabled={apt.status === "cancelled"}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed bg-rose-600 text-white hover:bg-rose-700"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>

          {/* Follow-up Call Section */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 px-5 py-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-indigo-500/20 rounded-lg">
                    <Bot className="w-4 h-4 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">AI Patient Follow-up Assistant</h3>
                    <p className="text-slate-400 text-[10px]">Automated post-consultation care</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-200 text-[10px] font-medium">Ready</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Patient Info Card */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-4 border border-slate-200">
                <div className="p-2 bg-slate-900 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{apt.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                    <Phone className="w-2.5 h-2.5" /> {apt.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Last Visit</p>
                  <p className="text-xs font-semibold text-slate-700 font-mono">{new Date(apt.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Main Action Button */}
              <button
                onClick={() => {
                  // TODO: Connect to AI Agent for automated follow-up call
                  alert(`Follow-up call will be initiated to ${apt.name} at ${apt.phone}`);
                }}
                className="w-full bg-slate-900 text-white rounded-lg p-3 text-sm font-semibold transition-all hover:bg-slate-800"
              >
                <div className="flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>AI Consultation Follow-up Call</span>
                  <div className="flex items-center gap-0.5 bg-white/15 px-1.5 py-0.5 rounded text-[10px]">
                    <Zap className="w-2.5 h-2.5" />
                    Auto
                  </div>
                </div>
              </button>

              {/* Follow-up Type Selection */}
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Select Follow-up Type</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => alert('Health review follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition-all group"
                  >
                    <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                    <span className="text-xs font-medium text-slate-700">Health</span>
                  </button>
                  <button
                    onClick={() => alert('Post-appointment follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg hover:border-sky-300 hover:bg-sky-50 transition-all group"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    <span className="text-xs font-medium text-slate-700">Post Visit</span>
                  </button>
                  <button
                    onClick={() => alert('Medication follow-up scheduled!')}
                    className="flex-1 flex items-center justify-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all group"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-medium text-slate-700">Medication</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="text-[11px] text-slate-400 font-mono flex flex-wrap gap-4 justify-between pt-4 border-t border-slate-200">
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
        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition text-sm"
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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
  const [blockTimeModalOpen, setBlockTimeModalOpen] = useState(false);
  const [blockDate, setBlockDate] = useState("");
  const [blockStartTime, setBlockStartTime] = useState("09:00");
  const [blockEndTime, setBlockEndTime] = useState("10:00");
  const [blockReason, setBlockReason] = useState("Doctor unavailable");
  const [cancelExistingAppointments, setCancelExistingAppointments] = useState(true);
  const [blockingTime, setBlockingTime] = useState(false);
  const [blockedTimeToUnblock, setBlockedTimeToUnblock] = useState<BlockedTime | null>(null);
  const [unblockingTime, setUnblockingTime] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const realtimeRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const {
    data: appointments = [],
    isPending: loading,
    isFetching,
    error: appointmentsError,
    refetch: fetchAppointments,
  } = useQuery<Appointment[], Error>({
    queryKey: ["appointments", filterStatus, deferredSearchTerm],
    enabled: mounted,
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "1000", include_stats: "false" });
      if (filterStatus !== "All") params.append("status", filterStatus);
      if (deferredSearchTerm) params.append("name", deferredSearchTerm);

      const url = `${API_BASE_URL}/appointments?${params.toString()}`;
      const response = await fetch(url, { method: "GET", headers: getAuthHeaders() });

      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      return data.success
        ? (data.appointments || []).sort(
          (a: Appointment, b: Appointment) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        : [];
    },
    placeholderData: keepPreviousData,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
  });
  const { data: doctorOptions = [] } = useQuery<DoctorOption[]>({
    queryKey: ["appointment-doctors"],
    enabled: mounted,
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/doctors?active=true`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.success ? data.doctors || [] : [];
    },
  });
  const rescheduleDoctorId = appointmentToReschedule?.metadata?.doctorId || "";
  const {
    data: rescheduleAvailability,
    isFetching: rescheduleAvailabilityLoading,
    error: rescheduleAvailabilityError,
  } = useQuery<DoctorAvailabilityResponse, Error>({
    queryKey: ["appointment-reschedule-availability", rescheduleDoctorId, rescheduleDate],
    enabled: mounted && Boolean(appointmentToReschedule && rescheduleDoctorId && rescheduleDate),
    queryFn: async () => {
      const params = new URLSearchParams({
        doctorId: rescheduleDoctorId,
        date: rescheduleDate,
      });
      const response = await fetch(`${API_BASE_URL}/availability?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load available appointment slots");
      }
      return data;
    },
    retry: false,
  });
  const rescheduleQueueEnabled = Boolean(rescheduleAvailability?.queueNumbering?.enabled);
  const rescheduleQueueSection = appointmentToReschedule?.patientType === "follow_up"
    ? rescheduleAvailability?.queueAvailability?.followUp
    : rescheduleAvailability?.queueAvailability?.newPatient;
  const rescheduleSlots = useMemo(() => {
    const slots = rescheduleAvailability?.availableSlots || [];
    if (rescheduleDate !== getLocalDateInputValue()) return slots;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    return slots.filter((slot) => slot.start > currentTime);
  }, [rescheduleAvailability?.availableSlots, rescheduleDate]);
  const displayError = error || appointmentsError?.message || null;

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
            ? "Appointment confirmed. Email sent to doctor."
            : `Status updated to ${statusLabels[newStatus]}.`
        );
        setTimeout(() => setSuccessMessage(null), 5000);
        setSelectedAppointment(null);
        await fetchAppointments();
      }
    } catch (err) {
      setError("Failed to update appointment");
    }
  };

  const openRescheduleModal = (appointment: Appointment) => {
    const today = getLocalDateInputValue();
    const currentAppointmentDate = getLocalDateInputValue(new Date(appointment.date));

    setRescheduleDate(currentAppointmentDate >= today ? currentAppointmentDate : today);
    setRescheduleTime("");
    setRescheduleError(null);
    setSelectedAppointment(null);
    setAppointmentToReschedule(appointment);
  };

  const submitReschedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!appointmentToReschedule) return;
    if (!rescheduleDoctorId) {
      setRescheduleError("This appointment has no assigned doctor.");
      return;
    }
    if (!rescheduleDate) {
      setRescheduleError("Select a new appointment date.");
      return;
    }
    if (!rescheduleQueueEnabled && !rescheduleTime) {
      setRescheduleError("Select an available time slot.");
      return;
    }

    setRescheduling(true);
    setRescheduleError(null);
    try {
      const response = await fetch(
        `${API_BASE_URL}/appointments/${appointmentToReschedule._id}/reschedule`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            date: rescheduleDate,
            time: rescheduleQueueEnabled ? undefined : rescheduleTime,
          }),
        }
      );
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to reschedule appointment");
      }

      const queueMessage = data.queueNumber
        ? ` New queue number: ${data.queueNumber}.`
        : "";
      const notificationMessage = data.patientNotified
        ? " Patient notification sent."
        : " Appointment updated, but the patient notification could not be sent.";
      setSuccessMessage(
        `Appointment rescheduled successfully.${queueMessage}${notificationMessage}`
      );
      setAppointmentToReschedule(null);
      setRescheduleTime("");
      await fetchAppointments();
      setTimeout(() => setSuccessMessage(null), 8000);
    } catch (rescheduleRequestError) {
      setRescheduleError(
        rescheduleRequestError instanceof Error
          ? rescheduleRequestError.message
          : "Failed to reschedule appointment"
      );
    } finally {
      setRescheduling(false);
    }
  };

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

  const doctors = useMemo(
    () =>
      Array.from(
        new Set([
          ...doctorOptions.map((doctor) => doctor.name).filter(Boolean),
          ...Object.keys(doctorGroups),
        ])
      ).sort((a, b) => a.localeCompare(b)),
    [doctorGroups, doctorOptions]
  );

  const selectedDoctorId = useMemo(() => {
    if (!selectedDoctor || selectedDoctor === "Unassigned") return "";

    const doctorFromList = doctorOptions.find(
      (doctor) => normalizeDoctorName(doctor.name) === normalizeDoctorName(selectedDoctor)
    );
    if (doctorFromList?._id) return doctorFromList._id;

    return String(
      doctorGroups[selectedDoctor]?.find((appointment) => appointment.metadata?.doctorId)
        ?.metadata?.doctorId || ""
    );
  }, [doctorGroups, doctorOptions, selectedDoctor]);

  const {
    data: selectedDateAvailability,
    isFetching: blockedTimesLoading,
    error: blockedTimesError,
    refetch: refetchBlockedTimes,
  } = useQuery<DoctorAvailabilityResponse, Error>({
    queryKey: ["doctor-manual-blocks", selectedDoctorId, selectedDate],
    enabled: mounted && Boolean(selectedDoctorId && selectedDate),
    queryFn: async () => {
      const params = new URLSearchParams({
        doctorId: selectedDoctorId,
        date: selectedDate || "",
      });
      const response = await fetch(`${API_BASE_URL}/availability?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to load blocked periods");
      }
      return data;
    },
  });
  const manualBlockedTimes = selectedDateAvailability?.manualBlockedTimes || [];

  const scheduleRealtimeRefresh = useCallback(() => {
    if (realtimeRefreshTimer.current) clearTimeout(realtimeRefreshTimer.current);
    realtimeRefreshTimer.current = setTimeout(() => {
      void fetchAppointments();
      if (selectedDoctorId && selectedDate) {
        void refetchBlockedTimes();
      }
    }, 200);
  }, [fetchAppointments, refetchBlockedTimes, selectedDate, selectedDoctorId]);

  useWebSocket({
    onMessage: useCallback((message: { type?: string }) => {
      if (message?.type && APPOINTMENT_REALTIME_EVENTS.has(message.type)) {
        scheduleRealtimeRefresh();
      }
    }, [scheduleRealtimeRefresh]),
  });

  useEffect(() => () => {
    if (realtimeRefreshTimer.current) clearTimeout(realtimeRefreshTimer.current);
  }, []);

  const openBlockTimeModal = () => {
    setError(null);
    setBlockDate(selectedDate || getLocalDateInputValue());
    setBlockStartTime("09:00");
    setBlockEndTime("10:00");
    setBlockReason("Doctor unavailable");
    setCancelExistingAppointments(true);
    setBlockTimeModalOpen(true);
  };

  const blockDoctorTime = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDoctorId) {
      setError("This doctor could not be matched to a doctor record.");
      return;
    }
    if (!blockDate || !blockStartTime || !blockEndTime) {
      setError("Select a date, start time, and end time.");
      return;
    }
    if (blockStartTime >= blockEndTime) {
      setError("End time must be after start time.");
      return;
    }

    setBlockingTime(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/availability/block-time`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date: blockDate,
          startTime: blockStartTime,
          endTime: blockEndTime,
          reason: blockReason,
          cancelExistingAppointments,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to block the selected time");
      }

      const cancelledCount = Number(data.cancelledCount || 0);
      const appointmentsKept = Number(data.appointmentsKept || 0);
      const notificationCount = Number(data.patientNotificationsSent || 0);
      setSuccessMessage(
        cancelExistingAppointments && cancelledCount > 0
          ? `${blockStartTime}-${blockEndTime} is now unavailable. ${cancelledCount} appointment${
              cancelledCount === 1 ? "" : "s"
            } cancelled; ${notificationCount} patient notification${
              notificationCount === 1 ? "" : "s"
            } sent.`
          : cancelExistingAppointments
          ? `${blockStartTime}-${blockEndTime} is now unavailable. No existing appointments were affected.`
          : `${blockStartTime}-${blockEndTime} is blocked for new bookings. ${appointmentsKept} existing appointment${
              appointmentsKept === 1 ? "" : "s"
            } kept.`
      );
      setSelectedDate(blockDate);
      setCurrentMonth(new Date(`${blockDate}T12:00:00`));
      setBlockTimeModalOpen(false);
      await fetchAppointments();
      if (selectedDate === blockDate) {
        await refetchBlockedTimes();
      }
      setTimeout(() => setSuccessMessage(null), 8000);
    } catch (blockError) {
      setError(blockError instanceof Error ? blockError.message : "Failed to block the selected time");
    } finally {
      setBlockingTime(false);
    }
  };

  const unblockDoctorTime = async () => {
    if (!selectedDoctorId || !selectedDate || !blockedTimeToUnblock) return;

    setUnblockingTime(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/availability/unblock-time`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          doctorId: selectedDoctorId,
          date: selectedDate,
          startTime: blockedTimeToUnblock.start,
          endTime: blockedTimeToUnblock.end,
          reason: blockedTimeToUnblock.reason,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to unblock the selected time");
      }

      setSuccessMessage(
        data.stillBlocked
          ? `The selected ${blockedTimeToUnblock.start}-${blockedTimeToUnblock.end} block was removed, but another schedule block still overlaps this period.`
          : `${blockedTimeToUnblock.start}-${blockedTimeToUnblock.end} is available for new bookings again. Previously cancelled appointments remain cancelled.`
      );
      setBlockedTimeToUnblock(null);
      await refetchBlockedTimes();
      setTimeout(() => setSuccessMessage(null), 8000);
    } catch (unblockError) {
      setError(
        unblockError instanceof Error
          ? unblockError.message
          : "Failed to unblock the selected time"
      );
    } finally {
      setUnblockingTime(false);
    }
  };

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
      days.push(<div key={`empty-${i}`} className="h-9"></div>);
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
          className={`h-9 flex items-center justify-center rounded-lg cursor-pointer text-sm font-medium font-mono transition-colors ${
            isSelected
              ? "bg-slate-900 text-white"
              : isToday
              ? "bg-teal-50 text-teal-700 font-bold ring-1 ring-teal-300"
              : dateAppts.length > 0
              ? "bg-slate-50 text-slate-700 hover:bg-slate-100 font-semibold border border-slate-200"
              : "hover:bg-slate-50 text-slate-500"
          }`}
        >
          <div className="relative">
            {day}
            {dateAppts.length > 0 && !isSelected && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                {dateAppts.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-teal-500 rounded-full"></div>
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
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden lg:block w-64 bg-slate-900"></div>
        <main className="flex-1 lg:ml-64"></main>
      </div>
    );
  }

  // ==================== DOCTOR SELECTION VIEW ====================
  if (!selectedDoctor) {
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
          <div
            className="lg:hidden fixed inset-0 bg-slate-950/50 z-40"
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
          <div className="max-w-[1400px] mx-auto space-y-6">
            {/* Compact Healthcare Header */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Clinic Identity */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                        Reception &amp; Queue
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                      {clinicName}
                    </h1>
                    <p className="text-xs text-slate-500 hidden sm:block">
                      Front-desk appointment ledger &amp; schedule management
                    </p>
                  </div>
                </div>

                {/* Center: Quick Search & Sync Action (Responsive on mobile) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:max-w-md">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search patient, phone, doctor..."
                      className="w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => setSearchTerm("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => void fetchAppointments()}
                    disabled={isFetching}
                    aria-label="Refresh appointments"
                    className="inline-flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-teal-600 ${isFetching ? "animate-spin" : ""}`} />
                    <span>{isFetching ? "Syncing..." : "Sync"}</span>
                  </button>
                </div>

                {/* Right: Quick Stats Pills (Grid on mobile, flex on sm+) */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto flex-shrink-0">
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <div className="text-xs">
                      <span className="text-slate-500 mr-1">Total:</span>
                      <strong className="font-mono text-slate-900 font-bold">{appointments.length}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <div className="text-xs">
                      <span className="text-teal-700 mr-1">Today:</span>
                      <strong className="font-mono text-teal-950 font-bold">
                        {
                          appointments.filter(
                            (a) => new Date(a.date).toDateString() === new Date().toDateString()
                          ).length
                        }
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                    <div className="text-xs">
                      <span className="text-slate-500 mr-1">Doctors:</span>
                      <strong className="font-mono text-slate-900 font-bold">{doctors.length}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5">
                    <Zap className="h-3.5 w-3.5 text-indigo-600" />
                    <div className="text-xs">
                      <span className="text-indigo-700 mr-1">AI:</span>
                      <strong className="font-mono text-indigo-950 font-bold">
                        {appointments.filter((a) => a.source === "millis_ai_auto").length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
            {displayError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{displayError}</span>
              </div>
            )}

            {/* Doctor Selection Grid */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-slate-900 p-2.5 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Select Doctor</h2>
                  <p className="text-slate-500 text-sm">Choose a doctor to view their appointment ledger</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {doctors.map((doctor) => {
                    const doctorAppts = doctorGroups[doctor] || [];
                    const todayAppts = doctorAppts.filter(
                      (a) => new Date(a.date).toDateString() === new Date().toDateString()
                    );
                    const confirmedAppts = doctorAppts.filter((a) => a.status === "confirmed").length;

                    return (
                      <div
                        key={doctor}
                        onClick={() => setSelectedDoctor(doctor)}
                        className="group cursor-pointer rounded-xl p-5 transition-all bg-white border border-slate-200 hover:border-teal-300 hover:shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                          <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-teal-50 transition-colors">
                            <User className="w-5 h-5 text-slate-600 group-hover:text-teal-600 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold truncate text-slate-900">
                              {doctor === "Unassigned" ? "Unassigned" : `Dr. ${doctor}`}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {doctor === "Unassigned" ? "No doctor assigned" : "Specialist"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</span>
                            </div>
                            <span className="font-bold text-base text-slate-900 font-mono">{doctorAppts.length}</span>
                          </div>

                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                            <div className="flex items-center gap-2">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Today</span>
                            </div>
                            <span
                              className={`font-bold text-base font-mono ${
                                todayAppts.length > 0 ? "text-teal-700" : "text-slate-400"
                              }`}
                            >
                              {todayAppts.length}
                            </span>
                          </div>

                          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Confirmed</span>
                            </div>
                            <span className="font-bold text-base text-slate-900 font-mono">{confirmedAppts}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center text-teal-700 text-xs font-bold uppercase tracking-wide opacity-0 group-hover:opacity-100 transition">
                          <span>View Ledger</span>
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
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
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 z-40"
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
          {/* Compact Doctor Schedule Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Doctor Identity & View Context */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoctor(null);
                    setSelectedDate(null);
                  }}
                  title="Back to all doctors"
                  className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700">
                  <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                      Practitioner Schedule
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Ledger
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                    Dr. {selectedDoctor}
                  </h1>
                  <p className="text-xs text-slate-500">
                    {selectedDate
                      ? `Appointments for ${new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Showing all scheduled appointments"}
                  </p>
                </div>
              </div>

              {/* Right: Actions & Quick Filter Counters */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <div className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <div className="text-xs">
                    <span className="text-slate-500 mr-1">Appointments:</span>
                    <strong className="font-mono text-slate-900 font-bold">{filteredAppointments.length}</strong>
                  </div>
                </div>

                {selectedDate && (
                  <button
                    type="button"
                    onClick={() => setSelectedDate(null)}
                    className="inline-flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Clear Date</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={openBlockTimeModal}
                  disabled={!selectedDoctorId}
                  title={
                    selectedDoctorId
                      ? "Block a time range and cancel overlapping appointments"
                      : "Doctor record not available"
                  }
                  className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-3.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold transition hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>Block Time</span>
                </button>

                <button
                  type="button"
                  onClick={() => void fetchAppointments()}
                  disabled={isFetching}
                  aria-label="Refresh appointments"
                  className="inline-flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 text-teal-600 ${isFetching ? "animate-spin" : ""}`} />
                  <span className="hidden sm:inline">{isFetching ? "Syncing..." : "Sync"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{successMessage}</span>
            </div>
          )}
          {displayError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{displayError}</span>
            </div>
          )}

          {/* Main Content: Calendar + Appointments */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 lg:sticky lg:top-6 lg:h-[680px] lg:overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
                      }
                      className="p-1.5 hover:bg-slate-100 rounded-md transition"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
                      }
                      className="p-1.5 hover:bg-slate-100 rounded-md transition"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-slate-400 py-1 uppercase">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                {selectedDate && (
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Blocked Periods</h4>
                      {blockedTimesLoading && (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
                      )}
                    </div>

                    {blockedTimesError ? (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                        {blockedTimesError.message}
                      </div>
                    ) : !blockedTimesLoading && manualBlockedTimes.length === 0 ? (
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                        No manually blocked periods on this date.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {manualBlockedTimes.map((blockedTime) => (
                          <button
                            key={`${blockedTime.start}-${blockedTime.end}-${blockedTime.reason}`}
                            type="button"
                            onClick={() => setBlockedTimeToUnblock(blockedTime)}
                            className="w-full rounded-lg border border-rose-200 bg-rose-50 p-3 text-left transition hover:border-rose-300 hover:bg-rose-100"
                          >
                            <div className="flex items-center gap-2 font-bold text-rose-700 text-sm font-mono">
                              <Ban className="h-3.5 w-3.5" />
                              {blockedTime.start}-{blockedTime.end}
                            </div>
                            <div className="mt-1 text-xs text-rose-600">
                              {blockedTime.reason || "Doctor unavailable"} · Click to unblock
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-6 pt-5 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-medium text-xs uppercase tracking-wide">Showing</span>
                    <span className="font-bold text-slate-900 text-lg font-mono">{filteredAppointments.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-amber-50 border border-amber-100 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">Scheduled</div>
                      <div className="text-lg font-bold text-amber-700 font-mono">
                        {filteredAppointments.filter((a) => a.status === "scheduled").length}
                      </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-center">
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide">Confirmed</div>
                      <div className="text-lg font-bold text-emerald-700 font-mono">
                        {filteredAppointments.filter((a) => a.status === "confirmed").length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List — fixed height, matching the calendar sidebar */}
            <div className="lg:col-span-8 xl:col-span-9">
              <div className="bg-white rounded-xl border border-slate-200 flex flex-col lg:h-[680px]">
                {/* Search & Filters */}
                <div className="p-4 sm:p-5 border-b border-slate-200">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <div className="flex-1 min-w-[160px] sm:min-w-[200px] relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search name, mobile, or queue number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-900 text-sm"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm font-medium text-slate-700 bg-white"
                    >
                      <option value="All">All Status</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="no-show">No Show</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(e.target.value)}
                      className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm font-medium text-slate-700 bg-white"
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
                      className="px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-sm font-medium text-slate-700 bg-white"
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

                {/* Appointments List — compact single-line rows; click a row to open full details */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <RefreshCw className="w-8 h-8 text-teal-600 animate-spin" />
                    </div>
                  ) : filteredAppointments.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                      {filteredAppointments.map((apt) => (
                        <div
                          key={apt._id}
                          onClick={() => setSelectedAppointment(apt)}
                          className="group relative flex items-center gap-3 pl-3 pr-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {/* Status rail */}
                          <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${statusRailColors[apt.status]}`} />

                          {/* Avatar */}
                          <div className="flex-shrink-0 bg-slate-100 group-hover:bg-slate-900 p-2 rounded-lg transition-colors">
                            <User className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                          </div>

                          {/* Name + phone */}
                          <div className="min-w-0 w-[190px] flex-shrink-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{apt.name}</p>
                            <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {apt.phone}
                            </p>
                          </div>

                          {/* Date + schedule */}
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-mono w-[110px] flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-mono w-[120px] flex-shrink-0">
                            {isQueueAppointment(apt) ? (
                              <Hash className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            {getScheduleLabel(apt)}
                          </div>

                          {/* Purpose */}
                          <div className="hidden md:block flex-1 min-w-0 text-xs text-slate-500 truncate">
                            {apt.purpose}
                          </div>

                          {/* Badges */}
                          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
                            <SourceBadge source={apt.source} />
                            {isQueueAppointment(apt) && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 rounded text-[10px] font-semibold">
                                <Hash className="w-2.5 h-2.5" />
                                Queue
                              </span>
                            )}
                          </div>

                          {/* Status */}
                          <div className="flex-shrink-0">
                            <StatusBadge status={apt.status} />
                          </div>

                          {/* Follow-up + chevron */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert(`Follow-up call to ${apt.name}\nPhone: ${apt.phone}\n\nAI Agent integration coming soon!`);
                              }}
                              className="hidden sm:flex items-center gap-1 px-2 py-1 bg-slate-900 text-white rounded-md text-[10px] font-bold hover:bg-slate-800 transition-colors"
                              title="Follow-up Call"
                            >
                              <Bot className="w-3 h-3" />
                              <span className="hidden xl:inline">Follow-up</span>
                            </button>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-7 h-7 text-slate-400" />
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">No Appointments Found</h3>
                      <p className="text-slate-500 text-sm">
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

      {/* Reschedule Appointment Modal */}
      {appointmentToReschedule && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => !rescheduling && setAppointmentToReschedule(null)}
        >
          <form
            onSubmit={submitReschedule}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-5 bg-slate-900 rounded-t-xl">
              <div>
                <h2 className="text-lg font-bold text-white">Reschedule Appointment</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {appointmentToReschedule.name} · Dr.{" "}
                  {appointmentToReschedule.metadata?.doctor_name || "Assigned Doctor"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAppointmentToReschedule(null)}
                disabled={rescheduling}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Close reschedule appointment"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    Current date
                  </div>
                  <div className="mt-1 font-bold text-amber-950 font-mono">
                    {new Date(appointmentToReschedule.date).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    Current {appointmentToReschedule.queueNumber ? "queue" : "time"}
                  </div>
                  <div className="mt-1 font-bold text-amber-950 font-mono">
                    {getScheduleLabel(appointmentToReschedule)}
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  New appointment date
                </span>
                <input
                  type="date"
                  min={getLocalDateInputValue()}
                  value={rescheduleDate}
                  onChange={(event) => {
                    setRescheduleDate(event.target.value);
                    setRescheduleTime("");
                    setRescheduleError(null);
                  }}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              {!rescheduleDoctorId ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  This appointment has no assigned doctor and cannot be rescheduled.
                </div>
              ) : rescheduleAvailabilityLoading ? (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 p-8 text-slate-600">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Loading doctor availability...
                </div>
              ) : rescheduleAvailabilityError ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  {rescheduleAvailabilityError.message}
                </div>
              ) : rescheduleAvailability?.isOnLeave ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  The doctor is on leave on this date
                  {rescheduleAvailability.leaveReason
                    ? `: ${rescheduleAvailability.leaveReason}`
                    : "."}
                </div>
              ) : rescheduleAvailability?.isNotWorkingDay ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  The doctor does not work on this date. Select another date.
                </div>
              ) : rescheduleQueueEnabled ? (
                <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                  <div className="flex items-center gap-2 font-bold text-sky-900 text-sm">
                    <Hash className="h-4 w-4" />
                    A new queue number will be assigned
                  </div>
                  <p className="mt-2 text-sm text-sky-800">
                    {rescheduleQueueSection
                      ? rescheduleQueueSection.remaining === 0 &&
                        rescheduleQueueSection.canBook
                        ? "The standard queue is full; an overflow queue number will be assigned."
                        : `${rescheduleQueueSection.remaining} ${
                          appointmentToReschedule.patientType === "follow_up"
                            ? "follow-up"
                            : "new-patient"
                        } queue number${
                          rescheduleQueueSection.remaining === 1 ? "" : "s"
                        } remaining.`
                      : "Queue availability will be validated when you confirm."}
                  </p>
                  {rescheduleQueueSection?.canBook === false && (
                    <p className="mt-2 font-semibold text-rose-700">
                      This queue is full. Select another date.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Select an available time
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {rescheduleSlots.length} available
                    </span>
                  </div>
                  {rescheduleSlots.length > 0 ? (
                    <div className="grid max-h-56 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
                      {rescheduleSlots.map((slot) => (
                        <button
                          key={`${slot.start}-${slot.end}`}
                          type="button"
                          onClick={() => {
                            setRescheduleTime(slot.start);
                            setRescheduleError(null);
                          }}
                          className={`rounded-lg border px-3 py-2.5 text-sm font-bold font-mono transition ${
                            rescheduleTime === slot.start
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                      No future slots are available on this date.
                    </div>
                  )}
                </div>
              )}

              {rescheduleError && (
                <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {rescheduleError}
                </div>
              )}

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
                The patient will receive the existing appointment notification with the new
                schedule. No doctor notification will be sent.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end rounded-b-xl">
              <button
                type="button"
                onClick={() => setAppointmentToReschedule(null)}
                disabled={rescheduling}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Keep Current Schedule
              </button>
              <button
                type="submit"
                disabled={
                  rescheduling ||
                  rescheduleAvailabilityLoading ||
                  !rescheduleDoctorId ||
                  !rescheduleDate ||
                  Boolean(rescheduleAvailabilityError) ||
                  Boolean(rescheduleAvailability?.isOnLeave) ||
                  Boolean(rescheduleAvailability?.isNotWorkingDay) ||
                  (rescheduleQueueEnabled
                    ? rescheduleQueueSection?.canBook === false
                    : !rescheduleTime)
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {rescheduling ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Calendar className="h-5 w-5" />
                )}
                {rescheduling ? "Rescheduling..." : "Confirm Reschedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctor Time Block Modal */}
      {blockTimeModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => !blockingTime && setBlockTimeModalOpen(false)}
        >
          <form
            onSubmit={blockDoctorTime}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-4 sm:p-5 bg-slate-900 rounded-t-xl">
              <div>
                <h2 className="text-lg font-bold text-white">Block Doctor Time</h2>
                <p className="mt-1 text-sm text-slate-400">Dr. {selectedDoctor}</p>
              </div>
              <button
                type="button"
                onClick={() => setBlockTimeModalOpen(false)}
                disabled={blockingTime}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                This period will become unavailable for new bookings.
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Date</span>
                  <input
                    type="date"
                    min={getLocalDateInputValue()}
                    value={blockDate}
                    onChange={(event) => setBlockDate(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Start time</span>
                  <input
                    type="time"
                    value={blockStartTime}
                    onChange={(event) => setBlockStartTime(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">End time</span>
                  <input
                    type="time"
                    value={blockEndTime}
                    onChange={(event) => setBlockEndTime(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Block reason
                  </span>
                  <input
                    type="text"
                    maxLength={160}
                    value={blockReason}
                    onChange={(event) => setBlockReason(event.target.value)}
                    placeholder="Doctor unavailable"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                  />
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!cancelExistingAppointments}
                    onChange={(event) => setCancelExistingAppointments(!event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">
                      Do not cancel existing appointments
                    </span>
                    <span className="mt-1 block text-xs text-slate-500">
                      Check this to block only new bookings.
                    </span>
                  </span>
                </label>
              </div>

              {cancelExistingAppointments && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
                  Overlapping appointments will be cancelled and affected patients will be notified.
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end sm:p-5 rounded-b-xl">
              <button
                type="button"
                onClick={() => setBlockTimeModalOpen(false)}
                disabled={blockingTime}
                className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={blockingTime}
                className="flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {blockingTime ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Ban className="h-5 w-5" />
                )}
                {blockingTime
                  ? "Blocking..."
                  : cancelExistingAppointments
                  ? "Block Time & Cancel"
                  : "Block New Bookings"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Unblock Time Confirmation */}
      {blockedTimeToUnblock && selectedDate && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={() => !unblockingTime && setBlockedTimeToUnblock(null)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl border border-slate-200"
          >
            <div className="flex items-start justify-between border-b border-slate-200 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Unblock This Time?</h2>
                <p className="mt-1 text-sm text-slate-500 font-mono">
                  {blockedTimeToUnblock.start}-{blockedTimeToUnblock.end} on{" "}
                  {new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBlockedTimeToUnblock(null)}
                disabled={unblockingTime}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                This manual block will be removed. Any other overlapping schedule blocks will still
                apply.
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Appointments previously cancelled from this block will remain cancelled.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={() => setBlockedTimeToUnblock(null)}
                disabled={unblockingTime}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
              >
                Keep Blocked
              </button>
              <button
                type="button"
                onClick={() => void unblockDoctorTime()}
                disabled={unblockingTime}
                className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {unblockingTime && <RefreshCw className="h-5 w-5 animate-spin" />}
                {unblockingTime ? "Unblocking..." : "Unblock Time"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <AppointmentModal
          apt={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onUpdate={updateAppointmentStatus}
          onReschedule={openRescheduleModal}
        />
      )}
    </div>
  );
}