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
    DollarSign,
    Globe,
    MessageCircle,
    Mic,
    Pause,
    Phone,
    Play,
    Rocket,
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

// Benefits data - Sales focused
const benefits = [
  {
    icon: Target,
    title: "Lead Qualification",
    stat: "3x",
    statLabel: "More Leads",
    description: "AI sales agents ask intelligent qualifying questions, score leads based on your criteria, and automatically route hot leads to your sales team.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Zap,
    title: "Instant Response",
    stat: "<5s",
    statLabel: "Response",
    description: "Respond to leads instantly 24/7 with AI that never sleeps. 70% reduction in lead response time means more conversions.",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: TrendingUp,
    title: "45% Higher Conversion",
    stat: "45%",
    statLabel: "Conversion",
    description: "Our AI handles objections about price, timing, competition, and features using proven sales techniques that close deals.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Users,
    title: "Team Augmentation",
    stat: "10x",
    statLabel: "Scale",
    description: "AI complements your sales team by handling initial outreach and follow-ups, freeing reps to focus on high-value conversations.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Globe,
    title: "24/7 Outreach",
    stat: "24/7",
    statLabel: "Always On",
    description: "Sales reps sleep, take breaks, get tired, need training. AI never does. Always selling, always closing, always available.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: BarChart3,
    title: "CRM Integration",
    stat: "100%",
    statLabel: "Synced",
    description: "Seamlessly integrates with your CRM to log calls, update records, and trigger automated workflows after every conversation.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Shield,
    title: "Objection Handling",
    stat: "95%",
    statLabel: "Handled",
    description: "Trained on thousands of sales conversations to handle common objections about price, timing, competition, and features.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: DollarSign,
    title: "Revenue Scaling",
    stat: "3x",
    statLabel: "Revenue",
    description: "Scale revenue without scaling headcount. Automate conversations and close more deals with the same team size.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Rocket,
    title: "Fast Deployment",
    stat: "7",
    statLabel: "Days",
    description: "Most businesses are up and running within 5-7 days. We help configure sales scripts, integrate with CRM, and train the AI.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
  }
];

// Use cases
const useCases = [
  {
    title: "Lead Qualification",
    description: "AI sales agents ask intelligent qualifying questions, score leads based on your criteria, and automatically route hot leads to your sales team while nurturing cold leads.",
    result: "3x more qualified leads",
    icon: Target,
    color: "from-orange-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Deal Closing",
    description: "Handle objections, present pricing, overcome hesitation, and guide prospects to purchase decisions with natural, persuasive conversations.",
    result: "45% higher conversion",
    icon: DollarSign,
    color: "from-orange-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Follow-up Automation",
    description: "Never let a lead go cold. Automatically follow up at the perfect time with personalized messages that move prospects through your pipeline.",
    result: "70% faster response time",
    icon: Zap,
    color: "from-orange-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Pipeline Management",
    description: "Track every conversation, update CRM records automatically, and get real-time insights into your sales pipeline performance.",
    result: "100% CRM accuracy",
    icon: BarChart3,
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  }
];

// Capability blocks
const capabilityBlocks = [
  {
    icon: MessageCircle,
    heading: "Natural Sales Conversations",
    body: "AI that sounds human, handles objections naturally, and builds rapport with prospects using proven sales psychology and techniques.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Target,
    heading: "Intelligent Lead Scoring",
    body: "Automatically score and prioritize leads based on engagement, buying signals, and your custom criteria. Focus on leads that convert.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: TrendingUp,
    heading: "Sales Performance Analytics",
    body: "Track conversion rates, call quality, objection patterns, and winning strategies. Optimize your sales process with data-driven insights.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: Bot,
    heading: "Multi-Channel Outreach",
    body: "Reach prospects via voice calls, SMS, email, and chat. Consistent messaging across all channels with centralized tracking and reporting.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
  }
];

// FAQ Schema for SEO
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is an AI sales agent and how does it work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An AI sales agent is an intelligent voice assistant that handles sales conversations, qualifies leads, answers questions, handles objections, and closes deals automatically using natural language processing and machine learning."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI sales agents replace human sales reps?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI sales agents complement your sales team by handling initial outreach, lead qualification, and follow-ups. This frees your human reps to focus on high-value conversations and relationship building."
      }
    },
    {
      "@type": "Question",
      "name": "How do AI sales agents qualify leads?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "AI sales agents ask intelligent qualifying questions, score leads based on your criteria, and automatically route hot leads to your sales team while nurturing cold leads with follow-up campaigns."
      }
    },
    {
      "@type": "Question",
      "name": "What is the ROI of using AI sales agents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Businesses typically see 45% higher conversion rates, 70% reduction in lead response time, and 3x more qualified leads. ROI is delivered within the first 30-60 days."
      }
    },
    {
      "@type": "Question",
      "name": "Can AI sales agents handle objections?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our AI is trained on thousands of sales conversations and can handle common objections about price, timing, competition, and features using proven sales techniques."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can I deploy AI sales agents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most businesses are up and running within 5-7 days. We help configure sales scripts, integrate with CRM, and train the AI on your products/services."
      }
    }
  ]
};

// Product Schema for SEO
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "DigitalBot AI Sales Agent",
  "description": "AI-powered sales agent platform that qualifies leads, handles objections, and closes deals 24/7. Trusted by 500+ businesses with 45% higher conversion rates.",
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
    "url": "https://www.digitalbot.ai/services/ai-sales-agent"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500"
  }
};

