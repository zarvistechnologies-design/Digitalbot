"use client";

import Sidebar from "@/components/Sidebar";
import { useWebSocket } from "@/components/hooks/use-websocket";
import { akiaraAPI } from "@/lib/api";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  Clock,
  Columns,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Grid,
  Image as ImageIcon,
  Instagram,
  Layers,
  LayoutGrid,
  Loader2,
  Menu,
  MessageCircle,
  MessageSquare,
  Package,
  Phone,
  Play,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShoppingBag,
  Sparkles,
  Ticket,
  User,
  Video,
  X
} from "lucide-react";
import Link from "next/link";
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";

// Meta Facebook SVG Icon
function FacebookIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface SocialLead {
  _id: string;
  platform: "instagram" | "facebook";
  senderId: string;
  senderUsername?: string;
  senderName?: string;
  profilePicUrl?: string;
  profileUrl?: string;
  threadId?: string;
  category: "influencer_collaboration" | "want_to_buy" | "product_complaint" | "general";
  phone: string | null;
  orderId: string | null;
  product: string | null;
  issueDescription: string;
  customerImageUrls: string[];
  customerVideoUrls: string[];
  ticketId?: {
    _id: string;
    status: string;
    priority: string;
  } | null;
  status: "new" | "pending_review" | "shortlisted" | "contacted" | "resolved" | "closed";
  notes?: string;
  conversationHistory: {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface StatsData {
  influencerCount: number;
  buyCount: number;
  complaintCount: number;
  totalCount: number;
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
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

function formatPhone(phone: string | null) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return phone;
}

function getLeadDisplayName(lead: SocialLead) {
  if (lead.senderName && lead.senderName.trim()) {
    return lead.senderName;
  }
  if (lead.senderUsername && lead.senderUsername.trim()) {
    return `@${lead.senderUsername}`;
  }
  return `${lead.platform === "instagram" ? "Instagram" : "Facebook"} User #${lead.senderId.slice(-6)}`;
}

function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  return parts[0].slice(0, 2).toUpperCase();
}

function getProfileLink(lead: SocialLead) {
  if (lead.profileUrl) return lead.profileUrl;
  if (lead.platform === "instagram" && lead.senderUsername) {
    return `https://instagram.com/${lead.senderUsername}`;
  }
  if (lead.platform === "facebook" && lead.threadId) {
    return `https://business.facebook.com/latest/inbox/all?asset_id=104084397682452&selected_item_id=${lead.threadId}`;
  }
  return `https://business.facebook.com/latest/inbox/all?asset_id=104084397682452`;
}

const statusBadgeStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  pending_review: "bg-amber-50 text-amber-700 border-amber-200",
  shortlisted: "bg-purple-50 text-purple-700 border-purple-200",
  contacted: "bg-cyan-50 text-cyan-700 border-cyan-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusLabels: Record<string, string> = {
  new: "New",
  pending_review: "Pending",
  shortlisted: "Shortlisted",
  contacted: "Contacted",
  resolved: "Resolved",
  closed: "Closed",
};

