"use client";

import { whatsappInboxAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Save,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

interface AutomationForm {
  configured: boolean;
  connectionSource?: "workspace" | "assigned-number";
  metaPhoneNumberId: string;
  metaAccessToken: string;
  whatsappNumber: string;
  businessName: string;
  botName: string;
  welcomeMessage: string;
  customPrompt: string;
  aiProvider: "openai" | "gemini";
  aiModel: string;
  enableWhatsAppBot: boolean;
  timezone: string;
}

const PROMPT_WORD_LIMIT = 8000;
const DEFAULT_PROMPT = `Represent our business as a helpful sales assistant.
Understand what the contact needs before recommending a product or service.
Collect the contact's name, company, requirement, product or service interest, budget, location, purchase timeline, and preferred follow-up method when relevant.
Do not ask for every detail at once. Ask short, natural follow-up questions.
If pricing, availability, policy, or delivery information is not included in these instructions, offer a human follow-up instead of guessing.
Treat requests for demos, quotations, callbacks, and urgent purchases as high-intent enquiries.`;

const EMPTY_FORM: AutomationForm = {
  configured: false,
  metaPhoneNumberId: "",
  metaAccessToken: "",
  whatsappNumber: "",
  businessName: "",
  botName: "Sales Assistant",
  welcomeMessage: "Hello! Thanks for contacting us. How can I help you today?",
  customPrompt: DEFAULT_PROMPT,
  aiProvider: "openai",
  aiModel: "",
  enableWhatsAppBot: true,
  timezone: "Asia/Kolkata",
};

const countWords = (value: string) => value.trim() ? value.trim().split(/\s+/u).length : 0;

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={event => onChange(event.target.value)}
        autoComplete={type === "password" ? "new-password" : undefined}
        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
    </label>
  );
}

