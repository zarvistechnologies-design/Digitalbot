"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
    ArrowRight,
    Globe,
    Headphones,
    Mic,
    Phone,
    PhoneCall
} from "lucide-react"
import { useEffect, useRef, useState } from "react"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const transcript = [
  { from: "ai", text: "Thank you for calling! I'm Aria from ABC Realty. Are you looking to buy or rent?" },
  { from: "customer", text: "Looking to buy a 3BHK" },
  { from: "ai", text: "Wonderful! What's your budget range and preferred location?" },
  { from: "customer", text: "Around 80 lakhs, Pune" },
  { from: "ai", text: "Perfect — I have 3 properties matching exactly that. Can I schedule a site visit this weekend?" },
]

const voiceFeatures = [
  { icon: Mic, title: "Human-like Voice", desc: "Natural conversation, not robotic. Handles interruptions and follow-up questions seamlessly.", color: "from-orange-400 to-orange-600" },
  { icon: Globe, title: "Multi-language", desc: "Speaks English, Hindi and regional languages fluently. Your customers feel at home.", color: "from-orange-400 to-orange-500" },
  { icon: PhoneCall, title: "Never Misses a Call", desc: "Handles unlimited simultaneous calls 24/7. No more voicemail or busy signals.", color: "from-orange-400 to-orange-600" },
]

const useCases = [
  { title: "Inbound Call Handling", desc: "Answer every customer call instantly with AI" },
  { title: "Lead Qualification", desc: "Screen and qualify leads before passing to sales" },
  { title: "Appointment Reminders", desc: "Reduce no-shows with automated reminder calls" },
  { title: "Payment Reminders", desc: "Polite payment follow-ups that actually work" },
  { title: "Feedback Collection", desc: "Post-service feedback calls for quality improvement" },
]

const comparison = [
  { metric: "Cost per month", human: "₹25,000+", ai: "₹8,000", aiWins: true },
  { metric: "Working hours", human: "8-10 hrs/day", ai: "24/7", aiWins: true },
  { metric: "Simultaneous calls", human: "1 at a time", ai: "Unlimited", aiWins: true },
  { metric: "Languages", human: "1-2", ai: "5+", aiWins: true },
  { metric: "Training time", human: "2-4 weeks", ai: "5-7 days", aiWins: true },
  { metric: "Consistency", human: "Varies by mood", ai: "100% consistent", aiWins: true },
]