export default function AkiaraSocialPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "cards">("split");
  const [activeTab, setActiveTab] = useState<"influencer_collaboration" | "want_to_buy" | "product_complaint">("product_complaint");

  // Inquiries & Metrics state
  const [leads, setLeads] = useState<SocialLead[]>([]);
  const [stats, setStats] = useState<StatsData>({
    influencerCount: 0,
    buyCount: 0,
    complaintCount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Selected lead for detail view
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Lightbox modal for customer photos and videos
  const [previewMedia, setPreviewMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);

  // WebSocket for real-time live events from Meta Graph API
  const { connected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === "akiara_social_lead" || message.type === "ticket_created") {
        fetchStats();
        fetchLeads(false);
      }
    },
  });

  const fetchStats = async () => {
    try {
      const res = await akiaraAPI.getSocialStats();
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching social stats:", err);
    }
  };

  const fetchLeads = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const params: any = {
          category: activeTab,
          limit: 100,
        };
        if (platformFilter !== "all") params.platform = platformFilter;
        if (statusFilter !== "all") params.status = statusFilter;
        if (deferredSearch.trim()) params.search = deferredSearch.trim();

        const res = await akiaraAPI.getSocialLeads(params);
        if (res.data?.success) {
          const fetched: SocialLead[] = res.data.data || [];
          setLeads(fetched);
          if (fetched.length > 0) {
            setSelectedLeadId((prevId) => {
              if (prevId && fetched.some((l) => l._id === prevId)) return prevId;
              return fetched[0]._id;
            });
          } else {
            setSelectedLeadId(null);
          }
        }
      } catch (err) {
        console.error("Error fetching social leads:", err);
      } finally {
        if (showLoading) setLoading(false);
        setRefreshing(false);
      }
    },
    [activeTab, platformFilter, statusFilter, deferredSearch]
  );

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLeads(true);
  }, [fetchLeads]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
    fetchLeads(false);
  };

  const selectedLead = useMemo(() => {
    return leads.find((l) => l._id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus as any } : l))
      );
      await akiaraAPI.updateSocialLead(leadId, { status: newStatus });
      fetchStats();
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchLeads(false);
    }
  };

  const [syncingProfileId, setSyncingProfileId] = useState<string | null>(null);

  const handleSyncProfile = async (leadId: string) => {
    setSyncingProfileId(leadId);
    try {
      const res = await akiaraAPI.syncSocialProfile(leadId);
      if (res.data?.success && res.data?.data) {
        const updated = res.data.data;
        setLeads((prev) => prev.map((l) => (l._id === leadId ? { ...l, ...updated } : l)));
      }
    } catch (err) {
      console.error("Failed to sync profile:", err);
    } finally {
      setSyncingProfileId(null);
    }
  };

  useEffect(() => {
    if (selectedLead && !selectedLead.senderName && !syncingProfileId) {
      handleSyncProfile(selectedLead._id);
    }
  }, [selectedLead?._id, selectedLead?.senderName]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSendManualReply = async () => {
    if (!selectedLead || !replyText.trim()) return;
    setSendingReply(true);
    try {
      await akiaraAPI.sendSocialMessage({
        leadId: selectedLead._id,
        text: replyText.trim(),
      });
      const newEntry = {
        role: "assistant" as const,
        content: `[Support Agent Reply]: ${replyText.trim()}`,
        timestamp: new Date().toISOString(),
      };
      setLeads((prev) =>
        prev.map((l) =>
          l._id === selectedLead._id
            ? { ...l, conversationHistory: [...l.conversationHistory, newEntry] }
            : l
        )
      );
      setReplyText("");
    } catch (err) {
      console.error("Failed to send social reply:", err);
      alert("Failed to send message via Meta Graph API. Please ensure Meta Page Token is active.");
    } finally {
      setSendingReply(false);
    }
  };

  const quickReplies = useMemo(() => {
    if (activeTab === "product_complaint") {
      return [
        "Please share your 13-digit Order ID so we can verify your purchase.",
        "Could you please share a short video demonstrating the issue?",
        "Our support team has logged your complaint ticket and will contact you within 24 hours.",
      ];
    }
    if (activeTab === "want_to_buy") {
      return [
        "You can explore all genuine Akiara appliances at https://akiara.in/ !",
        "Which product are you interested in? We have Mini, Yume, Duo, and Soup Maker.",
        "We offer free shipping across India with cash on delivery available!",
      ];
    }
    return [
      "Thank you for reaching out! Our PR team will review your profile within 48 hours.",
      "Could you please share your media kit and shipping address?",
    ];
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-xl shadow-md border border-slate-200/80 text-slate-700"
        aria-label="Toggle navigation"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-64 h-full" onClick={(e) => e.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Main Workspace */}
      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-7 pt-16 lg:pt-6 min-w-0">
        <div className="max-w-7xl mx-auto space-y-4">

          {/* ===== 1. COMPACT HEADER SECTION ===== */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm shadow-orange-200 text-white flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Social Inquiries
                  </h1>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] font-semibold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Meta Direct
                  </span>
                  {connected && (
                    <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-[11px] font-semibold text-blue-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                      Live
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated routing for Instagram &amp; Facebook DMs, Comments &amp; Tickets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={() => setViewMode("split")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "split"
                      ? "bg-orange-500 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title="Queue Split View"
                >
                  <Columns className="w-3.5 h-3.5" />
                  Split View
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    viewMode === "cards"
                      ? "bg-orange-500 text-white shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                  title="Compact Cards View"
                >
                  <Grid className="w-3.5 h-3.5" />
                  Cards
                </button>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-8 w-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600"
                title="Refresh inquiries"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* ===== 2. SLEEK, COMPACT KPI STATS CARDS ===== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              {
                title: "Total Inquiries",
                value: stats.totalCount,
                color: "bg-slate-500",
                icon: <MessageSquare className="w-4 h-4 text-slate-400" />,
              },
              {
                title: "Influencer Collabs",
                value: stats.influencerCount,
                color: "bg-purple-500",
                icon: <Sparkles className="w-4 h-4 text-purple-400" />,
              },
              {
                title: "I Want to Buy",
                value: stats.buyCount,
                color: "bg-blue-500",
                icon: <ShoppingBag className="w-4 h-4 text-blue-400" />,
              },
              {
                title: "Complaints & Tickets",
                value: stats.complaintCount,
                color: "bg-orange-500",
                icon: <Ticket className="w-4 h-4 text-orange-400" />,
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-xl border border-slate-200/80 p-3 flex items-center gap-3 shadow-2xs"
              >
                <div className={`w-1 h-8 rounded-full ${s.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {s.title}
                  </p>
                  <p className="text-xl font-bold text-slate-900 leading-tight">
                    {s.value}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex-shrink-0">
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* ===== 3. COMPACT CATEGORY WORKFLOW TABS ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Tab 1: Influencer Collaboration */}
            <button
              onClick={() => setActiveTab("influencer_collaboration")}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                activeTab === "influencer_collaboration"
                  ? "bg-purple-50/80 border-purple-300 ring-1 ring-purple-400/30 shadow-2xs"
                  : "bg-white border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeTab === "influencer_collaboration"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-50 text-purple-600 border border-purple-100"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">1. Influencer Collabs</p>
                  <p className="text-[10px] text-slate-400 truncate">Auto-reviews &amp; shortlists</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  activeTab === "influencer_collaboration"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {stats.influencerCount}
              </span>
            </button>

            {/* Tab 2: I Want to Buy */}
            <button
              onClick={() => setActiveTab("want_to_buy")}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                activeTab === "want_to_buy"
                  ? "bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/30 shadow-2xs"
                  : "bg-white border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeTab === "want_to_buy"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">2. I Want to Buy</p>
                  <p className="text-[10px] text-slate-400 truncate">akiara.in product links</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  activeTab === "want_to_buy"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {stats.buyCount}
              </span>
            </button>

            {/* Tab 3: Complaints & Tickets */}
            <button
              onClick={() => setActiveTab("product_complaint")}
              className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 ${
                activeTab === "product_complaint"
                  ? "bg-orange-50/80 border-orange-300 ring-1 ring-orange-400/30 shadow-2xs"
                  : "bg-white border-slate-200/80 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activeTab === "product_complaint"
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}
                >
                  <Ticket className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">3. Support &amp; Complaints</p>
                  <p className="text-[10px] text-slate-400 truncate">Troubleshoot, Media &amp; Tickets</p>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  activeTab === "product_complaint"
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {stats.complaintCount}
              </span>
            </button>
          </div>

          {/* ===== 4. COMPACT SEARCH & FILTER BAR ===== */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-2.5 shadow-2xs flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, phone, order ID, or text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setPlatformFilter("all")}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                    platformFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPlatformFilter("instagram")}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                    platformFilter === "instagram" ? "bg-pink-500 text-white" : "text-slate-500"
                  }`}
                >
                  <Instagram className="w-3 h-3" /> IG
                </button>
                <button
                  onClick={() => setPlatformFilter("facebook")}
                  className={`px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1 transition ${
                    platformFilter === "facebook" ? "bg-[#1877f2] text-white" : "text-slate-500"
                  }`}
                >
                  <FacebookIcon className="w-3 h-3" /> FB
                </button>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-medium text-slate-600 focus:outline-none focus:border-orange-400"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="pending_review">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="contacted">Contacted</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <span className="text-[11px] font-medium text-slate-400 px-1 tabular-nums">
                {leads.length} result{leads.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* ===== 5. WORKSPACE: COMPACT SPLIT QUEUE VIEW (Default) ===== */}
          {viewMode === "split" && (
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
              
              {/* --- LEFT FEED PANE (lg:col-span-5) --- */}
              <div className="lg:col-span-5 border-r border-slate-200 flex flex-col min-h-[500px] max-h-[700px]">
                <div className="p-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    Inbound Queue
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {leads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {loading ? (
                    <div className="py-20 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto mb-2" />
                      <p className="text-xs">Loading queue...</p>
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="py-20 text-center px-4">
                      <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-600">No inquiries found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Incoming DMs and comments will appear here.</p>
                    </div>
                  ) : (
                    leads.map((lead) => {
                      const isSelected = selectedLeadId === lead._id;
                      const lastMsg = lead.conversationHistory[lead.conversationHistory.length - 1];
                      const photoCount = lead.customerImageUrls?.length || 0;
                      const videoCount = lead.customerVideoUrls?.length || 0;

                      return (
                        <div
                          key={lead._id}
                          onClick={() => setSelectedLeadId(lead._id)}
                          className={`p-3 cursor-pointer transition-all border-l-[3px] ${
                            isSelected
                              ? "bg-orange-50/70 border-l-orange-500"
                              : "bg-white hover:bg-slate-50/80 border-l-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {lead.platform === "instagram" ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white flex-shrink-0">
                                  <Instagram className="w-2.5 h-2.5" /> IG
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1877f2] text-white flex-shrink-0">
                                  <FacebookIcon className="w-2.5 h-2.5" /> FB
                                </span>
                              )}
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {getLeadDisplayName(lead)}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 flex-shrink-0">
                              {timeAgo(lead.createdAt)}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 line-clamp-1 mb-1.5">
                            {lastMsg ? lastMsg.content : "Inquiry opened"}
                          </p>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                statusBadgeStyles[lead.status] || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {statusLabels[lead.status] || lead.status}
                            </span>

                            {lead.phone && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                                <Phone className="w-2 h-2" />
                                {lead.phone}
                              </span>
                            )}

                            {lead.orderId && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">
                                <Package className="w-2 h-2" />
                                #{lead.orderId}
                              </span>
                            )}

                            {(photoCount > 0 || videoCount > 0) && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded">
                                <ImageIcon className="w-2 h-2" />
                                {photoCount + videoCount} proof{photoCount + videoCount > 1 ? "s" : ""}
                              </span>
                            )}

                            {lead.ticketId && (
                              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded ml-auto">
                                <Ticket className="w-2 h-2 text-orange-500" />
                                #{lead.ticketId._id.slice(-6).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* --- RIGHT COMMAND PANE (lg:col-span-7) --- */}
              <div className="lg:col-span-7 flex flex-col min-h-[500px] max-h-[700px] bg-slate-50/50">
                {!selectedLead ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center mx-auto mb-3 text-orange-500">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Select an inquiry</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                      Choose any message from the left queue to inspect proofs, update status, and reply.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative flex-shrink-0">
                          {selectedLead.profilePicUrl ? (
                            <img
                              src={selectedLead.profilePicUrl}
                              alt={getLeadDisplayName(selectedLead)}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                            />
                          ) : (
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                                selectedLead.platform === "instagram"
                                  ? "bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600"
                                  : "bg-[#1877f2]"
                              }`}
                            >
                              {getInitials(selectedLead.senderName || selectedLead.senderUsername)}
                            </div>
                          )}
                          <span
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white border border-white ${
                              selectedLead.platform === "instagram" ? "bg-pink-600" : "bg-[#1877f2]"
                            }`}
                          >
                            {selectedLead.platform === "instagram" ? (
                              <Instagram className="w-2 h-2" />
                            ) : (
                              <FacebookIcon className="w-2 h-2" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="text-xs font-bold text-slate-900 truncate">
                              {getLeadDisplayName(selectedLead)}
                            </h2>
                            {selectedLead.senderUsername && (
                              <span className="text-[11px] font-semibold text-slate-500">
                                @{selectedLead.senderUsername}
                              </span>
                            )}
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1 py-0.2 rounded select-all">
                              ID: {selectedLead.senderId.slice(-6)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 flex-wrap">
                            <span className="capitalize font-medium text-slate-500">
                              {selectedLead.platform} · {selectedLead.category.replace("_", " ")}
                            </span>
                            <a
                              href={getProfileLink(selectedLead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-0.5 font-bold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                              {selectedLead.platform === "instagram" ? "IG Profile" : "Meta Suite"}
                            </a>
                            <button
                              onClick={() => handleSyncProfile(selectedLead._id)}
                              disabled={syncingProfileId === selectedLead._id}
                              className="inline-flex items-center gap-0.5 text-slate-500 hover:text-orange-600 px-1 py-0.2 rounded hover:bg-slate-100 transition"
                              title="Sync Name & Profile"
                            >
                              <RefreshCw className={`w-2.5 h-2.5 ${syncingProfileId === selectedLead._id ? "animate-spin text-orange-500" : ""}`} />
                              <span>{syncingProfileId === selectedLead._id ? "Syncing..." : "Sync"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <select
                          value={selectedLead.status}
                          onChange={(e) => handleUpdateStatus(selectedLead._id, e.target.value)}
                          className="h-7 px-2 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="new">Status: New</option>
                          <option value="pending_review">Status: Review</option>
                          <option value="shortlisted">Status: Shortlist</option>
                          <option value="contacted">Status: Contacted</option>
                          <option value="resolved">Status: Resolved</option>
                          <option value="closed">Status: Closed</option>
                        </select>

                        {selectedLead.category === "influencer_collaboration" && selectedLead.status !== "shortlisted" && (
                          <button
                            onClick={() => handleUpdateStatus(selectedLead._id, "shortlisted")}
                            className="h-7 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" /> Shortlist
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="p-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center gap-2 text-xs flex-shrink-0">
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Phone:</span>
                        {selectedLead.phone ? (
                          <span className="font-bold text-slate-800">{formatPhone(selectedLead.phone)}</span>
                        ) : (
                          <span className="text-amber-600 italic">None</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                        <Package className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">Order:</span>
                        {selectedLead.orderId ? (
                          <span className="font-mono font-bold text-slate-800">{selectedLead.orderId}</span>
                        ) : (
                          <span className="text-amber-600 italic">None</span>
                        )}
                      </div>

                      {selectedLead.ticketId && (
                        <Link
                          href={`/dashboard/akiara-tickets?search=${selectedLead.phone || selectedLead.orderId || ""}`}
                          className="inline-flex items-center gap-1 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2 py-0.5 rounded text-[11px] text-orange-800 font-bold transition ml-auto"
                        >
                          <Ticket className="w-3 h-3 text-orange-600" />
                          <span>Ticket #{selectedLead.ticketId._id.slice(-6).toUpperCase()}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>

                    {/* Media proofs strip */}
                    {(selectedLead.customerImageUrls?.length > 0 || selectedLead.customerVideoUrls?.length > 0) && (
                      <div className="p-2.5 bg-slate-100/70 border-b border-slate-200 flex-shrink-0">
                        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                            <ImageIcon className="w-3 h-3 text-orange-500" /> Proofs:
                          </span>
                          {selectedLead.customerImageUrls.map((imgUrl, i) => (
                            <button
                              key={`img-${i}`}
                              onClick={() => setPreviewMedia({ type: "image", url: akiaraAPI.getMediaUrl(imgUrl) })}
                              className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 bg-white relative flex-shrink-0 group hover:border-orange-500 transition"
                            >
                              <img
                                src={akiaraAPI.getMediaUrl(imgUrl)}
                                alt="Proof"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </button>
                          ))}
                          {selectedLead.customerVideoUrls.map((vidUrl, i) => (
                            <button
                              key={`vid-${i}`}
                              onClick={() => setPreviewMedia({ type: "video", url: akiaraAPI.getMediaUrl(vidUrl) })}
                              className="w-12 h-12 rounded-lg overflow-hidden border border-purple-200 bg-purple-900/10 relative flex-shrink-0 group flex items-center justify-center hover:border-purple-500 transition"
                            >
                              <Video className="w-5 h-5 text-purple-600" />
                              <div className="absolute inset-0 bg-purple-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                      {selectedLead.conversationHistory.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-xs">
                          No messages recorded.
                        </div>
                      ) : (
                        selectedLead.conversationHistory.map((msg, index) => {
                          const isUser = msg.role === "user";
                          return (
                            <div
                              key={index}
                              className={`flex flex-col ${isUser ? "items-start" : "items-end"}`}
                            >
                              <div className="flex items-center gap-1 mb-0.5 px-1">
                                <span className="text-[9px] font-bold text-slate-400">
                                  {isUser ? "Customer" : "Devika AI"}
                                </span>
                                <span className="text-[9px] text-slate-400">
                                  · {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              </div>
                              <div
                                className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                                  isUser
                                    ? "bg-white text-slate-800 rounded-tl-sm border border-slate-200"
                                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-tr-sm shadow-2xs"
                                }`}
                              >
                                {(() => {
                                  const imgMatch = msg.content.match(/\[Customer sent (?:an? )?image: ([^\]\s]+)\]/i);
                                  if (imgMatch) {
                                    const imgUrl = akiaraAPI.getMediaUrl(imgMatch[1]);
                                    const remainingText = msg.content.replace(imgMatch[0], '').trim();
                                    return (
                                      <div className="space-y-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setPreviewMedia({ type: "image", url: imgUrl })}
                                          className="block rounded-lg overflow-hidden border border-slate-200/80 hover:border-orange-500 transition group relative max-w-[220px]"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img src={imgUrl} alt="Customer upload" className="w-full max-h-48 object-cover rounded-lg group-hover:opacity-95 transition" />
                                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                                            <Eye className="w-4 h-4 text-white" />
                                          </div>
                                        </button>
                                        {remainingText && <p className="whitespace-pre-wrap">{remainingText}</p>}
                                      </div>
                                    );
                                  }
                                  return <p className="whitespace-pre-wrap">{msg.content}</p>;
                                })()}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Response Pills */}
                    <div className="p-2 bg-slate-100/70 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto flex-shrink-0">
                      {quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => setReplyText(reply)}
                          className="px-2 py-0.5 bg-white hover:bg-orange-50 border border-slate-200 rounded text-[10px] text-slate-600 font-medium whitespace-nowrap transition"
                        >
                          {reply.slice(0, 36)}...
                        </button>
                      ))}
                    </div>

                    {/* Reply Input Bar */}
                    <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0">
                      <input
                        type="text"
                        placeholder={`Reply to ${selectedLead.platform === "instagram" ? "Instagram DM" : "Facebook"}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendManualReply();
                          }
                        }}
                        className="flex-1 h-9 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white"
                      />
                      <button
                        onClick={handleSendManualReply}
                        disabled={sendingReply || !replyText.trim()}
                        className="h-9 px-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        {sendingReply ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ===== 6. WORKSPACE: COMPACT CARDS VIEW (Alternative View) ===== */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {loading ? (
                <div className="col-span-full py-20 text-center text-slate-400">
                  <Loader2 className="w-7 h-7 animate-spin text-orange-500 mx-auto mb-2" />
                  <p className="text-xs">Loading inquiries...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-white rounded-xl border border-slate-200 p-6">
                  <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <h3 className="text-xs font-bold text-slate-700">No inquiries found</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Try switching categories or clearing search.</p>
                </div>
              ) : (
                leads.map((lead) => {
                  const lastMsg = lead.conversationHistory[lead.conversationHistory.length - 1];
                  const photoCount = lead.customerImageUrls?.length || 0;
                  const videoCount = lead.customerVideoUrls?.length || 0;

                  return (
                    <div
                      key={lead._id}
                      className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 shadow-2xs transition p-3.5 flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {lead.platform === "instagram" ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white flex-shrink-0">
                                <Instagram className="w-2.5 h-2.5" /> IG
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#1877f2] text-white flex-shrink-0">
                                <FacebookIcon className="w-2.5 h-2.5" /> FB
                              </span>
                            )}
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {getLeadDisplayName(lead)}
                            </span>
                            {lead.senderUsername && (
                              <span className="text-[10px] text-slate-400 truncate">
                                @{lead.senderUsername}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 flex-shrink-0">
                            {timeAgo(lead.createdAt)}
                          </span>
                        </div>

                        {/* Snippet */}
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 border border-slate-100 p-2 rounded-lg mb-2">
                          {lastMsg ? lastMsg.content : "Inquiry opened"}
                        </p>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          <span
                            className={`font-bold px-1.5 py-0.2 rounded border ${
                              statusBadgeStyles[lead.status] || "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {statusLabels[lead.status] || lead.status}
                          </span>
                          {lead.phone && (
                            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                              <Phone className="w-2 h-2" /> {lead.phone}
                            </span>
                          )}
                          {lead.orderId && (
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-1 py-0.2 rounded">
                              <Package className="w-2 h-2" /> #{lead.orderId}
                            </span>
                          )}
                          {(photoCount > 0 || videoCount > 0) && (
                            <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-0.2 rounded">
                              <ImageIcon className="w-2 h-2" /> {photoCount + videoCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-100">
                        {lead.ticketId ? (
                          <Link
                            href={`/dashboard/akiara-tickets?search=${lead.phone || lead.orderId || ""}`}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700"
                          >
                            <Ticket className="w-3 h-3" />
                            #{lead.ticketId._id.slice(-6).toUpperCase()}
                          </Link>
                        ) : (
                          <span className="text-[10px] text-slate-400 capitalize">
                            {lead.category.replace("_", " ")}
                          </span>
                        )}

                        <button
                          onClick={() => {
                            setSelectedLeadId(lead._id);
                            setViewMode("split");
                          }}
                          className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </main>

      {/* ===== 7. LIGHTBOX MODAL (Customer Images & Videos) ===== */}
      {previewMedia && (
        <div
          onClick={() => setPreviewMedia(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl max-h-[85vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex flex-col relative shadow-2xl"
          >
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              aria-label="Close media preview"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-3 flex items-center justify-center">
              {previewMedia.type === "image" ? (
                <img
                  src={previewMedia.url}
                  alt="Customer Product Proof"
                  className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <video
                  src={previewMedia.url}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-auto rounded-xl shadow-2xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
