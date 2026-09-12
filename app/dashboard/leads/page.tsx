"use client";
import Sidebar from "@/components/Sidebar";
import SheetAutomationModal from "@/components/leads/SheetAutomationModal";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileSpreadsheet,
  Hash,
  Menu,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Settings2,
  Sparkles,
  Target,
  X,
  XCircle,
  Zap,
} from "lucide-react";

// ==========================================
// CONFIGURATION - FORCE LOCALHOST FOR DEVELOPMENT
// ==========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://digital-api-46ss.onrender.com/ws';

// ==========================================
// TYPES
// ==========================================
type Call = {
  _id?: string;
  id?: string;
  call_id?: string;
  session_id?: string;
  from_number?: string;
  to_number?: string;
  status?: string;
  startTime?: string;
  start_time?: string;
  duration?: number;
  direction?: string;
  transcription?: string;
  transcription_formatted?: string;
  transcript?: string;
  chat?: unknown;
  isLead?: boolean;
  name?: string;
  phone?: string;
  alternatePhoneNumber?: string;
  confidence?: number;
  productInterest?: string;
  customerNeed?: string;
  leadAnalysisAt?: string;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
};

type FilterStatus = 'all' | 'leads' | 'no-leads' | 'pending';
type SortField = 'startTime' | 'duration' | 'confidence';
type SortOrder = 'asc' | 'desc';

type BulkAnalysisProgress = {
  total: number;
  completed: number;
  failed: number;
  running: boolean;
};

const BULK_ANALYSIS_CONCURRENCY = 8;

// Default prompt template - Simple lead qualification
const DEFAULT_PROMPT = `You are an expert at analyzing sales call transcripts to identify potential leads.

Analyze the following call transcription and determine if this represents a potential sales lead.

A call is considered a LEAD if:
- Customer shows interest in a product or service
- Customer asks about pricing, features, or details
- Customer wants more information
- Customer expresses a need or problem
- Customer is inquiring about solutions
- There's potential for a business opportunity

Qualification rules:
- Understand and qualify the customer's intent in any language or script, including mixed-language conversations. Do not require English keywords.
- Judge only the customer's statements, not sales claims or offers made only by the assistant.
- A specific requirement, request for products, pricing/catalogue request, accepted follow-up, or confirmed contact number is strong lead evidence.
- Repeated transcript lines are duplicates, not separate evidence.
- Do not qualify a call when only the assistant is selling and the customer gives no interest, need, question, or follow-up consent.

Extract the following information:
1. is_lead: true if this is a potential sales opportunity, false if not
2. customer_name: The customer's actual personal name only if explicitly stated by the customer. Never use greetings, honorifics, or forms of address such as Sir, Sir Ji, Madam, Ma'am, Mam, Ji, customer, or caller. Return an empty string when no real name is stated.
3. phone_number: Customer's phone number if different from caller
4. alternate_phone_number: A different callback or WhatsApp number explicitly given by the customer. Return empty if it is the same as the caller number. Prefix incomplete dictated digits with "INCOMPLETE: "
5. product_interest: What product/service they're interested in
6. customer_need: What problem or need they have
7. confidence_score: How confident you are (0.0 to 1.0)

Language rules:
- Always write customer_name, product_interest, and customer_need in English using Latin letters, regardless of the transcript language.
- Transliterate a real customer name into English letters; do not translate the meaning of a person's name.
- Translate product requirements and customer needs into clear, concise English.
- Keep phone numbers as digits and do not translate or reformat them.

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "is_lead": boolean,
  "customer_name": "string or empty",
  "phone_number": "string or empty",
  "alternate_phone_number": "different number or empty",
  "product_interest": "string or empty",
  "customer_need": "string or empty",
  "confidence_score": number between 0 and 1
}

Transcription: {TRANSCRIPTION_PLACEHOLDER}`;

