import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | DigitalBot.ai",
  description:
    "Review the DigitalBot.ai Terms of Service for using our website, services, applications, Meta integrations, and business automation platform.",
};

const companyName = "DigitalBot.ai";
const supportEmail = "Hello@digitalbot.ai";
const websiteUrl = "https://www.digitalbot.ai";

const termsSections = [
  {
    title: "1. Acceptance and Eligibility",
    paragraphs: [
      "By using this Service, you represent that you are at least 13 years old, or the minimum legal age in your country, and are legally capable of entering into a binding contract.",
    ],
  },
  {
    title: "2. User Accounts and Security",
    paragraphs: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to notify us immediately of any unauthorized use of your account.",
      "We reserve the right to terminate or suspend accounts that violate these Terms.",
    ],
  },
  {
    title: "3. Permitted and Prohibited Use",
    paragraphs: ["You agree to use the Service only for lawful purposes."],
    bullets: [
      "Do not engage in any automated data scraping, harvesting, or extraction from our Service.",
      "Do not use the Service to transmit malicious code, malware, or spam.",
      "Do not attempt to reverse-engineer, decompile, or disrupt the infrastructure of our Service.",
    ],
  },
  {
    title: "4. Data Handling and Third-Party Platforms",
    paragraphs: [
      "Our Service interacts with third-party platforms, including Meta Platforms, Inc. services such as Facebook, Instagram, and WhatsApp.",
    ],
    highlights: [
      {
        label: "No Selling of Data",
        text: "We do not sell, license, lease, or rent any user data collected through our Service or via third-party APIs to any third parties.",
      },
      {
        label: "Meta Compliance",
        text: "Your use of features integrated with Meta services is also subject to Meta's Terms of Service and Privacy Policy.",
      },
    ],
  },
  {
    title: "5. Intellectual Property",
    paragraphs: [
      `All content, trademarks, logos, graphics, and software code used in the Service are the exclusive property of ${companyName} or its licensors.`,
      "You are granted a limited, non-exclusive, non-transferable license to access the Service for personal or internal business use.",
    ],
  },
  {
    title: "6. Termination of Service",
    paragraphs: [
      "We reserve the right to modify, suspend, or terminate your access to the Service at any time, without prior notice, for any conduct that we believe violates applicable laws or these Terms.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    paragraphs: [
      `To the maximum extent permitted by law, ${companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of or inability to use the Service.`,
    ],
  },
  {
    title: "8. Governing Law",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with the laws applicable to our business location, without regard to conflict of law principles, unless a separate written agreement states otherwise.",
    ],
  },
  {
    title: "9. Contact Information",
    paragraphs: [
      "If you have any questions about these Terms, please contact us using the details below.",
    ],
    contact: true,
  },
];

const overviewItems = [
  "Use the Service only for lawful purposes.",
  "Keep your account credentials secure.",
  "Do not scrape, reverse-engineer, disrupt, or misuse the Service.",
  "Meta-connected features are also subject to Meta's policies.",
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-950">
      <Header />

      <section className="bg-gradient-to-br from-white via-slate-50 to-orange-50 px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <nav className="mb-8 flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-500 transition-colors hover:text-orange-600"
                >
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </li>
              <li className="font-medium text-orange-600">Terms</li>
            </ol>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_0.82fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-4 py-2 shadow-sm">
                <Scale className="h-4 w-4 text-orange-600" />
                <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                  Terms of Service
                </span>
              </div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Terms of Service for {companyName}.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                Welcome to {companyName} (&quot;we,&quot; &quot;our,&quot; or
                &quot;us&quot;). By accessing or using our website, services,
                and applications (collectively, the &quot;Service&quot;), you
                agree to be bound by these Terms of Service
                (&quot;Terms&quot;). If you do not agree to these Terms, please
                do not use our Service.
              </p>
              <p className="mt-4 text-sm font-medium text-slate-500">
                Last Updated: June 2, 2026
              </p>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Key Terms
                  </h2>
                  <p className="text-sm text-slate-500">
                    A quick summary of your responsibilities.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {overviewItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
                    <span className="text-sm font-medium leading-6 text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Agreement Details
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
              Terms that govern use of the Service.
            </h2>
          </div>

          <ol className="space-y-6">
            {termsSections.map((section) => (
              <li
                key={section.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold leading-8 text-slate-950">
                    {section.title}
                  </h3>
                </div>

                <div className="space-y-4 text-base leading-8 text-slate-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}

                  {section.bullets ? (
                    <ul className="space-y-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-1.5 h-5 w-5 shrink-0 text-orange-600" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.highlights ? (
                    <div className="grid gap-3">
                      {section.highlights.map((highlight) => (
                        <div
                          key={highlight.label}
                          className="rounded-lg border border-orange-100 bg-orange-50 p-4"
                        >
                          <p className="font-semibold text-orange-700">
                            {highlight.label}
                          </p>
                          <p className="mt-1 text-slate-700">
                            {highlight.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {section.contact ? (
                    <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
                      <a
                        href={`mailto:${supportEmail}`}
                        className="inline-flex items-center gap-3 rounded-lg bg-white p-4 font-medium text-slate-700 shadow-sm transition-colors hover:text-orange-600"
                      >
                        <Mail className="h-5 w-5 text-orange-600" />
                        {supportEmail}
                      </a>
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-lg bg-white p-4 font-medium text-slate-700 shadow-sm transition-colors hover:text-orange-600"
                      >
                        <Scale className="h-5 w-5 text-orange-600" />
                        {websiteUrl}
                      </a>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  );
}
