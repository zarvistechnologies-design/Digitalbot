"use client";
import Sidebar from "@/components/Sidebar";
import { healthiqureAPI } from "@/lib/api";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    FileText,
    Globe,
    Loader2,
    MapPin,
    Menu,
    MessageSquare,
    RefreshCw,
    Search,
    Send,
    User,
    X,
    Zap
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Types
interface BotSession {
  _id: string;
  phone: string;
  language: string | null;
  state: string;
  location: string | null;
  service: string | null;
  subChoice: string | null;
  alternatePhone: string | null;
  otherLocationText: string | null;
  mediaUrls: string[];
  userInput: string | null;
  patientInfo?: {
    name?: string;
    age?: string;
    gender?: string;
    type?: string;
  };
  callbackContext: string | null;
  backendNotified: boolean;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  _source?: 'live' | 'history';
  _historyId?: string;
}

interface Analytics {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  withDocuments: number;
  locationBreakdown: Record<string, number>;
  serviceBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  stateBreakdown: Record<string, number>;
  dailyStats: { date: string; sessions: number; completed: number; documents: number }[];
}

const chartColors = ["#f97316", "#10b981", "#f97316", "#ef4444", "#06b6d4", "#f59e0b", "#ec4899", "#14b8a6"];

const stateLabels: Record<string, string> = {
  INITIAL: "Started",
  LANGUAGE_SELECTION: "Choosing Language",
  LOCATION_SELECTED: "Location Selected",
  SERVICE_MENU: "Browsing Services",
  DOCTOR_CONSULTATION_TYPE: "Doctor Consult",
  ALTERNATE_NUMBER_PROMPT: "Alt Number",
  WAITING_ALTERNATE_NUMBER: "Waiting Alt Number",
  WAITING_PRESCRIPTION_PHARMACY: "Pharmacy Upload",
  WAITING_PRESCRIPTION_LAB: "Lab Upload",
  WAITING_ECG_DATETIME: "ECG Booking",
  WAITING_ULTRASOUND_INFO: "Ultrasound Info",
  WAITING_SKIN_INFO: "Skin Consult",
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
  BACKEND_PENDING: "Pending Backend",
};

