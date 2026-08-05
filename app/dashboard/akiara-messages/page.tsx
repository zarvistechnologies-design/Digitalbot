"use client";

import Sidebar from "@/components/Sidebar";
import { akiaraAPI, tenantAPI } from "@/lib/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Menu,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface TemplateVariable {
  key: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  language?: string;
  body: string;
  variables?: TemplateVariable[];
  active?: boolean;
}

interface MessageHistory {
  _id: string;
  phone: string;
  message: string;
  type: "text" | "template";
  templateId?: string | null;
  templateName?: string | null;
  variables?: Record<string, string>;
  sentBy: string;
  status: "sent" | "failed";
  error?: string | null;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  assignedPhoneNumber: string;
  role: string;
  tenantId: string;
  selectedService: string;
}

interface TenantData {
  tenantId: string;
  brandName: string;
}

interface BulkSendResult {
  phone?: string;
  input?: string;
  status: "queued" | "sent" | "failed" | "skipped";
  messageId?: string;
  error?: string;
}

interface BulkCampaign {
  _id: string;
  status: "queued" | "running" | "completed" | "failed";
  total: number;
  validRecipients: number;
  sent: number;
  failed: number;
  skipped: number;
  results: BulkSendResult[];
  error?: string;
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return `+91 ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return phone;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function extractVariables(body: string): TemplateVariable[] {
  const matches = body.match(/{{\s*[\w.-]+\s*}}/g) || [];
  const keys = Array.from(new Set(matches.map((match) => match.replace(/[{}]/g, "").trim())));
  return keys.map((key) => ({ key, label: key, required: true }));
}

function renderPreview(template: MessageTemplate | undefined, values: Record<string, string>) {
  if (!template) return "";
  const variables = template.variables?.length ? template.variables : extractVariables(template.body);
  return variables.reduce((text, variable, index) => {
    const value = values[variable.key] || variable.defaultValue || `[${variable.label || variable.key}]`;
    const byKey = new RegExp(`{{\\s*${variable.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*}}`, "g");
    const byIndex = new RegExp(`{{\\s*${index + 1}\\s*}}`, "g");
    return text.replace(byKey, value).replace(byIndex, value);
  }, template.body);
}

function parseBulkPhoneInput(value: string) {
  return value
    .split(/[\n,;\t ]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AkiaraMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [resolvedTenantId, setResolvedTenantId] = useState("");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [sendMode, setSendMode] = useState<"single" | "bulk">("single");
  const [phone, setPhone] = useState("");
  const [bulkPhones, setBulkPhones] = useState("");
  const [bulkResults, setBulkResults] = useState<BulkSendResult[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [activeBulkCampaign, setActiveBulkCampaign] = useState<BulkCampaign | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedMessage, setExpandedMessage] = useState<MessageHistory | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    setUserLoaded(true);
  }, []);

  useEffect(() => {
    if (!userLoaded) return;
    if (user?.selectedService === "akiara" && user?.tenantId) {
      setResolvedTenantId(user.tenantId);
      return;
    }

    const resolveTenant = async () => {
      try {
        const res = await tenantAPI.getTenants();
        const tenants = res.data?.data || [];
        const tenant = tenants.find((item: TenantData) => (
          item.tenantId === "akiara" || item.brandName?.toLowerCase() === "akiara"
        ));
        setResolvedTenantId(tenant?.tenantId || "");
      } catch (err) {
        console.error("Failed to resolve Akiara tenant:", err);
      }
    };

    resolveTenant();
  }, [userLoaded, user]);

  const tenantId = resolvedTenantId;
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId),
    [templates, selectedTemplateId]
  );
  const selectedVariables = selectedTemplate?.variables?.length
    ? selectedTemplate.variables
    : selectedTemplate
      ? extractVariables(selectedTemplate.body)
      : [];
  const preview = renderPreview(selectedTemplate, variableValues);
  const bulkPhoneCount = useMemo(() => parseBulkPhoneInput(bulkPhones).length, [bulkPhones]);
  const uniqueBulkPhoneCount = useMemo(() => {
    const normalized = parseBulkPhoneInput(bulkPhones)
      .map((item) => item.replace(/\D/g, ""))
      .map((digits) => (digits.length === 10 ? `91${digits}` : digits))
      .filter(Boolean);
    return new Set(normalized).size;
  }, [bulkPhones]);

  const fetchTemplates = useCallback(async () => {
    if (!tenantId) return;
    setTemplatesLoading(true);
    try {
      const res = await akiaraAPI.getMessageTemplates({ tenantId });
      const data = res.data?.data || [];
      setTemplates(data);
      if (!selectedTemplateId && data.length > 0) {
        setSelectedTemplateId(data[0].id);
        const defaults: Record<string, string> = {};
        (data[0].variables || extractVariables(data[0].body)).forEach((variable: TemplateVariable) => {
          defaults[variable.key] = variable.defaultValue || "";
        });
        setVariableValues(defaults);
      }
    } catch (err) {
      console.error("Failed to fetch templates:", err);
    } finally {
      setTemplatesLoading(false);
    }
  }, [tenantId, selectedTemplateId]);

  const fetchHistory = useCallback(async () => {
    if (!tenantId) return;
    setHistoryLoading(true);
    try {
      const res = await akiaraAPI.getMessageHistory({
        tenantId,
        page,
        limit: 20,
        search: search || undefined,
        type: filterType !== "all" ? filterType : undefined,
      });
      setHistory(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch message history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [tenantId, page, search, filterType]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { setPage(1); }, [search, filterType]);
  useEffect(() => {
    if (!activeBulkCampaign || !tenantId || !["queued", "running"].includes(activeBulkCampaign.status)) return;

    const timer = window.setInterval(async () => {
      try {
        const res = await akiaraAPI.getBulkCampaign(activeBulkCampaign._id, { tenantId });
        const campaign = res.data?.data;
        if (!campaign) return;
        setActiveBulkCampaign(campaign);
        setBulkResults(campaign.results || []);
        if (["completed", "failed"].includes(campaign.status)) {
          setSendResult({
            type: campaign.status === "completed" ? "success" : "error",
            message: campaign.status === "completed"
              ? `Bulk campaign completed: ${campaign.sent || 0} sent, ${campaign.failed || 0} failed, ${campaign.skipped || 0} skipped.`
              : campaign.error || "Bulk campaign failed.",
          });
          setSending(false);
          fetchHistory();
        }
      } catch (err) {
        console.error("Failed to fetch bulk campaign:", err);
      }
    }, 2500);

    return () => window.clearInterval(timer);
  }, [activeBulkCampaign, tenantId, fetchHistory]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setSendResult(null);
    setBulkResults([]);
    const template = templates.find((item) => item.id === templateId);
    const defaults: Record<string, string> = {};
    const variables = template?.variables?.length ? template.variables : template ? extractVariables(template.body) : [];
    variables.forEach((variable) => {
      defaults[variable.key] = variable.defaultValue || "";
    });
    setVariableValues(defaults);
  };

  const handleSend = async () => {
    if (!selectedTemplate || !phone.trim()) return;
    const missing = selectedVariables.filter((variable) => variable.required !== false && !variableValues[variable.key]?.trim());
    if (missing.length) {
      setSendResult({ type: "error", message: `Fill required fields: ${missing.map((item) => item.label).join(", ")}` });
      return;
    }

    setSending(true);
    setSendResult(null);
    try {
      await akiaraAPI.sendTemplateMessage({
        phone,
        tenantId,
        templateId: selectedTemplate.id,
        variables: variableValues,
      });
      setSendResult({ type: "success", message: "Template message sent successfully." });
      setPhone("");
      setVariableValues(Object.fromEntries(selectedVariables.map((variable) => [variable.key, variable.defaultValue || ""])));
      fetchHistory();
    } catch (err: any) {
      setSendResult({ type: "error", message: err.response?.data?.error || "Failed to send template message." });
    } finally {
      setSending(false);
    }
  };

  const validateBulkSend = () => {
    if (!selectedTemplate || bulkPhoneCount === 0) return;
    const missing = selectedVariables.filter((variable) => variable.required !== false && !variableValues[variable.key]?.trim());
    if (missing.length) {
      setSendResult({ type: "error", message: `Fill required fields: ${missing.map((item) => item.label).join(", ")}` });
      return;
    }
    setSendResult(null);
    setBulkConfirmOpen(true);
  };

  const queueBulkSend = async () => {
    if (!selectedTemplate || bulkPhoneCount === 0) return;
    setSending(true);
    setSendResult(null);
    setBulkResults([]);
    setActiveBulkCampaign(null);
    setBulkConfirmOpen(false);
    try {
      const res = await akiaraAPI.sendBulkTemplateMessage({
        phones: parseBulkPhoneInput(bulkPhones),
        tenantId,
        templateId: selectedTemplate.id,
        variables: variableValues,
      });
      const data = res.data || {};
      const campaign = data.data;
      setActiveBulkCampaign(campaign || null);
      setBulkResults(campaign?.results || []);
      setSendResult({
        type: "success",
        message: data.message || "Bulk campaign queued.",
      });
    } catch (err: any) {
      setBulkResults(err.response?.data?.results || []);
      setSendResult({ type: "error", message: err.response?.data?.error || "Failed to send bulk template message." });
      setSending(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await akiaraAPI.deleteMessageHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to delete message history:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-xl shadow-lg border border-slate-200/80">
        {sidebarOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
      </button>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSidebarOpen(false)}>
          <div className="w-64 h-full" onClick={(event) => event.stopPropagation()}>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          </div>
        </div>
      )}
      <div className="hidden lg:block"><Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /></div>

      <main className="flex-1 lg:ml-60 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-200">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Messages</h1>
                <p className="text-sm text-slate-500">Send tenant templates and track WhatsApp message history</p>
              </div>
            </div>
            <button onClick={() => { fetchTemplates(); fetchHistory(); }} className="h-10 px-4 bg-white rounded-xl border border-slate-200 shadow-sm text-sm text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Template</p>
                {templatesLoading ? (
                  <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
                ) : templates.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
                    No templates found. Add templates in <Link href="/dashboard/akiara-settings" className="font-semibold underline">Settings</Link>.
                  </div>
                ) : (
                  <select value={selectedTemplateId} onChange={(event) => handleTemplateChange(event.target.value)} className="w-full h-11 px-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-200 focus:outline-none">
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => { setSendMode("single"); setSendResult(null); setBulkResults([]); }}
                  className={`h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${sendMode === "single" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Phone className="w-4 h-4" /> Single
                </button>
                <button
                  type="button"
                  onClick={() => { setSendMode("bulk"); setSendResult(null); }}
                  className={`h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${sendMode === "bulk" ? "bg-white text-orange-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Users className="w-4 h-4" /> Bulk
                </button>
              </div>

              {sendMode === "single" ? (
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="9876543210" className="w-full h-11 pl-10 pr-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none" />
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Phone Numbers</label>
                    <span className="text-[11px] font-medium text-slate-500">{uniqueBulkPhoneCount} unique / {bulkPhoneCount} entered</span>
                  </div>
                  <textarea
                    value={bulkPhones}
                    onChange={(event) => setBulkPhones(event.target.value)}
                    placeholder={"9876543210\n919876543211\n9876543212"}
                    rows={7}
                    className="w-full px-3 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none resize-none"
                  />
                  <p className="mt-2 text-xs text-slate-500">Use one number per line, or separate numbers with commas. Bulk sending is template-only.</p>
                </div>
              )}

              {selectedVariables.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Variables</p>
                  {selectedVariables.map((variable) => (
                    <div key={variable.key}>
                      <label className="text-xs font-medium text-slate-500 mb-1 block">
                        {variable.label || variable.key}{variable.required !== false ? " *" : ""}
                      </label>
                      <input
                        value={variableValues[variable.key] || ""}
                        onChange={(event) => setVariableValues((prev) => ({ ...prev, [variable.key]: event.target.value }))}
                        placeholder={`Enter ${variable.label || variable.key}`}
                        className="w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 focus:bg-white focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}

              {sendResult && (
                <div className={`px-3 py-2 rounded-lg text-sm border ${sendResult.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                  {sendResult.message}
                </div>
              )}

              {sendMode === "bulk" && bulkResults.length > 0 && (
                <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 divide-y divide-slate-200">
                  {activeBulkCampaign && (
                    <div className="px-3 py-2 bg-white text-xs text-slate-600 flex items-center justify-between gap-3">
                      <span className="font-semibold capitalize">{activeBulkCampaign.status}</span>
                      <span>{activeBulkCampaign.sent} sent / {activeBulkCampaign.failed} failed / {activeBulkCampaign.skipped} skipped</span>
                    </div>
                  )}
                  {bulkResults.map((item, index) => (
                    <div key={`${item.phone || item.input || index}-${index}`} className="px-3 py-2 flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-700 truncate">{item.phone ? formatPhone(item.phone) : item.input}</p>
                        {item.error && <p className="text-red-500 mt-0.5 line-clamp-2">{item.error}</p>}
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded-full font-semibold ${item.status === "sent" ? "bg-emerald-100 text-emerald-700" : item.status === "skipped" ? "bg-slate-200 text-slate-600" : item.status === "queued" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={sendMode === "single" ? handleSend : validateBulkSend}
                disabled={sending || !selectedTemplate || (sendMode === "single" ? !phone.trim() : bulkPhoneCount === 0)}
                className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-40"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sendMode === "single" ? "Send Template" : "Send Bulk Template"}
              </button>
            </div>

            <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-5">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-orange-500" />
                <p className="text-sm font-semibold text-slate-700">Preview</p>
              </div>
              <div className="min-h-[260px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {preview || "Select a template to preview the message."}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="flex-1">
                <h2 className="text-base font-bold text-slate-900">Message History</h2>
                <p className="text-xs text-slate-400">{total} total messages</p>
              </div>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search phone, template, message..." className="w-full h-10 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-orange-200 focus:outline-none" />
              </div>
              <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 focus:ring-2 focus:ring-orange-200 focus:outline-none">
                <option value="all">All Types</option>
                <option value="template">Templates</option>
                <option value="text">Text</option>
              </select>
            </div>

            {historyLoading ? (
              <div className="py-16 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                Loading history...
              </div>
            ) : history.length === 0 ? (
              <div className="py-16 text-center text-slate-400">No messages found</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.map((item) => (
                  <div key={item._id} className="p-4 hover:bg-slate-50/70 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center">
                      <div className="md:col-span-2">
                        <p className="font-semibold text-sm text-slate-800">{formatPhone(item.phone)}</p>
                        <p className="text-[11px] text-slate-400">{formatDate(item.createdAt)}</p>
                      </div>
                      <button onClick={() => setExpandedMessage(item)} className="md:col-span-6 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          {item.type === "template" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200 text-[11px] font-semibold">
                              <FileText className="w-3 h-3" /> {item.templateName || "Template"}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${item.status === "sent" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                            {item.status === "sent" && <Check className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                        {item.error && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
                      </button>
                      <div className="md:col-span-3 text-xs text-slate-400 truncate">
                        Sent by <span className="text-slate-600">{item.sentBy || "admin"}</span>
                      </div>
                      <div className="md:col-span-1 flex md:justify-end">
                        <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 flex items-center gap-1">
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 disabled:opacity-40 flex items-center gap-1">
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {bulkConfirmOpen && selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBulkConfirmOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between">
              <p className="font-semibold text-sm">Confirm Bulk Campaign</p>
              <button onClick={() => setBulkConfirmOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Entered</p>
                  <p className="text-xl font-bold text-slate-900">{bulkPhoneCount}</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Unique</p>
                  <p className="text-xl font-bold text-slate-900">{uniqueBulkPhoneCount}</p>
                </div>
                <div className="rounded-xl bg-orange-50 border border-orange-200 p-3">
                  <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">Template</p>
                  <p className="text-sm font-bold text-orange-700 truncate">{selectedTemplate.name}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Message Preview</p>
                <div className="max-h-52 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {preview}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                <button
                  onClick={() => setBulkConfirmOpen(false)}
                  className="h-10 px-4 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={queueBulkSend}
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg"
                >
                  <Send className="w-4 h-4" /> Queue Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {expandedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setExpandedMessage(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-between">
              <p className="font-semibold text-sm">Message Details</p>
              <button onClick={() => setExpandedMessage(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(85vh-48px)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">{formatPhone(expandedMessage.phone)}</p>
                <p className="text-xs text-slate-400">{formatDate(expandedMessage.createdAt)}</p>
              </div>
              {expandedMessage.templateName && (
                <span className="inline-flex px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold">
                  {expandedMessage.templateName}
                </span>
              )}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {expandedMessage.message}
              </div>
              {expandedMessage.variables && Object.keys(expandedMessage.variables).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Variables</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(expandedMessage.variables).map(([key, value]) => (
                      <span key={key} className="px-2.5 py-1 rounded-lg bg-slate-100 text-xs text-slate-600">
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
