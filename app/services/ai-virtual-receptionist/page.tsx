
'use client'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { VoiceConversationPlayer } from '@/components/voice-conversation-player'
import { ArrowRight, Bot, Calendar, Check, CheckCircle, Headphones, HeartHandshake, MessageCircle, Mic, Phone, Shield, Sparkles, Target, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'



const features = [
  {
    icon: Phone,
    title: "24/7 Call Answering",
    stat: "100%",
    statLabel: "Uptime",
    description: "Never miss a call again. Your AI receptionist answers every call instantly, day or night, weekends and holidays included.",
    image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Calendar,
    title: "Smart Appointment Scheduling",
    stat: "85%",
    statLabel: "Less No-Shows",
    description: "Automatically books, reschedules, and confirms appointments while syncing with your calendar in real-time.",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: MessageCircle,
    title: "Natural Conversations",
    stat: "98%",
    statLabel: "Satisfaction",
    description: "Engages callers with human-like voice interactions, understanding context and providing personalized responses.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Users,
    title: "Call Routing & Transfer",
    stat: "3 sec",
    statLabel: "Avg. Route Time",
    description: "Intelligently routes calls to the right department or person based on caller intent and availability.",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Headphones,
    title: "Multi-Language Support",
    stat: "30+",
    statLabel: "Languages",
    description: "Communicates fluently in over 30 languages, ensuring every caller feels understood and valued.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    stat: "100%",
    statLabel: "Secure",
    description: "Enterprise-grade security and compliance for healthcare, legal, and regulated industries.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1000&auto=format&fit=crop"
  }
]

const benefits = [
  {
    title: "Reduce Reception Costs by 70%",
    description: "Eliminate the need for multiple receptionists while providing superior 24/7 coverage at a fraction of the cost.",
    result: "70% cost reduction",
    icon: Target,
    color: "from-blue-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Increase Lead Capture by 40%",
    description: "Capture every opportunity with instant call answering and intelligent lead qualification that never sleeps.",
    result: "40% more leads",
    icon: Sparkles,
    color: "from-purple-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Improve Customer Satisfaction",
    description: "Zero hold times, instant responses, and personalized interactions create exceptional caller experiences.",
    result: "98% satisfaction",
    icon: HeartHandshake,
    color: "from-pink-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop"
  },
  {
    title: "Scale Without Hiring",
    description: "Handle unlimited simultaneous calls during peak times without adding staff or infrastructure.",
    result: "Unlimited calls",
    icon: Bot,
    color: "from-green-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1000&auto=format&fit=crop"
  }
]

const capabilityBlocks = [
  {
    icon: Phone,
    heading: "Instant Call Handling",
    body: "Answer every call in under 2 seconds with natural, context-aware responses that feel completely human.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Calendar,
    heading: "Smart Calendar Sync",
    body: "Real-time appointment booking with automatic calendar updates, reminders, and conflict prevention.",
    image: "https://images.unsplash.com/photo-1506784926709-22f1ec395907?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Shield,
    heading: "Enterprise Security",
    body: "HIPAA-compliant infrastructure with encrypted communications and secure data storage for sensitive industries.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop"
  },
  {
    icon: Users,
    heading: "Intelligent Routing",
    body: "AI-powered call routing based on intent, availability, and priority—connecting callers to the right person instantly.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1000&auto=format&fit=crop"
  }
]

const useCases = [
  {
    title: "Medical & Healthcare Practices",
    description: "Handle appointment scheduling, insurance verification, prescription refills, and patient inquiries while maintaining HIPAA compliance.",
    results: "85% reduction in missed appointments"
  },
  {
    title: "Professional Services",
    description: "Manage client intake, consultation bookings, document requests, and billing inquiries for law firms, accounting, and consulting practices.",
    results: "3x more qualified leads captured"
  },
  {
    title: "Home Services & Contractors",
    description: "Schedule service calls, provide quotes, dispatch technicians, and handle emergency requests for HVAC, plumbing, electrical, and repair businesses.",
    results: "60% faster response time"
  },
  {
    title: "Retail & E-commerce",
    description: "Answer product questions, check inventory, process orders, handle returns, and provide store hours and directions.",
    results: "40% higher conversion rate"
  }
]

export default function AIVirtualReceptionist() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeUseCase, setActiveUseCase] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-animate') || entry.target.id
            if (sectionId) {
              setVisibleSections((prev) => new Set(prev).add(sectionId))
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll('[data-animate], section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    rotationIntervalRef.current = setInterval(() => {
      setActiveUseCase((prev) => (prev + 1) % benefits.length)
    }, 5000)

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [])

  const handleTabClick = useCallback((index: number) => {
    setActiveUseCase(index)
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
    }
    rotationIntervalRef.current = setInterval(() => {
      setActiveUseCase((prev) => (prev + 1) % benefits.length)
    }, 5000)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Full Screen */}
        <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            
            {/* Animated Lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
          </div>

          <div className="container mx-auto relative z-30 max-w-7xl h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              
              {/* Left Side - Content */}
              <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">AI-Powered Reception</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                  <span className="block text-black">Your AI Receptionist</span>
                  <span className="block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 bg-clip-text text-transparent">That Never Sleeps</span>
                </h1>

                {/* Tagline Box */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-5 mb-6">
                  <p className="text-gray-600 text-sm italic mb-1">"Missed calls mean missed opportunities and frustrated customers."</p>
                  <p className="text-blue-600 font-bold text-base uppercase tracking-wider">Let AI Answer Every Call 24/7.</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Your AI-powered virtual receptionist answers every call, books appointments, routes inquiries, and handles customer service — <strong className="text-blue-600">24/7, in 30+ languages, without human effort</strong>.
                </p>

                {/* Key Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">24/7 Availability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">70% Cost Savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Multi-Language</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Zero Wait Time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700">Instant Booking</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Hire AI Receptionist
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-600 bg-white border-2 border-blue-500 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-md"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    See Live Demo
                  </Link>
                </div>
              </div>

              {/* Right Side - Visual/Image */}
              <div className={`relative transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-blue-200">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
                    alt="AI Virtual Receptionist - 24/7 Call Answering and Appointment Booking System"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/20 to-transparent"></div>
                  
                  {/* Floating Stats Cards */}
                  <div className="absolute bottom-6 left-6 right-6 space-y-3">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 border border-blue-200 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Live Reception AI</div>
                          <div className="text-xs text-blue-600">Handling calls right now</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-center pt-3 border-t border-gray-200">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">24/7</div>
                          <div className="text-xs text-gray-600">Available</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">70%</div>
                          <div className="text-xs text-gray-600">Cost Savings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                <Mic className="w-4 h-4" />
                <span className="text-sm font-semibold">AI Voice Demo</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Experience Natural AI Conversations
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Listen to how our AI receptionist handles real customer interactions with human-like responses
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100">
              <VoiceConversationPlayer audioSrc="/sample-receptionist-conversation.mp3" />
            </div>
          </div>
        </section>
        {/* Features Section - Image Card Grid */}
        <section id="features-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-semibold">Core Capabilities</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Everything Your Front Desk Needs
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Comprehensive reception capabilities powered by advanced AI technology
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 opacity-100 translate-y-0"
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                      <FeatureIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-end justify-between">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5">
                          <div className="text-2xl font-bold text-blue-600">{feature.stat}</div>
                          <div className="text-xs text-gray-600 font-medium">{feature.statLabel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section - Interactive Tabs */}
        <section id="benefits-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                <Target className="w-4 h-4" />
                <span className="text-sm font-semibold">Measurable Impact</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Transform Your Reception Experience
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Measurable results that impact your bottom line
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <button
                    key={index}
                    onClick={() => handleTabClick(index)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                      activeUseCase === index
                        ? 'bg-gradient-to-br from-blue-50 to-blue-50 border-blue-300 shadow-lg'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${benefit.color} shadow-lg flex-shrink-0`}>
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 text-gray-900">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {benefit.description}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                          <Check className="w-3 h-3" />
                          {benefit.result}
                        </div>
                      </div>
                    </div>
                    {activeUseCase === index && (
                      <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={benefits[activeUseCase].image}
                    alt={benefits[activeUseCase].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${benefits[activeUseCase].color} text-white px-3 py-1.5 rounded-full text-sm font-semibold mb-3`}>
                        {(() => {
                          const IconComponent = benefits[activeUseCase].icon
                          return <IconComponent className="w-4 h-4" />
                        })()}
                        {benefits[activeUseCase].result}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {benefits[activeUseCase].title}
                      </h4>
                      <p className="text-gray-600">
                        {benefits[activeUseCase].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Bento Grid */}
        <section id="capabilities-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-2 rounded-full mb-4">
                <Bot className="w-4 h-4" />
                <span className="text-sm font-semibold">Advanced Features</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Built for Modern Businesses
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilityBlocks.map((block, index) => {
                const BlockIcon = block.icon
                return (
                  <div
                    key={index}
                    className={`group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 opacity-100 translate-y-0 ${
                      index === 0 ? 'md:col-span-2 lg:row-span-2' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                  <div className={`relative ${
                    index === 0 ? 'h-full min-h-[400px]' : 'h-64'
                  }`}>
                    <Image
                      src={block.image}
                      alt={block.heading}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes={index === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center mb-4 shadow-lg">
                        <BlockIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {block.heading}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {block.body}
                      </p>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-4 py-2 rounded-full mb-4">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Industry Solutions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Industry-Specific Solutions
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Tailored virtual receptionist capabilities for your industry
              </p>
            </div>

            <div className="space-y-8">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br ${
                    index === 0 ? 'from-blue-50 to-cyan-50' :
                    index === 1 ? 'from-purple-50 to-pink-50' :
                    index === 2 ? 'from-orange-50 to-yellow-50' :
                    'from-green-50 to-teal-50'
                  } rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100`}
                >
                  <div className={`grid md:grid-cols-2 gap-0 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Side */}
                    <div className={`relative h-64 md:h-80 overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <Image
                        src={`https://images.unsplash.com/photo-${index === 0 ? '1559039829-7533320ae181' : index === 1 ? '1507003211169-0a1dd7228f2d' : index === 2 ? '1581091226825-a6a2a5aee158' : '1556742049-0cfed4f41659'}?q=80&w=1200&auto=format&fit=crop`}
                        alt={`${useCase.title} - AI Virtual Receptionist Solution`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Floating number badge */}
                      <div className="absolute top-6 right-6 w-16 h-16 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                        <span className={`text-3xl font-bold bg-gradient-to-br ${
                          index === 0 ? 'from-blue-600 to-cyan-600' :
                          index === 1 ? 'from-purple-600 to-pink-600' :
                          index === 2 ? 'from-orange-600 to-yellow-600' :
                          'from-green-600 to-teal-600'
                        } bg-clip-text text-transparent`}>
                          {index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className={`p-8 md:p-12 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      <div className="space-y-4">
                        <h3 className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${
                          index === 0 ? 'from-blue-600 to-cyan-600' :
                          index === 1 ? 'from-purple-600 to-pink-600' :
                          index === 2 ? 'from-orange-600 to-yellow-600' :
                          'from-green-600 to-teal-600'
                        } bg-clip-text text-transparent mb-4`}>
                          {useCase.title}
                        </h3>
                        
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {useCase.description}
                        </p>

                        <div className="pt-4 flex items-center gap-4">
                          <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${
                            index === 0 ? 'from-blue-500 to-cyan-600' :
                            index === 1 ? 'from-purple-500 to-pink-600' :
                            index === 2 ? 'from-orange-500 to-yellow-600' :
                            'from-green-500 to-teal-600'
                          } text-white px-5 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-shadow`}>
                            <Check className="w-5 h-5" />
                            {useCase.results}
                          </div>
                          
                          <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* FAQ Section */}
        <section id="faq-section" data-animate className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full mb-4">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-semibold">Common Questions</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                AI Virtual Receptionist FAQ
              </h2>
              <p className="text-gray-600 text-lg">
                Everything you need to know about AI virtual receptionists
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How does an AI virtual receptionist work?",
                  a: "Our AI receptionist uses natural language processing to answer calls, understand caller intent, and respond naturally. It integrates with your calendar, CRM, and phone system for real-time operations."
                },
                {
                  q: "Can it handle multiple calls simultaneously?",
                  a: "Yes! Our AI can handle unlimited simultaneous calls without putting anyone on hold. Whether 1 call or 100, every caller gets instant, personalized attention."
                },
                {
                  q: "What if the AI can't answer a question?",
                  a: "The AI can seamlessly transfer calls to appropriate team members, take detailed messages, or schedule callbacks—ensuring no caller is left without help."
                },
                {
                  q: "How long does setup take?",
                  a: "Most businesses are live within 3-5 days. We handle phone setup, calendar integration, script customization, and testing with hands-on support."
                },
                {
                  q: "Is it HIPAA compliant for healthcare?",
                  a: "Yes! We offer HIPAA-compliant solutions with encrypted call recordings, secure data storage, and proper business associate agreements for healthcare practices."
                },
                {
                  q: "What's the cost vs hiring a receptionist?",
                  a: "Our AI typically costs 70-80% less than hiring full-time staff, with 24/7 coverage, unlimited call handling, and no benefits or turnover costs."
                }
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg"
                >
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors pr-4">
                      {faq.q}
                    </h3>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-semibold">Never Miss Another Call</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Hire Your AI Receptionist?
            </h2>

            <p className="text-blue-50 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of businesses providing 24/7 phone coverage, perfect call handling, and exceptional customer experiences—all while reducing costs by 70%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/signup">
                <Button size="lg" className="group bg-white text-blue-600 hover:bg-gray-50 px-8 py-6 text-lg font-bold shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:scale-105">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold backdrop-blur-sm transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Demo
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Setup in 3-5 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








