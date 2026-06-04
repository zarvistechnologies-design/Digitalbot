"use client";

import Sidebar from "@/components/Sidebar";
import { doctorsAPI, promptsAPI, voiceProviderAPI } from "@/lib/api";
import {
  AlertCircle,
  Bot,
  Brain,
  CheckCircle,
  Copy,
  Database,
  Menu,
  PhoneCall,
  RefreshCw,
  Save,
  Settings,
  SlidersHorizontal,
  Stethoscope,
  Volume2,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface User {
  name?: string;
  email?: string;
  assignedPhoneNumber?: string;
}

interface CustomLlmConfig {
  provider: string;
  clinicModel: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
  transferTo: string;
  customLlmWebsocketUrl: string;
  active: boolean;
}

interface EnabledTools {
  bookAppointment: boolean;
  checkDoctorAvailability: boolean;
  getDoctors: boolean;
}

interface ToolConfig {
  bookingEndpoint: string;
  availabilityEndpoint: string;
  doctorsEndpoint: string;
  bookingAuthHeader: string;
  enabledTools: EnabledTools;
}

interface VoiceRuntimeConfig {
  agentId: string;
  agentName: string;
  customLlmEnabled: boolean;
  tts: {
    provider: string;
    voiceId: string;
    language: string;
    speed: number;
  };
  stt: {
    provider: string;
    model: string;
    language: string;
  };
}

interface AgentForm {
  hospitalName: string;
  hospitalAddress: string;
  hospitalDescription: string;
  systemPrompt: string;
  greetingMessage: string;
  closingMessage: string;
  voiceConfig: {
    language: string;
    voiceId: string;
    speed: number;
    pitch: number;
  };
  customLlmConfig: CustomLlmConfig;
  toolConfig: ToolConfig;
  voiceRuntimeConfig: VoiceRuntimeConfig;
  workingHours: { start: string; end: string };
  workingDays: number[];
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

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  slotDuration?: number;
  active?: boolean;
}

interface VoiceAgentOption {
  id: string;
  name: string;
  voiceId?: string;
  voiceName?: string;
  language?: string;
  voiceProvider?: string;
  listenerProvider?: string;
  listenerModel?: string;
}

interface VoiceOption {
  id: string;
  voiceId?: string;
  name: string;
  provider?: string;
  model?: string | null;
  language?: string | null;
  category?: string | null;
  previewUrl?: string | null;
  settings?: Record<string, unknown>;
  source?: string;
}

type PromptResponse = Partial<AgentForm> & {
  millisConfig?: Partial<VoiceRuntimeConfig>;
  voiceRuntimeConfig?: Partial<VoiceRuntimeConfig>;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const llmModels = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash", "gemini-1.5-pro"];
const allowedVoiceProviders = ["elevenlabs", "sarvam"] as const;
const allowedVoiceProviderSet = new Set<string>(allowedVoiceProviders);

const normalizeVoiceProvider = (provider?: string | null) => provider?.trim().toLowerCase() || "";

const getVoiceProviderLabel = (provider?: string | null) => {
  const normalized = normalizeVoiceProvider(provider);
  if (normalized === "elevenlabs") return "ElevenLabs";
  if (normalized === "sarvam") return "Sarvam";
  return provider || "Voice service";
};

const cleanSystemAgentMessage = (message?: string | null, fallback = "Something went wrong.") => {
  const value = message || fallback;
  return value
    .replace(/MILLIS_API_KEY/g, "voice service API key")
    .replace(/Millis AI/g, "voice service")
    .replace(/Millis/g, "voice service");
};

const getVoiceProviderBadgeClass = (provider?: string | null) => {
  const normalized = normalizeVoiceProvider(provider);
  if (normalized === "sarvam") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-violet-200 bg-violet-50 text-violet-700";
};

const getVoiceProviderIconClass = (provider?: string | null) => {
  const normalized = normalizeVoiceProvider(provider);
  if (normalized === "sarvam") return "bg-emerald-600 text-white";
  return "bg-violet-600 text-white";
};

const defaultPrompt = `You are the clinic's AI voice receptionist for doctor appointment calls.

Your job:
1. Greet the caller warmly.
2. Understand whether they want to book, reschedule, cancel, or check availability.
3. Ask for doctor, date, time, patient name, and patient phone before booking.
4. Use tools for doctor list, availability check, and appointment booking.
5. Never confirm an appointment until the booking tool succeeds.
6. If the caller has an emergency, ask them to contact emergency services or transfer to staff.
7. Keep replies short, natural, and easy to understand on a phone call.`;

function buildDefaultForm(user: User | null): AgentForm {
  const phone = user?.assignedPhoneNumber || "";
  const doctorsEndpoint = phone ? `${API_BASE_URL}/doctors/by-phone/${phone}` : `${API_BASE_URL}/doctors/by-phone`;

  return {
    hospitalName: user?.name ? `${user.name} Clinic` : "Clinic",
    hospitalAddress: "",
    hospitalDescription: "Doctor appointment voice agent for patient calls.",
    systemPrompt: defaultPrompt,
    greetingMessage: "Hello! Welcome to our clinic. How can I help you today?",
    closingMessage: "Thank you for calling. Have a great day!",
    voiceConfig: {
      language: "en-IN",
      voiceId: "",
      speed: 1,
      pitch: 1,
    },
    customLlmConfig: {
      provider: "gemini",
      clinicModel: "doctor-appointment-clinic",
      model: "gemini-2.5-flash",
      temperature: 0.6,
      maxOutputTokens: 1024,
      transferTo: "",
      customLlmWebsocketUrl: "",
      active: true,
    },
    toolConfig: {
      bookingEndpoint: `${API_BASE_URL}/availability/book`,
      availabilityEndpoint: `${API_BASE_URL}/availability`,
      doctorsEndpoint,
      bookingAuthHeader: "",
      enabledTools: {
        bookAppointment: true,
        checkDoctorAvailability: true,
        getDoctors: true,
      },
    },
    voiceRuntimeConfig: {
      agentId: "",
      agentName: "",
      customLlmEnabled: true,
      tts: {
        provider: "elevenlabs",
        voiceId: "",
        language: "en-IN",
        speed: 1,
      },
      stt: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-IN",
      },
    },
    workingHours: { start: "09:00", end: "18:00" },
    workingDays: [1, 2, 3, 4, 5, 6],
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
}

function mergePrompt(prompt: PromptResponse | null, fallback: AgentForm): AgentForm {
  if (!prompt) return fallback;
  const runtimeConfig = prompt.voiceRuntimeConfig || prompt.millisConfig || {};
  return {
    ...fallback,
    ...prompt,
    voiceConfig: { ...fallback.voiceConfig, ...(prompt.voiceConfig || {}) },
    customLlmConfig: { ...fallback.customLlmConfig, ...(prompt.customLlmConfig || {}) },
    toolConfig: {
      ...fallback.toolConfig,
      ...(prompt.toolConfig || {}),
      enabledTools: {
        ...fallback.toolConfig.enabledTools,
        ...(prompt.toolConfig?.enabledTools || {}),
      },
    },
    voiceRuntimeConfig: {
      ...fallback.voiceRuntimeConfig,
      ...runtimeConfig,
      tts: { ...fallback.voiceRuntimeConfig.tts, ...(runtimeConfig.tts || {}) },
      stt: { ...fallback.voiceRuntimeConfig.stt, ...(runtimeConfig.stt || {}) },
    },
    features: { ...fallback.features, ...(prompt.features || {}) },
    notifications: { ...fallback.notifications, ...(prompt.notifications || {}) },
    workingHours: { ...fallback.workingHours, ...(prompt.workingHours || {}) },
  };
}

function applyVoiceAgentToForm(form: AgentForm, agent?: VoiceAgentOption): AgentForm {
  if (!agent) return form;
  const hasSelectedVoice = Boolean(form.voiceRuntimeConfig.tts.voiceId);

  return {
    ...form,
    voiceRuntimeConfig: {
      ...form.voiceRuntimeConfig,
      agentId: agent.id || form.voiceRuntimeConfig.agentId,
      agentName: agent.name || form.voiceRuntimeConfig.agentName,
      tts: {
        ...form.voiceRuntimeConfig.tts,
        provider: hasSelectedVoice
          ? form.voiceRuntimeConfig.tts.provider
          : agent.voiceProvider || form.voiceRuntimeConfig.tts.provider,
        voiceId: form.voiceRuntimeConfig.tts.voiceId || agent.voiceId || "",
        language: agent.language || form.voiceRuntimeConfig.tts.language,
      },
      stt: {
        ...form.voiceRuntimeConfig.stt,
        provider: agent.listenerProvider || form.voiceRuntimeConfig.stt.provider,
        model: agent.listenerModel || form.voiceRuntimeConfig.stt.model,
        language: agent.language || form.voiceRuntimeConfig.stt.language,
      },
    },
  };
}

export default function SystemAgentConfigurationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<AgentForm>(() => buildDefaultForm(null));
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [voiceAgents, setVoiceAgents] = useState<VoiceAgentOption[]>([]);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voiceAgentsError, setVoiceAgentsError] = useState<string | null>(null);
  const [voiceListError, setVoiceListError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const systemPromptTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const assignedPhone = user?.assignedPhoneNumber || "";

  const resizeSystemPromptTextarea = useCallback(() => {
    const textarea = systemPromptTextareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.max(textarea.scrollHeight, 360)}px`;
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setVoiceAgentsError(null);
      setVoiceListError(null);
      setSavedMessage(null);

      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const parsedUser = storedUser ? JSON.parse(storedUser) as User : null;
      setUser(parsedUser);
      const fallback = buildDefaultForm(parsedUser);

      const [promptResult, doctorsResult, voiceAgentsResult, voicesResult] = await Promise.allSettled([
        promptsAPI.getCurrent(),
        doctorsAPI.getAll(),
        voiceProviderAPI.getAgents(),
        voiceProviderAPI.getVoices({ includeCustom: true }),
      ]);

      const agents =
        voiceAgentsResult.status === "fulfilled"
          ? (voiceAgentsResult.value.data?.agents || [])
          : [];
      const safeAgents = Array.isArray(agents) ? agents : [];
      setVoiceAgents(safeAgents);
      if (voiceAgentsResult.status === "rejected") {
        setVoiceAgentsError("Voice agent list could not be loaded from the provider API.");
      }

      const availableVoices =
        voicesResult.status === "fulfilled"
          ? (voicesResult.value.data?.voices || [])
          : [];
      const safeVoices = Array.isArray(availableVoices) ? availableVoices : [];
      setVoices(safeVoices);
      if (voicesResult.status === "rejected") {
        setVoiceListError("Voice list could not be loaded; showing voices already configured on agents.");
      } else if (voicesResult.value.data?.success === false) {
        setVoiceListError(cleanSystemAgentMessage(voicesResult.value.data?.warning, "Voice list could not be loaded."));
      }

      let nextForm = fallback;
      if (promptResult.status === "fulfilled") {
        const prompt = promptResult.value.data?.prompt || null;
        nextForm = mergePrompt(prompt, fallback);
      }

      const selectedAgent =
        safeAgents.find((agent) => agent.id === nextForm.voiceRuntimeConfig.agentId) ||
        safeAgents.find((agent) => agent.name.toLowerCase() === nextForm.voiceRuntimeConfig.agentName.toLowerCase()) ||
        safeAgents[0];
      setFormData(applyVoiceAgentToForm(nextForm, selectedAgent));

      if (doctorsResult.status === "fulfilled") {
        const doctorList = doctorsResult.value.data?.doctors || doctorsResult.value.data?.data || [];
        setDoctors(Array.isArray(doctorList) ? doctorList : []);
      } else {
        setDoctors([]);
      }
    } catch (err: unknown) {
      setError(cleanSystemAgentMessage(err instanceof Error ? err.message : null, "Failed to load system agent configuration"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    resizeSystemPromptTextarea();
  }, [formData.systemPrompt, resizeSystemPromptTextarea]);

  const clinicModelPreview = useMemo(() => ({
    phone_number: assignedPhone || "assigned number",
    name: formData.hospitalName,
    prompt: "System prompt from this page",
    greeting: formData.greetingMessage,
    model: formData.customLlmConfig.model,
    temperature: formData.customLlmConfig.temperature,
    max_output_tokens: formData.customLlmConfig.maxOutputTokens,
    tools: Object.entries(formData.toolConfig.enabledTools)
      .filter(([, enabled]) => enabled)
      .map(([key]) => key),
  }), [assignedPhone, formData]);

  const voiceChoices = useMemo(() => {
    const seen = new Set<string>();
    const millisVoices = voices
      .map((voice) => ({
        id: voice.voiceId || voice.id,
        name: voice.name || voice.voiceId || voice.id || "Voice",
        provider: normalizeVoiceProvider(voice.provider),
        model: voice.model || null,
        language: voice.language || "",
        category: voice.category || "",
        previewUrl: voice.previewUrl || null,
        settings: voice.settings || {},
      }))
      .filter((voice) => voice.id && allowedVoiceProviderSet.has(voice.provider));
    const agentVoices = voiceAgents
      .filter((agent) => agent.voiceId)
      .map((agent) => ({
        id: agent.voiceId || "",
        name: agent.voiceName || agent.voiceId || "Configured voice",
        provider: normalizeVoiceProvider(agent.voiceProvider),
        model: null,
        language: agent.language || "",
        category: "agent-configured",
        previewUrl: null,
        settings: {},
      }))
      .filter((voice) => voice.id && allowedVoiceProviderSet.has(voice.provider));

    return (millisVoices.length > 0 ? millisVoices : agentVoices)
      .filter((voice) => {
        const key = voice.id;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }, [voiceAgents, voices]);

  const handleVoiceAgentSelect = (agentId: string) => {
    const agent = voiceAgents.find((item) => item.id === agentId);
    setFormData((prev) => applyVoiceAgentToForm(prev, agent));
  };

  const handleVoiceSelect = (voiceId: string) => {
    const voice = voiceChoices.find((item) => item.id === voiceId);
    setFormData((prev) => ({
      ...prev,
      voiceConfig: {
        ...prev.voiceConfig,
        voiceId,
        language: voice?.language || prev.voiceConfig.language,
      },
      voiceRuntimeConfig: {
        ...prev.voiceRuntimeConfig,
        tts: {
          ...prev.voiceRuntimeConfig.tts,
          voiceId,
          provider: voice?.provider || prev.voiceRuntimeConfig.tts.provider,
          language: voice?.language || prev.voiceRuntimeConfig.tts.language,
        },
      },
    }));
  };

  const selectedVoiceChoice = useMemo(
    () => voiceChoices.find((voice) => voice.id === formData.voiceRuntimeConfig.tts.voiceId),
    [formData.voiceRuntimeConfig.tts.voiceId, voiceChoices]
  );

  const voiceProviderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    voiceChoices.forEach((voice) => {
      const provider = normalizeVoiceProvider(voice.provider);
      counts[provider] = (counts[provider] || 0) + 1;
    });
    return counts;
  }, [voiceChoices]);

  const updateField = <K extends keyof AgentForm>(key: K, value: AgentForm[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateCustomLlm = <K extends keyof CustomLlmConfig>(key: K, value: CustomLlmConfig[K]) => {
    setFormData((prev) => ({
      ...prev,
      customLlmConfig: { ...prev.customLlmConfig, [key]: value },
    }));
  };

  const updateTool = <K extends keyof ToolConfig>(key: K, value: ToolConfig[K]) => {
    setFormData((prev) => ({
      ...prev,
      toolConfig: { ...prev.toolConfig, [key]: value },
    }));
  };

  const updateToolToggle = (key: keyof EnabledTools, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      toolConfig: {
        ...prev.toolConfig,
        enabledTools: { ...prev.toolConfig.enabledTools, [key]: value },
      },
    }));
  };

  const updateVoiceRuntime = <K extends keyof VoiceRuntimeConfig>(key: K, value: VoiceRuntimeConfig[K]) => {
    setFormData((prev) => ({
      ...prev,
      voiceRuntimeConfig: { ...prev.voiceRuntimeConfig, [key]: value },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSavedMessage(null);

      if (!formData.hospitalName.trim() || !formData.systemPrompt.trim()) {
        setError("Clinic name and system prompt are required.");
        return;
      }

      const { voiceRuntimeConfig, ...restFormData } = formData;
      const voiceConfig = {
        ...restFormData.voiceConfig,
        voiceId: voiceRuntimeConfig.tts.voiceId,
        language: voiceRuntimeConfig.tts.language || restFormData.voiceConfig.language,
        speed: voiceRuntimeConfig.tts.speed || restFormData.voiceConfig.speed,
      };
      const selectedVoice = voiceChoices.find((voice) => voice.id === voiceRuntimeConfig.tts.voiceId);
      await promptsAPI.saveCurrent({
        ...restFormData,
        voiceConfig,
        voiceRuntimeConfig,
        millisConfig: voiceRuntimeConfig,
      } as unknown as Record<string, unknown>);

      let nextSavedMessage = "System agent configuration saved.";
      if (voiceRuntimeConfig.agentId && voiceRuntimeConfig.tts.voiceId) {
        try {
          await voiceProviderAPI.updateAgentVoice(voiceRuntimeConfig.agentId, {
            voiceId: voiceRuntimeConfig.tts.voiceId,
            provider: selectedVoice?.provider || voiceRuntimeConfig.tts.provider,
            model: selectedVoice?.model || undefined,
            language: selectedVoice?.language || voiceRuntimeConfig.tts.language,
            agentName: voiceRuntimeConfig.agentName,
          });
          nextSavedMessage = "System agent configuration saved and voice updated.";
        } catch (syncError: any) {
          await loadConfig();
          const syncMessage = cleanSystemAgentMessage(
            syncError?.response?.data?.error || syncError?.response?.data?.details || syncError?.message,
            "Voice update failed."
          );
          setError(`Saved locally, but voice update failed: ${syncMessage}`);
          return;
        }
      } else if (voiceRuntimeConfig.tts.voiceId) {
        nextSavedMessage = "System agent configuration saved. Select a voice agent to sync the voice.";
      }

      await loadConfig();
      setSavedMessage(nextSavedMessage);
    } catch (err: any) {
      setError(cleanSystemAgentMessage(err?.response?.data?.error || err?.message, "Failed to save system agent configuration"));
    } finally {
      setSaving(false);
    }
  };

  const copyText = async (value: string) => {
    if (!value) return;
    await navigator.clipboard?.writeText(value);
    setSavedMessage("Copied to clipboard.");
  };

  const toolCards = [
    {
      key: "bookAppointment" as const,
      name: "book_appointment",
      title: "Book Appointment",
      description: "Books the patient after doctor, date, time, name, and phone are collected.",
      endpoint: formData.toolConfig.bookingEndpoint,
    },
    {
      key: "checkDoctorAvailability" as const,
      name: "check_doctor_availability",
      title: "Check Availability",
      description: "Checks doctor slots before confirming any appointment.",
      endpoint: formData.toolConfig.availabilityEndpoint,
    },
    {
      key: "getDoctors" as const,
      name: "get_doctors",
      title: "Get Doctors",
      description: "Returns clinic doctors, specializations, and slot duration.",
      endpoint: formData.toolConfig.doctorsEndpoint,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-40 p-3 bg-white rounded-xl shadow-lg border border-slate-200"
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-slate-700" />
        </button>

        <main className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                <Settings className="h-3.5 w-3.5" />
                Doctor appointment service
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-950">System Agent Configuration</h1>
              <p className="mt-1 max-w-3xl text-sm sm:text-base text-slate-600">
                Configure the Custom LLM , prompt, tools, and voice settings for this assigned number.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={loadConfig}
                disabled={loading || saving}
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-orange-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Configuration"}
              </button>
            </div>
          </header>

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {savedMessage && (
            <div className="mb-5 flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                {savedMessage}
              </span>
              <button onClick={() => setSavedMessage(null)} aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-72 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 h-6 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="space-y-3">
                    <div className="h-10 animate-pulse rounded bg-slate-100" />
                    <div className="h-10 animate-pulse rounded bg-slate-100" />
                    <div className="h-24 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-600 text-white">
                      <Brain className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Custom LLM System Prompt</h2>
                      <p className="text-sm text-slate-500">This prompt is used by the voice agent during live calls.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Clinic Name</span>
                      <input
                        value={formData.hospitalName}
                        onChange={(event) => updateField("hospitalName", event.target.value)}
                        className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Assigned Number</span>
                      <input
                        value={assignedPhone || "No assigned number"}
                        readOnly
                        className="mt-1 h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600"
                      />
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-slate-700">Greeting Message</span>
                    <input
                      value={formData.greetingMessage}
                      onChange={(event) => updateField("greetingMessage", event.target.value)}
                      className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>

                  <label className="mt-4 block">
                    <span className="text-sm font-semibold text-slate-700">System Prompt</span>
                    <textarea
                      ref={systemPromptTextareaRef}
                      value={formData.systemPrompt}
                      onChange={(event) => {
                        updateField("systemPrompt", event.target.value);
                        requestAnimationFrame(resizeSystemPromptTextarea);
                      }}
                      rows={12}
                      className="mt-1 min-h-[360px] w-full resize-y overflow-hidden rounded-lg border border-slate-200 px-3 py-3 text-sm leading-6 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </label>
                </div>

                <div className="space-y-5">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-600 text-white">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950">Configuration</h2>
                        <p className="text-sm text-slate-500">Gemini model settings used by Custom LLM.</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Model</span>
                        <select
                          value={formData.customLlmConfig.model}
                          onChange={(event) => updateCustomLlm("model", event.target.value)}
                          className="mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        >
                          {llmModels.map((model) => <option key={model} value={model}>{model}</option>)}
                        </select>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Temperature</span>
                          <input
                            type="number"
                            min="0"
                            max="2"
                            step="0.1"
                            value={formData.customLlmConfig.temperature}
                            onChange={(event) => updateCustomLlm("temperature", Number(event.target.value))}
                            className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          />
                        </label>
                        <label className="block">
                          <span className="text-sm font-semibold text-slate-700">Max Tokens</span>
                          <input
                            type="number"
                            min="128"
                            step="128"
                            value={formData.customLlmConfig.maxOutputTokens}
                            onChange={(event) => updateCustomLlm("maxOutputTokens", Number(event.target.value))}
                            className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Transfer Number</span>
                        <input
                          value={formData.customLlmConfig.transferTo}
                          onChange={(event) => updateCustomLlm("transferTo", event.target.value)}
                          placeholder="+91..."
                          className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">Custom LLM WebSocket URL</span>
                        <div className="mt-1 flex gap-2">
                          <input
                            value={formData.customLlmConfig.customLlmWebsocketUrl}
                            onChange={(event) => updateCustomLlm("customLlmWebsocketUrl", event.target.value)}
                            placeholder="wss://your-custom-llm.example.com"
                            className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          />
                          <button
                            type="button"
                            onClick={() => copyText(formData.customLlmConfig.customLlmWebsocketUrl)}
                            className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            aria-label="Copy WebSocket URL"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-600 text-white">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-950">Clinic Data</h2>
                        <p className="text-sm text-slate-500">Doctors available to this agent.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs font-semibold text-slate-500">Doctors</div>
                        <div className="text-2xl font-bold text-slate-950">{doctors.length}</div>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-3">
                        <div className="text-xs font-semibold text-slate-500">Active Tools</div>
                        <div className="text-2xl font-bold text-slate-950">
                          {Object.values(formData.toolConfig.enabledTools).filter(Boolean).length}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 max-h-36 space-y-2 overflow-y-auto">
                      {doctors.length > 0 ? doctors.slice(0, 5).map((doctor) => (
                        <div key={doctor._id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                          <span className="font-semibold text-slate-800">{doctor.name}</span>
                          <span className="text-xs text-slate-500">{doctor.specialization}</span>
                        </div>
                      )) : (
                        <div className="rounded-lg border border-dashed border-slate-200 p-3 text-sm text-slate-500">No doctors configured yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-600 text-white">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Voice Agent & Voice Selection</h2>
                      <p className="text-sm text-slate-500">Agent options and dashboard voices are loaded automatically.</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={formData.voiceRuntimeConfig.customLlmEnabled}
                      onChange={(event) => updateVoiceRuntime("customLlmEnabled", event.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-orange-600"
                    />
                    Custom LLM enabled
                  </label>
                </div>

                {voiceAgentsError && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {voiceAgentsError}
                  </div>
                )}

                {voiceListError && (
                  <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {voiceListError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                      <Bot className="h-4 w-4 text-violet-600" />
                      Voice Agent
                    </div>
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">Select Agent</span>
                      <select
                        value={formData.voiceRuntimeConfig.agentId}
                        onChange={(event) => handleVoiceAgentSelect(event.target.value)}
                        disabled={voiceAgents.length === 0}
                        className="mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50 disabled:text-slate-400"
                      >
                        <option value="">{voiceAgents.length ? "Choose voice agent" : "No voice agents available"}</option>
                        {voiceAgents.map((agent) => (
                          <option key={agent.id} value={agent.id}>{agent.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Volume2 className="h-4 w-4 text-sky-600" />
                        Voice Selection
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allowedVoiceProviders.map((provider) => (
                          <span
                            key={provider}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getVoiceProviderBadgeClass(provider)}`}
                          >
                            {getVoiceProviderLabel(provider)}
                            <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] leading-none">
                              {voiceProviderCounts[provider] || 0}
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid max-h-[5.5rem] gap-2 overflow-y-auto overscroll-contain pr-1">
                      {voiceChoices.length > 0 ? voiceChoices.map((voice) => {
                        const selected = formData.voiceRuntimeConfig.tts.voiceId === voice.id;
                        return (
                          <button
                            key={voice.id}
                            type="button"
                            onClick={() => handleVoiceSelect(voice.id)}
                            aria-pressed={selected}
                            className={`flex min-h-20 w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                              selected
                                ? "border-orange-300 bg-orange-50 shadow-sm ring-2 ring-orange-100"
                                : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40"
                            }`}
                          >
                            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getVoiceProviderIconClass(voice.provider)}`}>
                              <Volume2 className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-slate-950">{voice.name}</span>
                              <span className="mt-1 flex max-h-6 flex-wrap gap-1.5 overflow-hidden">
                                <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getVoiceProviderBadgeClass(voice.provider)}`}>
                                  {getVoiceProviderLabel(voice.provider)}
                                </span>
                                {voice.language && (
                                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                    {voice.language}
                                  </span>
                                )}
                                {voice.category === "custom" && (
                                  <span className="rounded-full border border-orange-200 bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                                    Custom
                                  </span>
                                )}
                                {voice.previewUrl && (
                                  <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                                    Preview
                                  </span>
                                )}
                              </span>
                            </span>
                            {selected ? (
                              <CheckCircle className="h-5 w-5 shrink-0 text-orange-600" />
                            ) : (
                              <span className="h-5 w-5 shrink-0 rounded-full border border-slate-300" />
                            )}
                          </button>
                        );
                      }) : (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                          No ElevenLabs or Sarvam voices are available right now.
                        </div>
                      )}
                    </div>

                    {formData.voiceRuntimeConfig.tts.voiceId && !selectedVoiceChoice && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700">
                        Current saved voice is outside ElevenLabs or Sarvam. Pick one from the list before saving.
                      </div>
                    )}

                    {selectedVoiceChoice && (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                          <span className="min-w-0 truncate font-semibold text-slate-700">
                            {selectedVoiceChoice.name}
                          </span>
                          <span className={`shrink-0 rounded-full border px-2 py-1 font-semibold ${getVoiceProviderBadgeClass(selectedVoiceChoice.provider)}`}>
                            {getVoiceProviderLabel(selectedVoiceChoice.provider)}
                          </span>
                        </div>
                        {selectedVoiceChoice.previewUrl ? (
                          <audio
                            key={selectedVoiceChoice.id}
                            controls
                            preload="none"
                            src={selectedVoiceChoice.previewUrl}
                            className="h-10 w-full"
                          >
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <p className="text-xs text-slate-500">
                            No preview audio is available for this voice.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-white">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Custom LLM Tools</h2>
                      <p className="text-sm text-slate-500">These match the three tools in the Custom LLM backend.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                    {toolCards.map((tool) => (
                      <div key={tool.name} className="min-w-0 rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="break-words text-base font-bold leading-5 text-slate-950">{tool.title}</h3>
                            <p className="mt-1 break-all font-mono text-[11px] leading-4 text-slate-500">{tool.name}</p>
                          </div>
                          <label className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={formData.toolConfig.enabledTools[tool.key]}
                              onChange={(event) => updateToolToggle(tool.key, event.target.checked)}
                              className="peer sr-only"
                            />
                            <span className="h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-orange-600 peer-checked:after:translate-x-5" />
                          </label>
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-600 text-white">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">Clinic Model Preview</h2>
                      <p className="text-sm text-slate-500">Shape saved for Custom LLM clinic config.</p>
                    </div>
                  </div>
                  <pre className="max-h-[460px] overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                    {JSON.stringify(clinicModelPreview, null, 2)}
                  </pre>
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
