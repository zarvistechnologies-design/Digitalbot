import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | DigitalBot.ai",
  description:
    "Review the DigitalBot.ai terms and conditions for using our AI voice agents, chatbot automation, WhatsApp workflows, integrations, and business communication services.",
};

const termsSections = [
  {
    title: "1. Agreement and Acceptance",
    text: "These Terms and Conditions form a legal agreement between DigitalBot.ai, referred to as DigitalBot.ai, we, us, or our, and the person or business accessing our website, platform, APIs, dashboard, AI voice agents, chatbots, WhatsApp automation, integrations, or related services. By accessing or using DigitalBot.ai, you agree to be bound by these terms from the date you first use the services. If you use the services for a company or other legal entity, you confirm that you have authority to accept these terms on its behalf.",
  },
  {
    title: "2. DigitalBot.ai Services",
    text: "DigitalBot.ai provides business automation services, including AI voice agents, AI call handling, chatbot automation, WhatsApp and messaging workflows, CRM and calendar integrations, dashboards, analytics, lead management, appointment automation, support automation, custom APIs, webhooks, implementation support, and related software services. We may improve, modify, suspend, or discontinue any part of the services as our platform, integrations, and technology evolve.",
  },
  {
    title: "3. Business Use and User Warranties",
    text: "You represent that you are using DigitalBot.ai for lawful business purposes, that you are legally able to enter into this agreement, and that all information you provide to us is accurate and current. You must not use DigitalBot.ai for personal abuse, fraud, spam, deceptive marketing, unlawful gambling, hate speech, harassment, sale of illegal goods, violation of sanctions, exploitation, unauthorized surveillance, or any activity that violates applicable law or third-party platform policies.",
  },
  {
    title: "4. Limited License to Use the Platform",
    text: "Subject to your compliance with these terms and any applicable subscription, order form, or written agreement, DigitalBot.ai grants you a limited, revocable, non-exclusive, non-transferable right to access and use the platform only for your internal business communication and automation purposes. You may not sublicense, rent, lease, resell, copy, reverse engineer, decompile, modify, or use DigitalBot.ai to build a competing product or service.",
  },
  {
    title: "5. Accounts, Administrators, and Security",
    text: "You are responsible for all activity under your account, including activity by employees, contractors, administrators, agents, and users you invite to the platform. You must keep login credentials secure, apply reasonable security controls, and notify DigitalBot.ai immediately if you suspect unauthorized access, credential misuse, data exposure, or any breach involving your account.",
  },
  {
    title: "6. Subscriptions, Fees, and Billing",
    text: "Access to some services may require a paid plan, usage package, custom agreement, or implementation fee. Pricing, plan features, limits, taxes, renewal terms, and additional charges may be shown on our website, checkout page, proposal, invoice, or order form. Unless required by law or agreed in writing, paid subscriptions and completed service fees are non-refundable. You are responsible for third-party charges, including telephony, WhatsApp, messaging, CRM, payment, cloud, and API provider fees where applicable.",
  },
  {
    title: "7. Customer Data and Media Content",
    text: "You retain ownership of customer data, business data, call recordings, transcripts, prompts, messages, contacts, lead details, documents, images, files, CRM records, calendar information, and other content you or your users submit to DigitalBot.ai. You grant DigitalBot.ai a limited right to host, store, process, transmit, analyze, and display this data as necessary to provide, secure, support, maintain, and improve the services.",
  },
  {
    title: "8. Consent, Opt-In, and Legal Compliance",
    text: "You are responsible for obtaining and maintaining all consents, permissions, notices, disclosures, and authorizations required before using DigitalBot.ai to call, message, record, transcribe, analyze, or process information about any person. This includes customer opt-ins, opt-outs, calling permissions, recording notices, data protection requirements, WhatsApp template and business messaging rules, and all laws that apply to your business and customers.",
  },
  {
    title: "9. Third-Party Platforms and Integrations",
    text: "DigitalBot.ai may connect with third-party platforms such as WhatsApp, Meta, telephony providers, CRMs, calendars, payment tools, email systems, analytics providers, AI model providers, hosting services, and other APIs. Your use of these integrations may be subject to additional third-party terms, fees, rate limits, policies, approvals, outages, and technical changes. DigitalBot.ai is not responsible for failures caused by third-party platforms outside our reasonable control.",
  },
  {
    title: "10. AI Features and Generated Output",
    text: "DigitalBot.ai services may generate call responses, chat replies, summaries, classifications, lead scores, recommendations, appointment actions, and other AI-generated output. AI output may be incomplete, inaccurate, duplicated, biased, or unsuitable for a specific purpose. You are responsible for reviewing and verifying AI output before relying on it, especially for healthcare, legal, financial, insurance, employment, housing, education, credit, regulated, emergency, or high-impact decisions.",
  },
  {
    title: "11. Prohibited AI and Automation Use",
    text: "You must not use DigitalBot.ai to mislead people into believing an AI interaction is human where disclosure is legally required, make automated decisions that produce legal or similarly significant effects without appropriate review, impersonate another person or business, generate harmful or unlawful content, scrape or harvest data unlawfully, bypass platform limits, or operate campaigns that violate consent, privacy, telemarketing, anti-spam, or messaging rules.",
  },
  {
    title: "12. Data Protection and Aggregated Data",
    text: "DigitalBot.ai will use reasonable measures to protect data processed through the services. We may use aggregated, de-identified, or statistical information derived from service usage to improve performance, reliability, security, analytics, and product functionality, provided such information does not identify a specific individual or customer. You are responsible for maintaining your own backups and records where required by your business or applicable law.",
  },
  {
    title: "13. Confidentiality",
    text: "Each party may receive confidential business, technical, product, security, pricing, customer, or operational information from the other. The receiving party must use reasonable care to protect confidential information and may use it only for purposes connected with providing or using the services, unless disclosure is required by law or authorized in writing.",
  },
  {
    title: "14. Intellectual Property Rights",
    text: "DigitalBot.ai, including our software, platform, website, dashboards, workflows, documentation, APIs, designs, models, prompts, templates, logos, trademarks, and related materials, is owned by DigitalBot.ai or its licensors. Feedback, suggestions, or improvement ideas you provide may be used by DigitalBot.ai without restriction or obligation to you.",
  },
  {
    title: "15. Service Availability and Disclaimers",
    text: "DigitalBot.ai is provided on an as-is and as-available basis. We use commercially reasonable efforts to provide reliable services, but we do not guarantee uninterrupted access, error-free operation, delivery of every call or message, compatibility with every browser or device, or continued availability of third-party integrations. Internet access, device configuration, customer data quality, and third-party platform behavior may affect results.",
  },
  {
    title: "16. Suspension, Removal, and Termination",
    text: "We may suspend or terminate access, remove content, limit usage, or block workflows if we reasonably believe there is non-payment, security risk, misuse, unlawful activity, third-party policy violation, excessive usage, harmful content, or breach of these terms. You may stop using the services at any time, subject to any active subscription, order form, invoice, usage commitment, or written agreement.",
  },
  {
    title: "17. Indemnity",
    text: "You agree to defend, indemnify, and hold DigitalBot.ai harmless from claims, losses, damages, penalties, costs, and expenses arising from your use of the services, your customer data or media content, your violation of law or third-party rights, your failure to obtain required consent, or your breach of these terms.",
  },
  {
    title: "18. Limitation of Liability",
    text: "To the maximum extent permitted by law, DigitalBot.ai will not be liable for indirect, incidental, consequential, special, punitive, exemplary, lost-profit, lost-revenue, business interruption, goodwill, data loss, or similar damages. DigitalBot.ai's total liability for any claim relating to the services will not exceed the amount paid by you to DigitalBot.ai for the affected service during the twelve months before the event giving rise to the claim, or USD 500, whichever is lower.",
  },
  {
    title: "19. Force Majeure",
    text: "Neither party will be responsible for delay or failure to perform obligations, except payment obligations, caused by events beyond reasonable control, including internet or telecom failures, cloud provider outages, labor disputes, natural disasters, war, terrorism, government action, pandemics, power failures, cyber incidents, or third-party platform disruptions.",
  },
  {
    title: "20. Changes to These Terms",
    text: "We may update these Terms and Conditions from time to time. When changes are material, we will take reasonable steps to notify users through the website, dashboard, email, or other appropriate channel. Continued use of DigitalBot.ai after the effective date of updated terms means you accept the revised terms.",
  },
  {
    title: "21. Governing Law and Dispute Resolution",
    text: "These terms will be governed by the laws applicable to DigitalBot.ai's business location, unless a separate written agreement states otherwise. Before starting formal proceedings, the parties agree to attempt in good faith to resolve disputes by contacting each other and discussing the issue. Any unresolved dispute will be handled according to the dispute process stated in the applicable order form or written agreement, or as otherwise required by applicable law.",
  },
  {
    title: "22. Contact",
    text: "Questions about these Terms and Conditions may be sent to DigitalBot.ai at Hello@digitalbot.ai. Notices related to privacy or data protection may also be submitted through our contact page or any dedicated privacy contact listed in our Privacy Policy.",
  },
];

