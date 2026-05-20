"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Headphones,
  Pause,
  PhoneCall,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

type Card = {
  title: string
  text: string
}

type ProcessStep = Card & {
  num: number
}

type Stat = {
  value: string
  label: string
}

export type IndustryVoiceAgentConfig = {
  badge: string
  heroTitle: string
  heroAccent: string
  heroDescription: string
  heroImage: string
  heroImageAlt: string
  heroFrameClassName?: string
  heroVisualClassName?: string
  heroImageClassName?: string
  trustedTitle: string
  trustedSegments: string[]
  stats: Stat[]
  intelligenceEyebrow: string
  intelligenceTitle: string
  intelligenceBody: string
  intelligenceBullets: string[]
  intelligenceImage: string
  intelligenceImageAlt: string
  intelligenceImageFrameClassName?: string
  intelligenceImageClassName?: string
  highlights: Card[]
  featuresTitle: string
  features: Card[]
  integrationsTitle: string
  integrationsBody: string
  integrationsBadge: string
  integrationsImage: string
  integrationsImageAlt: string
  integrationsImageFrameClassName?: string
  integrationsImageClassName?: string
  integrations: Card[]
  processTitle: string
  processBody: string
  processImage: string
  processImageAlt: string
  processImageClassName?: string
  processSteps: ProcessStep[]
}

const audioSamples = [
  { title: "Voice sample 1", src: "/audio/lead-generation-sample.mp3" },
  { title: "Voice sample 2", src: "/audio/virtual-receptionist-sample.mp3" },
]

const trustedSegmentColors = [
  "text-orange-600",
  "text-sky-600",
  "text-emerald-600",
  "text-violet-600",
  "text-rose-600",
  "text-amber-600",
]

const waveformBars = [34, 58, 42, 72, 48, 84, 36, 66, 52, 76, 44, 62, 88, 46, 70, 38, 58, 80]

const featureAccents = [
  { badge: "bg-yellow-200 text-slate-950", active: "border-yellow-200 bg-yellow-100 shadow-yellow-100" },
  { badge: "bg-rose-200 text-slate-950", active: "border-rose-200 bg-rose-100 shadow-rose-100" },
  { badge: "bg-sky-200 text-slate-950", active: "border-sky-200 bg-sky-100 shadow-sky-100" },
  { badge: "bg-orange-200 text-slate-950", active: "border-orange-200 bg-orange-100 shadow-orange-100" },
  { badge: "bg-emerald-200 text-slate-950", active: "border-emerald-200 bg-emerald-100 shadow-emerald-100" },
  { badge: "bg-indigo-200 text-slate-950", active: "border-indigo-200 bg-indigo-100 shadow-indigo-100" },
]

