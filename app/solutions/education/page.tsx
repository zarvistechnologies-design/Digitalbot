"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarCheck,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  Languages,
  MessageCircle,
  PhoneCall,
  School,
  Sparkles,
  Users
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// ─── Images ───────────────────────────────────────────────────────────────────
const campusConnectImage   = "/images/education/campus-connect.webp"
const mbaWhatsappFormImage = "/images/education/mba-whatsapp-form.png"

// ─── Data ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: "95%",   label: "WhatsApp open rate", note: "Brochures and reminders are seen fast" },
  { value: "3 sec", label: "First response",      note: "Every admission inquiry gets attention" },
  { value: "24/7",  label: "Student support",     note: "Works after office hours and weekends" },
  { value: "60%",   label: "More visits",          note: "Automated follow-ups book more demos" },
]

const services = [
  {
    icon: MessageCircle,
    title: "Admission Inquiry Bot",
    body: "Answers course, fee, eligibility, hostel, scholarship, and deadline questions instantly on WhatsApp.",
  },
  {
    icon: ClipboardCheck,
    title: "Lead Qualification",
    body: "Collects course interest, budget, location, timeline, and contact details before a counselor calls.",
  },
  {
    icon: CalendarCheck,
    title: "Demo and Visit Booking",
    body: "Lets students choose slots for demo classes, counseling calls, or campus visits without phone tag.",
  },
  {
    icon: CreditCard,
    title: "Fee Reminders",
    body: "Sends due-date reminders, payment links, receipt updates, and installment nudges automatically.",
  },
  {
    icon: Languages,
    title: "Regional Language Support",
    body: "Supports parent and student conversations in Hindi, English, and local-language flows.",
  },
  {
    icon: Bot,
    title: "Counselor Handoff",
    body: "Routes hot leads to the right counselor with full chat history and next-best action.",
  },
]

const audiences = [
  { icon: School,        title: "Schools and K-12",         text: "Admissions, PTM reminders, fee alerts, circulars, and transport updates." },
  { icon: GraduationCap, title: "Colleges and Universities", text: "Course counseling, application status, scholarship queries, and campus visits." },
  { icon: BookOpen,      title: "Coaching Institutes",       text: "Batch info, demo class booking, exam prep FAQs, and seat availability alerts." },
  { icon: Users,         title: "Online Academies",          text: "Trial lessons, subscription reminders, course recommendations, and learner support." },
]

const journey = [
  { step: "01", title: "Student asks on WhatsApp",      text: "The AI welcomes them, understands intent, and answers the first question instantly." },
  { step: "02", title: "AI captures admission details",  text: "Course, budget, preferred location, start date, parent details, and urgency are recorded." },
  { step: "03", title: "Brochure and fee info sent",     text: "PDFs, fee plans, syllabus, campus photos, and scholarship details are shared in the same chat." },
  { step: "04", title: "Visit or demo gets booked",      text: "Qualified students pick a slot and your counselor receives a clean daily schedule." },
]

const comparison = [
  ["Response speed",     "Instant, 24/7",                   "Delayed calls and missed chats"],
  ["Brochure delivery",  "Sent inside WhatsApp",            "Email attachments ignored"],
  ["Counselor workload", "Only qualified leads reach staff", "Every repeated query handled manually"],
  ["Follow-up",          "Automated sequences",             "Manual calling and spreadsheets"],
  ["Fee collection",     "Smart reminders with links",      "Late reminders and cash-flow gaps"],
]


const chatMessages = [
  { from: "user", text: "Hi, I want to know about your MBA program" },
  { from: "bot",  text: "Welcome to BrightFuture Academy! I can help you with admissions. Which program interests you?\n- MBA\n- BBA\n- B.Tech\n- Diploma Courses" },
  { from: "user", text: "MBA" },
  { from: "bot",  text: "Great choice. Our MBA program offers 6 specializations. Duration: 2 years. Fee: Rs. 4.5L/year.\n1. Download brochure\n2. Schedule campus visit\n3. Talk to counselor" },
  { from: "user", text: "Schedule campus visit" },
  { from: "bot",  text: "Perfect. Available slots this week:\nSaturday 10 AM\nSaturday 2 PM\nSunday 11 AM\nWhich works for you?" },
  { from: "user", text: "Saturday 10AM" },
  { from: "bot",  text: "Campus visit confirmed.\nSaturday, 10:00 AM\nBrightFuture Campus, Sector 62\nCounselor Priya will meet you at the gate." },
]

