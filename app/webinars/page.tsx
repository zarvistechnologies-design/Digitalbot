import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, CalendarDays, ChevronRight, Clock, Mic2, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const webinars = [
  {
    title: "Turning missed calls into qualified leads",
    date: "On demand",
    duration: "45 min",
    summary: "A practical session on using AI voice agents to answer, qualify, and route inbound calls.",
  },
  {
    title: "WhatsApp automation for service businesses",
    date: "On demand",
    duration: "38 min",
    summary: "Learn how to automate follow-ups, reminders, FAQs, and customer updates without losing a personal tone.",
  },
  {
    title: "Designing handoffs between AI and your team",
    date: "On demand",
    duration: "41 min",
    summary: "See when to escalate, what data to pass to agents, and how to keep customer context intact.",
  },
]

const outcomes = ["Live workflow breakdowns", "Operational checklists", "Q&A style examples"]

export default function WebinarsPage() {
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
                <li className="font-medium text-orange-600">Webinars</li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                  <Mic2 className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Expert sessions</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                  Webinars for smarter AI customer operations.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Watch focused sessions on AI voice automation, WhatsApp workflows, lead handling, customer support, and team handoffs.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {outcomes.map((outcome) => (
                    <span key={outcome} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                      {outcome}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
                <Image src="/images/webinar.png" alt="Team webinar about AI voice and WhatsApp automation" fill priority className="object-cover p-3" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Watch library</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Featured webinar sessions.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Compact sessions built around real customer communication problems and the workflows that solve them.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {webinars.map((webinar) => (
                <article key={webinar.title} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                  <div className="mb-5 flex items-center justify-between gap-4 text-xs font-medium text-slate-500">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5 text-orange-600" />{webinar.date}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-orange-600" />{webinar.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-slate-950">{webinar.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{webinar.summary}</p>
                  <Link href="/contact#contact-form" className="mt-6 inline-flex items-center text-sm font-semibold text-orange-600">
                    Request access
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/30">
                  <Users className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Bring the session to your team.</h2>
              </div>
              <p className="text-base leading-8 text-slate-300">
                We can run a private walkthrough for your sales, support, or operations team and map the best automation opportunities for your business.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
