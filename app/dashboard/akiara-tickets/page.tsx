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
    Loader2,
    Menu,
    RefreshCw,
    Search,
    Send,
    Ticket,
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
    if (!customMsg.trim()) return;
    setSendingMsg(phone);
    try {
      await akiaraAPI.sendMessage({ phone, message: customMsg });
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
        !t.escalationReason?.toLowerCase().includes(q)
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
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 p-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-slate-600 font-medium">Loading tickets...</p>
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
                  Akiara Support Tickets
                </h1>
                <p className="text-slate-600 text-sm sm:text-base">Manage escalated customer issues and service requests</p>
              </div>
              <div className="flex items-center gap-3 self-start">
                {connected && <span className="flex items-center gap-1.5 text-xs font-medium text-green-600"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />Live</span>}
                <button onClick={fetchTickets} className="p-2 bg-white rounded-xl border border-slate-300 shadow-md hover:bg-orange-50 transition-colors">
                  <RefreshCw className={`w-5 h-5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </header>

          {/* Stats */}
          <section className="mb-6 grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Total", value: stats.total, icon: Ticket, cls: "text-slate-600" },
              { title: "Open", value: stats.open, icon: Clock, cls: "text-blue-600" },
              { title: "In Progress", value: stats.inProgress, icon: Loader2, cls: "text-yellow-600" },
              { title: "Resolved", value: stats.resolved, icon: CheckCircle, cls: "text-green-600" },
              { title: "Urgent", value: stats.urgent, icon: AlertTriangle, cls: "text-red-600" },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-medium mb-1">{c.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{c.value}</p>
                  </div>
                  <c.icon className={`w-8 h-8 ${c.cls} opacity-50`} />
                </div>
              </div>
            ))}
          </section>

          {/* Filters */}
          <section className="mb-4 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search phone, name, order ID, issue..." className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none" />
            </div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All Priority</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)} className="px-3 py-2 bg-white rounded-xl border border-slate-300 shadow-sm text-sm">
              <option value="all">All Products</option>
              {Object.entries(productLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <span className="text-xs text-slate-500">{filtered.length} tickets</span>
          </section>

          {/* Ticket List */}
          <section className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-lg">
                <Ticket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No tickets found</p>
              </div>
            ) : (
              filtered.map((t) => {
                const isExpanded = expandedTicket === t._id;
                return (
                  <div key={t._id} className={`bg-white rounded-2xl border shadow-lg hover:shadow-xl transition-all overflow-hidden ${t.priority === 'urgent' ? 'border-red-300' : 'border-slate-200'}`}>
                    {/* Ticket Header */}
                    <div className="p-4 cursor-pointer flex items-center justify-between gap-4" onClick={() => setExpandedTicket(isExpanded ? null : t._id)}>
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          t.priority === 'urgent' ? 'bg-gradient-to-br from-red-400 to-red-600' :
                          t.priority === 'high' ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                          'bg-gradient-to-br from-slate-400 to-slate-600'
                        }`}>
                          <Ticket className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-slate-800">{formatPhone(t.phone)}</p>
                            {t.customerName && <span className="text-sm text-slate-500">({t.customerName})</span>}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${statusColors[t.status]}`}>
                              {statusIcons[t.status]} {t.status.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColors[t.priority]}`}>
                              {t.priority}
                            </span>
                            {t.product && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-600">{productLabels[t.product] || t.product}</span>}
                            {t.serviceType && <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600">{serviceLabels[t.serviceType] || t.serviceType}</span>}
                          </div>
                          {t.escalationReason && <p className="text-xs text-slate-500 mt-1 truncate max-w-md">{t.escalationReason}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-slate-400">{timeAgo(t.createdAt)}</p>
                          {t.orderId && <p className="text-xs text-slate-500 font-mono">#{t.orderId}</p>}
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                      </div>
                    </div>

                    {/* Expanded */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 p-4 bg-slate-50 space-y-4">
                        {/* Actions Row */}
                        <div className="flex flex-wrap gap-3 items-center">
                          <div>
                            <label className="text-xs text-slate-400">Status</label>
                            <select
                              value={t.status}
                              onChange={(e) => handleUpdateTicket(t._id, "status", e.target.value)}
                              disabled={updatingId === t._id}
                              className="ml-2 px-3 py-1 bg-white rounded-lg border border-slate-300 text-sm"
                            >
                              <option value="open">Open</option>
                              <option value="in_progress">In Progress</option>
                              <option value="resolved">Resolved</option>
                              <option value="closed">Closed</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-slate-400">Priority</label>
                            <select
                              value={t.priority}
                              onChange={(e) => handleUpdateTicket(t._id, "priority", e.target.value)}
                              disabled={updatingId === t._id}
                              className="ml-2 px-3 py-1 bg-white rounded-lg border border-slate-300 text-sm"
                            >
                              <option value="normal">Normal</option>
                              <option value="high">High</option>
                              <option value="urgent">Urgent</option>
                            </select>
                          </div>
                          {updatingId === t._id && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {t.orderId && <div><p className="text-xs text-slate-400">Order ID</p><p className="text-sm font-semibold">{t.orderId}</p></div>}
                          {t.issueCategory && <div><p className="text-xs text-slate-400">Category</p><p className="text-sm">{t.issueCategory}</p></div>}
                          {t.language && <div><p className="text-xs text-slate-400">Language</p><p className="text-sm">{langLabels[t.language] || t.language}</p></div>}
                          {t.purchasePlatform && <div><p className="text-xs text-slate-400">Platform</p><p className="text-sm capitalize">{t.purchasePlatform}</p></div>}
                          {t.purchaseDate && <div><p className="text-xs text-slate-400">Purchase Date</p><p className="text-sm">{t.purchaseDate}</p></div>}
                          {t.customerPhone && <div><p className="text-xs text-slate-400">Phone</p><p className="text-sm">{t.customerPhone}</p></div>}
                          {t.customerCity && <div><p className="text-xs text-slate-400">City</p><p className="text-sm">{t.customerCity}{t.customerState ? `, ${t.customerState}` : ''}</p></div>}
                          {t.customerPincode && <div><p className="text-xs text-slate-400">PIN</p><p className="text-sm">{t.customerPincode}</p></div>}
                          {t.customerAddress && <div className="col-span-2"><p className="text-xs text-slate-400">Address</p><p className="text-sm">{t.customerAddress}</p></div>}
                        </div>

                        {/* Issue */}
                        {t.issueDescription && (
                          <div className="bg-white rounded-xl p-3 border border-slate-200">
                            <p className="text-xs text-slate-400 mb-1">Issue Description</p>
                            <p className="text-sm text-slate-700">{t.issueDescription}</p>
                          </div>
                        )}

                        {/* Conversation Summary */}
                        {t.conversationSummary && (
                          <div className="bg-white rounded-xl p-3 border border-slate-200">
                            <p className="text-xs text-slate-400 mb-1">Conversation Summary</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{t.conversationSummary}</p>
                          </div>
                        )}

                        {/* Escalation Reason */}
                        {t.escalationReason && (
                          <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                            <p className="text-xs text-red-500 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Escalation Reason</p>
                            <p className="text-sm text-red-700">{t.escalationReason}</p>
                          </div>
                        )}

                        {/* Videos */}
                        {(t.customerVideoUrls.length > 0 || t.videosSentToCustomer.length > 0) && (
                          <div className="flex flex-wrap gap-4">
                            {t.videosSentToCustomer.length > 0 && (
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Videos Sent</p>
                                <div className="flex flex-wrap gap-2">
                                  {t.videosSentToCustomer.map((v, i) => (
                                    <a key={i} href={v} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs hover:bg-blue-100 transition">Video {i + 1}</a>
                                  ))}
                                </div>
                              </div>
                            )}
                            {t.customerVideoUrls.length > 0 && (
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Customer Videos</p>
                                <div className="flex flex-wrap gap-3">
                                  {t.customerVideoUrls.map((v, i) => {
                                    const url = akiaraAPI.getMediaUrl(v);
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
                          </div>
                        )}

                        {/* Send Message */}
                        <div className="flex gap-2">
                          <input
                            value={expandedTicket === t._id ? customMsg : ""}
                            onChange={(e) => setCustomMsg(e.target.value)}
                            placeholder="Send WhatsApp message to customer..."
                            className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-orange-300 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(t.phone)}
                          />
                          <button
                            onClick={() => handleSendMessage(t.phone)}
                            disabled={sendingMsg === t.phone || !customMsg.trim()}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-sm hover:shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                          >
                            {sendingMsg === t.phone ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
