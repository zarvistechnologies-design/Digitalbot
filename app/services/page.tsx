import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Code,
  Globe,
  Headphones,
  MessageSquare,
  Phone,
  PhoneCall,
  Shield,
  Smartphone,
  Star,
  Users,
  Zap
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
  description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
  keywords: [
    "ai voice assistant services",
    "ai call center solutions",
    "ai customer support",
    "ai sales agent",
    "virtual receptionist ai",
    "voice automation software",
    "conversational ai platform",
    "ai voice bot services",
    "business phone automation",
    "ai appointment scheduling",
    "voice ai for business",
    "automated customer service",
    "ai voice technology",
    "enterprise voice ai",
    "ai phone system",
  ],
  openGraph: {
    title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
    description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
    type: "website",
    url: "https://digitalbot.ai/services",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Voice Assistant Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
    description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
    images: ["/images/ai-voice-agent.png"],
  },
};

const services = [
  {
    icon: BarChart3,
    title: "Lead Analysis",
    description:
      "Capture, qualify, score, and summarize every lead conversation so your team can focus on the best opportunities.",
    features: [
      "Lead qualification",
      "Intent scoring",
      "Conversation summaries",
      "Sales handoff context",
    ],
    popular: true,
    href: "/services/leads",
  },
  {
    icon: PhoneCall,
    title: "Appointments",
    description:
      "Book, confirm, reschedule, and follow up on appointments with reliable AI voice workflows.",
    features: [
      "Appointment booking",
      "Calendar workflows",
      "Reminder calls",
      "Reschedule handling",
    ],
    popular: true,
    href: "/services/appointments",
  },
  {
    icon: MessageSquare,
    title: "Collections",
    description:
      "Run polite payment reminders, capture promises to pay, and route urgent cases to your collections team.",
    features: [
      "Payment reminders",
      "Promise-to-pay capture",
      "Dispute escalation",
      "Outcome summaries",
    ],
    popular: false,
    href: "/services/collections",
  },
];

const industries = [
  { name: "Healthcare", icon: Headphones, description: "Patient scheduling & support" },
  { name: "Real Estate", icon: Globe, description: "Property inquiries & tours" },
  { name: "Hospitality", icon: Shield, description: "Reservations & guest services" },
  { name: "E-commerce", icon: Smartphone, description: "Order tracking & support" },
  { name: "Financial Services", icon: BarChart3, description: "Account support & queries" },
  { name: "Technology", icon: Code, description: "Technical support & demos" },
];

