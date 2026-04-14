"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { VoiceConversationPlayer } from "@/components/voice-conversation-player";
import { motion } from "framer-motion";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Check,
    CheckCircle,
    ClipboardCheck,
    Clock,
    Globe,
    HeartHandshake,
    MessageCircle,
    Mic,
    Pause,
    Phone,
    Play,
    Shield,
    Smile,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Workflow
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Benefits data - all 9 original benefits preserved
const benefits = [
  {
    icon: HeartHandshake,
    title: "Customer Empathy at Scale",
    stat: "98%",
    statLabel: "Satisfaction",
    description: "Deliver empathetic conversations in real time with AI agents trained on your brand tone, knowledge base, and historical interactions.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Clock,
    title: "Instant 24/7 Resolutions",
    stat: "<2s",
    statLabel: "Response",
    description: "Provide lightning-fast support across chat, voice, email, and messaging channels with AI that never sleeps and never keeps customers waiting.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Sparkles,
    title: "Personalized Journeys",
    stat: "3x",
    statLabel: "Engagement",
    description: "Reference past purchases, preferences, and sentiment in every conversation to create delightful, relevant support experiences.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    stat: "100%",
    statLabel: "Compliant",
    description: "HIPAA, SOC 2, and GDPR compliant infrastructure with automatic redaction, encryption, and role-based access control for sensitive cases.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Users,
    title: "Agent Augmentation",
    stat: "5x",
    statLabel: "Faster",
    description: "Give human teams AI copilots that summarize tickets, recommend next best actions, and draft responses in seconds.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Bot,
    title: "Unified Knowledge Automation",
    stat: "1",
    statLabel: "Platform",
    description: "Connect your FAQs, product docs, LMS, and community forums into a single AI-ready knowledge layer refreshed continuously.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: BarChart3,
    title: "Outcome-Based Analytics",
    stat: "360°",
    statLabel: "Insights",
    description: "Track KPIs like first contact resolution, customer effort, sentiment trends, and churn risk through intuitive dashboards.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Globe,
    title: "Global Language Support",
    stat: "60+",
    statLabel: "Languages",
    description: "Serve customers in 60+ languages with natural accents and adaptive translations that preserve context and nuance.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Workflow,
    title: "No-Code Automation",
    stat: "0",
    statLabel: "Code Needed",
    description: "Build, test, and optimize multi-step customer workflows without writing code using visual journeys and A/B testing tools.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  }
];

// Use cases - all 4 preserved
const useCases = [
  {
    title: "Omnichannel Case Deflection",
    description: "Resolve up to 80% of repetitive questions across live chat, social media, and email with AI responses that access your knowledge base instantly.",
    result: "Cut ticket backlog by 65%",
    icon: MessageCircle,
    color: "from-orange-400 to-orange-600",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Proactive Customer Care",
    description: "Automatically detect churn signals and reach out with personalized retention offers before customers submit cancellations.",
    result: "Reduce churn by 35%",
    icon: HeartHandshake,
    color: "from-orange-400 to-orange-600",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Technical Troubleshooting",
    description: "Guide users through complex troubleshooting sequences with step-by-step instructions, multimedia explanations, and escalation to specialists when needed.",
    result: "92% first contact resolution",
    icon: ClipboardCheck,
    color: "from-orange-400 to-orange-600",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Order & Account Management",
    description: "Handle refunds, order tracking, account updates, and subscription changes automatically while syncing changes to CRM, billing, and ERP systems.",
    result: "Save 3,000 agent hours/quarter",
    icon: BarChart3,
    color: "from-orange-400 to-orange-600",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80"
  }
];

// Capability blocks - all 4 preserved
const capabilityBlocks = [
  {
    icon: MessageCircle,
    heading: "Context-Aware Conversation Engine",
    body: "DigitalBot understands intent, sentiment, and emotion across sessions, giving customers consistent, human-quality interactions every time.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: ClipboardCheck,
    heading: "Automated Quality Management",
    body: "Score 100% of interactions automatically against custom rubrics, surface coaching opportunities, and enforce compliance in real time.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Smile,
    heading: "Customer Delight Toolkit",
    body: "Trigger loyalty offers, CSAT surveys, and follow-up journeys based on satisfaction levels and lifecycle stages to maximize customer happiness.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: BarChart3,
    heading: "Unified Support Intelligence",
    body: "Gain a single view of all support metrics, including AI-only vs. blended team performance, trending topics, and agent adoption.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

// FAQ Schema for SEO
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
};

// Product Schema for SEO
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
};

export default function AICustomerSupport() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRefHindi = useRef<HTMLAudioElement>(null);

  // Fade-in on mount
  useEffect(() => {
    setIsVisible(true);
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

  // Auto-rotate use cases
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUseCase((prev) => (prev + 1) % useCases.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Audio handlers
  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => console.log("Audio blocked"));
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleAudioHindi = useCallback(() => {
    if (audioRefHindi.current) {
      if (isPlayingHindi) {
        audioRefHindi.current.pause();
      } else {
        audioRefHindi.current.play().catch(() => console.log("Hindi audio blocked"));
      }
      setIsPlayingHindi(!isPlayingHindi);
    }
  }, [isPlayingHindi]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioEndedHindi = useCallback(() => {
    setIsPlayingHindi(false);
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
        {/* Hidden audio elements */}
        <audio
          ref={audioRef}
          src="/audio/customer-care-sample.mp3"
          onEnded={handleAudioEnded}
          preload="metadata"
        />
        <audio
          ref={audioRefHindi}
          src="/audio/customer-care-sample.mp3"
          onEnded={handleAudioEndedHindi}
          preload="metadata"
        />

        <Header />

        <main className="flex-1 relative z-10">
          {/* Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

          {/* HERO SECTION - Modern Two-Column Like Appointments */}
          <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-white flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Floating Orbs */}



              
              {/* Animated Grid */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }} />
              
              {/* Animated Lines */}
              <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }} />
              <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-300/15 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
            </div>

            <div className="container mx-auto relative z-30 max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
                
                {/* Left Side - Content */}
                <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 glass-card bg-orange-50/60 border border-orange-200/40 px-4 py-2 rounded-full mb-6">
                    <HeartHandshake className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">AI Customer Support Platform</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 mb-4 leading-tight animate-fade-in-up-2">
                    <span className="block text-black">AI Customer Support That</span>
                    <span className="block text-orange-500">Never Sleeps Always Helps</span>
                  </h1>

                  {/* Tagline Box */}
                  <div className="bg-gradient-to-r from-orange-50/60 to-orange-50/30 border border-orange-200/40 rounded-2xl p-5 mb-6">
                    <p className="text-gray-600 text-sm italic mb-1">&quot;Every unanswered ticket is a customer considering your competitor.&quot;</p>
                    <p className="text-orange-600 font-bold text-base uppercase tracking-wider">LET AI DELIGHT EVERY CUSTOMER 24/7.</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Deploy <strong className="text-orange-600">AI customer support</strong> that resolves issues instantly across all channels — trusted by <strong className="text-orange-600">500+ businesses</strong> handling <strong>2M+ conversations</strong> monthly.
                  </p>

                  {/* Dual Audio Players */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* English Audio Player */}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">🇺🇸 English Demo</p>
                      <button
                        onClick={toggleAudio}
                        className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all group"
                      >
                        <div className="flex-1 flex items-center justify-center h-6">
                          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="pulseGradientSupport" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f97316" />
                                <stop offset="1" stopColor="#ea580c" />
                              </linearGradient>
                            </defs>
                            {[4, 8, 14, 20, 16, 12, 7, 5, 10, 15, 22, 18, 11, 7, 5, 4, 8, 14, 20, 16].map((h, i) => (
                              isPlaying ? (
                                <motion.rect
                                  key={i}
                                  x={6 * i + 1}
                                  width="3"
                                  rx="1.5"
                                  fill="url(#pulseGradientSupport)"
                                  animate={{
                                    y: [24 - h, 24 - h - 8, 24 - h],
                                    height: [h, h + 8, h]
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.8 + (i % 4) * 0.1,
                                    delay: i * 0.05,
                                    ease: "easeInOut"
                                  }}
                                  y={24 - h}
                                  height={h}
                                />
                              ) : (
                                <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientSupport)" />
                              )
                            ))}
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500 text-white shadow-md">
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </div>
                      </button>
                    </div>

                    {/* Hindi Audio Player */}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">🇮🇳 Hindi Demo</p>
                      <button
                        onClick={toggleAudioHindi}
                        className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all group"
                      >
                        <div className="flex-1 flex items-center justify-center h-6">
                          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="pulseGradientSupportHindi" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f97316" />
                                <stop offset="1" stopColor="#ea580c" />
                              </linearGradient>
                            </defs>
                            {[4, 8, 14, 20, 16, 12, 7, 5, 10, 15, 22, 18, 11, 7, 5, 4, 8, 14, 20, 16].map((h, i) => (
                              isPlayingHindi ? (
                                <motion.rect
                                  key={i}
                                  x={6 * i + 1}
                                  width="3"
                                  rx="1.5"
                                  fill="url(#pulseGradientSupportHindi)"
                                  animate={{
                                    y: [24 - h, 24 - h - 8, 24 - h],
                                    height: [h, h + 8, h]
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 0.8 + (i % 4) * 0.1,
                                    delay: i * 0.05,
                                    ease: "easeInOut"
                                  }}
                                  y={24 - h}
                                  height={h}
                                />
                              ) : (
                                <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientSupportHindi)" />
                              )
                            ))}
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-orange-500 text-white shadow-md">
                          {isPlayingHindi ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                    <Link
                      href="/contact?service=customer-support"
                      className="group px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      Start Free Trial
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      href="/contact#contact-form"
                      className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-200/40 font-bold rounded-xl hover:bg-orange-50/60 hover:border-orange-300 transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Book Demo
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-xs">No credit card</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-xs">Live in 10 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                      <span className="text-xs">50% cost savings</span>
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
                    <div className="relative w-[34rem] h-[34rem] lg:w-[38rem] lg:h-[38rem] rounded-3xl overflow-hidden z-20  bg-transparent">
                      <Image
                        src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/Gemini_Generated_Image_14txfw14txfw14tx_ducve4"
                        alt="AI Customer Support Dashboard"
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                    
                    {/* Floating Badge - Bottom Right */}
                    <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">2M+</p>
                          <p className="text-sm text-gray-500">Chats/Month</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Badge - Top Left */}
                    <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">98%</p>
                          <p className="text-sm text-gray-500">CSAT Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BENEFITS SECTION - Image Cards Grid */}
          <section 
            id="benefits-section" 
            data-animate
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  Why Choose DigitalBot
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade <span className="text-orange-600">AI Support</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Powerful automation with measurable outcomes for modern support teams
                </p>
              </div>

              {/* Benefits Grid - 9 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {benefits.map((benefit, index) => (
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
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                          <benefit.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-white font-bold text-lg">{benefit.stat}</span>
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
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('usecases-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Target className="w-4 h-4" />
                  Proven Results
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  AI Support <span className="text-orange-600">Use Cases</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Real-world outcomes from DigitalBot customers worldwide
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
                            <CheckCircle className="w-4 h-4 text-orange-400" />
                            <span className="text-orange-400 font-semibold text-sm">{useCases[activeUseCase].result}</span>
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
                      href="/contact?service=customer-support"
                      className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CAPABILITIES - Bento Grid Layout */}
          <section 
            id="capabilities-section" 
            data-animate
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('capabilities-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Bot className="w-4 h-4" />
                  Platform Capabilities
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Support Leaders <span className="text-orange-600">Trust</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Deep technical advantages that keep customers informed and delighted
                </p>
              </div>

              {/* Bento Grid */}
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 ${visibleSections.has('capabilities-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Feature 1 - Large Card */}
                <div className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={capabilityBlocks[0].image}
                      alt={capabilityBlocks[0].heading}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[400px] lg:min-h-[500px] p-8 flex flex-col justify-end">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = capabilityBlocks[0].icon;
                        return <Icon className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {capabilityBlocks[0].heading}
                    </h3>
                    <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-xl">
                      {capabilityBlocks[0].body}
                    </p>
                  </div>
                </div>

                {/* Feature 2 - Medium Card */}
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={capabilityBlocks[1].image}
                      alt={capabilityBlocks[1].heading}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[240px] p-6 flex flex-col justify-end">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                      {(() => {
                        const Icon = capabilityBlocks[1].icon;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {capabilityBlocks[1].heading}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                      {capabilityBlocks[1].body}
                    </p>
                  </div>
                </div>

                {/* Feature 3 - Medium Card */}
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={capabilityBlocks[2].image}
                      alt={capabilityBlocks[2].heading}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="relative h-full min-h-[240px] p-6 flex flex-col justify-end">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3">
                      {(() => {
                        const Icon = capabilityBlocks[2].icon;
                        return <Icon className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {capabilityBlocks[2].heading}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                      {capabilityBlocks[2].body}
                    </p>
                  </div>
                </div>

                {/* Feature 4 - Wide Card */}
                <div className="md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-3xl cursor-pointer">
                  <div className="absolute inset-0">
                    <Image
                      src={capabilityBlocks[3].image}
                      alt={capabilityBlocks[3].heading}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                  <div className="relative h-full min-h-[200px] lg:min-h-[250px] p-8 flex flex-col justify-center max-w-2xl">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                      {(() => {
                        const Icon = capabilityBlocks[3].icon;
                        return <Icon className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {capabilityBlocks[3].heading}
                    </h3>
                    <p className="text-white/80 text-base lg:text-lg leading-relaxed">
                      {capabilityBlocks[3].body}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DEMO SECTION - Full Voice Player */}
          <section 
            id="demo-section" 
            data-animate
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className={`text-center mb-8 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Mic className="w-4 h-4" />
                  Live AI Demo
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Experience AI Support <span className="text-orange-600">in Action</span>
                </h2>
                <p className="text-gray-600">
                  Hear how AI resolves support tickets with calm, accurate, and friendly responses
                </p>
              </div>

              <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <VoiceConversationPlayer audioSrc="/audio/customer-care-sample.mp3" />
              </div>
            </div>
          </section>

          {/* FAQ SECTION - Accordion Style */}
          <section 
            id="faq-section" 
            data-animate
            className="py-20 bg-white relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <MessageCircle className="w-4 h-4" />
                  FAQ
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Common <span className="text-orange-600">Questions</span>
                </h2>
                <p className="text-gray-600">
                  Quick answers for leaders evaluating AI customer support solutions
                </p>
              </div>

              <div className={`space-y-4 transition-all duration-700 ${visibleSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {faqSchema.mainEntity.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-50 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-900 flex-1">{faq.name}</span>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5 pl-17 ml-12">
                      <p className="text-gray-600">{faq.acceptedAnswer.text}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className="py-20 bg-orange-600 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your<br />Customer Support?
              </h2>
              <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                Join 500+ businesses using AI customer support to deliver world-class experiences and reduce costs by 50%.
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
                  <Check className="w-5 h-5 text-orange-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-orange-400" />
                  <span>Live in 10 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-orange-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* CSS Keyframes */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
}








