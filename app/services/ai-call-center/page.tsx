import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { VoiceConversationPlayer } from "@/components/voice-conversation-player";
import { ArrowRight, BarChart3, Bot, Brain, Building2, Check, Clock, HeadphonesIcon, MessageCircle, Mic, Phone, Shield, Target, TrendingUp, Users, Workflow, Zap } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
  description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses. Start free trial.",
  keywords: [
    "ai call center",
    "ai call center software",
    "automated call center",
    "ai phone system",
    "call center automation",
    "ai customer service",
    "virtual call center",
    "ai call routing",
    "call center ai solution",
    "ai contact center",
    "automated phone system",
    "ai voice call center",
    "call center automation software",
    "ai powered call center",
    "intelligent call routing",
  ],
  openGraph: {
    title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
    description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-call-center",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Call Center Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
    description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses.",
    images: ["/images/ai-voice-agent.png"],
  },
};

const benefits = [
  {
    icon: Building2,
    title: "Enterprise-Grade Contact Center",
    description: "Launch a fully managed AI call center with elastic capacity, carrier-grade reliability, and compliance controls tailored to finance, healthcare, retail, and logistics enterprises.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Clock,
    title: "24/7 Intelligent Availability",
    description: "Deliver instant responses across every time zone. AI agents handle calls, email callbacks, and SMS follow-ups round-the-clock with consistent accuracy.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: TrendingUp,
    title: "Productivity Gains",
    description: "Automate 85% of routine call center interactions and cut average handle times by 60%, allowing live agents to focus on complex escalations that drive revenue.",
    image: "https://images.unsplash.com/photo-1551434678-efb963407044?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "SOC 2, HIPAA, PCI DSS, and GDPR compliant voice infrastructure with end-to-end encryption, redaction, and granular audit trails.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: HeadphonesIcon,
    title: "Human-Centric Experiences",
    description: "Natural language understanding, sentiment detection, and empathetic speech synthesis deliver conversations that mirror your brand tone.",
    image: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Users,
    title: "Omnichannel Continuity",
    description: "Carry context seamlessly from inbound calls to SMS, WhatsApp, email, and live chat handoffs, eliminating repetitive customer verification.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: BarChart3,
    title: "Real-Time Intelligence",
    description: "Supervisors receive live dashboards with queue analytics, AI quality scoring, agent coaching suggestions, and automated compliance flags.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Zap,
    title: "Rapid Deployment",
    description: "Pre-built call flows, multilingual voice models, and CRM connectors allow enterprises to go live in under 14 days with zero downtime.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Workflow,
    title: "No-Code Orchestration",
    description: "Design, test, and iterate complex IVR replacements with visual builders, reusable conversation blocks, and A/B testing out of the box.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  }
]

const useCases = [
  {
    title: "Customer Support Automation",
    description: "Route and resolve high-volume support calls automatically. AI agents authenticate callers, surface knowledge articles, and complete account actions without human intervention.",
    results: "Reduce cost per call by 70%",
    image: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Revenue & Upsell Campaigns",
    description: "Run proactive retention and cross-sell campaigns with AI that understands customer history, proposes relevant offers, and captures payments securely.",
    results: "Grow upsell conversions by 45%",
    image: "https://images.unsplash.com/photo-1551434678-efb963407044?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Field Service Dispatch",
    description: "Automatically triage incident calls, schedule engineers, and confirm appointments while syncing updates to workforce management tools in real time.",
    results: "Cut dispatch delays by 55%",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Compliance Hotlines",
    description: "Provide confidential hotlines with voice biometrics, call transcription, and automated routing to the right compliance teams within SLA windows.",
    results: "Achieve 100% policy adherence",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80"
  }
]

const featureBlocks = [
  {
    icon: Phone,
    heading: "Carrier-Grade Voice Infrastructure",
    body: "Redundant SIP trunks, automatic call distribution, and smart failover ensure every inbound and outbound interaction connects instantly and clearly.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Target,
    heading: "Smart Intent Routing",
    body: "Machine learning models detect intent in the first three seconds of audio and route customers to AI workflows or human specialists based on priority.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: MessageCircle,
    heading: "Agent Assist & Collaboration",
    body: "Surface live transcripts, objection handling scripts, and AI-generated summaries directly inside your agent desktop for lightning-fast resolutions.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Mic,
    heading: "Accurate Speech Intelligence",
    body: "Multi-accent recognition, noise suppression, and adaptive speech synthesis deliver natural, inclusive experiences across 60+ languages.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
  }
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an AI call center?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An AI call center uses conversational AI, voice automation, and machine learning to manage customer calls, authenticate callers, resolve requests, and escalate complex issues to human agents when necessary."
      }
    },
    {
      "@type": "Question",
      "name": "How fast can an AI call center be deployed?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DigitalBot's AI call center launches in less than two weeks with pre-built workflows, CRM integrations, and compliance templates that eliminate lengthy custom development."
      }
    },
    {
      "@type": "Question",
      "name": "Will AI replace my human agents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI handles repetitive, high-volume tasks while human experts focus on strategic conversations, coaching, and relationship building. Most teams reassign agents to higher-value work."
      }
    },
    {
      "@type": "Question",
      "name": "Is the AI call center secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All calls are encrypted, stored in compliant regions, and governed by role-based access controls, detailed audit logs, and data retention policies."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI work with my existing phone system?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DigitalBot integrates with legacy PBX, cloud telephony, CRM, helpdesk, and workforce management tools using APIs and pre-built connectors."
      }
    },
    {
      "@type": "Question",
      "name": "What ROI should we expect?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Enterprises typically reduce operating expenses by 40-60%, improve CSAT by 35%, and generate ROI within the first quarter of deployment."
      }
    }
  ]
}

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "DigitalBot AI Call Center Automation",
  "description": "AI-powered call center automation platform that delivers 24/7 customer support, intelligent routing, and real-time analytics. Trusted by 500+ businesses across 25+ countries.",
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
    "url": "https://www.digitalbot.ai/services/ai-call-center"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "500"
  }
}

