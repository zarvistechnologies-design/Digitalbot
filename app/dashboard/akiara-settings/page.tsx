"use client";
import Sidebar from "@/components/Sidebar";
import { tenantAPI } from "@/lib/api";
import {
  AlertCircle,
  Bot,
  Calendar,
  Check,
  ChevronRight,
  CircleDot,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  IndianRupee,
  Key,
  Link2,
  Loader2,
  Menu,
  MessageSquare,
  Plug,
  RefreshCw,
  Save,
  Settings,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface TeleCrmConfig {
  enabled: boolean;
  apiKey: string;
  apiUrl: string;
}

interface CalendlyConfig {
  apiToken: string;
  eventTypeUri: string;
  webhookSigningKey: string;
}

interface TenantData {
  tenantId: string;
  brandName: string;
  botName: string;
  teleCrm: TeleCrmConfig;
  calendly?: CalendlyConfig;
  links: {
    warrantyRegistration?: string;
    calendly?: string;
    website?: string;
    supportPage?: string;
    faq?: string;
  };
  customPrompt: string;
  extraEscalationKeywords: string[];
  homeServicePricing: {
    withinWarranty: string;
    outsideWarranty: string;
  };
}

type TabKey = "general" | "integrations" | "links" | "advanced";

const TABS: { key: TabKey; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: "general", label: "General", icon: <Bot className="w-4 h-4" />, desc: "Brand & bot identity" },
  { key: "integrations", label: "Integrations", icon: <Plug className="w-4 h-4" />, desc: "TeleCRM & Calendly" },
  { key: "links", label: "Links & Pricing", icon: <Link2 className="w-4 h-4" />, desc: "URLs & service pricing" },
  { key: "advanced", label: "Advanced", icon: <Sparkles className="w-4 h-4" />, desc: "Prompts & escalation" },
];

