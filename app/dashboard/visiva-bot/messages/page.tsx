"use client";

import { visivaBotAPI } from "@/lib/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { VisivaPageShell } from "../_components/VisivaPageShell";
import { formatPhone, timeAgo } from "../_components/visiva-utils";

interface TemplateVariable {
  key: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}

interface VisivaTemplate {
  _id: string;
  name: string;
  templateId: string;
  language: string;
  body: string;
  variables: TemplateVariable[];
  active: boolean;
}

interface MessageHistory {
  _id: string;
  phone: string;
  message: string;
  type: string;
  templateName?: string | null;
  variables?: Record<string, string>;
  sentBy: string;
  status: string;
  error?: string | null;
  createdAt: string;
}

function renderPreview(template: VisivaTemplate | undefined, values: Record<string, string>) {
  if (!template) return "";
  return (template.variables || []).reduce((text, variable) => {
    const value = values[variable.key] || variable.defaultValue || `[${variable.label || variable.key}]`;
    return text.replace(new RegExp(`{{\\s*${variable.key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*}}`, "g"), value);
  }, template.body);
}

export default function VisivaMessagesPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [templatePhone, setTemplatePhone] = useState("");
  const [templates, setTemplates] = useState<VisivaTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<MessageHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [sendingText, setSendingText] = useState(false);
  const [sendingTemplate, setSendingTemplate] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [expandedMessage, setExpandedMessage] = useState<MessageHistory | null>(null);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template._id === selectedTemplateId),
    [templates, selectedTemplateId]
  );
  const preview = renderPreview(selectedTemplate, variableValues);

  const fetchTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await visivaBotAPI.getTemplates({ active: true });
      const data = res.data?.data || [];
      setTemplates(data);
      if (!selectedTemplateId && data.length > 0) {
        const first = data[0] as VisivaTemplate;
        setSelectedTemplateId(first._id);
        setVariableValues(Object.fromEntries((first.variables || []).map((item) => [item.key, item.defaultValue || ""])));
      }
    } catch (err) {
      console.error("Failed to fetch Visiva templates:", err);
    } finally {
      setLoadingTemplates(false);
    }
  }, [selectedTemplateId]);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await visivaBotAPI.getMessageHistory({
        page,
        limit: 20,
        search: search || undefined,
        type: filterType !== "all" ? filterType : undefined,
      });
      setHistory(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch Visiva message history:", err);
    } finally {
      setLoadingHistory(false);
    }
  }, [filterType, page, search]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);
  useEffect(() => { fetchHistory(); }, [fetchHistory]);
  useEffect(() => { setPage(1); }, [search, filterType]);

  const handleTemplateChange = (id: string) => {
    const template = templates.find((item) => item._id === id);
    setSelectedTemplateId(id);
    setResult(null);
    setVariableValues(Object.fromEntries((template?.variables || []).map((item) => [item.key, item.defaultValue || ""])));
  };

  const handleSendText = async () => {
    if (!phone.trim() || !message.trim()) return;
    setSendingText(true);
    setResult(null);
    try {
      await visivaBotAPI.sendMessage({ phone, message });
      setResult({ type: "success", text: "Message sent." });
      setPhone("");
      setMessage("");
      fetchHistory();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setResult({ type: "error", text: error.response?.data?.error || "Failed to send message." });
    } finally {
      setSendingText(false);
    }
  };

  const handleSendTemplate = async () => {
    if (!templatePhone.trim() || !selectedTemplate) return;
    const missing = (selectedTemplate.variables || []).filter((item) => item.required !== false && !variableValues[item.key]?.trim());
    if (missing.length) {
      setResult({ type: "error", text: `Fill required fields: ${missing.map((item) => item.label).join(", ")}` });
      return;
    }
    setSendingTemplate(true);
    setResult(null);
    try {
      await visivaBotAPI.sendTemplateMessage({
        phone: templatePhone,
        templateId: selectedTemplate._id,
        variables: variableValues,
      });
      setResult({ type: "success", text: "Template sent." });
      setTemplatePhone("");
      setVariableValues(Object.fromEntries((selectedTemplate.variables || []).map((item) => [item.key, item.defaultValue || ""])));
      fetchHistory();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      setResult({ type: "error", text: error.response?.data?.error || "Failed to send template." });
    } finally {
      setSendingTemplate(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await visivaBotAPI.deleteMessageHistory(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  return (
    <VisivaPageShell
      title="Quick Messages"
      description="Send WhatsApp messages and template follow-ups"
      icon={<Send className="w-5 h-5 text-white" />}
      actions={
        <button onClick={() => { fetchTemplates(); fetchHistory(); }} className="h-10 px-4 bg-white rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      }
    >
      {result && (
        <div className={`px-4 py-3 rounded-xl border text-sm ${result.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {result.text}
        </div>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Custom Message</h2>
          </div>
          <label className="block">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</span>
            <div className="relative mt-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Full WhatsApp number" className="w-full h-11 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={7} className="mt-1 w-full px-3 py-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none resize-none" />
          </label>
          <button onClick={handleSendText} disabled={sendingText || !phone.trim() || !message.trim()} className="w-full h-11 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            {sendingText ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Message
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <h2 className="font-semibold text-slate-900">Template Message</h2>
          </div>

          {loadingTemplates ? (
            <div className="h-28 rounded-lg bg-slate-100 animate-pulse" />
          ) : templates.length === 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No templates available.
            </div>
          ) : (
            <>
              <select value={selectedTemplateId} onChange={(event) => handleTemplateChange(event.target.value)} className="w-full h-11 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                {templates.map((template) => <option key={template._id} value={template._id}>{template.name}</option>)}
              </select>
              <input value={templatePhone} onChange={(event) => setTemplatePhone(event.target.value)} placeholder="Full WhatsApp number" className="w-full h-11 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
              {(selectedTemplate?.variables || []).map((variable) => (
                <label key={variable.key} className="block">
                  <span className="text-xs font-semibold text-slate-500">{variable.label}{variable.required !== false ? " *" : ""}</span>
                  <input
                    value={variableValues[variable.key] || ""}
                    onChange={(event) => setVariableValues((prev) => ({ ...prev, [variable.key]: event.target.value }))}
                    className="mt-1 w-full h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none"
                  />
                </label>
              ))}
              <div className="min-h-24 bg-slate-50 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 whitespace-pre-wrap">{preview}</div>
              <button onClick={handleSendTemplate} disabled={sendingTemplate || !templatePhone.trim() || !selectedTemplate} className="w-full h-11 rounded-lg bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                {sendingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Template
              </button>
            </>
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900">Message History</h2>
            <p className="text-xs text-slate-400">{total} total messages</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search history..." className="w-full h-10 pl-10 pr-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-200 focus:outline-none" />
          </div>
          <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="h-10 px-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
            <option value="all">All types</option>
            <option value="text">Text</option>
            <option value="template">Template</option>
          </select>
        </div>

        {loadingHistory ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center text-slate-400">No messages found</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item) => (
              <div key={item._id} className="p-4 hover:bg-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:items-center">
                  <div className="md:col-span-2">
                    <p className="font-semibold text-sm text-slate-900">{formatPhone(item.phone)}</p>
                    <p className="text-xs text-slate-400">{timeAgo(item.createdAt)}</p>
                  </div>
                  <button onClick={() => setExpandedMessage(item)} className="md:col-span-7 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      {item.type === "template" && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">{item.templateName || "Template"}</span>}
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${item.status === "sent" ? "bg-sky-50 text-sky-700" : "bg-red-50 text-red-700"}`}>
                        {item.status === "sent" && <Check className="inline w-3 h-3 mr-1" />}
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                    {item.error && <p className="text-xs text-red-500 mt-1">{item.error}</p>}
                  </button>
                  <div className="md:col-span-2 text-xs text-slate-400">Sent by <span className="text-slate-600">{item.sentBy || "admin"}</span></div>
                  <div className="md:col-span-1 flex md:justify-end">
                    <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50" aria-label="Delete message">
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
              <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1 disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} className="h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1 disabled:opacity-40">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {expandedMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setExpandedMessage(null)}>
          <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={(event) => event.stopPropagation()}>
            <div className="px-5 py-3 bg-emerald-600 text-white flex items-center justify-between">
              <p className="font-semibold text-sm">Message Details</p>
              <button onClick={() => setExpandedMessage(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-slate-900">{formatPhone(expandedMessage.phone)}</p>
                <p className="text-xs text-slate-400">{new Date(expandedMessage.createdAt).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap">{expandedMessage.message}</div>
            </div>
          </div>
        </div>
      )}
    </VisivaPageShell>
  );
}
