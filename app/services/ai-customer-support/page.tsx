
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { VoiceConversationPlayer } from "@/components/voice-conversation-player"
import { ArrowRight, BarChart3, Bot, Check, ClipboardCheck, Clock, Globe, HeartHandshake, MessageCircle, Mic, Shield, Smile, Sparkles, Users, Workflow } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI Customer Support | 24/7 Automated Customer Service - DigitalBot.ai 2025",
  description: "Deploy AI customer support that resolves issues instantly 24/7. Personalized service across all channels. Trusted by 500+ businesses. Start free trial today.",
  keywords: [
    "ai customer support",
    "ai customer service",
    "automated customer support",
    "ai support agent",
    "ai chatbot customer service",
    "24/7 customer support ai",
    "ai help desk",
    "automated support system",
    "ai customer care",
    "intelligent customer support",
    "ai support automation",
    "virtual customer service agent",
    "ai powered support",
    "customer service automation",
    "ai support platform",
  ],
  openGraph: {
    title: "AI Customer Support | 24/7 Automated Customer Service - DigitalBot.ai 2025",
    description: "Deploy AI customer support that resolves issues instantly 24/7. Personalized service across all channels. Trusted by 500+ businesses.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-customer-support",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Customer Support Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Customer Support | 24/7 Automated Customer Service - DigitalBot.ai 2025",
    description: "Deploy AI customer support that resolves issues instantly 24/7. Personalized service across all channels. Trusted by 500+ businesses.",
    images: ["/images/ai-voice-agent.png"],
  },
};