const serviceLabels: Record<string, string> = {
  doctor: "Doctor Consultation",
  pharmacy: "Pharmacy / Medicines",
  lab: "Laboratory Tests",
  ecg: "ECG",
  ultrasound: "Ultrasound",
  skin: "Skin Clinic",
  hospital: "Hospital Admission",
  emergency: "Emergency Help",
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
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function BotSessionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<BotSession[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [dateRange, setDateRange] = useState("7");
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionsRes, analyticsRes] = await Promise.all([
        healthiqureAPI.getSessions({ limit: 200 }),
        healthiqureAPI.getAnalytics({ days: parseInt(dateRange) }),
      ]);
      setSessions(sessionsRes.data?.data || []);
      setAnalytics(analyticsRes.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch bot data:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

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

  const handleResetSession = async (phone: string) => {
    try {
      await healthiqureAPI.resetSession(phone);
      fetchData();
    } catch (err) {
      console.error("Failed to reset session:", err);
    }
  };

  // Filters
  const filtered = sessions.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      if (!s.phone.includes(q) && !s.patientInfo?.name?.toLowerCase().includes(q) && !s.service?.toLowerCase().includes(q)) return false;
    }
    if (filterState !== "all") {
      if (filterState === "active" && (s.state === "CONVERSATION_HALTED" || s.state === "INITIAL")) return false;
      if (filterState === "completed" && s.state !== "CONVERSATION_HALTED") return false;
      if (filterState === "pending" && s.state !== "BACKEND_PENDING") return false;
    }
    if (filterLocation !== "all" && s.location !== filterLocation) return false;
    if (filterService !== "all" && s.service !== filterService) return false;
    return true;
  });

  // Pie chart data
  const locationPie = analytics
    ? Object.entries(analytics.locationBreakdown)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: v }))
    : [];

  const servicePie = analytics
    ? Object.entries(analytics.serviceBreakdown)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: serviceLabels[k] || k, value: v }))
    : [];

  if (loading && !analytics) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600 font-medium">Loading bot sessions...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      {/* Mobile Menu */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-slate-200">
        {sidebarOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  WhatsApp Bot Sessions
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">Monitor all HealthiQure WhatsApp bot conversations in real-time</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="px-4 py-2 bg-white rounded-xl border border-slate-300 shadow-md text-slate-700 font-medium text-sm">
                  <option value="1">Last 24h</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button onClick={fetchData} className="p-2 bg-white rounded-xl border border-slate-300 shadow-md hover:bg-orange-50 transition-colors">
                  <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </header>

          {/* Stats Cards */}
          {analytics && (
            <section className="mb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Total Sessions", value: analytics.totalSessions, icon: MessageSquare, color: "orange" },
                  { title: "Active Now", value: analytics.activeSessions, icon: Zap, color: "green" },
                  { title: "Completed", value: analytics.completedSessions, icon: Clock, color: "purple" },
                  { title: "With Documents", value: analytics.withDocuments, icon: FileText, color: "sky" },
                ].map((card) => (
                  <div key={card.title} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-1">{card.title}</p>
                        <p className="text-3xl font-bold text-slate-800">{card.value}</p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br from-${card.color}-400 to-${card.color}-600 rounded-xl flex items-center justify-center shadow-lg`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Charts */}
          {analytics && mounted && (
            <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Daily Trend */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" /> Daily Session Trend
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analytics.dailyStats}>
                    <defs>
                      <linearGradient id="sessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="sessions" stroke="#f97316" fill="url(#sessGrad)" strokeWidth={2} name="Sessions" />
                    <Area type="monotone" dataKey="completed" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Completed" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Location Pie */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" /> By Location
                </h3>
                {locationPie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={locationPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} label={(e: { name: string; value: number }) => `${e.name}: ${e.value}`}>
                        {locationPie.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-400 text-center py-10">No data yet</p>
                )}

                {/* Language breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><Globe className="w-3 h-3" /> Languages</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(analytics.languageBreakdown).filter(([, v]) => v > 0).map(([k, v]) => (
                      <span key={k} className="px-2 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">{langLabels[k] || k}: {v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Service Breakdown Bar */}
          {analytics && mounted && servicePie.length > 0 && (
            <section className="mb-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" /> Services Requested
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={servicePie} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {servicePie.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
                    placeholder="Search by phone, name, or service..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50">
                    <option value="all">All States</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending Backend</option>
                  </select>
                  <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50">
                    <option value="all">All Locations</option>
                    <option value="bordumsa">Bordumsa</option>
                    <option value="miao">Miao</option>
                    <option value="other">Other</option>
                  </select>
                  <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-slate-50">
                    <option value="all">All Services</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="lab">Lab</option>
                    <option value="ecg">ECG</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="skin">Skin</option>
                    <option value="hospital">Hospital</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{filtered.length} session{filtered.length !== 1 ? "s" : ""} found</p>
            </div>
          </section>

          {/* Sessions List */}
          <section className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-lg text-center">
                <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No sessions found</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((session) => {
                const isExpanded = expandedSession === session._id;
                const isActive = session.state !== "CONVERSATION_HALTED" && session.state !== "INITIAL";
                const hasMedia = session.mediaUrls && session.mediaUrls.length > 0;
                return (
                  <div key={session._id} className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                    {/* Session header */}
                    <div
                      className="p-4 cursor-pointer flex items-center gap-4"
                      onClick={() => setExpandedSession(isExpanded ? null : session._id)}
                    >
                      {/* Status indicator */}
                      <div className={`w-3 h-3 rounded-full shrink-0 ${isActive ? "bg-green-400 animate-pulse" : session.state === "BACKEND_PENDING" ? "bg-yellow-400 animate-pulse" : "bg-slate-300"}`} />

                      {/* Phone & name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-800">{formatPhone(session.phone)}</span>
                          {session.patientInfo?.name && (
                            <span className="text-sm text-slate-600">({session.patientInfo.name})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? "bg-green-100 text-green-700" : session.state === "BACKEND_PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>
                            {stateLabels[session.state] || session.state}
                          </span>
                          {session.location && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {session.location.charAt(0).toUpperCase() + session.location.slice(1)}
                            </span>
                          )}
                          {session.service && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">
                              {serviceLabels[session.service] || session.service}
                            </span>
                          )}
                          {session.language && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">
                              {langLabels[session.language] || session.language}
                            </span>
                          )}
                          {hasMedia && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-600 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {session.mediaUrls.length} doc{session.mediaUrls.length > 1 ? "s" : ""}
                            </span>
                          )}
                          {session._source === 'history' && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">
                              Past Query
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time */}
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-500">{timeAgo(session.lastActivity)}</p>
                      </div>

                      {/* Expand icon */}
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Left - Details */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1"><User className="w-4 h-4" /> Session Details</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div><span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-800">{formatPhone(session.phone)}</span></div>
                              {session.alternatePhone && <div><span className="text-slate-500">Alt Phone:</span> <span className="font-semibold text-slate-800">{formatPhone(session.alternatePhone)}</span></div>}
                              {session.patientInfo?.name && <div><span className="text-slate-500">Name:</span> <span className="font-semibold">{session.patientInfo.name}</span></div>}
                              {session.patientInfo?.age && <div><span className="text-slate-500">Age:</span> <span className="font-semibold">{session.patientInfo.age}</span></div>}
                              {session.patientInfo?.gender && <div><span className="text-slate-500">Gender:</span> <span className="font-semibold">{session.patientInfo.gender}</span></div>}
                              {session.subChoice && <div><span className="text-slate-500">Choice:</span> <span className="font-semibold">{session.subChoice}</span></div>}
                              {session.otherLocationText && <div className="col-span-2"><span className="text-slate-500">Location:</span> <span className="font-semibold">{session.otherLocationText}</span></div>}
                              {session.userInput && <div className="col-span-2"><span className="text-slate-500">Input:</span> <span className="font-semibold">{session.userInput}</span></div>}
                              <div><span className="text-slate-500">Created:</span> <span className="font-semibold">{new Date(session.createdAt).toLocaleString("en-IN")}</span></div>
                              <div><span className="text-slate-500">Last Active:</span> <span className="font-semibold">{new Date(session.lastActivity).toLocaleString("en-IN")}</span></div>
                              <div><span className="text-slate-500">Backend Notified:</span> <span className={`font-semibold ${session.backendNotified ? "text-green-600" : "text-red-500"}`}>{session.backendNotified ? "Yes" : "No"}</span></div>
                            </div>
                          </div>

                          {/* Right - Documents & Actions */}
                          <div className="space-y-3">
                            {hasMedia && (
                              <div>
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1 mb-2"><FileText className="w-4 h-4" /> Uploaded Documents</h4>
                                <div className="space-y-2">
                                  {session.mediaUrls.map((url, i) => (
                                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 hover:border-orange-300 transition-colors text-sm">
                                      <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                                      <span className="text-blue-600 truncate">Document {i + 1}</span>
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Send message */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-1 mb-2"><Send className="w-4 h-4" /> Send Message</h4>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Type a message..."
                                  value={sendingMsg === session.phone ? customMsg : ""}
                                  onFocus={() => setSendingMsg(session.phone)}
                                  onChange={(e) => setCustomMsg(e.target.value)}
                                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-orange-400 transition-colors"
                                />
                                <button
                                  onClick={() => handleSendMessage(session.phone)}
                                  disabled={sendingMsg === session.phone && !customMsg.trim()}
                                  className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Reset */}
                            <button
                              onClick={() => handleResetSession(session.phone)}
                              className="w-full px-3 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                              <RefreshCw className="w-4 h-4" /> Reset Session
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
