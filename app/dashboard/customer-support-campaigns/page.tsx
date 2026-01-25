"use client";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

const API_BASE = "https://digital-api-tef8.onrender.com/api";

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

type Campaign = {
  _id: string;
  name: string;
  description?: string;
  campaignType: "rent-reminder" | "payment-reminder" | "appointment-reminder" | "survey" | "notification" | "custom";
  status: "draft" | "scheduled" | "active" | "paused" | "completed" | "cancelled";
  targetAudience?: string;
  totalContacts: number;
  pending: number;
  calling: number;
  completed: number;
  failed: number;
  noAnswer: number;
  millisAgentId: string;
  fromPhoneNumber?: string;
  callSettings?: {
    maxAttempts?: number;
    retryDelayMinutes?: number;
    callHoursStart?: number;
    callHoursEnd?: number;
  };
  performance?: {
    avgCallDuration?: number;
    successRate?: number;
    totalCallDuration?: number;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
};

type Agent = {
  id: string;
  name: string;
};

type FilterStatus = "all" | "draft" | "active" | "paused" | "completed" | "cancelled";

// Icons
const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const UploadIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default function CustomerSupportCampaignsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Create campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    campaignType: "rent-reminder" as Campaign["campaignType"],
    millisAgentId: "",
    targetAudience: "",
  });
  const [uploadedContacts, setUploadedContacts] = useState<any[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    loadAgents();
  }, []);

  // Auto-refresh when there are active campaigns (every 5 seconds)
  useEffect(() => {
    const hasActiveCampaign = campaigns.some(c => c.status === 'active');
    if (hasActiveCampaign) {
      const interval = setInterval(() => {
        fetchCampaigns();
      }, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [campaigns]);

  const loadAgents = () => {
    const stored = localStorage.getItem("millis_agents");
    if (stored) {
      setAgents(JSON.parse(stored));
    }
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data.campaigns || []);
      } else {
        setError(data.error || "Failed to fetch campaigns");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFile(file);
    setParsing(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE}/customer-campaigns/parse-excel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedContacts(data.data.contacts || []);
      } else {
        alert(data.error || "Failed to parse file");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setParsing(false);
    }
  };

  const createCampaign = async () => {
    if (!newCampaign.name || !newCampaign.millisAgentId) {
      alert("Please enter campaign name and select an AI Agent");
      return;
    }
    if (uploadedContacts.length === 0) {
      alert("Please upload a file with contacts");
      return;
    }
    try {
      setActionLoading("create");
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCampaign,
          contacts: uploadedContacts,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowCreateModal(false);
        setNewCampaign({ name: "", description: "", campaignType: "rent-reminder", millisAgentId: "", targetAudience: "" });
        setUploadedContacts([]);
        setUploadFile(null);
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to create campaign");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const startCampaign = async (id: string) => {
    try {
      setActionLoading(id);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns/${id}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to start campaign");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const pauseCampaign = async (id: string) => {
    try {
      setActionLoading(id);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns/${id}/pause`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to pause campaign");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const resumeCampaign = async (id: string) => {
    try {
      setActionLoading(id);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns/${id}/resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to resume campaign");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      setActionLoading(id);
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/customer-campaigns/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchCampaigns();
      } else {
        alert(data.error || "Failed to delete campaign");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-300";
      case "paused": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-300";
      case "cancelled": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-purple-100 text-purple-700 border-purple-300";
    }
  };

  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case "rent-reminder": return "🏠 Rent Reminder";
      case "payment-reminder": return "💰 Payment Reminder";
      case "appointment-reminder": return "📅 Appointment Reminder";
      case "survey": return "📋 Survey";
      case "notification": return "🔔 Notification";
      default: return "📞 Custom";
    }
  };

  const filteredCampaigns = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  // Stats
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    totalContacts: campaigns.reduce((sum, c) => sum + c.totalContacts, 0),
    completed: campaigns.reduce((sum, c) => sum + c.completed, 0),
    pending: campaigns.reduce((sum, c) => sum + c.pending, 0),
    failed: campaigns.reduce((sum, c) => sum + c.failed, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-purple-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-purple-100 transition-colors">
            <MenuIcon />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Support Campaigns
          </h1>
          <div className="w-10" />
        </div>

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Support Campaigns</h1>
                <p className="text-gray-600 mt-1">Manage automated calling campaigns for customer outreach</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchCampaigns}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <RefreshIcon />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
                >
                  <PlusIcon />
                  New Campaign
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
              <p className="text-sm text-gray-500">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalContacts}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-100">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.pending}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(["all", "draft", "active", "paused", "completed", "cancelled"] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  filter === status
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-purple-50 border border-purple-100"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Campaigns List */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">{error}</div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-purple-100">
              <div className="text-6xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first customer support campaign to get started</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCampaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border transition-shadow ${
                    campaign.status === 'active' 
                      ? 'border-green-300 ring-2 ring-green-100' 
                      : 'border-purple-100 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`}>
                          {campaign.status === 'active' && (
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                          )}
                          {campaign.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>{getCampaignTypeLabel(campaign.campaignType)}</span>
                        <span>•</span>
                        <span>{campaign.totalContacts} contacts</span>
                        <span>•</span>
                        <span className="text-green-600">{campaign.completed} completed</span>
                        <span>•</span>
                        <span className="text-yellow-600">{campaign.pending} pending</span>
                        {campaign.failed > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-red-600">{campaign.failed} failed</span>
                          </>
                        )}
                        {campaign.performance?.successRate && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">{campaign.performance.successRate.toFixed(1)}% success</span>
                          </>
                        )}
                      </div>
                      {/* Progress bar for active campaigns */}
                      {campaign.status === 'active' && campaign.totalContacts > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Progress: {campaign.completed + campaign.failed} / {campaign.totalContacts}</span>
                            <span>{Math.round(((campaign.completed + campaign.failed) / campaign.totalContacts) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                              style={{ width: `${((campaign.completed + campaign.failed) / campaign.totalContacts) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {campaign.status === "draft" && (
                        <button
                          onClick={() => startCampaign(campaign._id)}
                          disabled={actionLoading === campaign._id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <PlayIcon />
                          Start
                        </button>
                      )}
                      {campaign.status === "active" && (
                        <button
                          onClick={() => pauseCampaign(campaign._id)}
                          disabled={actionLoading === campaign._id}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-colors disabled:opacity-50"
                        >
                          <PauseIcon />
                          Pause
                        </button>
                      )}
                      {campaign.status === "paused" && (
                        <button
                          onClick={() => resumeCampaign(campaign._id)}
                          disabled={actionLoading === campaign._id}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          <PlayIcon />
                          Resume
                        </button>
                      )}
                      <button
                        onClick={() => deleteCampaign(campaign._id)}
                        disabled={actionLoading === campaign._id || campaign.status === 'active'}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                        title={campaign.status === 'active' ? 'Pause campaign first' : 'Delete campaign'}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create New Campaign</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., January Rent Reminders"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={2}
                  placeholder="Brief description of this campaign..."
                />
              </div>

              {/* Campaign Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type *</label>
                <select
                  value={newCampaign.campaignType}
                  onChange={(e) => setNewCampaign({ ...newCampaign, campaignType: e.target.value as Campaign["campaignType"] })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="rent-reminder">🏠 Rent Reminder</option>
                  <option value="payment-reminder">💰 Payment Reminder</option>
                  <option value="appointment-reminder">📅 Appointment Reminder</option>
                  <option value="survey">📋 Survey</option>
                  <option value="notification">🔔 Notification</option>
                  <option value="custom">📞 Custom</option>
                </select>
              </div>

              {/* AI Agent Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">AI Agent *</label>
                {agents.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800 text-sm">
                      No AI agents configured. Please go to{" "}
                      <a href="/dashboard/agents" className="text-purple-600 underline">
                        AI Agents
                      </a>{" "}
                      page to add your Millis AI agent ID.
                    </p>
                  </div>
                ) : (
                  <select
                    value={newCampaign.millisAgentId}
                    onChange={(e) => setNewCampaign({ ...newCampaign, millisAgentId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select an AI Agent</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.id.substring(0, 8)}...)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Contacts *</label>
                <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <UploadIcon />
                      <p className="mt-2 text-sm text-gray-600">
                        {uploadFile ? uploadFile.name : "Click to upload Excel or CSV file"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Columns: Name, Phone, Flat, Payment Due</p>
                    </div>
                  </label>
                </div>
                {parsing && <p className="text-purple-600 text-sm mt-2">Parsing file...</p>}
                {uploadedContacts.length > 0 && (
                  <p className="text-green-600 text-sm mt-2">✓ {uploadedContacts.length} contacts ready</p>
                )}
              </div>

              {/* Preview */}
              {uploadedContacts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview (first 5)</label>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Phone</th>
                          <th className="px-4 py-2 text-left">Flat</th>
                          <th className="px-4 py-2 text-right">Amount Due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {uploadedContacts.slice(0, 5).map((c, i) => (
                          <tr key={i} className="border-t border-gray-200">
                            <td className="px-4 py-2">{c.name}</td>
                            <td className="px-4 py-2">{c.phone}</td>
                            <td className="px-4 py-2">{c.flatNumber || "-"}</td>
                            <td className="px-4 py-2 text-right">₹{c.paymentDue || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setUploadedContacts([]);
                  setUploadFile(null);
                }}
                className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createCampaign}
                disabled={actionLoading === "create"}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {actionLoading === "create" ? "Creating..." : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
