import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    Clock3,
    Globe2,
    Sparkles
} from "lucide-react"
import Link from "next/link"

const pillars = [
  {
    icon: Clock3,
    title: "24/7 response without burnout",
    text: "Your team sleeps. Your AI does not. Every inquiry gets an instant, polished reply day or night.",
    bullets: ["No missed calls", "No hold queues", "Always-on coverage"],
  },
  {
    icon: Globe2,
    title: "A global front desk in one system",
    text: "Handle multilingual voice, WhatsApp, and follow-ups from one shared customer workflow.",
    bullets: ["50+ languages", "Voice + chat sync", "One unified dashboard"],
  },
  {
    icon: BarChart3,
    title: "Built to prove ROI clearly",
    text: "Measure bookings, conversions, missed-call recovery, and support quality in real time.",
    bullets: ["Live reporting", "Conversion visibility", "Team performance insights"],
  },
]

const comparison = [
  ["Availability", "Business hours only", "24/7/365"],
  ["Concurrent calls", "One at a time", "Unlimited"],
  ["Follow-ups", "Manual", "Automatic"],
  ["Reporting", "Basic", "Real-time analytics"],
]

export function WhySwitch() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_0_28%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_0_30%)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-200">
            <Sparkles className="h-4 w-4" />
            What makes this feel premium
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Designed to feel more like a <span className="text-orange-400">high-converting product</span> than a generic agency page
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The strongest landing pages don’t just list features — they show confidence, clarity, and proof.
            This section does exactly that.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/10 backdrop-blur"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{pillar.text}</p>
              <div className="mt-4 space-y-2">
                {pillar.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-orange-400" />
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/10 backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-300">Before vs after</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">From reactive support to automated growth</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                This is the message your visitors should feel immediately: DigitalBot is a serious product,
                not just another chatbot template.
              </p>
              <Link
                href="/contact#contact-form"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-orange-50"
              >
                Upgrade the experience
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 border-b border-white/10 pb-3 text-sm font-semibold text-slate-200">
                <span>Category</span>
                <span>Traditional setup</span>
                <span>DigitalBot</span>
              </div>
              <div className="space-y-3 pt-3">
                {comparison.map(([label, oldValue, newValue]) => (
                  <div key={label} className="grid grid-cols-3 gap-3 rounded-2xl bg-white/5 px-3 py-3 text-sm">
                    <span className="font-medium text-white">{label}</span>
                    <span className="text-slate-300">{oldValue}</span>
                    <span className="font-semibold text-orange-300">{newValue}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
