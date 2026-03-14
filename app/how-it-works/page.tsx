"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Bot, Building2, Calendar, CheckCircle, Clock, Cog, DollarSign, Globe, Headphones, MessageSquare, Phone, Sparkles, Target, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Animated counter
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
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

// Services that DigitalBot handles
const services = [
  { icon: Calendar, title: "Doctor Appointment", color: "bg-indigo-500", description: "24/7 medical scheduling" },
  { icon: Users, title: "Virtual Receptionist", color: "bg-emerald-500", description: "Professional call handling" },
  { icon: Target, title: "Lead Generation", color: "bg-violet-500", description: "Automated lead capture" },
  { icon: Headphones, title: "Customer Agent", color: "bg-indigo-600", description: "Support & assistance" },
  { icon: Building2, title: "AI Call Center", color: "bg-indigo-500", description: "Enterprise solutions" },
]

// Entry points
const entryPoints = [
  { icon: Phone, title: "Phone Call", description: "Direct voice calls", color: "from-indigo-500 to-violet-500" },
  { icon: MessageSquare, title: "WhatsApp", description: "Messaging platform", color: "from-emerald-500 to-green-500" },
]

// Smart booking features
const bookingFeatures = [
  { icon: Calendar, text: "Slot-Wise Booking", color: "text-indigo-600" },
  { icon: Clock, text: "Real-Time Availability", color: "text-emerald-600" },
  { icon: Users, text: "Multi Doctor Multi Hospital View", color: "text-violet-600" },
  { icon: MessageSquare, text: "WhatsApp Confirmation", color: "text-green-600" },
  { icon: Clock, text: "Doctor Availability & Duration", color: "text-indigo-600" },
]

// Integrations
const integrations = [
  { icon: MessageSquare, title: "WhatsApp", color: "bg-green-500" },
  { icon: Calendar, title: "Internal Booking System", color: "bg-indigo-500" },
  { icon: Cog, title: "CRM / External APIs", color: "bg-violet-500" },
]

// Platform benefits
const platformBenefits = [
  { icon: Calendar, title: "Appointment Management", description: "Smart scheduling system", color: "from-indigo-500 to-violet-500" },
  { icon: Phone, title: "Call Analytics", description: "Detailed call insights", color: "from-emerald-500 to-teal-500" },
  { icon: BarChart3, title: "Lead Statistics", description: "Track conversions", color: "from-violet-500 to-purple-500" },
  { icon: TrendingUp, title: "Performance Metrics", description: "Real-time dashboards", color: "from-indigo-500 to-violet-500" },
]

