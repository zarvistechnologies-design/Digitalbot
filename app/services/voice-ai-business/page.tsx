import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VoiceConversationPlayer } from "@/components/voice-conversation-player"
import { BarChart3, BrainCircuit, Building2, Clock, HeadphonesIcon, Mic, Phone, Shield, Target, TrendingUp, Users, Workflow, Zap } from "lucide-react"
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

      {/* Hero Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 min-h-screen flex items-center" role="banner" aria-labelledby="hero-heading">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Hero Badge */}
              <div className="inline-block mb-4">
                <span
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-sky-600 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-600 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  <Zap className="mr-2 w-3 h-3" />
                  Enterprise Voice AI
                </span>
              </div>

              {/* H1 Heading - Cyberpunk Style */}
              <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                <span className="block mb-2 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                  Voice AI for Business
                </span>
                <span
                  className="inline-block px-4 py-2 text-white bg-sky-600 shadow-lg text-xl sm:text-2xl lg:text-3xl font-bold uppercase tracking-wide border border-sky-600 hover:shadow-sky-400/50 transition-all duration-300"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  Transform Experience
                </span>
              </h1>

              {/* SEO-Rich Description */}
              <div
                className="mb-6 p-4 bg-white/80 border border-sky-400/30 shadow-lg backdrop-blur-sm"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  Enterprise-grade <strong className="text-sky-600">voice AI for business</strong> that automates customer service, accelerates sales, and boosts productivity by <strong className="text-sky-600">400%</strong>. Deploy in <strong className="text-sky-600">48 hours</strong> with zero infrastructure.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-sky-600 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky--600 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <Target className="mr-2 w-3 h-3" />
                  Start Free Trial
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-sky-600 bg-transparent border border-sky-600 hover:bg-sky-400/10 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <Mic className="mr-2 w-3 h-3" />
                  Schedule Demo
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {["10,000+ Businesses", "4.9/5 Rating", "No Credit Card"].map((signal, idx) => (
                  <div key={idx} className="flex items-center gap-1 justify-center lg:justify-start">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 4px rgba(234, 88, 12, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900">{signal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right HD Image */}
            <div className="relative">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-400/20 border border-sky-400/30">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                  alt="Voice AI for Business Technology - Enterprise Communication Dashboard"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-sky-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-sky-400/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Enterprise Voice AI</div>
                        <div className="text-xs text-sky-400">Business automation</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sky-400 font-medium">✓ 400%+ Productivity</span>
                      <span className="text-sky-400 font-medium tracking-wide">48hr Deploy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Introduction Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="intro-heading">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">

            {/* Left Content */}
            <div>
              <div className="mb-4">
                <span
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-black bg-sky-600 shadow-md border border-sky-600 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}
                >
                  Complete Guide
                </span>
              </div>
              <h2 id="intro-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                  What is Voice AI for Business?
                </span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-gray-900 leading-relaxed">
                <p>
                  <strong className="text-sky-600">Voice AI for business</strong> represents the cutting edge of enterprise automation technology, combining advanced natural language processing, machine learning, and conversational AI to revolutionize how companies interact with customers. Unlike traditional IVR systems or simple chatbots, modern voice AI for business understands context, intent, and nuance in human speech.
                </p>
                <p>
                  Today's businesses face unprecedented challenges: rising customer expectations, 24/7 availability demands, global talent shortages, and pressure to reduce operational costs while improving service quality. <strong className="text-sky-600">Voice AI for business</strong> solves these challenges by providing scalable, intelligent automation that handles thousands of simultaneous conversations.
                </p>
                <p>
                  The technology powering voice AI for business has reached a tipping point. Recent breakthroughs in large language models, speech synthesis, and real-time processing enable AI systems to conduct sophisticated multi-turn conversations, handle complex business logic, integrate with enterprise systems, and provide personalized experiences.
                </p>
              </div>
            </div>

            {/* Right HD Image */}
            <div className="relative">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-400/20 border border-sky-400/30">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
                  alt="Voice AI Technology Dashboard - Business Analytics and Customer Service Automation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-sky-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-sky-400/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                        <BrainCircuit className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">AI Intelligence</div>
                        <div className="text-xs text-sky-400">Natural language processing</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sky-400 font-medium">✓ 98% Accuracy</span>
                      <span className="text-sky-400 font-medium tracking-wide">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits Grid - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="benefits-heading">
        <div className="container mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <span
                className="px-3 py-1.5 text-xs font-bold text-black bg-sky-600 shadow-md border border-sky-600 uppercase tracking-wide"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}
              >
                Enterprise Benefits
              </span>
            </div>
            <h2 id="benefits-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                Why Leading Enterprises Choose Voice AI
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-900 max-w-2xl mx-auto leading-relaxed">
              Discover how <strong className="text-sky-600">voice AI for business</strong> transforms operations and delivers measurable ROI
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-white border border-sky-400/30 p-4 shadow-lg backdrop-blur-sm hover:border-sky-400 hover:shadow-sky-500/20 transition-all duration-300 hover:scale-105 group"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30 group-hover:scale-110 transition-transform"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                    }}
                  >
                    <benefit.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{benefit.title}</h3>
                    <p className="text-xs text-gray-900 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="use-cases-heading">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 id="use-cases-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                Voice AI for Business: Real-World Applications & Results
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white max-w-2xl mx-auto leading-relaxed">
              See how businesses across industries leverage voice AI to achieve breakthrough performance improvements.
            </p>
          </div>

          {/* Use Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCases.map((useCase, i) => (
              <div
                key={i}
                className="bg-white border border-sky-400/30 p-4 shadow-lg backdrop-blur-sm hover:border-sky-400 hover:shadow-sky-500/20 transition-all duration-300 hover:scale-105 group"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{useCase.title}</h3>
                  <p className="text-xs text-gray-900 leading-relaxed mb-3">
                    {useCase.description}
                  </p>
                  <div
                    className="inline-flex items-center px-2 py-1 bg-sky-400/20 border border-sky-400/50 text-xs font-semibold text-gray-900 shadow-sm"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                    }}
                  >
                    ✓ {useCase.results}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="features-advanced-heading">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 id="features-advanced-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                Advanced Capabilities: How Voice AI for Business Works
              </span>
            </h2>
            <p className="text-sm sm:text-base text-white max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade technology stack powering the most sophisticated voice AI for business solutions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="bg-white border border-sky-400/30 p-4 shadow-lg backdrop-blur-sm hover:border-sky-400 hover:shadow-sky-500/20 transition-all duration-300 hover:scale-105 group"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30 group-hover:scale-110 transition-transform"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                    }}
                  >
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">{feature.title}</h3>
                    <p className="text-xs text-gray-900 leading-relaxed mb-3">
                      {feature.description}
                    </p>
                    <ul className="space-y-1">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs">
                          <span className="text-sky-600 font-bold mt-0.5">✓</span>
                          <span className="text-gray-900">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Conversation Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="demo-heading">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6 items-center">

            {/* Left Content */}
            <div>
              <div className="mb-4">
                <span
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-black bg-sky-600 shadow-md border border-sky-600 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}
                >
                  <Mic className="mr-2 w-3 h-3" />
                  Voice AI Demo
                </span>
              </div>
              <h2 id="demo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                  Experience Voice AI for Business in Action
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gray-900 leading-relaxed mb-4">
                Listen to how our voice AI for business handles real customer interactions with natural, intelligent responses that drive satisfaction and conversion.
              </p>

              <div
                className="bg-white border border-sky-400/30 p-4 shadow-lg backdrop-blur-sm"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                <VoiceConversationPlayer audioSrc="/sample-conversation.mp3" />
              </div>
            </div>

            {/* Right HD Image */}
            <div className="relative">
              <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-400/20 border border-sky-400/30">
                <Image
                  src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2070&auto=format&fit=crop"
                  alt="Voice AI Customer Service Dashboard - Real-time Analytics and Performance Metrics"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-sky-900/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-sky-400/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                        <HeadphonesIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Live Demo</div>
                        <div className="text-xs text-sky-400">Voice AI conversation</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-sky-400 font-medium">✓ Natural Speech</span>
                      <span className="text-sky-400 font-medium tracking-wide">Real-time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="faq-heading">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <span
                className="px-3 py-1.5 text-xs font-bold text-black bg-sky-600 shadow-md border border-sky-600 uppercase tracking-wide"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}
              >
                Got Questions? We've Got Answers
              </span>
            </div>
            <h2 id="faq-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="block mb-2 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-900 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about <span className="text-sky-600 font-semibold">Voice AI for Business</span>
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-4">
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
                className="bg-white border border-sky-400/30 p-4 shadow-lg backdrop-blur-sm hover:border-sky-400 hover:shadow-sky-500/20 transition-all duration-300 hover:scale-105 group"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-6 h-6 bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30 font-bold text-xs text-white group-hover:scale-110 transition-transform"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px))'
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 leading-tight flex-1">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-xs text-gray-900 leading-relaxed ml-9">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - sky Theme */}
      <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" role="region" aria-labelledby="cta-heading">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            {/* CTA Badge */}
            <div className="inline-block mb-4">
              <span
                className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-sky-600 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-600 uppercase tracking-wide"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}
              >
                <Zap className="mr-2 w-3 h-3" />
                Start Your Free Trial
              </span>
            </div>

            {/* CTA Heading */}
            <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
              <span className="block mb-2 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 bg-clip-text text-transparent">
                Ready to Transform Your Business
              </span>
              <span
                className="inline-block px-4 py-2 text-white bg-sky-600 shadow-lg text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide border border-sky-600 hover:shadow-sky-400/50 transition-all duration-300"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                }}
              >
                With Voice AI Today?
              </span>
            </h2>

            {/* CTA Description */}
            <div
              className="max-w-3xl mx-auto mb-6 p-4 bg-white border border-sky-400/30 shadow-lg backdrop-blur-sm"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}
            >
              <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
                Join <strong className="text-sky-600">10,000+ businesses</strong> using voice AI to automate customer service, accelerate sales, and boost productivity by <strong className="text-sky-600">400%</strong>. Start your free trial today with no credit card required.
              </p>
            </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-black bg-sky-600 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-600 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  Start Free Trial Now
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-sky-600 bg-transparent border border-sky-400 hover:bg-sky-600/10 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  Talk to Voice AI Specialist
                </Link>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                {["No Credit Card Required", "Deploy in 48 Hours", "24/7 Expert Support", "Cancel Anytime"].map((signal, idx) => (
                  <div key={idx} className="flex items-center gap-1 justify-center">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 4px rgba(234, 88, 12, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900">{signal}</span>
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
