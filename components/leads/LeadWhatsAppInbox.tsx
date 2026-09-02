"use client";

import Sidebar from "@/components/Sidebar";
import { whatsappInboxAPI } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock3,
  Download,
  FileText,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Paperclip,
  Phone,
  RefreshCw,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useRef, useState } from "react";

interface Conversation {
  conversationId: string;
  phone: string;
  metaPhoneNumberId: string;
  contactName?: string;
  latestMessage: string;
  latestType: string;
  latestAt: string;
  messageCount: number;
  mediaCount: number;
}

interface ChatMessage {
  _id: string;
  phone: string;
  message: string;
  type: "text" | "document" | "image" | "video" | "audio" | "template";
  mediaId?: string;
  documentName?: string;
  sentBy: string;
  createdAt: string;
}

interface MessagesResult {
  messages: ChatMessage[];
  isServiceWindowOpen: boolean;
  serviceWindowExpiresAt: string | null;
}

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  if (date.toDateString() === new Date().toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};

const formatPhone = (phone?: string) => phone ? (phone.startsWith("+") ? phone : `+${phone}`) : "";
const isIncoming = (sentBy: string) => ["patient", "contact", "customer", "user", "inbound"].includes(String(sentBy || "").toLowerCase());
const senderLabel = (sentBy: string) => isIncoming(sentBy) ? "Contact" : sentBy === "bot" ? "AI Assistant" : sentBy === "voice_agent" ? "Voice Agent" : "Team";

function MediaMessage({ message }: { message: ChatMessage }) {
  if (!message.mediaId) return null;
  const url = whatsappInboxAPI.getMediaUrl(message.mediaId);
  if (message.type === "image") {
    return <a href={url} target="_blank" rel="noreferrer" className="mt-2 block">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={url} alt={message.documentName || "WhatsApp image"} className="max-h-72 max-w-full rounded-xl bg-black/5 object-contain" /></a>;
  }
  if (message.type === "video") return <video src={url} controls preload="metadata" className="mt-2 max-h-72 max-w-full rounded-xl" />;
  if (message.type === "audio") return <audio src={url} controls preload="metadata" className="mt-2 max-w-full" />;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 hover:bg-white">
      <FileText className="h-5 w-5 text-orange-500" /><span className="min-w-0 flex-1 truncate">{message.documentName || "Shared document"}</span><Download className="h-4 w-4" />
    </a>
  );
}

