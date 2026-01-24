
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { VoiceConversationPlayer } from '@/components/voice-conversation-player'
import { ArrowRight, Calendar, Check, Headphones, MessageCircle, Mic, Phone, Shield, Users } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: "AI Virtual Receptionist | 24/7 Call Answering & Appointment Booking - DigitalBot.ai 2025",
  description: "Deploy an AI virtual receptionist that answers calls, books appointments, and routes calls 24/7. HIPAA compliant. 70% cost reduction. Multi-language support.",
  keywords: [
    "ai virtual receptionist",
    "ai receptionist",
    "virtual phone answering",
    "ai call answering",
    "automated receptionist",
    "ai appointment booking",
    "virtual assistant phone",
    "ai phone system",
    "automated call handling",
    "ai call routing",
    "virtual reception",
    "ai phone answering service",
    "automated phone assistant",
    "ai customer service",
    "virtual office assistant"
  ],
  openGraph: {
    title: "AI Virtual Receptionist | 24/7 Call Answering & Appointment Booking - DigitalBot.ai 2025",
    description: "Deploy an AI virtual receptionist that answers calls, books appointments, and routes calls 24/7 with HIPAA compliance and 70% cost reduction.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-virtual-receptionist",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Virtual Receptionist Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Virtual Receptionist | 24/7 Call Answering & Appointment Booking - DigitalBot.ai 2025",
    description: "Deploy an AI virtual receptionist that answers calls, books appointments, and routes calls 24/7 with HIPAA compliance and 70% cost reduction.",
    images: ["/images/ai-voice-agent.png"],
  },
};

const features = [
  {
    icon: Phone,
    title: "24/7 Call Answering",
    description: "Never miss a call again. Your AI receptionist answers every call instantly, day or night, weekends and holidays included."
  },
  {
    icon: Calendar,
    title: "Smart Appointment Scheduling",
    description: "Automatically books, reschedules, and confirms appointments while syncing with your calendar in real-time."
  },
  {
    icon: MessageCircle,
    title: "Natural Conversations",
    description: "Engages callers with human-like voice interactions, understanding context and providing personalized responses."
  },
  {
    icon: Users,
    title: "Call Routing & Transfer",
    description: "Intelligently routes calls to the right department or person based on caller intent and availability."
  },
  {
    icon: Headphones,
    title: "Multi-Language Support",
    description: "Communicates fluently in over 30 languages, ensuring every caller feels understood and valued."
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Enterprise-grade security and compliance for healthcare, legal, and regulated industries."
  }
]