export default function AISalesAgent() {
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden">
        {/* Hidden audio elements */}
        <audio
          ref={audioRef}
          src="/audio/sales-demo.mp3"
          onEnded={handleAudioEnded}
          preload="metadata"
        />
        <audio
          ref={audioRefHindi}
          src="/audio/sales-demo-hindi.mp3"
          onEnded={handleAudioEndedHindi}
          preload="metadata"
        />

        <Header />

        <main className="flex-1 relative z-10">
          {/* Structured Data */}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

          {/* HERO SECTION - Modern Two-Column */}
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
                    <Target className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">AI Sales Agent Platform</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    <span className="block text-black">Sales That</span>
                    <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">Never Stops</span>
                  </h1>

                  {/* Tagline Box */}
                  <div className="bg-gradient-to-r from-orange-50/60 to-orange-50/40 border border-orange-200/40 rounded-2xl p-5 mb-6">
                    <p className="text-gray-600 text-sm italic mb-1">&quot;Sales reps sleep, take breaks, get tired, need training.&quot;</p>
                    <p className="text-orange-600 font-bold text-base uppercase tracking-wider">WE NEVER DO.</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Transform sales with <strong className="text-orange-600">AI sales agents</strong> that qualify leads, handle objections, and close deals 24/7 — trusted by <strong className="text-orange-600">500+ businesses</strong> with <strong>45% higher conversion</strong> rates.
                  </p>

                  {/* Dual Audio Players */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    {/* English Audio Player */}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">🇺🇸 English Demo</p>
                      <button
                        onClick={toggleAudio}
                        className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300/40 transition-all group"
                      >
                        <div className="flex-1 flex items-center justify-center h-6">
                          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="pulseGradientSales" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
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
                                  fill="url(#pulseGradientSales)"
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
                                <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientSales)" />
                              )
                            ))}
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </div>
                      </button>
                    </div>

                    {/* Hindi Audio Player */}
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 mb-1.5">🇮🇳 Hindi Demo</p>
                      <button
                        onClick={toggleAudioHindi}
                        className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300/40 transition-all group"
                      >
                        <div className="flex-1 flex items-center justify-center h-6">
                          <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="pulseGradientSalesHindi" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
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
                                  fill="url(#pulseGradientSalesHindi)"
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
                                <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientSalesHindi)" />
                              )
                            ))}
                          </svg>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md">
                          {isPlayingHindi ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                    <Link
                      href="/contact#contact-form"
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
                      <span className="text-xs">Setup in 7 days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs">45% more conversions</span>
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
                    <div className="relative w-[28rem] h-[28rem] lg:w-[32rem] lg:h-[32rem] overflow-hidden z-20 bg-transparent">
                      <Image
                        src="https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/Gemini_Generated_Image_qfuhcfqfuhcfqfuh_nheyvx"
                        alt="AI Sales Agent Technology Dashboard"
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Optionally, you can keep a subtle overlay if needed for contrast, but now it's transparent */}
                    </div>
                    
                    {/* Floating Badge - Bottom Right */}
                    <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">45%</p>
                          <p className="text-sm text-gray-500">Higher Conversion</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Badge - Top Left */}
                    <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">3x</p>
                          <p className="text-sm text-gray-500">More Leads</p>
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
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('benefits-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  Why Choose DigitalBot
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade <span className="text-orange-600">AI Sales</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Powerful automation with measurable outcomes for modern sales teams
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
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
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
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-6xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('usecases-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Target className="w-4 h-4" />
                  Proven Results
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  AI Sales <span className="text-orange-600">Use Cases</span>
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

          {/* CAPABILITIES - Bento Grid Layout */}
          <section 
            id="capabilities-section" 
            data-animate
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className={`text-center mb-12 transition-all duration-700 ${visibleSections.has('capabilities-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Bot className="w-4 h-4" />
                  Platform Capabilities
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Sales Leaders <span className="text-orange-600">Trust</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Deep technical advantages that close more deals
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
            className="py-20 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          >
            <div className="container mx-auto px-4 max-w-4xl">
              <div className={`text-center mb-8 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Mic className="w-4 h-4" />
                  Live AI Demo
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Hear AI Sales Agent <span className="text-orange-600">in Action</span>
                </h2>
                <p className="text-gray-600">
                  Listen to how our AI handles real sales conversations and closes deals naturally
                </p>
              </div>

              <div className={`bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transition-all duration-700 ${visibleSections.has('demo-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <VoiceConversationPlayer audioSrc="/sample-sales-conversation.mp3" />
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
                  <MessageCircle className="w-4 h-4" />
                  FAQ
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  AI Sales Agent <span className="text-orange-600">FAQ</span>
                </h2>
                <p className="text-gray-600">
                  Everything you need to know about AI Sales Agents
                </p>
              </div>

              <div className={`space-y-4 transition-all duration-700 ${visibleSections.has('faq-section') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {faqSchema.mainEntity.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-gray-50 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center gap-4 p-5 cursor-pointer list-none hover:bg-gray-100 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
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
          <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to 10X Your<br />Sales with AI?
              </h2>
              <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
                Join 500+ businesses using AI sales agents to qualify more leads, close more deals, and scale revenue without scaling headcount.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  href="/contact#contact-form"
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
                  Schedule Demo
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 justify-center text-sm text-orange-100">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>Setup in 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <span>24/7 Support</span>
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








