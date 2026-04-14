"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { motion } from "framer-motion";
import {
    Activity,
    ArrowRight,
    BarChart3,
    Bell,
    Bot,
    Building2,
    Calendar,
    CalendarCheck,
    CheckCircle,
    ChevronRight,
    Clock,
    Languages,
    Lock,
    MessageCircle,
    Pause,
    Phone,
    Play,
    Server,
    Shield,
    Sparkles,
    Star,
    Stethoscope,
    TrendingUp,
    Users,
    Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

// Static data moved outside component to prevent re-creation
const DASHBOARD_IMAGES = [
  { title: "Analytics Dashboard", subtitle: "Insights that drive decisions", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" },
  { title: "Appointment Overview", subtitle: "Track all bookings at a glance", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop" },
  { title: "Doctor Schedule", subtitle: "Manage availability seamlessly", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" },
  
  { title: "Patient Management", subtitle: "Complete patient profiles", image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop" },
  { title: "Calendar Integration", subtitle: "Sync with Google Calendar", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=600&fit=crop" },
] as const;

const WAVEFORM_HEIGHTS = Array.from({ length: 20 }, (_, i) => ({
  height: 20 + (((i * 7) % 60)),
  duration: 1 + ((i * 3) % 5) / 10,
  delay: i * 0.1
}));

const DEMO_WAVEFORM_HEIGHTS = Array.from({ length: 40 }, (_, i) => ({
  height: 20 + (((i * 11) % 60)),
  duration: 1 + ((i * 7) % 5) / 10,
  delay: i * 0.05
}));

// Comparison data: Voice Assistant vs Normal Booking
const BOOKING_METHOD_DATA = [
  { name: 'Voice AI', value: 78, color: '#f97316' },
  { name: 'Normal', value: 22, color: '#d1d5db' },
];

const COMPARISON_METRICS = [
  { metric: 'Avg. Wait Time', voiceAI: '2 sec', normal: '3-5 min', winner: 'voice' },
  { metric: 'Availability', voiceAI: '24/7', normal: '9-5 only', winner: 'voice' },
  { metric: 'Booking Success', voiceAI: '94%', normal: '62%', winner: 'voice' },
  { metric: 'After-Hours Capture', voiceAI: '100%', normal: '0%', winner: 'voice' },
  { metric: 'Multi-language', voiceAI: '50+', normal: 'Limited', winner: 'voice' },
  { metric: 'No-Show Rate', voiceAI: '4%', normal: '18%', winner: 'voice' },
];

const EFFICIENCY_BAR_DATA = [
  { category: 'Calls Handled/Hour', voiceAI: 120, normal: 8 },
  { category: 'Booking Rate', voiceAI: 94, normal: 62 },
  { category: 'Customer Satisfaction', voiceAI: 96, normal: 78 },
  { category: 'Cost Efficiency', voiceAI: 85, normal: 30 },
];

export default function AppointmentsPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(32);
  const [isMuted, setIsMuted] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Mount effect for chart hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Audio ref for real audio playback
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioRefHindi = useRef<HTMLAudioElement>(null);

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

  // Auto-swap dashboard images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDashboard((prev) => (prev + 1) % DASHBOARD_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fade-in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Audio playback handler
  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          // Fallback for browsers that block autoplay
          console.log("Audio playback blocked by browser");
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      // Fallback visual-only mode
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

  // Audio time update handler
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
      setAudioCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  // Audio ended handler
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioCurrentTime(0);
  }, []);

  // Memoized dashboard images for carousel
  const dashboardImages = useMemo(() => DASHBOARD_IMAGES, []);

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:outline-none"
      >
        Skip to main content
      </a>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="/audio/doctor-appointment-sample.mp3"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
        preload="metadata"
      />

      <Header />

      <main id="main-content" className="flex-1 relative z-10" role="main">

        {/* SECTION 1: HERO - Full Screen Like Leads */}
        <section className="pt-24 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-br from-[#fafbff] via-white to-white flex items-center" aria-labelledby="hero-title">
          {/* Animated Background Elements - Leads Style */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Floating Orbs */}



            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'linear-gradient(to right, #f97316 1px, transparent 1px), linear-gradient(to bottom, #f97316 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
            
            {/* Animated Lines */}
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent animate-pulse" style={{ animationDuration: '5s' }} />
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/15 to-transparent animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }} />
          </div>

          <div className="container mx-auto relative z-30 max-w-7xl h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
              
              {/* Left Side - Content */}
              <div className={`text-center lg:text-left transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 glass-card bg-orange-50/60 border border-orange-200/40 px-3 py-1.5 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">AI-Powered Scheduling</span>
                </div>

                {/* Main Headline */}
                <h1 id="hero-title" className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                  <span className="block text-black">Never Miss Another</span>
                  <span className="block bg-gradient-to-r from-orange-500 via-violet-500 to-violet-600 bg-clip-text text-transparent">Appointment Again</span>
                </h1>

                {/* Tagline Box */}
                <div className="bg-gradient-to-r from-orange-50/60 to-orange-50/40 border border-orange-200/40 rounded-2xl p-5 mb-6">
                  <p className="text-gray-600 text-sm italic mb-1">"Missed calls mean missed revenue and frustrated patients."</p>
                  <p className="text-orange-600 font-bold text-base uppercase tracking-wider">LET AI HANDLE IT 24/7.</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Your AI-powered virtual receptionist answers calls and WhatsApp instantly, schedules appointments automatically, and keeps doctors in sync — <strong className="text-orange-600">24/7, without human effort</strong>.
                </p>

                {/* Dual Audio Players - Compact Style Like Leads */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {/* English Audio Player */}
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1.5">🇺🇸 English Demo</p>
                    <button
                      onClick={toggleAudio}
                      className="w-full bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300/40 transition-all group"
                      aria-label={isPlaying ? "Pause English audio demo" : "Play English audio demo"}
                    >
                      <div className="flex-1 flex items-center justify-center h-6">
                        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="pulseGradientAppt" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
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
                                fill="url(#pulseGradientAppt)"
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
                              <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientAppt)" />
                            )
                          ))}
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-md">
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
                      aria-label={isPlayingHindi ? "Pause Hindi audio demo" : "Play Hindi audio demo"}
                    >
                      <div className="flex-1 flex items-center justify-center h-6">
                        <svg width="120" height="24" viewBox="0 0 120 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="pulseGradientApptHindi" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
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
                                fill="url(#pulseGradientApptHindi)"
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
                              <rect key={i} x={6 * i + 1} y={24 - h} width="3" height={h} rx="1.5" fill="url(#pulseGradientApptHindi)" />
                            )
                          ))}
                        </svg>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-md">
                        {isPlayingHindi ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                      </div>
                    </button>
                  </div>
                </div>

                {/* CTA Buttons - Leads Style */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                  <Link
                    href="/signup?service=appointment"
                    className="group px-5 py-2.5 bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold rounded-lg hover:from-orange-600 hover:to-violet-700 transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-105 flex items-center justify-center gap-2 text-sm"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="#demo"
                    className="px-5 py-2.5 bg-white text-orange-600 border border-orange-300/40 font-bold rounded-lg hover:bg-orange-50/60 hover:border-orange-400 transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <Play className="w-4 h-4" fill="currentColor" />
                    Watch Demo
                  </Link>
                </div>

                {/* Trust Indicators - Leads Style */}
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
                    <span className="text-xs">40% less no-shows</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Image with Floating Effects */}
              <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                {/* Main Image with Floating Effects */}
                <div className="relative">
                  {/* Animated Sound Waves SVG */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                    <svg width="340" height="340" viewBox="0 0 340 340" fill="none" style={{ filter: 'drop-shadow(0 0 32px #f97316aa)' }}>
                      <circle cx="170" cy="170" r="80" stroke="#fb923c" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                      <circle cx="170" cy="170" r="110" stroke="#f97316" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '0.5s' }} />
                      <circle cx="170" cy="170" r="140" stroke="#ea580c" strokeWidth="2" fill="none" style={{ animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite', animationDelay: '1s' }} />
                    </svg>
                  </div>
                  
                  <Image
                    src="/images/image/doctorappointment.png"
                    alt="Doctor using AI appointment scheduling system"
                    width={600}
                    height={500}
                    className="relative z-20 w-full max-w-md lg:max-w-lg h-auto object-contain rounded-3xl shadow-2xl"
                    style={{ filter: 'drop-shadow(0 25px 50px rgba(14, 165, 233, 0.15))' }}
                    priority
                  />
                  
                  {/* Floating Badge - Bottom Right */}
                  <div className="absolute bottom-4 right-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">24/7</p>
                        <p className="text-sm text-gray-500">Always On</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Stats Badge - Top Left */}
                  <div className="absolute top-4 left-0 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-orange-100/40 z-40" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1s' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">45%</p>
                        <p className="text-sm text-gray-500">More Bookings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: AI THAT NEVER SLEEPS */}
        <section 
          id="section-ai" 
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]" 
          aria-labelledby="ai-section-title"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-ai') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                <Bot className="w-4 h-4" aria-hidden="true" />
                AI That Never Sleeps
              </div>
              <h2 id="ai-section-title" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Your Virtual Receptionist, <br className="hidden sm:block" />
                <span className="text-orange-600">Working Around the Clock</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                Imagine having the world&apos;s most professional receptionist — one who never takes breaks, never gets sick, and handles every conversation with perfect precision.
              </p>
            </div>

            {/* Value Cards */}
            <div className="grid md:grid-cols-3 gap-6" role="list" aria-label="Key features">
              <div 
                className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200/40 transition-all group focus-within:ring-2 focus-within:ring-orange-500 ${visibleSections.has('section-ai') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} 
                style={{ transitionDelay: '0.1s' }}
                role="listitem"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" aria-hidden="true">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Lightning Response</h3>
                <p className="text-gray-600">Answers calls in under <strong className="text-orange-600">750ms</strong> with natural, human-like conversations.</p>
              </div>

              <div 
                className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-orange-200/40 transition-all group ${visibleSections.has('section-ai') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '0.2s' }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Scheduling</h3>
                <p className="text-gray-600">Prevents conflicts with <strong className="text-orange-600">real-time slot optimization</strong> and calendar sync.</p>
              </div>

              <div 
                className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all group ${visibleSections.has('section-ai') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: '0.3s' }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Zero No-Shows</h3>
                <p className="text-gray-600">Cuts missed appointments by <strong className="text-green-600">40%</strong> using smart reminders.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: SINGLE & MULTI-DOCTOR DASHBOARD */}
        <section 
          id="section-dashboard"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-dashboard') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Users className="w-4 h-4" />
                  Dashboard Management
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  One Dashboard. <br className="hidden sm:block" />
                  <span className="text-orange-600">Any Scale.</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Manage one doctor or hundreds — from a single, powerful dashboard.
                </p>

                <div className="space-y-4">
                  {[
                    "View appointments per doctor",
                    "Manage multiple doctors & clinics",
                    "Filter by date, doctor, location",
                    "Real-time schedule updates",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dashboard Image Carousel */}
              <div className="relative" role="region" aria-label="Dashboard preview carousel" aria-roledescription="carousel">
                <div className="rounded-3xl shadow-2xl overflow-hidden border border-gray-200 relative">
                  {/* Images */}
                  <div className="relative h-[400px] w-full" aria-live="polite">
                    {dashboardImages.map((dashboard, idx) => (
                      <div
                        key={idx}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          idx === currentDashboard 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${idx + 1} of ${dashboardImages.length}: ${dashboard.title}`}
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
                    {dashboardImages.map((dashboard, idx) => (
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
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-violet-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-300/40" aria-hidden="true">
                  <div className="text-sm font-semibold flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Live Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: HOW APPOINTMENTS ARE BOOKED */}
        <section 
          id="section-booking"
          data-animate
          className="px-4 py-16 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-booking') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                How Appointments Are <span className="text-orange-600">Booked</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                <strong className="text-orange-600">No apps. No waiting.</strong> Just talk or chat.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* AI Call Booking */}
              <div className={`bg-gradient-to-br from-orange-50/60 to-white rounded-3xl p-8 border border-orange-100/40 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group ${visibleSections.has('section-booking') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: '0.2s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Call Booking</h3>
                    <p className="text-orange-600 font-medium">Voice-powered scheduling</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { step: "1", text: "Patient calls your number", icon: Phone },
                    { step: "2", text: "AI understands intent", icon: Bot },
                    { step: "3", text: "Confirms date & slot", icon: Calendar },
                    { step: "4", text: "Appointment booked instantly", icon: CheckCircle },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-10 h-10 bg-orange-50/60 text-orange-600 rounded-xl flex items-center justify-center font-bold text-lg group-hover/item:bg-orange-500 group-hover/item:text-white transition-all">
                        {item.step}
                      </div>
                      <div className="flex-1 flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-orange-500" />
                        <span className="text-gray-700 font-medium">{item.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Booking */}
              <div className={`bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 border border-green-100 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group ${visibleSections.has('section-booking') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`} style={{ transitionDelay: '0.3s' }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">WhatsApp Booking</h3>
                    <p className="text-green-600 font-medium">Chat-based scheduling</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { step: "1", text: "Patient sends message", icon: MessageCircle },
                    { step: "2", text: "AI shows available slots", icon: Calendar },
                    { step: "3", text: "Slot selected", icon: CalendarCheck },
                    { step: "4", text: "Confirmation sent automatically", icon: CheckCircle },
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

        {/* SECTION 4: SLOT-WISE SMART SCHEDULING */}
        <section 
          id="section-scheduling"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-scheduling') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  Doctor-Controlled Slots
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Slot-Wise <span className="text-orange-600">Smart Scheduling</span>
                </h2>
                <p className="text-gray-600 text-lg mb-6">
                  Doctors define their availability, and the system handles everything else automatically.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50/60 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Working Days</h4>
                      <p className="text-gray-500 text-sm">Define which days you are available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50/60 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Slot Duration</h4>
                      <p className="text-gray-500 text-sm">10, 15, or 30-minute appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Availability Hours</h4>
                      <p className="text-gray-500 text-sm">Set start and end times</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 bg-orange-50/60 rounded-xl p-4 border border-orange-100/40">
                  <strong className="text-orange-600">Fully automated:</strong> No double bookings, real-time availability updates, automatic slot creation.
                </p>
              </div>

              {/* Visual: Calendar with slots */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-900">January 2026</h4>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer">‹</div>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 cursor-pointer">›</div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-gray-500 font-medium py-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 text-center mb-6">
                  {[...Array(31)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                        i === 19 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' :
                        [4, 11, 18, 25].includes(i) ? 'bg-orange-50/60 text-orange-600' :
                        [5, 6, 12, 13, 19, 20, 26, 27].includes(i) ? 'text-gray-300' :
                        'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                {/* Slot Chips */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Available Slots - Jan 20</div>
                  <div className="flex flex-wrap gap-2">
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '02:00', '02:30', '03:00'].map((time, idx) => (
                      <div 
                        key={idx}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          idx === 2 ? 'bg-orange-500 text-white' :
                          [1, 5].includes(idx) ? 'bg-gray-100 text-gray-400 line-through' :
                          'bg-green-100 text-green-600 hover:bg-green-500 hover:text-white'
                        }`}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: AUTOMATED WHATSAPP NOTIFICATIONS */}
        <section 
          id="section-whatsapp"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-whatsapp') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-full font-semibold text-sm mb-4">
                <Bell className="w-4 h-4" />
                Automated Notifications
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Automated <span className="text-green-600">WhatsApp Notifications</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Smart reminders = <strong className="text-green-600">40% fewer no-shows</strong>
              </p>
            </div>

            {/* Flow Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: CalendarCheck, title: "Appointment Booked", desc: "Confirmation generated", color: "orange" },
                { icon: MessageCircle, title: "Patient Notified", desc: "WhatsApp sent instantly", color: "green" },
                { icon: Stethoscope, title: "Doctor Notified", desc: "Schedule updated", color: "orange" },
                { icon: Bell, title: "Reminder Sent", desc: "Before appointment", color: "orange" },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                      item.color === 'orange' ? 'bg-orange-500 shadow-orange-500/30' :
                      item.color === 'green' ? 'bg-green-500 shadow-green-500/30' :
                      'bg-orange-500 shadow-orange-500/30'
                    }`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                  {idx < 3 && (
                    <ChevronRight className="hidden lg:block absolute top-1/2 -right-4 w-6 h-6 text-gray-300 -translate-y-1/2" />
                  )}
                </div>
              ))}
            </div>

            {/* WhatsApp Preview */}
            <div className="mt-12 max-w-md mx-auto">
              <div className="bg-gradient-to-b from-green-600 to-green-700 rounded-t-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">HealthCare Clinic</div>
                    <div className="text-green-200 text-sm">AI Assistant</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#e5ddd5] p-4 rounded-b-2xl space-y-3">
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[80%] shadow">
                  <p className="text-gray-900 text-sm">✅ Your appointment is confirmed!</p>
                  <p className="text-gray-600 text-sm mt-2"><strong>Dr. Sarah Johnson</strong><br/>Jan 20, 2026 at 10:00 AM</p>
                  <p className="text-gray-400 text-xs text-right mt-2">10:30 AM ✓✓</p>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm p-3 max-w-[80%] shadow">
                  <p className="text-gray-900 text-sm">🔔 Reminder: Your appointment is tomorrow at 10:00 AM</p>
                  <p className="text-gray-400 text-xs text-right mt-2">Yesterday ✓✓</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: GOOGLE CALENDAR SYNC */}
        <section 
          id="section-calendar"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-calendar') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Visual */}
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 relative overflow-hidden">
                  {/* Google Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-violet-600 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900">Google Calendar</span>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Synced
                    </div>
                  </div>

                  {/* Calendar Events */}
                  <div className="space-y-3">
                    {[
                      { time: "09:00 - 09:30", patient: "John Smith", type: "Consultation", color: "orange" },
                      { time: "10:00 - 10:30", patient: "Emily Davis", type: "Follow-up", color: "orange" },
                      { time: "11:00 - 11:30", patient: "Michael Brown", type: "Check-up", color: "green" },
                    ].map((event, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border-l-4 ${
                        event.color === 'orange' ? 'bg-orange-50/60 border-orange-500' :
                        event.color === 'orange' ? 'bg-orange-50/60 border-orange-500' :
                        'bg-green-50 border-green-500'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-900">{event.patient}</div>
                            <div className="text-gray-500 text-sm">{event.type}</div>
                          </div>
                          <div className="text-gray-600 text-sm font-medium">{event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sync Indicator */}
                  <div className="mt-4 p-3 bg-green-50 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 text-sm font-medium">Auto-synced from AI bookings</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  Calendar Integration
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  Google Calendar Sync <br className="hidden sm:block" />
                  <span className="text-orange-600">for Doctors</span>
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Appointments sync automatically with Google Calendar. No manual entry, no double bookings.
                </p>

                <div className="space-y-4">
                  {[
                    { icon: Zap, text: "One-click integration", color: "orange" },
                    { icon: Activity, text: "Real-time updates", color: "orange" },
                    { icon: CheckCircle, text: "No manual entry", color: "green" },
                    { icon: Shield, text: "No double bookings", color: "orange" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                        item.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: PROVEN RESULTS */}
        <section 
          id="section-results"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-results') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Proven Results That <span className="text-orange-600">Speak for Themselves</span>
              </h2>
              <p className="text-gray-600">Join 1,000+ businesses already transformed by AI scheduling</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { value: "45%", label: "More Bookings", color: "orange", icon: TrendingUp },
                { value: "24/7", label: "Always Available", color: "orange", icon: Clock },
                { value: "3×", label: "Higher Lead Capture", color: "green", icon: Users },
                { value: "60%", label: "Cost Savings", color: "orange", icon: BarChart3 },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${visibleSections.has('section-results') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    stat.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                    stat.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    stat.color === 'orange' ? 'text-orange-600' :
                    stat.color === 'orange' ? 'text-orange-600' :
                    'text-green-600'
                  }`}>{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Rating Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-100 flex items-center gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <span className="text-gray-900 font-semibold">4.9 / 5 Rating</span>
                <span className="text-gray-500">from 1,000+ users</span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold border-2 border-orange-200/40 hover:border-orange-500 hover:shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                Schedule a Demo Call
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: VOICE ASSISTANT VS NORMAL BOOKING - ENHANCED */}
        <section 
          id="section-comparison"
          data-animate
          className="px-4 py-20 bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden"
          aria-labelledby="comparison-title"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">



            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)',
              backgroundSize: '32px 32px'
            }} />
          </div>

          <div className={`max-w-6xl mx-auto relative z-10 transition-all duration-700 ${visibleSections.has('section-comparison') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Header with animated badge */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-violet-600 text-white rounded-full font-semibold text-sm mb-6 shadow-lg shadow-orange-500/25">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                The Comparison You Need to See
                <Sparkles className="w-4 h-4" aria-hidden="true" />
              </div>
              <h2 id="comparison-title" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Voice AI Booking <span className="relative inline-block">
                  <span className="text-orange-600">Crushes</span>
                  <svg className="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0 7 Q50 0 100 7" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  </svg>
                </span> Traditional Methods
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Real data showing why smart businesses are making the switch
              </p>
            </div>

            {/* Main Comparison - Side by Side Cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              
              {/* Voice AI Card - Winner */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-violet-400 rounded-3xl blur-sm opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative bg-white rounded-3xl p-8 border border-orange-100/40 shadow-xl h-full">
                  {/* Winner Badge */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg shadow-green-500/30 flex items-center gap-1">
                      <Star className="w-4 h-4 fill-white" />
                      WINNER
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-8 mt-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Voice AI Booking</h3>
                      <p className="text-orange-600 font-medium">Preferred by 78% of customers</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Response Time', value: '2 seconds', icon: Zap, highlight: true },
                      { label: 'Availability', value: '24/7/365', icon: Clock, highlight: true },
                      { label: 'Booking Success', value: '94%', icon: TrendingUp, highlight: true },
                      { label: 'After-Hours Capture', value: '100%', icon: Phone, highlight: true },
                      { label: 'Languages Supported', value: '50+', icon: Languages, highlight: true },
                      { label: 'No-Show Rate', value: 'Only 4%', icon: Users, highlight: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/60 to-violet-50/40 rounded-xl border border-orange-100/40 hover:shadow-md hover:-translate-x-1 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-50/60 rounded-lg flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-orange-600" />
                          </div>
                          <span className="text-gray-700 font-medium">{item.label}</span>
                        </div>
                        <span className="font-bold text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Normal Booking Card - Loser */}
              <div className="relative">
                <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 h-full opacity-90">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center">
                      <Phone className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-500">Traditional Booking</h3>
                      <p className="text-gray-400 font-medium">Outdated approach</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'Response Time', value: '3-5 minutes' },
                      { label: 'Availability', value: '9-5 weekdays' },
                      { label: 'Booking Success', value: '62%' },
                      { label: 'After-Hours Capture', value: '0%' },
                      { label: 'Languages Supported', value: 'Limited' },
                      { label: 'No-Show Rate', value: '18%' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="text-gray-400 line-through decoration-red-400">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Overlay X */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center">
                      <span className="text-red-400 text-6xl font-bold opacity-30">✕</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-12">
              {/* Pie Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-50/60 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                  </div>
                  Customer Preference 2025
                </h3>
                <p className="text-gray-500 text-sm mb-4">How modern customers want to book</p>
                {mounted && (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <linearGradient id="voiceGradient" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                        <Pie
                          data={BOOKING_METHOD_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          <Cell fill="url(#voiceGradient)" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, 'Preference']}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-violet-500" />
                    <span className="text-gray-600 text-sm font-medium">Voice AI (78%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                    <span className="text-gray-400 text-sm">Traditional (22%)</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-500">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  Efficiency Showdown
                </h3>
                <p className="text-gray-500 text-sm mb-4">Performance metrics comparison</p>
                {mounted && (
                  <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={EFFICIENCY_BAR_DATA} layout="vertical" barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                        <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis type="category" dataKey="category" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} width={100} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="normal" fill="#e5e7eb" radius={[0, 6, 6, 0]} name="Traditional" />
                        <Bar dataKey="voiceAI" fill="#f97316" radius={[0, 6, 6, 0]} name="Voice AI" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Impact Stats - Animated Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { label: 'Faster Response', value: '90×', sublabel: 'vs traditional', icon: Zap, color: 'orange', bg: 'from-orange-500 to-violet-600' },
                { label: 'More Bookings', value: '3.4×', sublabel: 'increase', icon: TrendingUp, color: 'green', bg: 'from-green-500 to-emerald-500' },
                { label: 'Lower No-Shows', value: '77%', sublabel: 'reduction', icon: Users, color: 'orange', bg: 'from-orange-500 to-violet-500' },
                { label: 'Cost Savings', value: '60%', sublabel: 'saved monthly', icon: BarChart3, color: 'green', bg: 'from-green-500 to-teal-500' },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-center overflow-hidden"
                >
                  {/* Hover gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${stat.bg} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-gray-700 font-medium text-sm">{stat.label}</p>
                  <p className="text-gray-400 text-xs">{stat.sublabel}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center bg-gradient-to-r from-orange-600 to-violet-700 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-orange-500/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Transform Your Booking?</h3>
                <p className="text-orange-100 mb-8 max-w-xl mx-auto">Join 1,000+ businesses already using Voice AI to capture more appointments</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact?demo=voice-booking"
                    className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                  >
                    <Bot className="w-5 h-5" />
                    Get Voice AI Demo
                  </Link>
                
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: COMPLETE AI SOLUTION */}
        <section 
          id="section-solution"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-6xl mx-auto transition-all duration-700 ${visibleSections.has('section-solution') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Complete AI <span className="text-orange-600">Scheduling Solution</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to automate appointments and deliver a premium customer experience
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Phone, title: "24/7 Call & WhatsApp Booking", desc: "AI handles bookings anytime, anywhere", color: "orange" },
                { icon: Calendar, title: "Smart Calendar Sync", desc: "Google Calendar integration", color: "orange" },
                { icon: Bell, title: "Intelligent Reminders", desc: "40% fewer no-shows", color: "green" },
                { icon: Bot, title: "Human-Like Voice AI", desc: "Response in under 750ms", color: "orange" },
                { icon: Languages, title: "50+ Languages", desc: "Global accessibility", color: "orange" },
                { icon: Building2, title: "Multi-Clinic Support", desc: "One dashboard for all locations", color: "orange" },
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${visibleSections.has('section-solution') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${0.1 + idx * 0.08}s` }}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-110 hover:rotate-3 ${
                    feature.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                    feature.color === 'orange' ? 'bg-orange-50/60 text-orange-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Mid-page CTA */}
            <div className="mt-10 text-center">
              <Link
                href="/signup?service=appointment"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-violet-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-300/40 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-gray-500 text-sm mt-2">No credit card required</p>
            </div>
          </div>
        </section>

        {/* SECTION 10: INTERACTIVE DEMO */}
        <section 
          id="section-demo"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${visibleSections.has('section-demo') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
              <Play className="w-4 h-4" />
              Interactive Demo
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Experience the <span className="text-orange-600">Future of Booking</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              See how our AI handles real conversations with human-like precision
            </p>

            {/* Demo Player */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 relative overflow-hidden" role="region" aria-label="Interactive demo preview">
              {/* Waveform */}
              <div className="flex items-center justify-center gap-1 h-24 mb-6" aria-hidden="true">
                {DEMO_WAVEFORM_HEIGHTS.map((bar, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 bg-gradient-to-t from-orange-500 to-violet-500 rounded-full"
                    style={{
                      height: `${bar.height}%`,
                      animation: `pulse ${bar.duration}s ease-in-out infinite`,
                      animationDelay: `${bar.delay}s`
                    }}
                  ></div>
                ))}
              </div>

              {/* Transcript Preview */}
              <div className="text-left bg-gray-50 rounded-2xl p-4 mb-6 max-w-md mx-auto" role="log" aria-label="Conversation transcript">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold" aria-label="AI Assistant">AI</div>
                  <div className="bg-orange-50/60 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-700">
                    Hello! I would be happy to help you book an appointment. What date works best for you?
                  </div>
                </div>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-orange-50/60 rounded-2xl rounded-tr-sm p-3 text-sm text-gray-700">
                    Tomorrow at 10 AM, please
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold" aria-label="User">U</div>
                </div>
              </div>

              <Link
                href="/signup?demo=appointments"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-violet-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-orange-300/40 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                aria-label="Watch the full appointment booking demo"
              >
                <Play className="w-5 h-5" aria-hidden="true" />
                Watch Full Demo
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 11: TESTIMONIALS */}
        <section 
          id="section-testimonial"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]" 
          aria-labelledby="testimonial-title"
        >
          <div className={`max-w-5xl mx-auto transition-all duration-700 ${visibleSections.has('section-testimonial') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 id="testimonial-title" className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
              Trusted by <span className="text-orange-600">Healthcare Leaders</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "We went from missing 30% of after-hours calls to capturing every booking. Appointment volume increased by 45%.",
                  name: "Sarah Bennett",
                  role: "Practice Manager, Bright Smile Dental",
                  initials: "SB"
                },
                {
                  quote: "The AI sounds so natural, patients often don't realize they're not talking to a human. Game-changer for our clinic.",
                  name: "Dr. James Wilson",
                  role: "Medical Director, HealthFirst Clinic",
                  initials: "JW"
                },
                {
                  quote: "Setup took just 2 days. We reduced front desk calls by 70% and our staff can finally focus on patients.",
                  name: "Maria Garcia",
                  role: "Operations Lead, Wellness Hub",
                  initials: "MG"
                }
              ].map((testimonial, idx) => (
                <figure 
                  key={idx}
                  className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all ${visibleSections.has('section-testimonial') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <div className="flex gap-0.5 mb-3" role="img" aria-label="5 out of 5 stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 text-sm mb-4 leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <cite className="font-semibold text-gray-900 not-italic text-sm">{testimonial.name}</cite>
                      <div className="text-gray-500 text-xs">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 12: TRUST & SECURITY */}
        <section 
          id="section-security"
          data-animate
          className="px-4 py-12 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]" 
          aria-labelledby="security-title"
        >
          <div className={`max-w-5xl mx-auto transition-all duration-700 ${visibleSections.has('section-security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <h2 id="security-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Enterprise-Grade <span className="text-orange-600">Security</span>
              </h2>
              <p className="text-gray-600">Healthcare-ready architecture you can trust</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: "Secure Data", desc: "Protected handling", color: "orange" },
                { icon: Lock, title: "Encrypted", desc: "End-to-end security", color: "orange" },
                { icon: Server, title: "Reliable AI", desc: "99.9% uptime", color: "orange" },
                { icon: Building2, title: "Healthcare Ready", desc: "HIPAA compliant", color: "orange" },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={`text-center p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${visibleSections.has('section-security') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform hover:scale-110 ${
                    item.color === 'orange' ? 'bg-orange-50/60 text-orange-600' : 'bg-orange-50/60 text-orange-600'
                  }`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* SECTION 14: INDUSTRIES WE SERVE */}
        <section 
          id="section-industries"
          data-animate
          className="px-4 py-16 bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff]"
        >
          <div className={`max-w-7xl mx-auto transition-all duration-700 ${visibleSections.has('section-industries') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/60 text-orange-600 rounded-full font-semibold text-sm mb-4">
                <Building2 className="w-4 h-4" />
                Industries We Serve
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Built for <span className="text-orange-600">Every Industry</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                From healthcare to wellness, our AI adapts to your specific business needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Healthcare & Clinics",
                  desc: "Multi-doctor scheduling, patient records integration, HIPAA compliant",
                  image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop",
                  color: "orange"
                },
                {
                  title: "Dental Practices",
                  desc: "Treatment scheduling, follow-up reminders, dental history tracking",
                  image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&h=300&fit=crop",
                  color: "orange"
                },
                {
                  title: "Wellness & Spa",
                  desc: "Service bookings, therapist scheduling, package management",
                  image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
                  color: "green"
                },
                {
                  title: "Fitness Studios",
                  desc: "Class bookings, trainer scheduling, membership integration",
                  image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
                  color: "orange"
                },
                {
                  title: "Veterinary Clinics",
                  desc: "Pet appointments, vaccination reminders, multi-vet support",
                  image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
                  color: "orange"
                },
                {
                  title: "Professional Services",
                  desc: "Consultation bookings, client management, calendar sync",
                  image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
                  color: "green"
                }
              ].map((industry, idx) => (
                <div 
                  key={idx} 
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${visibleSections.has('section-industries') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${0.1 + idx * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={industry.image}
                      alt={industry.title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${
                      industry.color === 'orange' ? 'bg-orange-500' :
                      industry.color === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                    }`}>
                      Popular
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{industry.title}</h3>
                    <p className="text-gray-600 text-sm">{industry.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

     
      </main>

      <Footer />

      {/* CSS for animations with reduced motion support */}
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
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.2); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }
        @keyframes rotateIn {
          from { opacity: 0; transform: rotate(-10deg) scale(0.9); }
          to { opacity: 1; transform: rotate(0) scale(1); }
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 0.6s ease-out forwards; }
        .animate-fadeInRight { animation: fadeInRight 0.6s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.7s ease-out forwards; }
        .animate-bounceIn { animation: bounceIn 0.6s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-rotateIn { animation: rotateIn 0.5s ease-out forwards; }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
        
        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