export default function VoiceAIAgentPage() {
  const [visibleLines, setVisibleLines] = useState(0)
const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= transcript.length) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900 min-h-screen overflow-hidden">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center bg-white">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, transparent 0%, transparent 70%)' }} />
          {/* Waveform Background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="w-[2px] bg-orange-400 rounded-full mx-[2px] animate-wave"
                style={{
                  height: `${20 + Math.random() * 80}px`,
                  animationDelay: `${i * 0.08}s`,
                  animationDuration: `${1 + Math.random() * 1.5}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-sm text-orange-500 font-medium">Voice AI Agent</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-black">
                AI That Speaks.<br />
                <span className="text-orange-500">Listens.</span><br />
                And Converts.
              </h1>

              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Your business gets a human-sounding AI voice agent that handles calls, qualifies leads and books appointments — in English and Hindi.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.location.href = "/contact"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  <Phone className="w-5 h-5 animate-wiggle" /> Call Our AI Now
                </button>
                <button
                  onClick={() => window.location.href = "/contact"}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 hover:border-gray-200 text-gray-900 font-semibold rounded-xl transition-all hover:bg-gray-50"
                >
                  Hear a Sample Call
                </button>
              </div>
            </div>

            {/* Right — iPhone with Call Screen */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">


                <div className="relative w-[280px] sm:w-[310px] animate-float">
                  <div className="bg-slate-900 rounded-[44px] border-[6px] border-slate-700 p-1 shadow-2xl">
                    <div className="mx-auto w-28 h-6 bg-slate-900 rounded-b-2xl relative z-10" />

                    <div className="bg-[#0a0e1a] rounded-[36px] overflow-hidden -mt-3">
                      {/* Status Bar */}
                      <div className="bg-[#0a0e1a] px-5 py-1.5 flex items-center justify-between">
                        <span className="text-white text-[11px] font-semibold">9:41</span>
                        <div className="flex items-center gap-1">
                          <span className="text-white text-[10px] font-semibold">5G</span>
                          <div className="flex items-end gap-[1px]">
                            <div className="w-[3px] h-[4px] bg-white rounded-[0.5px]" />
                            <div className="w-[3px] h-[6px] bg-white rounded-[0.5px]" />
                            <div className="w-[3px] h-[8px] bg-white rounded-[0.5px]" />
                            <div className="w-[3px] h-[10px] bg-white rounded-[0.5px]" />
                          </div>
                          <svg className="w-[18px] h-[10px] text-white ml-0.5" fill="currentColor" viewBox="0 0 24 14"><rect x="0" y="0" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/><rect x="21" y="4" width="3" height="6" rx="1" fill="currentColor"/><rect x="2" y="2" width="14" height="10" rx="1" fill="currentColor"/></svg>
                        </div>
                      </div>
                      {/* Call Header */}
                      <div className="bg-gradient-to-b from-orange-900/80 to-[#0a0e1a] px-4 pt-6 pb-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-orange-500/20 border-2 border-orange-400 flex items-center justify-center mx-auto mb-3">
                          <Mic className="w-8 h-8 text-orange-400" />
                        </div>
                        <p className="text-white font-semibold text-lg">AI Business Assistant</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                          <span className="text-orange-400 text-sm">Live AI Call</span>
                        </div>
                        {/* Waveform */}
                        <div className="flex items-center justify-center gap-[2px] h-8 mt-4">
                          {Array.from({ length: 20 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-[3px] bg-orange-400 rounded-full animate-wave"
                              style={{
                                height: `${8 + Math.random() * 20}px`,
                                animationDelay: `${i * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Live Transcript */}
                      <div className="px-3 py-3 space-y-2 h-[400px] overflow-y-auto">
                        <p className="text-[10px] text-slate-500 text-center mb-2">Live Transcript</p>
                        {transcript.slice(0, visibleLines).map((line, i) => (
                          <div key={i} className="animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <p className="text-[10px] text-slate-500 mb-0.5">{line.from === "ai" ? "🤖 AI Agent" : "👤 Customer"}</p>
                            <p className={`text-[12px] leading-relaxed ${line.from === "ai" ? "text-orange-300" : "text-white"}`}>
                              &ldquo;{line.text}&rdquo;
                            </p>
                          </div>
                        ))}
                        {visibleLines < transcript.length && (
                          <div className="flex items-center gap-1 mt-2">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </div>
                        )}
                      </div>

                      {/* Call Controls */}
                      <div className="bg-[#111827] px-6 py-4 flex items-center justify-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <Mic className="w-5 h-5 text-white" />
                        </div>
                        <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center">
                          <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                          <Headphones className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VOICE FEATURES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Voice AI That <span className="text-orange-500">Feels Human</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Not another IVR. A real conversational AI that handles complex discussions.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {voiceFeatures.map((f, i) => (
              <div key={i} className="group bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* USE CASES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Use Cases</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {useCases.map((u, i) => (
              <div key={i} className="min-w-[260px] snap-start bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-orange-500/30 transition-all flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{u.title}</h3>
                <p className="text-gray-600 text-sm">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto bg-white">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Human Agent vs <span className="text-orange-500">Voice AI Agent</span></h2>
          <p className="text-gray-600 text-center mb-12">See why businesses are switching to AI</p>

          <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 px-4 sm:px-6 py-4 text-sm font-semibold">
              <span className="text-gray-600">Metric</span>
              <span className="text-center text-orange-400">Human Agent</span>
              <span className="text-center text-orange-400">Voice AI</span>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className="grid grid-cols-3 px-4 sm:px-6 py-4 border-t border-gray-100 text-sm hover:bg-orange-500/5 transition-colors">
                <span className="text-gray-900 font-medium">{row.metric}</span>
                <span className="text-center text-slate-500">{row.human}</span>
                <span className="text-center text-orange-400 font-medium">{row.ai}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STATS */}
        <section className="py-16 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { end: 500, suffix: "+", label: "Agents Deployed" },
              { end: 98, suffix: "%", label: "Customer Satisfaction" },
              { end: 3, suffix: "s", label: "Response Time" },
              { end: 24, suffix: "/7", label: "Always Active" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-500">
                  <AnimatedCounter end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-white border border-gray-200 rounded-3xl p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to let AI handle your calls?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Book a free demo — hear exactly how your AI voice agent will sound.
            </p>
            <button
              onClick={() => window.location.href = "/contact"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
            >
              Get Free Strategy Call <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
      <Footer /><style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .animate-wave { animation: wave 1.2s ease-in-out infinite; }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