const benefits = [
  {
    icon: HeartHandshake,
    title: "Customer Empathy at Scale",
    description: "Deliver empathetic conversations in real time with AI agents trained on your brand tone, knowledge base, and historical interactions.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Clock,
    title: "Instant 24/7 Resolutions",
    description: "Provide lightning-fast support across chat, voice, email, and messaging channels with AI that never sleeps and never keeps customers waiting.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Sparkles,
    title: "Personalized Journeys",
    description: "Reference past purchases, preferences, and sentiment in every conversation to create delightful, relevant support experiences.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "HIPAA, SOC 2, and GDPR compliant infrastructure with automatic redaction, encryption, and role-based access control for sensitive cases.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  },
  {
    icon: Users,
    title: "Agent Augmentation",
    description: "Give human teams AI copilots that summarize tickets, recommend next best actions, and draft responses in seconds.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Bot,
    title: "Unified Knowledge Automation",
    description: "Connect your FAQs, product docs, LMS, and community forums into a single AI-ready knowledge layer refreshed continuously.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: BarChart3,
    title: "Outcome-Based Analytics",
    description: "Track KPIs like first contact resolution, customer effort, sentiment trends, and churn risk through intuitive dashboards.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Globe,
    title: "Global Language Support",
    description: "Serve customers in 60+ languages with natural accents and adaptive translations that preserve context and nuance.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    icon: Workflow,
    title: "No-Code Automation",
    description: "Build, test, and optimize multi-step customer workflows without writing code using visual journeys and A/B testing tools.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  }
]

const useCases = [
  {
    title: "Omnichannel Case Deflection",
    description: "Resolve up to 80% of repetitive questions across live chat, social media, and email with AI responses that access your knowledge base instantly.",
    results: "Cut ticket backlog by 65%",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    title: "Proactive Customer Care",
    description: "Automatically detect churn signals and reach out with personalized retention offers before customers submit cancellations.",
    results: "Reduce churn by 35%",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
  },
  {
    title: "Technical Troubleshooting",
    description: "Guide users through complex troubleshooting sequences with step-by-step instructions, multimedia explanations, and escalation to specialists when needed.",
    results: "Increase first contact resolution to 92%",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  },
  {
    title: "Order & Account Management",
    description: "Handle refunds, order tracking, account updates, and subscription changes automatically while syncing changes to CRM, billing, and ERP systems.",
    results: "Save 3,000 agent hours per quarter",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  }
]

const capabilityBlocks = [
  {
    icon: MessageCircle,
    heading: "Context-Aware Conversation Engine",
    body: "DigitalBot understands intent, sentiment, and emotion across sessions, giving customers consistent, human-quality interactions every time.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  },
  {
    icon: ClipboardCheck,
    heading: "Automated Quality Management",
    body: "Score 100% of interactions automatically against custom rubrics, surface coaching opportunities, and enforce compliance in real time.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  },
  {
    icon: Smile,
    heading: "Customer Delight Toolkit",
    body: "Trigger loyalty offers, CSAT surveys, and follow-up journeys based on satisfaction levels and lifecycle stages to maximize customer happiness.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=130&brightness=120"
  },
  {
    icon: BarChart3,
    heading: "Unified Support Intelligence",
    body: "Gain a single view of all support metrics, including AI-only vs. blended team performance, trending topics, and agent adoption.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=125&brightness=115"
  }
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is AI customer support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI customer support uses conversational AI, automation, and knowledge management to resolve customer inquiries across channels without manual intervention."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can we launch AI support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most DigitalBot customers launch in 10 days by connecting existing knowledge bases, ticketing tools, and authentication systems through our no-code studio."
      }
    },
    {
      "@type": "Question",
      "name": "Will AI replace my support team?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI frees agents from repetitive tasks so they can focus on relationship building, complex troubleshooting, and proactive outreach. Human oversight remains central."
      }
    },
    {
      "@type": "Question",
      "name": "How does AI maintain brand voice?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DigitalBot trains on your existing conversations, style guides, and approval policies, ensuring every response sounds exactly like your brand."
      }
    },
    {
      "@type": "Question",
      "name": "Is AI customer support secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All interactions are encrypted, anonymized when necessary, and stored according to your retention policies with full audit trails for compliance."
      }
    },
    {
      "@type": "Question",
      "name": "What ROI can we expect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Organizations typically see 50% lower support costs, 40% faster response times, and 25% higher CSAT within the first quarter."
      }
    }
  ]
}

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "DigitalBot AI Customer Support",
  "description": "AI-powered customer support platform that delivers personalized, 24/7 service across voice, chat, email, and social channels. Trusted by 500+ businesses.",
  "brand": {
    "@type": "Organization",
    "name": "DigitalBot.ai",
    "foundingDate": "2024",
    "url": "https://digitalbot.ai"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://www.digitalbot.ai/services/ai-customer-support"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "500"
  }
}

