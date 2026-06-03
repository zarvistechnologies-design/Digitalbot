import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  BadgeIndianRupee,
  Bot,
  Building2,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock3,
  Database,
  FileText,
  GraduationCap,
  Headphones,
  HelpCircle,
  Languages,
  MessageSquareText,
  Mic2,
  Phone,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Workflow,
  Zap,
} from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Voice Agents for Business Calls | DigitalBot.ai",
  description:
    "Build AI voice agents that answer calls, qualify leads, book appointments, make reminders, and support customers 24/7.",
}

const stats = [
  { value: "24/7", label: "Call coverage" },
  { value: "3 sec", label: "Fast response" },
  { value: "10x", label: "Call capacity" },
  { value: "60%", label: "Less manual work" },
]

const features = [
  {
    icon: PhoneCall,
    title: "Inbound Call Handling",
    text: "Answers customer calls, understands the reason for calling, and guides each caller through the right flow.",
  },
  {
    icon: Users,
    title: "Lead Qualification",
    text: "Collects name, phone, requirement, location, budget, urgency, and preferred callback time before sales handoff.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    text: "Books demos, clinic visits, site visits, service slots, consultations, and callbacks directly over the call.",
  },
  {
    icon: MessageSquareText,
    title: "Customer Support",
    text: "Answers FAQs, order questions, service updates, pricing queries, and basic troubleshooting requests.",
  },
  {
    icon: Clock3,
    title: "Reminder Calls",
    text: "Makes polite calls for appointments, payments, renewals, feedback, missed inquiries, and follow-ups.",
  },
  {
    icon: Headphones,
    title: "Human Handoff",
    text: "Transfers important calls to your team with caller details, intent, and conversation summary.",
  },
]

const industries = [
  "Healthcare clinics",
  "Real estate teams",
  "Automobile service centers",
  "Education institutes",
  "Insurance agencies",
  "Finance providers",
]

const useCases = [
  {
    icon: Building2,
    image: "https://images.pexels.com/photos/8482517/pexels-photo-8482517.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Real Estate Voice Agent",
    text: "Answers property inquiries, captures budget and location, qualifies buyers, and books site visits.",
  },
  {
    icon: Stethoscope,
    image: "https://images.pexels.com/photos/6812427/pexels-photo-6812427.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Healthcare Voice Agent",
    text: "Books appointments, confirms doctor availability, shares clinic timings, and sends visit reminders.",
  },
  {
    icon: Car,
    image: "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Automobile Voice Agent",
    text: "Handles service bookings, pickup requests, repair status calls, and test-drive inquiries.",
  },
  {
    icon: GraduationCap,
    image: "https://images.pexels.com/photos/5212340/pexels-photo-5212340.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Education Voice Agent",
    text: "Answers admission questions, captures course interest, schedules counselor calls, and follows up leads.",
  },
  {
    icon: BadgeIndianRupee,
    image: "https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Finance Voice Agent",
    text: "Qualifies loan or insurance leads, collects basic eligibility details, and books advisor callbacks.",
  },
  {
    icon: Headphones,
    image: "https://images.pexels.com/photos/8867476/pexels-photo-8867476.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Support Voice Agent",
    text: "Resolves common questions, collects complaint details, creates summaries, and escalates urgent issues.",
  },
]

const callOutputs = [
  "Caller name, phone number, and intent",
  "Requirement summary and lead quality",
  "Appointment or callback timing",
  "Call transcript and recording reference",
  "Next-best action for your team",
  "CRM-ready customer notes",
]

const readiness = [
  "Custom business scripts",
  "Call recordings and transcripts",
  "Escalation rules",
  "CRM-ready lead data",
  "Language and tone control",
  "Performance reporting",
]

const visualStories = [
  {
    image: "https://images.pexels.com/photos/8482517/pexels-photo-8482517.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Sales calls",
    text: "Qualify property inquiries and book visits while the caller is still interested.",
  },
  {
    image: "https://images.pexels.com/photos/6812427/pexels-photo-6812427.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Appointment calls",
    text: "Confirm patient needs, preferred timing, and clinic details in one smooth call.",
  },
  {
    image: "https://images.pexels.com/photos/8867476/pexels-photo-8867476.jpeg?auto=compress&cs=tinysrgb&w=900",
    title: "Support calls",
    text: "Answer common questions, summarize issues, and route urgent cases to your team.",
  },
]

