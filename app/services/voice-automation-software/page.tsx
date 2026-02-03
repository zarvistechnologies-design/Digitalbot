"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Cpu,
  Globe,
  Headphones,
  Heart,
  Mic,
  Pause,
  Phone,
  Play,
  Settings,
  Shield,
  ShoppingCart,
  Users,
  Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

// SEO Structured Data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is voice automation software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice automation software uses advanced AI to automate phone conversations, handle customer inquiries, schedule appointments, qualify leads, and perform other voice-based tasks without human intervention. DigitalBot provides natural-sounding conversations with <750ms response times."
      }
    },
    {
      "@type": "Question",
      "name": "How does voice automation software integrate with existing systems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice automation software offers pre-built integrations with major CRM platforms (Salesforce, HubSpot), scheduling tools (Calendly, Google Calendar), ticketing systems (Zendesk, Freshdesk), and custom API connections. Implementation typically takes 2-5 business days."
      }
    },
    {
      "@type": "Question",
      "name": "What ROI can I expect from voice automation software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Businesses using voice automation software typically see 60-80% reduction in call handling costs, 24/7 availability increasing conversion rates by 35-50%, and staff redeployment to high-value tasks. Most clients achieve positive ROI within 3-6 months."
      }
    },
    {
      "@type": "Question",
      "name": "How secure is voice automation software?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice automation software is SOC 2 Type II certified, GDPR compliant, and HIPAA-ready. All voice data is encrypted in transit (TLS 1.3) and at rest (AES-256) with full audit logs and role-based access control."
      }
    }
  ]
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DigitalBot",
  "description": "Enterprise Voice Automation Software Solutions",
  "url": "https://digitalbot.in",
  "logo": "https://digitalbot.in/logo.png",
  "sameAs": [
    "https://twitter.com/digitalbot",
    "https://linkedin.com/company/digitalbot"
  ]
}

const features = [
  {
    title: "Natural Language Processing",
    description: "Advanced NLP understands context, handles accents, and processes complex requests with human-like comprehension and 95%+ accuracy.",
    icon: Brain
  },
  {
    title: "Multi-Channel Integration",
    description: "Connect voice automation across phone, web chat, mobile apps, and messaging platforms seamlessly with unified experience.",
    icon: Globe
  },
  {
    title: "Real-Time Analytics",
    description: "Monitor call volumes, response times, customer satisfaction, and automation rates with comprehensive live dashboards.",
    icon: BarChart3
  },
  {
    title: "Intelligent Routing",
    description: "AI-powered call routing directs customers to the right department or escalates to human agents intelligently when needed.",
    icon: Users
  },
  {
    title: "Appointment Scheduling",
    description: "Automate booking, rescheduling, and reminders with calendar integrations and smart conflict resolution.",
    icon: Calendar
  },
  {
    title: "Enterprise Security",
    description: "SOC 2 Type II certified with end-to-end encryption, GDPR compliance, and HIPAA-ready infrastructure for all industries.",
    icon: Shield
  }
]

const useCases = [
  {
    title: "Healthcare",
    description: "Automate patient scheduling, prescription refills, and appointment reminders while maintaining HIPAA compliance.",
    icon: Heart
  },
  {
    title: "E-commerce",
    description: "Handle order status inquiries, returns processing, and product recommendations with intelligent voice automation.",
    icon: ShoppingCart
  },
  {
    title: "Financial Services",
    description: "Manage account inquiries, fraud alerts, and payment processing with secure, compliant voice automation.",
    icon: Building2
  },
  {
    title: "Enterprise",
    description: "Scale customer support, IT helpdesk, and internal communications with enterprise-grade voice automation.",
    icon: Briefcase
  }
]

const sampleConversation = [
  { speaker: "Customer", text: "Hi, I need help troubleshooting my software installation." },
  { speaker: "AI Assistant", text: "Hello! I'd be happy to help with your installation. What software are you trying to install, and what operating system are you using?" },
  { speaker: "Customer", text: "I'm installing your enterprise CRM on Windows 11, but I keep getting an error code 5023." },
  { speaker: "AI Assistant", text: "Error 5023 is typically related to permissions. Let me guide you through a fix: First, right-click the installer and select 'Run as administrator'. Did that help?" },
  { speaker: "Customer", text: "Yes! It's installing now. Thank you so much!" },
  { speaker: "AI Assistant", text: "Wonderful! The installation should take about 3-5 minutes. I'll send you a follow-up email with your license activation guide. Is there anything else you need help with?" }
]