const integrationIcons = [PhoneCall, Headphones, CalendarCheck, Users, Building2, ShieldCheck]

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
              className={`flex-1 rounded-full bg-orange-400/80 ${isPlaying ? "industry-wave" : ""}`}
              style={{ height: `${height}%`, animationDelay: `${index * 0.06}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function IndustryVoiceAgentPage({ config }: { config: IndustryVoiceAgentConfig }) {
  const [activeSample, setActiveSample] = useState<string | null>(null)
  const [activeFeature, setActiveFeature] = useState(1)

  return (
    <>
      <Header />
      <style jsx global>{`
        @keyframes industryWave {
          0%, 100% { transform: scaleY(0.35); opacity: 0.55; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes industryMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes industryRise {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .industry-wave { animation: industryWave 1.1s ease-in-out infinite; transform-origin: bottom; }
        .industry-marquee { animation: industryMarquee 22s linear infinite; }
        .industry-marquee:hover { animation-play-state: paused; }
        .industry-rise { animation: industryRise 0.7s ease-out both; }
        .industry-logo-fade {
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
        }
      `}</style>

      <main className="min-h-screen overflow-hidden bg-white text-slate-950">
        <section className="relative bg-white pt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-0 sm:px-6 lg:min-h-[640px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pb-6 lg:pt-0">
            <div className="industry-rise">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-extrabold text-orange-700">
                <PhoneCall className="h-4 w-4" />
                {config.badge}
              </div>

              <h1 className="max-w-4xl font-serif text-3xl font-bold leading-tight tracking-normal text-slate-950 sm:text-4xl lg:text-[52px]">
                {config.heroTitle} <span className="text-slate-950">{config.heroAccent}</span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{config.heroDescription}</p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5 hover:bg-orange-600"
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
                {config.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-100">
                    <p className="text-base font-bold text-orange-600">{stat.value}</p>
                    <p className="mt-1 text-base leading-7 text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={`relative min-h-[360px] sm:min-h-[500px] lg:min-h-[680px] ${config.heroFrameClassName ?? ""}`}>
              <div className={`relative z-10 flex min-h-[360px] items-center justify-center bg-white sm:min-h-[500px] lg:min-h-[680px] lg:justify-end ${config.heroVisualClassName ?? ""}`}>
                <Image
                  src={config.heroImage}
                  alt={config.heroImageAlt}
                  width={1220}
                  height={930}
                  priority
                  sizes="(min-width: 1024px) 54vw, 100vw"
                  className={`h-auto w-full max-w-[980px] object-contain object-center ${config.heroImageClassName ?? ""}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fafbff] py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xl font-semibold leading-8 text-slate-700 sm:text-2xl">{config.trustedTitle}</p>
            <div className="industry-logo-fade mt-8 overflow-hidden">
              <div className="industry-marquee flex min-w-max items-center gap-14 pr-14">
                {[...config.trustedSegments, ...config.trustedSegments].map((segment, index) => (
                  <div key={`${segment}-${index}`} className="flex min-h-12 min-w-48 items-center justify-center">
                    <span className={`text-xl font-extrabold leading-none tracking-normal sm:text-2xl ${trustedSegmentColors[index % trustedSegmentColors.length]}`}>{segment}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f7fbff] py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div className={`relative overflow-hidden ${config.intelligenceImageFrameClassName ?? ""}`}>
              <Image
                src={config.intelligenceImage}
                alt={config.intelligenceImageAlt}
                width={900}
                height={620}
                sizes="(min-width: 1024px) 43vw, 100vw"
                className={`h-auto w-full object-cover object-center opacity-95 [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] lg:[mask-image:radial-gradient(ellipse_at_center,#000_58%,rgba(0,0,0,0.75)_72%,transparent_100%)] ${config.intelligenceImageClassName ?? ""}`}
              />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">{config.intelligenceEyebrow}</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{config.intelligenceTitle}</h2>
              <span className="mt-3 block h-2 w-40 bg-yellow-300" />
              <div className="mt-5 space-y-5 text-lg leading-8 text-slate-600">
                <p>{config.intelligenceBody}</p>
                <ul className="space-y-4">
                  {config.intelligenceBullets.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {config.highlights.map((item) => (
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
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{config.featuresTitle}</h2>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {config.features.map((item, index) => {
                const isActive = activeFeature === index
                const accent = featureAccents[index % featureAccents.length]

                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveFeature(index)}
                    className={`min-h-[250px] rounded-3xl border p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                      isActive ? `${accent.active} shadow-xl` : "border-slate-200 bg-white hover:border-orange-200 hover:shadow-orange-100"
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
                <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{config.integrationsTitle}</h2>
                <span className="mt-3 block h-2 w-32 bg-yellow-300" />
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{config.integrationsBody}</p>
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700">
                  <PhoneCall className="h-4 w-4" />
                  {config.integrationsBadge}
                </div>

                <div className="mt-8 grid gap-x-7 gap-y-5 sm:grid-cols-2">
                  {config.integrations.map((item, index) => {
                    const Icon = integrationIcons[index % integrationIcons.length]
                    return (
                      <div key={item.title} className="flex gap-3">
                        <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                          <p className="mt-1 text-[17px] leading-7 text-slate-600">{item.text}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={`relative overflow-hidden ${config.integrationsImageFrameClassName ?? ""}`}>
                <Image
                  src={config.integrationsImage}
                  alt={config.integrationsImageAlt}
                  width={760}
                  height={520}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className={`h-auto w-full object-cover object-center opacity-95 mix-blend-multiply [mask-image:linear-gradient(90deg,transparent_0%,#000_10%,#000_90%,transparent_100%)] [mask-size:100%_100%] [mask-repeat:no-repeat] lg:[mask-image:radial-gradient(ellipse_at_center,#000_56%,rgba(0,0,0,0.75)_74%,transparent_94%)] ${config.integrationsImageClassName ?? ""}`}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-white via-[#f4f4f6] to-white pb-6 pt-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">How it works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{config.processTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">{config.processBody}</p>
            </div>

            <div className="mt-8 grid items-center gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="relative -my-6 flex items-center justify-center lg:-my-10">
                <Image
                  src={config.processImage}
                  alt={config.processImageAlt}
                  width={1024}
                  height={1024}
                  priority
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className={`h-auto w-full max-w-[650px] object-contain object-center ${config.processImageClassName ?? ""}`}
                />
              </div>

              <div className="space-y-5">
                {config.processSteps.map((step) => (
                  <div key={step.title} className="flex gap-4">
                    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-base font-bold text-orange-600">
                      {step.num}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                      <p className="mt-1 text-[17px] leading-7 text-slate-600">{step.text}</p>
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