export default function WhatsAppAutomationPanel() {
  const [expanded, setExpanded] = useState(true);
  const [form, setForm] = useState<AutomationForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const wordCount = countWords(form.customPrompt);

  const query = useQuery({
    queryKey: ["lead-whatsapp-inbox", "automation"],
    queryFn: async () => (await whatsappInboxAPI.getAutomation()).data.data,
  });
  const queryError = query.error as { response?: { data?: { error?: string; message?: string } }; message?: string } | null;

  useEffect(() => {
    if (!query.data) return;
    setForm(current => ({
      ...current,
      ...query.data,
      metaAccessToken: "",
      customPrompt: query.data.customPrompt || (query.data.configured ? "" : DEFAULT_PROMPT),
    }));
  }, [query.data]);

  const set = <K extends keyof AutomationForm>(key: K, value: AutomationForm[K]) => {
    setForm(current => ({ ...current, [key]: value }));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const response = await whatsappInboxAPI.saveAutomation({
        metaPhoneNumberId: form.metaPhoneNumberId,
        ...(form.metaAccessToken ? { metaAccessToken: form.metaAccessToken } : {}),
        whatsappNumber: form.whatsappNumber,
        businessName: form.businessName,
        botName: form.botName,
        welcomeMessage: form.welcomeMessage,
        customPrompt: form.customPrompt,
        aiProvider: form.aiProvider,
        aiModel: form.aiModel,
        enableWhatsAppBot: form.enableWhatsAppBot,
        timezone: form.timezone,
      });
      setForm(current => ({ ...current, ...response.data.data, configured: true, metaAccessToken: "" }));
      setNotice({ type: "success", text: "WhatsApp automation saved. New messages will use this Lead prompt." });
      void query.refetch();
    } catch (error: any) {
      setNotice({ type: "error", text: error?.response?.data?.error || "Could not save WhatsApp automation." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(value => !value)}
        className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-600 p-2.5 text-white"><Bot className="h-5 w-5" /></div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-slate-900">Automation settings</h2>
              {form.configured && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3 w-3" /> Connected</span>}
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Connect Meta, define the Lead prompt, and enable automatic replies.</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
      </button>

      {expanded && (query.isLoading ? (
        <div className="flex h-36 items-center justify-center"><RefreshCw className="h-5 w-5 animate-spin text-emerald-600" /></div>
      ) : query.isError ? (
        <div className="border-t border-emerald-100 p-5 text-sm text-red-600">
          {queryError?.response?.data?.error || queryError?.response?.data?.message || queryError?.message || "Could not load WhatsApp automation settings."}
        </div>
      ) : (
        <form onSubmit={save} className="border-t border-emerald-100">
          <div className="p-5">
            <div className="space-y-5">
              {!form.configured && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  No WhatsApp connection is saved for this workspace yet. Enter its Meta credentials below to connect it.
                </div>
              )}
              {form.configured && form.connectionSource === "assigned-number" && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  This existing WhatsApp connection was matched securely using the workspace&apos;s assigned phone number.
                </div>
              )}
              <div><h3 className="text-sm font-bold text-slate-900">Meta WhatsApp connection</h3><p className="mt-1 text-xs text-slate-500">Use credentials from your Meta WhatsApp Business app.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Business name" required value={form.businessName} onChange={value => set("businessName", value)} />
                <Field label="Assistant name" required value={form.botName} onChange={value => set("botName", value)} />
                <Field label="WhatsApp number with country code" required value={form.whatsappNumber} onChange={value => set("whatsappNumber", value)} placeholder="+919876543210" />
                <Field label="Meta Phone Number ID" required value={form.metaPhoneNumberId} onChange={value => set("metaPhoneNumberId", value)} />
                <div className="sm:col-span-2"><Field label={form.configured ? "New permanent access token (leave blank to keep existing)" : "Meta permanent access token"} type="password" required={!form.configured} value={form.metaAccessToken} onChange={value => set("metaAccessToken", value)} /></div>
              </div>

              <div className="border-t border-slate-100 pt-5"><h3 className="text-sm font-bold text-slate-900">AI behavior and Lead prompt</h3><p className="mt-1 text-xs text-slate-500">Add business facts, qualification questions, pricing rules, handoff rules, tone, and languages.</p></div>
              <Field label="Welcome message" value={form.welcomeMessage} onChange={value => set("welcomeMessage", value)} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-slate-600">Lead automation prompt</span>
                <textarea
                  rows={10}
                  value={form.customPrompt}
                  onChange={event => { if (countWords(event.target.value) <= PROMPT_WORD_LIMIT) set("customPrompt", event.target.value); }}
                  placeholder="Describe your business, products, ideal lead, qualification rules, and human handoff..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                />
                <span className="mt-1 block text-right text-xs text-slate-400">{wordCount}/{PROMPT_WORD_LIMIT} words</span>
              </label>
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-slate-600">AI provider</span>
                  <select value={form.aiProvider} onChange={event => set("aiProvider", event.target.value as "openai" | "gemini")} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-400">
                    <option value="openai">OpenAI</option><option value="gemini">Gemini</option>
                  </select>
                </label>
                <Field label="Model override (optional)" value={form.aiModel} onChange={value => set("aiModel", value)} placeholder={form.aiProvider === "gemini" ? "gemini-2.5-flash" : "gpt-4o"} />
                <Field label="Timezone" value={form.timezone} onChange={value => set("timezone", value)} />
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.enableWhatsAppBot} onChange={event => set("enableWhatsAppBot", event.target.checked)} className="h-4 w-4" /> Enable automatic AI replies</label>
            </div>

          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>{notice && <p className={`text-sm font-medium ${notice.type === "success" ? "text-emerald-700" : "text-red-600"}`}>{notice.text}</p>}</div>
            <button disabled={saving || wordCount > PROMPT_WORD_LIMIT} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{saving ? "Saving..." : form.configured ? "Save automation" : "Connect automation"}</button>
          </div>
        </form>
      ))}
    </section>
  );
}
