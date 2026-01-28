"use client";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Award,
    BarChart3,
    Bot,
    Brain,
    CheckCircle,
    ChevronDown,
    Clock,
    Filter,
    Globe,
    Lightbulb,
    Lock,
    MessageSquare,
    Pause,
    Phone,
    PhoneCall,
    PieChart,
    Play,
    RefreshCw,
    Shield,
    Sparkles,
    Star,
    Target,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// Static data for dashboard carousel
const DASHBOARD_IMAGES = [
  { title: "Lead Scoring Dashboard", subtitle: "AI-powered lead prioritization", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" },
  { title: "Analytics Overview", subtitle: "Track conversions in real-time", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" },
  { title: "Call Intelligence", subtitle: "AI call analysis & insights", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" },
  { title: "Pipeline Management", subtitle: "Visualize your sales funnel", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop" },
  { title: "Team Performance", subtitle: "Monitor agent metrics", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop" },
] as const;

export default function LeadsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(0);
  
  // Audio refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRefHindi = useRef<HTMLAudioElement>(null);

  // Fade-in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-swap dashboard images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % DASHBOARD_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
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

  // Hindi Audio playback handler
  const toggleAudioHindi = useCallback(() => {
    if (audioRefHindi.current) {
      if (isPlayingHindi) {
        audioRefHindi.current.pause();
      } else {
        audioRefHindi.current.play().catch(() => {
          console.log("Hindi audio playback blocked by browser");
        });
      }
      setIsPlayingHindi(!isPlayingHindi);
    } else {
      setIsPlayingHindi(!isPlayingHindi);
    }
  }, [isPlayingHindi]);

  // Audio ended handlers
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleAudioEndedHindi = useCallback(() => {
    setIsPlayingHindi(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden">
      {/* Hidden audio elements - using existing audio files */}
      <audio
        ref={audioRef}
        src="/audio/lead-generation-sample.mp3"
        onEnded={handleAudioEnded}
        preload="metadata"
      />
      <audio
        ref={audioRefHindi}
        src="/audio/lead-generation-sample.mp3"
        onEnded={handleAudioEndedHindi}
        preload="metadata"
      />

      <Header />

      <main className="flex-1 relative z-10">

        {/* SECTION 1: HERO - Full Screen */}
        <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex items-center">
          {/* Animated Background Elements - Hero Style */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Floating Orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            
            {/* Animated Lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
          </div>

          <div className="container mx-auto relative z-30 max-w-7xl h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              
              {/* Left Side - Image (Swapped) */}
              <div className={`relative order-2 lg:order-1 flex justify-center lg:justify-start transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                {/* Main Image with Floating Effects */}
                <div className="relative">
                  {/* Animated Sound Waves SVG */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <svg width="340" height="340" viewBox="0 0 340 340" fill="none" style={{ filter: 'drop-shadow(0 0 32px #38bdf8aa)' }}>
                      <circle cx="170" cy="170" r="80" stroke="#38bdf8" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                      <circle cx="170" cy="170" r="110" stroke="#0ea5e9" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />
                      <circle cx="170" cy="170" r="140" stroke="#3b82f6" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }} />
                    </svg>
                  </div>
                  
                  <Image
                    src="/images/image/leadgeneration.png"
                    alt="AI Lead Intelligence Dashboard"
                    width={600}
                    height={500}
                    className="relative z-20 w-full max-w-md lg:max-w-lg h-auto object-contain rounded-3xl shadow-2xl"
                    style={{ filter: 'drop-shadow(0 25px 50px rgba(14, 165, 233, 0.15))' }}
                    priority
                  />
                  
                  {/* Floating Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-blue-100 z-40" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Brain className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">3x</p>
                        <p className="text-sm text-gray-500">More Leads</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Stats Badge - Top Left */}
                  <div className="absolute top-4 left-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-blue-100 z-40" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">47%</p>
                        <p className="text-sm text-gray-500">Higher Close</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Content (Swapped) */}
              <div className={`order-1 lg:order-2 text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full mb-4">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">AI-Powered Lead Intelligence</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
                  <span className="block text-black">Convert More Leads</span>
                  <span className="block bg-gradient-to-r from-blue-500 via-blue-600 to-blue-600 bg-clip-text text-transparent">With AI Intelligence</span>
                </h1>

                {/* Tagline Box */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
                  <p className="text-gray-600 text-sm italic mb-1">"Manual lead scoring wastes time and misses opportunities."</p>
                  <p className="text-blue-600 font-bold text-base uppercase tracking-wider">LET AI DO IT INSTANTLY.</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base lg:text-lg mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Transform your sales process with <strong className="text-gray-800">AI-powered lead scoring</strong> that identifies high-converting prospects instantly. 
                  Increase conversions by <strong className="text-blue-600">3x</strong> and save <strong className="text-blue-600">20+ hours weekly</strong>.
                </p>

                {/* Dual Audio Players - Compact Style */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  {/* English Audio Player */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">🇺🇸 English Demo</p>
                    <button
                      onClick={toggleAudio}
                      className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
                      aria-label={isPlaying ? "Pause English audio demo" : "Play English audio demo"}
                    >
                      <div className="flex-1 flex items-center justify-center h-6">
                        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="pulseGradientLead" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#3b82f6" />
                              <stop offset="1" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          {[4, 8, 14, 20, 16, 12, 7, 5, 10, 15, 22, 18, 11, 7, 5, 4, 8, 14, 20, 16].map((h, i) => (
                            isPlaying ? (
                              <motion.rect
                                key={i}
                                x={6 * i + 1}
                                width="3"
                                rx="1.5"
                                fill="url(#pulseGradientLead)"
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
                              <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientLead)" />
                            )
                          ))}
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                      </div>
                    </button>
                  </div>

                  {/* Hindi Audio Player */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">🇮🇳 Hindi Demo</p>
                    <button
                      onClick={toggleAudioHindi}
                      className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all group"
                      aria-label={isPlayingHindi ? "Pause Hindi audio demo" : "Play Hindi audio demo"}
                    >
                      <div className="flex-1 flex items-center justify-center h-6">
                        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="pulseGradientLeadHindi" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
                              <stop stopColor="#3b82f6" />
                              <stop offset="1" stopColor="#2563eb" />
                            </linearGradient>
                          </defs>
                          {[4, 8, 14, 20, 16, 12, 7, 5, 10, 15, 22, 18, 11, 7, 5, 4, 8, 14, 20, 16].map((h, i) => (
                            isPlayingHindi ? (
                              <motion.rect
                                key={i}
                                x={6 * i + 1}
                                width="3"
                                rx="1.5"
                                fill="url(#pulseGradientLeadHindi)"
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
                              <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientLeadHindi)" />
                            )
                          ))}
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                        {isPlayingHindi ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* CTA Buttons - Hero Style */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-4">
                  <Link
                    href="/signup?service=lead"
                    className="group px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#demo"
                    className="px-5 py-2.5 bg-white text-blue-600 border border-blue-300 font-bold rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators - Hero Style */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">Setup in 5 minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs">94% accuracy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI FEATURES */}
        <section 
          id="section-features" 
          data-animate
          className="px-4 py-20 bg-gradient-to-b from-white to-gray-50"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-features') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
                <Bot className="w-4 h-4" />
                AI That Never Stops
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Intelligent Lead Management, <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Powered By Advanced AI</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Discover leads with the highest conversion potential using AI that analyzes behavior, engagement, and buying signals automatically.
              </p>
            </div>

            {/* Feature List - Clean Style */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  { icon: Brain, title: "Smart Lead Scoring", desc: "AI ranks leads by conversion probability using 50+ data points" },
                  { icon: PhoneCall, title: "Call Intelligence", desc: "Real-time transcription, sentiment analysis, and intent detection" },
                  { icon: TrendingUp, title: "Predictive Analytics", desc: "Forecast conversions and identify at-risk leads instantly" },
                  { icon: Target, title: "Smart Routing", desc: "Automatically route hot leads to the right sales agents" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 flex-shrink-0">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Image */}
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=500&fit=crop"
                    alt="Analytics dashboard"
                    width={600}
                    height={500}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW IT WORKS */}
        <section 
          id="section-how"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-how') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                How AI Lead Scoring <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                <strong className="text-blue-600">Simple setup. Instant results.</strong> Let AI handle the heavy lifting.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* AI Lead Scoring Flow */}
              <div className={`bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ${visibleSections.has('section-how') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.2s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Lead Scoring</h3>
                    <p className="text-blue-600 font-medium">Automated qualification</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { step: "1", text: "Lead enters your pipeline", icon: Users },
                    { step: "2", text: "AI analyzes 50+ data points", icon: Brain },
                    { step: "3", text: "Score assigned instantly", icon: BarChart3 },
                    { step: "4", text: "Hot leads routed to sales", icon: Target },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover/item:bg-blue-500 group-hover/item:text-white transition-all">
                        {item.step}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-700 font-medium">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call Analytics Flow */}
              <div className={`bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 border border-green-100 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 ${visibleSections.has('section-how') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '0.3s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <PhoneCall className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Call Analytics</h3>
                    <p className="text-green-600 font-medium">Real-time insights</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { step: "1", text: "Call is recorded & transcribed", icon: Phone },
                    { step: "2", text: "AI detects sentiment & intent", icon: Brain },
                    { step: "3", text: "Key signals highlighted", icon: Sparkles },
                    { step: "4", text: "Insights added to lead profile", icon: CheckCircle },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover/item:bg-green-500 group-hover/item:text-white transition-all">
                        {item.step}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-green-500" />
                        <span className="text-gray-700 font-medium">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: DASHBOARD PREVIEW */}
        <section 
          id="section-dashboard"
          data-animate
          className="px-4 py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-dashboard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Content - Left Side */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm mb-4">
                  <BarChart3 className="w-4 h-4" />
                  Powerful Dashboard
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  One Dashboard. <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Complete Visibility.</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Track every lead, monitor conversions, and optimize your sales funnel from a single, powerful dashboard.
                </p>

                <div className="space-y-4">
                  {[
                    "Real-time lead scoring & ranking",
                    "Call analytics with AI insights",
                    "Pipeline visualization & forecasting",
                    "Team performance metrics",
                    "Custom filters & saved views",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Image Carousel - Right Side */}
              <div className="relative" role="region" aria-label="Dashboard preview carousel" aria-roledescription="carousel">
                <div className="rounded-3xl shadow-2xl overflow-hidden border border-gray-200 relative">
                  {/* Images */}
                  <div className="relative h-[400px] w-full" aria-live="polite">
                    {DASHBOARD_IMAGES.map((dashboard, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          idx === currentDashboard 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} of ${DASHBOARD_IMAGES.length}: ${dashboard.title}`}
                        aria-hidden={idx !== currentDashboard}
                      >
                        <Image
                          src={dashboard.image}
                          alt={`${dashboard.title} - ${dashboard.subtitle}`}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                          loading={idx === 0 ? "eager" : "lazy"}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBQYSIRMxQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAMBAQEAAAAAAAAAAAAAAAABAhEhMf/aAAwDAQACEQMRAD8Aw+31e5trOO1CRmONiyAr7OcZ/tKUqzTS9FfB//Z"
                        />
                        {/* Overlay with title */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="text-white font-bold text-xl mb-1">{dashboard.title}</h4>
                          <p className="text-white/80 text-sm">{dashboard.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2" role="tablist" aria-label="Carousel navigation">
                    {DASHBOARD_IMAGES.map((dashboard, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentDashboard(idx)}
                        role="tab"
                        aria-selected={idx === currentDashboard}
                        aria-label={`Go to slide ${idx + 1}: ${dashboard.title}`}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50 ${
                          idx === currentDashboard 
                            ? 'bg-white w-8' 
                            : 'bg-white/50 w-2 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-blue-300/40" aria-hidden="true">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live Analytics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: KEY STATISTICS */}
        <section 
          id="section-stats"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                Proven Results That <span className="text-blue-200">Speak for Themselves</span>
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto">
                Join thousands of businesses already transforming their sales with AI-powered lead intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: "10,000+", label: "Businesses Trust Us", icon: Users },
                { value: "47%", label: "Higher Close Rate", icon: TrendingUp },
                { value: "3x", label: "More Qualified Leads", icon: Target },
                { value: "20hrs", label: "Saved Weekly", icon: Clock },
              ].map((stat, idx) => (
                <div key={idx} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="w-12 h-12 mx-auto bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: USE CASES */}
        <section 
          id="section-usecases"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-usecases') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Built For <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Every Industry</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From B2B sales teams to real estate agencies — AI lead intelligence works everywhere.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "B2B Sales", desc: "Prioritize enterprise leads and shorten sales cycles", icon: Users },
                { title: "Call Centers", desc: "Analyze thousands of calls daily with AI insights", icon: Phone },
                { title: "Real Estate", desc: "Score property inquiries and close more deals", icon: Target },
                { title: "E-commerce", desc: "Identify buyers and personalize follow-ups", icon: TrendingUp },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors group">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all">
                    <item.icon className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: KEY FEATURES GRID */}
        <section 
          id="section-features-grid"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-features-grid') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Everything You Need to <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Win More Deals</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive features designed to maximize your lead conversion at every stage.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Smart Lead Routing", desc: "Automatically route hot leads to your best closers based on skills and availability", icon: RefreshCw, color: "sky" },
                { title: "Conversation Intelligence", desc: "AI analyzes every call to extract key insights, objections, and buying signals", icon: MessageSquare, color: "blue" },
                { title: "Predictive Analytics", desc: "Know which leads are most likely to convert before you pick up the phone", icon: PieChart, color: "indigo" },
                { title: "Multi-Channel Tracking", desc: "Track leads from calls, emails, web forms, and social media in one place", icon: Globe, color: "violet" },
                { title: "Custom Lead Scoring", desc: "Build scoring models tailored to your business and ideal customer profile", icon: Filter, color: "purple" },
                { title: "Real-Time Alerts", desc: "Get instant notifications when high-value leads take action", icon: Zap, color: "fuchsia" },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION 9: MULTIPLE TESTIMONIALS */}
        <section 
          id="section-testimonials"
          data-animate
          className="px-4 py-20 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Loved by <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Sales Teams Everywhere</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how companies are transforming their sales process with AI lead intelligence.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Our conversion rate jumped 47% in the first month. The AI lead scoring is incredibly accurate.",
                  name: "Sarah Chen",
                  role: "VP of Sales",
                  company: "TechFlow Inc",
                  initials: "SC"
                },
                {
                  quote: "We've saved over 20 hours per week on manual lead qualification. The ROI is incredible.",
                  name: "Michael Torres",
                  role: "Sales Director",
                  company: "GrowthBase",
                  initials: "MT"
                },
                {
                  quote: "The conversation intelligence feature helped us identify objections we never knew existed.",
                  name: "Emily Watson",
                  role: "Head of Revenue",
                  company: "ScaleUp Co",
                  initials: "EW"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                      <p className="text-gray-500 text-xs">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10: FAQ */}
        <section 
          id="section-faq"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50"
        >
          <div className={`max-w-4xl mx-auto transition-all duration-700 ${visibleSections.has('section-faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our AI lead intelligence platform.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How does AI lead scoring work?",
                  a: "Our AI analyzes hundreds of data points from each lead — including call transcripts, behavior patterns, demographics, and engagement history — to predict conversion likelihood with up to 94% accuracy."
                },
                {
                  q: "How long does setup take?",
                  a: "Most teams are up and running in less than 30 minutes. Our onboarding wizard walks you through connecting your existing tools, and our team is available 24/7 to help."
                },
                {
                  q: "Can I customize the lead scoring model?",
                  a: "Absolutely! You can build custom scoring models based on your ideal customer profile, industry, deal size, and any other criteria that matters to your business."
                },
                {
                  q: "What integrations are available?",
                  a: "We integrate with 50+ popular tools including Salesforce, HubSpot, Pipedrive, Slack, Zapier, and most major dialers. We also offer a robust API for custom integrations."
                },
                {
                  q: "Is my data secure?",
                  a: "Yes. We're SOC 2 Type II certified and GDPR compliant. All data is encrypted at rest and in transit, and we never share your data with third parties."
                }
              ].map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-2xl">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 11: SECURITY & TRUST */}
        <section 
          id="section-security"
          data-animate
          className="px-4 py-20 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Enterprise-Grade <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Security & Compliance</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Your data is protected by industry-leading security standards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "SOC 2 Type II", desc: "Certified security controls and processes", icon: Shield },
                { title: "GDPR Compliant", desc: "Full compliance with EU data protection", icon: Lock },
                { title: "256-bit Encryption", desc: "All data encrypted at rest and in transit", icon: Lightbulb },
                { title: "99.9% Uptime", desc: "Enterprise SLA with guaranteed availability", icon: Award },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 mx-auto bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 12: FINAL CTA */}
        <section className="px-4 py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Lead Process?
            </h2>
            <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of businesses capturing more revenue with AI lead intelligence. 
              Start your free trial today — no credit card required.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/signup?service=lead"
                className="group inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg text-base font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-lg text-base font-bold border-2 border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Talk to Sales
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
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
  );
}

