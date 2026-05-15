"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  Bot,
  Building2,
  CalendarCheck,
  ClipboardCheck,
  Handshake,
  Home,
  IndianRupee,
  KeyRound,
  Languages,
  MapPin,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const realEstateImage = "/images/real_estate_1.png"
const whatsappImage = "/images/real_estate_2.png"

const stats = [
  { value: "95%", label: "WhatsApp open rate", note: "Property details are seen fast" },
  { value: "3 sec", label: "First response", note: "Every buyer inquiry gets attention" },
  { value: "24/7", label: "Lead coverage", note: "Works after office hours and weekends" },
  { value: "47%", label: "More site visits", note: "Automated follow-ups confirm visits" },
]

const services = [
  {
    icon: MessageCircle,
    title: "Property Inquiry Bot",
    body: "Answers price, location, amenities, floor plan, possession, RERA, and availability questions instantly on WhatsApp.",
  },
  {
    icon: ClipboardCheck,
    title: "Buyer Qualification",
    body: "Captures budget, preferred area, BHK, buying timeline, loan status, and contact details before your sales team calls.",
  },
  {
    icon: CalendarCheck,
    title: "Site Visit Booking",
    body: "Lets prospects choose visit slots, confirms the appointment, and sends reminders to reduce no-shows.",
  },
  {
    icon: IndianRupee,
    title: "Budget and EMI Guidance",
    body: "Shares price ranges, payment plans, booking amounts, and EMI-friendly next steps inside the same chat.",
  },
  {
    icon: Languages,
    title: "Regional Language Support",
    body: "Supports buyer conversations in Hindi, English, and local-language flows for smoother trust-building.",
  },
  {
    icon: Bot,
    title: "Sales Handoff",
    body: "Routes hot buyers to the right sales executive with full chat history and a clear next-best action.",
  },
]

const audiences = [
  { icon: Building2, title: "Builders and Developers", text: "Project inquiries, price sheets, floor plans, site visits, and launch campaigns." },
  { icon: Home, title: "Real Estate Agencies", text: "Buyer matching, rental inquiries, resale leads, and owner follow-ups from one inbox." },
  { icon: KeyRound, title: "Property Consultants", text: "Lead qualification, area preferences, budgets, and appointment scheduling." },
  { icon: Users, title: "Channel Partner Teams", text: "Campaign responses, buyer routing, broker coordination, and CRM-ready updates." },
]

const journey = [
  { step: "01", title: "Buyer asks on WhatsApp", text: "The AI welcomes them, understands property intent, and answers the first question instantly." },
  { step: "02", title: "AI captures requirements", text: "Budget, location, BHK, timeline, loan status, and visit preference are recorded cleanly." },
  { step: "03", title: "Matching properties are shared", text: "Photos, floor plans, price sheets, amenities, and location details are sent in the same chat." },
  { step: "04", title: "Site visit gets confirmed", text: "Qualified buyers pick a slot and your sales team receives a ready visit schedule." },
]

const comparison = [
  ["Response speed", "Instant, 24/7", "Delayed callbacks and missed portal leads"],
  ["Property details", "Sent inside WhatsApp", "Website links and PDFs get ignored"],
  ["Sales workload", "Only qualified buyers reach staff", "Agents chase every casual inquiry"],
  ["Follow-up", "Automated visit reminders", "Manual calls and spreadsheet tracking"],
  ["Lead ownership", "Direct buyer engagement", "Broker dependency and lost context"],
]

const chatMessages = [
  { from: "user", text: "Hi, I saw your ad for a 3BHK in Baner" },
  { from: "bot", text: "Welcome to DreamHomes! I can help you with available 3BHK options. Are you looking to buy or rent?\n- Buy\n- Rent\n- Investment" },
  { from: "user", text: "Buy" },
  { from: "bot", text: "Great. What is your budget range?\n1. Under Rs. 50L\n2. Rs. 50L-80L\n3. Rs. 80L-1.5Cr\n4. Above Rs. 1.5Cr" },
  { from: "user", text: "50 to 80 lakhs" },
  { from: "bot", text: "Perfect. I found 3 matching properties in Baner:\nSunrise Heights - Rs. 68L, 1250 sqft\nGreen Valley - Rs. 72L, 1380 sqft\nPark View - Rs. 62L, 1200 sqft\nWould you like to book a site visit?" },
  { from: "user", text: "Sunrise Heights, Saturday" },
  { from: "bot", text: "Site visit confirmed.\nSaturday, 11:00 AM\nSunrise Heights, Baner\nExecutive Rahul will meet you at the sales office." },
]