// ─── Hero phone mock ───────────────────────────────────────────────────────────
function HeroPhone({ visibleMessages }: { visibleMessages: number }) {
  return (
    <div className="relative w-[240px] sm:w-[280px] md:w-[310px]">
      <div className="rounded-[44px] border-[6px] border-slate-700 bg-slate-900 p-1 shadow-2xl">
        <div className="relative z-10 mx-auto h-6 w-28 rounded-b-2xl bg-slate-900" />
        <div className="-mt-3 overflow-hidden rounded-[36px] bg-[#ece5dd]">

          {/* status bar */}
          <div className="flex items-center justify-between bg-[#075e54] px-5 py-1.5">
            <span className="text-[11px] font-semibold text-white">9:41</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-white">5G</span>
              <div className="flex items-end gap-[1px]">
                {[4, 6, 8, 10].map((h) => (
                  <div key={h} className="w-[3px] rounded-[0.5px] bg-white" style={{ height: h }} />
                ))}
              </div>
            </div>
          </div>

          {/* chat header */}
          <div className="flex items-center gap-3 bg-[#128c7e] px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-[10px] font-bold text-white">
              BF
            </div>
            <div>
              <p className="text-sm font-semibold text-white">BrightFuture Academy</p>
              <p className="text-xs text-emerald-100">Verified Business</p>
            </div>
          </div>

          {/* messages */}
          <div className="h-[400px] space-y-1.5 overflow-y-auto p-2">
            {chatMessages.slice(0, visibleMessages).map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-slideUp`}>
                <div className={`max-w-[82%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed text-slate-800 shadow-sm ${msg.from === "user" ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm bg-white"}`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {visibleMessages < chatMessages.length && (
              <div className="flex gap-1 px-2 py-1">
                {[0, 0.15, 0.3].map((delay) => (
                  <span key={delay} className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: `${delay}s` }} />
                ))}
              </div>
            )}
          </div>

          {/* input bar */}
          <div className="flex items-center gap-2 bg-[#f0f0f0] px-2 py-2">
            <span className="text-xl">+</span>
            <div className="flex-1 rounded-full bg-white px-4 py-2">
              <span className="text-xs text-gray-400">Type a message...</span>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#075e54]">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function EducationPage() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= chatMessages.length) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-slate-950">

        {/* ── Hero ────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#f0fdf4_0%,#ffffff_45%,#eff6ff_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-white" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24">

            {/* left copy */}
            <div className={`transition-all duration-1000 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                WhatsApp automation for education
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Convert every student inquiry into a booked admission call.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                DigitalBot answers admission questions, sends brochures, qualifies leads, books campus visits,
                and reminds students about fees directly inside WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#128c7e] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#075e54]">
                  Book free demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/services/whatsapp-bot" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-4 text-sm font-bold text-slate-800 transition hover:border-emerald-200 hover:text-emerald-700">
                  See WhatsApp bot service
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-lg border border-emerald-100 bg-white/85 p-4 shadow-sm">
                    <p className="text-2xl font-black text-[#128c7e]">{item.value}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{item.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* right — phone mockup */}
            <div className={`relative flex justify-center transition-all delay-300 duration-1000 lg:justify-end ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="absolute -inset-10 rounded-full bg-[#25d366]/15 blur-3xl" />
              <div className="relative z-10 lg:mr-20">
                <HeroPhone visibleMessages={visibleMessages} />
              </div>
            </div>
          </div>
        </section>

        {/* ── Services ────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Designed for admissions</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  More than a chatbot. A complete WhatsApp admission desk.
                </h2>
              </div>
              <p className="text-lg leading-8 text-slate-600">
                Built for the Indian education market — regional language support, WhatsApp-native flows,
                and counselor handoffs that keep your team focused on closing seats.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-lg">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-[#128c7e]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-black text-slate-950">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{service.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Who it helps ────────────────────────────────────────────────── */}
        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3">
                <Image
                  src={campusConnectImage}
                  alt="Campus connect WhatsApp invitation automation"
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Who it helps</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                One WhatsApp system for schools, colleges, coaching, and online academies.
              </h2>
              <div className="mt-8 grid gap-4">
                {audiences.map((audience) => {
                  const Icon = audience.icon
                  return (
                    <div key={audience.title} className="rounded-lg border border-white/10 bg-white/5 p-5">
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#25d366] text-slate-950">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-black">{audience.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-300">{audience.text}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── Student journey ──────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="order-2 overflow-hidden rounded-lg border border-emerald-100 bg-white p-3 shadow-xl">
              <Image
                src={mbaWhatsappFormImage}
                alt="MBA WhatsApp form automation and lead qualification"
                width={1024}
                height={768}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="order-1">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Student journey</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                From first message to confirmed campus visit.
              </h2>
              <div className="mt-8 space-y-4">
                {journey.map((item) => (
                  <div key={item.step} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-50 font-black text-[#128c7e]">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="font-black text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Dashboard Preview ────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">What you get</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Everything in one powerful WhatsApp dashboard.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                Send bulk messages, manage tickets, connect CRMs — all from one clean interface.
              </p>
            </div>

            {/* Dashboard mockup */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl" style={{ height: 620 }}>
              <div className="flex h-full">

                {/* ── Sidebar ── */}
                <div className="flex w-14 shrink-0 flex-col bg-[#1a1f36] md:w-48">
                  {/* Brand */}
                  <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#25d366]">
                      <MessageCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="hidden text-[11px] font-black tracking-wide text-white md:block">DigitalBot</span>
                  </div>

                  {/* Nav items — same as M-Tech reference */}
                  <nav className="flex flex-col gap-0.5 p-2 pt-3">
                    {[
                      { emoji: "▪️", label: "Dashboard",    active: true  },
                      { emoji: "💬", label: "Live Chat",    active: false },
                      { emoji: "👥", label: "Contacts",     active: false },
                      { emoji: "📣", label: "Campaigns",    active: false },
                      { emoji: "📋", label: "Templates",    active: false },
                      { emoji: "🤖", label: "ChatBot",      active: false },
                      { emoji: "🔀", label: "Flow Builder", active: false },
                      { emoji: "🔗", label: "Integrations", active: false },
                      { emoji: "👤", label: "Agents",       active: false },
                      { emoji: "⚙️", label: "Settings",     active: false },
                      { emoji: "📄", label: "API Logs",     active: false },
                      { emoji: "🪝", label: "WebHooks",     active: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 ${
                          item.active
                            ? "bg-[#25d366] text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        }`}
                      >
                        <span className="text-[11px]">{item.emoji}</span>
                        <span className="hidden text-[10px] font-semibold md:block">{item.label}</span>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* ── Main area ── */}
                <div className="flex flex-1 flex-col overflow-hidden bg-[#f1f5f9]">

                  {/* Top bar */}
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                    <p className="text-xs font-black text-slate-800">Dashboard</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600">Bot Active</span>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25d366] text-[9px] font-black text-white">P</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-3">

                    {/* ── Stat cards row ── */}
                    <div className="grid grid-cols-4 gap-2.5">
                      {[
                        { label: "Total Leads",      value: "1,250",    sub: "+8% from last month",  bg: "bg-white", val: "text-slate-900", icon: "🎯" },
                        { label: "Total Contacts",   value: "25,680",   sub: "+22% from last month", bg: "bg-white", val: "text-slate-900", icon: "👥" },
                        { label: "Messages Sent",    value: "1,28,540", sub: "+18% from last month", bg: "bg-white", val: "text-slate-900", icon: "💬" },
                        { label: "Active Campaigns", value: "24",       sub: "+3 from last month",   bg: "bg-white", val: "text-slate-900", icon: "📣" },
                      ].map((s) => (
                        <div key={s.label} className={`rounded-lg border border-slate-200 ${s.bg} p-3 shadow-sm`}>
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-semibold text-slate-500">{s.label}</p>
                            <span className="text-sm">{s.icon}</span>
                          </div>
                          <p className={`mt-1 text-base font-black ${s.val}`}>{s.value}</p>
                          <p className="mt-0.5 text-[8px] text-emerald-600">{s.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* ── Middle row ── */}
                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">

                      {/* Channel Overview */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Channel Overview</p>
                        <div className="flex items-end justify-around gap-1" style={{ height: 64 }}>
                          {[
                            { label: "WhatsApp", h: "h-16", color: "bg-[#25d366]", val: "12,540" },
                            { label: "Instagram", h: "h-10", color: "bg-[#e1306c]", val: "6,250" },
                            { label: "Facebook",  h: "h-7",  color: "bg-[#1877f2]", val: "5,120" },
                          ].map((c) => (
                            <div key={c.label} className="flex flex-col items-center gap-1">
                              <span className="text-[7px] font-bold text-slate-600">{c.val}</span>
                              <div className={`w-6 rounded-t-sm ${c.h} ${c.color}`} />
                              <span className="text-[7px] text-slate-400">{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Chatbot Sessions donut */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Chatbot Sessions</p>
                        <div className="flex items-center gap-3">
                          {/* SVG donut */}
                          <svg viewBox="0 0 36 36" className="h-16 w-16 shrink-0">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#25d366" strokeWidth="5"
                              strokeDasharray="60 40" strokeDashoffset="25" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5"
                              strokeDasharray="25 75" strokeDashoffset="-35" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5"
                              strokeDasharray="15 85" strokeDashoffset="-60" strokeLinecap="round" />
                            <text x="18" y="19" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#0f172a">2,486</text>
                            <text x="18" y="24" textAnchor="middle" fontSize="3.5" fill="#94a3b8">Sessions</text>
                          </svg>
                          <div className="space-y-1.5">
                            {[
                              { label: "Completed", color: "bg-[#25d366]", pct: "60%" },
                              { label: "In Progress", color: "bg-[#f59e0b]", pct: "25%" },
                              { label: "Failed",     color: "bg-[#ef4444]", pct: "15%" },
                            ].map((l) => (
                              <div key={l.label} className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 shrink-0 rounded-full ${l.color}`} />
                                <span className="text-[8px] text-slate-600">{l.label}</span>
                                <span className="ml-auto text-[8px] font-bold text-slate-800">{l.pct}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Message Statistics bar */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Message Statistics</p>
                        <div className="flex items-end gap-1" style={{ height: 56 }}>
                          {[
                            { d: "M", sent: "h-10", deliv: "h-8"  },
                            { d: "T", sent: "h-8",  deliv: "h-6"  },
                            { d: "W", sent: "h-12", deliv: "h-10" },
                            { d: "T", sent: "h-6",  deliv: "h-5"  },
                            { d: "F", sent: "h-14", deliv: "h-12" },
                            { d: "S", sent: "h-9",  deliv: "h-7"  },
                            { d: "S", sent: "h-11", deliv: "h-9"  },
                          ].map((b, i) => (
                            <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                              <div className="flex w-full items-end justify-center gap-0.5">
                                <div className={`w-2 rounded-t-sm bg-[#25d366] ${b.sent}`} />
                                <div className={`w-2 rounded-t-sm bg-[#93c5fd] ${b.deliv}`} />
                              </div>
                              <span className="text-[7px] text-slate-400">{b.d}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-3">
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-[#25d366]" /><span className="text-[7px] text-slate-500">Sent</span></div>
                          <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-[#93c5fd]" /><span className="text-[7px] text-slate-500">Delivered</span></div>
                        </div>
                      </div>
                    </div>

                    {/* ── Bottom row ── */}
                    <div className="mt-2.5 grid grid-cols-2 gap-2.5">

                      {/* Recent Chats */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Recent Chats</p>
                        <div className="space-y-1.5">
                          {[
                            { name: "Anjali S.",  msg: "I need help with MBA admission",  time: "2m ago",  avatar: "A", color: "bg-violet-500" },
                            { name: "Rohan M.",   msg: "Fee payment link not working",     time: "5m ago",  avatar: "R", color: "bg-orange-500" },
                            { name: "Priya K.",   msg: "When is the campus visit?",        time: "12m ago", avatar: "P", color: "bg-sky-500"    },
                            { name: "Arjun T.",   msg: "Scholarship eligibility query",    time: "18m ago", avatar: "A", color: "bg-rose-500"   },
                          ].map((chat) => (
                            <div key={chat.name} className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5">
                              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${chat.color} text-[8px] font-black text-white`}>{chat.avatar}</div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-[9px] font-bold text-slate-800">{chat.name}</p>
                                  <span className="text-[8px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className="truncate text-[8px] text-slate-400">{chat.msg}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Campaigns */}
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Top Campaigns</p>
                        <div className="space-y-1.5">
                          {[
                            { name: "New Offer",     sent: "12,549", bar: "w-full",  color: "bg-[#25d366]" },
                            { name: "Product Launch","sent": "3,360", bar: "w-3/4",  color: "bg-violet-400" },
                            { name: "Re-engagement", sent: "6,780",  bar: "w-4/5",  color: "bg-orange-400" },
                            { name: "Fee Reminder",  sent: "2,100",  bar: "w-2/5",  color: "bg-sky-400"    },
                          ].map((c) => (
                            <div key={c.name} className="rounded-md bg-slate-50 px-2 py-1.5">
                              <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-800">{c.name}</p>
                                <span className="text-[8px] font-bold text-slate-600">{c.sent}</span>
                              </div>
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                <div className={`h-full rounded-full ${c.bar} ${c.color}`} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* CRM badges */}
                        <div className="mt-3 border-t border-slate-100 pt-2">
                          <p className="mb-1.5 text-[9px] font-black text-slate-600">Connected CRMs</p>
                          <div className="flex gap-1.5">
                            {[
                              { name: "HubSpot",    bg: "bg-orange-500" },
                              { name: "Salesforce", bg: "bg-blue-600"   },
                              { name: "Zoho",       bg: "bg-red-500"    },
                              { name: "LeadSq",     bg: "bg-violet-600" },
                            ].map((crm) => (
                              <div key={crm.name} className={`flex items-center gap-1 rounded-full ${crm.bg} px-2 py-0.5`}>
                                <div className="h-1 w-1 rounded-full bg-white/60" />
                                <span className="text-[7px] font-bold text-white">{crm.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Results Section ───────────────────────────────────────────────── */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">

            {/* Label + heading */}
            <div className="mb-14 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Why it converts</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Real results for Indian education institutes.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                Every number below comes from real WhatsApp admission flows — not estimates.
              </p>
            </div>

            {/* Stats row */}
            <div className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-sm lg:grid-cols-4">
              {[
                { value: "95%",   label: "WhatsApp open rate",    sub: "vs 21% for email",          color: "text-[#128c7e]" },
                { value: "3 sec", label: "First response time",   sub: "Every single inquiry",      color: "text-violet-600" },
                { value: "60%",   label: "More campus visits",    sub: "Automated follow-ups",      color: "text-orange-500" },
                { value: "24/7",  label: "Student support uptime", sub: "No missed leads ever",     color: "text-sky-600"    },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center bg-white px-6 py-10 text-center">
                  <p className={`text-5xl font-black ${s.color}`}>{s.value}</p>
                  <p className="mt-3 text-sm font-bold text-slate-900">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Before / After full-width */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              {/* Header bar */}
              <div className="grid grid-cols-2">
                <div className="bg-slate-900 px-8 py-4">
                  <p className="text-sm font-black text-white">❌ Without DigitalBot</p>
                </div>
                <div className="bg-[#128c7e] px-8 py-4">
                  <p className="text-sm font-black text-white">✅ With DigitalBot</p>
                </div>
              </div>
              {/* Row pairs */}
              {[
                ["Counselors repeat the same FAQs all day long",   "Bot answers FAQs instantly on WhatsApp, round the clock"],
                ["Leads lost after office hours and on weekends",   "Every inquiry captured and replied to 24/7, automatically"],
                ["Brochures emailed — ignored or never downloaded", "Brochure sent inside the same WhatsApp conversation"],
                ["Manual follow-up done via calls and spreadsheets","Smart automated follow-up sequences with zero effort"],
                ["Fee reminders sent late or missed entirely",      "Timely reminders with direct payment links built in"],
              ].map(([bad, good], i) => (
                <div key={i} className={`grid grid-cols-2 divide-x divide-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-red-400">✕</span>
                    <p className="text-sm text-slate-600">{bad}</p>
                  </div>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-[#128c7e]">✓</span>
                    <p className="text-sm font-medium text-slate-800">{good}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-lg bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#25d366] text-slate-950">
              <PhoneCall className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to make admissions faster?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              See a live WhatsApp admission flow for your exact institute type, course list, fees, and counselor process.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25d366] px-7 py-4 text-sm font-black text-slate-950 transition hover:bg-emerald-300">
                Get free demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center rounded-lg border border-white/15 px-7 py-4 text-sm font-black text-white transition hover:bg-white/10">
                View pricing
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      <style jsx global>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  )
}
