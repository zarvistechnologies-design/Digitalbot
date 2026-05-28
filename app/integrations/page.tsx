import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  ChevronRight,
  Code2,
  DatabaseZap,
  Headphones,
  Lock,
  MessageCircle,
  PlugZap,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
  Slack,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Integrations | CRM, Calendar, WhatsApp & API Connections - DigitalBot.ai",
  description:
    "Connect DigitalBot.ai with CRM, calendars, support desks, WhatsApp, webhooks, and custom APIs for clean AI voice and chatbot automation workflows.",
};

const integrationGroups = [
  {
    icon: Users,
    title: "CRM & sales tools",
    description:
      "Sync leads, call outcomes, qualification notes, and follow-up tasks into the tools your sales team already uses.",
    items: ["Salesforce", "HubSpot", "Zoho CRM", "Pipedrive"],
  },
  {
    icon: CalendarCheck,
    title: "Calendar & booking",
    description:
      "Let AI agents book, confirm, reschedule, and update appointments without manual back-and-forth.",
    items: ["Google Calendar", "Calendly", "Outlook", "Custom booking"],
  },
  {
    icon: Headphones,
    title: "Support & helpdesk",
    description:
      "Create tickets, route urgent cases, and attach conversation summaries to customer support workflows.",
    items: ["Zendesk", "Freshdesk", "Intercom", "Support inbox"],
  },
  {
    icon: MessageCircle,
    title: "Messaging channels",
    description:
      "Keep customer conversations connected across calls, WhatsApp, web chat, and team handoffs.",
    items: ["WhatsApp", "Website chat", "SMS", "Email"],
  },
  {
    icon: ShoppingCart,
    title: "Commerce systems",
    description:
      "Automate order questions, returns, delivery updates, and shopper support with synced customer context.",
    items: ["Shopify", "WooCommerce", "Payment links", "Order APIs"],
  },
  {
    icon: Code2,
    title: "Custom APIs",
    description:
      "Use webhooks and REST APIs to connect DigitalBot.ai with internal tools, databases, and custom workflows.",
    items: ["REST API", "Webhooks", "Zapier", "Internal systems"],
  },
];

const workflowSteps = [
  {
    step: "01",
    icon: PlugZap,
    title: "Connect your tools",
    text: "Choose the systems that need customer data, call summaries, appointments, or ticket updates.",
  },
  {
    step: "02",
    icon: DatabaseZap,
    title: "Map the workflow",
    text: "Define fields, handoff rules, status updates, and what should happen after each conversation.",
  },
  {
    step: "03",
    icon: RefreshCw,
    title: "Sync every outcome",
    text: "DigitalBot sends clean summaries, next steps, transcripts, and actions back to your business stack.",
  },
];

const trustPoints = [
  "Secure API key handling",
  "Webhook event logs",
  "Human handoff support",
  "CRM-ready summaries",
  "Custom field mapping",
  "Role-based access",
];

export default function IntegrationsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/70 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        <div className="container relative z-10 mx-auto max-w-7xl">
          <nav className="mb-8 flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <li>
                <Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </li>
              <li className="font-medium text-orange-600">Integrations</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                <PlugZap className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                  Connected automation
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Connect DigitalBot.ai with the tools your team already uses.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Sync AI voice calls, WhatsApp chats, appointments, lead data, tickets, and summaries into your CRM, calendar, helpdesk, or custom backend.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact#contact-form"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Plan My Integration
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  View API Docs
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
                {["CRM sync", "Webhooks", "No-code setup"].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                    <Check className="mb-2 h-4 w-4 text-orange-600" />
                    <p className="text-sm font-semibold text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[32px] border border-orange-200/70 bg-orange-100/30" />
              <div className="relative rounded-[28px] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/70">
                <div className="rounded-2xl bg-white p-5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">Live workflow sync</p>
                        <p className="text-sm text-slate-500">Lead captured from AI call</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      Synced
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {[
                      { icon: MessageCircle, title: "AI conversation", text: "Customer intent and transcript captured" },
                      { icon: Users, title: "CRM updated", text: "Lead score, notes, and owner assigned" },
                      { icon: CalendarCheck, title: "Booking created", text: "Demo slot added to calendar" },
                      { icon: Slack, title: "Team notified", text: "Summary sent to sales channel" },
                    ].map((item) => (
                      <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                          <p className="text-xs text-slate-500">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-300">
                    <div className="mb-3 flex items-center gap-2 text-orange-300">
                      <Webhook className="h-4 w-4" />
                      <span className="font-semibold">webhook.lead_qualified</span>
                    </div>
                    <code className="block whitespace-pre-wrap leading-6">{`{
  "lead_status": "qualified",
  "next_step": "demo_booked",
  "source": "ai_voice_call"
}`}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Integration library</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
                Connect calls, chats, and customer actions.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Start with common business tools, then extend with API and webhook connections when your workflow needs custom logic.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {integrationGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <group.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{group.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{group.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Setup flow</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
                  A clean integration path from first call to synced outcome.
                </h2>
                <p className="mt-5 text-base leading-7 text-slate-600">
                  We help map the right fields, actions, owners, and events so your AI workflows work neatly with your existing process.
                </p>
              </div>

              <div className="grid gap-4">
                {workflowSteps.map((item) => (
                  <div key={item.step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">{item.step}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Secure by design</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Reliable integrations for real customer workflows.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                DigitalBot integrations are designed for clean data flow, team visibility, and controlled access across every connected system.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300">
                    <Lock className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-slate-50 p-6 text-center shadow-xl shadow-orange-100/60 sm:p-8 lg:p-10">
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              Want DigitalBot connected to your stack?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Tell us which tools you use and we will help plan the right CRM, calendar, webhook, or custom API workflow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/contact#contact-form"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Discuss Integrations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