function HeroPhone({ visibleMessages }: { visibleMessages: number }) {
  return (
    <div className="relative w-[240px] sm:w-[280px] md:w-[310px]">
      <div className="rounded-[44px] border-[6px] border-slate-700 bg-slate-900 p-1 shadow-2xl">
        <div className="relative z-10 mx-auto h-6 w-28 rounded-b-2xl bg-slate-900" />
        <div className="-mt-3 overflow-hidden rounded-[36px] bg-[#ece5dd]">
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

          <div className="flex items-center gap-3 bg-[#128c7e] px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-[10px] font-bold text-white">
              DH
            </div>
            <div>
              <p className="text-sm font-semibold text-white">DreamHomes Realty</p>
              <p className="text-xs text-emerald-100">Verified Business</p>
            </div>
          </div>

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

export default function RealEstateSolutionPage() {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= chatMessages.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-slate-950">
        <section className="relative overflow-hidden pt-28 sm:pt-32">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#f0fdf4_0%,#ffffff_45%,#eff6ff_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-white" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:pb-24">
            <div className={`transition-all duration-1000 ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 shadow-sm">
                <Sparkles className="h-4 w-4" />
                WhatsApp automation for real estate
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Convert every property inquiry into a confirmed site visit.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                DigitalBot answers buyer questions, shares property details, qualifies budgets, books site visits,
                and follows up with prospects directly inside WhatsApp.
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

            <div className={`relative flex justify-center transition-all delay-300 duration-1000 lg:justify-end ${heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="absolute -inset-10 rounded-full bg-[#25d366]/15 blur-3xl" />
              <div className="relative z-10 lg:mr-20">
                <HeroPhone visibleMessages={visibleMessages} />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Designed for property sales</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  More than a chatbot. A complete WhatsApp sales desk.
                </h2>
              </div>
              <p className="text-lg leading-8 text-slate-600">
                Built for builders, agencies, and consultants who need quick replies, qualified buyers,
                site visit scheduling, and sales handoffs without losing leads in calls or spreadsheets.
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

        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3">
                <Image
                  src={realEstateImage}
                  alt="Real estate consultant using WhatsApp automation"
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-md object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">Who it helps</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                One WhatsApp system for developers, agencies, consultants, and channel partners.
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

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="order-2 overflow-hidden rounded-lg border border-emerald-100 bg-white p-3 shadow-xl">
              <Image
                src={whatsappImage}
                alt="WhatsApp property inquiry automation preview"
                width={1024}
                height={768}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="order-1">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Buyer journey</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                From first message to confirmed site visit.
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

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">What you get</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Everything in one powerful WhatsApp dashboard.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                Manage property leads, site visits, campaigns, CRM updates, and team handoffs from one clean interface.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl" style={{ height: 620 }}>
              <div className="flex h-full">
                <div className="flex w-14 shrink-0 flex-col bg-[#1a1f36] md:w-48">
                  <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#25d366]">
                      <MessageCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <span className="hidden text-[11px] font-black tracking-wide text-white md:block">DigitalBot</span>
                  </div>

                  <nav className="flex flex-col gap-0.5 p-2 pt-3">
                    {[
                      { icon: Home, label: "Dashboard", active: true },
                      { icon: MessageCircle, label: "Live Chat", active: false },
                      { icon: Users, label: "Leads", active: false },
                      { icon: Building2, label: "Properties", active: false },
                      { icon: CalendarCheck, label: "Site Visits", active: false },
                      { icon: Bot, label: "ChatBot", active: false },
                      { icon: Handshake, label: "Sales Team", active: false },
                      { icon: MapPin, label: "Locations", active: false },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.label}
                          className={`flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 ${
                            item.active ? "bg-[#25d366] text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden text-[10px] font-semibold md:block">{item.label}</span>
                        </div>
                      )
                    })}
                  </nav>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden bg-[#f1f5f9]">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                    <p className="text-xs font-black text-slate-800">Real Estate Dashboard</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-600">Bot Active</span>
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25d366] text-[9px] font-black text-white">R</div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-3">
                    <div className="grid grid-cols-4 gap-2.5">
                      {[
                        { label: "New Leads", value: "1,250", sub: "+18% this month", icon: Users },
                        { label: "Site Visits", value: "386", sub: "+47% confirmed", icon: CalendarCheck },
                        { label: "Messages Sent", value: "58,420", sub: "+22% delivered", icon: MessageCircle },
                        { label: "Hot Buyers", value: "142", sub: "Ready for sales", icon: KeyRound },
                      ].map((s) => {
                        const Icon = s.icon
                        return (
                          <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] font-semibold text-slate-500">{s.label}</p>
                              <Icon className="h-3.5 w-3.5 text-[#128c7e]" />
                            </div>
                            <p className="mt-1 text-base font-black text-slate-900">{s.value}</p>
                            <p className="mt-0.5 text-[8px] text-emerald-600">{s.sub}</p>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-2.5 grid grid-cols-3 gap-2.5">
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Lead Sources</p>
                        <div className="flex items-end justify-around gap-1" style={{ height: 64 }}>
                          {[
                            { label: "WhatsApp", h: "h-16", color: "bg-[#25d366]", val: "12,540" },
                            { label: "Portals", h: "h-11", color: "bg-orange-400", val: "7,250" },
                            { label: "Social", h: "h-8", color: "bg-sky-500", val: "5,120" },
                          ].map((c) => (
                            <div key={c.label} className="flex flex-col items-center gap-1">
                              <span className="text-[7px] font-bold text-slate-600">{c.val}</span>
                              <div className={`w-6 rounded-t-sm ${c.h} ${c.color}`} />
                              <span className="text-[7px] text-slate-400">{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Visit Status</p>
                        <div className="flex items-center gap-3">
                          <svg viewBox="0 0 36 36" className="h-16 w-16 shrink-0">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#25d366" strokeWidth="5" strokeDasharray="64 36" strokeDashoffset="25" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="24 76" strokeDashoffset="-39" strokeLinecap="round" />
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="12 88" strokeDashoffset="-63" strokeLinecap="round" />
                            <text x="18" y="19" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#0f172a">386</text>
                            <text x="18" y="24" textAnchor="middle" fontSize="3.5" fill="#94a3b8">Visits</text>
                          </svg>
                          <div className="space-y-1.5">
                            {[
                              { label: "Confirmed", color: "bg-[#25d366]", pct: "64%" },
                              { label: "Pending", color: "bg-[#f59e0b]", pct: "24%" },
                              { label: "Rescheduled", color: "bg-[#ef4444]", pct: "12%" },
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

                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Message Statistics</p>
                        <div className="flex items-end gap-1" style={{ height: 56 }}>
                          {[
                            { d: "M", sent: "h-10", deliv: "h-8" },
                            { d: "T", sent: "h-8", deliv: "h-6" },
                            { d: "W", sent: "h-12", deliv: "h-10" },
                            { d: "T", sent: "h-6", deliv: "h-5" },
                            { d: "F", sent: "h-14", deliv: "h-12" },
                            { d: "S", sent: "h-9", deliv: "h-7" },
                            { d: "S", sent: "h-11", deliv: "h-9" },
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
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Recent Chats</p>
                        <div className="space-y-1.5">
                          {[
                            { name: "Anjali S.", msg: "Looking for 3BHK in Baner", time: "2m ago", avatar: "A", color: "bg-violet-500" },
                            { name: "Rohan M.", msg: "Need EMI details for Park View", time: "5m ago", avatar: "R", color: "bg-orange-500" },
                            { name: "Priya K.", msg: "Can I visit this Sunday?", time: "12m ago", avatar: "P", color: "bg-sky-500" },
                            { name: "Arjun T.", msg: "Share floor plan and price sheet", time: "18m ago", avatar: "A", color: "bg-rose-500" },
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

                      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <p className="mb-2 text-[10px] font-black text-slate-800">Top Campaigns</p>
                        <div className="space-y-1.5">
                          {[
                            { name: "New Launch", sent: "12,549", bar: "w-full", color: "bg-[#25d366]" },
                            { name: "Ready Possession", sent: "3,360", bar: "w-3/4", color: "bg-violet-400" },
                            { name: "Weekend Visits", sent: "6,780", bar: "w-4/5", color: "bg-orange-400" },
                            { name: "Price Update", sent: "2,100", bar: "w-2/5", color: "bg-sky-400" },
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

                        <div className="mt-3 border-t border-slate-100 pt-2">
                          <p className="mb-1.5 text-[9px] font-black text-slate-600">Connected CRMs</p>
                          <div className="flex gap-1.5">
                            {[
                              { name: "HubSpot", bg: "bg-orange-500" },
                              { name: "Salesforce", bg: "bg-blue-600" },
                              { name: "Zoho", bg: "bg-red-500" },
                              { name: "LeadSq", bg: "bg-violet-600" },
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

        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Why it converts</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Real results for Indian real estate teams.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">
                The numbers below show what changes when every property inquiry is handled instantly on WhatsApp.
              </p>
            </div>

            <div className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-sm lg:grid-cols-4">
              {[
                { value: "95%", label: "WhatsApp open rate", sub: "vs ignored email follow-ups", color: "text-[#128c7e]" },
                { value: "3 sec", label: "First response time", sub: "Every portal and ad lead", color: "text-violet-600" },
                { value: "47%", label: "More site visits", sub: "With automated reminders", color: "text-orange-500" },
                { value: "24/7", label: "Buyer support uptime", sub: "No missed weekend leads", color: "text-sky-600" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center bg-white px-6 py-10 text-center">
                  <p className={`text-5xl font-black ${s.color}`}>{s.value}</p>
                  <p className="mt-3 text-sm font-bold text-slate-900">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
              <div className="grid grid-cols-2">
                <div className="bg-slate-900 px-8 py-4">
                  <p className="text-sm font-black text-white">Without DigitalBot</p>
                </div>
                <div className="bg-[#128c7e] px-8 py-4">
                  <p className="text-sm font-black text-white">With DigitalBot</p>
                </div>
              </div>
              {comparison.map(([label, good, bad], i) => (
                <div key={label} className={`grid grid-cols-2 divide-x divide-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-red-400">❌</span>
                    <p className="text-sm text-slate-600">{bad}</p>
                  </div>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-[#128c7e]">✅</span>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">{good}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-lg bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#25d366] text-slate-950">
              <PhoneCall className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Ready to book more site visits?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              See a live WhatsApp property flow for your project type, inventory, locations, pricing, and sales process.
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
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
      `}</style>
    </>
  )
}