export default function AICustomerSupport() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

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

          {/* Floating sky Elements */}
          <div className="absolute top-5 right-10 w-24 h-24 bg-gradient-to-bl from-sky-200/20 to-sky-300/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 left-5 w-28 h-28 bg-gradient-to-tr from-sky-200/15 to-sky-300/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-sky-200/10 via-sky-300/15 to-sky-400/10 rounded-full blur-lg" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-6 items-start">

              {/* Left Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 mb-4 border border-sky-400 uppercase tracking-widest" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <HeartHandshake className="w-4 h-4" />
                  <span className="text-xs font-bold">AI Customer Support Platform</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 bg-clip-text text-transparent mb-3 leading-tight text-left">
                  <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 drop-shadow-sm tracking-widest uppercase">AI Customer Support</span>
                  <span className="inline-block px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 shadow-lg shadow-sky-500/30 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-sky-400">
                    <span className="absolute inset-0 bg-gradient-to-tr from-sky-500/25 via-transparent to-transparent"></span>
                    <span className="relative z-10 uppercase tracking-wider">Never Sleeps, Always Helps</span>
                  </span>
                </h1>

                <div className="p-3 bg-sky-50 backdrop-blur-md border border-sky-200 shadow-md shadow-sky-500/10" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <p className="text-xs sm:text-sm font-bold text-sky-600 mb-2">
                    "Traditional support gets overwhelmed, takes breaks, works limited hours."
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-white inline-block bg-sky-500 px-3 py-1 shadow-sm shadow-sky-500/30 border border-sky-400 uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}>
                    <span className="relative z-10">WE NEVER DO.</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                  Transform customer service with <span className="font-bold text-sky-600">AI customer support</span> that resolves inquiries instantly 24/7.
                  Trusted by <span className="font-semibold text-sky-600">500+ businesses</span> handling <span className="font-semibold text-sky-600">2M+ conversations</span> monthly.
                  Our <span className="font-bold text-sky-600">AI support platform</span> delivers empathetic, personalized service across all channels.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Instant Resolution</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">All Channels</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-600" style={{
                      boxShadow: '0 0 6px rgba(234, 88, 12, 0.3)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">60+ Languages</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-white bg-sky-500 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-400 uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    Start Free Trial
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-sky-600 bg-transparent border border-sky-500 hover:bg-sky-50 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Book Demo
                  </Link>
                </div>
              </div>

              {/* Right HD Image */}
              <div className="relative">
                <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-500/15 border border-sky-200">
                  <Image
                    src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
                    alt="AI Customer Support Technology - 24/7 Automated Service Dashboard"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-sky-50/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 border border-sky-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                          <HeartHandshake className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Live Support AI</div>
                          <div className="text-xs text-sky-600">24/7 customer care</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-600 font-medium">✓ Instant Response</span>
                        <span className="text-sky-600 font-medium tracking-wide">Always Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-200/15 to-sky-300/8 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-sky-200/10 to-sky-300/15 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-left mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-600 uppercase tracking-wide" style={{
                textShadow: '0 0 12px rgba(234, 88, 12, 0.2)'
              }}>
                AI Customer Support Benefits
              </h2>
              <p className="text-gray-900 text-sm max-w-3xl leading-relaxed">
                Empower your support team with automation that feels human and scales with demand
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-sky-50 backdrop-blur-md border border-sky-200 hover:border-sky-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/15 overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  {/* Image Header */}
                  <div className="relative h-32 overflow-hidden">
                    <Image
                      src={benefit.image}
                      alt={`${benefit.title} - AI Customer Support`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-white/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-xl">
                        <benefit.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-sky-600 mb-2 uppercase tracking-wide group-hover:text-sky-700 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-900 text-xs leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-sky-200/15 to-sky-300/15 rounded-full blur-lg animate-pulse" />
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-sky-200/12 to-sky-300/12 rounded-full blur-lg animate-pulse delay-1000" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-600 uppercase tracking-wide" style={{
                textShadow: '0 0 12px rgba(234, 88, 12, 0.15)'
              }}>
                AI Support Use Cases & Proven Results
              </h2>
              <p className="text-gray-900 text-sm max-w-3xl leading-relaxed">
                Real-world outcomes from DigitalBot customers worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group relative bg-white backdrop-blur-md rounded-2xl border border-sky-200 hover:border-sky-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/15 overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={useCase.image}
                      alt={`${useCase.title} - AI Customer Support Use Case`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-md rounded-lg px-3 py-1 border border-sky-200">
                        <div className="flex items-center gap-2 text-xs">
                          <Check className="w-3 h-3 text-sky-600 animate-pulse" />
                          <span className="text-gray-900 font-semibold">{useCase.results}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent mb-3 tracking-wide">
                      {useCase.title}
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-sm mb-4">
                      {useCase.description}
                    </p>
                    <span className="inline-flex items-center px-3 py-1 bg-sky-50 text-gray-900 rounded-full text-xs font-semibold border border-sky-200">
                      <Check className="h-3 w-3 mr-2 text-sky-600" />
                      {useCase.results}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-200/15 to-sky-300/8 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-sky-200/10 to-sky-300/15 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-600 uppercase tracking-wide" style={{
                textShadow: '0 0 12px rgba(234, 88, 12, 0.15)'
              }}>
                Platform Capabilities Support Leaders Trust
              </h2>
              <p className="text-gray-900 text-sm max-w-3xl leading-relaxed">
                Deep technical advantages that keep customers informed and delighted
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {capabilityBlocks.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white backdrop-blur-md rounded-2xl border border-sky-200 hover:border-sky-400 transition-all duration-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/15 overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={`${feature.heading} - AI Customer Support Platform`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-xl">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent mb-3 tracking-wide">
                      {feature.heading}
                    </h3>
                    <p className="text-gray-900 leading-relaxed text-sm">
                      {feature.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-sky-200/15 to-sky-300/15 rounded-full blur-lg animate-pulse" />
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-sky-200/12 to-sky-300/12 rounded-full blur-lg animate-pulse delay-1000" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 mb-4 border border-sky-400 uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="w-3 h-3 animate-pulse" />
                <span className="text-xs font-bold">Live AI Demo</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text text-transparent mb-3 uppercase tracking-wide">
                Experience AI Customer Support in Action
              </h2>
              <p className="text-gray-900 text-sm max-w-2xl leading-relaxed">
                Hear how AI resolves support tickets with calm, accurate, and friendly responses your customers will love
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-sky-200">
              <VoiceConversationPlayer audioSrc="/sample-conversation.mp3" />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-sky-200/15 to-sky-300/15 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-sky-200/10 to-sky-300/10 rounded-full filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-sky-200/20 to-sky-300/20 rounded-full filter blur-lg animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="text-left mb-8">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs uppercase tracking-wide shadow-md animate-pulse" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <MessageCircle className="w-3 h-3 inline mr-1" />
                  Common Questions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-600 uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
              }}>
                Frequently Asked Questions
              </h2>
              <p className="text-gray-900 text-sm max-w-3xl leading-relaxed">
                Get clarity on how AI customer support fits into your strategy
              </p>
            </div>

            <div className="grid gap-3">
              {faqSchema.mainEntity.map((faq, index) => (
                <div
                  key={index}
                  className="group relative bg-sky-50 backdrop-blur-md border border-sky-200 hover:border-sky-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-500/15"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <div className="flex gap-4 p-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                        {faq.name}
                      </h3>
                      <p className="text-gray-900 leading-relaxed text-xs">
                        {faq.acceptedAnswer.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-200/15 to-sky-300/8 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-sky-200/10 to-sky-300/15 rounded-full blur-2xl animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 mb-6 border border-sky-400 uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <HeartHandshake className="w-4 h-4" />
                <span className="text-xs font-bold">Transform Customer Support Today</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 drop-shadow-sm tracking-widest uppercase">
                  Elevate Your Customer
                </span>
                <span className="inline-block px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 shadow-lg shadow-sky-500/30 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-sky-400">
                  <span className="absolute inset-0 bg-gradient-to-tr from-sky-500/25 via-transparent to-transparent"></span>
                  <span className="relative z-10 uppercase tracking-wider">Support Experience</span>
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-sky-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                Join <span className="font-bold text-sky-600">500+ businesses</span> delivering proactive, intelligent support experiences.
                Delight customers, empower agents, and prove <span className="font-bold text-sky-600">ROI</span> with DigitalBot AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-sky-500 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-400 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-sky-600 bg-transparent border border-sky-500 hover:bg-sky-50 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex items-center gap-1 p-2 bg-sky-50 backdrop-blur-sm border border-sky-200" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Check className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">Success Team</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-sky-50 backdrop-blur-sm border border-sky-200" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Check className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">Clear Pricing</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-sky-50 backdrop-blur-sm border border-sky-200" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Check className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">Fast Deploy</span>
                </div>
                <div className="flex items-center gap-1 p-2 bg-sky-50 backdrop-blur-sm border border-sky-200" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Check className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








