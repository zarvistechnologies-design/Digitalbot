"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
    AlertTriangle,
    ArrowDown,
    ArrowRight,
    Building,
    Calendar,
    Clock,
    Users
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
  { from: "user", text: "Hi I saw your ad for 3BHK apartments" },
  { from: "bot", text: "Hi! Welcome to DreamHomes 🏠 I'm your property assistant. Are you looking to Buy or Rent?" },
  { from: "user", text: "Buy" },
  { from: "bot", text: "Great choice! What's your budget range?\n• Under 50L\n• 50-80L\n• 80L-1.5Cr\n• Above 1.5Cr" },
  { from: "user", text: "50-80 lakhs" },
  { from: "bot", text: "Perfect! Which area do you prefer? We have projects in Wakad, Baner and Hinjewadi" },
  { from: "user", text: "Baner" },
  { from: "bot", text: "I have 3 properties in Baner between ₹62L-₹78L. Sending details now..." },
  { from: "bot", text: "🏢 Sunrise Heights, Baner\n3 BHK • 1250 sqft • ₹68L\n✅ Swimming Pool | Gym | Garden\n📍 0.5 km from Baner Road" },
  { from: "bot", text: "Would you like to schedule a site visit this weekend? Saturday or Sunday?" },
  { from: "user", text: "Saturday 11am" },
  { from: "bot", text: "Confirmed! ✅ Site visit booked for Saturday 11AM. Our executive Rahul will call you 30 mins before. See you! 🎉" },
]

const painPoints = [
  { icon: Clock, title: "Leads go cold in 5 minutes", desc: "If not replied — you can't reply at midnight. By morning, they've moved to your competitor.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Users, title: "Time wasted on unqualified leads", desc: "Sales team spends hours on budget mismatches and tire-kickers instead of serious buyers.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: AlertTriangle, title: "Weekend inquiries get lost", desc: "Weekend inquiries pile up in WhatsApp and are forgotten by Monday morning.", color: "text-orange-400", bg: "bg-orange-500/10" },
]

const solutions = [
  { icon: Clock, title: "Instant 24/7 Response", desc: "AI replies in 3 seconds — even at 2AM on a Sunday. Zero leads missed, ever.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Users, title: "Auto Budget Qualification", desc: "AI qualifies budget, location and requirements before your sales team even sees the lead.", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Calendar, title: "Weekend Coverage", desc: "Every weekend inquiry gets immediate follow-up. Monday morning, you have a list of qualified site visits.", color: "text-orange-400", bg: "bg-orange-500/10" },
]

export default function RealEstatePage() {
  const [visibleMessages, setVisibleMessages] = useState(0)
const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => {
        if (prev >= chatMessages.length) { clearInterval(interval); return prev }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900 min-h-screen overflow-hidden">

        {/* HERO */}
        <section className="relative min-h-screen flex items-center">
          {/* Blueprint pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2325D366' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full">
                <Building className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400 font-medium">Built For Real Estate</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Turn Every Inquiry Into a<br />
                <span className="text-orange-500">Site Visit — Automatically</span>
              </h1>

              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Our WhatsApp AI Agent follows up every lead instantly, qualifies their budget, and books site visits — even at 2AM.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
                  See It In Action <ArrowRight className="w-5 h-5" />
                </button>
                <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 border border-gray-300 hover:border-orange-500/50 text-gray-900 font-semibold rounded-xl transition-all hover:bg-gray-50">
                  Get Demo For My Agency
                </button>
              </div>
            </div>

            {/* Right — iPhone */}
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">
                <div className="absolute -inset-10 bg-orange-500/10 rounded-full blur-3xl" />
                <div className="relative w-[280px] sm:w-[310px] animate-float">
                  <div className="bg-slate-900 rounded-[44px] border-[6px] border-slate-700 p-1 shadow-2xl">
                    <div className="mx-auto w-28 h-6 bg-slate-900 rounded-b-2xl relative z-10" />
                                        <div className="bg-[#ece5dd] rounded-[36px] overflow-hidden -mt-3">
                      {/* Status Bar */}
                      <div className="bg-[#075e54] px-5 py-1.5 flex items-center justify-between">
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
                      <div className="bg-orange-600 px-3 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px] font-bold">DH</div>
                        <div>
                          <p className="text-white text-sm font-semibold">DreamHomes AI</p>
                          <p className="text-orange-200 text-xs">● Verified Business</p>
                        </div>
                      </div>
                      {/* Messages */}
                      <div className="p-2 space-y-1.5 h-[400px] overflow-y-auto">
                        {chatMessages.slice(0, visibleMessages).map((msg, i) => (
                          <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-slideUp`}>
                            <div className={`max-w-[82%] px-2.5 py-1.5 rounded-lg text-[11px] leading-relaxed shadow-sm ${msg.from === "user" ? "bg-[#d9fdd3] text-slate-800 rounded-tr-sm" : "bg-white text-slate-800 rounded-tl-sm"}`}>
                              <p className="whitespace-pre-line">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                        {visibleMessages < chatMessages.length && (
                          <div className="flex gap-1 px-2 py-1">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                          </div>
                        )}
                      </div>
                      {/* Input Bar */}
                      <div className="bg-[#f0f0f0] px-2 py-2 flex items-center gap-2">
                        <span className="text-xl">😊</span>
                        <div className="flex-1 bg-white rounded-full px-4 py-2">
                          <span className="text-gray-400 text-xs">Type a message...</span>
                        </div>
                        <div className="w-9 h-9 bg-[#075e54] rounded-full flex items-center justify-center">
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

        {/* PAIN POINTS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">The Problems Real Estate Agents Face</h2>
          <p className="text-gray-600 text-center mb-12">Every day, leads slip through the cracks</p>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-white shadow-sm border border-orange-200 rounded-2xl p-6">
                <div className={`w-11 h-11 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                  <p.icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <ArrowDown className="w-8 h-8 text-orange-400 animate-bounce" />
          </div>
        </section>

        {/* SOLUTIONS */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            <span className="text-orange-400">How Our AI Solves</span> Every Problem
          </h2>
          <p className="text-gray-600 text-center mb-12">Automated follow-up that never sleeps</p>

          <div className="grid sm:grid-cols-3 gap-6">
            {solutions.map((s, i) => (
              <div key={i} className="bg-white shadow-sm border border-orange-200 rounded-2xl p-6 hover:border-orange-500/40 transition-all">
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* RESULTS */}
        <section className="py-16 bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 border-y border-orange-200">
          <h2 className="text-3xl font-bold text-center mb-12">Real Results From Real Estate Agencies</h2>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { end: 47, suffix: "%", label: "More Site Visits Booked" },
              { end: 3, suffix: "x", label: "Faster Lead Response" },
              { end: 68, suffix: "%", label: "Less Unqualified Calls" },
              { end: 24, suffix: "/7", label: "Lead Coverage" },
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
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to never miss a lead again?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              See exactly how our AI will work for your real estate business.
            </p>
            <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
              Get Demo For My Agency <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </main>
      <Footer /><style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </>
  )
}
