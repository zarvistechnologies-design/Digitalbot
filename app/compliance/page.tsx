import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, CheckCircle2, ChevronRight, ClipboardCheck, FileCheck2, Scale, ShieldCheck, UserCheck } from "lucide-react"
import Link from "next/link"

const complianceAreas = [
  {
    icon: FileCheck2,
    title: "Policy alignment",
    text: "Workflows are designed to support platform policies for WhatsApp, Meta, voice outreach, and customer communication.",
  },
  {
    icon: UserCheck,
    title: "Consent-aware messaging",
    text: "Automations can be structured around opt-ins, customer preferences, and clear communication boundaries.",
  },
  {
    icon: ClipboardCheck,
    title: "Record readiness",
    text: "Conversation summaries, timestamps, and workflow actions help teams maintain audit-friendly operational records.",
  },
  {
    icon: ShieldCheck,
    title: "Data handling",
    text: "Customer data handling is guided by retention, access, security, and deletion request considerations.",
  },
]

const checklist = [
  "WhatsApp Business API policy-aware workflow design",
  "Meta/Facebook integration permissions reviewed before launch",
  "Clear customer opt-in and opt-out handling where applicable",
  "Internal access controls for customer and conversation data",
  "Retention and deletion process planning for sensitive records",
  "Human escalation paths for regulated or high-risk conversations",
]

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />

      <main>
        <section className="bg-gradient-to-br from-slate-50 via-white to-orange-50/70 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <nav className="mb-8 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                <li><Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">Home</Link></li>
                <li><ChevronRight className="h-4 w-4 text-slate-300" /></li>
                <li className="font-medium text-orange-600">Compliance</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                <Scale className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Compliance support</span>
              </div>
              <h1 className="text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Compliance-minded automation for customer conversations.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                DigitalBot.AI helps teams build AI voice and messaging workflows with clear consent, policy awareness, secure handling, and human review where it matters.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Compliance areas</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Built around responsible operations.</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {complianceAreas.map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Launch checklist</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Review before going live.</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  These checks help teams prepare AI communication flows for practical business use and customer trust.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span className="text-sm font-medium leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/70 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Compliance review</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Preparing for a regulated workflow?</h2>
                </div>
                <div>
                  <p className="text-base leading-8 text-slate-300">
                    We can help map consent, data handling, escalation rules, and integration requirements for your customer communication flow.
                  </p>
                  <Link href="/contact#contact-form" className="mt-6 inline-flex items-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                    Discuss requirements
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
