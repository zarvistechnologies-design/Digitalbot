"use client";
import Sidebar from "@/components/Sidebar";
import { promptsAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
    AlertCircle,
    Bot,
    Check,
    Edit,
    Menu,
    MessageSquare,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X
} from "lucide-react";
import { useState } from "react";

// ==================== TYPES ====================
interface Prompt {
  _id: string;
  assignedPhoneNumber: string;
  hospitalName: string;
  hospitalAddress?: string;
  hospitalDescription?: string;
  systemPrompt: string;
  greetingMessage: string;
  closingMessage: string;
  workingHours: { start: string; end: string };
  workingDays: number[];
  voiceConfig: {
    language: string;
    voiceId?: string;
    speed: number;
    pitch: number;
  };
  features: {
    appointmentBooking: boolean;
    doctorAvailabilityCheck: boolean;
    appointmentCancellation: boolean;
    appointmentRescheduling: boolean;
    emergencyHandling: boolean;
  };
  notifications: {
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    emailEnabled: boolean;
    notifyDoctorOnBooking: boolean;
    notifyPatientOnBooking: boolean;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromptFormData {
  hospitalName: string;
  hospitalAddress: string;
  hospitalDescription: string;
  systemPrompt: string;
  greetingMessage: string;
  closingMessage: string;
  workingHours: { start: string; end: string };
  workingDays: number[];
  voiceConfig: {
    language: string;
    speed: number;
    pitch: number;
  };
  features: {
    appointmentBooking: boolean;
    doctorAvailabilityCheck: boolean;
    appointmentCancellation: boolean;
    appointmentRescheduling: boolean;
    emergencyHandling: boolean;
  };
  notifications: {
    smsEnabled: boolean;
    whatsappEnabled: boolean;
    emailEnabled: boolean;
    notifyDoctorOnBooking: boolean;
    notifyPatientOnBooking: boolean;
  };
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const LANGUAGES = [
  { value: "en-IN", label: "English (India)" },
  { value: "en-US", label: "English (US)" },
  { value: "hi-IN", label: "Hindi" },
  { value: "ta-IN", label: "Tamil" },
  { value: "te-IN", label: "Telugu" },
  { value: "kn-IN", label: "Kannada" },
  { value: "ml-IN", label: "Malayalam" },
  { value: "mr-IN", label: "Marathi" },
];

const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI receptionist for our hospital. Your role is to:
1. Greet patients warmly and professionally
2. Help them book, reschedule, or cancel appointments
3. Provide information about our doctors and their availability
4. Handle emergency situations appropriately
5. Collect patient information accurately

Always be polite, patient, and helpful. If you're unsure about something, ask clarifying questions.`;

const initialFormData: PromptFormData = {
  hospitalName: "",
  hospitalAddress: "",
  hospitalDescription: "",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  greetingMessage: "Hello! Welcome to our clinic. How can I help you today?",
  closingMessage: "Thank you for calling. Have a great day!",
  workingHours: { start: "09:00", end: "18:00" },
  workingDays: [1, 2, 3, 4, 5, 6],
  voiceConfig: {
    language: "en-IN",
    speed: 1.0,
    pitch: 1.0,
  },
  features: {
    appointmentBooking: true,
    doctorAvailabilityCheck: true,
    appointmentCancellation: true,
    appointmentRescheduling: true,
    emergencyHandling: true,
  },
  notifications: {
    smsEnabled: true,
    whatsappEnabled: true,
    emailEnabled: false,
    notifyDoctorOnBooking: true,
    notifyPatientOnBooking: true,
  },
};

// ==================== MAIN COMPONENT ====================
export default function PromptsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState<PromptFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "voice" | "features" | "notifications">("basic");

  const {
    data: prompts = [],
    isPending: loading,
    error: promptsError,
    refetch: fetchPrompts,
  } = useQuery<Prompt[], Error>({
    queryKey: ["prompts"],
    queryFn: async () => {
      const response = await promptsAPI.getAll();
      return response.data.prompts || [];
    },
  });
  const error = promptsError?.message || null;

  // Filter prompts
  const filteredPrompts = prompts.filter(
    (p) =>
      p.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedPhoneNumber.includes(searchQuery)
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingPrompt) {
        await promptsAPI.update(editingPrompt._id, formData);
      } else {
        await promptsAPI.create(formData);
      }
      setShowModal(false);
      setEditingPrompt(null);
      setFormData(initialFormData);
      fetchPrompts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save prompt";
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async (prompt: Prompt) => {
    if (!confirm(`Are you sure you want to delete the prompt for ${prompt.hospitalName}?`)) return;

    try {
      await promptsAPI.delete(prompt._id);
      fetchPrompts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete prompt";
      alert(errorMessage);
    }
  };

  // Handle edit
  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      hospitalName: prompt.hospitalName,
      hospitalAddress: prompt.hospitalAddress || "",
      hospitalDescription: prompt.hospitalDescription || "",
      systemPrompt: prompt.systemPrompt,
      greetingMessage: prompt.greetingMessage,
      closingMessage: prompt.closingMessage,
      workingHours: prompt.workingHours,
      workingDays: prompt.workingDays,
      voiceConfig: prompt.voiceConfig,
      features: prompt.features,
      notifications: prompt.notifications,
    });
    setShowModal(true);
  };

  // Toggle working day
  const toggleWorkingDay = (day: number) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort(),
    }));
  };

  // Feature toggle
  const FeatureToggle = ({
    label,
    checked,
    onChange,
  }: {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <label className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
      <span className="text-xs sm:text-sm font-semibold text-slate-800">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-orange-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );

  const activeCount = prompts.filter((p) => p.active).length;
  const bookingCount = prompts.filter((p) => p.features?.appointmentBooking).length;
  const whatsappCount = prompts.filter((p) => p.notifications?.whatsappEnabled).length;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      {/* Mobile Menu Button */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-700"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 pt-20 lg:pt-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Compact Header */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: Identity */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-200/80 text-orange-700">
                  <Bot className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700">
                      AI Voice Agent
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Logic
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 truncate">
                    AI Prompt Configuration
                  </h1>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    System prompts, multilingual voice tuning &amp; automated hospital workflows
                  </p>
                </div>
              </div>

              {/* Center: Search & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:max-w-md">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hospital or phone..."
                    className="w-full h-9 pl-9 pr-8 rounded-lg border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => void fetchPrompts()}
                    disabled={loading}
                    aria-label="Refresh prompts"
                    className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-orange-600 ${loading ? "animate-spin" : ""}`} />
                    <span>{loading ? "Syncing..." : "Sync"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingPrompt(null);
                      setFormData(initialFormData);
                      setActiveTab("basic");
                      setShowModal(true);
                    }}
                    className="flex-1 sm:flex-initial inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-orange-600 px-3.5 text-xs font-bold text-white transition hover:bg-orange-700 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Prompt</span>
                  </button>
                </div>
              </div>

              {/* Right: Quick Stats Pills */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto flex-shrink-0">
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
                  <Bot className="h-3.5 w-3.5 text-slate-400" />
                  <div className="text-xs">
                    <span className="text-slate-500 mr-1">Total:</span>
                    <strong className="font-mono text-slate-900 font-bold">{prompts.length}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <div className="text-xs">
                    <span className="text-emerald-700 mr-1">Active:</span>
                    <strong className="font-mono text-emerald-950 font-bold">{activeCount}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <div className="text-xs">
                    <span className="text-orange-700 mr-1">Booking:</span>
                    <strong className="font-mono text-orange-950 font-bold">{bookingCount}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                  <div className="text-xs">
                    <span className="text-indigo-700 mr-1">WhatsApp:</span>
                    <strong className="font-mono text-indigo-950 font-bold">{whatsappCount}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Prompts Cards Ledger */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-16 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 mx-auto mb-3 border border-orange-200/60">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No prompts found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                {searchQuery ? "No prompts matched your search query" : "Configure your first AI voice prompt to power automated receptionist calls."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPrompts.map((prompt) => (
                <article
                  key={prompt._id}
                  className={`rounded-xl bg-white border ${
                    prompt.active ? "border-slate-200 hover:border-orange-300" : "border-rose-200 bg-rose-50/20"
                  } p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-900 truncate">
                          {prompt.hospitalName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-semibold text-slate-700">
                            {prompt.assignedPhoneNumber || "No number assigned"}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wide border ${
                          prompt.active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${prompt.active ? "bg-emerald-500" : "bg-rose-500"}`} />
                        {prompt.active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {/* Greeting Preview */}
                    <div className="mb-3.5 rounded-lg bg-slate-50 border border-slate-100 p-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        <MessageSquare className="w-3 h-3 text-orange-500" />
                        Greeting Line
                      </div>
                      <p className="text-xs text-slate-700 italic line-clamp-2">
                        &ldquo;{prompt.greetingMessage}&rdquo;
                      </p>
                    </div>

                    {/* Features Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prompt.features?.appointmentBooking && (
                        <span className="px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200/80 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Booking
                        </span>
                      )}
                      {prompt.features?.doctorAvailabilityCheck && (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Availability
                        </span>
                      )}
                      {prompt.features?.emergencyHandling && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200/80 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Emergency
                        </span>
                      )}
                      {prompt.notifications?.whatsappEnabled && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> WhatsApp
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleEdit(prompt)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-700 border border-slate-200 hover:border-orange-300 rounded-lg text-xs font-bold transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Prompt</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prompt)}
                      className="inline-flex items-center justify-center p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {editingPrompt ? "Edit AI Prompt" : "Create New AI Prompt"}
                </h2>
                <p className="text-xs text-slate-500">Configure receptionist voice, prompts, and automated actions</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 flex-shrink-0">
              {(["basic", "voice", "features", "notifications"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-orange-600 text-orange-700 bg-white"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Basic Tab */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Hospital/Clinic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      placeholder="e.g., City Health Clinic"
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalAddress}
                      onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                      placeholder="123 Main Street, City"
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      System Prompt *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      placeholder="Enter the AI's instruction prompt..."
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-xs sm:text-sm font-mono text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Greeting Message
                    </label>
                    <input
                      type="text"
                      value={formData.greetingMessage}
                      onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Closing Message
                    </label>
                    <input
                      type="text"
                      value={formData.closingMessage}
                      onChange={(e) => setFormData({ ...formData, closingMessage: e.target.value })}
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  {/* Working Hours */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        value={formData.workingHours.start}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, start: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        value={formData.workingHours.end}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workingHours: { ...formData.workingHours, end: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm font-mono text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                      />
                    </div>
                  </div>

                  {/* Working Days */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Working Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleWorkingDay(day.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                            formData.workingDays.includes(day.value)
                              ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Tab */}
              {activeTab === "voice" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Speech Language
                    </label>
                    <select
                      value={formData.voiceConfig.language}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          voiceConfig: { ...formData.voiceConfig, language: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-900 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Speech Speed
                        </span>
                        <strong className="font-mono text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {formData.voiceConfig.speed}x
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={formData.voiceConfig.speed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            voiceConfig: { ...formData.voiceConfig, speed: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full accent-orange-600"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Voice Pitch
                        </span>
                        <strong className="font-mono text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {formData.voiceConfig.pitch}x
                        </strong>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={formData.voiceConfig.pitch}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            voiceConfig: { ...formData.voiceConfig, pitch: parseFloat(e.target.value) },
                          })
                        }
                        className="w-full accent-orange-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-500 mb-3">
                    Enable or disable automated AI receptionist actions
                  </p>
                  <FeatureToggle
                    label="Appointment Booking"
                    checked={formData.features.appointmentBooking}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        features: { ...formData.features, appointmentBooking: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Doctor Availability Check"
                    checked={formData.features.doctorAvailabilityCheck}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        features: { ...formData.features, doctorAvailabilityCheck: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Appointment Cancellation"
                    checked={formData.features.appointmentCancellation}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        features: { ...formData.features, appointmentCancellation: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Appointment Rescheduling"
                    checked={formData.features.appointmentRescheduling}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        features: { ...formData.features, appointmentRescheduling: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Emergency Handling"
                    checked={formData.features.emergencyHandling}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        features: { ...formData.features, emergencyHandling: val },
                      })
                    }
                  />
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-2.5">
                  <p className="text-xs text-slate-500 mb-3">
                    Configure patient and doctor booking notification channels
                  </p>
                  <FeatureToggle
                    label="SMS Notifications"
                    checked={formData.notifications.smsEnabled}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, smsEnabled: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="WhatsApp Notifications"
                    checked={formData.notifications.whatsappEnabled}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, whatsappEnabled: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Email Notifications"
                    checked={formData.notifications.emailEnabled}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, emailEnabled: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Notify Doctor on Booking"
                    checked={formData.notifications.notifyDoctorOnBooking}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, notifyDoctorOnBooking: val },
                      })
                    }
                  />
                  <FeatureToggle
                    label="Notify Patient on Booking"
                    checked={formData.notifications.notifyPatientOnBooking}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        notifications: { ...formData.notifications, notifyPatientOnBooking: val },
                      })
                    }
                  />
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-xs font-bold shadow-sm transition disabled:opacity-50"
                >
                  {saving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : editingPrompt ? "Update Prompt" : "Create Prompt"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