export default function LeadWhatsAppInbox() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const deferredSearch = useDeferredValue(search);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationsQuery = useQuery({
    queryKey: ["lead-whatsapp-inbox", "conversations", deferredSearch],
    queryFn: async () => (await whatsappInboxAPI.getConversations({ limit: 100, search: deferredSearch || undefined })).data.data as Conversation[],
  });
  const conversations = conversationsQuery.data || [];
  const selectedConversation = conversations.find(item => item.conversationId === selectedConversationId);
  const messagesQuery = useQuery({
    queryKey: ["lead-whatsapp-inbox", "messages", selectedConversationId],
    enabled: Boolean(selectedConversation),
    queryFn: async (): Promise<MessagesResult> => {
      if (!selectedConversation) return { messages: [], isServiceWindowOpen: false, serviceWindowExpiresAt: null };
      const response = await whatsappInboxAPI.getMessages(selectedConversation.phone, {
        metaPhoneNumberId: selectedConversation.metaPhoneNumberId,
        limit: 200,
      });
      return {
        messages: response.data.data as ChatMessage[],
        isServiceWindowOpen: Boolean(response.data.isServiceWindowOpen),
        serviceWindowExpiresAt: response.data.serviceWindowExpiresAt || null,
      };
    },
  });
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedConversation) throw new Error("Select a conversation first");
      return whatsappInboxAPI.sendMessage(selectedConversation.phone, {
        metaPhoneNumberId: selectedConversation.metaPhoneNumberId,
        message: reply.trim(),
      });
    },
    onSuccess: async () => {
      setReply("");
      setReplyError("");
      await Promise.all([messagesQuery.refetch(), conversationsQuery.refetch()]);
    },
    onError: (error: unknown) => {
      const requestError = error as { response?: { data?: { error?: string } }; message?: string };
      setReplyError(requestError.response?.data?.error || requestError.message || "Could not send the message");
    },
  });

  useEffect(() => {
    if (selectedConversationId && conversationsQuery.isFetched && !conversations.some(item => item.conversationId === selectedConversationId)) {
      setSelectedConversationId("");
    }
  }, [conversations, conversationsQuery.isFetched, selectedConversationId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messagesQuery.data]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const expiresAt = messagesQuery.data?.serviceWindowExpiresAt;
    if (!expiresAt) return;
    const delay = new Date(expiresAt).getTime() - Date.now();
    if (delay <= 0) {
      setNow(Date.now());
      return;
    }
    const timer = window.setTimeout(() => setNow(Date.now()), Math.min(delay + 50, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [messagesQuery.data?.serviceWindowExpiresAt]);
  useEffect(() => {
    setReply("");
    setReplyError("");
  }, [selectedConversationId]);

  const serviceWindowExpiresAt = messagesQuery.data?.serviceWindowExpiresAt;
  const serviceWindowOpen = Boolean(
    serviceWindowExpiresAt && new Date(serviceWindowExpiresAt).getTime() > now
  );

  const submitReply = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReplyError("");
    if (reply.trim() && serviceWindowOpen && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate();
    }
  };

  const refresh = () => {
    void conversationsQuery.refetch();
    if (selectedConversation) void messagesQuery.refetch();
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-slate-50">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg lg:hidden" aria-label="Toggle navigation">
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="h-dvh min-w-0 flex-1 overflow-hidden p-4 pt-16 lg:ml-64 lg:p-8">
        <div className="mx-auto flex h-full max-w-7xl flex-col">
          <div className="mb-4 flex shrink-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-600"><MessageCircle className="h-4 w-4" /> Lead Service</div>
              <h1 className="text-3xl font-bold text-slate-900">WhatsApp Inbox</h1>
              <p className="mt-1 text-sm text-slate-500">Review your lead conversations and shared WhatsApp media in one place.</p>
            </div>
            <button onClick={refresh} disabled={conversationsQuery.isFetching || messagesQuery.isFetching} className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 sm:self-auto">
              <RefreshCw className={`h-4 w-4 ${conversationsQuery.isFetching || messagesQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className={`${selectedConversationId ? "hidden lg:grid" : "grid"} min-h-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden border-r border-slate-200`}>
              <div className="shrink-0 border-b border-slate-200 p-4">
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search contact or message" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" /></div>
              </div>
              <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto">
                {conversationsQuery.isLoading && <div className="p-8 text-center text-sm text-slate-400">Loading conversations...</div>}
                {conversationsQuery.isError && <div className="p-8 text-center text-sm text-red-500">Could not load Lead WhatsApp conversations.</div>}
                {!conversationsQuery.isLoading && !conversationsQuery.isError && conversations.length === 0 && <div className="p-10 text-center"><MessageCircle className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="text-sm font-medium text-slate-600">No WhatsApp conversations yet</p><p className="mt-1 text-xs text-slate-400">New lead messages will appear here.</p></div>}
                {conversations.map(conversation => (
                  <button key={conversation.conversationId} onClick={() => setSelectedConversationId(conversation.conversationId)} className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedConversationId === conversation.conversationId ? "bg-emerald-50/70" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><UserRound className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-slate-900">{conversation.contactName || formatPhone(conversation.phone)}</p><span className="shrink-0 text-[11px] text-slate-400">{formatTime(conversation.latestAt)}</span></div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{conversation.latestMessage || `[${conversation.latestType}]`}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400"><span>{conversation.messageCount} messages</span>{conversation.mediaCount > 0 && <><span>•</span><Paperclip className="h-3 w-3" /><span>{conversation.mediaCount}</span></>}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className={`${selectedConversationId ? "grid" : "hidden lg:grid"} min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-slate-50/60`}>
              {!selectedConversation ? (
                <div className="row-span-3 flex min-h-0 items-center justify-center p-8 text-center"><div><MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" /><p className="font-medium text-slate-600">Select a WhatsApp conversation</p></div></div>
              ) : (
                <>
                  <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <button onClick={() => setSelectedConversationId("")} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Back to conversations"><ArrowLeft className="h-5 w-5" /></button>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><UserRound className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{selectedConversation.contactName || formatPhone(selectedConversation.phone)}</p><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> {formatPhone(selectedConversation.phone)}</p></div>
                  </div>
                  <div className="min-h-0 flex-1 space-y-3 overscroll-contain overflow-y-auto p-4 sm:p-6">
                    {messagesQuery.isLoading && <div className="py-12 text-center text-sm text-slate-400">Loading messages...</div>}
                    {messagesQuery.isError && <div className="py-12 text-center text-sm text-red-500">Could not load messages.</div>}
                    {(messagesQuery.data?.messages || []).map(message => {
                      const incoming = isIncoming(message.sentBy);
                      return (
                        <div key={message._id} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[70%] ${incoming ? "rounded-bl-md border border-slate-200 bg-white text-slate-800" : "rounded-br-md bg-emerald-600 text-white"}`}>
                            {message.message && !message.message.startsWith("[") && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.message}</p>}
                            <MediaMessage message={message} />
                            {!message.mediaId && message.type !== "text" && <div className="mt-1 flex items-center gap-2 text-sm"><ImageIcon className="h-4 w-4" />{message.documentName || `${message.type} message`}</div>}
                            <p className={`mt-1 text-right text-[10px] ${incoming ? "text-slate-400" : "text-emerald-100"}`}>{formatTime(message.createdAt)} · {senderLabel(message.sentBy)}</p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
                    {messagesQuery.isLoading ? (
                      <p className="text-xs text-slate-500">Checking the WhatsApp reply window...</p>
                    ) : serviceWindowOpen ? (
                      <form onSubmit={submitReply} className="flex items-end gap-2">
                        <textarea
                          value={reply}
                          onChange={event => setReply(event.target.value)}
                          disabled={sendMessageMutation.isPending}
                          maxLength={4096}
                          rows={1}
                          placeholder="Type a reply to this lead"
                          className="min-h-11 max-h-32 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                        />
                        <button
                          type="submit"
                          disabled={!reply.trim() || sendMessageMutation.isPending}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Send WhatsApp message"
                        >
                          <Send className={`h-4 w-4 ${sendMessageMutation.isPending ? "animate-pulse" : ""}`} />
                        </button>
                      </form>
                    ) : (
                      <p className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <Clock3 className="h-3.5 w-3.5" /> The 24-hour reply window is closed.
                      </p>
                    )}
                    {replyError && <p className="mt-2 text-xs font-medium text-red-600">{replyError}</p>}
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