// Bottom features
const bottomFeatures = [
  { icon: Cog, title: "No Code Setup", description: "Get started in minutes without any technical knowledge", color: "from-indigo-500 to-violet-500" },
  { icon: Clock, title: "24/7 Availability", description: "Your AI assistant never sleeps, never takes breaks", color: "from-emerald-500 to-teal-500" },
  { icon: DollarSign, title: "Cost Effective", description: "Save up to 70% compared to traditional call centers", color: "from-violet-500 to-purple-500" },
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />

        <main className="min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-indigo-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-emerald-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-slate-400 hover:text-indigo-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-indigo-600 font-medium">How It Works</li>
              </ol>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium tracking-wide uppercase text-slate-600">Introducing Our AI Workflow</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-6 leading-tight">
                How DigitalBot
                <span className="block bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent mt-2">Powers Your Business</span>
              </h1>

              <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                See how our AI workflow seamlessly handles customer interactions from multiple channels, automates bookings, and integrates with your existing systems.
              </p>
            </div>
          </div>
        </section>

        {/* Main Workflow Visualization */}
        <section className="py-16 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            
            {/* Services Row */}
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-8">
                AI-Powered Services
              </h2>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {services.map((service, i) => (
                  <div key={i} className="group flex flex-col items-center">
                    <div className={`w-16 h-16 md:w-20 md:h-20 ${service.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3`}>
                      <service.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{service.title}</p>
                    <p className="text-xs text-slate-400">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Workflow Grid */}
            <div className="grid lg:grid-cols-3 gap-8 items-center">
              
              {/* Left Side - Entry Points & Booking Features */}
              <div className="space-y-6">
                {/* User Entry Points */}
                <div className="glass-card rounded-3xl shadow-xl border border-white/40 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-50/60 rounded-lg flex items-center justify-center">
                      <Phone className="w-4 h-4 text-indigo-600" />
                    </div>
                    User Entry Points
                  </h3>
                  <div className="space-y-3">
                    {entryPoints.map((entry, i) => (
                      <div key={i} className={`flex items-center gap-4 p-4 bg-gradient-to-r ${entry.color} rounded-xl text-white`}>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <entry.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold">{entry.title}</p>
                          <p className="text-sm opacity-80">{entry.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking & Smart Actions */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    Booking & Smart Actions
                  </h3>
                  <div className="space-y-2">
                    {bookingFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <CheckCircle className={`w-5 h-5 ${feature.color}`} />
                        <span className="text-sm text-slate-600 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center - DigitalBot Core */}
              <div className="flex flex-col items-center justify-center">
                {/* Connection Lines Visual */}
                <div className="relative">
                  {/* Animated rings */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-4 border-indigo-200 rounded-full animate-ping opacity-20" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-52 h-52 border-4 border-indigo-300 rounded-full animate-pulse opacity-30" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 border-4 border-indigo-400 rounded-full opacity-40" />
                  </div>
                  
                  {/* Core Bot */}
                  <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40">
                    <div className="text-center">
                      <Bot className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-1" />
                      <p className="text-white font-semibold text-sm md:text-base">DigitalBot</p>
                    </div>
                  </div>
                </div>

                {/* Flow indicators */}
                <div className="flex items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-slate-600">Processing</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-600">Connected</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Integrations & Benefits */}
              <div className="space-y-6">
                {/* Automation & Integrations */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Cog className="w-4 h-4 text-violet-600" />
                    </div>
                    Automation & Integrations
                  </h3>
                  <div className="space-y-3">
                    {integrations.map((integration, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className={`w-10 h-10 ${integration.color} rounded-xl flex items-center justify-center`}>
                          <integration.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-slate-600 font-semibold">{integration.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Benefits */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                    </div>
                    Platform Benefits
                  </h3>
                  <div className="space-y-3">
                    {platformBenefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className={`w-10 h-10 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center`}>
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{benefit.title}</p>
                          <p className="text-xs text-slate-400">{benefit.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Features - No Code, 24/7, Cost Effective */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-[#fafbff]">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-6">
              {bottomFeatures.map((feature, i) => (
                <div key={i} className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/40 p-8 hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step by Step Process */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6">
                <Zap className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium tracking-wide uppercase text-slate-600">The Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                How It All Works Together
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                From incoming call to successful resolution - see the complete journey
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Customer Calls", desc: "Via phone or WhatsApp", icon: Phone, color: "from-indigo-500 to-violet-500" },
                { step: "02", title: "AI Processes", desc: "DigitalBot understands intent", icon: Bot, color: "from-violet-500 to-purple-500" },
                { step: "03", title: "Action Taken", desc: "Booking, support, or lead capture", icon: Zap, color: "from-indigo-500 to-violet-500" },
                { step: "04", title: "Results Delivered", desc: "Confirmation & analytics", icon: CheckCircle, color: "from-emerald-500 to-teal-500" },
              ].map((step, i) => (
                <div key={i} className="relative">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-1 bg-gradient-to-r from-indigo-200 to-indigo-100" />
                  )}
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40 relative z-10 hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-xs font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>STEP {step.step}</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1 mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-4 bg-gradient-to-r from-indigo-600 to-violet-600">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 500, suffix: "+", label: "Businesses Trust Us" },
                { value: 10, suffix: "M+", label: "Calls Handled" },
                { value: 99.9, suffix: "%", label: "Uptime Guarantee" },
                { value: 50, suffix: "+", label: "Languages Supported" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-semibold text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-indigo-200 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-violet-700">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies using DigitalBot's AI workflow to automate their customer interactions.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact#contact-form" className="group px-8 py-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact#contact-form" className="px-8 py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/20">
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