const faqs = [
  {
    q: "What is voice automation software?",
    a: "Voice automation software uses advanced AI to automate phone conversations, handle customer inquiries, schedule appointments, qualify leads, and perform other voice-based tasks without human intervention. Our platform provides natural-sounding conversations with <750ms response times."
  },
  {
    q: "How does voice automation software integrate with existing systems?",
    a: "Our voice automation software offers pre-built integrations with major CRM platforms (Salesforce, HubSpot), scheduling tools (Calendly, Google Calendar), ticketing systems (Zendesk, Freshdesk), and custom API connections. Implementation typically takes 2-5 business days with our technical team's support."
  },
  {
    q: "Can voice automation software handle multiple languages?",
    a: "Yes, our voice automation software supports 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. The AI automatically detects the caller's language and responds accordingly, with native-level pronunciation and cultural awareness."
  },
  {
    q: "What is the accuracy rate of voice automation software?",
    a: "Our voice automation software achieves 95%+ accuracy in speech recognition and intent classification. The AI continuously learns from interactions, improving performance over time. For complex queries beyond its capability, it seamlessly transfers to human agents with full context."
  },
  {
    q: "How secure is voice automation software for handling sensitive data?",
    a: "Our voice automation software is SOC 2 Type II certified, GDPR compliant, and HIPAA-ready. All voice data is encrypted in transit (TLS 1.3) and at rest (AES-256). We provide audit logs, role-based access control, and comply with industry-specific regulations for healthcare, finance, and government sectors."
  },
  {
    q: "What ROI can I expect from voice automation software?",
    a: "Businesses using our voice automation software typically see 60-80% reduction in call handling costs, 24/7 availability increasing conversion rates by 35-50%, and staff redeployment to high-value tasks. Most clients achieve positive ROI within 3-6 months, with payback accelerating as call volumes scale."
  },
  {
    q: "How customizable is the voice automation software?",
    a: "Highly customizable. You can configure conversation flows, brand voice personality, hold music, transfer rules, working hours, and custom responses. Advanced users can build conditional logic, integrate webhooks for real-time data, and create industry-specific workflows without coding."
  },
  {
    q: "What happens if the voice automation software doesn't understand a caller?",
    a: "Our voice automation software has multiple fallback mechanisms: (1) clarifying questions, (2) offering menu options, (3) seamless transfer to human agents with full conversation context. The system logs unclear interactions to improve AI training, continuously reducing escalation rates."
  }
]

