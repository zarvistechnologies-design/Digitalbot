"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Bot, Brain, CheckCircle, Clock, Globe, MessageCircle, Mic, Pause, Play, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is conversational AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Conversational AI is advanced technology that enables machines to understand, process, and respond to human language in natural, contextual ways. It combines natural language processing, machine learning, and speech recognition to create human-like interactions across voice and text channels."
      }
    },
    {
      "@type": "Question",
      "name": "How does conversational AI differ from chatbots?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Traditional chatbots follow pre-programmed rules and scripts, while conversational AI uses machine learning to understand context, intent, and emotion. Conversational AI learns from interactions, maintains conversation context, and adapts responses based on user sentiment and previous exchanges."
      }
    },
    {
      "@type": "Question",
      "name": "Can conversational AI handle multiple languages?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, our conversational AI platform supports 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. The system automatically detects the speaker's language and responds with native-level pronunciation and cultural awareness."
      }
    },
    {
      "@type": "Question",
      "name": "What accuracy rate can I expect from conversational AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our conversational AI achieves 95%+ accuracy in intent recognition and speech-to-text conversion. The system continuously learns from interactions, improving performance over time. For complex queries, it seamlessly escalates to human agents with full conversation context."
      }
    },
    {
      "@type": "Question",
      "name": "How can conversational AI improve customer service?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Conversational AI automates 80% of routine customer inquiries, provides instant 24/7 support, reduces wait times from minutes to seconds, and maintains consistent service quality. Businesses typically see 80% cost reduction and 95%+ customer satisfaction scores."
      }
    }
  ]
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Conversational AI Platform - Enterprise Customer Engagement",
  "description": "Enterprise-grade conversational AI platform that transforms customer engagement with natural language understanding, multi-turn conversations, 30+ language support, and 95%+ accuracy across voice and text channels.",
  "brand": {
    "@type": "Organization",
    "name": "DigitalBot"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "USD",
    "priceValidUntil": "2026-12-31",
    "url": "https://www.digitalbot.ai/services/conversational-ai"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  }
}

const features = [
  {
    icon: Brain,
    title: "Natural Language Understanding",
    description: "Advanced NLU engine that comprehends context, intent, and sentiment across multiple languages, delivering human-like conversational AI experiences.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-500 to-violet-500",
    glow: "from-indigo-400 via-violet-500 to-violet-600"
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Lightning-fast conversational AI responds in under 750ms, maintaining natural conversation flow without awkward delays or interruptions.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-400 to-violet-500",
    glow: "from-indigo-400 via-violet-500 to-violet-600"
  },
  {
    icon: MessageCircle,
    title: "Multi-Turn Conversations",
    description: "Conversational AI maintains context across multiple exchanges, remembering previous interactions to provide coherent, relevant responses.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-400 to-violet-500",
    glow: "from-indigo-400 via-violet-500 to-violet-400"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Conversational AI platform supporting 30+ languages with native-level pronunciation, cultural awareness, and automatic language detection.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-500 to-violet-500",
    glow: "from-indigo-500 via-violet-500 to-violet-600"
  },
  {
    icon: Sparkles,
    title: "Emotion Recognition",
    description: "Advanced conversational AI detects customer emotions through voice tone and word choice, adapting responses for empathetic interactions.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-500 to-violet-500",
    glow: "from-indigo-400 via-violet-400 to-violet-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and GDPR-ready conversational AI infrastructure protecting every customer interaction.",
    borderColor: "border-indigo-400",
    iconBg: "from-indigo-500 to-violet-500",
    glow: "from-indigo-500 via-violet-500 to-violet-600"
  },
]

