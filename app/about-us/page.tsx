"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarCheck,
  CheckCircle,
  Headphones,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const services = [
  {
    icon: PhoneCall,
    title: "AI Voice Agents",
    text: "Answer calls, qualify customers, collect requirements, and route urgent conversations to your team.",
    card: "border-orange-200 bg-orange-50 text-orange-700 shadow-orange-100",
    iconBox: "bg-orange-500 text-white",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Bots",
    text: "Guide inquiries, share details, capture leads, send reminders, and support customers on WhatsApp.",
    card: "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100",
    iconBox: "bg-emerald-600 text-white",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Automation",
    text: "Book demos, visits, consultations, and appointments while keeping customer details organized.",
    card: "border-sky-200 bg-sky-50 text-sky-700 shadow-sky-100",
    iconBox: "bg-sky-600 text-white",
  },
  {
    icon: BarChart3,
    title: "Lead Analysis",
    text: "Turn conversations into lead summaries, qualification signals, and follow-up-ready data.",
    card: "border-violet-200 bg-violet-50 text-violet-700 shadow-violet-100",
    iconBox: "bg-violet-600 text-white",
  },
]

const serviceDetails = [
  "Inbound and outbound AI voice calls",
  "WhatsApp lead capture and customer support",
  "Appointment booking, reminders, and confirmations",
  "Lead qualification for sales and service teams",
  "Conversation summaries and handoff notes",
  "Industry workflows for real estate, healthcare, education, finance, and more",
]

const industries = [
  { name: "Real Estate", tone: "border-orange-200 bg-orange-100 text-orange-800" },
  { name: "Healthcare", tone: "border-emerald-200 bg-emerald-100 text-emerald-800" },
  { name: "Insurance", tone: "border-sky-200 bg-sky-100 text-sky-800" },
  { name: "Restaurants", tone: "border-rose-200 bg-rose-100 text-rose-800" },
  { name: "Finance", tone: "border-violet-200 bg-violet-100 text-violet-800" },
  { name: "Education", tone: "border-amber-200 bg-amber-100 text-amber-800" },
  { name: "E-commerce", tone: "border-teal-200 bg-teal-100 text-teal-800" },
  { name: "Collections", tone: "border-indigo-200 bg-indigo-100 text-indigo-800" },
]

const principles = [
  "AI should answer customers quickly without making the experience feel robotic.",
  "Automation should support real workflows, from calls and WhatsApp chats to bookings and follow-ups.",
  "Businesses should get cleaner data, faster responses, and more time for high-value work.",
]

export default function HeaderAboutUsPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white text-slate-950">
        <section className="border-b border-orange-100 bg-white px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                <Sparkles className="h-4 w-4" />
                DigitalBot.ai by Zarvis Technologies Private Limited.
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">
                AI voice and WhatsApp automation for growing businesses.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                DigitalBot.ai, under Zarvis Technologies Private Limited, helps teams answer faster, capture better leads, book more
                appointments, and manage customer conversations across voice calls and WhatsApp.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact#contact-form"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
                >
                  Talk to Our Team <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-6 py-3.5 text-sm font-bold text-orange-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-xl shadow-orange-100/70">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-950">DigitalBot AI Workspace</p>
                    <p className="text-xs text-slate-500">Voice, WhatsApp, leads, and bookings</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Live</span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Voice calls", value: "24/7", icon: PhoneCall, tone: "bg-orange-500" },
                    { label: "Lead flows", value: "Fast", icon: Zap, tone: "bg-sky-500" },
                    { label: "Human handoff", value: "Ready", icon: Headphones, tone: "bg-emerald-500" },
                    { label: "Secure workflows", value: "Built in", icon: ShieldCheck, tone: "bg-violet-500" },
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg text-white ${item.tone}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-slate-950">{item.value}</p>
                        <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50 p-4">
                  <div className="flex items-start gap-3">
                    <Bot className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <p className="text-sm leading-6 text-slate-700">
                      Our AI agents understand intent, collect the right details, and prepare clean follow-up data for
                      your team.
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">What We Do</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                Services that keep customer conversations moving.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                DigitalBot.ai combines voice automation, WhatsApp workflows, lead capture, booking support, and
                conversation intelligence in one practical platform.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <article key={service.title} className={`rounded-xl border p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${service.card}`}>
                    <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-lg ${service.iconBox}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-950">{service.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{service.text}</p>
                  </article>
                )
              })}
            </div>

            <div className="mt-10 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/70 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[380px] bg-white sm:min-h-[460px] lg:min-h-[560px]">
                <Image
                  src="/images/about_us_1.png"
                  alt="AI voice agent dashboard interface"
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-contain p-3 sm:p-5"
                />
              </div>
              <div className="flex flex-col justify-center bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">Automation Coverage</p>
                <h3 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                  One workflow layer for calls, chats, bookings, and follow-up.
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
                  The platform is built around the everyday work your team handles after every customer conversation.
                </p>

                <div className="mt-7 grid gap-3">
                  {serviceDetails.map((detail) => (
                    <div key={detail} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      <span className="text-sm font-medium leading-6 text-zinc-100">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Our Approach</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
                Practical AI automation for real business conversations.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                We focus on workflows that directly improve response time, lead quality, appointment handling, and
                customer support across industries.
              </p>
            </div>

            <div className="grid gap-3">
              {principles.map((principle, index) => (
                <div key={principle} className="flex items-start gap-3 rounded-xl border border-white bg-white/85 p-4 shadow-sm">
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${index === 0 ? "bg-orange-500" : index === 1 ? "bg-sky-600" : "bg-emerald-600"}`}>
                    <CheckCircle className="h-4 w-4 text-white" />
                  </span>
                  <p className="text-sm leading-6 text-slate-700">{principle}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">Industries</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
                Built for teams that handle high-volume customer conversations.
              </h2>
              <p className="mt-5 text-base leading-7 text-slate-600">
                DigitalBot.ai supports voice and WhatsApp automation across everyday business use cases, from property
                inquiries and patient appointments to admissions, reservations, support, and collections.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200">
              <div className="relative h-[520px] sm:h-[680px] lg:h-[880px]">
                <Image
                  src="/images/about_us_2.png"
                  alt="AI automation industry use cases"
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="object-contain p-1 sm:p-2"
                />
              </div>
            </div>

            <div className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-3">
              {industries.map((industry) => (
                <span
                  key={industry.name}
                  className={`min-w-[150px] rounded-full border px-6 py-2.5 text-center text-sm font-semibold sm:min-w-[170px] ${industry.tone}`}
                >
                  {industry.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 text-center">
          <div className="container mx-auto">
            <div className="rounded-3xl border border-orange-300/20 bg-black px-6 py-10 text-white shadow-lg shadow-black/40 sm:px-10">
              <h2 className="mx-auto max-w-2xl text-3xl font-bold text-white">
                See how DigitalBot.ai can fit into your business workflow.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300">
                Share your process and we will show how an AI voice agent or WhatsApp bot can automate the next step.
              </p>
              <Link
                href="/contact#contact-form"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Contact Us <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