const stats = [
  { label: "Active Businesses", value: "500+", icon: Users },
  { label: "Conversations Handled", value: "2M+", icon: MessageSquare },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Average Response Time", value: "<1s", icon: Zap },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] text-slate-900 relative overflow-hidden">
      <Header />

      {/* Redesigned Feature Page Flow */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/60 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>

        <div className="container relative z-10 mx-auto max-w-7xl">
          <nav className="mb-8 flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <li>
                <Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li><ChevronRight className="h-4 w-4 text-slate-300" /></li>
              <li className="font-medium text-orange-600">Services</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
                <Bot className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">AI voice assistant platform</span>
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Revolutionize your customer experience with AI agents that answer, qualify, and book.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                DigitalBot handles inbound and outbound voice workflows for leads, appointments, collections, and support. Your team gets the summary, the next step, and the customer context without chasing every call.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {["60+ languages", "CRM-ready", "24/7 coverage", "Human handoff"].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact#contact-form">
                  <Button size="lg" className="h-12 rounded-lg bg-slate-950 px-6 text-base font-semibold text-white hover:bg-slate-800">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="h-12 rounded-lg border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 hover:bg-slate-50">
                    View Pricing
                  </Button>
                </Link>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg">
                    <stat.icon className="mb-3 h-5 w-5 text-orange-600" />
                    <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-3 rounded-[32px] border border-orange-200/70 bg-orange-100/30"></div>
              <div className="relative rounded-[28px] border border-slate-200 bg-slate-950 p-4 shadow-2xl shadow-slate-300/70">
              <div className="rounded-2xl bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                      <PhoneCall className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">Live AI call desk</p>
                      <p className="text-sm text-slate-500">Handling customer conversations</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">Live</span>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-950 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Voice activity</span>
                    <span className="text-xs font-semibold text-orange-300">Real time</span>
                  </div>
                  <div className="flex h-14 items-end justify-between gap-1">
                    {[36, 62, 44, 78, 54, 88, 48, 72, 40, 84, 58, 68, 46, 76, 52, 90, 42, 64].map((height, idx) => (
                      <span
                        key={idx}
                        className="w-full rounded-full bg-gradient-to-t from-orange-600 to-orange-300"
                        style={{ height: `${height}%` }}
                      ></span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { value: "847", label: "Active" },
                    { value: "92%", label: "Resolved" },
                    { value: "<1s", label: "Answer" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-2xl bg-gradient-to-b from-slate-50 to-white p-4 text-center ring-1 ring-slate-200">
                      <p className="text-2xl font-semibold text-slate-950">{metric.value}</p>
                      <p className="mt-1 text-xs font-medium text-slate-500">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { icon: MessageSquare, title: "Caller intent", text: "Book appointment with sales" },
                    { icon: BarChart3, title: "Lead score", text: "High intent, ready for handoff" },
                    { icon: Check, title: "Action completed", text: "CRM updated and SMS confirmation sent" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 rounded-[28px] border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Core services</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Choose the workflow you want automated first.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Start with one use case, then expand across your phone operations as the AI learns your process and team preferences.
            </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {services.map((service, idx) => (
              <Link key={service.title} href={service.href} className="group relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-slate-900 opacity-80"></div>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white transition-colors group-hover:bg-orange-600">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                    0{idx + 1}
                  </span>
                </div>
                {service.popular && (
                  <span className="mb-4 inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">Popular workflow</span>
                )}
                <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                <div className="mt-6 space-y-3">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Check className="h-4 w-4 text-orange-600" />
                      {feature}
                    </div>
                  ))}
                </div>
                <div className="mt-7 inline-flex items-center text-sm font-semibold text-orange-600">
                  Explore service
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Platform features</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">A complete operating layer for business calls.</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                The AI does more than talk. It detects intent, follows your scripts, updates systems, escalates edge cases, and gives managers a clear performance view.
              </p>
              <div className="mt-8 space-y-3">
                {["Listen", "Understand", "Act", "Report"].map((step, idx) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3 ring-1 ring-white/10">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-semibold text-white">{idx + 1}</span>
                    <span className="text-sm font-medium text-slate-200">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { icon: MessageSquare, title: "Natural conversations", text: "Understands context, handles interruptions, and keeps multi-turn calls on track." },
                { icon: BarChart3, title: "Real-time analytics", text: "Monitor sentiment, outcomes, conversion rates, transcripts, and call trends." },
                { icon: Code, title: "Easy integrations", text: "Connect CRM, calendars, support desks, phone systems, and custom APIs." },
                { icon: Shield, title: "Secure workflows", text: "Protect conversations with encryption, access control, and audit-ready records." },
                { icon: Globe, title: "Multilingual reach", text: "Serve customers across regions with language-aware voice automation." },
                { icon: Users, title: "Human handoff", text: "Route priority conversations with summary, caller details, and next action." },
              ].map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
          backgroundSize: "42px 42px"
        }}></div>
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Industry-ready</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Built for teams that live on the phone.</h2>
            </div>
            <Link href="/contact#contact-form" className="inline-flex items-center text-sm font-semibold text-orange-300 hover:text-orange-200">
              Talk to an expert
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <div key={industry.name} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-all hover:-translate-y-1 hover:border-orange-400/40 hover:bg-white/[0.07]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 ring-1 ring-orange-300/20">
                  <industry.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-white">{industry.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Go live without rebuilding your operations.</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { step: "01", icon: Phone, title: "Map the calls", text: "We define the call types, qualification rules, escalation paths, and integrations." },
              { step: "02", icon: Code, title: "Train the agent", text: "Your AI learns scripts, FAQs, brand tone, calendar logic, and CRM fields." },
              { step: "03", icon: Zap, title: "Launch and improve", text: "Go live, review outcomes, and optimize the workflow from real conversation data." },
            ].map((item) => (
              <div key={item.step} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-slate-900"></div>
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

      <section className="bg-slate-50 px-4 py-14 sm:px-6 lg:px-8" role="region" aria-labelledby="faq-section">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">FAQ</p>
            <h2 id="faq-section" className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Questions before you start?</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["How quickly can we launch?", "Most businesses can launch a focused workflow in 5-10 days once call goals, scripts, and integrations are confirmed."],
              ["Can it work with our CRM?", "Yes. DigitalBot can sync summaries, outcomes, lead details, appointments, and tags with CRMs and custom APIs."],
              ["What happens when AI should not continue?", "You define escalation rules, and the AI transfers or alerts your team with the full context."],
              ["Can we customize the voice and flow?", "Yes. You can tune tone, scripts, qualification rules, FAQs, objection handling, and handoff behavior."],
            ].map(([question, answer]) => (
              <div key={question} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-slate-950">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {false && (
        <>
      {/* Hero Section - Unique Premium Design */}
      <section className="pt-4 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center">
        {/* Dynamic Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-[10%] w-72 h-72 bg-orange-200/15 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-orange-200/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-100/30 to-slate-100/30 rounded-full blur-[100px]"></div>
        
        {/* Animated Lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/50 to-transparent"></div>
          <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/30 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto">
          {/* Breadcrumb */}
          <nav className="flex justify-start mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 text-sm bg-white/80 backdrop-blur-xl px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-orange-600 transition-colors font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Home
                </Link>
              </li>
              <li><ChevronRight className="w-4 h-4 text-slate-300" /></li>
              <li className="text-orange-600 font-medium">Services</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content - 7 columns */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-50 rounded-full border border-slate-200 mb-8 group transition-all">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-3 bg-slate-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-4 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">AI Voice Technology</span>
                <span className="px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">NEW</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[1.05] mb-8">
                <span className="text-slate-900 block">Revolutionize Your</span>
                <span className="relative inline-block mt-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500">
                    Customer Experience
                  </span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#4f46e5"/>
                        <stop offset="100%" stopColor="#fb923c"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-6 max-w-2xl">
                Deploy intelligent AI voice agents that handle <span className="font-semibold text-orange-600">millions of conversations</span> across <span className="font-semibold text-orange-600">25+ countries</span>. Available 24/7, speaking 60+ languages.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/contact#contact-form">
                  <Button size="lg" className="group bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-8 py-7 text-base font-medium shadow-sm transition-all hover:scale-[1.02] relative overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="rounded-lg px-8 py-7 text-base font-medium border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all backdrop-blur-sm bg-white/50">
                    View Pricing
                  </Button>
                </Link>
              </div>

              {/* Trust Stats Row */}
              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex -space-x-2">
                      {['👨‍💼', '👩‍💻', '👨‍🔬', '👩‍💼'].map((emoji, i) => (
                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-white shadow-md flex items-center justify-center text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">500+ Businesses</div>
                    <div className="text-xs text-slate-400">Trust DigitalBot</div>
                  </div>
                </div>
                
                <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900">4.9/5</span>
                    <span className="text-xs text-slate-400 ml-1">(2.5k reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual - 5 columns */}
            <div className="lg:col-span-5 order-1 lg:order-2 relative">
              {/* 3D Card Stack Effect */}
              <div className="relative h-[500px] sm:h-[550px]">
                {/* Background Glow */}

                
                {/* Main Card */}
                <div className="absolute inset-4 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white/50 overflow-hidden">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">AI Voice Agent</div>
                        <div className="text-orange-100 text-xs">Enterprise Ready</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="text-white/90 text-sm font-medium">Live</span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    {/* Voice Waveform */}
                    <div className="bg-gradient-to-r from-slate-50 to-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-600">Voice Activity</span>
                        <span className="text-xs text-orange-600 font-medium">Real-time</span>
                      </div>
                      <div className="flex items-end justify-center gap-1 h-12">
                        {[40, 65, 45, 80, 55, 70, 50, 85, 60, 75, 45, 90, 55, 70, 40].map((h, i) => (
                          <div 
                            key={i} 
                            className="w-2 bg-gradient-to-t from-orange-500 to-orange-400 rounded-full animate-pulse"
                            style={{ 
                              height: `${h}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: '1s'
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <div className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">2M+</div>
                        <div className="text-xs text-slate-400">Calls/Month</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <div className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">&lt;1s</div>
                        <div className="text-xs text-slate-400">Response</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <div className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">99.9%</div>
                        <div className="text-xs text-slate-400">Uptime</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all cursor-pointer group">
                        <div className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">60+</div>
                        <div className="text-xs text-slate-400">Languages</div>
                      </div>
                    </div>
                    
                    {/* Active Call Indicator */}
                    <div className="flex items-center justify-between bg-green-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">Active Calls</div>
                          <div className="text-xs text-slate-400">Handling right now</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">847</div>
                    </div>

                    {/* Quick Service Buttons */}
                    <div className="flex items-center justify-center gap-8 pt-1">
                      <Link
                        href="/services/leads"
                        className="flex h-[62px] w-[116px] items-center justify-center gap-1.5 rounded-[18px] bg-orange-600 px-3 text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-700 hover:-translate-y-0.5"
                      >
                        <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                        <span className="text-center text-sm font-bold leading-tight">
                          Lead<br />Analysis
                        </span>
                      </Link>
                      <Link
                        href="/services/appointments"
                        className="flex h-[62px] items-center justify-center gap-1.5 rounded-[18px] px-1 text-slate-600 transition-all hover:text-orange-600"
                      >
                        <PhoneCall className="h-5 w-5 shrink-0" />
                        <span className="text-base font-bold">Appointments</span>
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -left-4 top-20 bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-slate-200/30 border border-slate-100 animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">25+ Countries</span>
                  </div>
                </div>
                
                <div className="absolute -right-4 top-1/3 bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-slate-200/30 border border-slate-100 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">SOC2 Certified</span>
                  </div>
                </div>
                
                <div className="absolute -left-2 bottom-24 bg-white/70 backdrop-blur-sm rounded-2xl p-3 shadow-xl shadow-slate-200/30 border border-slate-100 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600">24/7 Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats Marquee */}
          <div className="mt-10 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            <div className="flex gap-6 py-6 animate-marquee hover:pause-animation">
              {[...stats, ...stats, ...stats, ...stats].map((stat, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center gap-4 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/25">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Unique Bento Design */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Mesh */}


          
          {/* Floating Shapes */}
          <div className="absolute top-20 right-20 w-20 h-20 border-2 border-orange-200/30 rounded-2xl rotate-12 animate-bounce-slow opacity-40"></div>
          <div className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-orange-200/15 to-orange-300/10 rounded-full animate-bounce-slow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/2 right-10 w-8 h-8 bg-slate-300/30 rounded-lg rotate-45 animate-bounce-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium text-sm tracking-wide uppercase">Our Services</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              <span className="text-slate-900">AI Voice Solutions</span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                Built for Scale
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Choose from our comprehensive suite of AI-powered solutions designed to transform your business communication
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const isFeatured = service.popular;
              
              return (
                <Link 
                  key={index} 
                  href={service.href}
                  className="group"
                >
                  <div className={`
                    relative h-full min-h-[480px] rounded-3xl overflow-hidden transition-all duration-500
                    ${isFeatured 
                      ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 text-white shadow-xl' 
                      : 'bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50'
                    }
                    hover:-translate-y-2 cursor-pointer
                  `}>
                    {/* Decorative Elements */}
                    {isFeatured && (
                      <>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        {/* Popular Badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-300 text-yellow-300" />
                          Popular
                        </div>
                      </>
                    )}
                    
                    {/* Card Content */}
                    <div className="relative p-8">
                      {/* Service Number */}
                      <div className={`
                        absolute top-6 left-8 text-7xl font-black opacity-10
                        ${isFeatured ? 'text-white' : 'text-orange-500'}
                      `}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      
                      {/* Icon */}
                      <div className={`
                        relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                        ${isFeatured 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/25'
                        }
                        group-hover:scale-110 group-hover:rotate-3 transition-all duration-300
                      `}>
                        <service.icon className={`h-7 w-7 ${isFeatured ? 'text-white' : 'text-white'}`} />
                      </div>
                      
                      {/* Title */}
                      <h3 className={`
                        text-lg font-semibold mb-3 relative z-10
                        ${isFeatured ? 'text-white' : 'text-slate-900 group-hover:text-orange-600'}
                        transition-colors
                      `}>
                        {service.title}
                      </h3>
                      
                      {/* Description */}
                      <p className={`
                        mb-6 relative z-10 leading-relaxed
                        ${isFeatured ? 'text-orange-100' : 'text-slate-500'}
                      `}>
                        {service.description}
                      </p>
                      
                      {/* Features with Animated Checkmarks */}
                      <ul className="space-y-3 mb-6 relative z-10">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-3 text-sm"
                            style={{ animationDelay: `${idx * 100}ms` }}
                          >
                            <div className={`
                              w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0
                              ${isFeatured 
                                ? 'bg-white/20' 
                                : 'bg-orange-100 group-hover:bg-orange-500 group-hover:scale-110'
                              }
                              transition-all duration-300
                            `}>
                              <Check className={`h-3 w-3 ${isFeatured ? 'text-white' : 'text-orange-600 group-hover:text-white'} transition-colors`} />
                            </div>
                            <span className={isFeatured ? 'text-white/90' : 'text-slate-600'}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      
                      {/* CTA Button */}
                      <div className={`
                        flex items-center gap-2 font-semibold relative z-10
                        ${isFeatured ? 'text-white' : 'text-orange-600'}
                        group-hover:gap-4 transition-all duration-300
                      `}>
                        <span>Explore Service</span>
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${isFeatured 
                            ? 'bg-white/20 group-hover:bg-white/30' 
                            : 'bg-orange-100 group-hover:bg-orange-500'
                          }
                          transition-all duration-300
                        `}>
                          <ArrowRight className={`h-4 w-4 ${isFeatured ? 'text-white' : 'text-orange-600 group-hover:text-white'} group-hover:translate-x-0.5 transition-all`} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Bottom Gradient Line for Non-Featured */}
                    {!isFeatured && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-slate-50 via-slate-100/50 to-slate-50 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Need a Custom Solution?</p>
                  <p className="text-sm text-slate-500">Let's build something unique for your business</p>
                </div>
              </div>
              <Link href="/contact#contact-form">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 shadow-sm transition-all">
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section - Modern */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50/50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">


          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-slate-100/30 to-slate-100/30 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full mb-6">
              <Globe className="w-4 h-4 text-orange-600" />
              <span className="text-slate-600 font-medium text-sm tracking-wide uppercase">Global Reach</span>
              <span className="px-2 py-0.5 bg-orange-600 text-white text-xs font-medium rounded-full">25+ Countries</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              <span className="text-slate-900">Industries We</span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                Serve & Transform
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Our AI voice assistants are <span className="font-semibold text-orange-600">trusted across multiple industries</span> to deliver exceptional customer experiences and <span className="font-semibold text-orange-600">operational efficiency</span>.
            </p>
          </div>

          {/* Horizontal Scrolling Cards */}
          <div className="relative">
            {/* Gradient Fade Left */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            {/* Gradient Fade Right */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrolling Container */}
            <div className="flex gap-6 pb-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {industries.map((industry, index) => {
                const industryImages = [
                  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=600&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=600&auto=format&fit=crop'
                ];
                
                return (
                  <div
                    key={index}
                    className="flex-shrink-0 w-[300px] sm:w-[340px] snap-center group cursor-pointer"
                  >
                    {/* Card with white background and image on top */}
                    <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg shadow-slate-200/60 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 border border-slate-200/60 hover:border-orange-200">
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={industryImages[index]} 
                          alt={`${industry.name} - AI Voice Solutions`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        {/* Subtle gradient for image bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                        
                        {/* Number Badge */}
                        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center font-semibold text-orange-600 text-lg shadow-lg">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        
                        {/* Icon floating at bottom */}
                        <div className="absolute -bottom-6 right-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-4 border-white">
                          <industry.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-6 pt-4">
                        {/* Title */}
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {industry.name}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-slate-500 text-sm leading-relaxed mb-5">
                          {industry.description}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                          <span className="text-orange-600 font-semibold text-sm">Explore Solutions</span>
                          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300">
                            <ArrowRight className="h-4 w-4 text-orange-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Scroll Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {industries.map((_, index) => (
                <div key={index} className="w-2 h-2 rounded-full bg-slate-200 hover:bg-orange-500 transition-colors cursor-pointer"></div>
              ))}
            </div>
          </div>
          
          {/* Bottom Stats */}
          <div className="mt-10 flex flex-wrap justify-center gap-6 lg:gap-12">
            {[
              { value: '25+', label: 'Countries Served', icon: Globe },
              { value: '6+', label: 'Industries', icon: Users },
              { value: '99%', label: 'Client Satisfaction', icon: Star },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Features Showcase Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative bg-white overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container mx-auto relative z-10 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 mb-6">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Powerful Features</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-slate-950">
                Built for every customer call your team should not have to chase.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-500">
                DigitalBot keeps conversations natural, routes every outcome into your tools, and gives managers a live view of what is happening across leads, appointments, and collections.
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-950 p-5 text-white shadow-xl shadow-slate-200/70">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Voice operations</p>
                      <p className="text-xs text-slate-400">Live workspace</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-green-400/10 px-3 py-1 text-xs font-medium text-green-300">
                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                    Online
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 py-5">
                  {[
                    { value: "847", label: "Active calls" },
                    { value: "92%", label: "Resolved" },
                    { value: "4.8", label: "CSAT" },
                  ].map((metric) => (
                    <div key={metric.label} className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
                      <p className="text-xl font-semibold">{metric.value}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Intent detected", value: "Book appointment" },
                    { label: "CRM update", value: "HubSpot lead enriched" },
                    { label: "Next action", value: "SMS confirmation sent" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/10">
                      <span className="text-sm text-slate-400">{item.label}</span>
                      <span className="text-right text-sm font-medium text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: MessageSquare,
                  title: "Human-like call handling",
                  desc: "Handles pauses, interruptions, objections, follow-up questions, and multi-turn conversations without losing context.",
                  points: ["Context memory", "Intent detection", "Smart transfers"],
                },
                {
                  icon: BarChart3,
                  title: "Outcome analytics",
                  desc: "Track call volume, sentiment, conversions, missed opportunities, and team handoffs from one clean dashboard.",
                  points: ["Live dashboards", "Transcripts", "ROI reports"],
                },
                {
                  icon: Code,
                  title: "CRM and workflow sync",
                  desc: "Push qualified leads, appointments, notes, tags, and summaries into the systems your team already uses.",
                  points: ["HubSpot", "Salesforce", "Custom APIs"],
                },
                {
                  icon: Shield,
                  title: "Secure by design",
                  desc: "Keep business conversations protected with role-based access, encrypted data flows, and auditable activity history.",
                  points: ["Encryption", "Access control", "Audit logs"],
                },
                {
                  icon: PhoneCall,
                  title: "Appointment automation",
                  desc: "Book, confirm, reschedule, and follow up without manual back-and-forth or lost calendar context.",
                  points: ["Calendar sync", "Reminders", "No-show reduction"],
                },
                {
                  icon: Users,
                  title: "Clean human handoff",
                  desc: "Escalate urgent or high-value conversations with the summary, caller details, and recommended next step included.",
                  points: ["Priority routing", "Call summaries", "Team alerts"],
                },
              ].map((feature) => (
                <div key={feature.title} className="group rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-lg hover:shadow-slate-200/70">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-orange-600 ring-1 ring-slate-200 transition-all group-hover:bg-orange-600 group-hover:text-white group-hover:ring-orange-600">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{feature.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {feature.points.map((point) => (
                      <span key={point} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-slate-50/50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">


        </div>
        
        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full mb-6">
              <Star className="w-4 h-4 text-orange-600 fill-orange-600" />
              <span className="text-slate-600 font-medium text-sm tracking-wide uppercase">Client Success Stories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              <span className="text-slate-900">Trusted by Leading</span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                Businesses Worldwide
              </span>
            </h2>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              {
                quote: "DigitalBot transformed our customer service. We now handle 3x more calls with better satisfaction scores.",
                author: "Sarah Chen",
                role: "VP of Operations",
                company: "TechFlow Inc.",
                rating: 5
              },
              {
                quote: "The AI voice quality is incredible. Our customers often can't tell they're speaking with an AI assistant.",
                author: "Michael Rodriguez",
                role: "Customer Success Director",
                company: "GlobalHealth",
                rating: 5
              },
              {
                quote: "Setup was seamless and the ROI was visible within the first month. Best investment we've made.",
                author: "Emily Watson",
                role: "CEO",
                company: "Innovate Solutions",
                rating: 5
              },
              {
                quote: "24/7 availability without hiring night shifts. Our response time dropped from hours to seconds.",
                author: "James Park",
                role: "Operations Manager",
                company: "Swift Retail",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="flex-shrink-0 w-[350px] snap-center">
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-slate-200/60 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-2 h-full">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                    "{testimonial.quote}"
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.author}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Partners Section */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] overflow-hidden border-y border-slate-200/60">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-slate-400 font-medium text-sm uppercase tracking-wider mb-2">Seamless Integrations</p>
            <h3 className="text-2xl font-semibold text-slate-900">Works with your favorite tools</h3>
          </div>
          
          {/* Scrolling logos */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            <div className="flex gap-12 animate-marquee">
              {['Salesforce', 'HubSpot', 'Zendesk', 'Slack', 'Microsoft Teams', 'Zoom', 'Google', 'Twilio', 'Salesforce', 'HubSpot', 'Zendesk', 'Slack'].map((brand, idx) => (
                <div key={idx} className="flex-shrink-0 px-8 py-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-orange-200 hover:bg-slate-100 transition-all">
                  <span className="text-slate-600 font-semibold text-lg whitespace-nowrap">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern Timeline */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-50 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-slate-100/20 to-slate-100/20 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10 max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full mb-6">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-slate-600 font-medium text-sm tracking-wide uppercase">Simple Setup Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              <span className="text-slate-900">Get Started in</span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                Three Easy Steps
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Transform your business communication with AI voice technology. Our streamlined process gets you up and running in <span className="font-semibold text-orange-600">less than 2 weeks</span>.
            </p>
          </div>

          {/* Timeline Cards */}
          <div className="relative">
            {/* Connecting Line - Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-orange-300 to-orange-500 -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
              {[
                {
                  step: "01",
                  title: "Consultation & Setup",
                  description: "We analyze your business needs and configure your AI voice assistant with custom workflows, integrations, and brand personality.",
                  icon: Phone,
                  duration: "Day 1-3",
                  features: ["Business analysis", "Workflow design", "Voice customization"]
                },
                {
                  step: "02",
                  title: "Training & Integration",
                  description: "Our team trains your AI on your specific use cases and seamlessly integrates with your existing CRM, phone system, and tools.",
                  icon: Code,
                  duration: "Day 4-7",
                  features: ["AI training", "CRM integration", "Testing & QA"]
                },
                {
                  step: "03",
                  title: "Launch & Optimize",
                  description: "Go live with 24/7 AI voice support and continuously improve performance with real-time analytics and ongoing optimization.",
                  icon: Zap,
                  duration: "Day 8+",
                  features: ["Go live", "Performance monitoring", "Continuous improvement"]
                },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Card */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl shadow-slate-100/50 border border-slate-200/60 hover:shadow-2xl hover:border-orange-200 transition-all duration-500 hover:-translate-y-3 h-full">
                    {/* Step Number - Floating Circle */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 lg:relative lg:top-0 lg:left-0 lg:translate-x-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-semibold text-xl shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-4 border-white">
                        {item.step}
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="flex justify-between items-center mt-4 lg:mt-0 mb-4">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-full border border-orange-100">
                        {item.duration}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                        <item.icon className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-5">
                      {item.description}
                    </p>
                    
                    {/* Features List */}
                    <div className="space-y-2">
                      {item.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
                            <Check className="w-3 h-3 text-orange-600" />
                          </div>
                          <span className="text-sm text-slate-500">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Arrow Connector - Mobile */}
                  {idx < 2 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-orange-600 rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Ready to Get Started?</p>
                  <p className="text-sm text-slate-500">Book a free consultation with our team</p>
                </div>
              </div>
              <Link href="/contact#contact-form">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 shadow-sm transition-all">
                  Schedule Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean Modern Design */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50 relative overflow-hidden" role="region" aria-labelledby="faq-section">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">

          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-50 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-slate-100/30 to-slate-100/30 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-full mb-6">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span className="text-slate-600 font-medium text-sm tracking-wide uppercase">Got Questions?</span>
            </div>
            <h2 id="faq-section" className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-6">
              <span className="text-slate-900">Frequently Asked</span>
              <br />
              <span className="bg-gradient-to-r from-orange-700 via-orange-600 to-orange-500 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Everything you need to know about our <span className="font-semibold text-orange-600">AI Voice Assistant Services</span>
            </p>
          </div>
          
          {/* FAQ Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "What AI voice assistant services do you offer?",
                answer: "We offer comprehensive AI voice solutions including AI call centers, customer support automation, sales agents, virtual receptionists, voice bots, and enterprise voice automation software. Each service is customizable to your business needs.",
                icon: Bot
              },
              {
                question: "How quickly can I implement AI voice services?",
                answer: "Most businesses launch their AI voice assistant within 5-10 days. We handle setup, CRM integration, conversation training, and testing with hands-on support throughout.",
                icon: Zap
              },
              {
                question: "Which industries benefit from AI voice assistants?",
                answer: "AI voice assistants transform healthcare, real estate, hospitality, e-commerce, financial services, and technology sectors. Any business with customer communication needs benefits from 24/7 automation.",
                icon: Globe
              },
              {
                question: "Can AI voice services integrate with my existing systems?",
                answer: "Yes! Our platform integrates with popular CRMs (Salesforce, HubSpot, Zoho), phone systems, help desk software, scheduling tools, and custom APIs for seamless data synchronization.",
                icon: Code
              },
              {
                question: "What ROI can I expect from AI voice automation?",
                answer: "Businesses typically see 40-60% cost reduction, 85% faster response times, and 45% higher conversion rates. ROI is usually visible within 30-60 days of implementation.",
                icon: BarChart3
              },
              {
                question: "Is AI voice technology secure and compliant?",
                answer: "Absolutely. Our platform is SOC 2 and HIPAA compliant with end-to-end encryption, data privacy controls, GDPR compliance, and comprehensive audit trails.",
                icon: Shield
              },
              {
                question: "How does AI handle multiple languages?",
                answer: "Our AI voice assistants support 60+ languages with natural accents and context-aware translations. The system automatically detects the caller's language and responds fluently.",
                icon: Globe
              },
              {
                question: "What support do you provide after launch?",
                answer: "We provide 24/7 technical support, regular performance optimization, conversation training updates, analytics reviews, and dedicated account management.",
                icon: Headphones
              },
              {
                question: "Can I customize the AI voice and personality?",
                answer: "Yes! Customize voice tone, personality, speaking style, and conversation flow to match your brand. Choose from multiple voice options and train on your specific terminology.",
                icon: Users
              },
              {
                question: "Do I need technical expertise to use AI voice services?",
                answer: "Not at all! Our platform features a no-code visual builder for creating conversations. We handle all technical setup, integration, and maintenance.",
                icon: Code
              },
              {
                question: "How scalable are AI voice assistant services?",
                answer: "Infinitely scalable! Our cloud infrastructure handles unlimited concurrent calls without quality degradation, from 10 to 10,000+ calls daily.",
                icon: Zap
              },
              {
                question: "What analytics and reporting do you provide?",
                answer: "Our real-time dashboard shows call volume, conversation outcomes, customer sentiment, response times, conversion rates, and ROI metrics with exportable reports.",
                icon: BarChart3
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                    <faq.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-orange-500 mb-1 block">FAQ {String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                
                {/* Answer */}
                <p className="text-slate-500 text-sm leading-relaxed pl-14">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Still have questions?</p>
                  <p className="text-sm text-slate-500">Our team is here to help you</p>
                </div>
              </div>
              <Link href="/contact#contact-form">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-6 shadow-sm transition-all">
                  Contact Support
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

        </>
      )}

      {/* CTA Section - Redesigned */}
      <section className="relative overflow-hidden bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="container relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2">
                <Zap className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-700">Launch your AI voice team</span>
              </div>

              <h2 className="mt-7 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Ready to transform your business communication?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Start with one high-value workflow and let DigitalBot answer calls, qualify leads, schedule follow-ups, and sync every outcome back to your team.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/contact#contact-form">
                  <Button className="h-12 rounded-lg bg-orange-500 px-6 text-base font-semibold text-white shadow-lg shadow-orange-950/40 hover:bg-orange-600">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="h-12 rounded-lg border-slate-300 bg-white px-6 text-base font-semibold text-slate-700 hover:bg-slate-50">
                    View Pricing
                  </Button>
                </Link>
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Check, text: "No credit card required" },
                  { icon: Shield, text: "Secure by design" },
                  { icon: Headphones, text: "Hands-on launch support" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium leading-5 text-slate-600">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Launch plan</p>
                      <p className="text-xs text-slate-400">From first call to live automation</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-300">Ready</span>
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    { icon: PhoneCall, title: "Map your calls", text: "Lead, support, booking, or collections flow" },
                    { icon: MessageSquare, title: "Train the agent", text: "Scripts, FAQs, tone, and escalation rules" },
                    { icon: BarChart3, title: "Measure outcomes", text: "Calls, conversions, sentiment, and ROI" },
                  ].map((step, idx) => (
                    <div key={step.title} className="flex gap-3 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-orange-300">0{idx + 1}</span>
                          <p className="text-sm font-semibold text-white">{step.title}</p>
                        </div>
                        <p className="mt-1 text-sm text-slate-400">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { value: "500+", label: "Customers" },
                  { value: "10M+", label: "Calls" },
                  { value: "4.9/5", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                    <p className="text-xl font-semibold text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data - Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Voice Assistant Services",
            "description": "Comprehensive AI voice assistant services including AI call center, customer support, sales agents, and virtual receptionists. Trusted by 500+ businesses across 25+ countries.",
            "provider": {
              "@type": "Organization",
              "name": "DigitalBot.ai",
              "url": "https://digitalbot.ai",
              "logo": "https://digitalbot.ai/images/logos/logo.svg",
              "foundingDate": "2024",
              "description": "Leading AI voice assistant platform serving 500+ businesses",
            },
            "serviceType": "AI Voice Assistant Services",
            "areaServed": {
              "@type": "GeoShape",
              "name": "Global - 25+ Countries",
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Voice Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Call Center",
                    "description": "24/7 automated call handling with intelligent routing and real-time analytics",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Customer Support",
                    "description": "Instant, personalized customer service that resolves issues 24/7",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Sales Agent",
                    "description": "Intelligent sales conversations that qualify leads and book appointments",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Virtual Receptionist",
                    "description": "Professional call answering and appointment scheduling 24/7",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Voice Bot",
                    "description": "Custom voice bots for specific business workflows",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Voice Automation Software",
                    "description": "Enterprise-grade voice automation platform",
                  },
                },
              ],
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500",
            },
          }),
        }}
      />

      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What AI voice assistant services do you offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer comprehensive AI voice solutions including AI call centers, customer support automation, sales agents, virtual receptionists, voice bots, and enterprise voice automation software. Each service is customizable to your business needs and integrates seamlessly with your existing systems."
                }
              },
              {
                "@type": "Question",
                "name": "How quickly can I implement AI voice services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most businesses launch their AI voice assistant within 5-10 days. We handle setup, CRM integration, conversation training, and testing. Our team provides hands-on support to ensure smooth deployment and immediate value delivery."
                }
              },
              {
                "@type": "Question",
                "name": "Which industries benefit from AI voice assistants?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI voice assistants transform healthcare, real estate, hospitality, e-commerce, financial services, and technology sectors. Any business with customer communication needs benefits from 24/7 availability, instant responses, and scalable automation without hiring additional staff."
                }
              },
              {
                "@type": "Question",
                "name": "Can AI voice services integrate with my existing systems?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Our AI voice platform integrates with popular CRMs (Salesforce, HubSpot, Zoho), phone systems, help desk software, scheduling tools, and custom APIs. We ensure seamless data flow and real-time synchronization with your tech stack."
                }
              },
              {
                "@type": "Question",
                "name": "What ROI can I expect from AI voice automation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Businesses typically see 40-60% cost reduction, 85% faster response times, and 45% higher conversion rates. AI voice services deliver ROI within 30-60 days by eliminating staffing costs, reducing missed calls, and providing 24/7 availability without overtime or benefits."
                }
              },
              {
                "@type": "Question",
                "name": "Is AI voice technology secure and compliant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Our platform is SOC 2 and HIPAA compliant with end-to-end encryption, data privacy controls, GDPR compliance, and comprehensive audit trails. All conversations are encrypted and stored securely with role-based access controls."
                }
              },
              {
                "@type": "Question",
                "name": "How does AI handle multiple languages?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI voice assistants support 60+ languages with natural accents and context-aware translations. The system automatically detects the caller's language and responds fluently, making it perfect for global businesses serving diverse customer bases."
                }
              },
              {
                "@type": "Question",
                "name": "What support do you provide after launch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide 24/7 technical support, regular performance optimization, conversation training updates, analytics reviews, and dedicated account management. Our team monitors your AI continuously and makes improvements based on real conversation data."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize the AI voice and personality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can customize voice tone, personality, speaking style, and conversation flow to match your brand. Choose from multiple voice options, adjust response speeds, and train the AI on your specific terminology and brand guidelines."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need technical expertise to use AI voice services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not at all! Our platform features a no-code visual builder for creating and managing conversations. We handle all technical setup, integration, and maintenance. You simply define your business rules and we make the AI work for you."
                }
              },
              {
                "@type": "Question",
                "name": "How scalable are AI voice assistant services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Infinitely scalable! Our cloud infrastructure handles unlimited concurrent calls without quality degradation. Whether you receive 10 calls or 10,000 calls daily, the AI maintains consistent performance with no additional setup or hiring required."
                }
              },
              {
                "@type": "Question",
                "name": "What analytics and reporting do you provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our real-time dashboard shows call volume, conversation outcomes, customer sentiment, response times, conversion rates, and ROI metrics. Access detailed transcripts, identify trends, and export custom reports to track performance against your business KPIs."
                }
              }
            ]
          }),
        }}
      />
    </main>
  );
}









