"use client";
import Sidebar from "@/components/Sidebar";
import { useCallback, useEffect, useState } from "react";

// ==========================================
// CONFIGURATION - FORCE LOCALHOST FOR DEVELOPMENT
// ==========================================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://digital-api-46ss.onrender.com/ws';
console.log('🌐 API_BASE_URL:', API_BASE_URL);
console.log('🔌 WS_URL:', WS_URL);

// ==========================================
// TYPES
// ==========================================
type Call = {
  _id: string;
  from_number?: string;
  to_number?: string;
  status?: string;
  startTime?: string;
  duration?: number;
  direction?: string;
  transcription?: string;
  transcript?: string;
  isLead?: boolean;
  name?: string;
  phone?: string;
  confidence?: number;
  productInterest?: string;
  customerNeed?: string;
  leadAnalysisAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FilterStatus = 'all' | 'leads' | 'no-leads' | 'pending';
type SortField = 'startTime' | 'duration' | 'confidence';
type SortOrder = 'asc' | 'desc';

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

Extract the following information:
1. is_lead: true if this is a potential sales opportunity, false if not
2. customer_name: The customer's name if mentioned
3. phone_number: Customer's phone number if different from caller
4. product_interest: What product/service they're interested in
5. customer_need: What problem or need they have
6. confidence_score: How confident you are (0.0 to 1.0)

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "is_lead": boolean,
  "customer_name": "string or empty",
  "phone_number": "string or empty",
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
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "+91 $1-$2-$3");
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Call Details</h2>
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
              <p className="text-sm sm:text-base text-gray-900 font-mono break-all">{call._id}</p>
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
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
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

          {(call.transcription || call.transcript) && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Transcription</h3>
              <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto border border-gray-200">
                {(() => {
                  let t = call.transcription || call.transcript;
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
                            <div className={`rounded-xl px-4 py-2 max-w-[80%] text-sm whitespace-pre-wrap shadow-md ${isUser ? 'bg-orange-100 text-orange-900' : isAssistant ? 'bg-green-100 text-green-900' : 'bg-gray-200 text-gray-800'}`}>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Customize AI Analysis Prompt</h2>
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
              className="w-full h-64 sm:h-96 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 font-mono text-xs sm:text-sm"
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
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-lg hover:from-orange-700 hover:to-orange-700 transition-colors text-sm sm:text-base"
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

// Call Card Component
function CallCard({
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
  const hasTranscription = call.transcription || call.transcript;

  return (
    <div className={`bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl ${
      call.isLead === true ? 'border-l-4 border-l-green-400 bg-gradient-to-r from-green-50/50 to-white' :
      call.isLead === false ? 'border-l-4 border-l-gray-300' :
      'border-orange-200'
    }`}>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex-1 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs font-mono text-white bg-gray-700 px-2 sm:px-3 py-1 rounded-lg inline-block break-all">
                  ID: {call._id.substring(0, 8)}
                </span>
                <span className="text-xs sm:text-sm text-gray-700 font-medium break-all">
                  {(call.from_number || '')} → {(call.to_number|| '')}
                </span>
                <span className="text-xs text-gray-500">{formatTimeAgo(call.startTime || call.createdAt)}</span>
                <span className="text-xs sm:text-sm font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded inline-block">
                  {formatDuration(call.duration)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isAnalyzed ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
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
                  <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded-lg text-xs sm:text-sm">
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
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 sm:p-4 border border-green-200 mt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <h3 className="text-base sm:text-lg font-bold text-green-800">Lead Identified</h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                        {call.name && (
                          <div>
                            <span className="text-sky-600 font-medium">Customer:</span>
                            <p className="text-green-800 font-semibold break-all">{call.name}</p>
                          </div>
                        )}
                        {call.phone && (
                          <div>
                            <span className="text-sky-600 font-medium">Phone:</span>
                            <p className="text-green-800 break-all">{formatPhone(call.phone)}</p>
                          </div>
                        )}
                        {call.productInterest && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-sky-600 font-medium">Interest:</span>
                            <p className="text-green-800">{call.productInterest}</p>
                          </div>
                        )}
                        {call.customerNeed && (
                          <div className="col-span-1 sm:col-span-2">
                            <span className="text-sky-600 font-medium">Requirements:</span>
                            <p className="text-green-800">{call.customerNeed}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {call.confidence && (
                      <div className="text-center bg-white rounded-lg p-3 shadow-sm shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-green-800">
                          {(call.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-sky-600 font-medium">Confidence</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isAnalyzed && call.isLead === false && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2 border border-gray-200">
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
              className="px-4 py-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200 hover:border-sky-300 text-sm"
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
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-sky-500 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium text-sm"
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
                className="px-4 py-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 border border-sky-400 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium disabled:opacity-50 text-sm"
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
    </div>
  );
}

export default function LeadsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingQueue, setProcessingQueue] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // New state for database leads
  const [dbLeads, setDbLeads] = useState<any[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [showDbLeads, setShowDbLeads] = useState(true); // Show by default

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
  const [leadScore, setLeadScore] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  // Save prompt to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('leadAnalysisPrompt', currentPrompt);
    }
  }, [currentPrompt]);

  // Calculate lead score category
  const getLeadScoreCategory = useCallback((confidence?: number) => {
    if (!confidence) return 'unscored';
    if (confidence > 0.8) return 'hot';
    if (confidence > 0.5) return 'warm';
    return 'cold';
  }, []);

  // ==========================================
  // FIXED: Process Transcription with AI
  // ==========================================
  const processTranscriptionWithAI = useCallback(async (callId: string, transcription: string) => {
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
          prompt: processedPrompt
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
      return {
        is_lead: false,
        customer_name: "",
        phone_number: "",
        product_interest: "",
        customer_need: "",
        confidence_score: 0,
        extraction_method: "failed"
      };
    }
  }, [currentPrompt]);

  // ==========================================
  // Process Individual Call
  // ==========================================
  const processIndividualCall = useCallback(async (callId: string, forceReanalyze = false) => {
    const call = calls.find(c => c._id === callId);
    if (!call || (!call.transcription && !call.transcript)) {
      console.log(`Call ${callId} not found or has no transcription`);
      return;
    }

    if (!forceReanalyze && call.isLead !== undefined && call.isLead !== null && call.leadAnalysisAt) {
      console.log(`Call ${callId} already analyzed on ${call.leadAnalysisAt}, skipping`);
      return;
    }

    const transcriptionText = call.transcription || call.transcript || '';
    if (!transcriptionText || transcriptionText.trim().length === 0) {
      console.log(`Call ${callId} has empty transcription`);
      return;
    }

    setProcessingQueue(prev => [...prev, callId]);

    try {
      console.log(`${forceReanalyze ? '🔄 Re-analyzing' : '🆕 Analyzing'} call ${callId}...`);
      const aiResult = await processTranscriptionWithAI(call._id, transcriptionText);

      if (aiResult && aiResult.extraction_method !== "failed") {
        setCalls(prevCalls =>
          prevCalls.map(c =>
            c._id === callId
              ? {
                  ...c,
                  isLead: aiResult.is_lead,
                  name: aiResult.customer_name || "",
                  phone: aiResult.phone_number || "",
                  productInterest: aiResult.product_interest || "",
                  customerNeed: aiResult.customer_need || "",
                  confidence: aiResult.confidence_score,
                  leadAnalysisAt: new Date().toISOString()
                }
              : c
          )
        );

        console.log(`✅ Successfully ${forceReanalyze ? 're-analyzed' : 'analyzed'} call ${callId}:`, {
          isLead: aiResult.is_lead,
          customerName: aiResult.customer_name,
          confidence: aiResult.confidence_score
        });
      } else {
        console.error(`❌ AI analysis failed for call ${callId}`);
        setCalls(prevCalls =>
          prevCalls.map(c =>
            c._id === callId
              ? {
                  ...c,
                  isLead: false,
                  leadAnalysisAt: new Date().toISOString(),
                  confidence: 0
                }
              : c
          )
        );
      }
    } catch (error) {
      console.error(`❌ Failed to process call ${callId}:`, error);
      setCalls(prevCalls =>
        prevCalls.map(c =>
          c._id === callId
            ? {
                ...c,
                isLead: false,
                leadAnalysisAt: new Date().toISOString(),
                confidence: 0
              }
            : c
        )
      );
    } finally {
      setProcessingQueue(prev => prev.filter(id => id !== callId));
    }
  }, [calls, processTranscriptionWithAI]);

  // ==========================================
  // Analyze All Pending Calls
  // ==========================================
  const analyzeAllPendingCalls = useCallback(async () => {
    const pendingCalls = calls.filter(call =>
      (call.transcription || call.transcript) &&
      (call.isLead === undefined || call.isLead === null || !call.leadAnalysisAt)
    );

    if (pendingCalls.length === 0) {
      alert('No calls pending analysis!');
      return;
    }

    const confirmAnalysis = window.confirm(
      `Analyze ${pendingCalls.length} pending calls with OpenAI? This may take a few minutes and will use API credits.`
    );

    if (!confirmAnalysis) return;

    console.log(`🚀 Starting bulk analysis of ${pendingCalls.length} calls...`);

    const batchSize = 3;
    for (let i = 0; i < pendingCalls.length; i += batchSize) {
      const batch = pendingCalls.slice(i, i + batchSize);
      console.log(`📊 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(pendingCalls.length/batchSize)}`);

      await Promise.all(
        batch.map(call => processIndividualCall(call._id, false))
      );

      if (i + batchSize < pendingCalls.length) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay between batches
      }
    }

    console.log('✅ Bulk analysis completed!');
    alert(`Analysis complete! Processed ${pendingCalls.length} calls.`);
  }, [calls, processIndividualCall]);

  // ==========================================
  // Export Leads to CSV
  // ==========================================
  const exportLeadsToCSV = useCallback(() => {
    try {
      // Filter only qualified leads
      const leadsToExport = filteredCalls.filter(call => call.isLead === true);

      if (leadsToExport.length === 0) {
        alert('No leads to export!');
        return;
      }

      // CSV Headers
      const headers = [
        'Call ID',
        'Customer Name',
        'Phone',
        'Call Date',
        'Duration (sec)',
        'Lead Quality',
        'Confidence Score',
        'Product Interest',
        'Customer Need',
        'Agent',
        'Recording URL'
      ];

      // Convert leads to CSV rows
      const rows = leadsToExport.map(call => {
        const leadQuality = getLeadScoreCategory(call.confidence);
        const callDate = call.startTime ? new Date(call.startTime).toLocaleString() : 'N/A';

        return [
          call._id || '',
          call.name || 'Unknown',
          call.phone || call.from_number || call.to_number|| '',
          callDate,
          call.duration || 0,
          leadQuality.toUpperCase(),
          `${Math.round((call.confidence || 0) * 100)}%`,
          call.productInterest || '',
          call.customerNeed || '',
          '', // Agent (not in Call type)
          '' // Recording URL (not in Call type)
        ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
      });

      // Combine headers and rows
      const csvContent = [headers.join(','), ...rows].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`✅ Exported ${leadsToExport.length} leads to CSV`);
      alert(`✅ Successfully exported ${leadsToExport.length} leads to CSV!`);

    } catch (error) {
      console.error('Error exporting leads:', error);
      alert('Failed to export leads. Please try again.');
    }
  }, [filteredCalls, getLeadScoreCategory]);

  // ==========================================
  // Fetch Calls from Database
  // ==========================================
  const fetchCalls = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("📞 Fetching calls from MongoDB...");

      const token = getAuthToken();
      console.log("🔐 Token retrieved:", token);
      console.log("🌐 API Base URL:", API_BASE_URL);
      console.log("📡 Full URL:", `${API_BASE_URL}/calls?limit=0`);

      const callsResponse = await fetch(`${API_BASE_URL}/calls?limit=0`, {
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

      console.log(`📊 Fetched ${fetchedCalls.length} calls from backend (already filtered by user phone)`);

      // Backend already filters by authenticated user's phone number
      // No need for client-side filtering - just use the data directly
      setCalls(fetchedCalls);
      console.log(`✅ Loaded ${fetchedCalls.length} calls for authenticated user`);

    } catch (error) {
      console.error("❌ Error in fetchCalls:", error);
      setError(error instanceof Error ? error.message : 'Failed to fetch calls');
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // Fetch Leads from Database
  // ==========================================
  const fetchDbLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      console.log("📊 Fetching leads from database...");
      const token = getAuthToken();

      const response = await fetch(`${API_BASE_URL}/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("📥 Leads response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to fetch leads: ${response.status}`);
      }

      const data = await response.json();
      const leads = data.data?.leads || [];

      setDbLeads(leads);
      console.log(`✅ Fetched ${leads.length} leads from database`);

    } catch (error) {
      console.error("❌ Error fetching leads:", error);
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalls();
    fetchDbLeads();
  }, [fetchCalls, fetchDbLeads]);

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
                newCallsData.forEach(newCall => {
                  const existingIndex = updatedCalls.findIndex(call => call._id === newCall._id);
                  if (existingIndex > -1) {
                    updatedCalls[existingIndex] = { ...updatedCalls[existingIndex], ...newCall };
                  } else {
                    updatedCalls.unshift(newCall);
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

    if (leadScore !== 'all') {
      filtered = filtered.filter(call => {
        const category = getLeadScoreCategory(call.confidence);
        return category === leadScore;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(call =>
        call._id.toLowerCase().includes(term) ||
        (call.from_number && call.from_number.toLowerCase().includes(term)) ||
        (call.to_number && call.to_number.toLowerCase().includes(term)) ||
        (call.name && call.name.toLowerCase().includes(term)) ||
        (call.phone && call.phone.includes(term)) ||
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
  }, [calls, filterStatus, sortField, sortOrder, searchTerm, leadScore, getLeadScoreCategory]);

  // ==========================================
  // Statistics
  // ==========================================
  const totalCalls = calls.length;
  const leadsCount = calls.filter(call => call.isLead === true).length;
  const analyzedCount = calls.filter(call => call.leadAnalysisAt).length;
  const pendingAnalysis = calls.filter(call =>
    (call.transcription || call.transcript) &&
    (!call.leadAnalysisAt)
  ).length;
  const noTranscriptionCount = calls.filter(call =>
    !call.transcription && !call.transcript
  ).length;
  const conversionRate = analyzedCount > 0 ? ((leadsCount / analyzedCount) * 100).toFixed(1) : "0";

  const hotLeads = calls.filter(call => call.isLead && call.confidence && call.confidence > 0.8).length;
  const warmLeads = calls.filter(call => call.isLead && call.confidence && call.confidence > 0.5 && call.confidence <= 0.8).length;
  const coldLeads = calls.filter(call => call.isLead && call.confidence && call.confidence <= 0.5).length;

  const BulkAnalysisButton = () => (
    <button
      onClick={analyzeAllPendingCalls}
      disabled={pendingAnalysis === 0 || processingQueue.length > 0}
      className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold text-xs sm:text-sm disabled:hover:scale-100"
    >
      <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span className="hidden sm:inline">Analyze All Pending ({pendingAnalysis})</span>
      <span className="sm:hidden">Analyze ({pendingAnalysis})</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border-2 border-orange-200"
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
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
            </div>
            <p className="text-2xl font-black bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">Loading Analytics...</p>
            <p className="text-sm text-slate-600">Fetching complete database from MongoDB</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-orange-100">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white rounded-lg shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
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
        <div className="max-w-8xl mx-auto space-y-6 sm:space-y-8">

          <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-100 border-2 border-orange-300 rounded-xl px-4 py-2 mb-3">
                  <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-bold text-orange-700">AI-Powered Analytics</span>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 via-orange-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Lead Analytics Dashboard
                </h1>
                <p className="text-slate-600 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg">
                  Real-time insights • Smart automation • OpenAI Analysis
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <BulkAnalysisButton />
                <button
                  onClick={() => setShowPromptEditor(true)}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white border-2 border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold hover:scale-105 transform"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden sm:inline">Customize AI</span>
                  <span className="sm:hidden">AI</span>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-600 shadow-lg">
                  <PhoneIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Total Calls</p>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent mb-2">{totalCalls.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">{noTranscriptionCount} without audio</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                  <TargetIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Leads Generated</p>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">{leadsCount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">{conversionRate}% of analyzed calls</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-orange-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg">
                  <ChartIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Analyzed Calls</p>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-2">{analyzedCount.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-slate-500">{pendingAnalysis} pending analysis</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border-2 border-sky-200 p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-sky-500 to-red-600 shadow-lg">
                  <ClockIcon />
                </div>
              </div>
              <div>
                <p className="text-slate-600 font-semibold mb-1 text-xs sm:text-sm">Conversion Rate</p>
                <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-sky-600 to-red-600 bg-clip-text text-transparent mb-2">{conversionRate}%</p>
                <p className="text-xs sm:text-sm text-slate-500">From analyzed calls</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white border-2 border-red-200 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-sky-600 rounded-xl backdrop-blur-sm shadow-md">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-red-600 to-sky-600 bg-clip-text text-transparent">{hotLeads}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">🔥 Hot Leads</h3>
              <p className="text-sm text-slate-600 font-medium">80%+ confidence score</p>
            </div>

            <div className="bg-white border-2 border-yellow-200 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-sky-500 rounded-xl backdrop-blur-sm shadow-md">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-yellow-600 to-sky-600 bg-clip-text text-transparent">{warmLeads}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">☀️ Warm Leads</h3>
              <p className="text-sm text-slate-600 font-medium">50-80% confidence score</p>
            </div>

            <div className="bg-white border-2 border-orange-200 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-cyan-600 rounded-xl backdrop-blur-sm shadow-md">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-5xl font-black bg-gradient-to-r from-orange-600 to-cyan-600 bg-clip-text text-transparent">{coldLeads}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">❄️ Cold Leads</h3>
              <p className="text-sm text-slate-600 font-medium">Below 50% confidence</p>
            </div>
          </div>

          {/* Generated Leads from Database */}
          {showDbLeads && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl border-2 border-green-200 p-4 sm:p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                      Generated Leads ({dbLeads.length})
                    </h2>
                    <p className="text-sm text-slate-600">Qualified leads from database</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDbLeads(false)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {leadsLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="text-slate-600 mt-2">Loading leads...</p>
                </div>
              ) : dbLeads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dbLeads.map((lead) => (
                    <div key={lead._id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all border border-green-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-800 mb-1">{lead.customer_name || lead.customerName}</h3>
                          <p className="text-sm text-slate-600">{lead.phone || lead.phoneNumber}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          lead.priority === 'High Priority' || lead.leadPriority === 'high'
                            ? 'bg-red-100 text-red-700'
                            : lead.priority === 'Medium Priority' || lead.leadPriority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {lead.priority || lead.leadPriority || 'Normal'}
                        </span>
                      </div>

                      {(lead.product_interest || lead.interests) && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-500 font-semibold mb-1">Interest:</p>
                          <p className="text-sm text-slate-700">{lead.product_interest || lead.interests?.[0] || 'N/A'}</p>
                        </div>
                      )}

                      {(lead.customer_need || lead.painPoints) && (
                        <div className="mb-2">
                          <p className="text-xs text-slate-500 font-semibold mb-1">Need:</p>
                          <p className="text-sm text-slate-700">{lead.customer_need || lead.painPoints?.[0] || 'N/A'}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          lead.status === 'New' || lead.leadStatus === 'new'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {lead.status || lead.leadStatus || 'New'}
                        </span>
                        {lead.leadScore && (
                          <span className="text-xs font-semibold text-slate-600">
                            Score: {lead.leadScore}/100
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="h-16 w-16 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-slate-500">No leads found in database</p>
                </div>
              )}
            </div>
          )}

          {!showDbLeads && (
            <button
              onClick={() => setShowDbLeads(true)}
              className="mb-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Show Generated Leads ({dbLeads.length})
            </button>
          )}

          <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:gap-6">

              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search calls, customers, products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 bg-gradient-to-r from-orange-50 to-orange-50 border-2 border-orange-200 rounded-xl focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-sm sm:text-base lg:text-lg text-slate-800 placeholder-slate-500 font-medium"
                  />
                  <svg className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {[
                  { value: 'all', label: 'All', fullLabel: 'All Calls', color: 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200', active: 'bg-gradient-to-r from-orange-500 to-orange-600' },
                  { value: 'leads', label: 'Leads', fullLabel: 'Leads Only', color: 'bg-green-50 text-green-700 border-green-300 hover:bg-green-100', active: 'bg-gradient-to-r from-green-500 to-emerald-600' },
                  { value: 'pending', label: 'Pending', fullLabel: 'Pending Analysis', color: 'bg-sky-50 text-sky-700 border-sky-300 hover:bg-sky-100', active: 'bg-gradient-to-r from-sky-500 to-sky-600' },
                  { value: 'no-leads', label: 'No Leads', fullLabel: 'No Leads', color: 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100', active: 'bg-gradient-to-r from-red-500 to-rose-600' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setFilterStatus(filter.value as FilterStatus)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-all duration-200 text-xs sm:text-sm border-2 ${
                      filterStatus === filter.value
                        ? filter.active + ' text-white shadow-lg transform scale-105'
                        : filter.color
                    }`}
                  >
                    <span className="sm:hidden">{filter.label}</span>
                    <span className="hidden sm:inline">{filter.fullLabel}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="text-slate-700 text-sm font-bold self-center">Lead Score:</span>
                {[
                  { value: 'all', label: 'All Scores', icon: '⭐', color: 'bg-orange-50 text-orange-700 border-orange-300', active: 'bg-gradient-to-r from-orange-500 to-pink-600' },
                  { value: 'hot', label: 'Hot (80%+)', icon: '🔥', color: 'bg-red-50 text-red-700 border-red-300', active: 'bg-gradient-to-r from-red-500 to-sky-600' },
                  { value: 'warm', label: 'Warm (50-80%)', icon: '☀️', color: 'bg-yellow-50 text-yellow-700 border-yellow-300', active: 'bg-gradient-to-r from-yellow-500 to-sky-500' },
                  { value: 'cold', label: 'Cold (<50%)', icon: '❄️', color: 'bg-orange-50 text-orange-700 border-orange-300', active: 'bg-gradient-to-r from-orange-500 to-cyan-600' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setLeadScore(filter.value as any)}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-bold transition-all duration-200 text-xs sm:text-sm border-2 ${
                      leadScore === filter.value
                        ? filter.active + ' text-white shadow-lg transform scale-105'
                        : filter.color + ' hover:scale-105'
                    }`}
                  >
                    {filter.icon} {filter.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                  onClick={fetchCalls}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-bold hover:scale-105 transform disabled:hover:scale-100"
                >
                  <svg className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh All Data'}
                </button>

                <button
                  onClick={exportLeadsToCSV}
                  disabled={filteredCalls.filter(c => c.isLead).length === 0}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base font-bold hover:scale-105 transform disabled:hover:scale-100"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Leads CSV
                </button>
              </div>
            </div>
          </div>

          {processingQueue.length > 0 && (
            <div className="bg-orange-50 border-l-4 border-sky-400 rounded-lg p-4">
              <div className="flex items-start">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-sky-600 mr-3 shrink-0 mt-0.5"></div>
                <div>
                  <h3 className="text-orange-800 font-semibold text-sm sm:text-base">Processing Calls with OpenAI</h3>
                  <p className="text-orange-700 text-xs sm:text-sm">
                    Analyzing {processingQueue.length} call{processingQueue.length > 1 ? 's' : ''} with AI...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filteredCalls.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-orange-200 p-8 sm:p-16 text-center">
                <div className="text-orange-400 mb-4 sm:mb-6">
                  <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">No calls found</h3>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredCalls.map((call) => (
                <CallCard
                  key={call._id}
                  call={call}
                  onAnalyze={() => processIndividualCall(call._id, call.leadAnalysisAt ? true : false)}
                  onViewDetails={() => setSelectedCall(call)}
                  isProcessing={processingQueue.includes(call._id)}
                />
              ))
            )}
          </div>

          <div className="text-center py-4 sm:py-6">
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
              Showing <span className="font-bold text-orange-600">{filteredCalls.length.toLocaleString()}</span> of <span className="font-bold text-orange-600">{totalCalls.toLocaleString()}</span> total calls
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
