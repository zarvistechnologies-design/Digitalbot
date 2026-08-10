"use client";

import Sidebar from "@/components/Sidebar";
import { doctorWhatsappAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Download,
  FileText,
  Image as ImageIcon,
  Menu,
  MessageCircle,
  Paperclip,
  Phone,
  RefreshCw,
  Search,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useState } from "react";

interface Conversation {
  conversationId: string;
  phone: string;
  metaPhoneNumberId: string;
  patientName?: string;
  latestMessage: string;
  latestType: string;
  latestAt: string;
  latestSentBy: string;
  messageCount: number;
  mediaCount: number;
}

interface ChatMessage {
  _id: string;
  phone: string;
  patientName?: string;
  message: string;
  type: "text" | "document" | "image" | "video" | "audio" | "template";
  mediaId?: string;
  documentName?: string;
  mimeType?: string;
  sentBy: string;
  status: string;
  createdAt: string;
}

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};

function MediaMessage({ message }: { message: ChatMessage }) {
  if (!message.mediaId) return null;
  const url = doctorWhatsappAPI.getMediaUrl(message.mediaId);
  if (message.type === "image") {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="block mt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={message.documentName || "Patient upload"} className="max-h-72 max-w-full rounded-xl object-contain bg-black/5" />
      </a>
    );
  }
  if (message.type === "video") return <video src={url} controls preload="metadata" className="mt-2 max-h-72 max-w-full rounded-xl" />;
  if (message.type === "audio") return <audio src={url} controls preload="metadata" className="mt-2 max-w-full" />;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 hover:bg-white">
      <FileText className="h-5 w-5 text-orange-500" />
      <span className="min-w-0 flex-1 truncate">{message.documentName || "Patient document"}</span>
      <Download className="h-4 w-4" />
    </a>
  );
}

export default function DoctorWhatsAppPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [selectedConversationId, setSelectedConversationId] = useState("");

  const conversationsQuery = useQuery({
    queryKey: ["doctor-whatsapp", "conversations", deferredSearch],
    queryFn: async () => {
      const response = await doctorWhatsappAPI.getConversations({ limit: 100, search: deferredSearch || undefined });
      return response.data.data as Conversation[];
    },
  });
  const messagesQuery = useQuery({
    queryKey: ["doctor-whatsapp", "messages", selectedConversationId],
    enabled: Boolean(selectedConversationId),
    queryFn: async () => {
      const conversation = conversations.find(item => item.conversationId === selectedConversationId);
      if (!conversation) return [];
      return (await doctorWhatsappAPI.getMessages(conversation.phone, { metaPhoneNumberId: conversation.metaPhoneNumberId, limit: 200 })).data.data as ChatMessage[];
    },
  });

  const conversations = conversationsQuery.data || [];
  const selectedConversation = conversations.find(item => item.conversationId === selectedConversationId);

  useEffect(() => {
    if (!selectedConversationId && conversations[0]) setSelectedConversationId(conversations[0].conversationId);
    if (selectedConversationId && conversations.length > 0 && !conversations.some(item => item.conversationId === selectedConversationId)) {
      setSelectedConversationId(conversations[0].conversationId);
    }
  }, [conversations, selectedConversationId]);

  const refresh = () => {
    void conversationsQuery.refetch();
    if (selectedConversationId) void messagesQuery.refetch();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg lg:hidden">
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="min-w-0 flex-1 p-4 pt-16 lg:ml-64 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-emerald-600"><Stethoscope className="h-4 w-4" /> Doctor Desk</div>
              <h1 className="text-3xl font-bold text-slate-900">Patient Inbox</h1>
              <p className="mt-1 text-sm text-slate-500">View patient conversations, images, videos, audio, and documents.</p>
            </div>
            <button onClick={refresh} disabled={conversationsQuery.isFetching || messagesQuery.isFetching} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${(conversationsQuery.isFetching || messagesQuery.isFetching) ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>

          <div className="grid min-h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[360px_minmax(0,1fr)]">
            <section className={`${selectedConversationId ? "hidden lg:flex" : "flex"} min-h-0 flex-col border-r border-slate-200`}>
              <div className="space-y-3 border-b border-slate-200 p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search patient or message" className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100" />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {conversationsQuery.isLoading && <div className="p-8 text-center text-sm text-slate-400">Loading conversations…</div>}
                {conversationsQuery.isError && <div className="p-8 text-center text-sm text-red-500">Could not load conversations.</div>}
                {!conversationsQuery.isLoading && conversations.length === 0 && <div className="p-10 text-center"><MessageCircle className="mx-auto mb-3 h-9 w-9 text-slate-300" /><p className="text-sm text-slate-500">No WhatsApp chats found.</p></div>}
                {conversations.map(conversation => (
                  <button key={conversation.conversationId} onClick={() => setSelectedConversationId(conversation.conversationId)} className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedConversationId === conversation.conversationId ? "bg-emerald-50/70" : ""}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><UserRound className="h-5 w-5" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-semibold text-slate-900">{conversation.patientName || `+${conversation.phone}`}</p><span className="shrink-0 text-[11px] text-slate-400">{formatTime(conversation.latestAt)}</span></div>
                        <p className="mt-0.5 truncate text-xs text-slate-500">{conversation.latestMessage || `[${conversation.latestType}]`}</p>
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{conversation.messageCount} messages</span>
                          {conversation.mediaCount > 0 && <><span>•</span><Paperclip className="h-3 w-3" /><span>{conversation.mediaCount}</span></>}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className={`${selectedConversationId ? "flex" : "hidden lg:flex"} min-h-0 flex-col bg-slate-50/60`}>
              {!selectedConversationId ? (
                <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageCircle className="mx-auto mb-3 h-12 w-12 text-slate-300" /><p className="font-medium text-slate-600">Select a patient conversation</p></div></div>
              ) : (
                <>
                  <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                    <button onClick={() => setSelectedConversationId("")} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"><X className="h-5 w-5" /></button>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><UserRound className="h-5 w-5" /></div>
                    <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{selectedConversation?.patientName || `+${selectedConversation?.phone}`}</p><p className="flex items-center gap-1 text-xs text-slate-500"><Phone className="h-3 w-3" /> +{selectedConversation?.phone}</p></div>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-6">
                    {messagesQuery.isLoading && <div className="py-12 text-center text-sm text-slate-400">Loading messages…</div>}
                    {messagesQuery.isError && <div className="py-12 text-center text-sm text-red-500">Could not load messages.</div>}
                    {(messagesQuery.data || []).map(message => {
                      const incoming = message.sentBy === "patient";
                      return (
                        <div key={message._id} className={`flex ${incoming ? "justify-start" : "justify-end"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[70%] ${incoming ? "rounded-bl-md border border-slate-200 bg-white text-slate-800" : "rounded-br-md bg-emerald-600 text-white"}`}>
                            {message.message && !message.message.startsWith("[") && <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.message}</p>}
                            <MediaMessage message={message} />
                            {!message.mediaId && message.type !== "text" && <div className="mt-1 flex items-center gap-2 text-sm"><ImageIcon className="h-4 w-4" /> {message.documentName || `${message.type} message`}</div>}
                            <p className={`mt-1 text-right text-[10px] ${incoming ? "text-slate-400" : "text-emerald-100"}`}>{formatTime(message.createdAt)} · {incoming ? "Patient" : message.sentBy === "bot" ? "Assistant" : "Clinic"}</p>
                          </div>
                        </div>
                      );
                    })}
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
