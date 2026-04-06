"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, Banknote, Calendar, MessageSquare, Shield, TrendingUp } from "lucide-react"
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
  { from: "user", text: "Hi, I want to invest in mutual funds" },
  { from: "bot", text: "Welcome to WealthFirst! 💰 I'd love to help you start investing. What's your investment goal?\n• Wealth Creation\n• Tax Saving (ELSS)\n• Retirement Planning\n• Child's Education\n• Emergency Fund" },
  { from: "user", text: "Tax saving" },
  { from: "bot", text: "Smart choice! 📊 For tax saving (Section 80C):\n\n🏆 Top ELSS Funds:\n1. Axis ELSS — 18.5% returns\n2. Mirae ELSS — 17.2% returns\n3. Quant ELSS — 22.1% returns\n\n💰 Minimum SIP: ₹500/month\n🔒 Lock-in: 3 years\n\nWant to start a SIP?" },
  { from: "user", text: "Yes, connect me to an advisor" },
  { from: "bot", text: "✅ Advisor call scheduled!\n📞 Rahul (Certified MFD) will call in 30 mins\n📄 I'm sending a KYC checklist\n📊 Also sending a personalized investment plan\n\nYour money journey starts now! 🚀" },
]

const features = [
  { icon: TrendingUp, title: "Investment Guidance", desc: "AI recommends funds, SIPs, and portfolios based on goals, risk profile, and timeline." },
  { icon: Calendar, title: "Advisor Appointments", desc: "Clients book consultations with certified advisors directly on WhatsApp." },
  { icon: Shield, title: "KYC Collection", desc: "Collect PAN, Aadhaar, bank details, and e-sign — all securely via WhatsApp flow." },
  { icon: MessageSquare, title: "Portfolio Updates", desc: "Automated NAV alerts, SIP reminders, and portfolio performance reports via chat." },
]

export default function FinancialServicesPage() {
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
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                <Banknote className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Built For Financial Services</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Acquire More Clients &<br />
                <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Grow AUM on WhatsApp</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">Our WhatsApp AI guides investors, collects KYC, books advisor calls, and sends portfolio updates — fully automated.</p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/25">See It In Action <ArrowRight className="w-5 h-5" /></button>
              </div>
            </div>
            <div className={`flex justify-center transition-all duration-1000 delay-300 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
              <div className="relative">
                <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-3xl" />
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
                      <div className="bg-emerald-600 px-3 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold">WF</div>
                        <div><p className="text-white text-sm font-semibold">WealthFirst</p><p className="text-emerald-200 text-xs">● Verified Business</p></div>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">What Our AI Does For Your Business</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4"><f.icon className="w-5 h-5 text-emerald-400" /></div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-emerald-50 border-y border-emerald-200">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[{ end: 60, suffix: "%", label: "More Client Acquisitions" }, { end: 3, suffix: "x", label: "Faster KYC Completion" }, { end: 95, suffix: "%", label: "SIP Renewal Rate" }, { end: 24, suffix: "/7", label: "Investor Support" }].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400"><AnimatedCounter end={s.end} suffix={s.suffix} /></p>
                <p className="text-gray-600 mt-1 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
        {/* ===== ADVANTAGES SECTION ===== */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-40 h-40 bg-emerald-100/40 rounded-full blur-2xl" />
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-emerald-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">💹</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Why Choose This</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Advantages of Using <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">Our AI</span></h2>
              <p className="text-gray-500 max-w-xl mx-auto">Here is what changes when you switch from manual processes to AI-powered WhatsApp automation.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">💹</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-500">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Instant KYC Collection</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Collect PAN, Aadhaar, bank details, and signatures via WhatsApp. Customers share photos of documents in minutes — not weeks of email follow-up.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">📊</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-500">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">SIP & Investment Reminders</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">Send SIP due date reminders, portfolio updates, and new investment opportunities. Keep clients engaged and increase AUM consistently.</p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  {/* Large Visual Emoji */}
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <span className="text-3xl">🏦</span>
                  </div>
                  {/* Floating Number */}
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-emerald-500">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Qualification for HNI Clients</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">AI qualifies leads by investment amount, risk appetite, and goals — connecting high-value prospects directly to your senior advisors.</p>
                </div>
              </div>
            </div>

            {/* Visual Bot Illustration */}
            <div className="mt-16 relative">
              <div className="bg-gradient-to-r from-emerald-400 to-green-400 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
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
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl" />
          
          <div className="relative max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-emerald-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">💰</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Money You Are Losing</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Without AI, You Are <span className="text-emerald-500">Bleeding Money</span></h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Every missed lead, slow response, and wasted work hour costs you real revenue. Here is where the money goes.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">KYC Drop-off</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> 60% new clients drop off during KYC — too slow, complicated</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-emerald-700">With AI:</span> WhatsApp KYC completes in 10 minutes, not 10 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <span className="text-2xl">💔</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Client Churn From Poor Communication</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> Annual review call is not enough, clients feel ignored</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-emerald-700">With AI:</span> Monthly portfolio summaries & market updates on WhatsApp</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <span className="text-2xl">📄</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Compliance Documentation</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> Tracking consents, disclosures, regulatory docs is a nightmare</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-emerald-700">With AI:</span> AI collects and stores in auditable WhatsApp trail</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
              <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="p-7">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Limited Advisor Bandwidth</h3>
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-gray-700">Without AI:</span> Each advisor handles 200+ clients — impossible to give attention</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-gray-500 leading-relaxed"><span className="font-medium text-emerald-700">With AI:</span> AI handles routine queries, advisor focuses on relationships</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPETITIVE EDGE SECTION ===== */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/20 to-white" />
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2" />
          
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2.5 bg-white border border-emerald-200 px-5 py-2.5 rounded-full shadow-sm mb-6">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Your Competitive Edge</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">You With AI <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">vs</span> Competitors Without</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">See why businesses using DigitalBot close more deals and grow faster than competitors stuck on manual processes.</p>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-100">
                <div className="col-span-1" />
                <div className="col-span-5 p-5 bg-gradient-to-r from-emerald-400 to-green-400 text-center">
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
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-emerald-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">1</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">AI understands SEBI, RBI, IRDAI regulations</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Generic bot making compliance-risk claims</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-emerald-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">2</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Banking-grade security for financial documents</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Basic chat storage, no encryption focus</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-emerald-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">3</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Advisor-AI collaboration: AI handles routine, advisors do strategy</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Replace advisors OR no AI at all</p>
                </div>
              </div>
              <div className="grid grid-cols-12 min-w-[600px] border-b border-gray-50 last:border-0 group hover:bg-emerald-50/10 transition-colors">
                <div className="col-span-1 flex items-center justify-center p-4">
                  <span className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-400 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">4</span>
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">Integrated payment links for SIP, premiums, investments</p>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <div className="w-px h-8 bg-gray-200" />
                </div>
                <div className="col-span-5 p-5 flex items-start gap-3">
                  <span className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">Customer must login to a separate portal</p>
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
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-3xl p-10 sm:p-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to grow your AUM?</h2>
            <p className="text-gray-600 mb-8">See how our AI acquires and retains clients for your firm.</p>
            <button onClick={() => window.location.href = "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/25">Get Demo <ArrowRight className="w-5 h-5" /></button>
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
