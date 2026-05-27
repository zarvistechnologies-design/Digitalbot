import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const openPositions = [
  {
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Lead the development of our next-generation conversational AI platform.",
    requirements: ["5+ years in AI/ML", "Python expertise", "NLP experience"],
  },
  {
    title: "Product Manager - AI",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive product strategy for our AI chatbot platform and customer experience.",
    requirements: [
      "3+ years product management",
      "AI/ML background",
      "Customer-focused",
    ],
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Help our enterprise customers maximize value from our AI chatbot solutions.",
    requirements: [
      "Customer success experience",
      "Technical aptitude",
      "Communication skills",
    ],
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build beautiful, responsive interfaces for our chatbot management platform.",
    requirements: ["React/Next.js expertise", "TypeScript", "UI/UX sensibility"],
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description:
      "Comprehensive health, dental, and vision insurance plus wellness programs.",
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description:
      "Annual learning budget, conference attendance, and skill development opportunities.",
  },
  {
    icon: Users,
    title: "Work-Life Balance",
    description: "Flexible hours, remote culture, and unlimited paid time off.",
  },
  {
    icon: Trophy,
    title: "Equity & Rewards",
    description:
      "Competitive pay, equity options, and performance-based bonuses.",
  },
];

const careerStats = [
  { value: "Remote", label: "friendly collaboration" },
  { value: "4", label: "open roles right now" },
  { value: "24/7", label: "products with real impact" },
];

export default function Careers() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white px-4 pb-20 pt-32 text-center sm:px-6 lg:px-8">
        <div className="relative z-10 container mx-auto">
          <div className="mb-8 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
              We&apos;re Hiring
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Careers at{" "}
            <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              DigitalBot.ai
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
            Join our team and help shape the future of{" "}
            <span className="font-semibold text-orange-600">
              AI-powered business automation
            </span>
            . We value innovation, collaboration, and growth.
          </p>

          <a
            href="#positions"
            className="inline-flex items-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-xl shadow-orange-900/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
          >
            View Open Positions
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>

          <div className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {careerStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 text-left shadow-sm"
              >
                <div className="text-2xl font-semibold text-orange-600">
                  {stat.value}
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Benefits Section */}
      <section className="bg-gradient-to-b from-white via-orange-50/60 to-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 mb-4 shadow-sm">
              <span className="text-xs font-semibold tracking-wide text-orange-700 uppercase">
                Benefits
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Why Work With Us?
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              We believe in empowering talent and building products that truly make
              a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group text-center rounded-2xl border border-orange-100 bg-white p-6 shadow-sm shadow-orange-100/70 transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 shadow-lg shadow-orange-200 transition-transform group-hover:scale-105">
                  <benefit.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="bg-gradient-to-br from-slate-50 via-white to-orange-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-orange-200 bg-white px-4 py-2 mb-4 shadow-sm">
              <span className="text-xs font-semibold tracking-wide text-orange-700 uppercase">
                Open Roles
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
              Explore roles that fit your passion and expertise.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-100">
                        {position.department}
                      </span>
                      <div className="flex items-center text-sm text-slate-500">
                        <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                        {position.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-1 text-orange-500" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/contact#contact-form"
                    className="inline-flex shrink-0 items-center rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange-600"
                  >
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <p className="text-slate-500 leading-relaxed mb-4">
                  {position.description}
                </p>
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Key Requirements:
                  </h4>
                  <ul className="text-sm text-slate-500 space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-center">
                        <ArrowRight className="h-3 w-3 mr-2 text-orange-500 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white px-6 py-24 text-center">
        <div className="container mx-auto">
          <div className="rounded-3xl border border-orange-200 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 p-8 text-white shadow-2xl shadow-slate-200 sm:p-12">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Don&apos;t See the Right Role?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for passionate, curious minds. Share your
              resume, and we&apos;ll reach out when the right opportunity comes along.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-950/30 transition-all hover:bg-orange-600"
              >
                Send Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 font-medium text-white transition-all hover:border-orange-200 hover:bg-white/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}