export default function AICallCenter() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

        {/* Hero Section - Light Theme */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16 md:py-24">
          {/* Subtle Light Background */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(rgba(249, 115, 22, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.02) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
          </div>

          {/* Floating sky Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-radial from-sky-400/10 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-radial from-sky-300/8 to-transparent rounded-full blur-3xl animate-pulse delay-300" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-radial from-sky-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-700" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-6 py-2.5 mb-8 font-semibold text-sm uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <Phone className="w-4 h-4" />
                <span>Enterprise AI Call Center</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider">
                  Transform Your Call Center
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 text-gray-900 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-widest">
                    with AI Automation
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-sky-300/10 to-sky-500/10 blur-2xl -z-10 scale-110" />
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg mb-10 text-gray-700 max-w-4xl mx-auto leading-relaxed">
                Deploy an <strong className="text-sky-600">AI call center</strong> that handles unlimited customer calls 24/7 with intelligent routing, real-time analytics, and seamless CRM integration.
                Trusted by <span className="font-bold text-sky-600">500+ businesses</span> managing <span className="font-bold text-sky-600">2M+ conversations</span> monthly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button className="bg-sky-500 text-white hover:bg-sky-400 font-bold px-8 py-3 text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-400/30 flex items-center" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <Link href="/signup" className="flex items-center">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </button>
                <button className="bg-white text-sky-600 border-2 border-sky-400/30 hover:bg-sky-50 font-bold px-8 py-3 text-sm tracking-widest uppercase transition-all" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <Link href="/contact" className="flex items-center">
                    <Phone className="mr-2 w-4 h-4" />
                    Book Demo
                  </Link>
                </button>
              </div>

              <div className="inline-flex flex-col gap-4 bg-white border border-sky-200 p-6 shadow-lg shadow-sky-100/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}>
                <div className="flex flex-wrap gap-6 justify-center items-center text-xs sm:text-sm font-medium">
                  <div className="flex items-center gap-2 text-sky-600 uppercase tracking-widest">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>500+ Active Businesses</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 uppercase tracking-widest">
                    <Check className="w-4 h-4 text-sky-600" />
                    <span>4.8/5 Customer Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 uppercase tracking-widest">
                    <Shield className="w-4 h-4 text-sky-600" />
                    <span>SOC2 & HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600 uppercase tracking-widest">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>24/7 Availability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Light Theme */}
        <section className="py-16 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-4 py-2 mb-6 font-semibold text-xs uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Bot className="w-3 h-3 animate-pulse" />
                AI Call Center Features
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider leading-tight">
                Why Choose DigitalBot
                <br />
                <span className="text-gray-900">for AI Call Centers?</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Powerful automation, intuitive operations, and <strong className="text-sky-600">measurable outcomes</strong> for modern contact centers
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-sky-200 p-6 hover:border-sky-400 shadow-md hover:shadow-lg hover:shadow-sky-200/50 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  {/* HD Image */}
                  <div className="relative w-full h-24 mb-4 overflow-hidden border border-sky-200" style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}>
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-white/20"></div>
                    <div className="absolute bottom-2 left-2">
                      <div className="w-8 h-8 bg-sky-500 flex items-center justify-center text-white" style={{
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                      }}>
                        <benefit.icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-3 text-sky-600 group-hover:text-sky-700 transition-colors uppercase tracking-wider leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section - Light Theme */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-4 py-2 mb-6 font-semibold text-xs uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Target className="w-3 h-3 animate-pulse" />
                Proven Use Cases
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider leading-tight">
                AI Call Center Use Cases
                <br />
                <span className="text-gray-900">& Results</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Proven automation playbooks that <strong className="text-sky-600">transform every customer touchpoint</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group bg-white border border-sky-200 p-6 hover:border-sky-400 shadow-md hover:shadow-lg hover:shadow-sky-200/50 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  {/* HD Image */}
                  <div className="relative w-full h-32 mb-4 overflow-hidden border border-sky-200" style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}>
                    <Image
                      src={useCase.image}
                      alt={useCase.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-white/20"></div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-sky-600 group-hover:text-sky-700 transition-colors uppercase tracking-wider leading-tight">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-700 text-xs leading-relaxed mb-4">
                    {useCase.description}
                  </p>
                  <span className="inline-flex items-center px-3 py-1.5 bg-sky-100 border border-sky-300 text-sky-700 text-xs font-semibold uppercase tracking-widest" style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}>
                    <Check className="h-3 w-3 mr-2" />
                    {useCase.results}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Light Theme */}
        <section className="py-16 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-4 py-2 mb-6 font-semibold text-xs uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Brain className="w-3 h-3 animate-pulse" />
                Advanced Features
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider leading-tight">
                Enterprise-Grade AI
                <br />
                <span className="text-gray-900">Call Center Features</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Deep technical capabilities that keep your contact center <strong className="text-sky-600">fast, compliant, and future-proof</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {featureBlocks.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white border border-sky-200 p-6 hover:border-sky-400 shadow-md hover:shadow-lg hover:shadow-sky-200/50 transition-all duration-500"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  {/* HD Image */}
                  <div className="relative w-full h-32 mb-4 overflow-hidden border border-sky-200" style={{
                    clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                  }}>
                    <Image
                      src={feature.image}
                      alt={feature.heading}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-900/10 to-white/20"></div>
                    <div className="absolute bottom-2 left-2">
                      <div className="w-8 h-8 bg-sky-500 flex items-center justify-center text-white" style={{
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                      }}>
                        <feature.icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-4">
                    <h3 className="text-lg font-bold text-sky-600 group-hover:text-sky-700 transition-colors uppercase tracking-wider leading-tight">
                      {feature.heading}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs leading-relaxed">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section - Light Theme */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-4 py-2 mb-6 font-semibold text-xs uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="h-3 w-3 animate-pulse" />
                Live AI Demo
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider leading-tight">
                Hear Our AI Call Center
                <br />
                <span className="text-gray-900">in Action</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Experience how AI <strong className="text-sky-600">routes calls, verifies identities, and resolves requests</strong> with human-level empathy
              </p>
            </div>
            <div className="bg-white border border-sky-200 p-6 shadow-lg shadow-sky-100/20" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <VoiceConversationPlayer audioSrc="/sample-conversation.mp3" />
            </div>
          </div>
        </section>

        {/* FAQ Section - Light Theme */}
        <section className="relative py-16 overflow-hidden bg-gray-50">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-radial from-sky-400/8 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-radial from-sky-300/6 to-transparent rounded-full blur-3xl animate-pulse delay-300" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-sky-400/5 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white border border-sky-500 px-4 py-2 mb-6 font-semibold text-xs uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <HeadphonesIcon className="w-3 h-3 animate-pulse" />
                Common Questions
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent uppercase tracking-wider leading-tight">
                Frequently Asked
                <br />
                <span className="text-gray-900">Questions</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Quick answers for leaders <strong className="text-sky-600">evaluating AI call center solutions</strong>
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-4">
              {faqSchema.mainEntity.map((faq, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-sky-200 p-6 hover:border-sky-400 shadow-md hover:shadow-lg hover:shadow-sky-200/50 transition-all duration-500"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform duration-500 group-hover:scale-110" style={{
                        clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                      }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-3 text-sky-600 group-hover:text-sky-700 transition-colors uppercase tracking-wider">
                        {faq.name}
                      </h3>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {faq.acceptedAnswer.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action - Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-sky-400/15 to-sky-500/15 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-sky-500/12 to-sky-600/12 rounded-full blur-lg animate-pulse delay-1000" />
            <div className="absolute top-16 right-32 w-16 h-16 bg-gradient-to-br from-sky-300/20 to-sky-400/20 rounded-full blur-lg animate-pulse delay-500" />
          </div>

          <div className="container mx-auto max-w-4xl text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 mb-4 border border-sky-500 uppercase tracking-widest" style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}>
              <Phone className="w-3 h-3" />
              <span className="text-xs font-bold">Transform Your Call Center</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent uppercase tracking-wide">
              Ready to Transform Your Contact Center?
            </h2>

            <p className="text-gray-700 text-sm mb-6 max-w-2xl leading-relaxed">
              Join 500+ businesses using AI call center technology to deliver world-class customer experiences, reduce operating costs by 40-60%, and drive measurable ROI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/signup">
                <button className="group relative bg-sky-500 hover:bg-sky-400 text-white px-6 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-400/30 border border-sky-500 uppercase tracking-wide w-full sm:w-auto flex justify-center items-center" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link href="/contact">
                <button className="group bg-white hover:bg-sky-50 text-sky-600 hover:text-sky-700 border border-sky-400/30 hover:border-sky-400 px-6 py-2 text-sm font-bold transition-all duration-300 backdrop-blur-md uppercase tracking-wide w-full sm:w-auto flex justify-center items-center" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Book Consultation
                </button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-gray-700">
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-sky-600" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-sky-600" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Check className="w-3 h-3 text-sky-600" />
                <span>Dedicated Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








