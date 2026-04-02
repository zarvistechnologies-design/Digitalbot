"use client";
import Sidebar from "@/components/Sidebar";
import { healthiqureAPI } from "@/lib/api";
import {
    AlertCircle,
    Check,
    CheckSquare,
    ChevronLeft,
    ChevronRight,
    Loader2,
    MapPin,
    Menu,
    Phone,
    RefreshCw,
    Search,
    Send,
    Square,
    User,
    Users,
    X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Lead {
  _id: string;
  phone: string;
  language: string | null;
  state: string;
  location: string | null;
  service: string | null;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    type?: string;
  };
  adminContacted: boolean;
  lastActivity: string;
  createdAt: string;
  _source?: "live" | "history";
}

const serviceLabels: Record<string, string> = {
  doctor_consultation: "Doctor Consultation",
  pharmacy: "Pharmacy / Medicines",
  lab_tests: "Laboratory Tests",
  ecg: "ECG",
  ultrasound: "Ultrasound",
  skin_clinic: "Skin Clinic",
  hospital_admission: "Hospital Admission",
  partner_location: "Partner Location",
  online_doctor: "Online Doctor",
  unable_to_visit: "Unable to Visit",
  emergency: "Emergency",
};

const serviceColors: Record<string, string> = {
  doctor_consultation: "bg-blue-100 text-blue-700",
  pharmacy: "bg-green-100 text-green-700",
  lab_tests: "bg-orange-100 text-orange-700",
  ecg: "bg-red-100 text-red-700",
  ultrasound: "bg-cyan-100 text-cyan-700",
  skin_clinic: "bg-pink-100 text-pink-700",
  hospital_admission: "bg-orange-100 text-orange-700",
  partner_location: "bg-amber-100 text-amber-700",
  online_doctor: "bg-indigo-100 text-indigo-700",
  unable_to_visit: "bg-slate-100 text-slate-700",
  emergency: "bg-red-200 text-red-800",
};

function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function BotContactsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Selection state
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());

  // Message composer
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Locations/services for filters
  const [locations, setLocations] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await healthiqureAPI.getLeads({
        location: filterLocation !== "all" ? filterLocation : undefined,
        service: filterService !== "all" ? filterService : undefined,
        search: search || undefined,
        page,
        limit: 50,
        sort: "lastActivity",
        order: "desc",
      });
      const data = res.data;
      setLeads(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);

      // Extract unique locations/services from stats
      if (data.stats) {
        if (data.stats.byLocation) setLocations(Object.keys(data.stats.byLocation));
        if (data.stats.byService) setServices(Object.keys(data.stats.byService));
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  }, [filterLocation, filterService, search, page]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [search, filterLocation, filterService]);

  const toggleSelect = (phone: string) => {
    setSelectedPhones((prev) => {
      const next = new Set(prev);
      if (next.has(phone)) next.delete(phone);
      else next.add(phone);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPhones.size === leads.length) {
      setSelectedPhones(new Set());
    } else {
      setSelectedPhones(new Set(leads.map((l) => l.phone)));
    }
  };

  const clearSelection = () => setSelectedPhones(new Set());

  const handleSendBulk = async () => {
    if (selectedPhones.size === 0 || !message.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await healthiqureAPI.sendBulkMessage({
        phones: Array.from(selectedPhones),
        message: message.trim(),
      });
      const data = res.data;
      setSendResult({
        type: "success",
        text: `Sent to ${data.sent} contacts${data.failed > 0 ? `, ${data.failed} failed` : ""}`,
      });
      if (data.sent > 0) {
        setSelectedPhones(new Set());
        setMessage("");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send messages";
      setSendResult({ type: "error", text: errorMsg });
    } finally {
      setSending(false);
    }
  };

  const allSelected = leads.length > 0 && selectedPhones.size === leads.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-orange-600" />
            <h1 className="text-lg font-semibold text-gray-900">Patient Contacts</h1>
          </div>
          <span className="text-sm text-gray-500 ml-1">
            {total} contacts
          </span>
          <div className="ml-auto flex items-center gap-2">
            {selectedPhones.size > 0 && (
              <span className="text-sm font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                {selectedPhones.size} selected
              </span>
            )}
            <button
              onClick={() => { fetchLeads(); clearSelection(); }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-57px)]">
          {/* Left: Contact list */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
            {/* Filters bar */}
            <div className="p-3 bg-white border-b border-gray-100 space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by phone or name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                >
                  <option value="all">All Services</option>
                  {services.map((svc) => (
                    <option key={svc} value={svc}>{serviceLabels[svc] || svc}</option>
                  ))}
                </select>
                {selectedPhones.size > 0 && (
                  <button
                    onClick={clearSelection}
                    className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2 py-1.5 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <X className="w-3 h-3" /> Clear selection
                  </button>
                )}
              </div>
            </div>

            {/* Select all row */}
            <div
              onClick={toggleSelectAll}
              className="flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-100 cursor-pointer hover:bg-gray-100 select-none"
            >
              {allSelected ? (
                <CheckSquare className="w-4 h-4 text-orange-600" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-xs font-medium text-gray-600">
                {allSelected ? "Deselect all" : "Select all"} ({leads.length})
              </span>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                </div>
              ) : leads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Users className="w-10 h-10 mb-2" />
                  <p className="text-sm">No contacts found</p>
                </div>
              ) : (
                leads.map((lead) => {
                  const selected = selectedPhones.has(lead.phone);
                  return (
                    <div
                      key={lead._id}
                      onClick={() => toggleSelect(lead.phone)}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors select-none ${
                        selected ? "bg-orange-50 hover:bg-orange-100/70" : "hover:bg-gray-50"
                      }`}
                    >
                      {/* Checkbox */}
                      {selected ? (
                        <CheckSquare className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}

                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {lead.patientInfo?.name || formatPhone(lead.phone)}
                          </span>
                          {lead.adminContacted && (
                            <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {lead.patientInfo?.name && (
                            <span className="text-xs text-gray-500 flex items-center gap-0.5">
                              <Phone className="w-3 h-3" />
                              {formatPhone(lead.phone)}
                            </span>
                          )}
                          {lead.location && (
                            <span className="text-xs text-gray-400 flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {lead.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Service badge + time */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {lead.service && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${serviceColors[lead.service] || "bg-gray-100 text-gray-600"}`}>
                            {serviceLabels[lead.service] || lead.service}
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">
                          {timeAgo(lead.lastActivity)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-gray-100">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Message composer */}
          <div className="lg:w-[400px] w-full bg-white flex flex-col border-t lg:border-t-0">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-600" />
                Compose Bulk Message
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Select contacts from the list and type your message below.
              </p>
            </div>

            <div className="flex-1 flex flex-col p-4 gap-4">
              {/* Selected count */}
              <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {selectedPhones.size === 0
                    ? "No contacts selected"
                    : `${selectedPhones.size} contact${selectedPhones.size > 1 ? "s" : ""} selected`}
                </span>
              </div>

              {/* Message textarea */}
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[120px] p-3 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                />
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-gray-400">
                    {message.length} characters
                  </span>
                </div>
              </div>

              {/* Send result */}
              {sendResult && (
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    sendResult.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {sendResult.type === "success" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {sendResult.text}
                </div>
              )}

              {/* Send button */}
              <button
                onClick={handleSendBulk}
                disabled={sending || selectedPhones.size === 0 || !message.trim()}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending to {selectedPhones.size} contacts...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send to {selectedPhones.size} contact{selectedPhones.size !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
