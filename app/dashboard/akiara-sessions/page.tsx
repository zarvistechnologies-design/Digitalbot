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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600 font-medium">Loading Akiara sessions...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
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
                  Akiara Bot Sessions
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">Monitor Devika WhatsApp agent conversations in real-time</p>
              </div>
              <div className="flex items-center gap-3">
                {connected && <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Live</span>}
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
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                {[
                  { title: "Total Sessions", value: analytics.totalSessions, icon: MessageSquare, color: "orange" },
                  { title: "Active Now", value: analytics.activeSessions, icon: Zap, color: "green" },
                  { title: "Escalated", value: analytics.escalatedSessions, icon: AlertTriangle, color: "red" },
                  { title: "Total Tickets", value: analytics.totalTickets, icon: Ticket, color: "purple" },
                  { title: "Open Tickets", value: analytics.openTickets, icon: Clock, color: "yellow" },
                  { title: "Urgent", value: analytics.urgentTickets, icon: AlertTriangle, color: "red" },
                ].map((card) => (
                  <div key={card.title} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-500 text-xs font-medium mb-1">{card.title}</p>
                        <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                      </div>
                      <card.icon className={`w-8 h-8 text-${card.color}-500 opacity-60`} />
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
              <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-orange-500" /> Daily Trend
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={analytics.dailyStats}>
                    <defs>
                      <linearGradient id="akSessGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickFormatter={(d) => d.slice(5)} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "rgba(255,255,255,0.95)", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }} />
                    <Area type="monotone" dataKey="sessions" stroke="#f97316" fill="url(#akSessGrad)" strokeWidth={2} name="Sessions" />
                    <Area type="monotone" dataKey="tickets" stroke="#ef4444" fill="transparent" strokeWidth={2} strokeDasharray="5 5" name="Tickets" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Product Pie */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-500" /> By Product
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
                ) : <p className="text-slate-400 text-center py-10">No data yet</p>}
                {/* Language breakdown */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Languages</p>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(analytics.languageBreakdown).filter(([, v]) => v > 0).map(([k, v]) => (
                      <span key={k} className="px-2 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">{langLabels[k] || k}: {v}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Service Pie */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-lg">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" /> By Service Type
                </h3>
                {servicePie.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={servicePie} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} />
                      <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={9} width={100} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-slate-400 text-center py-10">No data yet</p>}
              </div>
            </section>
          )}

          {/* Filters */}
          <section className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search phone, name, order ID..." className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
            </div>
            <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All States</option>
              {Object.entries(stateLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All Products</option>
              {Object.entries(productLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <select value={filterService} onChange={(e) => setFilterService(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All Services</option>
              {Object.entries(serviceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <span className="text-xs text-slate-500">{filtered.length} sessions</span>
          </section>

          {/* Sessions List */}
          <section className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-lg">
                <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No sessions found</p>
              </div>
            ) : (
              filtered.map((s) => {
                const isExpanded = expandedSession === s._id;
                return (
                  <div key={s._id} className="bg-white rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                    {/* Session Card Header */}
                    <div
                      className="p-4 cursor-pointer flex items-center justify-between gap-4"
                      onClick={() => setExpandedSession(isExpanded ? null : s._id)}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-800">{formatPhone(s.phone)}</p>
                            {s.customerName && <span className="text-sm text-slate-500">({s.customerName})</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStateColor(s.state)}`}>
                              {stateLabels[s.state] || s.state}
                            </span>
                            {s.product && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                                {productLabels[s.product] || s.product}
                              </span>
                            )}
                            {s.serviceType && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                {serviceLabels[s.serviceType] || s.serviceType}
                              </span>
                            )}
                            {s.language && (
                              <span className="text-xs text-slate-400">{langLabels[s.language] || s.language}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400">{timeAgo(s.lastActivity)}</p>
                          {s.orderId && <p className="text-xs text-slate-500 font-mono">#{s.orderId}</p>}
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
                        {/* Session Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {s.orderId && <div><p className="text-xs text-slate-400">Order ID</p><p className="text-sm font-semibold text-slate-700">{s.orderId}</p></div>}
                          {s.issueDescription && <div className="col-span-2"><p className="text-xs text-slate-400">Issue</p><p className="text-sm text-slate-700">{s.issueDescription}</p></div>}
                          {s.issueCategory && <div><p className="text-xs text-slate-400">Category</p><p className="text-sm text-slate-700">{s.issueCategory}</p></div>}
                          {s.purchasePlatform && <div><p className="text-xs text-slate-400">Platform</p><p className="text-sm text-slate-700 capitalize">{s.purchasePlatform}</p></div>}
                          {s.purchaseDate && <div><p className="text-xs text-slate-400">Purchase Date</p><p className="text-sm text-slate-700">{s.purchaseDate}</p></div>}
                          {s.customerCity && <div><p className="text-xs text-slate-400">City</p><p className="text-sm text-slate-700">{s.customerCity}, {s.customerState}</p></div>}
                          {s.customerPincode && <div><p className="text-xs text-slate-400">PIN Code</p><p className="text-sm text-slate-700">{s.customerPincode}</p></div>}
                        </div>

                        {/* Videos Sent */}
                        {s.videosSent.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Videos Sent ({s.videosSent.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {s.videosSent.map((v, i) => (
                                <a key={i} href={v} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition truncate max-w-[250px]">
                                  Video {i + 1}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Customer Videos */}
                        {s.customerVideoUrls.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Customer Videos ({s.customerVideoUrls.length})</p>
                            <div className="flex flex-wrap gap-3">
                              {s.customerVideoUrls.map((v, i) => {
                                const url = akiaraAPI.getMediaUrl(v);
                                if (!url) return null;
                                return (
                                  <div key={i} className="rounded-xl overflow-hidden border border-green-200 bg-green-50">
                                    <video src={url} controls preload="metadata" crossOrigin="use-credentials" className="max-w-[280px] max-h-[200px] rounded-t-xl" />
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="block text-center text-xs text-green-600 py-1 hover:bg-green-100 transition">
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
                            <p className="text-xs text-slate-400 mb-2">Conversation ({s.conversationHistory.length} messages)</p>
                            <div className="max-h-60 overflow-y-auto space-y-2 bg-white rounded-xl p-3 border border-slate-200">
                              {s.conversationHistory.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                                    msg.role === 'assistant' ? 'bg-orange-50 text-slate-700' : 'bg-blue-50 text-slate-700'
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
                        <div className="flex gap-2">
                          <input
                            value={expandedSession === s._id ? customMsg : ""}
                            onChange={(e) => setCustomMsg(e.target.value)}
                            placeholder="Send a message to this customer..."
                            className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(s.phone)}
                          />
                          <button
                            onClick={() => handleSendMessage(s.phone)}
                            disabled={sendingMsg === s.phone || !customMsg.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {sendingMsg === s.phone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            Send
                          </button>
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
