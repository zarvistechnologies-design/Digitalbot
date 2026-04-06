"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Calendar, Headphones, MessageSquare, PhoneCall } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
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
  { from: "user", text: "Hi, I need customer support outsourcing for my e-commerce brand" },
  { from: "bot", text: "Welcome to CallPro BPO! 🎧 We'd love to help. Tell us more:\n\n📞 Channels needed:\n• Voice Support\n• Chat/Email Support\n• Social Media Handling\n• Technical Support\n\nWhat's your monthly ticket volume?" },
  { from: "user", text: "Voice + Chat, about 5000 tickets/month" },
  { from: "bot", text: "Perfect fit! 🎯 Here's what we recommend:\n\n👥 Team: 15 dedicated agents\n📞 Voice: 12hrs/day coverage\n💬 Chat: 24/7 coverage\n📊 SLA: < 30s wait time\n💰 Starting: ₹4.5L/month\n\nIncludes:\n✅ CRM integration\n✅ Quality monitoring\n✅ Monthly reporting\n✅ Dedicated team lead\n\nShall I schedule a discovery call?" },
  { from: "user", text: "Yes, for tomorrow morning" },
  { from: "bot", text: "✅ Discovery call booked!\n📅 Tomorrow, 10:30 AM\n📞 Our VP of Operations, Priya, will call\n📧 Service deck sent to your email\n📋 Client reference list attached\n\nWe'll prepare a custom proposal for your brand! 🚀" },
]

const features = [
  { icon: PhoneCall, title: "Lead Qualification", desc: "AI captures client requirements — channels, volume, SLAs — and routes qualified leads to your sales team." },
  { icon: Calendar, title: "Discovery Call Booking", desc: "Prospects book consultations with your operations team directly through WhatsApp conversations." },
  { icon: BarChart3, title: "Service Deck Sharing", desc: "Automatically share pricing tiers, client case studies, and capability decks based on industry verticals." },
  { icon: MessageSquare, title: "Client Onboarding", desc: "Streamline onboarding with automated document collection, KYC, and SLA agreement workflows." },
]

