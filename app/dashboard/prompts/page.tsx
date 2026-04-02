"use client";
import Sidebar from "@/components/Sidebar";
import { promptsAPI } from "@/lib/api";
import {
    AlertCircle,
    Bot,
    Check,
    Edit,
    MessageSquare,
    Phone,
    Plus,
    RefreshCw,
    Search,
    Trash2,
    X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState<PromptFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "voice" | "features" | "notifications">("basic");

  // Fetch prompts
  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promptsAPI.getAll();
      setPrompts(response.data.prompts || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch prompts";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

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
    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-orange-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-orange-50/20">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bot className="w-8 h-8 text-orange-600" />
                AI Prompt Configuration
              </h1>
              <p className="text-gray-600 mt-1">Configure AI voice agent prompts for your hospitals</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchPrompts}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={() => {
                  setEditingPrompt(null);
                  setFormData(initialFormData);
                  setActiveTab("basic");
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Prompt
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by hospital name or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Prompts Grid */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt._id}
                  className={`bg-white rounded-xl p-6 border ${
                    prompt.active ? "border-gray-200" : "border-red-200 bg-red-50/30"
                  } hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{prompt.hospitalName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Phone className="w-4 h-4" />
                        {prompt.assignedPhoneNumber}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prompt.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {prompt.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Greeting */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                      <MessageSquare className="w-4 h-4" />
                      Greeting
                    </div>
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg truncate">
                      {prompt.greetingMessage}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prompt.features.appointmentBooking && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Booking
                      </span>
                    )}
                    {prompt.features.doctorAvailabilityCheck && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Availability
                      </span>
                    )}
                    {prompt.features.emergencyHandling && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Emergency
                      </span>
                    )}
                    {prompt.notifications.whatsappEnabled && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> WhatsApp
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(prompt)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prompt)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              {filteredPrompts.length === 0 && !loading && (
                <div className="col-span-full text-center py-12">
                  <Bot className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No prompts found</h3>
                  <p className="text-gray-500 mt-1">
                    {searchQuery ? "Try a different search term" : "Add your first AI prompt to get started"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingPrompt ? "Edit Prompt" : "Add New Prompt"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              {(["basic", "voice", "features", "notifications"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-orange-600 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
              {/* Basic Tab */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hospital/Clinic Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      placeholder="e.g., City Health Clinic"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalAddress}
                      onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
                      placeholder="123 Main Street, City"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      System Prompt *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      placeholder="Enter the AI's instruction prompt..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Greeting Message
                    </label>
                    <input
                      type="text"
                      value={formData.greetingMessage}
                      onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Closing Message
                    </label>
                    <input
                      type="text"
                      value={formData.closingMessage}
                      onChange={(e) => setFormData({ ...formData, closingMessage: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  {/* Working Hours */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Working Days */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Working Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleWorkingDay(day.value)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${
                            formData.workingDays.includes(day.value)
                              ? "bg-orange-600 text-white border-orange-600"
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={formData.voiceConfig.language}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          voiceConfig: { ...formData.voiceConfig, language: e.target.value },
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speech Speed: {formData.voiceConfig.speed}x
                    </label>
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
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Voice Pitch: {formData.voiceConfig.pitch}x
                    </label>
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
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4">
                    Enable or disable AI capabilities for this prompt
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
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4">
                    Configure notification settings for appointments
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

              {/* Submit */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingPrompt ? "Update Prompt" : "Create Prompt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
