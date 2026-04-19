import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VoiceConversationPlayer } from "@/components/voice-conversation-player"
import { ArrowRight, BarChart3, BrainCircuit, Building2, CheckCircle, Clock, HeadphonesIcon, MessageCircle, Mic, Phone, Shield, Target, TrendingUp, Users, Workflow, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is voice AI for business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice AI for business is an advanced artificial intelligence technology that enables companies to automate customer interactions, sales processes, and support operations through natural voice conversations. It combines speech recognition, natural language processing, and machine learning to handle business communications at scale."
      }
    },
    {
      "@type": "Question",
      "name": "How does voice AI improve business productivity?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice AI for business boosts productivity by automating 80% of routine customer interactions, operating 24/7 without breaks, scaling instantly during peak demand, and freeing human teams to focus on complex, high-value tasks that require emotional intelligence and creative problem-solving."
      }
    },
    {
      "@type": "Question",
      "name": "Is voice AI for business secure and compliant?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, enterprise voice AI solutions provide bank-level security with SOC 2, GDPR, and HIPAA compliance, featuring end-to-end encryption, secure data storage, role-based access controls, and comprehensive audit trails to protect sensitive business and customer information."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can voice AI be deployed for business?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Voice AI for business can be deployed in 24-48 hours with zero infrastructure setup required. The cloud-based platform integrates seamlessly with existing business systems, CRM, and communication tools, allowing companies to start automating conversations immediately."
      }
    },
    {
      "@type": "Question",
      "name": "What ROI can businesses expect from voice AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Businesses implementing voice AI typically see 300-400% productivity increases, $250K+ annual cost savings on customer service, 60% reduction in no-shows, and 350% improvement in sales team efficiency within the first 6 months of deployment."
      }
    }
  ]
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Voice AI for Business - Enterprise Voice Automation",
  "description": "Enterprise-grade voice AI for business that automates customer service, sales, and support operations with natural language conversations, 24/7 availability, and seamless integration.",
  "brand": {
    "@type": "Organization",
    "name": "DigitalBot"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "price": "0",
    "priceCurrency": "USD",
    "priceValidUntil": "2025-12-31",
    "url": "https://www.digitalbot.ai/services/voice-ai-business"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "847"
  }
}

const benefits = [
  {
    icon: Building2,
    title: "Enterprise-Ready Voice AI Solutions",
    description: "Deploy scalable voice AI for business operations with enterprise-grade infrastructure designed for high-volume customer interactions and mission-critical communications."
  },
  {
    icon: TrendingUp,
    title: "Revenue Growth Acceleration",
    description: "Boost business productivity by 400% with intelligent voice AI automation that handles customer inquiries, lead qualification, and sales conversations 24/7 without human intervention."
  },
  {
    icon: Shield,
    title: "Bank-Level Security & Compliance",
    description: "Voice AI for business with SOC 2, GDPR, HIPAA compliance ensuring your customer data remains protected with end-to-end encryption and secure cloud infrastructure."
  },
  {
    icon: Clock,
    title: "24/7 Intelligent Operations",
    description: "Never miss a business opportunity with always-on voice AI that manages customer service, appointment scheduling, and sales inquiries round-the-clock across global time zones."
  },
  {
    icon: Users,
    title: "Seamless Team Integration",
    description: "Voice AI for business integrates perfectly with your existing CRM, helpdesk, and communication tools, empowering your team with AI-powered assistance and automation."
  },
  {
    icon: Zap,
    title: "Instant Deployment & Scaling",
    description: "Launch your voice AI for business in under 48 hours with zero infrastructure setup, scaling effortlessly from 10 to 10,000 concurrent conversations based on demand."
  },
  {
    icon: Target,
    title: "Precision Customer Targeting",
    description: "Advanced voice AI analytics identify customer intent, sentiment, and behavior patterns, enabling personalized business strategies that increase conversion rates by 300%."
  },
  {
    icon: BarChart3,
    title: "Real-Time Business Intelligence",
    description: "Comprehensive voice AI dashboards provide actionable insights on customer interactions, operational efficiency, and ROI metrics to drive data-informed business decisions."
  },
  {
    icon: HeadphonesIcon,
    title: "Superior Customer Experience",
    description: "Deliver exceptional service with voice AI that understands natural language, handles complex queries, and maintains consistent brand voice across all business touchpoints."
  }
]

