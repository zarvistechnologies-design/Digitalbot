"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
    ArrowRight,
    BarChart3,
    Brain,
    Calendar,
    Zap
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

const chatMessages = [
  { from: "user", text: "Hi I'm interested in your service", time: "10:01" },
  { from: "bot", text: "Welcome! I'm Aria, your AI assistant 🤖 To help you better, what type of business do you run?", time: "10:01" },
  { from: "user", text: "I run a real estate agency", time: "10:02" },
  { from: "bot", text: "Perfect! We've helped 50+ real estate agencies automate lead follow-up. How many inquiries do you get daily?", time: "10:02" },
  { from: "user", text: "Around 30-40", time: "10:03" },
  { from: "bot", text: "Great — at that volume you're likely missing 60% of leads after hours. Want me to show you exactly how we fix that?", time: "10:03" },
  { from: "user", text: "Yes please", time: "10:04" },
  { from: "bot", text: "Booking you a free demo slot — are you available tomorrow between 10AM-12PM or 2PM-4PM? 📅", time: "10:04" },
]

const features = [
  { icon: Zap, title: "Instant Response", desc: "Replies in under 3 seconds, never misses a message. Your leads get immediate attention 24/7.", color: "from-orange-400 to-orange-500" },
  { icon: Brain, title: "Learns Your Business", desc: "Trained on your products, FAQs and sales process. Sounds like your best salesperson.", color: "from-orange-400 to-orange-600" },
  { icon: Calendar, title: "Books Appointments", desc: "Syncs with your calendar and confirms slots automatically. No back-and-forth needed.", color: "from-orange-400 to-orange-500" },
  { icon: BarChart3, title: "Tracks Every Lead", desc: "Full analytics dashboard with conversion data. Know exactly what's working.", color: "from-orange-400 to-orange-600" },
]

const steps = [
  { num: 1, title: "Discovery Call", desc: "We understand your business in 60 minutes", days: "Day 1" },
  { num: 2, title: "We Build", desc: "Custom agent built in 5-7 days", days: "Day 2-6" },
  { num: 3, title: "You Approve", desc: "Test every conversation flow before launch", days: "Day 6" },
  { num: 4, title: "Go Live", desc: "Your agent starts working immediately", days: "Day 7" },
]

export default function WhatsAppAIAgentPage() {
  const [visibleMessages, setVisibleMessages] = useState(0)
const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= chatMessages.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900 min-h-screen overflow-hidden">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center">
          {/* Particle BG */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                <span className="text-sm text-orange-400 font-medium">WhatsApp AI Agent</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Your Business.<br />
                <span className="text-orange-400">Always On.</span><br />
                Always Answering.
              </h1>

              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Advanced WhatsApp AI Agents that qualify leads, book appointments and close sales — 24/7 without a human.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.location.href = "/contact"}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
                >
                  See Live Demo <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => window.location.href = "/contact"}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 hover:border-orange-500/50 text-gray-900 font-semibold rounded-xl transition-all hover:bg-gray-50"
                >
                  Get Free Strategy Call
                </button>
              </div>
            </div>

            {/* Right — iPhone Mockup */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">
                {/* Green Glow */}
                <div className="absolute -inset-10 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="relative w-[280px] sm:w-[310px] animate-float">
                  <div className="bg-slate-900 rounded-[44px] border-[6px] border-slate-700 p-1 shadow-2xl">
                    {/* Notch */}
                    <div className="mx-auto w-28 h-6 bg-slate-900 rounded-b-2xl relative z-10" />

                    {/* Screen */}
                    <div className="bg-[#0b141a] rounded-[36px] overflow-hidden -mt-3">
                      {/* Status Bar */}
                      <div className="bg-[#1f2c34] px-5 py-1.5 flex items-center justify-between">
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
                      {/* WhatsApp Header */}
                      <div className="bg-[#1f2c34] px-3 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">AI</div>
                        <div>
                          <p className="text-white text-sm font-semibold">Aria • AI Assistant</p>
                          <p className="text-orange-400 text-xs">online</p>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="p-3 space-y-2 h-[400px] overflow-y-auto bg-[#0b141a]">
                        {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-slideUp`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <div
                              className={`max-w-[80%] px-3 py-2 rounded-lg text-[13px] leading-relaxed ${
                                msg.from === "user"
                                  ? "bg-[#005c4b] text-white rounded-tr-sm"
                                  : "bg-[#1f2c34] text-slate-200 rounded-tl-sm"
                              }`}
                            >
                              <p>{msg.text}</p>
                              <p className={`text-[10px] mt-1 text-right ${msg.from === "user" ? "text-orange-300/60" : "text-slate-500"}`}>
                                {msg.time} {msg.from === "user" && "✓✓"}
                              </p>
                            </div>
                          </div>
                        ))}
                        {visibleMessages < chatMessages.length && (
                          <div className="flex items-center gap-1 px-3 py-2">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Input Bar */}
                      <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
                        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2">
                          <span className="text-slate-500 text-xs">Type a message</span>
                        </div>
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">🎤</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Why Businesses Choose Our WhatsApp AI</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Every feature designed to convert more leads and save you time</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">From zero to live in just 7 days</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] border-t-2 border-dashed border-orange-500/30" />
                )}
                <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-orange-500/30 transition-all relative z-10">
                  <div className="w-14 h-14 rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-400 text-xl font-bold mb-4">
                    {s.num}
                  </div>
                  <span className="text-xs text-orange-400 font-medium">{s.days}</span>
                  <h3 className="text-lg font-semibold mt-1 mb-2">{s.title}</h3>
                  <p className="text-gray-600 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STATS BAR */}
        <section className="py-16 bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 border-y border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { end: 500, suffix: "+", label: "Agents Deployed" },
              { end: 98, suffix: "%", label: "Customer Satisfaction" },
              { end: 3, suffix: "s", label: "Response Time" },
              { end: 24, suffix: "/7", label: "Always Active" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-400">
                  <AnimatedCounter end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-3xl p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to automate your WhatsApp?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Book a free 30-minute strategy call — we'll show you exactly what your AI agent will look like.
            </p>
            <button
              onClick={() => window.location.href = "/contact"}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25"
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
      `}</style>
    </>
  )
}