const REAL_ESTATE_PROMPT = `You are an expert real-estate sales coordinator. Analyze the customer side of this multilingual call and identify genuine property intent.

A lead is qualified when the customer expresses interest in buying, renting, selling, leasing, investing in, or visiting a property. Do not qualify a call based only on claims made by the assistant.

Extract real information only. Translate requirements into concise English, transliterate real names, keep phone numbers unchanged, and never invent missing details.

Respond ONLY with valid JSON in this exact structure:
{
  "is_lead": boolean,
  "customer_name": "string or empty",
  "phone_number": "string or empty",
  "alternate_phone_number": "different callback or WhatsApp number, or empty",
  "product_interest": "short property requirement",
  "customer_need": "short buyer need or motivation",
  "confidence_score": number between 0 and 1,
  "intent": "buy, rent, sell, lease, invest, or empty",
  "property_types": ["apartment, villa, plot, office, shop, warehouse, or other"],
  "configurations": ["1 BHK, 2 BHK, 3 BHK, etc."],
  "preferred_locations": ["location"],
  "budget_min": number or 0,
  "budget_max": number or 0,
  "purchase_purpose": "self_use, investment, business, or empty",
  "financing_status": "self_funded, loan_required, loan_approved, undecided, or empty",
  "possession_preference": "ready_to_move, under_construction, new_launch, or empty",
  "purchase_timeline": "string or empty",
  "visit_readiness": "ready, considering, not_ready, or empty",
  "preferred_visit_date": "YYYY-MM-DD or empty",
  "preferred_visit_time": "string or empty",
  "objections": ["objection"],
  "missing_qualification_fields": ["important missing field"],
  "follow_up_required": boolean,
  "next_action": "specific recommended action"
}

Transcription: {TRANSCRIPTION_PLACEHOLDER}`;

const isRealEstateWorkspace = () => {
  if (typeof window === 'undefined') return false;
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return String(user.selectedService || '').toLowerCase() === 'real-estate-crm';
  } catch {
    return false;
  }
};

const promptStorageKey = () => isRealEstateWorkspace() ? 'leadAnalysisPrompt:real-estate-crm' : 'leadAnalysisPrompt';

// Helper functions
const formatDuration = (sec: number | undefined) => {
  if (sec === undefined) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const formatPhone = (phone: string) => {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  const nationalNumber = digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.length === 11 && digits.startsWith("0")
      ? digits.slice(1)
      : digits;

  if (nationalNumber.length === 10) {
    return `+91 ${nationalNumber.slice(0, 3)}-${nationalNumber.slice(3, 6)}-${nationalNumber.slice(6)}`;
  }

  return phone;
};

const normalizeTranscriptionText = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (typeof item === "object") {
          const msg = item as Record<string, unknown>;
          const role = msg.role || msg.speaker || "Speaker";
          const content = msg.content || msg.text || msg.message || "";
          return content ? `${String(role)}: ${String(content)}` : JSON.stringify(item);
        }
        return String(item);
      })
      .filter(Boolean)
      .join("\n");
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (Array.isArray(obj.chat)) return normalizeTranscriptionText(obj.chat);
    if (Array.isArray(obj.messages)) return normalizeTranscriptionText(obj.messages);
    return Object.values(obj).map((item) => normalizeTranscriptionText(item)).filter(Boolean).join("\n");
  }

  return String(value);
};

const getCallId = (call: Partial<Call>, fallback = ""): string => {
  const id = call._id || call.id || call.call_id || call.session_id || fallback;
  return String(id || "");
};

const getCallTranscription = (call: Partial<Call>): unknown => {
  return call.transcription || call.transcript || call.transcription_formatted || call.chat;
};

const normalizeCall = (call: Call, index: number): Call => {
  const callId = getCallId(call, `call-${index}`);
  return {
    ...call,
    _id: callId,
    transcription: call.transcription || call.transcript || call.transcription_formatted,
    startTime: call.startTime || call.start_time || call.createdAt || call.created_at,
    createdAt: call.createdAt || call.created_at,
  };
};

// Get auth token helper - FORCE DEMO TOKEN
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  console.log('🔑 Token from localStorage:', token);
  return token;
};

// ==================== BADGE COMPONENTS ====================
// Mirrors the dot + soft-surface badge language used across the ledger UI.
function AnalysisStatusBadge({ call }: { call: Call }) {
  const isAnalyzed = call.isLead !== undefined && call.isLead !== null && call.leadAnalysisAt;
  const hasTranscription = Boolean(getCallTranscription(call));

  if (isAnalyzed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Analyzed
      </span>
    );
  }
  if (hasTranscription) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Pending Analysis
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      No Transcription
    </span>
  );
}

function statusRailColor(call: Call) {
  const isAnalyzed = call.isLead !== undefined && call.isLead !== null && call.leadAnalysisAt;
  if (isAnalyzed && call.isLead === true) return "bg-emerald-400";
  if (isAnalyzed && call.isLead === false) return "bg-slate-300";
  if (getCallTranscription(call)) return "bg-amber-400";
  return "bg-slate-200";
}

// Icon Components (kept as simple wrappers so nothing else in the tree needs to change)
const MenuIcon = () => <Menu className="h-6 w-6" />;