const useCases = [
  {
    icon: Users,
    title: "Customer Service Automation",
    description: "Deploy conversational AI to handle customer inquiries, resolve issues, and provide 24/7 support across all channels simultaneously.",
    metric: "80% ticket reduction"
  },
  {
    icon: TrendingUp,
    title: "Sales Qualification",
    description: "Use conversational AI to engage leads, qualify prospects, schedule demos, and nurture opportunities through intelligent conversations.",
    metric: "3x more qualified leads"
  },
  {
    icon: Clock,
    title: "Appointment Scheduling",
    description: "Conversational AI seamlessly manages calendars, books appointments, sends reminders, and handles rescheduling requests automatically.",
    metric: "95% booking accuracy"
  },
  {
    icon: BarChart3,
    title: "Market Research",
    description: "Gather customer feedback, conduct surveys, and analyze sentiment using conversational AI that adapts questions based on responses.",
    metric: "10x survey completion"
  },
]

const sampleConversation = [
  { speaker: "Customer", text: "Hi, I need help with my order." },
  { speaker: "AI Agent", text: "I'd be happy to help! Could you provide your order number?" },
  { speaker: "Customer", text: "It's ORDER-12345." },
  { speaker: "AI Agent", text: "Thank you! Your order is on its way and will arrive tomorrow by 3 PM." },
]

