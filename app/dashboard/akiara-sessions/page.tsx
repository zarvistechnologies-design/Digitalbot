"use client";
import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { akiaraAPI } from "@/lib/api";
import {
    AlertTriangle,
    ChevronDown,
    ChevronUp,
    Clock,
    Loader2,
    Menu,
    MessageSquare,
    Package,
    RefreshCw,
    Search,
    Send,
    Ticket,
    User,
    X,
    Zap
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

interface AkiaraSession {
  _id: string;
  phone: string;
  state: string;
  language: string | null;
  product: string | null;
  serviceType: string | null;
  orderId: string | null;
  issueDescription: string | null;
  issueCategory: string | null;
  videosSent: string[];
  customerVideoUrls: string[];
  conversationHistory: { role: string; content: string; timestamp: string }[];
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerCity: string | null;
  customerState: string | null;
  customerPincode: string | null;
  purchaseDate: string | null;
  purchasePlatform: string | null;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  totalSessions: number;
  activeSessions: number;
  escalatedSessions: number;
  totalTickets: number;
  openTickets: number;
  urgentTickets: number;
  productBreakdown: Record<string, number>;
  serviceBreakdown: Record<string, number>;
  stateBreakdown: Record<string, number>;
  languageBreakdown: Record<string, number>;
  dailyStats: { date: string; sessions: number; tickets: number }[];
}

const chartColors = ["#f97316", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4", "#f59e0b", "#ec4899", "#14b8a6"];

const stateLabels: Record<string, string> = {
  WELCOME: "Welcome",
  LANGUAGE_SELECTED: "Language Selected",
  PRODUCT_SELECTED: "Product Selected",
  ORDER_ID: "Order ID Asked",
  SERVICE_MENU: "Service Menu",
  ISSUE_DESCRIBED: "Issue Described",
  VIDEO_SENT: "Video Sent",
  AWAITING_CUSTOMER_VIDEO: "Awaiting Video",
  COLLECTING_DETAILS: "Collecting Details",
  RETURN_QUERY: "Return Query",
  ESCALATED: "Escalated",
  RESOLVED: "Resolved",
};

const productLabels: Record<string, string> = {
  mini: "Akiara Mini",
  yume: "Akiara Yume",
  duo: "Akiara Duo",
  soup_maker: "Soup Maker",
  car_vacuum: "Car Vacuum",
  floor_vacuum: "Floor Vacuum",
  cold_press_juicer: "Cold Press Juicer",
};

const serviceLabels: Record<string, string> = {
  machine_not_working: "Machine Not Working",
  warranty_registration: "Warranty Registration",
  live_demo: "Live Demo",
  home_service: "Home Service",
  home_demo: "Home Demo",
  return_replacement: "Return/Replacement",
  general_query: "General Query",
};

const langLabels: Record<string, string> = { en: "English", hi: "Hindi", ta: "Tamil", te: "Telugu" };

function formatPhone(phone: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
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

function getStateColor(state: string) {
  switch (state) {
    case "RESOLVED": return "bg-green-100 text-green-700";
    case "ESCALATED": return "bg-red-100 text-red-700";
    case "AWAITING_CUSTOMER_VIDEO": return "bg-yellow-100 text-yellow-700";
    case "VIDEO_SENT": return "bg-blue-100 text-blue-700";
    case "COLLECTING_DETAILS": return "bg-purple-100 text-purple-700";
    default: return "bg-slate-100 text-slate-700";
  }
}

export default function AkiaraSessionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<AkiaraSession[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
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
        akiaraAPI.getSessions({ limit: 200 }),
        akiaraAPI.getAnalytics({ days: parseInt(dateRange) }),
      ]);
      setSessions(sessionsRes.data?.data || []);
      setAnalytics(analyticsRes.data?.data || null);
    } catch (err) {
      console.error("Failed to fetch Akiara data:", err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Real-time updates via WebSocket
  const { connected } = useWebSocket({
    onMessage: useCallback((data: any) => {
      if (data.type === 'akiara_session_update' || data.type === 'akiara_ticket_created') {
        fetchData();
      }
    }, [fetchData]),
  });

  const handleSendMessage = async (phone: string) => {
    if (!customMsg.trim()) return;
    setSendingMsg(phone);
    try {
      await akiaraAPI.sendMessage({ phone, message: customMsg });
      setCustomMsg("");
      setSendingMsg(null);
    } catch (err) {
      console.error("Failed to send message:", err);
      setSendingMsg(null);
    }
  };

  // Filters
  const filtered = sessions.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.phone.includes(q) &&
        !s.customerName?.toLowerCase().includes(q) &&
        !s.orderId?.toLowerCase().includes(q) &&
        !s.issueDescription?.toLowerCase().includes(q)
      ) return false;
    }
    if (filterState !== "all" && s.state !== filterState) return false;
    if (filterProduct !== "all" && s.product !== filterProduct) return false;
    if (filterService !== "all" && s.serviceType !== filterService) return false;
    return true;
  });

  // Pie chart data
  const productPie = analytics
    ? Object.entries(analytics.productBreakdown)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: productLabels[k] || k, value: v }))
    : [];

  const servicePie = analytics
    ? Object.entries(analytics.serviceBreakdown)
        .filter(([, v]) => v > 0)
        .map(([k, v]) => ({ name: serviceLabels[k] || k, value: v }))
    : [];

  if (loading && !analytics) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
              <MessageSquare className="absolute inset-0 m-auto w-7 h-7 text-white" />
            </div>
            <p className="text-slate-500 font-medium">Loading Akiara sessions...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile sidebar */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200/80">
        {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto">

          {/* ===== HEADER ===== */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Akiara Sessions</h1>
                  <p className="text-sm text-slate-500">Devika WhatsApp agent conversations</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {connected && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                  </span>
                )}
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="h-10 px-3 bg-white rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 font-medium focus:ring-2 focus:ring-orange-200 focus:outline-none">
                  <option value="1">Last 24h</option>
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                </select>
                <button onClick={fetchData} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ===== STATS ===== */}
          {analytics && (
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
              {[
                { title: "Total Sessions", value: analytics.totalSessions, color: "bg-orange-500", icon: <MessageSquare className="w-4 h-4 text-orange-400" /> },
                { title: "Active Now", value: analytics.activeSessions, color: "bg-emerald-500", icon: <Zap className="w-4 h-4 text-emerald-400" /> },
                { title: "Escalated", value: analytics.escalatedSessions, color: "bg-red-500", icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
                { title: "Total Tickets", value: analytics.totalTickets, color: "bg-violet-500", icon: <Ticket className="w-4 h-4 text-violet-400" /> },
                { title: "Open Tickets", value: analytics.openTickets, color: "bg-amber-500", icon: <Clock className="w-4 h-4 text-amber-400" /> },
                { title: "Urgent", value: analytics.urgentTickets, color: "bg-rose-500", icon: <AlertTriangle className="w-4 h-4 text-rose-400" /> },
              ].map((s) => (
                <div key={s.title} className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3">
                  <div className={`w-1 h-9 rounded-full ${s.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">{s.title}</p>
                    <p className="text-lg font-bold text-slate-900">{s.value}</p>
                  </div>
                  {s.icon}
                </div>
              ))}
            </div>
          )}

          {/* ===== CHARTS ===== */}
          {analytics && mounted && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
              {/* Daily Trend */}
              <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-500" /> Daily Trend
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={analytics.dailyStats}>
                    <defs>
                      <linearGradient id="akSessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                    <YAxis stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.97)", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                    <Area type="monotone" dataKey="sessions" stroke="#f97316" fill="url(#akSessGrad)" strokeWidth={2} name="Sessions" />
                    <Area type="monotone" dataKey="tickets" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Tickets" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Product Pie */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-500" /> By Product
                </h3>
                {productPie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={productPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} label={(e: { name: string; value: number }) => `${e.name}: ${e.value}`}>
                        {productPie.map((_, i) => <Cell key={i} fill={chartColors[i % chartColors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-slate-400 text-center py-10 text-sm">No data yet</p>}
                {/* Language breakdown */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Languages</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.entries(analytics.languageBreakdown).filter(([, v]) => v > 0).map(([k, v]) => (
                      <span key={k} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-medium text-slate-600">{langLabels[k] || k}: {v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Bar */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-500" /> By Service Type
                </h3>
                {servicePie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={servicePie} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                      <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={9} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.97)", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-slate-400 text-center py-10 text-sm">No data yet</p>}
              </div>
            </div>
          )}

          {/* ===== FILTERS ===== */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 mb-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search phone, name, order ID..." className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all" />
              </div>
              <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-orange-200 focus:outline-none">
                <option value="all">All Products</option>
                {Object.entries(productLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-orange-200 focus:outline-none">
                <option value="all">All Services</option>
                {Object.entries(serviceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <span className="text-xs font-medium text-slate-400 tabular-nums">{filtered.length} results</span>
            </div>
            {/* State chip filters */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { key: "all", label: "All" },
                ...Object.entries(stateLabels).map(([k, v]) => ({ key: k, label: v })),
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFilterState(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterState === s.key
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ===== SESSIONS LIST ===== */}
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No sessions found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((s) => {
                const isExpanded = expandedSession === s._id;
                const isEscalated = s.state === "ESCALATED";
                const isResolved = s.state === "RESOLVED";
                const isActive = !isEscalated && !isResolved && s.state !== "WELCOME";
                return (
                  <div
                    key={s._id}
                    className={`bg-white rounded-xl border transition-all overflow-hidden ${
                      isEscalated ? "border-red-200" : isExpanded ? "border-orange-200" : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    {/* Session Row */}
                    <div
                      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer border-l-[3px] ${
                        isEscalated ? "border-l-red-500" : isActive ? "border-l-emerald-500" : isResolved ? "border-l-slate-300" : "border-l-slate-300"
                      }`}
                      onClick={() => setExpandedSession(isExpanded ? null : s._id)}
                    >
                      {/* Status dot */}
                      <div className="flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${isEscalated ? "bg-red-500 animate-pulse" : isActive ? "bg-emerald-500 animate-pulse" : isResolved ? "bg-slate-300" : "bg-slate-300"}`} />
                      </div>
                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-slate-800">{formatPhone(s.phone)}</span>
                          {s.customerName && <span className="text-sm text-slate-400">· {s.customerName}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getStateColor(s.state)}`}>
                            {stateLabels[s.state] || s.state}
                          </span>
                          {s.product && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600">
                              {productLabels[s.product] || s.product}
                            </span>
                          )}
                          {s.serviceType && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
                              {serviceLabels[s.serviceType] || s.serviceType}
                            </span>
                          )}
                          {s.language && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-violet-50 text-violet-600">
                              {langLabels[s.language] || s.language}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Right side */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-[11px] text-slate-400">{timeAgo(s.lastActivity)}</span>
                          {s.orderId && <p className="text-[11px] text-slate-500 font-mono mt-0.5">#{s.orderId}</p>}
                        </div>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isExpanded ? "bg-orange-100" : "bg-slate-100"}`}>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-orange-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-[#fafbfc]">
                        {/* Top bar */}
                        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Session Details</span>
                          <span className="text-[11px] text-slate-400 hidden sm:block">
                            Created {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="p-5 space-y-5">
                          {/* Session Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3">
                            {s.orderId && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Order ID</p>
                                <p className="text-sm font-medium text-slate-800 font-mono mt-0.5">{s.orderId}</p>
                              </div>
                            )}
                            {s.issueDescription && (
                              <div className="col-span-2">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Issue</p>
                                <p className="text-sm text-slate-700 mt-0.5">{s.issueDescription}</p>
                              </div>
                            )}
                            {s.issueCategory && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</p>
                                <p className="text-sm text-slate-700 mt-0.5">{s.issueCategory}</p>
                              </div>
                            )}
                            {s.purchasePlatform && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Platform</p>
                                <p className="text-sm text-slate-700 capitalize mt-0.5">{s.purchasePlatform}</p>
                              </div>
                            )}
                            {s.purchaseDate && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Purchase Date</p>
                                <p className="text-sm text-slate-700 mt-0.5">{s.purchaseDate}</p>
                              </div>
                            )}
                            {s.customerCity && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">City</p>
                                <p className="text-sm text-slate-700 mt-0.5">{s.customerCity}, {s.customerState}</p>
                              </div>
                            )}
                            {s.customerPincode && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">PIN Code</p>
                                <p className="text-sm text-slate-700 mt-0.5">{s.customerPincode}</p>
                              </div>
                            )}
                          </div>

                          {/* Videos Sent */}
                          {s.videosSent.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Videos Sent ({s.videosSent.length})</p>
                              <div className="flex flex-wrap gap-1.5">
                                {s.videosSent.map((v, i) => (
                                  <a key={i} href={v} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50 hover:border-blue-300 transition-all truncate max-w-[250px] group">
                                    Video {i + 1}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Customer Videos */}
                          {s.customerVideoUrls.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Customer Videos ({s.customerVideoUrls.length})</p>
                              <div className="flex flex-wrap gap-3">
                                {s.customerVideoUrls.map((v, i) => {
                                  const url = akiaraAPI.getMediaUrl(v);
                                  if (!url) return null;
                                  return (
                                    <div key={i} className="rounded-xl overflow-hidden border border-emerald-200 bg-white">
                                      <video src={url} controls preload="metadata" crossOrigin="use-credentials" className="max-w-[280px] max-h-[200px]" />
                                      <a href={url} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-emerald-600 py-1.5 hover:bg-emerald-50 transition border-t border-emerald-100">
                                        Open Video {i + 1}
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Conversation History */}
                          {s.conversationHistory.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Conversation ({s.conversationHistory.length} messages)</p>
                              <div className="max-h-60 overflow-y-auto space-y-2 bg-white rounded-xl p-3 border border-slate-200">
                                {s.conversationHistory.map((msg, i) => (
                                  <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                      msg.role === 'assistant' ? 'bg-orange-50 text-slate-700 border border-orange-100' : 'bg-blue-50 text-slate-700 border border-blue-100'
                                    }`}>
                                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                                      <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Send Message */}
                          <div className="bg-white rounded-lg border border-slate-200 p-3">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Send className="w-3 h-3" /> Send Message</p>
                            <div className="flex gap-2">
                              <input
                                value={expandedSession === s._id ? customMsg : ""}
                                onChange={(e) => setCustomMsg(e.target.value)}
                                placeholder="Send a message to this customer..."
                                className="flex-1 h-9 px-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(s.phone)}
                              />
                              <button
                                onClick={() => handleSendMessage(s.phone)}
                                disabled={sendingMsg === s.phone || !customMsg.trim()}
                                className="h-9 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:shadow-md transition-all disabled:opacity-40"
                              >
                                {sendingMsg === s.phone ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                Send
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
