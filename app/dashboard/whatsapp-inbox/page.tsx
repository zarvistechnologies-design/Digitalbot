"use client";

import Sidebar from "@/components/Sidebar";
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  CheckCheck,
  Inbox,
  Menu,
  MessageCircle,
  RefreshCw,
  Search,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://digital-api-46ss.onrender.com/api";

interface Conversation {
  phone: string;
  patientName?: string;
  lastMessage: string;
  lastMessageType: string;
  lastSentBy: string;
  lastStatus: string;
  lastActivity: string;
  messageCount: number;
}

interface WhatsAppMessage {
  _id: string;
  phone: string;
  patientName?: string;
  message: string;
  type: string;
  sentBy: string;
  status: string;
  error?: string;
  createdAt: string;
}

function getAuthHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  return { Authorization: `Bearer ${token}` };
}

function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return digits ? `+${digits}` : "Unknown number";
}

function formatListTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function formatMessageTime(value: string) {
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WhatsAppInboxPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const selectedConversation = conversations.find(
    (conversation) => conversation.phone === selectedPhone
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.phone.includes(query) ||
        conversation.patientName?.toLowerCase().includes(query) ||
        conversation.lastMessage?.toLowerCase().includes(query)
    );
  }, [conversations, search]);

  const loadMessages = useCallback(async (phone: string, quiet = false) => {
    if (!phone) return;
    if (!quiet) setMessagesLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/whatsapp-inbox/conversations/${encodeURIComponent(phone)}/messages`,
        { headers: getAuthHeaders() }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load messages.");
      setMessages(data.messages || []);
      setError("");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load messages.");
    } finally {
      if (!quiet) setMessagesLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/whatsapp-inbox/conversations`, {
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load the inbox.");
      const nextConversations: Conversation[] = data.conversations || [];
      setConversations(nextConversations);
      setError("");
      setSelectedPhone((current) => current || nextConversations[0]?.phone || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load the inbox.");
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  const refreshInbox = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadConversations(true),
      selectedPhone ? loadMessages(selectedPhone, true) : Promise.resolve(),
    ]);
    setRefreshing(false);
  }, [loadConversations, loadMessages, selectedPhone]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (selectedPhone) loadMessages(selectedPhone);
  }, [loadMessages, selectedPhone]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      loadConversations(true);
      if (selectedPhone) loadMessages(selectedPhone, true);
    }, 20000);
    return () => window.clearInterval(timer);
  }, [loadConversations, loadMessages, selectedPhone]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">WhatsApp Inbox</h1>
              <p className="hidden text-xs text-slate-500 sm:block">
                Read-only patient conversations
              </p>
            </div>
          </div>
          <button
            onClick={refreshInbox}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </header>

        {error && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-6">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
            <button onClick={() => setError("")} className="ml-auto" aria-label="Dismiss">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="h-[calc(100vh-4rem)] p-0 sm:p-6">
          <div className="flex h-full overflow-hidden border-slate-200 bg-white sm:rounded-2xl sm:border sm:shadow-sm">
            <section
              className={`w-full flex-col border-r border-slate-200 md:flex md:w-80 lg:w-96 ${
                selectedPhone ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="border-b border-slate-200 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search patient or number"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="space-y-3 p-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="h-20 animate-pulse rounded-xl bg-slate-100" />
                    ))}
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <Inbox className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-semibold text-slate-700">No conversations yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      New patient messages will appear here.
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.phone}
                      onClick={() => setSelectedPhone(conversation.phone)}
                      className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                        selectedPhone === conversation.phone ? "bg-orange-50" : ""
                      }`}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {conversation.patientName || formatPhone(conversation.phone)}
                          </p>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {formatListTime(conversation.lastActivity)}
                          </span>
                        </div>
                        {conversation.patientName && (
                          <p className="truncate text-xs text-slate-500">
                            {formatPhone(conversation.phone)}
                          </p>
                        )}
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {conversation.lastSentBy !== "patient" && "You: "}
                          {conversation.lastMessage || `[${conversation.lastMessageType}]`}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section
              className={`min-w-0 flex-1 flex-col bg-[#f5f1eb] ${
                selectedPhone ? "flex" : "hidden md:flex"
              }`}
            >
              {!selectedConversation ? (
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <div className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-700">
                    <MessageCircle className="h-9 w-9" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Select a conversation</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose a patient to view their message history.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4">
                    <button
                      onClick={() => setSelectedPhone("")}
                      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-slate-900">
                        {selectedConversation.patientName || formatPhone(selectedConversation.phone)}
                      </h2>
                      <p className="text-xs text-slate-500">
                        {formatPhone(selectedConversation.phone)}
                      </p>
                    </div>
                    <span className="ml-auto rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                      Read only
                    </span>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
                    {messagesLoading ? (
                      <div className="flex h-full items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500">
                        No messages in this conversation.
                      </div>
                    ) : (
                      messages.map((message) => {
                        const incoming = message.sentBy === "patient";
                        return (
                          <div
                            key={message._id}
                            className={`flex ${incoming ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm sm:max-w-[70%] ${
                                incoming
                                  ? "rounded-tl-sm bg-white text-slate-800"
                                  : "rounded-tr-sm bg-emerald-100 text-slate-800"
                              }`}
                            >
                              <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                {incoming ? (
                                  <>
                                    <User className="h-3 w-3" /> Patient
                                  </>
                                ) : (
                                  <>
                                    <Bot className="h-3 w-3" /> Bot
                                  </>
                                )}
                              </div>
                              <p className="whitespace-pre-wrap break-words text-sm">
                                {message.message || `[${message.type} message]`}
                              </p>
                              <div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-slate-400">
                                {formatMessageTime(message.createdAt)}
                                {!incoming && <CheckCheck className="h-3.5 w-3.5" />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