export default function ConversationalAI() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const playConversation = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentMessage(0)
      return
    }

    setIsPlaying(true)
    let messageIndex = 0
    const interval = setInterval(() => {
      if (messageIndex < sampleConversation.length) {
        setCurrentMessage(messageIndex + 1)
        messageIndex++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
        setCurrentMessage(0)
      }
    }, 2000)
  }


  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-indigo-400 text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="min-h-screen" role="main" suppressHydrationWarning>

        {/* Hero Section - Premium Redesign */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]" role="region" aria-labelledby="main-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]"></div>
          
          {/* Decorative Blur Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-1/4 right-[15%] w-12 h-12 bg-white rounded-2xl shadow-lg shadow-indigo-200/50 flex items-center justify-center border border-indigo-100/40 animate-bounce" style={{ animationDuration: '4s' }}>
            <Brain className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="absolute bottom-1/3 left-[10%] w-10 h-10 bg-white rounded-xl shadow-lg shadow-indigo-200/50 flex items-center justify-center border border-indigo-100/40 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <MessageCircle className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200/40 shadow-lg shadow-indigo-100/50">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-indigo-600 text-sm font-semibold">AI-Powered Conversations</span>
                </div>
                
                <h1 id="main-heading" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight">
                  <span className="text-gray-900">Transform Customer</span>
                  <br />
                  <span className="text-gray-900">Engagement with </span>
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Conversational AI</span>
                </h1>
                
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
                  Deliver natural, intelligent conversations across voice, chat, and messaging channels 24/7. Our platform understands context, emotion, and intent for every customer.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/40 shadow-md">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700">30+ Languages</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/40 shadow-md">
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700">95%+ Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-indigo-100/40 shadow-md">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-semibold text-gray-700">24/7 Availability</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/contact#contact-form" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/contact#contact-form" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl border-2 border-indigo-200 shadow-lg hover:border-indigo-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <MessageCircle className="w-5 h-5" />
                    Request Demo
                  </Link>
                </div>
              </div>
              
              {/* Right: Image */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200/50 via-violet-300/50 to-indigo-200/50 rounded-3xl blur-2xl"></div>
                <div className="relative h-[350px] sm:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-indigo-200/50">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                    alt="Conversational AI Technology - Modern Business Communication Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-transparent to-transparent"></div>
                  
                  {/* Stats Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-indigo-100/40">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">95%+</div>
                          <div className="text-xs text-gray-500">Accuracy</div>
                        </div>
                        <div className="text-center border-x border-indigo-100/40">
                          <div className="text-2xl font-bold text-indigo-600">30+</div>
                          <div className="text-xs text-gray-500">Languages</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">24/7</div>
                          <div className="text-xs text-gray-500">Available</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Premium Redesign */}
        <section className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="performance-stats">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">95%+</div>
                <div className="text-indigo-200 font-semibold text-sm uppercase tracking-wider">Accuracy Rate</div>
                <p className="mt-2 text-sm text-indigo-100">Context-aware responses</p>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">30+</div>
                <div className="text-indigo-200 font-semibold text-sm uppercase tracking-wider">Languages</div>
                <p className="mt-2 text-sm text-indigo-100">Multilingual support</p>
              </div>
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="text-4xl sm:text-5xl font-extrabold text-white mb-2">24/7</div>
                <div className="text-indigo-200 font-semibold text-sm uppercase tracking-wider">Always Active</div>
                <p className="mt-2 text-sm text-indigo-100">Never stops learning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Premium Redesign */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="features-section">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fafbff] via-white to-white"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200/40 shadow-lg shadow-indigo-100/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-indigo-600 text-sm font-semibold">Powerful Features</span>
              </div>
              <h2 id="features-section" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="text-gray-900">Why Choose Our </span>
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Conversational AI</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Enterprise-grade AI technology powering intelligent conversations at scale
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-100/40 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-400/30">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold mb-3 text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section - Premium Redesign */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="use-cases">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0f0ff] via-white to-[#fafbff]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.08),transparent_50%)]"></div>
          
          {/* Decorative */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-7xl relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200/40 shadow-lg shadow-indigo-100/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
                  <TrendingUp className="w-3 h-3 text-white" />
                </div>
                <span className="text-indigo-600 text-sm font-semibold">Industry Applications</span>
              </div>
              <h2 id="use-cases" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Conversational AI</span>
                <span className="text-gray-900"> Use Cases</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                See how businesses across industries achieve breakthrough results
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-indigo-100/40 shadow-lg shadow-indigo-100/20 hover:shadow-xl hover:shadow-indigo-200/30 hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-400 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-400/30 group-hover:scale-110 transition-transform duration-300">
                        <useCase.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{useCase.title}</h3>
                          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-xs font-bold rounded-full shadow-md">{useCase.metric}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{useCase.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section - Premium Redesign */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#fafbff] via-white to-white"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)]"></div>
          
          {/* Decorative */}
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200/40 shadow-lg shadow-indigo-100/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
                  <Mic className="w-3 h-3 text-white animate-pulse" />
                </div>
                <span className="text-indigo-600 text-sm font-semibold">Live Demo</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="text-gray-900">Experience </span>
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Natural AI Conversations</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Listen to how our conversational AI handles real customer interactions with human-like intelligence
              </p>
            </div>

            {/* Demo Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-violet-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-6 lg:p-8 border border-indigo-100/40 shadow-xl">
                <div className="space-y-4 mb-8">
                  {sampleConversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl transition-all duration-300 ${
                        msg.speaker === "Customer"
                          ? "bg-indigo-50/60 border border-indigo-100/40 ml-0 mr-8"
                          : "bg-gradient-to-r from-indigo-500 to-violet-500 text-white ml-8 mr-0"
                      } ${
                        currentMessage >= idx + 1 ? "opacity-100 scale-100" : "opacity-60 scale-98"
                      }`}
                    >
                      <p className={`text-xs font-semibold mb-1 ${msg.speaker === "Customer" ? "text-indigo-600" : "text-indigo-100"}`}>{msg.speaker}</p>
                      <p className={`text-sm ${msg.speaker === "Customer" ? "text-gray-700" : "text-white"}`}>{msg.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={playConversation}
                    className="group/btn flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105 font-bold rounded-xl"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                    <span>{isPlaying ? "Pause" : "Play"} Conversation</span>
                  </button>
                </div>

                {/* Visual Waveform */}
                {isPlaying && mounted && (
                  <div className="mt-8 flex items-center justify-center gap-1 h-16">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const heights = [20, 35, 28, 45, 25, 40, 32, 50, 22, 38, 30, 48, 26, 42, 34, 52, 24, 36, 28, 44];
                      return (
                        <div
                          key={i}
                          className="w-1.5 bg-gradient-to-t from-indigo-600 via-violet-400 to-violet-300 rounded-full animate-pulse"
                          style={{
                            height: `${heights[i]}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Premium Redesign */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="faq-section">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0f0ff] via-white to-[#fafbff]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06),transparent_70%)]"></div>
          
          {/* Decorative */}
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-indigo-100/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto max-w-4xl relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200/40 shadow-lg shadow-indigo-100/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center">
                  <MessageCircle className="w-3 h-3 text-white" />
                </div>
                <span className="text-indigo-600 text-sm font-semibold">Got Questions?</span>
              </div>
              <h2 id="faq-section" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Frequently Asked</span>
                <span className="text-gray-900"> Questions</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
                Everything you need to know about implementing <span className="text-indigo-600 font-semibold">Conversational AI</span>
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  q: "What is conversational AI?",
                  a: "Conversational AI is advanced technology that enables machines to understand, process, and respond to human language in natural, contextual ways. It combines natural language processing, machine learning, and speech recognition to create human-like interactions across voice and text channels."
                },
                {
                  q: "How does conversational AI differ from chatbots?",
                  a: "Traditional chatbots follow pre-programmed rules and scripts, while conversational AI uses machine learning to understand context, intent, and emotion. Our conversational AI learns from interactions, maintains conversation context, and adapts responses based on user sentiment and previous exchanges."
                },
                {
                  q: "Can conversational AI handle multiple languages?",
                  a: "Yes, our conversational AI platform supports 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. The system automatically detects the speaker's language and responds with native-level pronunciation and cultural awareness."
                },
                {
                  q: "What accuracy rate can I expect from conversational AI?",
                  a: "Our conversational AI achieves 95%+ accuracy in intent recognition and speech-to-text conversion. The system continuously learns from interactions, improving performance over time. For complex queries, it seamlessly escalates to human agents with full conversation context."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-indigo-100/40 shadow-lg shadow-indigo-100/30 hover:shadow-xl hover:shadow-indigo-200/40 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/0 via-indigo-400/0 to-violet-500/0 group-hover:from-indigo-400/5 group-hover:via-indigo-400/5 group-hover:to-violet-500/5 transition-all duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-400/30 font-bold text-xs text-white group-hover:scale-110 transition-transform duration-300">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 leading-tight flex-1 group-hover:text-indigo-700 transition-colors">
                        {faq.q}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed ml-12">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Premium Redesign */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="cta-heading">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.3),transparent_50%)]"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl"></div>
          
          {/* Floating Icons */}
          <div className="absolute top-1/4 left-[10%] w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
            <MessageCircle className="w-6 h-6 text-white/80" />
          </div>
          <div className="absolute bottom-1/4 right-[10%] w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <Zap className="w-5 h-5 text-white/80" />
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center">
              {/* CTA Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8">
                <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <span className="text-white text-sm font-semibold">Start Building Today</span>
              </div>

              {/* CTA Heading */}
              <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                <span className="block text-white mb-2">
                  Ready to Transform Your
                </span>
                <span className="bg-gradient-to-r from-indigo-200 via-white to-indigo-200 bg-clip-text text-transparent">
                  Conversations?
                </span>
              </h2>

              {/* CTA Description */}
              <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of businesses using conversational AI to deliver exceptional customer experiences while reducing costs by up to <span className="font-bold text-white">80%</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  href="/contact#contact-form"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-indigo-700 bg-white rounded-xl shadow-xl shadow-indigo-900/30 hover:shadow-2xl hover:shadow-indigo-900/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-500/20 backdrop-blur-sm border-2 border-indigo-300/40 rounded-xl hover:bg-indigo-400/30 hover:border-indigo-200/60 transition-all duration-300 hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  Talk to Expert
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { text: "No Credit Card Required", icon: CheckCircle },
                  { text: "14-Day Free Trial", icon: Zap },
                  { text: "Expert Support", icon: Shield }
                ].map((signal, idx) => (
                  <div key={idx} className="flex items-center gap-2 justify-center bg-indigo-500/10 backdrop-blur-sm rounded-xl py-3 px-4 border border-indigo-300/20">
                    <signal.icon className="w-4 h-4 text-indigo-200" />
                    <span className="text-sm font-medium text-indigo-100">{signal.text}</span>
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
