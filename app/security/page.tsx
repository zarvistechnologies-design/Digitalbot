import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, CheckCircle2, ChevronRight, Database, KeyRound, LockKeyhole, ServerCog, ShieldCheck } from "lucide-react"
import Link from "next/link"

const securityLayers = [
  {
    icon: LockKeyhole,
    title: "Data protection",
    text: "Customer data is protected in transit and at rest using modern encryption practices and controlled access.",
  },
  {
    icon: KeyRound,
    title: "Access control",
    text: "Role-based access, least-privilege permissions, and account safeguards help limit exposure across teams.",
  },
  {
    icon: Database,
    title: "Secure storage",
    text: "Operational data, conversations, and configuration records are handled with structured retention controls.",
  },
  {
    icon: ServerCog,
    title: "Infrastructure monitoring",
    text: "Platform activity is monitored for reliability, suspicious behavior, and service-level performance.",
  },
]

const practices = [
  "Encrypted communication across customer-facing workflows",
  "Restricted internal access to sensitive service data",
  "Audit-friendly records for critical operational actions",
  "Regular review of platform permissions and integrations",
  "Secure handoff design between AI agents and human teams",
  "Clear incident response and customer communication process",
]

export default function SecurityPage() {
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
                <li className="font-medium text-orange-600">Security</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">Platform security</span>
              </div>
              <h1 className="text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Security built for AI customer communication.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                DigitalBot.AI is designed to help teams automate calls, messages, and customer workflows while protecting sensitive business and customer information.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Security layers</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">How we protect the platform.</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {securityLayers.map((item) => {
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
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Operational safeguards</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950">Practical controls for real workflows.</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  Security is applied across setup, integrations, conversations, reporting, and team handoffs.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {practices.map((practice) => (
                  <div key={practice} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span className="text-sm font-medium leading-6 text-slate-700">{practice}</span>
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
                  <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Security review</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Need security details for your team?</h2>
                </div>
                <div>
                  <p className="text-base leading-8 text-slate-300">
                    Share your requirements and we will help your team review the controls, integrations, and deployment approach.
                  </p>
                  <Link href="/contact#contact-form" className="mt-6 inline-flex items-center rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600">
                    Talk to us
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