export default function AkiaraSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [tenant, setTenant] = useState<TenantData | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [showApiKey, setShowApiKey] = useState(false);

  // TeleCRM form state
  const [teleCrmEnabled, setTeleCrmEnabled] = useState(false);
  const [teleCrmApiKey, setTeleCrmApiKey] = useState("");
  const [teleCrmApiUrl, setTeleCrmApiUrl] = useState("https://api.telecrm.in/enterprise/v1/lead");

  // Calendly integration state
  const [calendlyEnabled, setCalendlyEnabled] = useState(false);
  const [calendlyApiToken, setCalendlyApiToken] = useState("");
  const [calendlyEventTypeUri, setCalendlyEventTypeUri] = useState("");
  const [showCalendlyToken, setShowCalendlyToken] = useState(false);

  // Other settings
  const [brandName, setBrandName] = useState("");
  const [botName, setBotName] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [extraKeywords, setExtraKeywords] = useState("");
  const [warrantyLink, setWarrantyLink] = useState("");
  const [calendlyLink, setCalendlyLink] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [withinWarranty, setWithinWarranty] = useState("FREE");
  const [outsideWarranty, setOutsideWarranty] = useState("₹500 per visit");

  const fetchTenant = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tenantAPI.getTenants();
      const tenants = res.data?.data || [];
      const t = tenants.find((x: TenantData) => x.tenantId === "akiara") || tenants[0];
      if (t) {
        setTenant(t);
        setTeleCrmEnabled(t.teleCrm?.enabled || false);
        setTeleCrmApiKey(t.teleCrm?.apiKey || "");
        setTeleCrmApiUrl(t.teleCrm?.apiUrl || "https://api.telecrm.in/enterprise/v1/lead");
        setBrandName(t.brandName || "");
        setBotName(t.botName || "");
        setCustomPrompt(t.customPrompt || "");
        setExtraKeywords((t.extraEscalationKeywords || []).join(", "));
        setWarrantyLink(t.links?.warrantyRegistration || "");
        setCalendlyLink(t.links?.calendly || "");
        setWebsiteLink(t.links?.website || "");
        setWithinWarranty(t.homeServicePricing?.withinWarranty || "FREE");
        setOutsideWarranty(t.homeServicePricing?.outsideWarranty || "₹500 per visit");
        setCalendlyApiToken(t.calendly?.apiToken || "");
        setCalendlyEventTypeUri(t.calendly?.eventTypeUri || "");
        setCalendlyEnabled(!!(t.calendly?.apiToken));
      }
    } catch (err) {
      console.error("Failed to fetch tenant:", err);
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTenant(); }, [fetchTenant]);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updates: Record<string, unknown> = {
        brandName,
        botName,
        customPrompt,
        extraEscalationKeywords: extraKeywords.split(",").map((s) => s.trim()).filter(Boolean),
        links: {
          ...tenant.links,
          warrantyRegistration: warrantyLink,
          calendly: calendlyLink,
          website: websiteLink,
        },
        homeServicePricing: { withinWarranty, outsideWarranty },
        teleCrm: {
          enabled: teleCrmEnabled,
          apiKey: teleCrmApiKey,
          apiUrl: teleCrmApiUrl,
        },
        calendly: {
          apiToken: calendlyEnabled ? calendlyApiToken : "",
          eventTypeUri: calendlyEnabled ? calendlyEventTypeUri : "",
          webhookSigningKey: "",
        },
      };
      await tenantAPI.updateTenant(tenant.tenantId, updates);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      console.error("Failed to save:", err);
      setError("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ---- Loading State ----
  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#fafafa]">
        <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>
        <main className="flex-1 lg:ml-60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 animate-pulse" />
              <Settings className="absolute inset-0 m-auto w-8 h-8 text-white animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <p className="text-slate-500 font-medium">Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      {/* Mobile sidebar toggle */}
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
        <div className="max-w-5xl mx-auto">

          {/* ===== HEADER ===== */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500">Configure bot, integrations & CRM</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={fetchTenant}
                  className="h-10 w-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`h-10 px-5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm ${
                    saved
                      ? "bg-emerald-500 text-white shadow-emerald-200"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50"
                  }`}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                  {saving ? "Saving..." : saved ? "Saved!" : "Save"}
                </button>
              </div>
            </div>

            {/* Toast notifications */}
            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            {saved && (
              <div className="mt-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" /> Settings saved! Changes take effect on next bot interaction.
              </div>
            )}
          </div>

          {/* ===== TAB NAVIGATION ===== */}
          <div className="flex gap-1.5 mb-6 p-1 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-200"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ===== TAB CONTENT ===== */}
          <div className="space-y-5">

            {/* ────── GENERAL TAB ────── */}
            {activeTab === "general" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Brand Identity</h3>
                        <p className="text-xs text-slate-400">Your brand and bot name shown to customers</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Brand Name</label>
                        <input
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                          placeholder="e.g. Akiara"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bot Name</label>
                        <input
                          value={botName}
                          onChange={(e) => setBotName(e.target.value)}
                          className="w-full h-11 px-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                          placeholder="e.g. Riya"
                        />
                      </div>
                    </div>
                    {(brandName || botName) && (
                      <div className="mt-5 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                        <p className="text-xs font-medium text-orange-600 mb-2 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> Preview — First message
                        </p>
                        <p className="text-sm text-slate-700">
                          &quot;Hello! Welcome to <strong>{brandName || "Brand"}</strong>. I&apos;m <strong>{botName || "Bot"}</strong>, your WhatsApp assistant. How can I help you today?&quot;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ────── INTEGRATIONS TAB ────── */}
            {activeTab === "integrations" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* TeleCRM */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${teleCrmEnabled ? "bg-yellow-100" : "bg-slate-100"}`}>
                          <Zap className={`w-4 h-4 ${teleCrmEnabled ? "text-yellow-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            TeleCRM
                            {teleCrmEnabled && teleCrmApiKey && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                                <CircleDot className="w-2.5 h-2.5" /> Connected
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400">Auto-push escalated tickets as CRM leads</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTeleCrmEnabled(!teleCrmEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          teleCrmEnabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          teleCrmEnabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ${teleCrmEnabled ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Key className="w-3 h-3" /> API Key
                        </label>
                        <div className="relative">
                          <input
                            type={showApiKey ? "text" : "password"}
                            value={teleCrmApiKey}
                            onChange={(e) => setTeleCrmApiKey(e.target.value)}
                            placeholder="Enter your TeleCRM API key"
                            className="w-full h-11 px-4 pr-11 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                          />
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3 h-3" /> API Endpoint
                        </label>
                        <input
                          value={teleCrmApiUrl}
                          onChange={(e) => setTeleCrmApiUrl(e.target.value)}
                          placeholder="https://api.telecrm.in/enterprise/v1/lead"
                          className="w-full h-11 px-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                        />
                      </div>
                      <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/60 rounded-xl">
                        <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700 leading-relaxed">
                          When a ticket is created, the bot pushes a lead to TeleCRM with customer name, phone, product, order ID, issue summary and priority level.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendly */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${calendlyEnabled ? "bg-blue-100" : "bg-slate-100"}`}>
                          <Calendar className={`w-4 h-4 ${calendlyEnabled ? "text-blue-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            Calendly
                            {calendlyEnabled && calendlyApiToken && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                                <CircleDot className="w-2.5 h-2.5" /> Connected
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400">Auto-book live demos via &quot;book for me&quot;</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setCalendlyEnabled(!calendlyEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          calendlyEnabled ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          calendlyEnabled ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ${calendlyEnabled ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Key className="w-3 h-3" /> Personal Access Token
                        </label>
                        <div className="relative">
                          <input
                            type={showCalendlyToken ? "text" : "password"}
                            value={calendlyApiToken}
                            onChange={(e) => setCalendlyApiToken(e.target.value)}
                            placeholder="Your Calendly API token"
                            className="w-full h-11 px-4 pr-11 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                          />
                          <button
                            onClick={() => setShowCalendlyToken(!showCalendlyToken)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showCalendlyToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <a
                          href="https://calendly.com/integrations/api_webhooks"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-500 hover:text-blue-600 mt-0.5"
                        >
                          Get your token <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Globe className="w-3 h-3" /> Event Type URI
                        </label>
                        <input
                          value={calendlyEventTypeUri}
                          onChange={(e) => setCalendlyEventTypeUri(e.target.value)}
                          placeholder="https://api.calendly.com/event_types/XXXXX"
                          className="w-full h-11 px-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                        />
                        <p className="text-[11px] text-slate-400">The event type URI for live demo bookings</p>
                      </div>
                      <div className="flex items-start gap-3 p-3.5 bg-blue-50/80 border border-blue-200/60 rounded-xl">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700 leading-relaxed">
                          Customers say &quot;book for me&quot; and the bot fetches available slots, lets them choose, and books automatically. The Calendly link is always shared regardless of this setting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration status overview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-4 rounded-xl border ${teleCrmEnabled && teleCrmApiKey ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${teleCrmEnabled && teleCrmApiKey ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-xs font-semibold text-slate-600">TeleCRM</span>
                    </div>
                    <p className={`text-[11px] ${teleCrmEnabled && teleCrmApiKey ? "text-emerald-600" : "text-slate-400"}`}>
                      {teleCrmEnabled && teleCrmApiKey ? "Active — leads auto-pushed" : "Not configured"}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl border ${calendlyEnabled && calendlyApiToken ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-200"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${calendlyEnabled && calendlyApiToken ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-xs font-semibold text-slate-600">Calendly</span>
                    </div>
                    <p className={`text-[11px] ${calendlyEnabled && calendlyApiToken ? "text-emerald-600" : "text-slate-400"}`}>
                      {calendlyEnabled && calendlyApiToken ? "Active — auto-booking on" : "Not configured"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ────── LINKS & PRICING TAB ────── */}
            {activeTab === "links" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Links */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Link2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Bot Links</h3>
                        <p className="text-xs text-slate-400">URLs shared by the bot during conversations</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "Warranty Registration", value: warrantyLink, setter: setWarrantyLink, placeholder: "https://warranty.yourbrand.com", icon: <Shield className="w-3.5 h-3.5 text-green-500" /> },
                      { label: "Calendly Booking Page", value: calendlyLink, setter: setCalendlyLink, placeholder: "https://calendly.com/your-brand", icon: <Calendar className="w-3.5 h-3.5 text-blue-500" /> },
                      { label: "Website / Support Page", value: websiteLink, setter: setWebsiteLink, placeholder: "https://www.yourbrand.com", icon: <Globe className="w-3.5 h-3.5 text-violet-500" /> },
                    ].map((link) => (
                      <div key={link.label} className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          {link.icon} {link.label}
                        </label>
                        <div className="relative group">
                          <input
                            value={link.value}
                            onChange={(e) => link.setter(e.target.value)}
                            placeholder={link.placeholder}
                            className="w-full h-11 px-4 pr-10 bg-slate-50 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                          />
                          {link.value && (
                            <a
                              href={link.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-500 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Home Service Pricing</h3>
                        <p className="text-xs text-slate-400">Pricing info shared for home service requests</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                        <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="w-3 h-3" /> Within Warranty
                        </label>
                        <input
                          value={withinWarranty}
                          onChange={(e) => setWithinWarranty(e.target.value)}
                          className="w-full h-11 px-4 bg-white rounded-xl border border-emerald-200 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/60 space-y-2">
                        <label className="text-xs font-semibold text-orange-700 uppercase tracking-wider flex items-center gap-1.5">
                          <IndianRupee className="w-3 h-3" /> Outside Warranty
                        </label>
                        <input
                          value={outsideWarranty}
                          onChange={(e) => setOutsideWarranty(e.target.value)}
                          className="w-full h-11 px-4 bg-white rounded-xl border border-orange-200 text-sm text-slate-800 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ────── ADVANCED TAB ────── */}
            {activeTab === "advanced" && (
              <div className="space-y-5 animate-in fade-in duration-300">
                {/* Custom Prompt */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Custom System Prompt</h3>
                        <p className="text-xs text-slate-400">Extra instructions appended to the GPT system prompt</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Add custom behavior rules, tone adjustments, or product-specific instructions..."
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all resize-none leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-2">
                      {customPrompt.length}/2000 characters
                    </p>
                  </div>
                </div>

                {/* Escalation Keywords */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">Escalation Keywords</h3>
                        <p className="text-xs text-slate-400">Additional keywords that trigger immediate escalation</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <input
                      value={extraKeywords}
                      onChange={(e) => setExtraKeywords(e.target.value)}
                      placeholder="refund, legal, complaint, fraud, ..."
                      className="w-full h-11 px-4 bg-slate-50 rounded-xl border border-slate-200 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none transition-all"
                    />
                    <p className="text-[11px] text-slate-400 mt-2">Comma-separated. These extend the default escalation triggers.</p>
                    {extraKeywords && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {extraKeywords.split(",").map((k) => k.trim()).filter(Boolean).map((keyword, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200/60 text-[11px] font-medium text-red-700">
                            <ChevronRight className="w-3 h-3" /> {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== BOTTOM SAVE BAR ===== */}
          <div className="sticky bottom-4 mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shadow-lg transition-all ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-xl hover:shadow-orange-200 disabled:opacity-50"
              }`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : saved ? "All Saved!" : "Save All Settings"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
