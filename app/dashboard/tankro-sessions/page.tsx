"use client";

import Sidebar from "@/components/Sidebar";
import { tankroAPI } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  ClipboardList,
  Droplets,
  Loader2,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  User,
} from "lucide-react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TankroMessage {
  role: "user" | "assistant" | "system";
  text: string;
  createdAt: string;
}

interface TankroSession {
  _id: string;
  phone: string;
  customerName?: string;
  state: string;
  status: "active" | "completed" | "handoff" | "abandoned";
  district?: string;
  propertyType?: string;
  serviceType?: string;
  tankCount?: number;
  tankCapacityLitres?: number;
  quotedPrice?: number;
  selectedDate?: string;
  selectedTime?: string;
  preferredDate?: string;
  preferredTime?: string;
  bookingId?: string;
  messages: TankroMessage[];
  lastMessageAt: string;
  createdAt: string;
}

const statusStyles: Record<TankroSession["status"], string> = {
  active: "bg-orange-100 text-orange-700 border-orange-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  handoff: "bg-blue-100 text-blue-700 border-blue-200",
  abandoned: "bg-gray-100 text-gray-700 border-gray-200",
};

const stateLabels: Record<string, string> = {
  awaiting_district: "District",
  awaiting_property_type: "Property",
  awaiting_tank_count: "Tank Count",
  awaiting_tank_capacity: "Capacity",
  awaiting_date_time: "Date & Time",
  awaiting_slot_confirmation: "Slot Check",
  awaiting_name: "Name",
  completed: "Completed",
  handoff: "Handoff",
};

const serviceLabels: Record<string, string> = {
  tank_cleaning: "Tank Cleaning",
  roof_care: "Roof Care",
  callback: "Callback",
  complaint: "Complaint",
  other: "Other",
};

export default function TankroSessionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<TankroSession[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [counts, setCounts] = useState<{ byStatus?: Record<string, number>; byState?: Record<string, number> }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tankroAPI.getSessions({
        limit: 100,
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: search || undefined,
      });
      const rows = response.data.data || [];
      setSessions(rows);
      setCounts(response.data.counts || {});
      setSelectedId((current) => current || rows[0]?._id || "");
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load Tankro sessions");
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const selectedSession = useMemo(() => {
    return sessions.find((session) => session._id === selectedId) || sessions[0] || null;
  }, [selectedId, sessions]);

  const activeCount = counts.byStatus?.active || 0;
  const completedCount = counts.byStatus?.completed || 0;
  const handoffCount = counts.byStatus?.handoff || 0;

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
                <MessageSquare className="w-8 h-8 text-orange-600" />
                Tankro Bot Sessions
              </h1>
              <p className="text-gray-600 mt-1">WhatsApp conversations, booking state, and customer replies</p>
            </div>
            <button
              onClick={fetchSessions}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <Metric label="Sessions" value={sessions.length} icon={<MessageSquare className="w-5 h-5" />} />
            <Metric label="Active" value={activeCount} icon={<Clock className="w-5 h-5" />} />
            <Metric label="Completed" value={completedCount} icon={<CheckCircle2 className="w-5 h-5" />} />
            <Metric label="Handoff" value={handoffCount} icon={<User className="w-5 h-5" />} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="relative md:col-span-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search phone, customer, district, or message"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="All">All status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="handoff">Handoff</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">No sessions found</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <button
                    key={session._id}
                    onClick={() => setSelectedId(session._id)}
                    className={`w-full text-left bg-white rounded-xl border p-4 shadow-sm transition-colors ${
                      selectedSession?._id === session._id
                        ? "border-orange-300 ring-2 ring-orange-100"
                        : "border-gray-200 hover:border-orange-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{session.customerName || session.phone}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4" />
                          <span className="truncate">{session.phone}</span>
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[session.status]}`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {session.district && (
                        <span className="px-2 py-1 rounded-md bg-orange-50 text-orange-700 border border-orange-100">
                          {session.district}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded-md bg-gray-50 text-gray-700 border border-gray-200">
                        {stateLabels[session.state] || session.state}
                      </span>
                      {session.bookingId && (
                        <span className="px-2 py-1 rounded-md bg-green-50 text-green-700 border border-green-100">
                          Booking
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {getLastMessage(session)?.text || "No messages yet"}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDateTime(session.lastMessageAt)}
                    </p>
                  </button>
                ))}
              </div>

              <SessionDetail session={selectedSession} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, icon }: { label: string; value: number; icon: ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <span className="text-orange-600">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

function SessionDetail({ session }: { session: TankroSession | null }) {
  if (!session) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{session.customerName || session.phone}</h2>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {session.phone}
              </span>
              {session.district && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {session.district}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {stateLabels[session.state] || session.state}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${statusStyles[session.status]}`}>
            {session.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
          <Info label="Service" value={serviceLabels[session.serviceType || ""] || session.serviceType || "N/A"} icon={<Droplets className="w-4 h-4" />} />
          <Info label="Tanks" value={session.tankCount ? String(session.tankCount) : "N/A"} icon={<ClipboardList className="w-4 h-4" />} />
          <Info label="Capacity" value={session.tankCapacityLitres ? `${session.tankCapacityLitres} L` : "N/A"} icon={<Droplets className="w-4 h-4" />} />
          <Info label="Booking" value={formatBookingTime(session)} icon={<Calendar className="w-4 h-4" />} />
        </div>
      </div>

      <div className="p-5 max-h-[620px] overflow-y-auto space-y-3 bg-gray-50">
        {(session.messages || []).map((message, index) => (
          <div
            key={`${message.createdAt}-${index}`}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] rounded-xl px-4 py-3 text-sm shadow-sm ${
                message.role === "user"
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
              <p className={`mt-2 text-[11px] ${message.role === "user" ? "text-orange-100" : "text-gray-400"}`}>
                {formatDateTime(message.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
      <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
        <span className="text-orange-600">{icon}</span>
        {label}
      </p>
      <p className="mt-1 font-semibold text-gray-900 truncate">{value}</p>
    </div>
  );
}

function getLastMessage(session: TankroSession) {
  return session.messages?.[session.messages.length - 1] || null;
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatBookingTime(session: TankroSession) {
  const date = session.selectedDate || session.preferredDate;
  const time = session.selectedTime || session.preferredTime;
  if (!date && !time) return "N/A";
  return [date, time].filter(Boolean).join(" ");
}