const agentActions = [
  {
    icon: PhoneCall,
    title: "Answers the call",
    text: "Greets the caller instantly with your brand tone.",
  },
  {
    icon: Mic2,
    title: "Listens naturally",
    text: "Understands intent, urgency, language, and context.",
  },
  {
    icon: CalendarCheck,
    title: "Completes the task",
    text: "Books, qualifies, reminds, routes, or follows up.",
  },
  {
    icon: FileText,
    title: "Sends summary",
    text: "Creates clean notes for CRM and your team.",
  },
]

const callFlow = [
  {
    step: "01",
    title: "Customer calls",
    text: "The AI voice agent answers instantly with your brand greeting.",
  },
  {
    step: "02",
    title: "Intent is understood",
    text: "It identifies whether the caller needs pricing, booking, support, status, or a callback.",
  },
  {
    step: "03",
    title: "Details are captured",
    text: "The caller shares requirement, contact details, timing, and other business-specific information.",
  },
  {
    step: "04",
    title: "Action is completed",
    text: "The agent books, qualifies, reminds, answers, or transfers the call to your team.",
  },
]

const comparison = [
  ["Availability", "Office hours", "Always active"],
  ["Call capacity", "One call at a time", "Multiple calls together"],
  ["Lead details", "Manual notes", "Structured call summary"],
  ["Follow-up", "Depends on staff", "Automatic reminders"],
  ["Consistency", "Varies by agent", "Same quality every call"],
]

const transcript = [
  { speaker: "AI Voice Agent", text: "Welcome to Prime Realty. Are you looking to buy, rent, or book a site visit?" },
  { speaker: "Customer", text: "I am interested in a 2BHK flat in Pune." },
  { speaker: "AI Voice Agent", text: "Sure. What is your budget range and preferred location?" },
  { speaker: "Customer", text: "Around 75 lakhs, Wakad or Baner." },
  { speaker: "AI Voice Agent", text: "Got it. I found matching projects. Would you like to book a site visit this weekend?" },
]

const faqs = [
  {
    question: "How is an AI Voice Agent different from an AI Voice Bot?",
    answer:
      "A voice bot usually follows fixed flows for FAQs or reminders. A voice agent can understand intent, manage longer conversations, collect details, complete tasks, and hand off complex calls.",
  },
  {
    question: "Can the voice agent speak Hindi or regional languages?",
    answer:
      "Yes. The call flow can be configured for English, Hindi, and regional language conversations based on your customer audience.",
  },
  {
    question: "Can it transfer calls to my team?",
    answer:
      "Yes. It can transfer urgent, complex, or high-value calls to your staff with caller details and conversation context.",
  },
  {
    question: "Can it book appointments or callbacks?",
    answer:
      "Yes. It can confirm slots for demos, consultations, service visits, clinic appointments, site visits, and follow-up calls.",
  },
  {
    question: "Can it make outbound reminder calls?",
    answer:
      "Yes. It can call customers for reminders, payment follow-ups, renewals, feedback, missed-call callbacks, and lead nurturing.",
  },
  {
    question: "Can it connect with CRM or WhatsApp?",
    answer:
      "Yes. Call summaries, lead details, and follow-up actions can be prepared for CRM, WhatsApp, or your internal team process.",
  },
]

