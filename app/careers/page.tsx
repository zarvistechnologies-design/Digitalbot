"use client";

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

export default function Careers() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] text-slate-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        {/* Subtle blur orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-50/30 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative z-10 container mx-auto">
          <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-8">
            <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">
              We&apos;re Hiring
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Careers at{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              DigitalBot.ai
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl mx-auto">
            Join our team and help shape the future of{" "}
            <span className="font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
              AI-powered business automation
            </span>
            . We value innovation, collaboration, and growth.
          </p>

          <a
            href="#positions"
            className="inline-flex items-center bg-slate-900 text-white font-medium rounded-lg px-6 py-3 hover:bg-slate-800 transition-all shadow-sm"
          >
            View Open Positions
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Culture & Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#fafbff]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-4">
              <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">
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
                className="text-center bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
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
      <section id="positions" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbff] to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-full px-4 py-2 mb-4">
              <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">
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
                className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        {position.department}
                      </span>
                      <div className="flex items-center text-sm text-slate-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/contact#contact-form"
                    className="inline-flex items-center bg-slate-900 text-white font-medium rounded-lg px-5 py-2.5 hover:bg-slate-800 transition-all shadow-sm text-sm shrink-0"
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
                        <ArrowRight className="h-3 w-3 mr-2 text-slate-400 shrink-0" />
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
      <section className="py-24 px-6 bg-gradient-to-b from-white to-[#f0f0ff] text-center">
        <div className="container mx-auto">
          <div className="glass-card bg-indigo-50/30 border border-indigo-200/40 rounded-3xl p-12">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Don&apos;t See the Right Role?
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-2xl mx-auto">
              We&apos;re always looking for passionate, curious minds. Share your
              resume, and we&apos;ll reach out when the right opportunity comes along.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center bg-slate-900 text-white font-medium rounded-lg px-6 py-3 hover:bg-slate-800 transition-all shadow-sm"
              >
                Send Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center text-slate-600 font-medium rounded-lg border border-slate-200 px-6 py-3 hover:border-slate-300 hover:bg-slate-50 transition-all"
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





