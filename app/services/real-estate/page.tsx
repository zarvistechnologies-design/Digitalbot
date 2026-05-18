"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Headphones,
  Home,
  Pause,
  PhoneCall,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const audioSamples = [
  {
    title: "Voice sample 1",
    src: "/audio/lead-generation-sample.mp3",
  },
  {
    title: "Voice sample 2",
    src: "/audio/virtual-receptionist-sample.mp3",
  },
]

const trustedSegments = [
  {
    name: "Builders",
    className: "text-emerald-700",
  },
  {
    name: "Brokerage Teams",
    className: "text-blue-700",
  },
  {
    name: "Channel Partners",
    className: "text-slate-900",
  },
  {
    name: "Site Visit Teams",
    className: "text-slate-500",
  },
  {
    name: "Property Portals",
    className: "text-indigo-700",
  },
  {
    name: "CRM Pipelines",
    className: "text-rose-600",
  },
  {
    name: "Sales Managers",
    className: "text-red-600",
  },
  {
    name: "Weekend Leads",
    className: "text-cyan-700",
  },
]

const integrations = [
  {
    icon: PhoneCall,
    title: "Phone calls",
    text: "Capture inbound calls, missed calls, and follow-up conversations.",
  },
  {
    icon: Headphones,
    title: "WhatsApp handoff",
    text: "Send buyer summaries and next steps to your sales team.",
  },
  {
    icon: CalendarCheck,
    title: "Calendar slots",
    text: "Collect preferred visit days and times before your team confirms.",
  },
  {
    icon: Users,
    title: "CRM updates",
    text: "Push budget, location, intent, and lead status into your pipeline.",
  },
  {
    icon: Building2,
    title: "Project inventory",
    text: "Answer approved questions about towers, plans, amenities, and availability.",
  },
  {
    icon: ShieldCheck,
    title: "Rules and handoff",
    text: "Escalate urgent or high-intent buyers with full call context.",
  },
]

const processSteps = [
  {
    num: 1,
    title: "Lead comes in",
    desc: "Buyer calls from a portal, ad, board, or missed-call callback.",
    timing: "Instant",
  },
  {
    num: 2,
    title: "AI qualifies",
    desc: "Budget, location, property type, timeline, and intent are captured.",
    timing: "During call",
  },
  {
    num: 3,
    title: "Visit intent captured",
    desc: "The agent asks preferred day and time for the site visit.",
    timing: "Same flow",
  },
  {
    num: 4,
    title: "Team gets summary",
    desc: "Sales team receives a clean handoff with buyer context and next step.",
    timing: "After call",
  },
]

const features = [
  {
    icon: PhoneCall,
    title: "Answers property calls",
    text: "Handles price, location, amenities, possession, and availability questions instantly.",
  },
  {
    icon: Users,
    title: "Qualifies real buyers",
    text: "Captures budget, preferred area, property type, buying timeline, and contact details.",
  },
  {
    icon: CalendarCheck,
    title: "Books site visits",
    text: "Confirms visit slots and gives your sales team a clean summary before they call.",
  },
  {
    icon: PhoneCall,
    title: "Handles missed calls",
    text: "Responds when buyers call after hours, during weekends, or when your team is busy.",
  },
  {
    icon: ShieldCheck,
    title: "Sends lead summaries",
    text: "Gives your sales team buyer intent, requirements, budget, and next step after every call.",
  },
  {
    icon: Headphones,
    title: "Follows up old leads",
    text: "Re-engages earlier inquiries and moves interested buyers back toward a site visit.",
  },
]

const featureAccents = [
  {
    badge: "bg-yellow-200 text-slate-950",
    active: "border-yellow-200 bg-yellow-100 shadow-yellow-100",
  },
  {
    badge: "bg-rose-200 text-slate-950",
    active: "border-rose-200 bg-rose-100 shadow-rose-100",
  },
  {
    badge: "bg-sky-200 text-slate-950",
    active: "border-sky-200 bg-sky-100 shadow-sky-100",
  },
  {
    badge: "bg-orange-200 text-slate-950",
    active: "border-orange-200 bg-orange-100 shadow-orange-100",
  },
  {
    badge: "bg-emerald-200 text-slate-950",
    active: "border-emerald-200 bg-emerald-100 shadow-emerald-100",
  },
  {
    badge: "bg-indigo-200 text-slate-950",
    active: "border-indigo-200 bg-indigo-100 shadow-indigo-100",
  },
]

const leadHighlights = [
  {
    title: "Buyer details",
    text: "Name, budget, preferred location, property type, and buying timeline.",
  },
  {
    title: "Visit readiness",
    text: "Captures preferred day, time, and urgency before your team calls.",
  },
  {
    title: "Sales handoff",
    text: "Sends a clean summary so the next conversation starts with context.",
  },
]