export default function VoiceAgentsPage() {
  return (
    <>
      <Header />
      <style>
        {`
          @keyframes voiceFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }

          @keyframes voiceRise {
            from { opacity: 0; transform: translateY(22px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes voiceWave {
            0%, 100% { transform: scaleY(0.45); opacity: 0.65; }
            50% { transform: scaleY(1); opacity: 1; }
          }

          @keyframes voiceGlow {
            0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.28); }
            50% { box-shadow: 0 0 0 18px rgba(249, 115, 22, 0); }
          }

          @keyframes voiceRoute {
            0% { transform: translateX(-100%); opacity: 0; }
            20%, 80% { opacity: 1; }
            100% { transform: translateX(100%); opacity: 0; }
          }

          @keyframes voiceSoftScale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.04); }
          }

          .voice-float {
            animation: voiceFloat 5.5s ease-in-out infinite;
          }

          .voice-rise {
            animation: voiceRise 0.75s ease-out both;
          }

          .voice-wave {
            animation: voiceWave 1.15s ease-in-out infinite;
            transform-origin: bottom;
          }

          .voice-glow {
            animation: voiceGlow 2.2s ease-out infinite;
          }

          .voice-route {
            animation: voiceRoute 2.8s ease-in-out infinite;
          }

          .voice-soft-scale {
            animation: voiceSoftScale 4.5s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .voice-float,
            .voice-rise,
            .voice-wave,
            .voice-glow,
            .voice-route,
            .voice-soft-scale {
              animation: none;
            }
          }
        `}
      </style>
      <main className="min-h-screen bg-white text-slate-950">
        <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_62%,#fff_100%)]">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100">
                  <Mic2 className="h-3.5 w-3.5" />
                </span>
                AI Voice Agents for business calls
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                AI Voice Agents that answer, qualify, and convert calls 24/7.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                DigitalBot voice agents speak naturally with customers, understand call intent, book appointments,
                qualify leads, send reminders, and hand off important calls with complete context.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Book Free Demo <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services/ai-voice-bot"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 transition hover:border-orange-200 hover:bg-orange-50"
                >
                  Explore Voice Bot <Phone className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                    <p className="text-2xl font-bold text-orange-600">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-8 hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-xl shadow-orange-100/70 lg:block">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-950">Lead qualified</p>
                    <p className="text-xs text-slate-500">Budget, city, need captured</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-4 bottom-16 z-10 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/60 lg:block">
                <div className="flex items-center gap-3">
                  <span className="voice-glow flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Mic2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-slate-950">Listening now</p>
                    <div className="mt-1 flex h-5 items-end gap-1">
                      {[0, 1, 2, 3, 4].map((bar) => (
                        <span
                          key={bar}
                          className="voice-wave w-1 rounded-full bg-orange-500"
                          style={{ height: `${10 + bar * 3}px`, animationDelay: `${bar * 0.08}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="voice-float relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-4 shadow-2xl shadow-orange-100">
                <div className="relative h-[520px] overflow-hidden rounded-[1.5rem] bg-slate-950">
                  <Image
                    src="/images/voice-agent.png"
                    alt="AI voice agent dashboard preview"
                    fill
                    priority
                    className="object-cover opacity-80"
                    sizes="(min-width: 1024px) 520px, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex items-center justify-between rounded-2xl bg-white/90 px-4 py-3 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
                        <Bot className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-950">DigitalBot Voice Agent</p>
                        <p className="text-xs text-emerald-600">Live call in progress</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Active</span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-white p-5 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-600">Sample call</p>
                        <h2 className="mt-1 text-xl font-bold text-slate-950">Real estate demo booking</h2>
                      </div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <PhoneCall className="h-5 w-5" />
                      </span>
                    </div>
                    <div className="mb-4 flex h-10 items-end gap-1.5 rounded-2xl bg-orange-50 px-4 py-2">
                      {[0, 1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <span
                          key={bar}
                          className="voice-wave h-full w-1.5 rounded-full bg-orange-500"
                          style={{ animationDelay: `${bar * 0.09}s` }}
                        />
                      ))}
                    </div>
                    <div className="space-y-3">
                      {transcript.slice(0, 3).map((line) => (
                        <div key={line.text} className="rounded-2xl bg-slate-50 p-3">
                          <p className="text-xs font-bold text-slate-500">{line.speaker}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-800">{line.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-slate-950 py-20 text-white">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div className="relative min-h-[560px]">
              <div className="voice-soft-scale absolute inset-0 overflow-hidden rounded-[2rem]">
                <img
                  src={visualStories[2].image}
                  alt="Support team using voice agent automation"
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
              </div>

              <div className="absolute left-5 right-5 top-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="voice-glow flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
                      <PhoneCall className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold">Incoming customer call</p>
                      <p className="text-xs text-slate-300">AI agent answers before the second ring</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                    Live
                  </span>
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 overflow-hidden rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Voice intelligence</p>
                    <h2 className="mt-1 text-xl font-bold">Call is being understood</h2>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                    <Bot className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative mb-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <span className="voice-route absolute inset-y-0 left-0 w-1/2 rounded-full bg-orange-500" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["Intent: booking", "Language: English", "Status: qualified"].map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-sm font-bold text-slate-800">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Voice agent in action</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Show visitors how the AI actually works during a call.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Instead of only reading service text, visitors can see the agent answering, listening, routing, and
                preparing follow-up data in one clear visual flow.
              </p>

              <div className="mt-8 grid gap-4">
                {agentActions.map((item, index) => (
                  <div
                    key={item.title}
                    className="voice-rise flex gap-4 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-300">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-100 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { icon: Sparkles, title: "Natural voice", text: "Conversations feel smooth, clear, and human-like." },
                { icon: Languages, title: "Multilingual", text: "Support English, Hindi, and regional call flows." },
                { icon: ShieldCheck, title: "Reliable process", text: "Every call follows your approved business script." },
                { icon: Zap, title: "Instant action", text: "Bookings, reminders, summaries, and handoffs happen fast." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Clear positioning</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Voice bot handles tasks. Voice agent handles conversations.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  This page is for a smarter business caller experience. It is not only an IVR or fixed FAQ bot. It is
                  a trained voice agent that listens, asks follow-up questions, completes actions, and prepares clean
                  context for your team.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-700">
                    <Bot className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">AI Voice Bot</h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    Best for fixed flows like FAQs, reminders, simple routing, and repeatable call scripts.
                  </p>
                </div>
                <div className="rounded-3xl border border-orange-200 bg-orange-50 p-6 shadow-xl shadow-orange-100">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <Mic2 className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">AI Voice Agent</h3>
                  <p className="mt-3 leading-7 text-slate-700">
                    Best for real conversations where the AI qualifies, books, follows up, escalates, and summarizes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Voice agent capabilities</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                One AI agent for support, sales, bookings, and follow-up calls.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Use it as a receptionist, sales assistant, support agent, appointment desk, or reminder caller.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="voice-rise rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-white py-20">
          <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 xl:grid-cols-[0.72fr_1.28fr] xl:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Visual workflows</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Beautiful call journeys for every high-value customer touchpoint.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Add a voice agent to the calls that matter most: sales inquiries, appointments, service requests, and
                  follow-ups. Each flow can feel branded, calm, and consistent.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 xl:gap-8">
                {visualStories.map((item, index) => (
                  <div
                    key={item.title}
                    className="voice-rise group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <div className="relative h-72 overflow-hidden bg-slate-100 lg:h-80">
                      <img
                        src={item.image}
                        alt={`${item.title} voice agent workflow`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-orange-700 backdrop-blur">
                        AI call flow
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Built for real businesses</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Voice agents for the calls your team receives every day.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                Each agent can be trained around your industry, questions, handoff rules, and customer journey.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {useCases.map((item) => (
                <div
                  key={item.title}
                  className="voice-rise group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={`${item.title} industry use case`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/10 to-transparent" />
                    <span className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-lg">
                      <item.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-[88rem] gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                From first ring to completed action.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The voice agent does more than talk. It follows your business logic, collects the right details, and
                moves every caller toward the next step.
              </p>
              <div className="mt-8 rounded-3xl border border-orange-100 bg-orange-50 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-orange-600">
                    <Workflow className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold text-slate-950">Custom call flows</p>
                    <p className="text-sm leading-6 text-slate-600">
                      We train the flow around your services, questions, language, working hours, and handoff rules.
                    </p>
                  </div>
                </div>
              </div>
              <div className="voice-float relative mt-8 h-[420px] overflow-hidden rounded-[2.25rem] border border-slate-200 bg-slate-950 shadow-2xl shadow-orange-100 lg:h-[520px]">
                <Image
                  src="/images/ai-voice-agent-tool.webp"
                  alt="AI voice agent call workflow interface"
                  fill
                  className="object-cover opacity-85"
                  sizes="(min-width: 1024px) 420px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 rounded-3xl bg-white/90 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">Live routing</p>
                      <p className="mt-1 text-lg font-bold text-slate-950">Intent detected in seconds</p>
                      <div className="mt-3 flex h-9 items-end gap-1.5">
                        {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                          <span
                            key={bar}
                            className="voice-wave w-2 rounded-full bg-orange-500"
                            style={{ height: `${14 + (bar % 4) * 7}px`, animationDelay: `${bar * 0.08}s` }}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="voice-glow flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-7 w-7" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {callFlow.map((item) => (
                <div
                  key={item.step}
                  className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100 sm:grid-cols-[72px_1fr]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-bold text-white">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 leading-7 text-slate-600">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">After every call</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your team gets a clean call summary, not scattered notes.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                The agent turns every conversation into usable business data so sales, support, or front-desk teams can
                act faster.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {callOutputs.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white">
                  <FileText className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-bold text-slate-950">Call summary example</p>
                  <p className="text-sm text-slate-500">Ready for CRM or team follow-up</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  ["Caller intent", "Interested in 2BHK property in Pune"],
                  ["Lead details", "Budget: 75 lakh, Location: Wakad or Baner"],
                  ["Next action", "Schedule site visit for Sunday morning"],
                  ["Priority", "High intent buyer"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange-600">{label}</p>
                    <p className="mt-1 font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-10 lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Business-ready setup</p>
                  <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                    Secure, reliable, and trained for your exact call process.
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-slate-300">
                    The voice agent can follow your approved scripts, respect escalation rules, and prepare call data
                    for the tools your team already uses.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {readiness.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                      <Database className="h-5 w-5 shrink-0 text-orange-300" />
                      <span className="text-sm font-semibold text-slate-100">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">Sample conversation</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                A voice agent that sounds ready for business.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Show a practical flow: the AI answers, asks useful questions, confirms details, and prepares the next action for your team.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <div key={industry} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
                    {industry}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500">
                    <Mic2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-bold">Live transcript</p>
                    <p className="text-sm text-slate-400">Inbound demo call</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Recording
                </span>
              </div>
              <div className="space-y-4">
                {transcript.map((line) => (
                  <div
                    key={line.text}
                    className={`rounded-3xl p-4 ${
                      line.speaker === "Customer" ? "ml-8 bg-white text-slate-950" : "mr-8 bg-orange-500 text-white"
                    }`}
                  >
                    <p className={`text-xs font-bold ${line.speaker === "Customer" ? "text-slate-500" : "text-orange-100"}`}>
                      {line.speaker}
                    </p>
                    <p className="mt-1 leading-7">{line.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Business impact</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Replace missed calls and manual follow-ups with an always-ready voice team.
                </h2>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Your team stays focused on high-value conversations while the AI handles repetitive calls with speed and consistency.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="grid grid-cols-3 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-600">
                  <span>Metric</span>
                  <span className="text-center">Manual calling</span>
                  <span className="text-center text-orange-600">AI voice agent</span>
                </div>
                {comparison.map(([metric, manual, ai]) => (
                  <div key={metric} className="grid grid-cols-3 border-t border-slate-100 px-5 py-4 text-sm">
                    <span className="font-bold text-slate-950">{metric}</span>
                    <span className="text-center text-slate-500">{manual}</span>
                    <span className="text-center font-bold text-orange-600">{ai}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Questions</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Common questions about AI Voice Agents.
              </h2>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {faqs.map((faq, index) => (
                <div key={faq.question} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                      <HelpCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-600">FAQ {index + 1}</p>
                      <h3 className="mt-1 font-bold leading-6 text-slate-950">{faq.question}</h3>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-orange-50 py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Ready for demo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              See your AI Voice Agent in action.
            </h2>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Share your business process and we will show how your AI voice agent can answer calls, qualify customers,
              complete bookings, and hand off important conversations in your workflow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Build My Voice Agent Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-7 py-4 text-sm font-bold text-slate-950 transition hover:bg-orange-100"
              >
                View All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