const benefits = [
  {
    title: "Reduce Reception Costs by 70%",
    description: "Eliminate the need for multiple receptionists while providing superior 24/7 coverage at a fraction of the cost."
  },
  {
    title: "Increase Lead Capture by 40%",
    description: "Capture every opportunity with instant call answering and intelligent lead qualification that never sleeps."
  },
  {
    title: "Improve Customer Satisfaction",
    description: "Zero hold times, instant responses, and personalized interactions create exceptional caller experiences."
  },
  {
    title: "Scale Without Hiring",
    description: "Handle unlimited simultaneous calls during peak times without adding staff or infrastructure."
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
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-8 px-3 sm:px-4 lg:px-6">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(234, 88, 12, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          {/* Floating blue Elements */}
          <div className="absolute top-5 right-10 w-24 h-24 bg-gradient-to-bl from-blue-200/20 to-blue-300/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 left-5 w-28 h-28 bg-gradient-to-tr from-blue-200/15 to-blue-300/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-blue-200/10 via-blue-300/15 to-blue-400/10 rounded-full blur-lg" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-6 items-start">

              {/* Left Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 mb-2 border border-blue-400 uppercase tracking-widest" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Phone className="w-3 h-3" />
                  <span className="text-xs font-bold">AI-Powered Reception</span>
                </div>

                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-3 leading-tight uppercase tracking-wide" style={{
                  textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
                }}>
                  AI Virtual Receptionist That Never Sleeps
                </h1>

                <p className="text-gray-900 text-sm max-w-2xl leading-relaxed mb-4">
                  Your <span className="text-blue-600 font-semibold">AI-powered virtual receptionist</span> answers every call, books appointments, and routes calls with human-like conversations—24/7, in over 30 languages.
                </p>

                {/* Key Features Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">24/7 Available</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Multi-Language</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">HIPAA Compliant</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-white bg-blue-500 shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 border border-blue-400 uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    Hire AI Receptionist
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-blue-600 bg-transparent border border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    See Demo
                  </Link>
                </div>
              </div>

              {/* Right HD Image */}
              <div className="relative">
                <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-blue-500/15 border border-blue-200">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
                    alt="AI Virtual Receptionist - 24/7 Call Answering and Appointment Booking System"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-blue-50/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg border border-blue-400/30">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Live Reception AI</div>
                          <div className="text-xs text-blue-600">Answering calls 24/7</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-blue-600 font-medium">✓ 70% Cost Reduction</span>
                        <span className="text-blue-600 font-medium tracking-wide">Never Miss a Call</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-blue-200/15 to-blue-300/15 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-300/12 to-blue-400/12 rounded-full blur-lg animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-left mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
              }}>
                Everything Your Front Desk Needs
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl leading-relaxed">
                Comprehensive reception capabilities powered by advanced AI technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15 p-4" style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30 flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                        {feature.title}
                      </h3>
                      <p className="text-gray-900 leading-relaxed text-xs">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 right-32 w-16 h-16 bg-gradient-to-br from-blue-200/15 to-blue-300/15 rounded-full blur-lg animate-pulse delay-500" />
            <div className="absolute bottom-20 left-20 w-28 h-28 bg-gradient-to-br from-blue-400/12 to-blue-500/12 rounded-full blur-lg animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-left mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
              }}>
                Transform Your Reception Experience
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl leading-relaxed">
                Measurable results that impact your bottom line
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15 p-4" style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-900 leading-relaxed text-xs">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-blue-200/15 to-blue-300/15 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/12 to-blue-500/12 rounded-full blur-lg animate-pulse delay-1000" />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-8">
              <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
              }}>
                Industry-Specific Solutions
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl leading-relaxed">
                Tailored virtual receptionist capabilities for your industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group relative bg-white backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15 p-4" style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <div className="relative h-32">
                    <Image
                      src={`https://images.unsplash.com/photo-${index === 0 ? '1559039829-7533320ae181' : index === 1 ? '1507003211169-0a1dd7228f2d' : index === 2 ? '1581091226825-a6a2a5aee158' : '1556742049-0cfed4f41659'}?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110`}
                      alt={`${useCase.title} - AI Virtual Receptionist Solution`}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-blue-900/20 to-transparent rounded-lg"></div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs mb-3">
                      {useCase.description}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-200 backdrop-blur-sm" style={{
                      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                    }}>
                      <Check className="h-3 w-3 mr-1" />
                      {useCase.results}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-blue-200/15 to-blue-300/15 rounded-full blur-lg animate-pulse" />
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/12 to-blue-500/12 rounded-full blur-lg animate-pulse delay-1000" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 mb-4 border border-blue-500 uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="w-3 h-3 animate-pulse" />
                <span className="text-xs font-bold">AI Voice Demonstration</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-3 uppercase tracking-wide">
                Experience Natural AI Conversations
              </h2>
              <p className="text-gray-700 text-sm max-w-2xl leading-relaxed">
                Listen to how our AI receptionist handles real customer interactions with human-like responses
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-blue-200">
              <VoiceConversationPlayer audioSrc="/sample-receptionist-conversation.mp3" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* blue Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-blue-300/20 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-blue-400/15 to-blue-500/15 rounded-full filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-blue-300/25 to-blue-400/25 rounded-full filter blur-lg animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-8">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-500 text-white font-semibold text-xs uppercase tracking-wide shadow-md animate-pulse" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Phone className="w-3 h-3 inline mr-1" />
                  Common Questions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-blue-600 uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
              }}>
                AI Virtual Receptionist FAQ
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl leading-relaxed">
                Everything you need to know about <span className="text-blue-600 font-semibold">AI virtual receptionists</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* FAQ 1 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      How does an AI virtual receptionist work?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      Our AI receptionist uses natural language processing to answer calls, understand caller intent, and respond naturally. It integrates with your calendar, CRM, and phone system for real-time operations.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      Can it handle multiple calls simultaneously?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      Yes! Our AI can handle unlimited simultaneous calls without putting anyone on hold. Whether 1 call or 100, every caller gets instant, personalized attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      What if the AI can't answer a question?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      The AI can seamlessly transfer calls to appropriate team members, take detailed messages, or schedule callbacks—ensuring no caller is left without help.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      How long does setup take?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      Most businesses are live within 3-5 days. We handle phone setup, calendar integration, script customization, and testing with hands-on support.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      Is it HIPAA compliant for healthcare?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      Yes! We offer HIPAA-compliant solutions with encrypted call recordings, secure data storage, and proper business associate agreements for healthcare practices.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="group relative bg-blue-50 backdrop-blur-md border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-blue-500/15" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-blue-400/30">
                      6
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 text-transparent bg-clip-text tracking-wide">
                      What's the cost vs hiring a receptionist?
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-xs">
                      Our AI typically costs 70-80% less than hiring full-time staff, with 24/7 coverage, unlimited call handling, and no benefits or turnover costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-blue-200/15 to-blue-300/15 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-blue-400/12 to-blue-500/12 rounded-full blur-lg animate-pulse delay-1000" />
            <div className="absolute top-16 right-32 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-blue-400/20 rounded-full blur-lg animate-pulse delay-500" />
          </div>

          <div className="container mx-auto max-w-4xl text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1 mb-4 border border-blue-500 uppercase tracking-widest" style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}>
              <Phone className="w-3 h-3" />
              <span className="text-xs font-bold">Never Miss Another Call</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent uppercase tracking-wide" style={{
              textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
            }}>
              Ready to Hire Your AI Receptionist?
            </h2>

            <p className="text-gray-700 text-sm mb-6 max-w-2xl leading-relaxed">
              Join hundreds of businesses providing 24/7 phone coverage, perfect call handling, and exceptional customer experiences—all while reducing costs by 70%.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/signup">
                <Button className="group relative bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 border border-blue-500 uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="group bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 px-6 py-2 text-sm font-bold transition-all duration-300 backdrop-blur-md uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-gray-700">
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-blue-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-blue-600" />
                <span>Setup in 3-5 Days</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-blue-600" />
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