// Lead Details Modal Component
const LeadDetailsModal = ({ call, onClose }: { call: Call; onClose: () => void }) => {
  const callId = getCallId(call, "unknown");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        <div className="bg-slate-900 px-5 py-5 sm:px-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">
              Record · {callId.substring(0, 8)}
            </p>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Call Details</h2>
            <div className="mt-3">
              <AnalysisStatusBadge call={call} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-600" />
              Call Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Call ID</p>
                <p className="text-sm text-slate-900 font-mono break-all">{callId}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">Duration</p>
                <p className="text-sm text-slate-900 font-mono">{formatDuration(call.duration)}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">From</p>
                <p className="text-sm text-slate-900 font-mono break-all">{(call.from_number || '')}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-1">To</p>
                <p className="text-sm text-slate-900 font-mono break-all">{(call.to_number || '')}</p>
              </div>
            </div>
          </div>

          {call.isLead && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-emerald-700 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Lead Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {call.name && (
                  <div>
                    <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Customer Name</p>
                    <p className="text-sm font-bold text-emerald-950">{call.name}</p>
                  </div>
                )}
                {call.phone && (
                  <div>
                    <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-emerald-950 font-mono break-all">{formatPhone(call.phone)}</p>
                  </div>
                )}
                {call.alternatePhoneNumber && (
                  <div>
                    <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Alternate / WhatsApp</p>
                    <p className="text-sm font-bold text-emerald-950 font-mono break-all">{formatPhone(call.alternatePhoneNumber)}</p>
                  </div>
                )}
                {call.productInterest && (
                  <div className="col-span-1 sm:col-span-2">
                    <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Product Interest</p>
                    <p className="text-sm text-emerald-950">{call.productInterest}</p>
                  </div>
                )}
                {call.confidence && (
                  <div>
                    <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Confidence Score</p>
                    <p className="text-sm font-bold text-emerald-950 font-mono">{(call.confidence * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>
              {call.customerNeed && (
                <div className="mt-4">
                  <p className="text-[11px] text-emerald-700/80 font-semibold uppercase tracking-wide mb-1">Customer Need</p>
                  <p className="text-sm text-emerald-950">{call.customerNeed}</p>
                </div>
              )}
            </div>
          )}

          {Boolean(getCallTranscription(call)) && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-slate-500 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                Transcription
              </h3>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                {(() => {
                  let t = getCallTranscription(call);
                  if (!t) return null;
                  let messages = [];
                  if (typeof t === 'string') {
                    try {
                      const parsed = JSON.parse(t);
                      if (Array.isArray(parsed)) messages = parsed;
                      else if (parsed.chat && Array.isArray(parsed.chat)) messages = parsed.chat;
                      else if (parsed.messages && Array.isArray(parsed.messages)) messages = parsed.messages;
                      else return <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">{t}</p>;
                    } catch {
                      return <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">{t}</p>;
                    }
                  } else if (Array.isArray(t)) {
                    messages = t;
                  } else if (typeof t === 'object' && t !== null) {
                    if ('chat' in t && Array.isArray((t as any).chat)) messages = (t as any).chat;
                    else if ('messages' in t && Array.isArray((t as any).messages)) messages = (t as any).messages;
                    else return <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">{Object.values(t).join('\n')}</p>;
                  }
                  if (!messages.length) return <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">No transcription available.</p>;
                  return (
                    <div className="space-y-2">
                      {messages.map((msg: any, idx: number) => {
                        const role = msg.role || msg.speaker || '';
                        const isUser = role === 'user' || role === 'Customer';
                        const isAssistant = role === 'assistant' || role === 'Agent';
                        return (
                          <div key={idx} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] rounded-lg border px-4 py-2 text-sm whitespace-pre-wrap ${isUser ? 'border-teal-200 bg-teal-50 text-teal-950' : isAssistant ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-200 bg-slate-100 text-slate-800'}`}>
                              <span className="block font-semibold mb-1 text-xs opacity-70">
                                {isUser ? 'User' : isAssistant ? 'Assistant' : (role || 'Speaker')}
                              </span>
                              {msg.content || msg.text || JSON.stringify(msg)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Prompt Editor Modal Component
const PromptEditorModal = ({
  currentPrompt,
  onSave,
  onCancel,
  onReset,
  onChange
}: {
  currentPrompt: string;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
  onChange: (prompt: string) => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        <div className="bg-slate-900 px-5 py-5 sm:px-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Settings2 className="h-3.5 w-3.5" />
              Configuration
            </p>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Analysis Settings</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 mb-4">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
              AI Analysis Prompt Template
            </label>
            <textarea
              value={currentPrompt}
              onChange={(e) => onChange(e.target.value)}
              className="h-64 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:h-96 sm:px-4 sm:py-3 sm:text-sm"
              placeholder="Enter your custom prompt here..."
            />
            <p className="text-xs text-slate-500 mt-2">
              Use {'{TRANSCRIPTION_PLACEHOLDER}'} where you want the call transcription to be inserted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2.5 text-slate-700 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold order-2 sm:order-1"
            >
              Reset to Default
            </button>
            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
              <button
                onClick={onCancel}
                className="px-6 py-2.5 text-slate-700 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 transition-colors text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Call list row
function CallRow({
  call,
  onAnalyze,
  onViewDetails,
  isProcessing
}: {
  call: Call;
  onAnalyze: () => void;
  onViewDetails: () => void;
  isProcessing: boolean;
}) {
  const isAnalyzed = call.isLead !== undefined && call.isLead !== null && call.leadAnalysisAt;
  const hasTranscription = Boolean(getCallTranscription(call));
  const callId = getCallId(call, "unknown");

  return (
    <article className="relative flex gap-3 pl-3 pr-4 py-4 transition-colors hover:bg-slate-50 sm:pr-6 sm:pl-4">
      {/* Status rail */}
      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${statusRailColor(call)}`} />

      {/* Avatar */}
      <div className="hidden sm:flex flex-shrink-0 bg-slate-100 p-2.5 rounded-lg h-fit">
        <Phone className="w-4 h-4 text-slate-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                  <Hash className="h-3 w-3 text-slate-400" />
                  {callId.substring(0, 8)}
                </span>
                <span className="text-xs sm:text-sm text-slate-700 font-medium font-mono break-all">
                  {(call.from_number || '')} → {(call.to_number|| '')}
                </span>
                <span className="text-xs text-slate-500">{formatTimeAgo(call.startTime || call.createdAt)}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 font-mono sm:text-sm">
                  <Clock className="h-3 w-3 text-slate-400" />
                  {formatDuration(call.duration)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AnalysisStatusBadge call={call} />
                {isAnalyzed && (
                  <span className="text-xs text-slate-500" suppressHydrationWarning>
                    on {new Date(call.leadAnalysisAt!).toLocaleDateString()}
                  </span>
                )}
              </div>

              {isAnalyzed && call.isLead === true && (
                <div className="mt-3 border-l-2 border-emerald-400 rounded-r-lg bg-emerald-50/60 py-3 pl-4 pr-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Target className="h-4 w-4 shrink-0 text-emerald-700 sm:h-5 sm:w-5" />
                        <h3 className="text-sm sm:text-base font-bold text-emerald-900">Lead Identified</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        {call.name && (
                          <div>
                            <span className="font-semibold uppercase tracking-wide text-[11px] text-emerald-700/70">Customer</span>
                            <p className="text-emerald-950 font-semibold break-all">{call.name}</p>
                          </div>
                        )}
                        {call.phone && (
                          <div>
                            <span className="font-semibold uppercase tracking-wide text-[11px] text-emerald-700/70">Phone</span>
                            <p className="text-emerald-950 font-mono break-all">{formatPhone(call.phone)}</p>
                          </div>
                        )}
                        {call.alternatePhoneNumber && (
                          <div>
                            <span className="font-semibold uppercase tracking-wide text-[11px] text-emerald-700/70">Alternate / WhatsApp</span>
                            <p className="text-emerald-950 font-mono break-all">{formatPhone(call.alternatePhoneNumber)}</p>
                          </div>
                        )}
                        {call.productInterest && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="font-semibold uppercase tracking-wide text-[11px] text-emerald-700/70">Interest</span>
                            <p className="text-emerald-950">{call.productInterest}</p>
                          </div>
                        )}
                        {call.customerNeed && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="font-semibold uppercase tracking-wide text-[11px] text-emerald-700/70">Requirements</span>
                            <p className="text-emerald-950">{call.customerNeed}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {call.confidence && (
                      <div className="shrink-0 text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-emerald-900 font-mono">
                          {(call.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/70">Confidence</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isAnalyzed && call.isLead === false && (
                <div className="mt-2 border-l-2 border-slate-300 py-1 pl-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                    <XCircle className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Not identified as a sales lead</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-2.5">
            <button
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Details
            </button>

            {!isAnalyzed && hasTranscription && (
              <button
                onClick={onAnalyze}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            )}

            {isAnalyzed && hasTranscription && (
              <button
                onClick={onAnalyze}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-teal-600" />
                    <span>Re-analyzing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Re-analyze</span>
                    <span className="sm:hidden">Retry</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AnalyzerPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingQueue, setProcessingQueue] = useState<string[]>([]);
  const [bulkProgress, setBulkProgress] = useState<BulkAnalysisProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('startTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showSheetAutomation, setShowSheetAutomation] = useState(false);
  // Load prompt from localStorage or use default
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      const storageKey = promptStorageKey();
      const defaultPrompt = isRealEstateWorkspace() ? REAL_ESTATE_PROMPT : DEFAULT_PROMPT;
      const saved = localStorage.getItem(storageKey);
      // Force update to new simple prompt if old strict/Hindi prompt is detected
      if (saved && (saved.includes('DEFINITELY NOT LEADS') ||
                     saved.includes('STRICT sales lead') ||
                     saved.includes('आप एक स्मार्ट लीड विश्लेषक'))) {
        console.log('🔄 Upgrading to new simple prompt...');
        localStorage.setItem(storageKey, defaultPrompt);
        return defaultPrompt;
      }
      // If no saved prompt or unknown format, use default
      if (!saved) {
        localStorage.setItem(storageKey, defaultPrompt);
        return defaultPrompt;
      }
      return saved;
    }
    return DEFAULT_PROMPT;
  });
  const [editingPrompt, setEditingPrompt] = useState(currentPrompt);

  // Save prompt to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(promptStorageKey(), currentPrompt);
    }
  }, [currentPrompt]);

  // ==========================================
  // FIXED: Process Transcription with AI
  // ==========================================
  const processTranscriptionWithAI = useCallback(async (callId: string, transcription: string, forceReanalyze = false) => {
    const apiUrl = `${API_BASE_URL}/leads/analyze-lead`;

    try {
      console.log(`🔍 Processing call ${callId} with OpenAI...`);

      const processedPrompt = currentPrompt.replace('{TRANSCRIPTION_PLACEHOLDER}', transcription);
      const token = getAuthToken();

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callSid: callId,
          transcription: transcription,
          prompt: processedPrompt,
          forceReanalyze
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Backend error (${response.status}):`, errorText);
        throw new Error(`Backend responded with ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ AI analysis complete for ${callId}:`, result);

      // FIXED: Extract data from result.data (not result directly)
      if (result.success && result.data) {
        return result.data; // This contains is_lead, customer_name, etc.
      } else {
        throw new Error('Invalid response format from backend');
      }

    } catch (error) {
      console.error(`❌ AI processing failed for ${callId}:`, error);
      throw error;
    }
  }, [currentPrompt]);

  // ==========================================
  // Process Individual Call
  // ==========================================
  const processIndividualCall = useCallback(async (callId: string, forceReanalyze = false) => {
    const call = calls.find(c => getCallId(c) === callId);
    if (!call || !getCallTranscription(call)) {
      console.log(`Call ${callId} not found or has no transcription`);
      return false;
    }

    if (!forceReanalyze && call.isLead !== undefined && call.isLead !== null && call.leadAnalysisAt) {
      console.log(`Call ${callId} already analyzed on ${call.leadAnalysisAt}, skipping`);
      return false;
    }

    const transcriptionText = normalizeTranscriptionText(getCallTranscription(call));
    if (!transcriptionText || transcriptionText.trim().length === 0) {
      console.log(`Call ${callId} has empty transcription`);
      return false;
    }

    setProcessingQueue(prev => prev.includes(callId) ? prev : [...prev, callId]);

    try {
      console.log(`${forceReanalyze ? '🔄 Re-analyzing' : '🆕 Analyzing'} call ${callId}...`);
      const aiResult = await processTranscriptionWithAI(callId, transcriptionText, forceReanalyze);

      if (aiResult && aiResult.extraction_method !== "failed") {
        setCalls(prevCalls =>
          prevCalls.map(c => {
            if (getCallId(c) !== callId) return c;
            const primaryPhone = (c.direction === "outbound" ? c.to_number : c.from_number)
              || c.phone
              || aiResult.phone_number
              || "";
            const extractedAlternate = String(aiResult.alternate_phone_number || aiResult.whatsapp_number || "").trim();
            const primaryDigits = primaryPhone.replace(/\D/g, "").slice(-10);
            const alternateDigits = extractedAlternate.replace(/\D/g, "").slice(-10);
            const alternatePhoneNumber = /same\s+as\s+(caller|calling|this|primary)/i.test(extractedAlternate)
              || (primaryDigits && alternateDigits && primaryDigits === alternateDigits)
              ? ""
              : extractedAlternate;

            return {
              ...c,
              isLead: aiResult.is_lead,
              name: aiResult.customer_name || "",
              phone: primaryPhone,
              alternatePhoneNumber,
              productInterest: aiResult.product_interest || "",
              customerNeed: aiResult.customer_need || "",
              confidence: aiResult.confidence_score,
              leadAnalysisAt: new Date().toISOString()
            };
          })
        );

        console.log(`✅ Successfully ${forceReanalyze ? 're-analyzed' : 'analyzed'} call ${callId}:`, {
          isLead: aiResult.is_lead,
          customerName: aiResult.customer_name,
          confidence: aiResult.confidence_score
        });
        return true;
      } else {
        throw new Error(`AI analysis returned no result for call ${callId}`);
      }
    } catch (error) {
      console.error(`❌ Failed to process call ${callId}:`, error);
      // Keep failed calls pending so they can be retried.
      return false;
    } finally {
      setProcessingQueue(prev => prev.filter(id => id !== callId));
    }
  }, [calls, processTranscriptionWithAI]);

  // ==========================================
  // Analyze All Pending Calls
  // ==========================================
  const analyzeAllPendingCalls = useCallback(async () => {
    if (bulkProgress?.running) return;

    const pendingCalls = calls.filter(call =>
      getCallTranscription(call) &&
      (call.isLead === undefined || call.isLead === null || !call.leadAnalysisAt)
    );

    if (pendingCalls.length === 0) {
      alert('No calls pending analysis!');
      return;
    }

    console.log(`🚀 Starting bulk analysis of ${pendingCalls.length} calls...`);

    setBulkProgress({ total: pendingCalls.length, completed: 0, failed: 0, running: true });

    let nextCallIndex = 0;
    const worker = async () => {
      while (nextCallIndex < pendingCalls.length) {
        const call = pendingCalls[nextCallIndex++];
        const succeeded = await processIndividualCall(getCallId(call), false);
        setBulkProgress(previous => previous ? {
          ...previous,
          completed: previous.completed + 1,
          failed: previous.failed + (succeeded ? 0 : 1)
        } : previous);
      }
    };

    const workerCount = Math.min(BULK_ANALYSIS_CONCURRENCY, pendingCalls.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    console.log('✅ Bulk analysis completed!');
    setBulkProgress(previous => previous ? { ...previous, running: false } : previous);
  }, [bulkProgress?.running, calls, processIndividualCall]);

  // ==========================================
  // Fetch Calls from Database
  // ==========================================
  const fetchCalls = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("📞 Fetching calls from MongoDB...");

      const token = getAuthToken();
      // Bound the initial response so Leads does not block on the full call history.
      const callsResponse = await fetch(`${API_BASE_URL}/calls?limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("📥 Response status:", callsResponse.status);
      console.log("📥 Response ok:", callsResponse.ok);

      if (!callsResponse.ok) {
        const errorText = await callsResponse.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`Failed to fetch calls: ${callsResponse.status} ${callsResponse.statusText}`);
      }

      const callsData = await callsResponse.json();
      const fetchedCalls = callsData.calls || callsData.data?.calls || [];
      const normalizedCalls = fetchedCalls.map((call: Call, index: number) => normalizeCall(call, index));

      console.log(`📊 Fetched ${fetchedCalls.length} calls from backend (already filtered by user phone)`);

      // Backend already filters by authenticated user's phone number
      // No need for client-side filtering - just use the data directly
      setCalls(normalizedCalls);
      console.log(`✅ Loaded ${fetchedCalls.length} calls for authenticated user`);

    } catch (error) {
      console.error("❌ Error in fetchCalls:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  // ==========================================
  // WebSocket Connection
  // ==========================================
  useEffect(() => {
    let ws: WebSocket;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          console.log("🔌 WebSocket connected");
        };

        ws.onmessage = async (event) => {
          try {
            const newCallsData = JSON.parse(event.data);

            if (Array.isArray(newCallsData)) {
              setCalls(prevCalls => {
                const updatedCalls = [...prevCalls];
                newCallsData.forEach((newCall, index) => {
                  const normalizedCall = normalizeCall(newCall, index);
                  const newCallId = getCallId(normalizedCall);
                  const existingIndex = updatedCalls.findIndex(call => getCallId(call) === newCallId);
                  if (existingIndex > -1) {
                    updatedCalls[existingIndex] = { ...updatedCalls[existingIndex], ...normalizedCall };
                  } else {
                    updatedCalls.unshift(normalizedCall);
                  }
                });
                return updatedCalls;
              });
            }
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

      } catch (error) {
        console.error("Failed to connect WebSocket:", error);
      }
    };

    const timer = setTimeout(connectWebSocket, 2000);

    return () => {
      clearTimeout(timer);
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // ==========================================
  // Filter and Sort Calls
  // ==========================================
  useEffect(() => {
    let filtered = calls;

    if (filterStatus === 'leads') {
      filtered = filtered.filter(call => call.isLead === true);
    } else if (filterStatus === 'no-leads') {
      filtered = filtered.filter(call => call.isLead === false);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(call => call.isLead === undefined || call.isLead === null);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(call =>
        getCallId(call).toLowerCase().includes(term) ||
        (call.from_number && call.from_number.toLowerCase().includes(term)) ||
        (call.to_number && call.to_number.toLowerCase().includes(term)) ||
        (call.name && call.name.toLowerCase().includes(term)) ||
        (call.phone && call.phone.includes(term)) ||
        (call.alternatePhoneNumber && call.alternatePhoneNumber.includes(term)) ||
        (call.productInterest && call.productInterest.toLowerCase().includes(term))
      );
    }

    filtered = filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'startTime':
          aValue = new Date(a.startTime || a.createdAt || 0).getTime();
          bValue = new Date(b.startTime || b.createdAt || 0).getTime();
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case 'confidence':
          aValue = a.confidence || 0;
          bValue = b.confidence || 0;
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredCalls(filtered);
  }, [calls, filterStatus, sortField, sortOrder, searchTerm]);

  // ==========================================
  // Statistics
  // ==========================================
  const totalCalls = calls.length;
  const analyzedCount = calls.filter(call => call.leadAnalysisAt).length;
  const pendingAnalysis = calls.filter(call =>
    getCallTranscription(call) &&
    (!call.leadAnalysisAt)
  ).length;
  const noTranscriptionCount = calls.filter(call =>
    !getCallTranscription(call)
  ).length;

  const BulkAnalysisButton = () => (
    <button
      onClick={analyzeAllPendingCalls}
      disabled={pendingAnalysis === 0 || processingQueue.length > 0 || bulkProgress?.running}
      className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Sparkles className={`h-4 w-4 sm:h-5 sm:w-5 ${bulkProgress?.running ? 'animate-pulse' : ''}`} />
      {bulkProgress?.running ? (
        <span>Analyzing {bulkProgress.completed}/{bulkProgress.total}</span>
      ) : (
        <>
          <span className="hidden sm:inline">Analyze All Pending ({pendingAnalysis})</span>
          <span className="sm:hidden">Analyze ({pendingAnalysis})</span>
        </>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm lg:hidden"
        >
          <MenuIcon />
        </button>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="w-full min-w-0 p-4 pt-20 sm:p-6 lg:ml-64 lg:w-[calc(100%-16rem)] lg:p-8 lg:pt-8 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-teal-600" />
            <p className="text-lg font-semibold text-slate-900">Loading lead analytics</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-50 lg:hidden"
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="w-full min-w-0 p-4 pt-20 sm:p-6 lg:ml-64 lg:w-[calc(100%-16rem)] lg:p-8 lg:pt-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Page Header — same "clinical ledger" header pattern as the appointments page */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex min-w-0 flex-col items-stretch justify-between gap-5 min-[1800px]:flex-row min-[1800px]:items-center">
                <div className="flex min-w-0 items-start gap-4 sm:gap-5">
                  <div className="rounded-lg border border-slate-200 bg-slate-900 p-3 sm:p-4">
                    <BarChart3 className="h-7 w-7 text-white sm:h-8 sm:w-8" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-teal-700 mb-1.5">
                      Call Intelligence
                    </p>
                    <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Call Analyzer</h1>
                    <p className="mb-5 text-sm font-medium text-slate-500">
                      Analyze call transcripts and review qualification results
                    </p>

                    {/* Connected stats card */}
                    <div className="inline-flex flex-wrap sm:flex-nowrap items-stretch rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 w-1/2 sm:w-auto">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-100">
                          <Phone className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                            Total Calls
                          </div>
                          <div className="text-lg font-bold leading-tight text-slate-950 font-mono">
                            {totalCalls.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 w-1/2 sm:w-auto">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-amber-50">
                          <Target className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                            Pending Analysis
                          </div>
                          <div className="text-lg font-bold leading-tight text-slate-950 font-mono">
                            {pendingAnalysis.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 px-4 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 w-1/2 sm:w-auto">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-teal-50">
                          <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                            Analyzed Calls
                          </div>
                          <div className="text-lg font-bold leading-tight text-slate-950 font-mono">
                            {analyzedCount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 px-4 py-3 w-1/2 sm:w-auto">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-100">
                          <XCircle className="h-4 w-4 text-slate-500" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                            Without Transcript
                          </div>
                          <div className="text-lg font-bold leading-tight text-slate-950 font-mono">
                            {noTranscriptionCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center min-[1800px]:w-auto min-[1800px]:shrink-0">
                  <BulkAnalysisButton />
                  <button
                    onClick={() => setShowSheetAutomation(true)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
                  >
                    <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Sheet Automation</span>
                  </button>
                  <button
                    onClick={() => setShowPromptEditor(true)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Settings2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Analysis Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-3.5 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold">Connection Error</p>
                <p className="text-xs sm:text-sm mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Search & Filters — same bordered white card language as the rest of the ledger */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search calls, customers or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'all', label: 'All', fullLabel: 'All calls' },
                    { value: 'leads', label: 'Leads', fullLabel: 'Qualified leads' },
                    { value: 'pending', label: 'Pending', fullLabel: 'Pending analysis' },
                    { value: 'no-leads', label: 'No Leads', fullLabel: 'Not qualified' }
                  ].map(filter => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterStatus(filter.value as FilterStatus)}
                      className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        filterStatus === filter.value
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="sm:hidden">{filter.label}</span>
                      <span className="hidden sm:inline">{filter.fullLabel}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={fetchCalls}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          </div>

          {(processingQueue.length > 0 || bulkProgress) && (
            <div className={`rounded-lg border p-4 flex items-start gap-3 ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
              {processingQueue.length > 0 ? (
                <RefreshCw className="h-5 w-5 shrink-0 mt-0.5 animate-spin text-amber-600" />
              ) : (
                <CheckCircle2 className={`h-5 w-5 shrink-0 mt-0.5 ${bulkProgress?.failed ? 'text-amber-600' : 'text-emerald-600'}`} />
              )}
              <div>
                <h3 className={`text-sm font-bold sm:text-base ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'text-emerald-900' : 'text-amber-900'}`}>
                  {bulkProgress?.running ? 'Analyzing all pending calls' : bulkProgress ? 'Bulk analysis complete' : 'Analyzing call'}
                </h3>
                <p className={`text-xs sm:text-sm ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {bulkProgress
                    ? `${bulkProgress.completed} of ${bulkProgress.total} processed${bulkProgress.failed ? `, ${bulkProgress.failed} failed and remain pending` : ''}.`
                    : 'AI analysis is in progress...'}
                </p>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white divide-y divide-slate-100">
            {filteredCalls.length > 0 && (
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3.5 sm:px-6">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Call Conversations</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Review saved analysis or qualify pending calls.</p>
                </div>
                <span className="text-xs font-semibold text-slate-500 font-mono">{filteredCalls.length.toLocaleString()} results</span>
              </div>
            )}
            {filteredCalls.length === 0 ? (
              <div className="p-10 text-center sm:p-14">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-slate-400" />
                </div>
                <h3 className="mb-1 text-base font-bold text-slate-900">No calls found</h3>
                <p className="text-sm text-slate-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <CallRow
                  key={getCallId(call)}
                  call={call}
                  onAnalyze={() => processIndividualCall(getCallId(call), call.leadAnalysisAt ? true : false)}
                  onViewDetails={() => setSelectedCall(call)}
                  isProcessing={processingQueue.includes(getCallId(call))}
                />
              ))
            )}
          </div>

          <div className="py-2 text-center">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-800 font-mono">{filteredCalls.length.toLocaleString()}</span> of <span className="font-semibold text-slate-800 font-mono">{totalCalls.toLocaleString()}</span> calls
            </p>
          </div>

          {selectedCall && (
            <LeadDetailsModal
              call={selectedCall}
              onClose={() => setSelectedCall(null)}
            />
          )}

          {showPromptEditor && (
            <PromptEditorModal
              currentPrompt={editingPrompt}
              onSave={() => {
                setCurrentPrompt(editingPrompt);
                setShowPromptEditor(false);
              }}
              onCancel={() => {
                setEditingPrompt(currentPrompt);
                setShowPromptEditor(false);
              }}
              onReset={() => {
                setEditingPrompt(DEFAULT_PROMPT);
                setCurrentPrompt(DEFAULT_PROMPT);
              }}
              onChange={setEditingPrompt}
            />
          )}

          {showSheetAutomation && (
            <SheetAutomationModal onClose={() => setShowSheetAutomation(false)} />
          )}
        </div>
      </main>
    </div>
  );
}