const highlights = [
  "Use DigitalBot.ai only for lawful business communication and automation.",
  "Maintain consent, opt-ins, opt-outs, and recording notices where required.",
  "Review AI-generated calls, chats, summaries, and recommendations before relying on them.",
  "Follow WhatsApp, Meta, telephony, CRM, API, and other third-party platform policies.",
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <section className="bg-gradient-to-br from-slate-50 via-white to-orange-50/70 px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <nav className="mb-8 flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <li>
                <Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </li>
              <li className="font-medium text-orange-600">Terms</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                <Scale className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                  Terms and conditions
                </span>
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                Terms and Conditions for DigitalBot.ai.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                These terms explain the rules for using our AI voice agents, chatbot automation, WhatsApp workflows, integrations, dashboards, APIs, and business communication services.
              </p>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Last updated: May 29, 2026
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <ClipboardList className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">At a glance</h2>
                  <p className="text-sm text-slate-500">Key responsibilities when using the platform.</p>
                </div>
              </div>
              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span className="text-sm font-medium leading-6 text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Agreement details</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Terms that govern DigitalBot.ai platform use.
            </h2>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <ol className="space-y-8">
            {termsSections.map((section) => (
              <li key={section.title} className="border-b border-slate-100 pb-8 last:border-b-0 last:pb-0">
                <div className="mb-3 flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold leading-8 text-slate-950">{section.title}</h3>
                    <p className="mt-2 text-base leading-8 text-slate-600">{section.text}</p>
                  </div>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid gap-8 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-200/70 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:p-10">
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-wide text-orange-300">Questions about terms</p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Need help reviewing your workflow requirements?
              </h2>
            </div>
            <div>
              <p className="text-base leading-8 text-slate-300">
                Contact us if you need clarification about these terms, data handling, integrations, or requirements for AI voice and messaging workflows.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact#contact-form"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-600"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <a
                  href="mailto:Hello@digitalbot.ai"
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Hello@digitalbot.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
