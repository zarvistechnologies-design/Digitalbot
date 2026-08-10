"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, Bot, CalendarCheck, MessageCircle, PhoneCall, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { IndustrySolutionConfig } from "./industry-solution-data"

function HeroPhone({ config, visibleMessages }: { config: IndustrySolutionConfig; visibleMessages: number }) {
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
              {config.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{config.businessName}</p>
              <p className="text-xs text-emerald-100">Verified Business</p>
            </div>
          </div>

          <div className="h-[400px] space-y-1.5 overflow-y-auto p-2">
            {config.chatMessages.slice(0, visibleMessages).map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-slideUp`}>
                <div className={`max-w-[82%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed text-slate-800 shadow-sm ${msg.from === "user" ? "rounded-tr-sm bg-[#d9fdd3]" : "rounded-tl-sm bg-white"}`}>
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
            ))}
            {visibleMessages < config.chatMessages.length && (
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

function getDashboard(config: IndustrySolutionConfig) {
  const dashboards: Record<string, {
    nav: string[]
    metrics: Array<{ label: string; value: string; note: string; icon: typeof Users }>
    bars: Array<{ label: string; value: string; height: string; color: string }>
    activity: string[]
    pipeline: Array<{ label: string; value: string; width: string; color: string }>
  }> = {
    Automobile: {
      nav: ["Workshop", "Bookings", "Vehicles", "Pickup", "Payments", "Reviews"],
      metrics: [
        { label: "Service Bookings", value: "386", note: "+42 this week", icon: CalendarCheck },
        { label: "Vehicles Active", value: "74", note: "18 ready today", icon: config.icon },
        { label: "Pickup Requests", value: "126", note: "92% confirmed", icon: Users },
        { label: "Repair Updates", value: "8,940", note: "Sent live", icon: MessageCircle },
      ],
      bars: [
        { label: "Regular", value: "420", height: "h-28", color: "bg-[#25d366]" },
        { label: "AC", value: "260", height: "h-20", color: "bg-sky-500" },
        { label: "Claims", value: "190", height: "h-16", color: "bg-orange-400" },
        { label: "Paint", value: "310", height: "h-24", color: "bg-violet-500" },
      ],
      activity: ["Honda City pickup confirmed", "Insurance claim docs received", "Brake work approval pending", "Payment link sent"],
      pipeline: [
        { label: "Booked", value: "386", width: "w-full", color: "bg-[#25d366]" },
        { label: "In Workshop", value: "74", width: "w-3/4", color: "bg-sky-500" },
        { label: "Ready", value: "18", width: "w-1/2", color: "bg-orange-400" },
      ],
    },
    Insurance: {
      nav: ["Policies", "Renewals", "Claims", "Documents", "Agents", "Reports"],
      metrics: [
        { label: "Policy Leads", value: "1,184", note: "+31% qualified", icon: Users },
        { label: "Renewals Due", value: "268", note: "30-day window", icon: CalendarCheck },
        { label: "Claims Tracked", value: "92", note: "14 need docs", icon: Bot },
        { label: "Agent Calls", value: "214", note: "Booked this month", icon: MessageCircle },
      ],
      bars: [
        { label: "Health", value: "540", height: "h-32", color: "bg-[#25d366]" },
        { label: "Motor", value: "410", height: "h-24", color: "bg-sky-500" },
        { label: "Life", value: "320", height: "h-20", color: "bg-violet-500" },
        { label: "Claims", value: "180", height: "h-14", color: "bg-orange-400" },
      ],
      activity: ["Renewal link sent to Amit", "Claim document pending", "Agent callback booked", "Policy comparison shared"],
      pipeline: [
        { label: "Quoted", value: "612", width: "w-full", color: "bg-[#25d366]" },
        { label: "Docs Pending", value: "148", width: "w-2/3", color: "bg-orange-400" },
        { label: "Issued", value: "96", width: "w-1/2", color: "bg-sky-500" },
      ],
    },
    Healthcare: {
      nav: ["Appointments", "Patients", "Doctors", "Reports", "Payments", "Follow-up"],
      metrics: [
        { label: "Appointments", value: "432", note: "Today and upcoming", icon: CalendarCheck },
        { label: "Patients Queued", value: "58", note: "Live OPD flow", icon: Users },
        { label: "Reports Ready", value: "124", note: "Notifications sent", icon: Bot },
        { label: "No-shows Saved", value: "39%", note: "Via reminders", icon: MessageCircle },
      ],
      bars: [
        { label: "OPD", value: "510", height: "h-32", color: "bg-[#25d366]" },
        { label: "Lab", value: "360", height: "h-24", color: "bg-sky-500" },
        { label: "Dental", value: "220", height: "h-16", color: "bg-violet-500" },
        { label: "Follow", value: "300", height: "h-20", color: "bg-orange-400" },
      ],
      activity: ["Dermatology slot confirmed", "Blood report ready alert sent", "Payment link delivered", "Follow-up reminder scheduled"],
      pipeline: [
        { label: "Booked", value: "432", width: "w-full", color: "bg-[#25d366]" },
        { label: "Checked In", value: "214", width: "w-3/4", color: "bg-sky-500" },
        { label: "Reports", value: "124", width: "w-1/2", color: "bg-violet-500" },
      ],
    },
    SaaS: {
      nav: ["Trials", "Demos", "Accounts", "Support", "Billing", "Usage"],
      metrics: [
        { label: "Demo Requests", value: "284", note: "+19% this month", icon: CalendarCheck },
        { label: "Trials Active", value: "1,042", note: "312 activated", icon: Users },
        { label: "Support Triage", value: "618", note: "70% automated", icon: Bot },
        { label: "Upgrade Signals", value: "86", note: "Ready for sales", icon: MessageCircle },
      ],
      bars: [
        { label: "Signup", value: "820", height: "h-32", color: "bg-[#25d366]" },
        { label: "Setup", value: "610", height: "h-24", color: "bg-sky-500" },
        { label: "Demo", value: "284", height: "h-16", color: "bg-violet-500" },
        { label: "Upgrade", value: "86", height: "h-12", color: "bg-orange-400" },
      ],
      activity: ["Growth plan demo booked", "Trial setup reminder sent", "Billing question resolved", "Hot account routed to sales"],
      pipeline: [
        { label: "Trials", value: "1,042", width: "w-full", color: "bg-[#25d366]" },
        { label: "Activated", value: "312", width: "w-2/3", color: "bg-sky-500" },
        { label: "Upgrade Ready", value: "86", width: "w-1/3", color: "bg-orange-400" },
      ],
    },
    "E-commerce": {
      nav: ["Orders", "Carts", "Catalog", "Returns", "Campaigns", "Support"],
      metrics: [
        { label: "Carts Recovered", value: "742", note: "Rs. 18.4L value", icon: CalendarCheck },
        { label: "Orders Tracked", value: "2,840", note: "Live shipping alerts", icon: Users },
        { label: "Return Requests", value: "146", note: "Auto triaged", icon: Bot },
        { label: "Campaign Replies", value: "9,820", note: "95% opened", icon: MessageCircle },
      ],
      bars: [
        { label: "Shoes", value: "540", height: "h-28", color: "bg-[#25d366]" },
        { label: "Bags", value: "420", height: "h-24", color: "bg-sky-500" },
        { label: "Care", value: "280", height: "h-16", color: "bg-violet-500" },
        { label: "Restock", value: "360", height: "h-20", color: "bg-orange-400" },
      ],
      activity: ["Checkout link sent", "Order tracking shared", "Return pickup requested", "Restock alert campaign live"],
      pipeline: [
        { label: "Cart Reminders", value: "1,840", width: "w-full", color: "bg-[#25d366]" },
        { label: "Recovered", value: "742", width: "w-2/3", color: "bg-sky-500" },
        { label: "Repeat Orders", value: "318", width: "w-1/2", color: "bg-orange-400" },
      ],
    },
    BPO: {
      nav: ["Queues", "Tickets", "Callbacks", "SLA", "Agents", "Reports"],
      metrics: [
        { label: "Tickets Deflected", value: "4,280", note: "FAQ handled", icon: Bot },
        { label: "Callbacks Booked", value: "692", note: "Queue pressure down", icon: CalendarCheck },
        { label: "SLA Alerts", value: "38", note: "Needs attention", icon: MessageCircle },
        { label: "Live Agents", value: "126", note: "Context ready", icon: Users },
      ],
      bars: [
        { label: "FAQ", value: "2.4K", height: "h-32", color: "bg-[#25d366]" },
        { label: "Billing", value: "1.1K", height: "h-24", color: "bg-sky-500" },
        { label: "Tech", value: "820", height: "h-20", color: "bg-violet-500" },
        { label: "Esc", value: "240", height: "h-12", color: "bg-orange-400" },
      ],
      activity: ["Callback booked for complaint", "Ticket status shared", "Level 2 escalation created", "SLA warning sent"],
      pipeline: [
        { label: "New", value: "4,280", width: "w-full", color: "bg-[#25d366]" },
        { label: "Routed", value: "1,240", width: "w-2/3", color: "bg-sky-500" },
        { label: "Escalated", value: "240", width: "w-1/3", color: "bg-orange-400" },
      ],
    },
  }

  return dashboards[config.accent] ?? {
    nav: ["Dashboard", "Leads", "Chats", "Bookings", "Campaigns", "Reports"],
    metrics: [
      { label: config.stats[0].label, value: config.stats[0].value, note: config.stats[0].note, icon: Users },
      { label: config.stats[1].label, value: config.stats[1].value, note: config.stats[1].note, icon: CalendarCheck },
      { label: config.stats[2].label, value: config.stats[2].value, note: config.stats[2].note, icon: MessageCircle },
      { label: config.stats[3].label, value: config.stats[3].value, note: config.stats[3].note, icon: Bot },
    ],
    bars: [
      { label: config.services[0].title.split(" ")[0], value: "540", height: "h-32", color: "bg-[#25d366]" },
      { label: config.services[1].title.split(" ")[0], value: "420", height: "h-24", color: "bg-sky-500" },
      { label: config.services[2].title.split(" ")[0], value: "310", height: "h-20", color: "bg-violet-500" },
      { label: config.services[3].title.split(" ")[0], value: "260", height: "h-16", color: "bg-orange-400" },
    ],
    activity: [
      `${config.services[0].title} completed`,
      `${config.services[1].title} updated`,
      `${config.journey[2].title}`,
      `${config.journey[3].title}`,
    ],
    pipeline: [
      { label: "Captured", value: "1,250", width: "w-full", color: "bg-[#25d366]" },
      { label: "Qualified", value: "640", width: "w-2/3", color: "bg-sky-500" },
      { label: "Converted", value: "386", width: "w-1/2", color: "bg-orange-400" },
    ],
  }
}

export function IndustrySolutionPage({ config }: { config: IndustrySolutionConfig }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [heroVisible, setHeroVisible] = useState(false)
  const HeroIcon = config.icon
  const dashboard = getDashboard(config)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= config.chatMessages.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [config.chatMessages.length])

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
                <HeroIcon className="h-4 w-4" />
                {config.badge}
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {config.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{config.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#128c7e] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-[#075e54]">
                  Book free demo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {config.stats.map((item) => (
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
                <HeroPhone config={config} visibleMessages={visibleMessages} />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">{config.servicesLabel}</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{config.servicesTitle}</h2>
              </div>
              <p className="text-lg leading-8 text-slate-600">{config.servicesBody}</p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {config.services.map((service) => {
    const Icon = service.icon

    return (
      <div
        key={service.title}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-lg"
      >
        {/* Icon + Title */}
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-[#128c7e]">
            <Icon className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-black text-slate-950">
            {service.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm leading-6 text-slate-600">
          {service.body}
        </p>
      </div>
    )
  })}
</div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-3">
              <Image
                src={config.imageOne.src}
                alt={config.imageOne.alt}
                width={config.imageOne.width ?? 1200}
                height={config.imageOne.height ?? 900}
                unoptimized={config.imageOne.unoptimized}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">{config.audiencesLabel}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{config.audiencesTitle}</h2>
              <div className="mt-8 grid gap-4">
                {config.audiences.map((audience) => {
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

        <section className="px-4 pt-20 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">{config.journeyLabel}</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{config.journeyTitle}</h2>
              <div className="mt-8 space-y-4">
                {config.journey.map((item) => (
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
            <div className="overflow-hidden rounded-lg border border-emerald-100 bg-white p-3 shadow-xl">
              <Image src={config.imageTwo.src} alt={config.imageTwo.alt} width={1024} height={768} className="h-auto w-full rounded-md object-contain" />
            </div>
          </div>
        </section>

        <section className="px-4 pt-12 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">What you get</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Everything in one powerful WhatsApp dashboard.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                Manage {config.accent.toLowerCase()} leads, conversations, bookings, campaigns, CRM updates, and team handoffs from one clean interface.
              </p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl" style={{ height: 620 }}>
              <div className="flex h-full">
                <div className="flex w-14 shrink-0 flex-col bg-[#1a1f36] md:w-48">
                  <div className="flex items-center gap-2 border-b border-white/10 px-3 py-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#25d366]">
                      <MessageCircle className="h-4 w-4 text-white" />
                    </div>
                    <span className="hidden text-[11px] font-black tracking-wide text-white md:block">DigitalBot</span>
                  </div>
                  <nav className="flex flex-col gap-0.5 p-2 pt-3">
                    {dashboard.nav.map((item, index) => (
                      <div key={item} className={`flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 ${index === 0 ? "bg-[#25d366] text-white" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}>
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span className="hidden text-[10px] font-semibold md:block">{item}</span>
                      </div>
                    ))}
                  </nav>
                </div>
                <div className="flex flex-1 flex-col overflow-hidden bg-[#f1f5f9]">
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5">
                    <p className="text-xs font-black text-slate-800">{config.dashboardTitle}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Bot Active
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5 p-3">
                    {dashboard.metrics.map((s) => {
                      const Icon = s.icon
                      return (
                        <div key={s.label} className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-semibold text-slate-500">{s.label}</p>
                            <Icon className="h-3.5 w-3.5 text-[#128c7e]" />
                          </div>
                          <p className="mt-1 text-base font-black text-slate-900">{s.value}</p>
                          <p className="mt-0.5 text-[8px] text-emerald-600">{s.note}</p>
                        </div>
                      )
                    })}
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 px-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-black text-slate-800">{config.accent} Overview</p>
                      <div className="flex items-end justify-around gap-1" style={{ height: 64 }}>
                        {dashboard.bars.slice(0, 3).map((bar, index) => (
                          <div key={bar.label} className="flex flex-col items-center gap-1">
                            <span className="text-[7px] font-bold text-slate-600">{bar.value}</span>
                            <div className={`w-6 rounded-t-sm ${["h-12", "h-9", "h-7"][index]} ${bar.color}`} />
                            <span className="text-[7px] text-slate-400">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-black text-slate-800">Chatbot Sessions</p>
                      <div className="flex items-center gap-3">
                        <svg viewBox="0 0 36 36" className="h-16 w-16 shrink-0">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#25d366" strokeWidth="5" strokeDasharray="60 40" strokeDashoffset="25" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5" strokeDasharray="25 75" strokeDashoffset="-35" strokeLinecap="round" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5" strokeDasharray="15 85" strokeDashoffset="-60" strokeLinecap="round" />
                          <text x="18" y="19" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#0f172a">2,486</text>
                          <text x="18" y="24" textAnchor="middle" fontSize="3.5" fill="#94a3b8">Sessions</text>
                        </svg>
                        <div className="space-y-1.5">
                          {dashboard.pipeline.map((item, index) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                              <div className={`h-2 w-2 shrink-0 rounded-full ${["bg-[#25d366]", "bg-[#f59e0b]", "bg-[#ef4444]"][index]}`} />
                              <span className="text-[8px] text-slate-600">{item.label}</span>
                              <span className="ml-auto text-[8px] font-bold text-slate-800">{["60%", "25%", "15%"][index]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-black text-slate-800">Message Statistics</p>
                      <div className="flex items-end gap-1" style={{ height: 56 }}>
                        {["h-10", "h-8", "h-12", "h-6", "h-14", "h-9", "h-11"].map((sent, i) => (
                          <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
                            <div className="flex w-full items-end justify-center gap-0.5">
                              <div className={`w-2 rounded-t-sm bg-[#25d366] ${sent}`} />
                              <div className={`w-2 rounded-t-sm bg-[#93c5fd] ${["h-8", "h-6", "h-10", "h-5", "h-12", "h-7", "h-9"][i]}`} />
                            </div>
                            <span className="text-[7px] text-slate-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex gap-3">
                        <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-[#25d366]" /><span className="text-[7px] text-slate-500">Sent</span></div>
                        <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-[#93c5fd]" /><span className="text-[7px] text-slate-500">Delivered</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-2 gap-2.5 px-3 pb-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-black text-slate-800">Recent Chats</p>
                      <div className="space-y-1.5">
                        {dashboard.activity.map((item, index) => (
                          <div key={item} className="flex items-center gap-2 rounded-md bg-slate-50 px-2 py-1.5">
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${["bg-violet-500", "bg-orange-500", "bg-sky-500", "bg-rose-500"][index]} text-[8px] font-black text-white`}>{item.charAt(0)}</div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-[9px] font-bold text-slate-800">{config.businessName}</p>
                                <span className="text-[8px] text-slate-400">{[2, 5, 12, 18][index]}m ago</span>
                              </div>
                              <p className="truncate text-[8px] text-slate-400">{item}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="mb-2 text-[10px] font-black text-slate-800">Top Campaigns</p>
                      <div className="space-y-1.5">
                        {dashboard.pipeline.map((item) => (
                          <div key={item.label} className="rounded-md bg-slate-50 px-2 py-1.5">
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] font-bold text-slate-800">{item.label}</p>
                              <span className="text-[8px] font-bold text-slate-600">{item.value}</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div className={`h-full rounded-full ${item.width} ${item.color}`} />
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
        </section>

        <section className="bg-white px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 text-center">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">Why it converts</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{config.resultsTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-500">{config.resultsBody}</p>
            </div>
            <div className="mb-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-sm lg:grid-cols-4">
              {config.stats.map((s, index) => (
                <div key={s.label} className="flex flex-col items-center bg-white px-6 py-10 text-center">
                  <p className={`text-5xl font-black ${index === 0 ? "text-[#128c7e]" : index === 1 ? "text-violet-600" : index === 2 ? "text-sky-600" : "text-orange-500"}`}>{s.value}</p>
                  <p className="mt-3 text-sm font-bold text-slate-900">{s.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{s.note}</p>
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
              {config.comparison.map(([label, good, bad], i) => (
                <div key={label} className={`grid grid-cols-2 divide-x divide-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-red-400">x</span>
                    <p className="text-sm text-slate-600">{bad}</p>
                  </div>
                  <div className="flex items-start gap-3 px-8 py-5">
                    <span className="mt-0.5 shrink-0 text-base text-[#128c7e]">✓</span>
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

        <section className="px-4 pt-8 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl rounded-lg bg-slate-950 p-8 text-center text-white shadow-2xl sm:p-12">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-[#25d366] text-slate-950">
              <PhoneCall className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">{config.ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">{config.ctaBody}</p>
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
