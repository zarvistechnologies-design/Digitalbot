"use client";
import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { healthiqureAPI } from "@/lib/api";
import {
    AlertCircle,
    Bell,
    Check,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Clock,
    FileText,
    Loader2,
    MapPin,
    Menu,
    MessageSquare,
    Phone,
    RefreshCw,
    Save,
    Search,
    Send,
    User,
    Users,
    X,
    Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Types
interface Lead {
  _id: string;
  phone: string;
  language: string | null;
  state: string;
  location: string | null;
  service: string | null;
  subChoice: string | null;
  alternatePhone: string | null;
  otherLocationText: string | null;
  mediaUrls: { id: string; type: string; mime_type: string }[];
  userInput: string | null;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    type?: string;
  };
  backendNotified: boolean;
  adminContacted: boolean;
  lastActivity: string;
  createdAt: string;
  _source?: 'live' | 'history';
  _historyId?: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  active: number;
  completed: number;
  byService: Record<string, number>;
  byLocation: Record<string, number>;
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
  online_doctor: "Online Doctor Consultation",
  unable_to_visit: "Unable to Visit",
  emergency: "Emergency Help",
};

const serviceColors: Record<string, string> = {
  doctor_consultation: "bg-blue-100 text-blue-700 border-blue-200",
  pharmacy: "bg-green-100 text-green-700 border-green-200",
  lab_tests: "bg-orange-100 text-orange-700 border-orange-200",
  ecg: "bg-red-100 text-red-700 border-red-200",
  ultrasound: "bg-cyan-100 text-cyan-700 border-cyan-200",
  skin_clinic: "bg-pink-100 text-pink-700 border-pink-200",
  hospital_admission: "bg-orange-100 text-orange-700 border-orange-200",
  partner_location: "bg-amber-100 text-amber-700 border-amber-200",
  online_doctor: "bg-indigo-100 text-indigo-700 border-indigo-200",
  unable_to_visit: "bg-slate-100 text-slate-700 border-slate-200",
  emergency: "bg-red-200 text-red-800 border-red-300",
};

const stateLabels: Record<string, string> = {
  LOCATION_SELECTED: "Location Selected",
  SERVICE_MENU: "Browsing Services",
  DOCTOR_CONSULTATION_TYPE: "Doctor Consult",
  ALTERNATE_NUMBER_PROMPT: "Alt Number",
  WAITING_ALTERNATE_NUMBER: "Waiting Alt Number",
  WAITING_PRESCRIPTION_PHARMACY: "Pharmacy Upload",
  WAITING_PRESCRIPTION_LAB: "Lab Upload",
  WAITING_ECG_DATE: "ECG Date",
  WAITING_ECG_TIME: "ECG Time",
  WAITING_US_NAME: "US: Name",
  WAITING_US_AGE: "US: Age",
  WAITING_US_GENDER: "US: Gender",
  WAITING_US_TYPE: "US: Type",
  WAITING_SKIN_NAME: "Skin: Name",
  WAITING_SKIN_AGE: "Skin: Age",
  WAITING_SKIN_GENDER: "Skin: Gender",
  WAITING_SKIN_TYPE: "Skin: Type",
  WAITING_HOSPITAL_DOCS: "Hospital Docs",
  WAITING_HELP_TEXT: "Emergency",
  WAITING_OTHER_LOCATION_TEXT: "Other Location",
  OTHER_LOCATION_MENU: "Other Loc Menu",
  MIAO_OFFLINE_DATETIME: "Miao Booking",
  MIAO_LAB_RESPONSE: "Miao Lab",
  MIAO_ULTRASOUND_CONFIRM: "Miao Ultrasound",
  MIAO_ULTRASOUND_INFO: "Miao US Info",
  MIAO_SKIN_CONFIRM: "Miao Skin",
  MIAO_SKIN_INFO: "Miao Skin Info",
  CONVERSATION_HALTED: "Completed",
  BACKEND_PENDING: "Pending",
};

const langLabels: Record<string, string> = { en: "English", hi: "Hindi", as: "Assamese" };

function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) {
    return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return phone;
}

