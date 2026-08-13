"use client";
import Sidebar from "@/components/Sidebar";
import { useCallback, useEffect, useState } from "react";

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

// Icon Components
const PhoneIcon = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const TargetIcon = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

// Lead Details Modal Component
const LeadDetailsModal = ({ call, onClose }: { call: Call; onClose: () => void }) => {
  const callId = getCallId(call, "unknown");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Call details</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Call ID</h3>
              <p className="text-sm sm:text-base text-gray-900 font-mono break-all">{callId}</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Duration</h3>
              <p className="text-sm sm:text-base text-gray-900">{formatDuration(call.duration)}</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">From</h3>
              <p className="text-sm sm:text-base text-gray-900 break-all">{(call.from_number || '')}</p>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">To</h3>
              <p className="text-sm sm:text-base text-gray-900 break-all">{(call.to_number || '')}</p>
            </div>
          </div>

          {call.isLead && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-4">Lead Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {call.name && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Customer Name</h4>
                    <p className="text-sm sm:text-base text-green-800">{call.name}</p>
                  </div>
                )}
                {call.phone && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Phone Number</h4>
                    <p className="text-sm sm:text-base text-green-800 break-all">{formatPhone(call.phone)}</p>
                  </div>
                )}
                {call.alternatePhoneNumber && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Alternate / WhatsApp Number</h4>
                    <p className="text-sm sm:text-base text-green-800 break-all">{formatPhone(call.alternatePhoneNumber)}</p>
                  </div>
                )}
                {call.productInterest && (
                  <div className="col-span-1 sm:col-span-2">
                    <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Product Interest</h4>
                    <p className="text-sm sm:text-base text-green-800">{call.productInterest}</p>
                  </div>
                )}
                {call.confidence && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Confidence Score</h4>
                    <p className="text-sm sm:text-base text-green-800">{(call.confidence * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>
              {call.customerNeed && (
                <div className="mt-4">
                  <h4 className="text-xs sm:text-sm font-medium text-sky-600 mb-1">Customer Need</h4>
                  <p className="text-sm sm:text-base text-green-800">{call.customerNeed}</p>
                </div>
              )}
            </div>
          )}

          {Boolean(getCallTranscription(call)) && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Transcription</h3>
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
                      else return <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{t}</p>;
                    } catch {
                      return <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{t}</p>;
                    }
                  } else if (Array.isArray(t)) {
                    messages = t;
                  } else if (typeof t === 'object' && t !== null) {
                    if ('chat' in t && Array.isArray((t as any).chat)) messages = (t as any).chat;
                    else if ('messages' in t && Array.isArray((t as any).messages)) messages = (t as any).messages;
                    else return <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">{Object.values(t).join('\n')}</p>;
                  }
                  if (!messages.length) return <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap">No transcription available.</p>;
                  return (
                    <div className="space-y-2">
                      {messages.map((msg: any, idx: number) => {
                        const role = msg.role || msg.speaker || '';
                        const isUser = role === 'user' || role === 'Customer';
                        const isAssistant = role === 'assistant' || role === 'Agent';
                        return (
                          <div key={idx} className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-[80%] rounded-lg border px-4 py-2 text-sm whitespace-pre-wrap ${isUser ? 'border-orange-200 bg-orange-50 text-orange-950' : isAssistant ? 'border-slate-200 bg-white text-slate-800' : 'border-slate-200 bg-slate-100 text-slate-800'}`}>
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">Analysis settings</h2>
            <button
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-900 transition-colors p-2"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              AI Analysis Prompt Template
            </label>
            <textarea
              value={currentPrompt}
              onChange={(e) => onChange(e.target.value)}
              className="h-64 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 sm:h-96 sm:px-4 sm:py-3 sm:text-sm"
              placeholder="Enter your custom prompt here..."
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Use {'{TRANSCRIPTION_PLACEHOLDER}'} where you want the call transcription to be inserted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={onReset}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
            >
              Reset to Default
            </button>
            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
              <button
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
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
    <article className="px-5 py-5 transition-colors hover:bg-orange-50/30 sm:px-6">
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="inline-block rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs text-slate-600">
                  ID: {callId.substring(0, 8)}
                </span>
                <span className="text-xs sm:text-sm text-gray-700 font-medium break-all">
                  {(call.from_number || '')} → {(call.to_number|| '')}
                </span>
                <span className="text-xs text-gray-500">{formatTimeAgo(call.startTime || call.createdAt)}</span>
                <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 sm:text-sm">
                  {formatDuration(call.duration)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isAnalyzed ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-600/20">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Analyzed</span>
                    </div>
                    <span className="text-gray-500 text-xs" suppressHydrationWarning>
                      on {new Date(call.leadAnalysisAt!).toLocaleDateString()}
                    </span>
                  </div>
                ) : hasTranscription ? (
                  <div className="flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs text-amber-700 ring-1 ring-amber-600/20 sm:text-sm">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Pending Analysis</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs sm:text-sm">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <span>No Transcription</span>
                  </div>
                )}
              </div>

              {isAnalyzed && call.isLead === true && (
                <div className="mt-4 border-l-2 border-emerald-500 py-1 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <svg className="h-4 w-4 shrink-0 text-emerald-700 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <h3 className="text-base sm:text-lg font-bold text-green-800">Lead Identified</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        {call.name && (
                          <div>
                            <span className="font-medium text-slate-500">Customer:</span>
                            <p className="text-green-800 font-semibold break-all">{call.name}</p>
                          </div>
                        )}
                        {call.phone && (
                          <div>
                            <span className="font-medium text-slate-500">Phone:</span>
                            <p className="text-green-800 break-all">{formatPhone(call.phone)}</p>
                          </div>
                        )}
                        {call.alternatePhoneNumber && (
                          <div>
                            <span className="font-medium text-slate-500">Alternate / WhatsApp:</span>
                            <p className="text-green-800 break-all">{formatPhone(call.alternatePhoneNumber)}</p>
                          </div>
                        )}
                        {call.productInterest && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="font-medium text-slate-500">Interest:</span>
                            <p className="text-green-800">{call.productInterest}</p>
                          </div>
                        )}
                        {call.customerNeed && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="font-medium text-slate-500">Requirements:</span>
                            <p className="text-green-800">{call.customerNeed}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {call.confidence && (
                      <div className="shrink-0 text-left sm:text-right">
                        <div className="text-xl sm:text-2xl font-bold text-green-800">
                          {(call.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs font-medium text-slate-500">Confidence</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isAnalyzed && call.isLead === false && (
                <div className="mt-2 border-l-2 border-slate-300 py-1 pl-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Not identified as a sales lead</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <button
              onClick={onViewDetails}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Details
            </button>

            {!isAnalyzed && hasTranscription && (
              <button
                onClick={onAnalyze}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
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
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sky-600"></div>
                    <span>Re-analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
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
  // Load prompt from localStorage or use default
  const [currentPrompt, setCurrentPrompt] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('leadAnalysisPrompt');
      // Force update to new simple prompt if old strict/Hindi prompt is detected
      if (saved && (saved.includes('DEFINITELY NOT LEADS') ||
                     saved.includes('STRICT sales lead') ||
                     saved.includes('आप एक स्मार्ट लीड विश्लेषक'))) {
        console.log('🔄 Upgrading to new simple prompt...');
        localStorage.setItem('leadAnalysisPrompt', DEFAULT_PROMPT);
        return DEFAULT_PROMPT;
      }
      // If no saved prompt or unknown format, use default
      if (!saved) {
        localStorage.setItem('leadAnalysisPrompt', DEFAULT_PROMPT);
        return DEFAULT_PROMPT;
      }
      return saved;
    }
    return DEFAULT_PROMPT;
  });
  const [editingPrompt, setEditingPrompt] = useState(currentPrompt);

  // Save prompt to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadAnalysisPrompt', currentPrompt);
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
      className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${bulkProgress?.running ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
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
          className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm md:hidden"
        >
          <MenuIcon />
        </button>

        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-orange-600"></div>
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
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
        aria-label="Toggle menu"
      >
        <MenuIcon />
      </button>

      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out w-60`}>
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <main className="w-full md:ml-60 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
        <div className="mx-auto max-w-7xl space-y-6">

          <header className="pb-2">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-orange-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Call intelligence</span>
                </div>
                <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                  Call Analyzer
                </h1>
                <p className="text-sm text-slate-600 sm:text-base">
                  Analyze call transcripts and review qualification results.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <BulkAnalysisButton />
                <button
                  onClick={() => setShowPromptEditor(true)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Analysis settings</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 sm:mt-6 bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 mr-3 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-red-800 font-semibold text-sm sm:text-base">Connection Error</h3>
                    <p className="text-red-700 text-xs sm:text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </header>

          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:grid-cols-4 lg:divide-x lg:divide-slate-200">
            <div className="flex items-center gap-4 border-b border-slate-200 p-5 lg:border-b-0">
              <div className="shrink-0">
                <div className="rounded-lg bg-orange-50 p-2 text-orange-700">
                  <PhoneIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Total Calls</p>
                <p className="mb-2 text-2xl font-bold text-slate-950 sm:text-3xl">{totalCalls.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">{noTranscriptionCount} without audio</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200 p-5 lg:border-b-0">
              <div className="shrink-0">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
                  <TargetIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Pending Analysis</p>
                <p className="mb-2 text-2xl font-bold text-slate-950 sm:text-3xl">{pendingAnalysis.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">Ready for analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-slate-200 p-5 sm:border-b-0">
              <div className="shrink-0">
                <div className="rounded-lg bg-sky-50 p-2 text-sky-700">
                  <ChartIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Analyzed Calls</p>
                <p className="mb-2 text-2xl font-bold text-slate-950 sm:text-3xl">{analyzedCount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">{pendingAnalysis} pending analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5">
              <div className="shrink-0">
                <div className="rounded-lg bg-violet-50 p-2 text-violet-700">
                  <ClockIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Without Transcript</p>
                <p className="mb-2 text-2xl font-bold text-slate-950 sm:text-3xl">{noTranscriptionCount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">Cannot be analyzed</p>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 pb-5">
            <div className="flex flex-col gap-4 sm:gap-6">

              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search calls, customers or products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                  />
                  <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
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

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={fetchCalls}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:flex-none"
                >
                  <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>

              </div>
            </div>
          </div>

          {(processingQueue.length > 0 || bulkProgress) && (
            <div className={`rounded-lg border p-4 ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`}>
              <div className="flex items-start">
                {processingQueue.length > 0 ? (
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-orange-600 mr-3 shrink-0 mt-0.5"></div>
                ) : (
                  <svg className={`h-5 w-5 mr-3 shrink-0 ${bulkProgress?.failed ? 'text-orange-700' : 'text-emerald-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                <div>
                  <h3 className={`text-sm font-semibold sm:text-base ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'text-emerald-900' : 'text-orange-900'}`}>
                    {bulkProgress?.running ? 'Analyzing all pending calls' : bulkProgress ? 'Bulk analysis complete' : 'Analyzing call'}
                  </h3>
                  <p className={`text-xs sm:text-sm ${bulkProgress && !bulkProgress.running && bulkProgress.failed === 0 ? 'text-emerald-700' : 'text-orange-700'}`}>
                    {bulkProgress
                      ? `${bulkProgress.completed} of ${bulkProgress.total} processed${bulkProgress.failed ? `, ${bulkProgress.failed} failed and remain pending` : ''}.`
                      : 'AI analysis is in progress...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm divide-y divide-slate-200">
            {filteredCalls.length > 0 && (
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3 sm:px-6">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Call conversations</h2>
                  <p className="mt-0.5 text-xs text-slate-500">Review saved analysis or qualify pending calls.</p>
                </div>
                <span className="text-xs font-semibold text-slate-500">{filteredCalls.length.toLocaleString()} results</span>
              </div>
            )}
            {filteredCalls.length === 0 ? (
              <div className="p-10 text-center sm:p-14">
                <div className="mb-4 text-slate-400">
                  <svg className="mx-auto h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">No calls found</h3>
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
              Showing <span className="font-semibold text-slate-800">{filteredCalls.length.toLocaleString()}</span> of <span className="font-semibold text-slate-800">{totalCalls.toLocaleString()}</span> calls
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
        </div>
      </main>
    </div>
  );
}