export default function BPOPage() {
  const [visibleMessages, setVisibleMessages] = useState(0)
const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    setHeroVisible(true)
    const interval = setInterval(() => {
      setVisibleMessages((prev) => { if (prev >= chatMessages.length) { clearInterval(interval); return prev } return prev + 1 })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Header />
      <main className="bg-white text-gray-900 min-h-screen overflow-hidden">
        <section className="relative min-h-screen flex items-center">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
            <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full">
                <Headphones className="w-4 h-4 text-rose-400" />
                <span className="text-sm text-rose-400 font-medium">Built For BPO Companies</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Convert Inquiries Into<br />
                <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Long-Term BPO Clients</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">Our WhatsApp AI qualifies outsourcing leads, shares service decks, books discovery calls, and manages client onboarding — automatically.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-rose-500/25">See It In Action <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">
                <div className="absolute -inset-10 bg-rose-500/10 rounded-full blur-3xl" />
                <div className="relative w-[240px] sm:w-[280px] md:w-[310px] animate-float">
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
                      <div className="bg-rose-600 px-3 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white text-[10px] font-bold">CP</div>
                        <div><p className="text-white text-sm font-semibold">CallPro BPO</p><p className="text-rose-200 text-xs">● Verified Business</p></div>
                      </div>
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

        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">What Our AI Does For Your BPO Business</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-rose-500/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4"><f.icon className="w-5 h-5 text-rose-400" /></div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-rose-50 via-rose-100/50 to-rose-50 border-y border-rose-200">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[{ end: 50, suffix: "%", label: "More Qualified Leads" }, { end: 3, suffix: "s", label: "Response Time" }, { end: 40, suffix: "%", label: "Faster Deal Closure" }, { end: 24, suffix: "/7", label: "Lead Capture" }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-rose-400"><AnimatedCounter end={s.end} suffix={s.suffix} /></p>
                <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
        {/* ===== ADVANTAGES SECTION ===== */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-50/60 via-white to-white" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-40 h-40 bg-rose-100/40 rounded-full blur-2xl" />
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-rose-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">🎧</span>
                <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Why Choose This</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Advantages of Using <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Our AI</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">Here is what changes when you switch from manual processes to AI-powered WhatsApp automation.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">🎧</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-rose-500">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Handle 10x Volume Without Hiring</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">AI handles thousands of customer conversations simultaneously. Scale your operations without proportionally scaling headcount.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">📞</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-rose-500">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">First Response in Under 3 Seconds</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Meet and exceed client SLAs with instant automated responses. No more hold times, no more queue management headaches.</p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">🌐</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-rose-500">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Multilingual Support</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Serve customers in Hindi, English, Tamil, and more — without hiring language-specific agents. AI switches languages mid-conversation.</p>
                </div>
              </div>
            </div>

            {/* Visual Bot Illustration */}
            <div className="mt-16 relative">
              <div className="bg-gradient-to-r from-rose-400 to-pink-400 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="absolute top-10 left-1/3 w-20 h-20 bg-white/5 rounded-full" />
                <div className="relative flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center border border-white/30 shadow-xl">
                      <span className="text-5xl">🤖</span>
                    </div>
                  </div>
                  <div className="text-white text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">Your 24/7 WhatsApp AI Assistant</h3>
                    <p className="text-white/80 text-sm leading-relaxed max-w-md">Handles inquiries, qualifies leads, books meetings, and follows up — even while your team sleeps. Like having 10 employees who never take a break.</p>
                  </div>
                  <div className="flex-shrink-0 hidden md:flex gap-4">
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 text-center">
                      <p className="text-3xl font-bold text-white">24/7</p>
                      <p className="text-white/70 text-xs font-medium mt-1">Always On</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 text-center">
                      <p className="text-3xl font-bold text-white">3s</p>
                      <p className="text-white/70 text-xs font-medium mt-1">Response</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 text-center">
                      <p className="text-3xl font-bold text-white">95%</p>
                      <p className="text-white/70 text-xs font-medium mt-1">Open Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PROBLEMS / SAVE MONEY SECTION ===== */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-rose-300 to-pink-400" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-200/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-rose-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">💰</span>
                <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Money You Are Losing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Without AI, You Are <span className="text-rose-500">Bleeding Money</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Every missed lead, slow response, and wasted work hour costs you real revenue. Here is where the money goes.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors">
                      <span className="text-2xl">🚪</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Agent Attrition Crisis</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> 50-80% annual attrition, ₹50-80K to replace each agent</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-rose-700">With AI:</span> AI agents never quit, never need training refreshers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">SLA Breaches During Peak Hours</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> Volumes spike 3x, cannot hire for peaks</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-rose-700">With AI:</span> AI handles unlimited concurrent conversations — zero SLA breaches</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Quality Consistency Problems</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> Agent A is great, Agent B is terrible — clients notice</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-rose-700">With AI:</span> AI delivers exact same quality across every conversation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-rose-100 transition-colors">
                      <span className="text-2xl">🌙</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Night Shift Premium Costs</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> 24/7 means paying night shift premiums</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-rose-700">With AI:</span> AI handles after-hours at zero additional cost</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-rose-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPETITIVE EDGE SECTION ===== */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/20 to-white" />
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl -translate-y-1/2" />
          
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-rose-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-bold text-rose-600 uppercase tracking-widest">Your Competitive Edge</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">You With AI <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">vs</span> Competitors Without</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">See why businesses using DigitalBot close more deals and grow faster than competitors stuck on manual processes.</p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-100">
                <div className="col-span-1" />
                <div className="col-span-5 p-5 bg-gradient-to-r from-rose-400 to-pink-400 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🤖</span>
                    <p className="text-white font-bold text-sm uppercase tracking-wider">With DigitalBot</p>
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">VS</span>
                </div>
                <div className="col-span-5 p-5 bg-gray-100 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg">🐌</span>
                    <p className="text-gray-600 font-bold text-sm uppercase tracking-wider">Without AI</p>
                  </div>
                </div>
              </div>
              {/* Rows */}
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-rose-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">1</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">White-label: deploy under YOUR client brand</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Their brand visible to your clients</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-rose-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">2</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Full conversation context transfers to human agents</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Transfer = context lost, customer repeats</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-rose-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">3</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Per-conversation pricing — scale up/down freely</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Per-seat pricing — stuck with fixed costs</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-rose-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-rose-400 to-pink-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">4</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Multilingual AI switches language mid-chat</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Need separate agents for each language</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA inside competitive */}
            <div className="mt-10 text-center">
              <p className="text-gray-500 text-sm mb-4">Still running things the old way? Your competitors might already be switching to AI.</p>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-rose-50 to-white border border-rose-200 rounded-3xl p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to close more BPO deals?</h2>
            <p className="text-gray-600 mb-8">See how our AI handles outsourcing inquiries for your company.</p>
            <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-rose-500/25">Get Demo <ArrowRight className="w-5 h-5" /></button>
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
