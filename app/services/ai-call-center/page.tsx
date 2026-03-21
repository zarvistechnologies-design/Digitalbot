"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { VoiceConversationPlayer } from "@/components/voice-conversation-player";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  Building2,
  Check,
  CheckCircle,
  Clock,
  HeadphonesIcon,
  MessageCircle,
  Mic,
  Pause,
  Phone,
  Play,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Core benefits - all 9 items restored with full content and images
const coreBenefits = [
  {
    icon: Building2,
    title: "Enterprise-Grade Contact Center",
    stat: "99.9%",
    statLabel: "Uptime SLA",
    description: "Launch a fully managed AI call center with elastic capacity, carrier-grade reliability, and compliance controls tailored to finance, healthcare, retail, and logistics enterprises.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Clock,
    title: "24/7 Intelligent Availability",
    stat: "24/7",
    statLabel: "Always On",
    description: "Deliver instant responses across every time zone. AI agents handle calls, email callbacks, and SMS follow-ups round-the-clock with consistent accuracy.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: TrendingUp,
    title: "Productivity Gains",
    stat: "85%",
    statLabel: "Automation",
    description: "Automate 85% of routine call center interactions and cut average handle times by 60%, allowing live agents to focus on complex escalations that drive revenue.",
    image: "https://images.unsplash.com/photo-1551434678-efb963407044?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    stat: "SOC2",
    statLabel: "Compliant",
    description: "SOC 2, HIPAA, PCI DSS, and GDPR compliant voice infrastructure with end-to-end encryption, redaction, and granular audit trails.",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: HeadphonesIcon,
    title: "Human-Centric Experiences",
    stat: "NLU",
    statLabel: "Powered",
    description: "Natural language understanding, sentiment detection, and empathetic speech synthesis deliver conversations that mirror your brand tone.",
    image: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Users,
    title: "Omnichannel Continuity",
    stat: "5+",
    statLabel: "Channels",
    description: "Carry context seamlessly from inbound calls to SMS, WhatsApp, email, and live chat handoffs, eliminating repetitive customer verification.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: BarChart3,
    title: "Real-Time Intelligence",
    stat: "Live",
    statLabel: "Analytics",
    description: "Supervisors receive live dashboards with queue analytics, AI quality scoring, agent coaching suggestions, and automated compliance flags.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Zap,
    title: "Rapid Deployment",
    stat: "<14",
    statLabel: "Days Live",
    description: "Pre-built call flows, multilingual voice models, and CRM connectors allow enterprises to go live in under 14 days with zero downtime.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Brain,
    title: "No-Code Orchestration",
    stat: "A/B",
    statLabel: "Testing",
    description: "Design, test, and iterate complex IVR replacements with visual builders, reusable conversation blocks, and A/B testing out of the box.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  }
];

// Use cases - all 4 with full descriptions restored and images
const useCases = [
  {
    title: "Customer Support Automation",
    description: "Route and resolve high-volume support calls automatically. AI agents authenticate callers, surface knowledge articles, and complete account actions without human intervention.",
    result: "Reduce cost per call by 70%",
    icon: HeadphonesIcon,
    color: "from-orange-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1553775282-20af80779df7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Revenue & Upsell Campaigns",
    description: "Run proactive retention and cross-sell campaigns with AI that understands customer history, proposes relevant offers, and captures payments securely.",
    result: "Grow upsell conversions by 45%",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500",
    image: "https://images.unsplash.com/photo-1551434678-efb963407044?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Field Service Dispatch",
    description: "Automatically triage incident calls, schedule engineers, and confirm appointments while syncing updates to workforce management tools in real time.",
    result: "Cut dispatch delays by 55%",
    icon: Users,
    color: "from-orange-500 to-orange-500",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Compliance Hotlines",
    description: "Provide confidential hotlines with voice biometrics, call transcription, and automated routing to the right compliance teams within SLA windows.",
    result: "Achieve 100% policy adherence",
    icon: Shield,
    color: "from-orange-400 to-orange-400",
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=800&q=80"
  }
];

// Advanced features - all 4 with full descriptions restored and images
const advancedFeatures = [
  {
    icon: Phone,
    title: "Carrier-Grade Voice Infrastructure",
    description: "Redundant SIP trunks, automatic call distribution, and smart failover ensure every inbound and outbound interaction connects instantly and clearly.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Target,
    title: "Smart Intent Routing",
    description: "Machine learning models detect intent in the first three seconds of audio and route customers to AI workflows or human specialists based on priority.",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: MessageCircle,
    title: "Agent Assist & Collaboration",
    description: "Surface live transcripts, objection handling scripts, and AI-generated summaries directly inside your agent desktop for lightning-fast resolutions.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Mic,
    title: "Accurate Speech Intelligence",
    description: "Multi-accent recognition, noise suppression, and adaptive speech synthesis deliver natural, inclusive experiences across 60+ languages.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80"
  }
];

// FAQ Schema
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
};

