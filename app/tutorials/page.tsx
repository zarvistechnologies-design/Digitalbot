import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Clock, PlayCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const tutorials = [
  {
    title: "Launch your first AI voice workflow",
    time: "35 min",
    level: "Beginner",
    summary: "Plan intents, upload knowledge, set call rules, and test your first customer-ready voice assistant.",
  },
  {
    title: "Build a lead qualification script",
    time: "28 min",
    level: "Beginner",
    summary: "Create a natural sales flow that captures needs, budget, urgency, and handoff details.",
  },
  {
    title: "Connect appointments and follow-ups",
    time: "42 min",
    level: "Intermediate",
    summary: "Use booking logic, reminders, and confirmation messages to reduce manual scheduling work.",
  },
  {
    title: "Improve answers with better knowledge",
    time: "31 min",
    level: "Intermediate",
    summary: "Structure FAQs, policies, and product details so your bot answers clearly and consistently.",
  },
]

const steps = ["Choose one workflow", "Prepare customer questions", "Configure the assistant", "Test and refine"]

export default function TutorialsPage() {
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
                <li className="font-medium text-orange-600">Tutorials</li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Practical learning</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                  Tutorials that help teams build automation with confidence.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Clear, step-by-step lessons for setting up AI voice agents, WhatsApp automation, lead flows, and customer support journeys.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {steps.map((step, index) => (
                    <span key={step} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                      {index + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative h-[360px] overflow-hidden rounded-[28px] border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
                <Image src="/images/tutorial.png" alt="AI automation tutorial workspace" fill priority className="object-cover p-3" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Learning library</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Start with these guided lessons.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Each tutorial is designed for operators and founders who want a working automation flow, not just theory.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {tutorials.map((tutorial) => (
                <article key={tutorial.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                      <PlayCircle className="h-3.5 w-3.5" />
                      {tutorial.level}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {tutorial.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold leading-snug text-slate-950">{tutorial.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{tutorial.summary}</p>
                  <Link href="/contact#contact-form" className="mt-6 inline-flex items-center text-sm font-semibold text-orange-600">
                    Get setup help
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">What you will leave with</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">A workflow your team can actually use.</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {["Conversation map", "Knowledge checklist", "Testing routine", "Launch metrics"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