export default function VoiceAutomationSoftwarePage() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentMessage < sampleConversation.length) {
      interval = setInterval(() => {
        setCurrentMessage(prev => {
          if (prev >= sampleConversation.length) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 2500)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentMessage])

  const playConversation = () => {
    if (currentMessage >= sampleConversation.length) {
      setCurrentMessage(0)
    }
    setIsPlaying(!isPlaying)
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

      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/50 to-blue-50">
        <Header />
        <main className="min-h-screen">
          {/* Hero Section - Premium Light Theme */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-blue-100/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(147,197,253,0.15),transparent_50%)]" />
            
            {/* Decorative Blur Orbs */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />

            {/* Floating Icons */}
            <div className="absolute top-32 left-[15%] hidden lg:block">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-lg shadow-blue-100/50 flex items-center justify-center border border-blue-100 animate-bounce">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="absolute top-48 right-[12%] hidden lg:block">
              <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-blue-100/50 flex items-center justify-center border border-blue-100 animate-pulse">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="absolute bottom-32 left-[10%] hidden lg:block">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-lg shadow-blue-100/50 flex items-center justify-center border border-blue-100">
                <Settings className="w-7 h-7 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <div className="text-center lg:text-left">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-6 shadow-sm">
                    <Cpu className="w-4 h-4" />
                    <span className="text-sm font-semibold">Enterprise Voice Automation Software</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
                    <span className="text-gray-900">Automate Every </span>
                    <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-transparent bg-clip-text">
                      Voice Interaction
                    </span>
                    <span className="text-gray-900"> with AI</span>
                  </h1>

                  <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                    Transform your business with intelligent <strong className="text-blue-600">voice automation software</strong> that handles calls,
                    schedules appointments, qualifies leads, and provides instant support 24/7 without human intervention.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                    <Link 
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:-translate-y-0.5"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                      href="/contact"
                      className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-200 text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                    >
                      <Phone className="w-5 h-5" />
                      Request Demo
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-lg border border-blue-100">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>99.9% Uptime SLA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-lg border border-blue-100">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>SOC 2 Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 px-3 py-2 rounded-lg border border-blue-100">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>&lt;750ms Response</span>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative hidden lg:block">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/40 border border-blue-100">
                    <Image
                      src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=500&fit=crop"
                      alt="Voice Automation Software Dashboard"
                      width={600}
                      height={500}
                      className="w-full h-auto object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                  </div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-blue-100/40 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">80%</p>
                        <p className="text-sm text-gray-500">Cost Reduction</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl shadow-blue-100/40 border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-semibold text-gray-700">AI Active 24/7</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-2">95%+</p>
                  <p className="text-blue-100 text-sm sm:text-base">Recognition Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-2">750ms</p>
                  <p className="text-blue-100 text-sm sm:text-base">Response Time</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-2">30+</p>
                  <p className="text-blue-100 text-sm sm:text-base">Languages Supported</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-white mb-2">10K+</p>
                  <p className="text-blue-100 text-sm sm:text-base">Concurrent Calls</p>
                </div>
              </div>
            </div>
          </section>

          {/* Intelligent Conversation Flow Section */}
          <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-50/40 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Image */}
                <div className="relative order-2 lg:order-1">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/50 via-blue-100/50 to-blue-200/50 rounded-3xl blur-2xl" />
                  <div className="relative h-[350px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-blue-200/40">
                    <Image
                      src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=500&fit=crop"
                      alt="Voice Automation Interface - AI Conversation Management"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                  </div>
                </div>

                {/* Right Content */}
                <div className="order-1 lg:order-2">
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-6">
                    <Brain className="w-4 h-4" />
                    <span className="text-sm font-semibold">Smart Conversations</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                    Intelligent Conversation Flow
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Our advanced AI understands context, handles complex conversations, and makes intelligent decisions based on customer intent and company policies.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Natural language understanding across 30+ languages",
                      "Context-aware responses that feel human-like",
                      "Seamless handoff to human agents when needed",
                      "Continuous learning from every interaction"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500 transition-colors">
                          <CheckCircle className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Real-Time Performance Analytics Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-50/50 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left Content */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-6">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm font-semibold">Analytics Dashboard</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                    Real-Time Performance Analytics
                  </h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Get comprehensive insights into every conversation with detailed analytics, performance metrics, and actionable recommendations to optimize your operations.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Live dashboards with call metrics and KPIs",
                      "Detailed conversation transcripts and recordings",
                      "AI sentiment analysis and quality scoring",
                      "Custom reports and export capabilities"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500 transition-colors">
                          <CheckCircle className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image */}
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-200/50 via-blue-100/50 to-blue-200/50 rounded-3xl blur-2xl" />
                  <div className="relative h-[350px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-blue-200/40">
                    <Image
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=500&fit=crop"
                      alt="Real-Time Analytics Dashboard - Voice Automation Performance Metrics"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50/50 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-4">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Powerful Features</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose Our Voice Automation Software
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  The most advanced voice automation software platform built for modern businesses
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 border border-blue-100 shadow-lg shadow-blue-50/50 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-blue-100/0 to-blue-50/0 group-hover:from-blue-50/50 group-hover:via-blue-100/30 group-hover:to-blue-50/50 transition-all duration-500 rounded-2xl" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200/50">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-4">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">Industry Solutions</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Voice Automation for Every Industry
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Tailored voice automation solutions for businesses across all sectors
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {useCases.map((useCase, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 border border-blue-100 shadow-lg shadow-blue-50/50 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300 text-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                      <useCase.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Demo Section */}
          <section className="py-20 bg-gradient-to-br from-white via-blue-50/50 to-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-4">
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span className="text-sm font-semibold">Live Demo</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Experience Natural AI Conversations
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Listen to how our voice automation software handles real customer interactions
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-100/30 p-6 sm:p-8">
                  {/* Conversation Messages */}
                  <div className="space-y-4 mb-8 max-h-80 overflow-y-auto">
                    {sampleConversation.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.speaker === "Customer" ? "justify-start" : "justify-end"} ${
                          currentMessage >= idx + 1 ? "opacity-100" : "opacity-30"
                        } transition-opacity duration-500`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.speaker === "Customer"
                              ? "bg-gray-100 text-gray-900 rounded-bl-md"
                              : "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                          }`}
                        >
                          <p className={`text-xs font-semibold mb-1 ${
                            msg.speaker === "Customer" ? "text-gray-500" : "text-blue-100"
                          }`}>
                            {msg.speaker}
                          </p>
                          <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Play Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={playConversation}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-200/50"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Pause Conversation
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Play Conversation
                        </>
                      )}
                    </button>
                  </div>

                  {/* Waveform Animation */}
                  {isPlaying && (
                    <div className="mt-6 flex items-center justify-center gap-1 h-12">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.random() * 24 + 8}px`,
                            animationDelay: `${i * 0.05}s`,
                            animationDuration: '0.8s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full mb-4">
                  <Headphones className="w-4 h-4" />
                  <span className="text-sm font-semibold">Common Questions</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Voice Automation Software FAQ
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Everything you need to know about implementing voice automation software
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl p-6 border border-blue-100 shadow-lg shadow-blue-50/50 hover:shadow-xl hover:shadow-blue-100/50 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200/50">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {faq.q}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.3),transparent_60%)]" />
            
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/20 rounded-full blur-lg" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-6">
                  <Bot className="w-4 h-4" />
                  <span className="text-sm font-semibold">Start Your Voice Automation Journey</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                  Ready to Automate Your Voice Communications?
                </h2>
                
                <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses using our voice automation software to deliver exceptional customer experiences while reducing costs by up to 80%.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg shadow-blue-900/20"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                  >
                    <Phone className="w-5 h-5" />
                    Talk to Sales
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>No Credit Card Required</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>14-Day Free Trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Cancel Anytime</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-100 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}








