import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, ChevronRight, LineChart, Target, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const caseStudies = [
  {
    company: "Healthcare Clinic Network",
    result: "63% fewer missed appointments",
    summary: "AI voice reminders and rescheduling flows helped the team reduce no-shows while keeping staff focused on patient care.",
    metrics: ["24/7 call handling", "Automated reminders", "Live handoff for urgent cases"],
  },
  {
    company: "Real Estate Sales Team",
    result: "2.4x faster lead response",
    summary: "Inbound property inquiries were answered instantly, qualified by budget and location, then routed to the right advisor.",
    metrics: ["Instant lead capture", "Site visit scheduling", "CRM-ready summaries"],
  },
  {
    company: "E-commerce Support Desk",
    result: "38% lower support load",
    summary: "Order updates, delivery questions, and return requests were automated across voice and WhatsApp support journeys.",
    metrics: ["Order status automation", "Return guidance", "Escalation rules"],
  },
]

const proofPoints = [
  { value: "40%", label: "average support effort reduced" },
  { value: "3x", label: "faster first response" },
  { value: "24/7", label: "customer availability" },
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/70 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <nav className="mb-8 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                <li><Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">Home</Link></li>
                <li><ChevronRight className="h-4 w-4 text-slate-300" /></li>
                <li className="font-medium text-orange-600">Case Studies</li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                  <BarChart3 className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Customer outcomes</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                  Case studies that show AI automation in action.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  See how teams use DigitalBot.AI to respond faster, qualify more leads, reduce manual work, and improve customer experience.
                </p>
                <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                  {proofPoints.map((point) => (
                    <div key={point.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="text-2xl font-semibold text-orange-600">{point.value}</div>
                      <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{point.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
                <Image src="/images/casestudies.png" alt="Customer success case study dashboard" fill priority className="object-cover p-3" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Results by use case</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Real operational improvements.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                These examples highlight common workflows our customers automate across calls, WhatsApp, and team follow-up.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <article key={study.company} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{study.company}</p>
                  <h3 className="mt-3 text-2xl font-semibold leading-tight text-slate-950">{study.result}</h3>
                  <p className="mt-4 flex-1 text-sm leading-6 text-slate-600">{study.summary}</p>
                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                    {study.metrics.map((metric) => (
                      <div key={metric} className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Target className="h-4 w-4 text-orange-600" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-8 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:p-10">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/30">
                  <LineChart className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Want a case study for your own workflow?</h2>
              </div>
              <div>
                <p className="text-base leading-8 text-slate-300">
                  Share your current process and we will map the automation opportunity, expected impact, and the first workflow to launch.
                </p>
                <Link href="/contact#contact-form" className="mt-6 inline-flex items-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                  Discuss your use case
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