// Product Schema
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
};

export default function AICallCenter() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [activeUseCase, setActiveUseCase] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fade-in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate use cases
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUseCase((prev) => (prev + 1) % useCases.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Audio playback handler
  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          console.log("Audio playback blocked by browser");
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden">
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src="/audio/call-center-demo.mp3"
          onEnded={handleAudioEnded}
          preload="metadata"
        />

        <Header />

        <main className="flex-1 relative z-10">
          {/* Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

          {/* HERO SECTION - Modern Two-Column Like Appointments */}
          <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-br from-[#fafbff] via-white to-white flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Floating Orbs */}
              <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
              
              {/* Animated Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }} />
              
              {/* Animated Lines */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }} />
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/15 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
            </div>

            <div className="container mx-auto relative z-30 max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                
                {/* Left Side - Content */}
                <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 glass-card bg-orange-50/60 border border-orange-200/40 px-4 py-2 rounded-full mb-6">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">Enterprise AI Call Center</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    <span className="block text-black">Transform Your</span>
                    <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-600 bg-clip-text text-transparent">Call Center with AI</span>
                  </h1>

                  {/* Tagline Box */}
                  <div className="bg-gradient-to-r from-orange-50/60 to-orange-50/40 border border-orange-200/40 rounded-2xl p-5 mb-6">
                    <p className="text-gray-600 text-sm italic mb-1">&quot;Every missed call is a missed opportunity.&quot;</p>
                    <p className="text-orange-600 font-bold text-base uppercase tracking-wider">LET AI HANDLE UNLIMITED CALLS 24/7.</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Deploy an <strong className="text-orange-600">AI-powered call center</strong> with intelligent routing, real-time analytics, and seamless CRM integration — trusted by <strong className="text-orange-600">500+ businesses</strong> managing <strong>2M+ conversations</strong> monthly.
                  </p>

                  {/* Audio Player */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-gray-500 mb-2">🎧 Hear AI in Action</p>
                    <button
                      onClick={toggleAudio}
                      className="w-full max-w-md bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-md border border-gray-200 hover:shadow-lg hover:border-orange-300/40 transition-all group"
                    >
                      <div className="flex-1 flex items-center justify-center h-8">
                        <svg width="160" height="32" viewBox="0 0 160 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#f97316" />
                              <stop offset="1" stopColor="#c2410c" />
                            </linearGradient>
                          </defs>
                          {[6, 10, 18, 26, 22, 16, 10, 8, 14, 20, 28, 24, 15, 10, 8, 6, 12, 20, 26, 20, 14, 10, 8, 12, 18, 24].map((h, i) => (
                            isPlaying ? (
                              <motion.rect
                                key={i}
                                x={6 * i + 2}
                                width="4"
                                rx="2"
                                fill="url(#waveGradient)"
                                animate={{
                                  y: [32 - h, 32 - h - 10, 32 - h],
                                  height: [h, h + 10, h]
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.7 + (i % 4) * 0.1,
                                  delay: i * 0.04,
                                  ease: "easeInOut"
                                }}
                                y={32 - h}
                                height={h}
                              />
                            ) : (
                              <rect key={i} x={6 * i + 2} y={32 - h} width="4" height={h} rx="2" fill="url(#waveGradient)" />
                            )
                          ))}
                        </svg>
                      </div>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </div>
                    </button>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                    <Link
                      href="/contact?service=customer-support"
                      className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Start Free Trial
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/contact#contact-form"
                      className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-200/40 font-bold rounded-xl hover:bg-orange-50/60 hover:border-orange-300/40 transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Book Demo
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs">No credit card</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs">Live in 14 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs">40-60% cost savings</span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Visual */}
                <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                  <div className="relative">
                    {/* Animated Sound Waves */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                      <svg width="400" height="400" viewBox="0 0 400 400" fill="none" style={{ filter: 'drop-shadow(0 0 40px #f97316aa)' }}>
                        <circle cx="200" cy="200" r="100" stroke="#fb923c" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                        <circle cx="200" cy="200" r="130" stroke="#f97316" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />
                        <circle cx="200" cy="200" r="160" stroke="#ea580c" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }} />
                      </svg>
                    </div>
                    
                    {/* Main Image */}
                    <div className="relative w-[34rem] h-[34rem] lg:w-[38rem] lg:h-[38rem] rounded-3xl overflow-hidden z-20 bg-transparent">
                      <Image
                        src="https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval/Gemini_Generated_Image_1nuiqi1nuiqi1nui_srcote"
                        alt="AI Call Center Dashboard"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    
                    {/* Floating Badge - Bottom Right */}
                    <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">2M+</p>
                          <p className="text-sm text-gray-500">Calls/Month</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Badge - Top Left */}
                    <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">500+</p>
                          <p className="text-sm text-gray-500">Businesses</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS SECTION - Horizontal Stats Cards */}
          <section 
            id="benefits-section" 
            data-animate
            className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Bot className="w-4 h-4" />
                  Why Choose DigitalBot
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade <span className="text-orange-600">AI Call Center</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Powerful automation with measurable outcomes for modern contact centers
                </p>
              </div>

              {/* Stats Grid - 9 items in 3 rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {coreBenefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`group bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200/40 transition-all duration-500 hover:-translate-y-2 ${visibleSections.has('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    {/* Image */}
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={benefit.image}
                        alt={benefit.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl font-bold text-white">{benefit.stat}</span>
                          <span className="text-xs text-white/80 ml-1 uppercase">{benefit.statLabel}</span>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm group-hover:text-orange-600 transition-colors">{benefit.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* USE CASES SECTION - Interactive Tabs */}
          <section 
            id="usecases-section" 
            data-animate
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('usecases-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Target className="w-4 h-4" />
                  Proven Results
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  AI Call Center <span className="text-orange-600">Use Cases</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Transform every customer touchpoint with proven automation playbooks
                </p>
              </div>

              {/* Interactive Use Cases */}
              <div className={`grid lg:grid-cols-5 gap-6 transition-all duration-700 ${visibleSections.has('usecases-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Tabs */}
                <div className="lg:col-span-2 flex lg:flex-col gap-2">
                  {useCases.map((useCase, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveUseCase(index)}
                      className={`flex-1 lg:flex-none flex items-center gap-3 p-4 rounded-xl transition-all duration-300 text-left ${
                        activeUseCase === index
                          ? 'bg-white shadow-lg border-2 border-orange-500'
                          : 'bg-white/50 border border-gray-200 hover:bg-white hover:shadow-md'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${useCase.color} ${activeUseCase === index ? 'scale-110' : ''} transition-transform`}>
                        <useCase.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <h4 className={`font-bold ${activeUseCase === index ? 'text-orange-600' : 'text-gray-700'}`}>
                          {useCase.title}
                        </h4>
                        <p className="text-xs text-gray-500">{useCase.result}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={useCases[activeUseCase].image}
                      alt={useCases[activeUseCase].title}
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${useCases[activeUseCase].color}`}>
                          {(() => {
                            const Icon = useCases[activeUseCase].icon;
                            return <Icon className="w-7 h-7 text-white" />;
                          })()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{useCases[activeUseCase].title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold text-sm">{useCases[activeUseCase].result}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Text Content */}
                  <div className="p-6">
                    <p className="text-gray-600 text-base leading-relaxed mb-4">
                      {useCases[activeUseCase].description}
                    </p>
                    <Link
                      href="/contact#contact-form"
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ADVANCED FEATURES - Bento Grid Layout */}
          <section 
            id="features-section" 
            data-animate
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Brain className="w-4 h-4" />
                  Advanced Technology
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade <span className="text-orange-600">Features</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Deep technical capabilities for fast, compliant, future-proof contact centers
                </p>
              </div>

              {/* Bento Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ${visibleSections.has('features-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Feature 1 - Large Card */}
                <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={advancedFeatures[0].image}
                      alt={advancedFeatures[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[400px] lg:min-h-[500px] p-8 flex flex-col justify-end">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = advancedFeatures[0].icon;
                        return <Icon className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {advancedFeatures[0].title}
                    </h3>
                    <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-xl">
                      {advancedFeatures[0].description}
                    </p>
                  </div>
                </div>

                {/* Feature 2 - Medium Card */}
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={advancedFeatures[1].image}
                      alt={advancedFeatures[1].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[240px] p-6 flex flex-col justify-end">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                      {(() => {
                        const Icon = advancedFeatures[1].icon;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {advancedFeatures[1].title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                      {advancedFeatures[1].description}
                    </p>
                  </div>
                </div>

                {/* Feature 3 - Medium Card */}
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={advancedFeatures[2].image}
                      alt={advancedFeatures[2].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[240px] p-6 flex flex-col justify-end">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                      {(() => {
                        const Icon = advancedFeatures[2].icon;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {advancedFeatures[2].title}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                      {advancedFeatures[2].description}
                    </p>
                  </div>
                </div>

                {/* Feature 4 - Wide Card */}
                <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={advancedFeatures[3].image}
                      alt={advancedFeatures[3].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="relative h-full min-h-[200px] lg:min-h-[250px] p-8 flex flex-col justify-center max-w-2xl">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = advancedFeatures[3].icon;
                        return <Icon className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {advancedFeatures[3].title}
                    </h3>
                    <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                      {advancedFeatures[3].description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEMO SECTION */}
          <section 
            id="demo-section" 
            data-animate
            className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className={`text-center mb-8 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Mic className="w-4 h-4" />
                  Live AI Demo
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Hear AI <span className="text-orange-600">in Action</span>
                </h2>
                <p className="text-gray-600">
                  Experience how AI routes calls, verifies identities, and resolves requests with human-level empathy
                </p>
              </div>

              <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <VoiceConversationPlayer audioSrc="/sample-conversation.mp3" />
              </div>
            </div>
          </section>

          {/* FAQ SECTION - Accordion Style */}
          <section 
            id="faq-section" 
            data-animate
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <HeadphonesIcon className="w-4 h-4" />
                  FAQ
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Common <span className="text-orange-600">Questions</span>
                </h2>
                <p className="text-gray-600">
                  Quick answers for leaders evaluating AI call center solutions
                </p>
              </div>

              <div className={`space-y-4 transition-all duration-700 ${visibleSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {faqSchema.mainEntity.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-50 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <h3 className="font-bold text-gray-900 flex-1">{faq.name}</h3>
                      <div className="w-6 h-6 rounded-full bg-orange-50/60 flex items-center justify-center group-open:rotate-180 transition-transform">
                        <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </summary>
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-gray-600 pl-12">{faq.acceptedAnswer.text}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your<br />Contact Center?
              </h2>
              <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                Join 500+ businesses using AI call center technology to deliver world-class experiences and reduce costs by 40-60%.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/contact?service=customer-support"
                  className="group px-8 py-4 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50/60 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="px-8 py-4 bg-transparent text-white border-2 border-white/30 font-bold rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Book Consultation
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 justify-center text-sm text-orange-100">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>No Setup Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Enterprise Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Float animation keyframes */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}








