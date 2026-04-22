"use client";
import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/hooks/use-websocket";
import { akiaraAPI } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Package,
  RefreshCw,
  Search,
  Send,
  Ticket,
  User,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface AkiaraTicket {
  _id: string;
  phone: string;
  orderId: string | null;
  product: string | null;
  issueCategory: string | null;
  issueDescription: string | null;
  priority: "normal" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  customerVideoUrls: string[];
  videosSentToCustomer: string[];
  conversationSummary: string;
  escalationReason: string;
  language: string;
  serviceType: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerAddress: string | null;
  customerCity: string | null;
  customerState: string | null;
  customerPincode: string | null;
  purchaseDate: string | null;
  purchasePlatform: string | null;
  assignedTo: string | null;
  teleCrmPushed: boolean;
  teleCrmId: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  warranty_registration: "Warranty Registration",
  home_service: "Home Service",
  home_demo: "Home Demo",
  repair: "Repair",
  return_refund: "Return / Refund",
  live_demo: "Live Demo",
  service_center: "Service Center",
  troubleshooting: "Troubleshooting",
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
  return days < 7 ? `${days}d ago` : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const priorityColors: Record<string, string> = {
  normal: "bg-slate-100 text-slate-600",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700 animate-pulse",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-slate-100 text-slate-500",
};

const statusIcons: Record<string, React.ReactNode> = {
  open: <Clock className="w-3 h-3" />,
  in_progress: <Loader2 className="w-3 h-3" />,
  resolved: <CheckCircle className="w-3 h-3" />,
  closed: <X className="w-3 h-3" />,
};

const priorityBorders: Record<string, string> = {
  normal: "border-l-slate-300",
  high: "border-l-amber-400",
  urgent: "border-l-red-500",
};

const statusDots: Record<string, string> = {
  open: "bg-blue-500",
  in_progress: "bg-amber-500",
  resolved: "bg-emerald-500",
  closed: "bg-slate-400",
};

interface User {
  id: string;
  email: string;
  name: string;
  assignedPhoneNumber: string;
  role: string;
  tenantId: string;
  selectedService: string;
}

export default function AkiaraTicketsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tickets, setTickets] = useState<AkiaraTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterProduct, setFilterProduct] = useState("all");
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendingMsg, setSendingMsg] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await akiaraAPI.getTickets({ limit: 200 });
      setTickets(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  // Real-time updates via WebSocket
  const { connected } = useWebSocket({
    onMessage: useCallback((data: any) => {
      if (data.type === 'akiara_ticket_created' || data.type === 'akiara_ticket_update') {
        fetchTickets();
      }
    }, [fetchTickets]),
  });

  const handleUpdateTicket = async (id: string, field: string, value: string) => {
    setUpdatingId(id);
    try {
      await akiaraAPI.updateTicket(id, { [field]: value });
      setTickets((prev) => prev.map((t) => t._id === id ? { ...t, [field]: value } : t));
    } catch (err) {
      console.error("Failed to update ticket:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSendMessage = async (phone: string) => {
    if (!customMsg.trim() || !user?.tenantId) return;
    setSendingMsg(phone);
    try {
      await akiaraAPI.sendMessage({ phone, message: customMsg, tenantId: user.tenantId });
      setCustomMsg("");
      setSendingMsg(null);
    } catch (err) {
      console.error("Failed to send:", err);
      setSendingMsg(null);
    }
  };

  const filtered = tickets.filter((t) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !t.phone.includes(q) &&
        !t.customerName?.toLowerCase().includes(q) &&
        !t.orderId?.toLowerCase().includes(q) &&
        !t.issueDescription?.toLowerCase().includes(q) &&
        !t.escalationReason?.toLowerCase().includes(q) &&
        !t._id.toLowerCase().includes(q)
      ) return false;
    }
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (filterProduct !== "all" && t.product !== filterProduct) return false;
    return true;
  });

  // Stats
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent" && t.status !== "closed").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#f8fafc]">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
              <Ticket className="absolute inset-0 m-auto w-7 h-7 text-white" />
            </div>
            <p className="text-slate-500 font-medium">Loading tickets...</p>
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
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Support Tickets</h1>
                  <p className="text-sm text-slate-500">Manage escalated issues &amp; service requests</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {connected && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                  </span>
                )}
                <button onClick={fetchTickets} className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all">
                  <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          {/* ===== STATS ===== */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {[
              { title: "Total", value: stats.total, color: "bg-slate-500", icon: <Ticket className="w-5 h-5 text-slate-400" /> },
              { title: "Open", value: stats.open, color: "bg-blue-500", icon: <Clock className="w-5 h-5 text-blue-400" /> },
              { title: "In Progress", value: stats.inProgress, color: "bg-amber-500", icon: <Loader2 className="w-5 h-5 text-amber-400" /> },
              { title: "Resolved", value: stats.resolved, color: "bg-emerald-500", icon: <CheckCircle className="w-5 h-5 text-emerald-400" /> },
              { title: "Urgent", value: stats.urgent, color: "bg-red-500", icon: <AlertTriangle className="w-5 h-5 text-red-400" /> },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center gap-3.5">
                <div className={`w-1 h-10 rounded-full ${s.color}`} />
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{s.title}</p>
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                </div>
                {s.icon}
              </div>
            ))}
          </div>

          {/* ===== FILTERS ===== */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 mb-4 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by phone, name, order ID, ticket #..."
                  className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                />
              </div>
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-orange-200 focus:outline-none">
                <option value="all">All Priority</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-orange-200 focus:outline-none">
                <option value="all">All Products</option>
                {Object.entries(productLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
              <span className="text-xs font-medium text-slate-400 tabular-nums">{filtered.length} results</span>
            </div>
            {/* Status chip filters */}
            <div className="flex gap-1.5">
              {[
                { key: "all", label: "All", count: stats.total },
                { key: "open", label: "Open", count: stats.open },
                { key: "in_progress", label: "In Progress", count: stats.inProgress },
                { key: "resolved", label: "Resolved", count: stats.resolved },
                { key: "closed", label: "Closed", count: tickets.filter(t => t.status === "closed").length },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => setFilterStatus(s.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === s.key
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {s.label} <span className="ml-1 opacity-70">{s.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ===== TICKET LIST ===== */}
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200/80 py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-7 h-7 text-slate-300" />
                </div>
                <p className="text-slate-500 font-medium">No tickets found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((t) => {
                const isExpanded = expandedTicket === t._id;
                return (
                  <div
                    key={t._id}
                    className={`bg-white rounded-xl border transition-all overflow-hidden ${
                      t.priority === "urgent" ? "border-red-200" : isExpanded ? "border-orange-200" : "border-slate-200/80 hover:border-slate-300"
                    }`}
                  >
                    {/* Ticket Row */}
                    <div
                      className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer border-l-[3px] ${priorityBorders[t.priority]}`}
                      onClick={() => setExpandedTicket(isExpanded ? null : t._id)}
                    >
                      {/* Status dot */}
                      <div className="flex-shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full ${statusDots[t.status]}`} title={t.status} />
                      </div>
                      {/* Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded select-all">#{t._id.slice(-6).toUpperCase()}</span>
                          <span className="font-semibold text-sm text-slate-800">{formatPhone(t.phone)}</span>
                          {t.customerName && <span className="text-sm text-slate-400">· {t.customerName}</span>}
                          {t.orderId && <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">#{t.orderId}</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${statusColors[t.status]}`}>
                            {statusIcons[t.status]} {t.status.replace("_", " ")}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${priorityColors[t.priority]}`}>
                            {t.priority}
                          </span>
                          {t.product && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-600">
                              {productLabels[t.product] || t.product}
                            </span>
                          )}
                          {t.serviceType && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-600">
                              {serviceLabels[t.serviceType] || t.serviceType}
                            </span>
                          )}
                          {t.teleCrmPushed && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              CRM ✓
                            </span>
                          )}
                        </div>
                        {t.escalationReason && !isExpanded && (
                          <p className="text-xs text-slate-400 mt-1 truncate max-w-lg">{t.escalationReason}</p>
                        )}
                      </div>
                      {/* Right side */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[11px] text-slate-400 hidden sm:block">{timeAgo(t.createdAt)}</span>
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isExpanded ? "bg-orange-100" : "bg-slate-100"}`}>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-orange-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-[#fafbfc]">
                        {/* Actions bar */}
                        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</label>
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTicket(t._id, "status", e.target.value)}
                              disabled={updatingId === t._id}
                              className="h-8 px-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-200 focus:outline-none"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Priority</label>
                            <select
                              value={t.priority}
                              onChange={(e) => handleUpdateTicket(t._id, "priority", e.target.value)}
                              disabled={updatingId === t._id}
                              className="h-8 px-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-200 focus:outline-none"
                            >
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          {updatingId === t._id && <Loader2 className="w-3.5 h-3.5 text-orange-500 animate-spin" />}
                          <span className="text-[11px] text-slate-400 ml-auto hidden sm:flex items-center gap-2">
                            <span className="font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded select-all">TKT-{t._id.slice(-6).toUpperCase()}</span>
                            · Created {new Date(t.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="p-5 space-y-4">
                          {/* Customer & Order Info Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3">
                            {t.customerName && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User className="w-3 h-3" /> Customer</p>
                                <p className="text-sm font-medium text-slate-800 mt-0.5">{t.customerName}</p>
                              </div>
                            )}
                            {t.customerPhone && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
                                <p className="text-sm text-slate-700 mt-0.5">{t.customerPhone}</p>
                              </div>
                            )}
                            {t.orderId && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Package className="w-3 h-3" /> Order ID</p>
                                <p className="text-sm font-mono text-slate-700 mt-0.5">{t.orderId}</p>
                              </div>
                            )}
                            {t.issueCategory && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</p>
                                <p className="text-sm text-slate-700 mt-0.5">{t.issueCategory}</p>
                              </div>
                            )}
                            {t.language && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Language</p>
                                <p className="text-sm text-slate-700 mt-0.5">{langLabels[t.language] || t.language}</p>
                              </div>
                            )}
                            {t.purchasePlatform && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Platform</p>
                                <p className="text-sm text-slate-700 capitalize mt-0.5">{t.purchasePlatform}</p>
                              </div>
                            )}
                            {t.purchaseDate && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Purchase Date</p>
                                <p className="text-sm text-slate-700 mt-0.5">{t.purchaseDate}</p>
                              </div>
                            )}
                            {(t.customerCity || t.customerState) && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</p>
                                <p className="text-sm text-slate-700 mt-0.5">{[t.customerCity, t.customerState].filter(Boolean).join(", ")}{t.customerPincode ? ` — ${t.customerPincode}` : ""}</p>
                              </div>
                            )}
                            {t.customerAddress && (
                              <div className="col-span-2">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address</p>
                                <p className="text-sm text-slate-700 mt-0.5">{t.customerAddress}</p>
                              </div>
                            )}
                            {t.teleCrmPushed && (
                              <div>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">TeleCRM</p>
                                <p className="text-sm font-mono text-emerald-600 mt-0.5">{t.teleCrmId || "Pushed"}</p>
                              </div>
                            )}
                          </div>

                          {/* Issue Description */}
                          {t.issueDescription && (
                            <div className="bg-white rounded-lg border border-slate-200 p-3.5">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Issue Description</p>
                              <p className="text-sm text-slate-700 leading-relaxed">{t.issueDescription}</p>
                            </div>
                          )}

                          {/* Conversation Summary */}
                          {t.conversationSummary && (
                            <div className="bg-white rounded-lg border border-slate-200 p-3.5">
                              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1"><MessageCircle className="w-3 h-3" /> Conversation Summary</p>
                              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{t.conversationSummary}</p>
                            </div>
                          )}

                          {/* Escalation Reason */}
                          {t.escalationReason && (
                            <div className="bg-red-50/80 rounded-lg border border-red-200/60 p-3.5">
                              <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider mb-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Escalation Reason</p>
                              <p className="text-sm text-red-700 leading-relaxed">{t.escalationReason}</p>
                            </div>
                          )}

                          {/* Videos */}
                          {(t.customerVideoUrls.length > 0 || t.videosSentToCustomer.length > 0) && (
                            <div className="flex flex-wrap gap-4">
                              {t.videosSentToCustomer.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Videos Sent</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {t.videosSentToCustomer.map((v, i) => (
                                      <a key={i} href={v} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition">
                                        <ExternalLink className="w-3 h-3" /> Video {i + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {t.customerVideoUrls.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Customer Videos</p>
                                  <div className="flex flex-wrap gap-3">
                                    {t.customerVideoUrls.map((v, i) => {
                                      const url = akiaraAPI.getMediaUrl(v);
                                      if (!url) return null;
                                      return (
                                        <div key={i} className="rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/50">
                                          <video src={url} controls preload="metadata" crossOrigin="use-credentials" className="max-w-[260px] max-h-[180px] rounded-t-lg" />
                                          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 text-xs text-emerald-600 py-1.5 hover:bg-emerald-100 transition">
                                            <ExternalLink className="w-3 h-3" /> Open
                                          </a>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Send Message */}
                          <div className="bg-white rounded-lg border border-slate-200 p-3 flex gap-2">
                            <input
                              value={expandedTicket === t._id ? customMsg : ""}
                              onChange={(e) => setCustomMsg(e.target.value)}
                              placeholder="Send WhatsApp message..."
                              className="flex-1 h-9 px-3.5 bg-slate-50 rounded-lg border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(t.phone)}
                            />
                            <button
                              onClick={() => handleSendMessage(t.phone)}
                              disabled={sendingMsg === t.phone || !customMsg.trim()}
                              className="h-9 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium text-xs flex items-center gap-1.5 hover:shadow-md transition-all disabled:opacity-40"
                            >
                              {sendingMsg === t.phone ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              Send
                            </button>
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
