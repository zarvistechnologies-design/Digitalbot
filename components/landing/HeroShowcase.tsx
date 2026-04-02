import {
    ArrowRight,
    BarChart3,
    Bot,
    CheckCircle2,
    Globe2,
    Mic,
    PhoneCall,
    ShieldCheck,
    Sparkles,
    Zap,
} from "lucide-react"
import Link from "next/link"

const trustItems = [
  "Launch in 48 hours",
  "50+ languages",
  "CRM + calendar sync",
]

const outcomeCards = [
  {
    icon: PhoneCall,
    title: "Never miss a call",
    text: "AI answers instantly, qualifies the caller, and takes the next best action.",
  },
  {
    icon: BarChart3,
    title: "See revenue impact",
    text: "Track bookings, lead quality, resolution rate, and call trends in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-ready",
    text: "Built for teams that need reliability, compliance, and clean handoff to humans.",
  },
]

const conversation = [
  { speaker: "Customer", text: "Hi, I need to book a dental appointment for tomorrow.", tone: "left" },
  { speaker: "DigitalBot", text: "Absolutely — I found 11:30 AM and 3:00 PM. Which works best?", tone: "right" },
  { speaker: "Customer", text: "11:30 AM works.", tone: "left" },
  { speaker: "DigitalBot", text: "Done. You’ll get a WhatsApp and SMS confirmation in a few seconds.", tone: "right" },
]

export default function HeroShowcase() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-16 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-sky-50" />
      <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Premium AI voice operations for modern teams
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              Turn every incoming call into a
              <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                premium customer experience
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              DigitalBot gives your business a 24/7 AI receptionist that sounds natural,
              books appointments, qualifies leads, and updates your systems in real time.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Book a live demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/85 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
              >
                See pricing
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              {trustItems.map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">99.9%</p>
                <p className="text-sm text-slate-500">Platform uptime</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">&lt; 1 sec</p>
                <p className="text-sm text-slate-500">Average response time</p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-bold text-slate-950">3x</p>
                <p className="text-sm text-slate-500">More qualified leads</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-orange-500/20 to-blue-500/15 blur-2xl" />
            <div className="relative overflow-hidden rounded-[28px] border border-orange-100/70 bg-white/90 p-4 shadow-2xl shadow-orange-500/10 backdrop-blur sm:p-5">
              <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">DigitalBot Voice Agent</p>
                    <p className="text-xs text-slate-500">Live call orchestration</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Live now
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white shadow-inner">
                <div className="mb-4 flex items-center justify-between text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Bot className="h-4 w-4 text-orange-400" />
                    Real-time conversation preview
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-orange-400" />
                    742ms avg
                  </span>
                </div>

                <div className="space-y-3">
                  {conversation.map((item, index) => (
                    <div
                      key={`${item.speaker}-${index}`}
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                        item.tone === "right"
                          ? "ml-auto bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                          : "bg-white/10 text-slate-100"
                      }`}
                    >
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        {item.speaker}
                      </p>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-medium text-slate-500">Outcome</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">Appointment booked</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-medium text-slate-500">Follow-up</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">WhatsApp + SMS sent</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-3">
                  <p className="text-xs font-medium text-slate-500">Language</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-900">
                    <Globe2 className="h-4 w-4 text-orange-500" />
                    English / Hindi
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {outcomeCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-orange-100/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