const useCases = [
  {
    title: "Customer Service Automation",
    description: "Voice AI for business revolutionizes customer support by handling 80% of routine inquiries automatically, reducing wait times from minutes to seconds while maintaining 95% customer satisfaction scores.",
    results: "Save $250K+ annually on support costs"
  },
  {
    title: "Sales & Lead Qualification",
    description: "Intelligent voice AI qualifies leads, schedules demos, and nurtures prospects through personalized conversations, enabling your sales team to focus exclusively on high-value closing opportunities.",
    results: "Increase sales productivity by 350%"
  },
  {
    title: "Appointment Scheduling",
    description: "Eliminate scheduling friction with voice AI that manages calendars, sends reminders, handles rescheduling, and confirms appointments across your entire business operation autonomously.",
    results: "Reduce no-shows by 60%"
  },
  {
    title: "Order Processing & Tracking",
    description: "Voice AI for business streamlines order management by processing purchases, providing real-time shipment updates, and handling returns through natural voice conversations.",
    results: "Process 10x more orders with same team"
  }
]

export default function VoiceAIBusiness() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Header />

      <main className="min-h-screen">

      {/* Hero Section - Premium Light Theme */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-white" role="banner" aria-labelledby="hero-heading">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Animated Gradient Orbs */}


        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Floating Dots */}
        <div className="absolute top-1/4 left-[20%] w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/3 right-[25%] w-3 h-3 bg-orange-400 rounded-full animate-bounce opacity-50" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-[30%] w-2 h-2 bg-orange-100 rounded-full animate-bounce opacity-60" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-[15%] w-2.5 h-2.5 bg-orange-100 rounded-full animate-bounce opacity-50" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 border border-orange-200/40 shadow-lg shadow-orange-100/50 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                <span className="text-orange-600 text-sm font-semibold tracking-wide">Enterprise Voice AI Platform</span>
              </div>

              {/* Main Heading */}
              <h1 id="hero-heading" className="space-y-3">
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight">
                  Voice AI for Business
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight">
                  <span className="text-orange-500">
                    Transform Experience
                  </span>
                </span>
              </h1>

              {/* Description Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-orange-100/40 shadow-xl shadow-orange-100/30">
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                    Enterprise-grade <strong className="text-gray-800">voice AI for business</strong> that automates customer service, accelerates sales, and boosts productivity by <span className="text-orange-600 font-medium">400%</span>. Deploy in <span className="text-orange-600 font-medium">48 hours</span> with zero infrastructure.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/contact#contact-form"
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
                >
                  <Target className="relative mr-2 w-5 h-5" />
                  <span className="relative">Start Free Trial</span>
                  <span className="relative ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-white border-2 border-orange-200/40 text-orange-600 font-bold text-base hover:border-orange-300 hover:bg-orange-50/60 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Mic className="relative mr-2 w-5 h-5" />
                  <span className="relative">Schedule Demo</span>
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-6">
                {[
                  { value: "10,000+", label: "Businesses", icon: "🏢" },
                  { value: "4.9/5", label: "Rating", icon: "⭐" },
                  { value: "Free", label: "No CC Required", icon: "✓" }
                ].map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-white/70 rounded-xl border border-orange-100/40 shadow-sm">
                    <span className="text-xl">{stat.icon}</span>
                    <div>
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Glow Effect */}

              
              {/* Main Image Container */}
              <div className="relative">
                <div className="relative h-80 sm:h-96 lg:h-[450px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-orange-200/50">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                    alt="Voice AI for Business Technology - Enterprise Communication Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 via-orange-800/20 to-transparent"></div>
                  
                  {/* Bottom Info Card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-orange-100/40">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900">Enterprise Voice AI</div>
                          <div className="text-sm text-orange-600 font-medium">Business Automation Platform</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                          Live & Ready
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-orange-400 text-sm">★</span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1 font-medium">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute -top-6 -right-4 lg:-right-8 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="px-5 py-3 bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-emerald-600">+400%</div>
                        <div className="text-xs text-gray-500">Productivity</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/4 -left-4 lg:-left-8 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
                  <div className="px-5 py-3 bg-white rounded-2xl border border-orange-100/40 shadow-xl shadow-orange-100/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-orange-600">48hrs</div>
                        <div className="text-xs text-gray-500">Deployment</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 left-1/4 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>
                  <div className="px-5 py-3 bg-white rounded-2xl border border-gray-200 shadow-xl shadow-orange-200/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xl font-black text-orange-500">24/7</div>
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

      {/* Introduction Section - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="intro-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative Elements */}

        <div className="absolute bottom-20 right-10 w-80 h-80 bg-transparent rounded-full blur-3xl"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 right-[15%] w-12 h-12 bg-white rounded-2xl shadow-lg shadow-orange-200/50 flex items-center justify-center border border-orange-100/40 animate-bounce" style={{ animationDuration: '4s' }}>
          <BrainCircuit className="w-6 h-6 text-orange-500" />
        </div>
        <div className="absolute bottom-1/3 left-[10%] w-10 h-10 bg-white rounded-xl shadow-lg shadow-orange-200/50 flex items-center justify-center border border-orange-100/40 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <Mic className="w-5 h-5 text-orange-500" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-orange-600 text-sm font-semibold">Complete Guide</span>
            </div>
            <h2 id="intro-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-gray-900">What is </span>
              <span className="text-orange-500">Voice AI for Business?</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              The future of enterprise communication is here
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              {/* Feature Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: BrainCircuit,
                    title: "Advanced NLP",
                    desc: "Understands context, intent & nuance in human speech"
                  },
                  {
                    icon: Workflow,
                    title: "Smart Automation",
                    desc: "Handles thousands of simultaneous conversations"
                  }
                ].map((item, i) => (
                  <div key={i} className="group p-5 bg-white rounded-2xl border border-orange-100/40 shadow-lg shadow-orange-100/30 hover:shadow-xl hover:shadow-orange-200/40 hover:border-orange-200/40 transition-all duration-300 hover:-translate-y-1">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-orange-300/30 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Main Content Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-orange-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative p-6 sm:p-8 bg-white rounded-2xl border border-orange-100/40 shadow-xl">
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>
                      <strong className="text-gray-900">Voice AI for business</strong> represents the cutting edge of enterprise automation, combining advanced <span className="text-orange-600 font-medium">natural language processing</span>, machine learning, and conversational AI to revolutionize customer interactions.
                    </p>
                    <p>
                      Unlike traditional IVR systems, modern voice AI understands context and nuance. It solves today's challenges: <span className="text-orange-600 font-medium">24/7 availability</span>, talent shortages, and pressure to reduce costs while improving quality.
                    </p>
                    <p>
                      Recent breakthroughs in LLMs and real-time processing enable AI to conduct sophisticated conversations, handle complex logic, and deliver <span className="text-orange-600 font-medium">personalized experiences</span> at scale.
                    </p>
                  </div>

                  {/* Stats Row */}
                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-orange-100/40">
                    {[
                      { value: "98%", label: "Accuracy" },
                      { value: "<750ms", label: "Response" },
                      { value: "50+", label: "Languages" }
                    ].map((stat, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2 bg-orange-50/60 rounded-xl">
                        <span className="text-xl font-bold text-orange-600">{stat.value}</span>
                        <span className="text-sm text-gray-500">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual - 5 cols */}
            <div className="lg:col-span-5 relative">
              {/* Glow */}

              
              {/* Main Image */}
              <div className="relative h-[400px] sm:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-orange-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                  alt="Voice AI Technology Dashboard - Business Analytics and Customer Service Automation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-orange-800/20 to-transparent"></div>
                
                {/* Bottom Card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-orange-100/40">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30">
                        <BrainCircuit className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">AI Intelligence</div>
                        <div className="text-sm text-orange-600">Natural Language Processing</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Active & Learning
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-orange-400 text-sm">★</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Cards */}
              <div className="absolute -top-4 -right-4 lg:-right-8 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="px-4 py-3 bg-white rounded-2xl border border-orange-100/40 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-emerald-600">+400%</div>
                      <div className="text-xs text-gray-500">Productivity</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/3 -left-4 lg:-left-8 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <div className="px-4 py-3 bg-white rounded-2xl border border-orange-100/40 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-orange-600">24/7</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Grid - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="benefits-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative Elements */}


        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, #f97316 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                <TrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-orange-600 text-sm font-semibold">Enterprise Benefits</span>
            </div>
            <h2 id="benefits-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-gray-900">Why Leading Enterprises </span>
              <span className="text-orange-500">Choose Voice AI</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Discover how <span className="text-orange-600 font-medium">voice AI for business</span> transforms operations and delivers measurable ROI
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                <div className="relative h-full bg-white rounded-2xl p-6 border border-orange-100/40 shadow-lg shadow-orange-100/20 hover:shadow-xl hover:shadow-orange-200/30 hover:border-orange-200/40 transition-all duration-300 hover:-translate-y-1">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-300/30 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-6 right-6 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <Link
              href="/contact#contact-form"
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
            >
              Explore All Benefits
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="use-cases-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative */}

        <div className="absolute bottom-20 left-20 w-80 h-80 bg-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-orange-600 text-sm font-semibold">Real-World Results</span>
            </div>
            <h2 id="use-cases-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-orange-500">Voice AI in Action</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              See how businesses across industries achieve breakthrough performance improvements
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                <div className="relative h-full bg-white rounded-2xl p-6 lg:p-8 border border-orange-100/40 shadow-lg shadow-orange-100/20 hover:shadow-xl hover:shadow-orange-200/30 hover:border-orange-200/40 transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-300/30 group-hover:scale-110 transition-transform flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{useCase.title}</h3>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-600">{useCase.results}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="features-advanced-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative */}

        <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                <BrainCircuit className="w-3 h-3 text-white" />
              </div>
              <span className="text-orange-600 text-sm font-semibold">Advanced Technology</span>
            </div>
            <h2 id="features-advanced-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-gray-900">How </span>
              <span className="text-orange-500">Voice AI Works</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
              Enterprise-grade technology stack powering the most sophisticated voice AI solutions
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                icon: BrainCircuit,
                title: "Natural Language Understanding",
                description: "Our voice AI for business leverages state-of-the-art transformer models trained on billions of business conversations to understand customer intent with 98% accuracy. The system recognizes context, handles multi-turn dialogues, and adapts to regional accents and industry-specific terminology.",
                features: [
                  "Sentiment analysis for emotional intelligence",
                  "Intent classification across 500+ business scenarios",
                  "Entity extraction for accurate data capture"
                ]
              },
              {
                icon: Workflow,
                title: "Enterprise Integration Ecosystem",
                description: "Voice AI for business seamlessly connects with your existing technology stack through 200+ pre-built integrations and robust API infrastructure. Connect to CRM platforms, helpdesk systems, payment processors, and custom databases without writing code.",
                features: [
                  "Salesforce, HubSpot, Zendesk native integration",
                  "RESTful API for custom business workflows",
                  "Webhook support for real-time event processing"
                ]
              },
              {
                icon: Phone,
                title: "Omnichannel Voice Deployment",
                description: "Deploy voice AI for business across phone systems, web applications, mobile apps, and messaging platforms with unified conversation management. Maintain context as customers switch channels, ensuring seamless experiences regardless of touchpoint.",
                features: [
                  "PSTN phone integration with carrier-grade reliability",
                  "WebRTC for browser-based voice interactions",
                  "Mobile SDK for iOS and Android applications"
                ]
              },
              {
                icon: Shield,
                title: "Enterprise Security & Compliance",
                description: "Voice AI for business built on zero-trust architecture with military-grade encryption, comprehensive audit logging, and compliance with global data protection regulations. Your customer data remains secure, private, and under your complete control.",
                features: [
                  "SOC 2 Type II, GDPR, HIPAA, PCI DSS certified",
                  "End-to-end AES-256 encryption at rest and in transit",
                  "Role-based access control with SSO integration"
                ]
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
                
                <div className="relative h-full bg-white rounded-2xl p-6 lg:p-8 border border-orange-100/40 shadow-lg shadow-orange-100/20 hover:shadow-xl hover:shadow-orange-200/30 hover:border-orange-200/40 transition-all duration-300 hover:-translate-y-1">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-300/30 group-hover:scale-110 transition-transform flex-shrink-0">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">
                    {feature.description}
                  </p>
                  
                  {/* Features List */}
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-orange-50/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-orange-500" />
                        </div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Conversation Section - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="demo-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative */}

        <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <Mic className="w-3 h-3 text-white" />
                </div>
                <span className="text-orange-600 text-sm font-semibold">Voice AI Demo</span>
              </div>
              
              <h2 id="demo-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
                <span className="text-gray-900">Experience </span>
                <span className="text-orange-500">Voice AI in Action</span>
              </h2>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8">
                Listen to how our voice AI for business handles real customer interactions with natural, intelligent responses that drive satisfaction and conversion.
              </p>

              {/* Voice Player Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-orange-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative bg-white rounded-2xl p-6 border border-orange-100/40 shadow-xl">
                  <VoiceConversationPlayer audioSrc="/audio/virtual-receptionist-sample.mp3" />
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              {/* Glow */}

              
              <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] rounded-3xl overflow-hidden border-2 border-white shadow-2xl shadow-orange-200/50">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
                  alt="Voice AI Customer Service Dashboard - Real-time Analytics and Performance Metrics"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-orange-800/20 to-transparent"></div>
                
                {/* Bottom Card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-orange-100/40">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30">
                        <HeadphonesIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-900">Live Demo</div>
                        <div className="text-sm text-orange-600">Voice AI Conversation</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Natural Speech
                      </span>
                      <span className="text-sm font-medium text-orange-600">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section - Premium Redesign */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden" role="region" aria-labelledby="faq-heading">
        {/* Background */}
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative */}

        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-transparent rounded-full blur-3xl"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-orange-200/40 shadow-lg shadow-orange-100/50 mb-6">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                <MessageCircle className="w-3 h-3 text-white" />
              </div>
              <span className="text-orange-600 text-sm font-semibold">Got Questions?</span>
            </div>
            <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">
              <span className="text-orange-500">
                Frequently Asked
              </span>
              <span className="text-orange-500">
                Questions
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-900 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about <span className="text-orange-600 font-semibold">Voice AI for Business</span>
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                question: "What is voice AI for business?",
                answer: "Voice AI for business is an advanced artificial intelligence technology that enables companies to automate customer interactions, sales processes, and support operations through natural voice conversations. It combines speech recognition, natural language processing, and machine learning to handle business communications at scale, operating 24/7 with human-like understanding and response capabilities."
              },
              {
                question: "How does voice AI improve business productivity?",
                answer: "Voice AI for business boosts productivity by automating 80% of routine customer interactions, operating 24/7 without breaks, scaling instantly during peak demand, and freeing human teams to focus on complex, high-value tasks that require emotional intelligence and creative problem-solving. Companies typically see 300-400% productivity increases within the first 6 months of deployment."
              },
              {
                question: "Is voice AI for business secure and compliant?",
                answer: "Yes, enterprise voice AI solutions provide bank-level security with SOC 2, GDPR, and HIPAA compliance, featuring end-to-end encryption, secure data storage, role-based access controls, and comprehensive audit trails to protect sensitive business and customer information. All data is encrypted at rest and in transit using AES-256 encryption."
              },
              {
                question: "How quickly can voice AI be deployed for business?",
                answer: "Voice AI for business can be deployed in 24-48 hours with zero infrastructure setup required. The cloud-based platform integrates seamlessly with existing business systems, CRM, and communication tools through 200+ pre-built integrations, allowing companies to start automating conversations immediately without technical complexity."
              },
              {
                question: "What ROI can businesses expect from voice AI?",
                answer: "Businesses implementing voice AI typically see 300-400% productivity increases, $250K+ annual cost savings on customer service operations, 60% reduction in appointment no-shows, 350% improvement in sales team efficiency, and 95%+ customer satisfaction scores within the first 6 months of deployment. The average ROI payback period is under 3 months."
              },
              {
                question: "Can voice AI integrate with my existing business systems?",
                answer: "Absolutely. Voice AI for business offers 200+ native integrations with popular platforms like Salesforce, HubSpot, Zendesk, Microsoft Dynamics, and more. Additionally, robust RESTful APIs and webhook support enable custom integrations with proprietary systems, ensuring seamless data flow across your entire technology ecosystem."
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-orange-100/40 shadow-lg shadow-orange-100/30 hover:shadow-xl hover:shadow-orange-200/40 hover:border-orange-300 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-400/0 via-orange-300/15 to-orange-600/0 group-hover:from-orange-400/5 group-hover:via-orange-300/15 group-hover:to-orange-600/5 transition-all duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-400/30 font-bold text-xs text-white group-hover:scale-110 transition-transform duration-300">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 leading-tight flex-1 group-hover:text-orange-700 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed ml-12">
                    {faq.answer}
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
        <div className="absolute inset-0 bg-orange-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-transparent"></div>
        
        {/* Decorative Elements */}


        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-[10%] w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '4s' }}>
          <Phone className="w-6 h-6 text-white/80" />
        </div>
        <div className="absolute bottom-1/4 right-[10%] w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <Zap className="w-5 h-5 text-white/80" />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center">
            {/* CTA Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg mb-8">
              <div className="w-6 h-6 rounded-full bg-orange-400/30 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm font-semibold">Limited Time Offer</span>
            </div>

            {/* CTA Heading */}
            <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              <span className="block text-white mb-2">
                Ready to Transform Your Business
              </span>
              <span className="bg-gradient-to-r from-orange-200 via-white to-orange-200 bg-clip-text text-transparent">
                With Voice AI Today?
              </span>
            </h2>

            {/* CTA Description */}
            <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Join <span className="font-bold text-white">10,000+ businesses</span> using voice AI to automate customer service, accelerate sales, and boost productivity by <span className="font-bold text-white">400%</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/contact#contact-form"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-orange-700 bg-white rounded-xl shadow-xl shadow-orange-900/30 hover:shadow-2xl hover:shadow-orange-900/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                Start Free Trial Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-orange-500/20 backdrop-blur-sm border-2 border-orange-300/40 rounded-xl hover:bg-orange-400/30 hover:border-orange-200/40/60 transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5" />
                Talk to Voice AI Specialist
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { text: "No Credit Card Required", icon: CheckCircle },
                { text: "Deploy in 48 Hours", icon: Zap },
                { text: "24/7 Expert Support", icon: Phone },
                { text: "Cancel Anytime", icon: Shield }
              ].map((signal, idx) => (
                <div key={idx} className="flex items-center gap-2 justify-center bg-orange-500/10 backdrop-blur-sm rounded-xl py-3 px-4 border border-orange-300/20">
                  <signal.icon className="w-4 h-4 text-orange-200" />
                  <span className="text-sm font-medium text-orange-100">{signal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </>
  )
}
