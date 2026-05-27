import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  KeyRound,
  Lock,
  MessageSquare,
  PhoneCall,
  Server,
  Shield,
  Terminal,
  Webhook,
  Zap,
} from "lucide-react"

const endpoints = [
  {
    method: "POST",
    path: "/v1/calls",
    title: "Start a voice call",
    description: "Trigger an outbound AI voice call with contact details, goal, and workflow context.",
  },
  {
    method: "GET",
    path: "/v1/calls/{call_id}",
    title: "Fetch call status",
    description: "Retrieve call state, transcript, recording URL, outcome, and extracted fields.",
  },
  {
    method: "POST",
    path: "/v1/agents",
    title: "Create an AI agent",
    description: "Configure voice, language, script, escalation behavior, and connected tools.",
  },
  {
    method: "POST",
    path: "/v1/webhooks",
    title: "Subscribe to events",
    description: "Receive real-time updates for call completed, lead qualified, and booking created.",
  },
]

const guides = [
  { icon: KeyRound, title: "Authentication", text: "Create API keys, sign requests, and manage workspace access." },
  { icon: PhoneCall, title: "Voice Calls", text: "Place calls, inspect results, and route customers to your team." },
  { icon: MessageSquare, title: "Transcripts", text: "Read summaries, sentiment, intent, objections, and next steps." },
  { icon: Webhook, title: "Webhooks", text: "Stream events into your CRM, support desk, or internal workflows." },
  { icon: Shield, title: "Security", text: "Use least-privilege keys, encrypted payloads, and audit-friendly logs." },
  { icon: Server, title: "SDKs", text: "Build faster with REST examples and server-side integration patterns." },
]

const quickLinks = [
  "Generate API key",
  "Create your first agent",
  "Make a test call",
  "Configure webhook events",
  "Read call transcripts",
  "Handle API errors",
]

const webhookEvents = ["call.started", "call.completed", "lead.qualified", "appointment.booked"]

export default function Docs() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/60 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <nav className="mb-8 flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <li>
                <Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li><ChevronRight className="h-4 w-4 text-slate-300" /></li>
              <li className="font-medium text-orange-600">API Docs</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                <Terminal className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Developer documentation</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Build AI voice workflows with the DigitalBot API.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Create agents, start calls, receive webhooks, and sync outcomes into your CRM using clean REST APIs designed for production voice automation.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="#quick-start" className="inline-flex h-12 items-center justify-center rounded-lg bg-slate-950 px-6 text-base font-semibold text-white transition-colors hover:bg-slate-800">
                  Start Quickstart
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="#reference" className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                  View Reference
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
                {["REST API", "Webhooks", "Secure keys"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                    <Check className="mb-2 h-4 w-4 text-orange-600" />
                    <p className="text-sm font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/70">
              <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-yellow-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                    <Lock className="h-3.5 w-3.5" />
                    API v1
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-950 p-4 font-mono text-sm leading-7 text-slate-300 ring-1 ring-white/10">
                  <p><span className="text-orange-300">curl</span> https://api.digitalbot.ai/v1/calls \</p>
                  <p className="pl-4">-H <span className="text-green-300">"Authorization: Bearer DB_API_KEY"</span> \</p>
                  <p className="pl-4">-H <span className="text-green-300">"Content-Type: application/json"</span> \</p>
                  <p className="pl-4">-d {'{'}</p>
                  <p className="pl-8"><span className="text-sky-300">"agent_id"</span>: <span className="text-green-300">"agent_sales"</span>,</p>
                  <p className="pl-8"><span className="text-sky-300">"phone"</span>: <span className="text-green-300">"+1 415 555 0198"</span>,</p>
                  <p className="pl-8"><span className="text-sky-300">"goal"</span>: <span className="text-green-300">"qualify_lead"</span></p>
                  <p className="pl-4">{'}'}</p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { value: "200ms", label: "API latency" },
                    { value: "99.9%", label: "Uptime" },
                    { value: "JSON", label: "Responses" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-2xl bg-white/[0.04] p-4 text-center ring-1 ring-white/10">
                      <p className="text-lg font-semibold text-white">{metric.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quick-start" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Quickstart</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">From API key to first AI call.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Follow the core setup path, then expand into transcripts, webhooks, and production monitoring.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { step: "01", icon: KeyRound, title: "Create an API key", text: "Generate a workspace key and store it server-side as an environment variable." },
              { step: "02", icon: Code, title: "Create an agent", text: "Define voice, script, language, qualification fields, and escalation behavior." },
              { step: "03", icon: PhoneCall, title: "Start a test call", text: "Send the phone number and workflow goal, then inspect call results." },
            ].map((item) => (
              <div key={item.step} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-slate-900" />
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-orange-600">{item.step}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200">
                    <item.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reference" className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
              <div className="rounded-3xl bg-slate-950 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">API reference</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Endpoints for call automation.</h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  Use simple REST resources to manage agents, calls, transcripts, and event subscriptions.
                </p>
                <div className="mt-8 space-y-3">
                  {quickLinks.map((link) => (
                    <div key={link} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                      <Check className="h-4 w-4 text-orange-300" />
                      <span className="text-sm font-medium text-slate-200">{link}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {endpoints.map((endpoint) => (
                  <div key={endpoint.path} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-orange-600 px-3 py-1.5 font-mono text-xs font-semibold text-white">{endpoint.method}</span>
                      <code className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">{endpoint.path}</code>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">{endpoint.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Guides</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Everything developers need to ship.</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <div key={guide.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200">
                  <guide.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{guide.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-stretch">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2">
                <Webhook className="h-4 w-4 text-orange-300" />
                <span className="text-sm font-semibold text-orange-200">Webhook events</span>
              </div>
              <h2 className="mt-7 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
                Stream every call outcome into your stack.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Subscribe to lifecycle events and update your CRM, analytics warehouse, or support queue as soon as DigitalBot completes an action.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white p-5 shadow-2xl shadow-black/30">
              <div className="rounded-2xl bg-slate-950 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">Event payloads</p>
                  <Copy className="h-4 w-4 text-slate-400" />
                </div>
                <div className="space-y-3">
                  {webhookEvents.map((event) => (
                    <div key={event} className="flex items-center justify-between rounded-2xl bg-white/[0.04] px-4 py-3 ring-1 ring-white/10">
                      <code className="text-sm font-semibold text-orange-300">{event}</code>
                      <ArrowRight className="h-4 w-4 text-slate-500" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-center sm:p-8 lg:p-10">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Need integration help?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Share your use case and our team can help you map the right endpoints, webhook events, and launch workflow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/contact#contact-form" className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-600">
                Contact Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/services" className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