const faqs = [
  {
    category: "Setup",
    question: "Can it answer project questions?",
    answer: "Yes. It can answer approved questions about price, location, amenities, floor plans, availability, and visit process.",
  },
  {
    category: "Qualification",
    question: "Can it qualify buyers before my team calls?",
    answer: "Yes. It collects budget, location, property type, urgency, and contact details so your team speaks to serious leads.",
  },
  {
    category: "Site visits",
    question: "Can it book site visits?",
    answer: "Yes. It can confirm preferred timing and send the visit request or summary to your team.",
  },
  {
    category: "Handoff",
    question: "Can calls be transferred to my sales team?",
    answer: "Yes. High-intent or urgent calls can be handed off with the buyer context already captured.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DigitalBot Real Estate Voice Agent",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI voice agent for real estate teams that answers property calls, qualifies buyers, captures requirements, and helps book site visits.",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    priceCurrency: "INR",
  },
}

const waveformBars = [34, 58, 42, 72, 48, 84, 36, 66, 52, 76, 44, 62, 88, 46, 70, 38, 58, 80]

function AudioWavePlayer({
  src,
  title,
  isPlaying,
  onToggle,
  onEnded,
}: {
  src: string
  title: string
  isPlaying: boolean
  onToggle: () => void
  onEnded: () => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || isPlaying) return
    audio.pause()
  }, [isPlaying])

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!isPlaying) {
      onToggle()
      audio.play()
    } else {
      audio.pause()
      onEnded()
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
      <audio ref={audioRef} preload="none" src={src} onEnded={onEnded} onPause={() => isPlaying && onEnded()} />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleAudio}
          aria-label={`${isPlaying ? "Pause" : "Play"} ${title}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600"
        >
          {isPlaying ? <Pause className="h-3 w-3 fill-current" /> : <Play className="ml-0.5 h-3 w-3 fill-current" />}
        </button>

        <div className="flex h-6 flex-1 items-center gap-0.5 overflow-hidden rounded-md bg-slate-50 px-1.5">
          {waveformBars.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className={`flex-1 rounded-full bg-orange-400/80 ${isPlaying ? "re-wave" : ""}`}
              style={{
                height: `${height}%`,
                animationDelay: `${index * 0.06}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function RealEstatePage() {
  const [activeSample, setActiveSample] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState(1)

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <style jsx global>{`
        @keyframes realEstateFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes realEstateWave {
          0%, 100% { transform: scaleY(0.35); opacity: 0.55; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes realEstateMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes realEstateRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .re-float { animation: realEstateFloat 5s ease-in-out infinite; }
        .re-wave { animation: realEstateWave 1.1s ease-in-out infinite; transform-origin: bottom; }
        .re-marquee { animation: realEstateMarquee 22s linear infinite; }
        .re-marquee:hover { animation-play-state: paused; }
        .re-rise { animation: realEstateRise 0.7s ease-out both; }
        .re-logo-fade {
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }
        @media (prefers-reduced-motion: reduce) {
          .re-float,
          .re-wave,
          .re-marquee,
          .re-rise {
            animation: none;
          }
        }
      `}</style>

      <main className="min-h-screen overflow-hidden bg-white text-slate-950">
        <section className="relative bg-white pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-0 sm:px-6 lg:min-h-[640px] lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:pb-6 lg:pt-0">
            <div className="re-rise">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-700">
                <Home className="h-4 w-4" />
                Real Estate Voice Agent
              </div>

              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[64px]">
                Turn property calls into <span className="bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">qualified site visits.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                AI answers property inquiries, qualifies buyers, captures budget and location, then helps your team book visits without chasing every lead manually.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/25"
                >
                  Book Demo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 max-w-sm">
                <p className="mb-1.5 text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Voice samples</p>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  {audioSamples.map((sample) => (
                    <AudioWavePlayer
                      key={sample.title}
                      src={sample.src}
                      title={sample.title}
                      isPlaying={activeSample === sample.title}
                      onToggle={() => setActiveSample(sample.title)}
                      onEnded={() => setActiveSample((current) => (current === sample.title ? null : current))}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-9 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ["3 sec", "first reply"],
                  ["24/7", "call cover"],
                  ["60%", "less follow-up"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
                    <p className="text-base font-bold text-orange-600">{value}</p>
                    <p className="mt-1 text-base leading-7 text-slate-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[360px] sm:min-h-[500px] lg:-mr-20 lg:-mt-16 lg:min-h-[680px]">
              <div className="relative z-10 flex min-h-[360px] items-center justify-center bg-white sm:min-h-[500px] lg:min-h-[680px] lg:justify-end">
                <Image
                  src="/images/estate.png"
                  alt="Businesswoman using a phone voice assistant"
                  width={1220}
                  height={930}
                  priority
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="h-[380px] w-full max-w-[1120px] object-contain object-center sm:h-[540px] lg:h-[min(760px,82vh)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fafbff] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xl font-semibold leading-8 text-slate-700 sm:text-2xl">
              Built for the people and systems that move property leads
            </p>
            <div className="re-logo-fade mt-8 overflow-hidden">
              <div className="re-marquee flex min-w-max items-center gap-14 pr-14">
                {[...trustedSegments, ...trustedSegments].map((segment, index) => (
                  <div key={`${segment.name}-${index}`} className="flex min-h-12 min-w-48 items-center justify-center">
                    <span className={`text-xl font-extrabold leading-none tracking-normal sm:text-2xl ${segment.className}`}>
                      {segment.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7fbff] py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className="relative min-h-[380px] overflow-hidden">
              <Image
                src="/images/voice_realestate_4.png"
                alt="Real estate sales agent speaking with a buyer on a call"
                width={900}
                height={620}
                sizes="(min-width: 1024px) 43vw, 100vw"
                className="h-[360px] w-full object-cover object-center opacity-95 [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] sm:h-[430px] lg:[mask-image:radial-gradient(ellipse_at_center,#000_58%,rgba(0,0,0,0.75)_72%,transparent_100%)]"
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Lead intelligence</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Know which property leads deserve your team&apos;s next call.
              </h2>
              <span className="mt-3 block h-2 w-40 bg-yellow-300" />
              <div className="mt-5 space-y-5 text-lg leading-8 text-slate-600">
                <p>
                  The agent listens like a sales coordinator, qualifies the buyer, and keeps every important detail ready for your closing team.
                </p>
                <ul className="space-y-4">
                  {[
                    "Answers approved questions about price, location, amenities, possession, and availability.",
                    "Separates serious buyers from casual inquiries using budget, requirement, and timeline checks.",
                    "Creates a clean lead summary your sales team can act on immediately.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {leadHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                    <h3 className="text-base font-bold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-[17px] leading-7 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-orange-50/25 to-white pb-4 pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">What it does</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                One voice agent for your property leads.
              </h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {features.map((item, index) => {
                const isActive = activeFeature === index
                const accent = featureAccents[index % featureAccents.length]

                return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActiveFeature(index)}
                  className={`min-h-[250px] rounded-3xl border p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                    isActive
                      ? `${accent.active} shadow-xl`
                      : "border-slate-200 bg-white hover:border-orange-200 hover:shadow-orange-100"
                  }`}
                  aria-pressed={isActive}
                >
                  <div className="flex items-center gap-4">
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold ${accent.badge}`}>
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  </div>
                  <p className="mt-7 text-[17px] leading-7 text-slate-600">{item.text}</p>
                </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfcff] py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[0.98fr_1.02fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Integrations</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Connect calls, portals, visits, and sales handoffs in one flow.
                </h2>
                <span className="mt-3 block h-2 w-32 bg-yellow-300" />
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  Use the agent with your existing call process, CRM, WhatsApp updates, calendar workflow, and project inventory.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                  <PhoneCall className="h-4 w-4" />
                  One voice layer for every property inquiry
                </div>

                <div className="mt-8 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                  {integrations.map((item) => (
                    <div key={item.title} className="flex gap-3">
                      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                        <item.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                        <p className="mt-1 text-[17px] leading-7 text-slate-600">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[480px] overflow-hidden">
                <Image
                  src="/images/voice_realestate_3.png"
                  alt="Real estate assistant managing buyer calls from a laptop"
                  width={760}
                  height={520}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="h-[430px] w-full scale-105 object-cover object-center opacity-95 mix-blend-multiply [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] sm:h-[520px] lg:[mask-image:radial-gradient(ellipse_at_center,#000_56%,rgba(0,0,0,0.75)_74%,transparent_94%)]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-[#f4f4f6] to-white pb-6 pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                From property inquiry to sales handoff in one clean flow.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">
                A simple real-estate workflow like your WhatsApp bot page, but focused on calls, buyer qualification, and site visits.
              </p>
            </div>

            <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="relative -my-6 flex items-center justify-center lg:-my-10">
                <Image
                  src="/images/voice_realestate_2.png?v=20260518"
                  alt="Voice agent assistant handling property inquiries with an AI bot"
                  width={1024}
                  height={1024}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="h-[360px] w-full max-w-[620px] object-contain object-center [mask-image:linear-gradient(to_right,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_16%,#000_84%,transparent_100%)] [mask-composite:intersect] [mask-repeat:no-repeat] [mask-size:100%_100%] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_16%,#000_84%,transparent_100%)] [-webkit-mask-composite:source-in] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:100%_100%] lg:h-[500px] lg:max-w-[760px]"
                />
              </div>

              <div className="space-y-5">
                {processSteps.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-base font-bold text-orange-600">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-1 text-[17px] leading-7 text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
