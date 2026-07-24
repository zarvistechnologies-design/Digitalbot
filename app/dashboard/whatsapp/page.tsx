'use client';

import Sidebar from '@/components/Sidebar';
import { whatsappInboxAPI } from '@/lib/api';
import {
  ArrowLeft, CheckCheck, ChevronDown, CircleUserRound, Filter, Menu, MessageCircle,
  MoreVertical, Phone, Plus, Search, Video, X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Message = { id: string | number; text: string; time: string; mine: boolean };
type Conversation = {
  id: string | number; name: string; phone: string; preview: string; time: string;
  unread: number; online?: boolean; avatar: string; color: string; messages: Message[];
};

const initialChats: Conversation[] = [
  {
    id: 1, name: 'Priya Sharma', phone: '+91 98765 43210', preview: 'Thank you! I will be there.', time: '10:42 AM',
    unread: 2, online: true, avatar: 'PS', color: 'bg-violet-500',
    messages: [
      { id: 1, text: 'Hi, I would like to book an appointment for tomorrow.', time: '10:32 AM', mine: false },
      { id: 2, text: 'Of course, Priya! We have a slot available at 11:30 AM. Would that work for you?', time: '10:35 AM', mine: true },
      { id: 3, text: 'Yes, that works perfectly.', time: '10:38 AM', mine: false },
      { id: 4, text: 'Your appointment is confirmed for tomorrow at 11:30 AM. We look forward to seeing you!', time: '10:40 AM', mine: true },
      { id: 5, text: 'Thank you! I will be there.', time: '10:42 AM', mine: false },
    ],
  },
  {
    id: 2, name: 'Rahul Verma', phone: '+91 99876 54321', preview: 'Can you share the pricing details?', time: '9:18 AM',
    unread: 1, avatar: 'RV', color: 'bg-emerald-500',
    messages: [
      { id: 1, text: 'Hello! Can you share the pricing details?', time: '9:18 AM', mine: false },
      { id: 2, text: 'Absolutely. Which service are you interested in?', time: '9:20 AM', mine: true },
    ],
  },
  {
    id: 3, name: 'Ananya Gupta', phone: '+91 91234 56789', preview: 'The document has been received.', time: 'Yesterday',
    unread: 0, avatar: 'AG', color: 'bg-pink-500',
    messages: [
      { id: 1, text: 'I have uploaded the requested document.', time: '4:12 PM', mine: false },
      { id: 2, text: 'The document has been received. Thank you!', time: '4:14 PM', mine: true },
    ],
  },
  {
    id: 4, name: 'Vikram Singh', phone: '+91 97654 32109', preview: 'Perfect, see you soon!', time: 'Yesterday',
    unread: 0, avatar: 'VS', color: 'bg-amber-500',
    messages: [{ id: 1, text: 'Perfect, see you soon!', time: '5:32 PM', mine: false }],
  },
  {
    id: 5, name: 'Neha Kapoor', phone: '+91 90000 11223', preview: 'Is support available on Sunday?', time: 'Monday',
    unread: 0, avatar: 'NK', color: 'bg-sky-500',
    messages: [{ id: 1, text: 'Is support available on Sunday?', time: '11:05 AM', mine: false }],
  },
];

export default function WhatsAppPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [selectedId, setSelectedId] = useState<string | number>(1);
  const [query, setQuery] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const [mobileChat, setMobileChat] = useState(false);
  const [syncing, setSyncing] = useState(true);

  const fromApi = (conversation: any): Conversation => ({
    id: conversation.phone,
    name: conversation.patientName || conversation.phone || 'WhatsApp patient',
    phone: conversation.phone || '',
    preview: conversation.lastMessage || 'Start a conversation',
    time: new Date(conversation.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    unread: 0,
    avatar: String(conversation.patientName || 'WP').split(/\s+/).slice(0, 2).map((part: string) => part[0]).join('').toUpperCase(),
    color: 'bg-emerald-500',
    messages: [],
  });

  const loadMessages = async (phone: string) => {
    try {
      const response = await whatsappInboxAPI.getMessages(phone);
      const messages = (response.data?.messages || []).map((message: any) => ({
        id: message._id,
        text: message.message || `[${message.type || 'media'} message]`,
        time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mine: message.sentBy !== 'patient',
      }));
      setChats((current) => current.map((chat) => chat.phone === phone ? { ...chat, messages } : chat));
    } catch {
      // The conversation list stays usable when an individual history refresh fails.
    }
  };

  useEffect(() => {
    let active = true;
    whatsappInboxAPI.getConversations()
      .then((response) => {
        const persisted = (response.data?.conversations || []).map(fromApi);
        if (active && persisted.length) {
          setChats(persisted);
          setSelectedId(persisted[0].id);
          void loadMessages(persisted[0].phone);
        }
      })
      .catch(() => {
        // Keep the preview conversations available if the API is offline.
      })
      .finally(() => active && setSyncing(false));
    return () => { active = false; };
  }, []);

  const selected = chats.find((chat) => chat.id === selectedId) || chats[0];
  const filtered = useMemo(() => chats.filter((chat) =>
    `${chat.name} ${chat.phone} ${chat.preview}`.toLowerCase().includes(query.toLowerCase())
  ), [chats, query]);

  const chooseChat = (id: string | number) => {
    setSelectedId(id);
    setMobileChat(true);
    setChats((current) => current.map((chat) => chat.id === id ? { ...chat, unread: 0 } : chat));
    const chat = chats.find((item) => item.id === id);
    if (chat) void loadMessages(chat.phone);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <main className="min-h-screen lg:pl-64">
        <div className="flex h-screen flex-col p-0 lg:p-5">
          <header className="hidden items-center justify-between pb-4 lg:flex">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <MessageCircle className="h-4 w-4" /> WhatsApp Business
              </div>
              <h1 className="mt-1 text-2xl font-bold">Conversations</h1>
            </div>
            <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              <Plus className="h-4 w-4" /> New conversation
            </button>
          </header>

          <section className="flex min-h-0 flex-1 overflow-hidden border-slate-200 bg-white shadow-sm lg:rounded-2xl lg:border">
            <aside className={`${mobileChat ? 'hidden md:flex' : 'flex'} w-full shrink-0 flex-col border-r border-slate-200 md:w-[350px]`}>
              <div className="border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="pl-12 lg:pl-0">
                  <h2 className="font-bold">Messages</h2>
                    <p className="text-xs text-slate-500">{syncing ? 'Syncing conversations…' : `${chats.reduce((sum, chat) => sum + chat.unread, 0)} unread conversations`}</p>
                  </div>
                  <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><MoreVertical className="h-5 w-5" /></button>
                </div>
                <div className="mt-4 flex gap-2">
                  <label className="flex flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversations" className="w-full bg-transparent py-2.5 text-sm outline-none" />
                  </label>
                  <button className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"><Filter className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.map((chat) => (
                  <button key={chat.id} onClick={() => chooseChat(chat.id)} className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${selectedId === chat.id ? 'bg-emerald-50/70' : ''}`}>
                    <div className="relative">
                      <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white ${chat.color}`}>{chat.avatar}</span>
                      {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{chat.name}</p>
                        <span className={`shrink-0 text-[11px] ${chat.unread ? 'font-semibold text-emerald-600' : 'text-slate-400'}`}>{chat.time}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-xs text-slate-500">{chat.preview}</p>
                        {chat.unread > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white">{chat.unread}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <div className={`${mobileChat ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col`}>
              <div className="flex h-[73px] items-center gap-3 border-b border-slate-200 px-4">
                <button onClick={() => setMobileChat(false)} className="rounded-lg p-2 hover:bg-slate-100 md:hidden"><ArrowLeft className="h-5 w-5" /></button>
                <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold text-white ${selected.color}`}>{selected.avatar}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold">{selected.name}</h2>
                  <p className="text-xs text-emerald-600">{selected.online ? 'online' : selected.phone}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <button className="rounded-lg p-2 hover:bg-slate-100"><Video className="h-5 w-5" /></button>
                  <button className="rounded-lg p-2 hover:bg-slate-100"><Phone className="h-5 w-5" /></button>
                  <button onClick={() => setShowDetails(!showDetails)} className="rounded-lg p-2 hover:bg-slate-100"><MoreVertical className="h-5 w-5" /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-[#efeae2] p-4 sm:p-6">
                <div className="mx-auto flex max-w-3xl flex-col gap-2">
                  <div className="mx-auto mb-3 rounded-lg bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">Today</div>
                  <div className="mx-auto mb-4 max-w-md rounded-lg bg-[#fff5c4] px-4 py-2 text-center text-[11px] text-slate-600 shadow-sm">
                    Messages are protected with end-to-end encryption.
                  </div>
                  {selected.messages.map((message) => (
                    <div key={message.id} className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[82%] rounded-xl px-3 py-2 shadow-sm ${message.mine ? 'rounded-tr-sm bg-[#d9fdd3]' : 'rounded-tl-sm bg-white'}`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 pl-8 text-[10px] text-slate-500">
                          {message.time}{message.mine && <CheckCheck className="h-3.5 w-3.5 text-sky-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 bg-white p-3 text-center text-xs font-medium text-slate-500">
                Read-only inbox — replies are sent automatically by the WhatsApp bot
              </div>
            </div>

            {showDetails && (
              <aside className="hidden w-[270px] shrink-0 border-l border-slate-200 xl:block">
                <div className="flex items-center justify-between border-b border-slate-200 p-4">
                  <h3 className="font-semibold">Contact details</h3>
                  <button onClick={() => setShowDetails(false)} className="rounded-lg p-1.5 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                </div>
                <div className="p-5 text-center">
                  <span className={`mx-auto grid h-20 w-20 place-items-center rounded-full text-xl font-bold text-white ${selected.color}`}>{selected.avatar}</span>
                  <h3 className="mt-3 font-bold">{selected.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{selected.phone}</p>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[[MessageCircle, 'Message'], [Phone, 'Call'], [Video, 'Video']].map(([Icon, label]) => {
                      const DetailIcon = Icon as typeof Phone;
                      return <button key={String(label)} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 p-2 text-[10px] font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"><DetailIcon className="h-4 w-4" />{String(label)}</button>;
                    })}
                  </div>
                </div>
                <div className="border-t border-slate-100 p-4">
                  <button className="flex w-full items-center justify-between py-2 text-left text-sm font-medium">Customer information <ChevronDown className="h-4 w-4" /></button>
                  <div className="mt-2 space-y-3 text-xs">
                    <div><p className="text-slate-400">Status</p><p className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 font-medium text-emerald-700">Active customer</p></div>
                    <div><p className="text-slate-400">Assigned to</p><p className="mt-1 flex items-center gap-2 font-medium"><CircleUserRound className="h-4 w-4" /> Support Team</p></div>
                    <div><p className="text-slate-400">Tags</p><p className="mt-1"><span className="rounded-md bg-violet-50 px-2 py-1 text-violet-700">Appointment</span></p></div>
                  </div>
                </div>
              </aside>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
