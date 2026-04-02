"use client"

import { ArrowRight, Bell, BotMessageSquare, Calendar, ChevronLeft, ChevronRight, Headphones, LayoutDashboard, MessageCircle, Palette, Phone, Settings2, Smartphone, Zap } from "lucide-react"
import { useState } from "react"

const features = [
  {
    id: "voice-agent",
    label: "AI Voice Agent",
    icon: Headphones,
    color: "from-orange-500 to-amber-500",
    colorBg: "bg-orange-50",
    colorText: "text-orange-600",
    colorBorder: "border-orange-200",
    tagline: "24/7 intelligent call handling",
    description: "Your AI receptionist picks up every call instantly — books appointments, answers queries, routes calls, and handles follow-ups with human-like conversation.",
    highlights: [
      { label: "Sub-400ms response", icon: Zap },
      { label: "50+ languages", icon: MessageCircle },
      { label: "Unlimited calls", icon: Phone },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 max-w-xs mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">DigitalBot AI</p>
              <p className="text-xs text-green-500 font-medium">● Active Call — 0:47</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-xs text-gray-600">I&apos;d like to book an appointment for Tuesday.</p>
            </div>
            <div className="bg-orange-50 rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[85%] ml-auto">
              <p className="text-xs text-gray-700">Dr. Sharma is available at 10 AM and 2:30 PM. Which works?</p>
            </div>
            <div className="bg-gray-50 rounded-xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
              <p className="text-xs text-gray-600">10 AM please!</p>
            </div>
            <div className="bg-orange-50 rounded-xl rounded-tr-sm px-4 py-2.5 max-w-[85%] ml-auto">
              <p className="text-xs text-gray-700">Done! Confirmed for Tuesday 10 AM. SMS sent ✓</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">End-to-end encrypted</span>
            <div className="flex items-center gap-1">
              <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] text-green-600 font-medium">Booked</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[10px] text-blue-600 font-medium">SMS ✓</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "whatsapp-bot",
    label: "WhatsApp Bot",
    icon: BotMessageSquare,
    color: "from-green-500 to-emerald-500",
    colorBg: "bg-green-50",
    colorText: "text-green-600",
    colorBorder: "border-green-200",
    tagline: "Engage customers on WhatsApp",
    description: "Automate customer conversations on WhatsApp — handle inquiries, send appointment reminders, share documents, collect payments, and nurture leads at scale.",
    highlights: [
      { label: "Auto-replies 24/7", icon: MessageCircle },
      { label: "Rich media support", icon: Smartphone },
      { label: "Bulk broadcasts", icon: Bell },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-[#e5ddd5] rounded-2xl border border-gray-200 shadow-xl overflow-hidden max-w-xs mx-auto">
          <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <BotMessageSquare className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">DigitalBot Assistant</p>
              <p className="text-[10px] text-green-200">online</p>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <div className="bg-white rounded-lg rounded-tl-sm px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-xs text-gray-700">Hi! I want to check my appointment status</p>
              <p className="text-[9px] text-gray-400 text-right mt-1">10:30 AM</p>
            </div>
            <div className="bg-[#dcf8c6] rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%] ml-auto shadow-sm">
              <p className="text-xs text-gray-700">Hello! 👋 Your appointment with Dr. Sharma is confirmed for <strong>Tue, 10:00 AM</strong>.</p>
              <p className="text-[9px] text-gray-400 text-right mt-1">10:30 AM ✓✓</p>
            </div>
            <div className="bg-[#dcf8c6] rounded-lg rounded-tr-sm px-3 py-2 max-w-[80%] ml-auto shadow-sm">
              <p className="text-xs text-gray-700">📄 Here&apos;s your booking confirmation:</p>
              <div className="mt-1.5 bg-white/60 rounded-md px-2.5 py-2 border border-green-200">
                <p className="text-[10px] font-semibold text-gray-800">🗓 Appointment Details</p>
                <p className="text-[10px] text-gray-500">Dr. Sharma · Tue 10 AM · Room 204</p>
              </div>
              <p className="text-[9px] text-gray-400 text-right mt-1">10:31 AM ✓✓</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "dashboard",
    label: "Real-Time Dashboard",
    icon: LayoutDashboard,
    color: "from-blue-500 to-indigo-500",
    colorBg: "bg-blue-50",
    colorText: "text-blue-600",
    colorBorder: "border-blue-200",
    tagline: "Complete visibility & control",
    description: "Monitor every call, message, and appointment in real-time. Track agent performance, customer sentiment, conversion rates, and revenue — all from one powerful dashboard.",
    highlights: [
      { label: "Live analytics", icon: LayoutDashboard },
      { label: "Call recordings", icon: Headphones },
      { label: "Export reports", icon: Settings2 },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 max-w-sm mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-gray-900">Dashboard</p>
              <p className="text-[10px] text-gray-400">Today · Live</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-green-50 text-[10px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { v: "247", l: "Calls Today", c: "text-orange-600", bg: "bg-orange-50" },
              { v: "89%", l: "Resolved", c: "text-green-600", bg: "bg-green-50" },
              { v: "4.9", l: "CSAT", c: "text-blue-600", bg: "bg-blue-50" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-xl p-2.5 text-center`}>
                <p className={`text-lg font-bold ${s.c}`}>{s.v}</p>
                <p className="text-[9px] text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-3">
            <p className="text-[10px] text-gray-500 mb-2">Call Volume (Last 7 days)</p>
            <div className="flex items-end gap-1 h-12">
              {[40, 65, 50, 80, 70, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-sm transition-all" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="text-[8px] text-gray-400 flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Priya → Dr. Shah", time: "2m ago", status: "Booked" },
              { name: "Arjun → Billing", time: "5m ago", status: "Resolved" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-[10px] font-medium text-gray-700">{r.name}</p>
                  <p className="text-[9px] text-gray-400">{r.time}</p>
                </div>
                <span className="text-[9px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "calendar",
    label: "Google Calendar",
    icon: Calendar,
    color: "from-red-500 to-rose-500",
    colorBg: "bg-red-50",
    colorText: "text-red-600",
    colorBorder: "border-red-200",
    tagline: "Auto-sync every booking",
    description: "Every appointment booked by your AI agent is instantly synced to Google Calendar. Patients and staff get automatic reminders — reducing no-shows by up to 60%.",
    highlights: [
      { label: "Auto-sync bookings", icon: Calendar },
      { label: "Smart reminders", icon: Bell },
      { label: "Conflict detection", icon: Settings2 },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 max-w-xs mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Google Calendar</p>
              <p className="text-[10px] text-gray-400">Auto-synced</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">April 2026</p>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="text-[9px] text-gray-400 font-medium">{d}</span>
              ))}
              {[...Array(30)].map((_, i) => {
                const day = i + 1
                const hasEvent = [3, 7, 10, 14, 18, 22, 25, 28].includes(day)
                const isToday = day === 1
                return (
                  <div key={i} className={`text-[10px] py-1 rounded-md ${isToday ? 'bg-red-500 text-white font-bold' : hasEvent ? 'bg-orange-100 text-orange-700 font-medium' : 'text-gray-500'}`}>
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { time: "10:00 AM", title: "Dr. Sharma — Patient Visit", tag: "AI Booked" },
              { time: "2:30 PM", title: "Dr. Patel — Follow-up", tag: "AI Booked" },
              { time: "4:00 PM", title: "Lab Report Review", tag: "Reminder Sent" },
            ].map((ev, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-red-400 to-orange-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-800 truncate">{ev.title}</p>
                  <p className="text-[9px] text-gray-400">{ev.time}</p>
                </div>
                <span className="text-[8px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-full whitespace-nowrap">{ev.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "notifications",
    label: "WhatsApp Notifications",
    icon: Bell,
    color: "from-emerald-500 to-green-500",
    colorBg: "bg-emerald-50",
    colorText: "text-emerald-600",
    colorBorder: "border-emerald-200",
    tagline: "Instant alerts via WhatsApp",
    description: "Send automated appointment reminders, booking confirmations, follow-ups, and payment receipts directly to patients' WhatsApp. Open rates above 95%.",
    highlights: [
      { label: "95%+ open rate", icon: MessageCircle },
      { label: "Template messages", icon: BotMessageSquare },
      { label: "Scheduled sends", icon: Calendar },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 max-w-xs mx-auto">
          <p className="text-sm font-bold text-gray-900 mb-3">Notification Center</p>
          <div className="space-y-2.5">
            {[
              { icon: "📅", title: "Appointment Reminder", body: "Hi Rahul! Your appointment with Dr. Sharma is tomorrow at 10 AM. Reply YES to confirm.", time: "Just now", type: "WhatsApp" },
              { icon: "✅", title: "Booking Confirmed", body: "Your appointment has been booked successfully. Details sent to your WhatsApp.", time: "2m ago", type: "WhatsApp" },
              { icon: "💳", title: "Payment Received", body: "₹500 payment received for consultation. Receipt #DB-4821.", time: "15m ago", type: "SMS + WhatsApp" },
              { icon: "🔔", title: "Follow-up Reminder", body: "Hi! It's been 7 days since your visit. How are you feeling?", time: "1h ago", type: "WhatsApp" },
            ].map((n, i) => (
              <div key={i} className="flex gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-green-50/50 transition-colors border border-gray-100">
                <div className="text-lg flex-shrink-0 mt-0.5">{n.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[11px] font-semibold text-gray-800">{n.title}</p>
                    <span className="text-[8px] font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">{n.type}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
                  <p className="text-[9px] text-gray-400 mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "customization",
    label: "Full Customization",
    icon: Palette,
    color: "from-violet-500 to-purple-500",
    colorBg: "bg-violet-50",
    colorText: "text-violet-600",
    colorBorder: "border-violet-200",
    tagline: "Tailored to your business",
    description: "Every aspect is customizable — voice personality, greeting scripts, call flows, working hours, escalation rules, branding, and language preferences. Your AI, your rules.",
    highlights: [
      { label: "Custom scripts", icon: Settings2 },
      { label: "Brand voice", icon: Palette },
      { label: "Workflow rules", icon: Zap },
    ],
    mockup: (
      <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5 max-w-xs mx-auto">
          <p className="text-sm font-bold text-gray-900 mb-4">Customization Panel</p>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Voice Personality</p>
              <div className="flex gap-2">
                {[
                  { name: "Priya", active: true },
                  { name: "Arjun", active: false },
                  { name: "James", active: false },
                ].map((v, i) => (
                  <div key={i} className={`flex-1 px-3 py-2 rounded-lg text-center text-[10px] font-medium border cursor-pointer transition-all ${v.active ? 'bg-violet-100 border-violet-300 text-violet-700' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
                    {v.name}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Greeting Script</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <p className="text-[10px] text-gray-600">&quot;Hello! Thank you for calling [Your Clinic]. How may I help you today?&quot;</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Features</p>
              <div className="space-y-2">
                {[
                  { label: "Auto appointment booking", on: true },
                  { label: "WhatsApp confirmations", on: true },
                  { label: "After-hours voicemail", on: false },
                  { label: "Call escalation to human", on: true },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-600">{t.label}</span>
                    <div className={`w-8 h-4.5 rounded-full flex items-center px-0.5 transition-colors ${t.on ? 'bg-violet-500 justify-end' : 'bg-gray-300 justify-start'}`}>
                      <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
]

export default function PlatformFeatures() {
  const [activeTab, setActiveTab] = useState(0)
  const active = features[activeTab]

  const prev = () => setActiveTab((p) => (p === 0 ? features.length - 1 : p - 1))
  const next = () => setActiveTab((p) => (p === features.length - 1 ? 0 : p + 1))

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-3">Our Platform</p>
          <h2 className="text-3xl md:text-5xl font-black leading-[1.1] mb-4">
            <span className="text-gray-900">Everything you need,</span><br />
            <span className="text-orange-500">one powerful platform</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Explore each feature to see what it does for your business.
          </p>
        </div>

        {/* Feature navigation dots */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {features.map((feat, idx) => (
            <button
              key={feat.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === idx
                  ? `bg-gradient-to-r ${feat.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <feat.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{feat.label}</span>
            </button>
          ))}
        </div>

        {/* Carousel card */}
        <div className="relative" key={active.id}>

          {/* Arrow buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 lg:-translate-x-6 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 lg:translate-x-6 z-10 w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all"
            aria-label="Next feature"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>

          {/* Main content card */}
          <div className={`rounded-3xl border-2 border-gray-900 bg-gradient-to-br from-white to-gray-50 p-8 md:p-12 lg:p-14`}>

            {/* Top: badge + tagline + counter */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center shadow-lg`}>
                  <active.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900">{active.label}</h3>
                  <p className={`text-sm font-semibold ${active.colorText}`}>{active.tagline}</p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-300 tracking-wide">
                {String(activeTab + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
              </span>
            </div>

            {/* Two-column layout: info left, mockup right */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

              {/* Left: description + highlights + CTA */}
              <div>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  {active.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {active.highlights.map((h, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl ${active.colorBg} border ${active.colorBorder}`}>
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                        <h.icon className={`w-5 h-5 ${active.colorText}`} />
                      </div>
                      <span className="text-sm text-gray-800 font-bold">{h.label}</span>
                    </div>
                  ))}
                </div>

                <a href="/contact#contact-form" className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${active.color} text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all`}>
                  Get Started <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Right: mockup */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  {active.mockup}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
