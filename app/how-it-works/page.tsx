"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Bot, Calendar, CheckCircle, Clock, Globe, Headphones, MessageSquare, Phone, Rocket, Settings, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
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

const steps = [
  {
    step: "01",
    title: "Sign Up & Configure",
    description: "Create your account in minutes and configure your AI voice agent. Choose from pre-built templates or customize from scratch.",
    icon: Settings,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    features: ["5-minute setup", "Pre-built templates", "Custom voice options", "Brand customization"]
  },
  {
    step: "02",
    title: "Train Your AI",
    description: "Upload your FAQs, scripts, and knowledge base. Our AI learns your business context to provide accurate, personalized responses.",
    icon: Bot,
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    features: ["Upload documents", "Script builder", "Context learning", "Continuous improvement"]
  },
  {
    step: "03",
    title: "Connect & Integrate",
    description: "Seamlessly integrate with your existing tools - CRM, calendars, helpdesk, and more. One-click integrations available.",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    features: ["CRM integration", "Calendar sync", "Webhook support", "API access"]
  },
  {
    step: "04",
    title: "Go Live & Scale",
    description: "Launch your AI voice agent and start handling calls immediately. Scale from 10 to 10,000 concurrent calls effortlessly.",
    icon: Rocket,
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50",
    features: ["Instant activation", "Unlimited scaling", "Real-time monitoring", "24/7 operation"]
  },
]

const useCases = [
  {
    title: "Customer Support",
    description: "Handle support calls 24/7 with instant responses and seamless escalation to human agents when needed.",
    icon: Headphones,
    stats: "90% resolution rate",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Appointment Booking",
    description: "Let AI schedule appointments, send reminders, and handle reschedules automatically.",
    icon: Calendar,
    stats: "5x more bookings",
    color: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Lead Qualification",
    description: "Qualify leads instantly with intelligent questions and route hot leads to your sales team.",
    icon: TrendingUp,
    stats: "3x more leads",
    color: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50"
  },
  {
    title: "Order Management",
    description: "Process orders, track shipments, and handle returns with conversational AI.",
    icon: BarChart3,
    stats: "95% accuracy",
    color: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50"
  },
]

const stats = [
  { value: 500, suffix: "ms", label: "Average Response Time", icon: Zap, color: "text-blue-600" },
  { value: 99.9, suffix: "%", label: "Platform Uptime", icon: Shield, color: "text-emerald-600" },
  { value: 50, suffix: "+", label: "Languages Supported", icon: Globe, color: "text-violet-600" },
  { value: 10, suffix: "M+", label: "Calls Processed", icon: Phone, color: "text-amber-600" },
]

const faqs = [
  {
    q: "How long does it take to set up?",
    a: "Most businesses are up and running within 5 minutes. Complex integrations may take up to 24 hours."
  },
  {
    q: "Can I use my own voice?",
    a: "Yes! You can choose from our library of voices or clone your own voice for a personalized experience."
  },
  {
    q: "What integrations are supported?",
    a: "We integrate with Salesforce, HubSpot, Zendesk, Calendly, Google Calendar, and 50+ other tools."
  },
  {
    q: "How does billing work?",
    a: "We offer flexible pricing based on minutes used. No contracts, cancel anytime. Enterprise plans available."
  },
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-emerald-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-blue-600 font-semibold">How It Works</li>
              </ol>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Simple 4-Step Process</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                From Zero to AI Voice Agent
                <span className="block text-blue-600 mt-2">in Minutes</span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Setting up your AI voice agent is easier than you think. Follow our simple process and start handling calls automatically today.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup" className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all">
                  Schedule Demo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-6 h-6 text-blue-200" />
                    <span className="text-3xl md:text-4xl font-black text-white">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                    </span>
                  </div>
                  <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-6">
                <Rocket className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600">The Process</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Four Simple Steps to Success
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our streamlined process gets you from signup to handling calls in record time.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={i} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className={`${i % 2 !== 0 ? 'lg:order-2' : ''}`}>
                    <div className={`${step.bgColor} rounded-3xl p-8 border border-gray-100`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <step.icon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <span className={`text-sm font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>STEP {step.step}</span>
                          <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                      <div className="grid grid-cols-2 gap-3">
                        {step.features.map((feature, fi) => (
                          <div key={fi} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className={`${i % 2 !== 0 ? 'lg:order-1' : ''}`}>
                    <div className="relative">
                      {/* Step Number */}
                      <div className={`absolute -top-6 -left-6 w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl z-10`}>
                        <span className="text-3xl font-black text-white">{step.step}</span>
                      </div>
                      
                      {/* Mock UI */}
                      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-6 border border-gray-100 ml-8">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-3 h-3 bg-red-400 rounded-full" />
                          <div className="w-3 h-3 bg-amber-400 rounded-full" />
                          <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                        </div>
                        <div className="space-y-3">
                          <div className={`h-4 bg-gradient-to-r ${step.color} rounded-full w-3/4 opacity-20`} />
                          <div className="h-4 bg-gray-100 rounded-full w-full" />
                          <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                          <div className="h-4 bg-gray-100 rounded-full w-5/6" />
                          <div className={`h-10 bg-gradient-to-r ${step.color} rounded-xl w-1/2 mt-4`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">Use Cases</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                What Can You Automate?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI voice agents handle a wide variety of business communications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((useCase, i) => (
                <div
                  key={i}
                  className={`group ${useCase.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <useCase.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{useCase.description}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full`}>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold text-gray-900">{useCase.stats}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Common Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies using DigitalBot to automate their voice communications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-blue-500/30 text-white font-bold rounded-xl hover:bg-blue-500/50 transition-all border border-white/30">
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