function rawPhone(phone: string) {
  return phone.replace(/\D/g, "").replace(/^91/, "");
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

export default function BotLeadsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [markingContacted, setMarkingContacted] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<string | null>(null); // lead._id
  const [confirmData, setConfirmData] = useState<Record<string, string>>({});
  const [showNotifSettings, setShowNotifSettings] = useState(false);
  const [notifNumbers, setNotifNumbers] = useState<string[]>([]);
  const [notifInput1, setNotifInput1] = useState("");
  const [notifInput2, setNotifInput2] = useState("");
  const [savingNotif, setSavingNotif] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);
  const [sendingConfirm, setSendingConfirm] = useState(false);
  const [confirmResult, setConfirmResult] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await healthiqureAPI.getLeads({
        location: filterLocation,
        service: filterService,
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: search || undefined,
        page,
        limit: 30,
        sort: "lastActivity",
        order: "desc",
      });
      const data = res.data;
      setLeads(data.data || []);
      setStats(data.stats || null);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [filterLocation, filterService, filterStatus, search, page]);

  // Real-time updates via WebSocket
  useWebSocket({
    onMessage: useCallback((data: any) => {
      if (data.type === 'lead-update') {
        // Silently re-fetch to get fresh data with correct pagination/stats
        fetchLeads(true);
      }
    }, [fetchLeads]),
  });

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filterLocation, filterService, filterStatus, search]);

  // Load notification numbers on mount
  useEffect(() => {
    healthiqureAPI.getNotificationNumbers().then(res => {
      const nums = res.data?.numbers || [];
      setNotifNumbers(nums);
      setNotifInput1(nums[0] || "");
      setNotifInput2(nums[1] || "");
    }).catch(() => {});
  }, []);

  const handleSaveNotifNumbers = async () => {
    setSavingNotif(true);
    setNotifSaved(false);
    try {
      const numbers = [notifInput1, notifInput2].filter(n => n.replace(/\D/g, "").length >= 10);
      const res = await healthiqureAPI.setNotificationNumbers(numbers);
      setNotifNumbers(res.data?.numbers || numbers);
      setNotifSaved(true);
      setTimeout(() => setNotifSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save notification numbers:", err);
    } finally {
      setSavingNotif(false);
    }
  };

  const handleMarkContacted = async (phone: string, historyId?: string) => {
    setMarkingContacted(historyId || phone);
    try {
      await healthiqureAPI.markContacted(phone, historyId);
      // Update local state
      setLeads((prev) =>
        prev.map((l) => {
          if (historyId && l._historyId === historyId) return { ...l, adminContacted: true };
          if (!historyId && l.phone === phone && l._source !== 'history') return { ...l, adminContacted: true };
          return l;
        })
      );
      if (stats) {
        setStats({
          ...stats,
          contacted: stats.contacted + 1,
          new: Math.max(0, stats.new - 1),
        });
      }
    } catch (err) {
      console.error("Failed to mark contacted:", err);
    } finally {
      setMarkingContacted(null);
    }
  };

  const handleSendMessage = async (phone: string) => {
    if (!customMsg.trim()) return;
    setSendingMsg(phone);
    try {
      await healthiqureAPI.sendMessage({ phone, message: customMsg });
      setCustomMsg("");
      setSendingMsg(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      setSendingMsg(null);
    }
  };

  const handleSendConfirmation = async (lead: Lead) => {
    setSendingConfirm(true);
    setConfirmResult(null);
    try {
      const phone = lead.phone;
      const svc = lead.service;
      const loc = lead.location || undefined;

      if (svc === 'doctor_consultation' || svc === 'online_doctor') {
        await healthiqureAPI.confirmAppointment({
          phone,
          doctorName: confirmData.doctorName || '',
          date: confirmData.date || '',
          time: confirmData.time || '',
          consultationType: svc === 'online_doctor' ? 'online' : (confirmData.consultationType || lead.subChoice || undefined),
          videoCallNumber: confirmData.videoCallNumber || undefined,
          location: svc === 'online_doctor' ? 'other' : loc,
        });
      } else if (svc === 'pharmacy') {
        await healthiqureAPI.confirmPharmacy({ phone });
      } else if (svc === 'lab_tests') {
        await healthiqureAPI.confirmLab({
          phone,
          date: confirmData.date || '',
          time: confirmData.time || '',
          location: loc,
        });
      } else if (svc === 'ecg') {
        await healthiqureAPI.confirmEcg({
          phone,
          date: confirmData.date || '',
          time: confirmData.time || '',
          location: loc,
        });
      } else if (svc === 'ultrasound') {
        await healthiqureAPI.confirmUltrasound({
          phone,
          date: confirmData.date || '',
          time: confirmData.time || '',
          ultrasoundType: confirmData.ultrasoundType || lead.patientInfo?.type || undefined,
          location: loc,
        });
      } else if (svc === 'skin_clinic') {
        await healthiqureAPI.confirmSkin({
          phone,
          date: confirmData.date || '',
          time: confirmData.time || '',
          location: loc,
        });
      } else if (svc === 'hospital_admission') {
        await healthiqureAPI.confirmHospital({
          phone,
          registrationNo: confirmData.registrationNo || undefined,
          hospitalName: confirmData.hospitalName || '',
          hospitalAddress: confirmData.hospitalAddress || undefined,
          contactPerson: confirmData.contactPerson || undefined,
          contactNumber: confirmData.contactNumber || undefined,
          attendingDoctor: confirmData.attendingDoctor || undefined,
          spocNumber: confirmData.spocNumber || undefined,
        });
      } else if (svc === 'partner_location') {
        await healthiqureAPI.confirmPartner({
          phone,
          service: confirmData.service || lead.userInput || undefined,
          locationName: confirmData.locationName || '',
          address: confirmData.address || undefined,
          contactPerson: confirmData.contactPerson || undefined,
          date: confirmData.date || '',
          time: confirmData.time || '',
        });
      } else {
        // Fallback: send as generic custom message
        await healthiqureAPI.sendMessage({
          phone,
          message: `Your appointment is confirmed. ${confirmData.date ? `Date: ${confirmData.date}` : ''} ${confirmData.time ? `Time: ${confirmData.time}` : ''}`.trim(),
        });
      }

      setConfirmResult({ type: 'success', msg: 'Confirmation sent to patient via WhatsApp!' });
      setConfirmData({});
      // Update lead state locally
      setLeads((prev) =>
        prev.map((l) =>
          l._id === lead._id ? { ...l, state: 'CONVERSATION_HALTED', adminContacted: true } : l
        )
      );
    } catch (err) {
      console.error("Failed to send confirmation:", err);
      setConfirmResult({ type: 'error', msg: 'Failed to send confirmation. Please try again.' });
    } finally {
      setSendingConfirm(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <div className="hidden lg:block">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 lg:ml-60 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600 font-medium">Loading bot leads...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      {/* Mobile Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200"
      >
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Bot Leads
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">
                  Patients who contacted via WhatsApp bot — follow up, call, and track
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowNotifSettings(!showNotifSettings)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border shadow-md hover:bg-orange-50 transition-colors text-sm font-medium ${
                    showNotifSettings ? "bg-orange-100 border-orange-400 text-orange-700" : "bg-white border-slate-300 text-slate-700"
                  }`}
                  title="Notification Settings"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">Notifications</span>
                  {notifNumbers.length > 0 && (
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => fetchLeads()}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-300 shadow-md hover:bg-orange-50 transition-colors text-sm font-medium text-slate-700"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>
          </header>

          {/* Notification Settings Panel */}
          {showNotifSettings && (
            <div className="mb-6 bg-white rounded-2xl p-5 border border-orange-200 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-800">New Lead Notification Numbers</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Get a WhatsApp message on these numbers whenever a new lead comes from the bot.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number 1</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={notifInput1}
                    onChange={(e) => setNotifInput1(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    maxLength={15}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Phone Number 2</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={notifInput2}
                    onChange={(e) => setNotifInput2(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    maxLength={15}
                  />
                </div>
                <button
                  onClick={handleSaveNotifNumbers}
                  disabled={savingNotif}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {savingNotif ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save
                </button>
              </div>
              {notifSaved && (
                <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Notification numbers saved successfully!
                </p>
              )}
            </div>
          )}

          {/* Stats Cards */}
          {stats && (
            <section className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  {
                    title: "Total Leads",
                    value: stats.total,
                    icon: Users,
                    gradient: "from-orange-400 to-orange-600",
                    bg: "bg-orange-50 border-orange-200",
                  },
                  {
                    title: "New (Not Contacted)",
                    value: stats.new,
                    icon: Zap,
                    gradient: "from-red-400 to-red-600",
                    bg: "bg-red-50 border-red-200",
                  },
                  {
                    title: "Active in Bot",
                    value: stats.active,
                    icon: MessageSquare,
                    gradient: "from-green-400 to-green-600",
                    bg: "bg-green-50 border-green-200",
                  },
                  {
                    title: "Contacted",
                    value: stats.contacted,
                    icon: Check,
                    gradient: "from-blue-400 to-blue-600",
                    bg: "bg-blue-50 border-blue-200",
                  },
                  {
                    title: "Completed",
                    value: stats.completed,
                    icon: Clock,
                    gradient: "from-orange-400 to-orange-600",
                    bg: "bg-orange-50 border-orange-200",
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={`rounded-2xl p-4 border shadow-lg hover:shadow-xl transition-all ${card.bg}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-[11px] font-medium mb-1">{card.title}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-slate-800">{card.value}</p>
                      </div>
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                      >
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service breakdown mini-bar */}
              {Object.keys(stats.byService).length > 0 && (
                <div className="mt-4 bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
                  <p className="text-xs font-bold text-slate-600 mb-3">Leads by Service</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(stats.byService)
                      .sort(([, a], [, b]) => b - a)
                      .map(([svc, count]) => (
                        <span
                          key={svc}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${serviceColors[svc] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                        >
                          {serviceLabels[svc] || svc}: {count}
                        </span>
                      ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> By Location:
                    </span>
                    {Object.entries(stats.byLocation)
                      .filter(([, v]) => v > 0)
                      .map(([loc, count]) => (
                        <span
                          key={loc}
                          className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600"
                        >
                          {loc.charAt(0).toUpperCase() + loc.slice(1)}: {count}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Filters & Search */}
          <section className="mb-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by phone, name, or input..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New (Not Contacted)</option>
                    <option value="active">Active in Bot</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50"
                  >
                    <option value="all">All Locations</option>
                    <option value="bordumsa">Bordumsa</option>
                    <option value="miao">Miao</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50"
                  >
                    <option value="all">All Services</option>
                    <option value="doctor_consultation">Doctor</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="lab_tests">Lab</option>
                    <option value="ecg">ECG</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="skin_clinic">Skin</option>
                    <option value="hospital_admission">Hospital</option>
                    <option value="online_doctor">Online Doctor (Other)</option>
                    <option value="partner_location">Partner Location</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Showing {leads.length} of {total} leads
              </p>
            </div>
          </section>

          {/* Leads Table/Cards */}
          <section className="space-y-2">
            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No leads found</p>
                <p className="text-slate-400 text-sm mt-1">
                  Leads appear when patients use the WhatsApp bot to request a service
                </p>
              </div>
            ) : (
              leads.map((lead) => {
                const isExpanded = expandedLead === lead._id;
                const isNew = !lead.adminContacted;
                const isActive =
                  lead.state !== "CONVERSATION_HALTED" &&
                  lead.state !== "INITIAL" &&
                  lead.state !== "LANGUAGE_SELECTION";
                const hasMedia = lead.mediaUrls && lead.mediaUrls.length > 0;
                const phoneDigits = rawPhone(lead.phone);
                return (
                  <div
                    key={lead._id}
                    className={`bg-white rounded-2xl border shadow-lg hover:shadow-xl transition-all overflow-hidden ${
                      isNew ? "border-l-4 border-l-red-400 border-slate-200" : "border-slate-200"
                    }`}
                  >
                    {/* Lead Row */}
                    <div
                      className="p-4 cursor-pointer flex items-center gap-3"
                      onClick={() => setExpandedLead(isExpanded ? null : lead._id)}
                    >
                      {/* Status dot */}
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${
                          isNew
                            ? "bg-red-400 animate-pulse"
                            : lead.adminContacted
                              ? "bg-green-400"
                              : isActive
                                ? "bg-yellow-400 animate-pulse"
                                : "bg-slate-300"
                        }`}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800 text-sm sm:text-base">
                            {lead.patientInfo?.name || formatPhone(lead.phone)}
                          </span>
                          {lead.patientInfo?.name && (
                            <span className="text-xs text-slate-500">{formatPhone(lead.phone)}</span>
                          )}
                          {isNew && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {lead.adminContacted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Contacted
                            </span>
                          )}
                          {lead._source === 'history' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                              Past Query
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          {lead.service && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${serviceColors[lead.service] || "bg-slate-100 text-slate-600 border-slate-200"}`}
                            >
                              {serviceLabels[lead.service] || lead.service}
                            </span>
                          )}
                          {lead.location && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" />
                              {lead.location.charAt(0).toUpperCase() + lead.location.slice(1)}
                            </span>
                          )}
                          {lead.language && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-600">
                              {langLabels[lead.language] || lead.language}
                            </span>
                          )}
                          {lead.subChoice && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                              {lead.subChoice}
                            </span>
                          )}
                          {hasMedia && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-600 flex items-center gap-0.5">
                              <FileText className="w-3 h-3" />
                              {lead.mediaUrls.length} doc{lead.mediaUrls.length > 1 ? "s" : ""}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {stateLabels[lead.state] || lead.state}
                          </span>
                        </div>
                      </div>

                      {/* Quick Actions (visible without expanding) */}
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:+91${phoneDigits}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-4 h-4 text-green-600" />
                        </a>
                        <a
                          href={`https://wa.me/91${phoneDigits}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                          title="Open WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                        </a>
                        {!lead.adminContacted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkContacted(lead.phone, lead._historyId);
                            }}
                            disabled={markingContacted === (lead._historyId || lead.phone)}
                            className="p-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-50"
                            title="Mark as Contacted"
                          >
                            {markingContacted === (lead._historyId || lead.phone) ? (
                              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Time & Expand */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs text-slate-500">{timeAgo(lead.lastActivity)}</p>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left — Patient & Lead Details */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1">
                              <User className="w-4 h-4" /> Lead Details
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-white rounded-xl p-3 border border-slate-200">
                              <div>
                                <span className="text-slate-500 text-xs">Phone</span>
                                <p className="font-semibold text-slate-800">{formatPhone(lead.phone)}</p>
                              </div>
                              {lead.alternatePhone && (
                                <div>
                                  <span className="text-slate-500 text-xs">Alt Phone</span>
                                  <p className="font-semibold text-slate-800">
                                    {formatPhone(lead.alternatePhone)}
                                  </p>
                                </div>
                              )}
                              {lead.patientInfo?.name && (
                                <div>
                                  <span className="text-slate-500 text-xs">Name</span>
                                  <p className="font-semibold text-slate-800">{lead.patientInfo.name}</p>
                                </div>
                              )}
                              {lead.patientInfo?.age && (
                                <div>
                                  <span className="text-slate-500 text-xs">Age</span>
                                  <p className="font-semibold text-slate-800">{lead.patientInfo.age}</p>
                                </div>
                              )}
                              {lead.patientInfo?.gender && (
                                <div>
                                  <span className="text-slate-500 text-xs">Gender</span>
                                  <p className="font-semibold text-slate-800">{lead.patientInfo.gender}</p>
                                </div>
                              )}
                              {lead.patientInfo?.type && (
                                <div>
                                  <span className="text-slate-500 text-xs">Type/Complaint</span>
                                  <p className="font-semibold text-slate-800">{lead.patientInfo.type}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-500 text-xs">Service Wanted</span>
                                <p className="font-semibold text-slate-800">
                                  {serviceLabels[lead.service || ""] || lead.service || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Location</span>
                                <p className="font-semibold text-slate-800">
                                  {lead.otherLocationText ||
                                    (lead.location
                                      ? lead.location.charAt(0).toUpperCase() + lead.location.slice(1)
                                      : "N/A")}
                                </p>
                              </div>
                              {lead.subChoice && (
                                <div>
                                  <span className="text-slate-500 text-xs">Sub-Choice</span>
                                  <p className="font-semibold text-slate-800">{lead.subChoice}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-slate-500 text-xs">Language</span>
                                <p className="font-semibold text-slate-800">
                                  {langLabels[lead.language || ""] || lead.language || "N/A"}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Bot State</span>
                                <p className="font-semibold text-slate-700">
                                  {stateLabels[lead.state] || lead.state}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Created</span>
                                <p className="font-semibold text-slate-800">
                                  {new Date(lead.createdAt).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500 text-xs">Last Activity</span>
                                <p className="font-semibold text-slate-800">
                                  {new Date(lead.lastActivity).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* User Input / Request */}
                            {lead.userInput && (
                              <div className="bg-white rounded-xl p-3 border border-slate-200">
                                <span className="text-slate-500 text-xs font-medium">
                                  Patient&apos;s Message / Request
                                </span>
                                <p className="text-sm font-medium text-slate-800 mt-1 whitespace-pre-wrap">
                                  {lead.userInput}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Right — Documents & Actions */}
                          <div className="space-y-3">
                            {/* Documents */}
                            {hasMedia && (
                              <div>
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1 mb-2">
                                  <FileText className="w-4 h-4" /> Uploaded Documents
                                </h4>
                                <div className="space-y-2">
                                  {lead.mediaUrls.map((media, i) => {
                                    const mediaId = typeof media === 'string' ? media : media?.id;
                                    const mediaType = typeof media === 'string' ? 'document' : media?.type || 'document';
                                    if (!mediaId || mediaId === 'media_uploaded') return null;
                                    const label = mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'Prescription / Report';
                                    return (
                                      <button
                                        key={i}
                                        onClick={async () => {
                                          try {
                                            const res = await healthiqureAPI.getMediaBlob(mediaId);
                                            const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });
                                            const blobUrl = URL.createObjectURL(blob);
                                            window.open(blobUrl, '_blank');
                                          } catch {
                                            alert('Media not found or expired. WhatsApp media expires after 30 days.');
                                          }
                                        }}
                                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 hover:border-orange-300 transition-colors text-sm w-full text-left"
                                      >
                                        <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                                        <span className="text-blue-600 truncate">
                                          {label} {i + 1}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Quick Actions */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-700 mb-2">Quick Actions</h4>
                              <div className="flex flex-wrap gap-2">
                                <a
                                  href={`tel:+91${phoneDigits}`}
                                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                >
                                  <Phone className="w-4 h-4" />
                                  Call Patient
                                </a>
                                <a
                                  href={`https://wa.me/91${phoneDigits}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Open WhatsApp
                                </a>
                                {lead.alternatePhone && (
                                  <a
                                    href={`tel:+91${rawPhone(lead.alternatePhone)}`}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                  >
                                    <Phone className="w-4 h-4" />
                                    Call Alt Number
                                  </a>
                                )}
                                {!lead.adminContacted && (
                                  <button
                                    onClick={() => handleMarkContacted(lead.phone, lead._historyId)}
                                    disabled={markingContacted === (lead._historyId || lead.phone)}
                                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                  >
                                    {markingContacted === (lead._historyId || lead.phone) ? (
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                      <Check className="w-4 h-4" />
                                    )}
                                    Mark Contacted
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Send Message via Bot */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1 mb-2">
                                <Send className="w-4 h-4" /> Send WhatsApp Message
                              </h4>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type a message to send via bot..."
                                  value={sendingMsg === lead.phone ? customMsg : ""}
                                  onFocus={() => setSendingMsg(lead.phone)}
                                  onChange={(e) => setCustomMsg(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-orange-400 transition-colors"
                                />
                                <button
                                  onClick={() => handleSendMessage(lead.phone)}
                                  disabled={sendingMsg === lead.phone && !customMsg.trim()}
                                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* ===== Send Confirmation to Patient ===== */}
                            {lead.service && lead.service !== 'emergency' && (
                              <div>
                                {/* Pharmacy: Instant one-click send (no form needed) */}
                                {lead.service === 'pharmacy' ? (
                                  <div className="space-y-2">
                                    <button
                                      onClick={() => handleSendConfirmation(lead)}
                                      disabled={sendingConfirm}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                      {sendingConfirm ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4" />
                                          📦 Send Pharmacy Ready (Instant)
                                        </>
                                      )}
                                    </button>
                                    {/* Show result message for pharmacy */}
                                    {confirmResult && (
                                      <div className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                                        confirmResult.type === 'success'
                                          ? 'bg-green-50 text-green-700 border border-green-200'
                                          : 'bg-red-50 text-red-700 border border-red-200'
                                      }`}>
                                        {confirmResult.type === 'success' ? (
                                          <Check className="w-4 h-4 shrink-0" />
                                        ) : (
                                          <AlertCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        {confirmResult.msg}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* Other services: Show form toggle */
                                  <button
                                    onClick={() => {
                                      if (confirmOpen === lead._id) {
                                        setConfirmOpen(null);
                                        setConfirmData({});
                                        setConfirmResult(null);
                                      } else {
                                        setConfirmOpen(lead._id);
                                        setConfirmData({});
                                        setConfirmResult(null);
                                      }
                                    }}
                                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-orange-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                                  >
                                    <span className="flex items-center gap-2">
                                      <Check className="w-4 h-4" />
                                      Send Appointment Confirmation
                                    </span>
                                    {confirmOpen === lead._id ? (
                                      <ChevronUp className="w-4 h-4" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4" />
                                    )}
                                  </button>
                                )}

                                {confirmOpen === lead._id && (
                                  <div className="mt-2 bg-white rounded-xl p-4 border border-indigo-200 space-y-3">
                                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                                      {serviceLabels[lead.service] || lead.service} — Confirmation Details
                                    </p>

                                    {/* Doctor Consultation Form */}
                                    {(lead.service === 'doctor_consultation' || lead.service === 'online_doctor') && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-slate-500">Doctor Name *</label>
                                          <input
                                            type="text"
                                            value={confirmData.doctorName || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, doctorName: e.target.value })}
                                            placeholder="Dr. ..."
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Consultation Type</label>
                                          {lead.service === 'online_doctor' ? (
                                            <input
                                              type="text"
                                              value="Online (Video Call)"
                                              disabled
                                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-600"
                                            />
                                          ) : (
                                            <select
                                              value={confirmData.consultationType || lead.subChoice || ''}
                                              onChange={(e) => setConfirmData({ ...confirmData, consultationType: e.target.value })}
                                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                            >
                                              <option value="">Select</option>
                                              <option value="online">Online (Video Call)</option>
                                              <option value="offline">Offline (In-Person)</option>
                                            </select>
                                          )}
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Date *</label>
                                          <input
                                            type="text"
                                            value={confirmData.date || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, date: e.target.value })}
                                            placeholder="e.g. 15 Jan 2025"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Time *</label>
                                          <input
                                            type="text"
                                            value={confirmData.time || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, time: e.target.value })}
                                            placeholder="e.g. 10:30 AM"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        {(lead.service === 'online_doctor' || confirmData.consultationType === 'online' || lead.subChoice === 'online') && (
                                          <div className="col-span-2">
                                            <label className="text-xs text-slate-500">Video Call Number *</label>
                                            <input
                                              type="text"
                                              value={confirmData.videoCallNumber || ''}
                                              onChange={(e) => setConfirmData({ ...confirmData, videoCallNumber: e.target.value })}
                                              placeholder="Phone number for video call"
                                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                            />
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Pharmacy is now instant-send, no form needed */}

                                    {/* Unable to Visit — custom message needed */}
                                    {lead.service === 'unable_to_visit' && (
                                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                        <p className="text-sm text-slate-700">
                                          This patient is unable to visit. Use the "Send WhatsApp Message" box above to send a custom follow-up message based on your conversation with them.
                                        </p>
                                      </div>
                                    )}

                                    {/* Lab / ECG / Skin — Date, Time */}
                                    {(lead.service === 'lab_tests' || lead.service === 'ecg' || lead.service === 'skin_clinic') && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-slate-500">Date *</label>
                                          <input
                                            type="text"
                                            value={confirmData.date || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, date: e.target.value })}
                                            placeholder="e.g. 15 Jan 2025"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Time *</label>
                                          <input
                                            type="text"
                                            value={confirmData.time || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, time: e.target.value })}
                                            placeholder="e.g. 10:30 AM"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Ultrasound — Date, Time, Type */}
                                    {lead.service === 'ultrasound' && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-slate-500">Date *</label>
                                          <input
                                            type="text"
                                            value={confirmData.date || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, date: e.target.value })}
                                            placeholder="e.g. 15 Jan 2025"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Time *</label>
                                          <input
                                            type="text"
                                            value={confirmData.time || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, time: e.target.value })}
                                            placeholder="e.g. 10:30 AM"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-xs text-slate-500">Ultrasound Type</label>
                                          <input
                                            type="text"
                                            value={confirmData.ultrasoundType || lead.patientInfo?.type || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, ultrasoundType: e.target.value })}
                                            placeholder="e.g. Obs. (Pregnancy) / Whole Abdomen / KUB"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Hospital Admission Form */}
                                    {lead.service === 'hospital_admission' && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-slate-500">Hospital Name *</label>
                                          <input
                                            type="text"
                                            value={confirmData.hospitalName || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, hospitalName: e.target.value })}
                                            placeholder="Hospital name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Registration No.</label>
                                          <input
                                            type="text"
                                            value={confirmData.registrationNo || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, registrationNo: e.target.value })}
                                            placeholder="Registration number"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-xs text-slate-500">Hospital Address</label>
                                          <input
                                            type="text"
                                            value={confirmData.hospitalAddress || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, hospitalAddress: e.target.value })}
                                            placeholder="Full address"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Attending Doctor</label>
                                          <input
                                            type="text"
                                            value={confirmData.attendingDoctor || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, attendingDoctor: e.target.value })}
                                            placeholder="Doctor name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Contact Person</label>
                                          <input
                                            type="text"
                                            value={confirmData.contactPerson || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, contactPerson: e.target.value })}
                                            placeholder="Contact person name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Contact Number</label>
                                          <input
                                            type="text"
                                            value={confirmData.contactNumber || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, contactNumber: e.target.value })}
                                            placeholder="Contact number"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">SPOC Number</label>
                                          <input
                                            type="text"
                                            value={confirmData.spocNumber || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, spocNumber: e.target.value })}
                                            placeholder="HealthiQure SPOC number"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Partner Location Form */}
                                    {lead.service === 'partner_location' && (
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="text-xs text-slate-500">Service *</label>
                                          <input
                                            type="text"
                                            value={confirmData.service || lead.userInput || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, service: e.target.value })}
                                            placeholder="e.g. Doctor Consultation"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Location Name *</label>
                                          <input
                                            type="text"
                                            value={confirmData.locationName || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, locationName: e.target.value })}
                                            placeholder="Partner location name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-xs text-slate-500">Address</label>
                                          <input
                                            type="text"
                                            value={confirmData.address || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, address: e.target.value })}
                                            placeholder="Full address"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Contact Person</label>
                                          <input
                                            type="text"
                                            value={confirmData.contactPerson || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, contactPerson: e.target.value })}
                                            placeholder="Contact person name"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-slate-500">Date *</label>
                                          <input
                                            type="text"
                                            value={confirmData.date || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, date: e.target.value })}
                                            placeholder="e.g. 15 Jan 2025"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-xs text-slate-500">Time *</label>
                                          <input
                                            type="text"
                                            value={confirmData.time || ''}
                                            onChange={(e) => setConfirmData({ ...confirmData, time: e.target.value })}
                                            placeholder="e.g. 10:30 AM"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-indigo-400 transition-colors"
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Result message */}
                                    {confirmResult && (
                                      <div className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                                        confirmResult.type === 'success'
                                          ? 'bg-green-50 text-green-700 border border-green-200'
                                          : 'bg-red-50 text-red-700 border border-red-200'
                                      }`}>
                                        {confirmResult.type === 'success' ? (
                                          <Check className="w-4 h-4 shrink-0" />
                                        ) : (
                                          <AlertCircle className="w-4 h-4 shrink-0" />
                                        )}
                                        {confirmResult.msg}
                                      </div>
                                    )}

                                    {/* Submit button */}
                                    <button
                                      onClick={() => handleSendConfirmation(lead)}
                                      disabled={sendingConfirm}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-orange-700 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                      {sendingConfirm ? (
                                        <>
                                          <Loader2 className="w-4 h-4 animate-spin" />
                                          Sending...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-4 h-4" />
                                          Send Confirmation via WhatsApp
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow text-sm font-medium text-slate-700 hover:bg-orange-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="text-sm text-slate-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow text-sm font-medium text-slate-700 hover:bg-orange-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
