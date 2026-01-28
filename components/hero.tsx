"use client"
import ProductShowcase from "@/components/solutions/ProductShowcase";
import PerformanceDashboard from "@/components/hero/PerformanceDashboard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, BarChart3, Calendar, CheckCircle, Clock, Globe, Headphones, LayoutDashboard, MessageSquare, PhoneCall, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// Services data for attractive-style scroll showcase
const services = [
    {
        title: "Doctor Appointments",
        subtitle: "24/7 AI-Powered Medical Scheduling",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/doctor_appointment_i73m9a",
        desc: "Never miss a patient again. Our AI voice agent handles appointment booking, rescheduling, and confirmations around the clock—with perfect accuracy and a warm, human touch.",
        color: "from-blue-500 to-red-500",
        stat: "95%",
        statLabel: "Booking Success Rate",
        audio: "/audio/doctor-appointment-sample.mp3",
        features: [
            { icon: "Calendar", text: "Smart scheduling with real-time calendar sync" },
            { icon: "Clock", text: "Instant SMS & email confirmations" },
            { icon: "Users", text: "Insurance verification & patient intake" },
            { icon: "Shield", text: "100% HIPAA compliant conversations" },
        ],
    },

    {
        title: "Lead Generation",
        subtitle: "Automated Outbound Sales Machine",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/lead_generation_qas7wm",
        desc: "Scale your sales pipeline effortlessly. Our AI makes thousands of outbound calls daily, qualifying leads and booking meetings while your team focuses on closing.",
        color: "from-blue-500 to-purple-500",
        stat: "3x",
        statLabel: "More Qualified Leads",
        audio: "/audio/lead-generation-sample.mp3",
        features: [
            { icon: "TrendingUp", text: "Smart lead qualification & scoring" },
            { icon: "Calendar", text: "Auto-book meetings in your calendar" },
            { icon: "BarChart3", text: "Real-time conversion analytics" },
            { icon: "Zap", text: "Seamless CRM & Salesforce sync" },
        ],
    },
    {
        title: "Customer Care Agent",
        subtitle: "Empathetic Support That Never Sleeps",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/customercareagent_k6wqe8",
        desc: "Delight customers with instant, empathetic support. Our AI resolves issues on the first call, escalates complex cases smartly, and keeps your CSAT scores soaring.",
        color: "from-teal-500 to-blue-500",
        stat: "90%",
        statLabel: "First Call Resolution",
        audio: "/audio/customer-care-sample.mp3",
        features: [
            { icon: "Headphones", text: "24/7 support without hold times" },
            { icon: "CheckCircle", text: "90% first-call resolution rate" },
            { icon: "MessageSquare", text: "Smart escalation to human agents" },
            { icon: "Award", text: "Real-time satisfaction tracking" },
        ],
    },
    {
        title: "Voicebot Integration",
        subtitle: "Seamlessly Connect AI Voice to Your Systems",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/voicebot_integaration_pjlorx",
        desc: "Connect our AI voice agents directly into your existing workflows. From CRM updates to calendar syncing, our voicebot integrates with the tools you already use.",
        color: "from-cyan-500 to-blue-600",
        stat: "50+",
        statLabel: "Native Integrations",
        audio: "/audio/virtual-receptionist-sample.mp3",
        features: [
            { icon: "Zap", text: "Connect with Zapier, Make, & 1000+ apps" },
            { icon: "Share2", text: "Bi-directional data flow & updates" },
            { icon: "Code", text: "RESTful API & SDK for developers" },
            { icon: "Shield", text: "Enterprise-grade security & compliance" },
        ],
    },
    {
        title: "AI Call Center",
        subtitle: "Enterprise-Grade Communication Hub",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/ai_call_center_kalt8q",
        desc: "Transform your entire call center operation. Handle unlimited concurrent calls with intelligent routing, real-time analytics, and seamless human handoff when needed.",
        color: "from-purple-500 to-indigo-500",
        stat: "∞",
        statLabel: "Unlimited Capacity",
        audio: "/audio/call-center-sample.mp3",
        features: [
            { icon: "LayoutDashboard", text: "Real-time monitoring dashboard" },
            { icon: "Users", text: "AI + human agent orchestration" },
            { icon: "BarChart3", text: "Advanced analytics & reporting" },
            { icon: "Shield", text: "SOC2 & enterprise security" },
        ],
    },
];

export default function Hero() {
    const stats = [
        { label: "Uptime Guarantee", value: 99.9, suffix: "%", formatter: (val: number) => val.toFixed(1) },
        { label: "P99 AI Inference Latency", value: 750, suffix: "ms", formatter: (val: number) => val.toLocaleString() },
        { label: "AI Support Coverage", value: 24, suffix: "/7", formatter: (val: number) => `${val} ` }
    ];

    const [counts, setCounts] = useState([0, 0, 0])
    const [showVideo, setShowVideo] = useState(false)
    const handleCloseVideo = () => setShowVideo(false);
    const vapiRef = useRef<any>(null)
    const [isCallActive, setIsCallActive] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcript, setTranscript] = useState("Hello! I'm your AI assistant. Click the microphone to start a conversation in any Language.")
    const [callStatus, setCallStatus] = useState("")
    const [vapiLoaded, setVapiLoaded] = useState(false)
    const soundBarHeightsRef = useRef<number[]>([])
    const [callDuration, setCallDuration] = useState(0)
    const callDurationRef = useRef<NodeJS.Timeout | null>(null)
    const [volumeLevel, setVolumeLevel] = useState(0)
    const [isConnecting, setIsConnecting] = useState(false)

    // Ref for attractive scroll-story section
    const storySectionRef = useRef<HTMLDivElement>(null)

    // Track active service for audio
    const [activeService, setActiveService] = useState(0)

    // Fixed: Single mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false)

    // Mount effect - only run on client
    useEffect(() => {
        setMounted(true)
        // Initialize stable random heights for sound bars
        soundBarHeightsRef.current = Array.from({ length: 12 }, () => Math.random())
    }, [])

    // GSAP  pinned scroll showcase
    useEffect(() => {
        if (!mounted || !storySectionRef.current) return;

        const ctx = gsap.context(() => {
            const illustrations = gsap.utils.toArray<HTMLElement>(".exo-illustration");
            const contents = gsap.utils.toArray<HTMLElement>(".exo-content");

            // Initial states - all hidden except first
            illustrations.forEach((el, i) => {
                gsap.set(el, {
                    opacity: i === 0 ? 1 : 0,
                    zIndex: i === 0 ? 10 : 1
                });
            });
            contents.forEach((el, i) => {
                gsap.set(el, {
                    opacity: i === 0 ? 1 : 0,
                    zIndex: i === 0 ? 10 : 1
                });
            });

            // Floating animation for images
            illustrations.forEach((el) => {
                const img = el.querySelector('img');
                if (img) {
                    gsap.to(img, {
                        y: -12,
                        duration: 3 + Math.random() * 2,
                        ease: "sine.inOut",
                        repeat: -1,
                        yoyo: true,
                    });
                }
            });

            // Scroll-based service switching
            ScrollTrigger.create({
                trigger: storySectionRef.current,
                start: "top top",
                end: `+=${services.length * 100}%`,
                pin: true,
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const currentIndex = Math.min(
                        Math.floor(progress * services.length),
                        services.length - 1
                    );

                    setActiveService(currentIndex);

                    illustrations.forEach((el, i) => {
                        gsap.to(el, {
                            opacity: i === currentIndex ? 1 : 0,
                            duration: 0.3,
                            zIndex: i === currentIndex ? 10 : 1,
                        });
                    });
                    contents.forEach((el, i) => {
                        gsap.to(el, {
                            opacity: i === currentIndex ? 1 : 0,
                            duration: 0.3,
                            zIndex: i === currentIndex ? 10 : 1,
                        });
                    });
                }
            });
        }, storySectionRef);

        return () => ctx.revert();
    }, [mounted]);

    // Initialize Vapi only on client side
    useEffect(() => {
        if (typeof window === 'undefined') return

        let vapiInstance: any = null

        const initVapi = async () => {
            try {
                const VapiModule = await import('@vapi-ai/web')
                vapiInstance = new VapiModule.default('00119fad-8530-413f-9699-e47cada57939')
                vapiRef.current = vapiInstance
                setVapiLoaded(true)

                vapiInstance.on('call-start', () => {
                    setIsCallActive(true)
                    setIsConnecting(false)
                    setTranscript("Listening for your request...")
                    setCallStatus('Call active - Listening')
                    setCallDuration(0)
                    callDurationRef.current = setInterval(() => {
                        setCallDuration(prev => prev + 1)
                    }, 1000)
                })

                vapiInstance.on('call-end', () => {
                    setIsCallActive(false)
                    setIsSpeaking(false)
                    setIsConnecting(false)
                    setTranscript("Hello! I'm your AI assistant. Click the microphone to start a conversation.")
                    setCallStatus('Call ended')
                    if (callDurationRef.current) {
                        clearInterval(callDurationRef.current)
                        callDurationRef.current = null
                    }
                    setCallDuration(0)
                    setVolumeLevel(0)
                })

                vapiInstance.on('speech-start', () => {
                    setIsSpeaking(true)
                    setCallStatus('Assistant speaking...')
                    // Simulate volume fluctuation
                    const volumeInterval = setInterval(() => {
                        setVolumeLevel(Math.random() * 100)
                    }, 100)
                        ; (vapiInstance as any)._volumeInterval = volumeInterval
                })

                vapiInstance.on('speech-end', () => {
                    setIsSpeaking(false)
                    setCallStatus('Call active - Listening')
                    setVolumeLevel(0)
                    if ((vapiInstance as any)._volumeInterval) {
                        clearInterval((vapiInstance as any)._volumeInterval)
                    }
                })

                vapiInstance.on('message', (message: any) => {
                    if (message.type === 'transcript' && message.transcriptType === 'final') {
                        setTranscript(message.transcript)
                    } else if (message.type === 'end-of-speech') {
                        setCallStatus('Assistant is processing...')
                    }
                })

                vapiInstance.on('error', (error: any) => {
                    console.error('VAPI Error:', error)
                    setCallStatus(`Error: ${error.message || 'Unknown error'}`)
                    setIsCallActive(false)
                })
            } catch (error) {
                console.error('Failed to initialize Vapi:', error)
                setCallStatus('Failed to initialize voice assistant')
            }
        }

        initVapi()

        return () => {
            if (vapiRef.current) {
                try {
                    vapiRef.current.stop()
                } catch (e) {
                    console.error('Error stopping Vapi:', e)
                }
            }
            // Cleanup call duration timer
            if (callDurationRef.current) {
                clearInterval(callDurationRef.current)
            }
        }
    }, [])

    const toggleCall = async () => {
        if (!vapiRef.current || !vapiLoaded) {
            setCallStatus('Initialization in progress...')
            return
        }

        if (isCallActive) {
            try {
                vapiRef.current.stop()
                setCallStatus('Stopping call...')
            } catch (error) {
                console.error('Error stopping call :', error)
            }
        } else {
            try {
                setCallStatus('Requesting microphone...')
                try {
                    await navigator.mediaDevices.getUserMedia({ audio: true })
                } catch (err) {
                    console.error('Microphone permission denied:', err)
                    setCallStatus('Microphone permission denied')
                    alert('Please allow microphone access to use the voice assistant')
                    return
                }
                setCallStatus('Starting call...')
                setIsConnecting(true)
                await vapiRef.current.start('9ca19724-1f6c-48d1-8c62-a6107d585592')
            } catch (error) {
                console.error('Error starting call:', error)
                setCallStatus(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }
    }

    // Generate random bar heights for equalizer animation
    useEffect(() => {
        soundBarHeightsRef.current = Array.from({ length: 60 }, () => Math.random())
    }, []);

    useEffect(() => {
        const intervals: number[] = []
        stats.forEach((stat, index) => {
            let start = 0
            const end = stat.value
            const duration = 2000
            const stepTime = Math.floor(duration / (end / (index === 0 ? 0.1 : 1))) || 50

            const timer = setInterval(() => {
                start += (index === 0 ? 0.1 : 1)
                if (start >= end) {
                    start = end
                    clearInterval(timer)
                }
                setCounts(prev => {
                    const newCounts = [...prev]
                    newCounts[index] = start
                    return newCounts
                })
            }, stepTime)
            intervals.push(timer as unknown as number)
        })

        return () => intervals.forEach(clearInterval)
    }, [])

    // Audio auto-pause functionality - pause other audio when one plays
    useEffect(() => {
        const handleAudioPlay = (e: Event) => {
            const target = e.target as HTMLAudioElement;
            // Get all audio elements on the page
            const allAudio = document.querySelectorAll('audio');
            allAudio.forEach((audio) => {
                // Pause and reset all audio except the one that just started playing
                if (audio !== target) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };

        // Add event listener to all audio elements
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach((audio) => {
            audio.addEventListener('play', handleAudioPlay);
        });

        // Cleanup
        return () => {
            const allAudio = document.querySelectorAll('audio');
            allAudio.forEach((audio) => {
                audio.removeEventListener('play', handleAudioPlay);
            });
        };
    }, [mounted]);

    const deploymentFeatures = [
        {
            icon: Zap,
            title: "Instant Setup",
            description: "Deploy in under 5 minutes with zero-code integration. Pre-configured templates ensure immediate productivity."
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "AES-256 encryption, SOC 2 compliance, GDPR ready. Advanced threat detection protects every conversation."
        },
        {
            icon: Clock,
            title: "24/7 Operations",
            description: "99.9% uptime SLA with unlimited concurrent conversations. No breaks, no downtime, just continuous service."
        },
        {
            icon: TrendingUp,
            title: "Auto-Scaling",
            description: "From 10 to 100,000+ conversations instantly. Pay-as-you-grow with zero infrastructure overhead."
        },
        {
            icon: Users,
            title: "Omnichannel",
            description: "Deploy across web, mobile, WhatsApp, SMS, Slack, Teams. One dashboard controls all channels."
        },
        {
            icon: Award,
            title: "Proven Results",
            description: "85% automation rate, 60% cost reduction, 40% better satisfaction. ROI in 90 days."
        }
    ]

    return (
        <>
            {/* Video Modal Overlay */}
            {showVideo && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={handleCloseVideo}
                            className="absolute top-2 right-2 z-10 p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 font-bold text-lg shadow"
                            aria-label="Close video"
                        >
                            ×
                        </button>
                        <div className="aspect-w-16 aspect-h-9 w-full">
                            <iframe
                                src="https://www.youtube.com/embed/EK36dfsif84"
                                title="Demo Video"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                className="w-full h-96"
                                style={{ background: 'transparent' }}
                            />
                        </div>
                    </div>
                </div>
            )}
            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes fade-in-left {
                from { opacity: 0; transform: translateX(30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            .animate-fade-in-left {
                animation: fade-in-left 1s ease-out 0.4s forwards;
                opacity: 0;
            }
            @keyframes pulse-slow {
              0%, 100% { transform: scale(1); opacity: 0.2; }
              50% { transform: scale(1.05); opacity: 0.3; }
            }
            @keyframes ping-slow {
              0% { transform: scale(0.8); opacity: 0.3; }
              50% { transform: scale(1.1); opacity: 0.15; }
              100% { transform: scale(0.8); opacity: 0.3; }
            }
            @keyframes ping-slower {
              0% { transform: scale(0.7); opacity: 0.25; }
              50% { transform: scale(1.05); opacity: 0.1; }
              100% { transform: scale(0.7); opacity: 0.25; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes sound-bar-pulse {
              0% { transform: scaleY(0.6); }
              50% { transform: scaleY(1.0); }
              100% { transform: scaleY(0.6); }
            }
            @keyframes equalizer-bar {
              0%, 100% { transform: scaleY(0.5); }
              50% { transform: scaleY(1); }
            }
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fade-in-right {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes typing {
                from { width: 0; }
                to { width: 100%; }
            }
            @keyframes blink-caret {
                from, to { border-color: transparent; }
                50% { border-color: rgb(249, 115, 22); }
            }
            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
            }
            @keyframes gridMove {
                0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
                100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
            }
            @keyframes glitch {
                0%, 90%, 100% { transform: translate(0); }
                92% { transform: translate(-2px, 2px); }
                94% { transform: translate(2px, -2px); }
                96% { transform: translate(-2px, -2px); }
            }
            @keyframes shimmer {
                0% { background-position: 0% center; }
                100% { background-position: 200% center; }
            }
            @keyframes borderPulse {
                0%, 100% { box-shadow: 0 0 5px rgba(249, 115, 22, 0.3); }
                50% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); }
            }
            .glitch-text {
                animation: glitch 3s infinite;
            }
            .shimmer-text {
                background: linear-gradient(135deg, #ea580c 0%, #f97316 50%, #ea580c 100%);
                background-size: 200% auto;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: shimmer 3s linear infinite;
            }
            .border-pulse {
                animation: borderPulse 2s infinite;
            }
            @keyframes wave-pulse-1 {
              0% { transform: scale(0.8); opacity: 0.7; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes wave-pulse-2 {
              0% { transform: scale(0.8); opacity: 0.7; }
              100% { transform: scale(1.7); opacity: 0; }
            }
            @keyframes wave-pulse-3 {
              0% { transform: scale(0.8); opacity: 0.7; }
              100% { transform: scale(1.9); opacity: 0; }
            }
            /* Voice Bot Enhanced Animations */
            @keyframes orbit-1 {
              0% { transform: rotate(0deg) translateX(60px) rotate(0deg); }
              100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
            }
            @keyframes orbit-2 {
              0% { transform: rotate(120deg) translateX(80px) rotate(-120deg); }
              100% { transform: rotate(480deg) translateX(80px) rotate(-480deg); }
            }
            @keyframes orbit-3 {
              0% { transform: rotate(240deg) translateX(100px) rotate(-240deg); }
              100% { transform: rotate(600deg) translateX(100px) rotate(-600deg); }
            }
            @keyframes ripple {
              0% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.3); opacity: 0.3; }
              100% { transform: scale(1); opacity: 0.6; }
            }
            @keyframes morph {
              0%, 100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
              25% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
              50% { border-radius: 50% 60% 30% 60%/40% 60% 70% 40%; }
              75% { border-radius: 60% 40% 60% 30%/60% 40% 30% 70%; }
            }
            @keyframes breathe {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
              50% { transform: scale(1.05); box-shadow: 0 0 30px 10px rgba(249, 115, 22, 0.2); }
            }
            @keyframes sonic-wave {
              0% { transform: scaleX(0); opacity: 1; }
              100% { transform: scaleX(1); opacity: 0; }
            }
            @keyframes bounce-bar {
              0%, 100% { transform: scaleY(0.3) translateY(0); }
              50% { transform: scaleY(1) translateY(-10px); }
            }
            @keyframes glow-pulse {
              0%, 100% { filter: drop-shadow(0 0 5px rgba(249, 115, 22, 0.5)); }
              50% { filter: drop-shadow(0 0 20px rgba(249, 115, 22, 0.8)); }
            }
            @keyframes rotate-border {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes dash {
              0% { stroke-dashoffset: 300; }
              100% { stroke-dashoffset: 0; }
            }
            .animate-orbit-1 { animation: orbit-1 4s linear infinite; }
            .animate-orbit-2 { animation: orbit-2 5s linear infinite; }
            .animate-orbit-3 { animation: orbit-3 6s linear infinite; }
            .animate-ripple { animation: ripple 2s ease-in-out infinite; }
            .animate-morph { animation: morph 8s ease-in-out infinite; }
            .animate-breathe { animation: breathe 3s ease-in-out infinite; }
            .animate-sonic { animation: sonic-wave 1.5s ease-out infinite; }
            .animate-bounce-bar { animation: bounce-bar 0.6s ease-in-out infinite; }
            .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
            .animate-spin-slow { animation: spin 20s linear infinite; }
            .animate-pulse-slow { animation: pulse-slow 5s infinite ease-in-out; }
            .animate-ping-slow { animation: ping-slow 3s infinite ease-in-out; }
            .animate-ping-slower { animation: ping-slower 4s infinite ease-in-out; }

            /* Walking AI Bot Animation */
            @keyframes bot-walk {
              0%, 100% { transform: translateX(0) translateY(0); }
              25% { transform: translateX(15px) translateY(-5px); }
              50% { transform: translateX(30px) translateY(0); }
              75% { transform: translateX(15px) translateY(-5px); }
            }
            @keyframes bot-body-bounce {
              0%, 100% { transform: translateY(0) rotate(0deg); }
              25% { transform: translateY(-3px) rotate(-2deg); }
              50% { transform: translateY(0) rotate(0deg); }
              75% { transform: translateY(-3px) rotate(2deg); }
            }
            @keyframes left-leg {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-25deg); }
              50% { transform: rotate(0deg); }
              75% { transform: rotate(25deg); }
            }
            @keyframes right-leg {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(25deg); }
              50% { transform: rotate(0deg); }
              75% { transform: rotate(-25deg); }
            }
            @keyframes left-arm {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(20deg); }
              50% { transform: rotate(0deg); }
              75% { transform: rotate(-20deg); }
            }
            @keyframes right-arm {
              0%, 100% { transform: rotate(0deg); }
              25% { transform: rotate(-20deg); }
              50% { transform: rotate(0deg); }
              75% { transform: rotate(20deg); }
            }
            @keyframes antenna-wobble {
              0%, 100% { transform: rotate(-5deg); }
              50% { transform: rotate(5deg); }
            }
            @keyframes eye-blink {
              0%, 45%, 55%, 100% { transform: scaleY(1); }
              50% { transform: scaleY(0.1); }
            }
            @keyframes bot-glow {
              0%, 100% { filter: drop-shadow(0 0 10px rgba(14, 165, 233, 0.5)); }
              50% { filter: drop-shadow(0 0 25px rgba(14, 165, 233, 0.8)); }
            }
            @keyframes bot-hover-move {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(calc(100vw + 100%)); }
            }
            .animate-bot-walk { animation: bot-walk 0.8s ease-in-out infinite; }
            .animate-bot-body { animation: bot-body-bounce 0.8s ease-in-out infinite; }
            .animate-left-leg { animation: left-leg 0.8s ease-in-out infinite; transform-origin: top center; }
            .animate-right-leg { animation: right-leg 0.8s ease-in-out infinite; transform-origin: top center; }
            .animate-left-arm { animation: left-arm 0.8s ease-in-out infinite; transform-origin: top center; }
            .animate-right-arm { animation: right-arm 0.8s ease-in-out infinite; transform-origin: top center; }
            .animate-antenna { animation: antenna-wobble 1s ease-in-out infinite; transform-origin: bottom center; }
            .animate-eye-blink { animation: eye-blink 4s ease-in-out infinite; }
            .animate-bot-glow { animation: bot-glow 2s ease-in-out infinite; }
            .animate-bot-hover { animation: bot-hover-move 15s linear infinite; }

            /* Premium Walking Bot Animations */
            @keyframes bot-walk-across {
                0% { transform: translateX(-150px); }
                100% { transform: translateX(calc(100vw + 150px)); }
            }
            @keyframes bot-bounce-walk {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-8px); }
            }
            @keyframes shadow-pulse-bot {
                0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.3; }
                50% { transform: translateX(-50%) scale(0.8); opacity: 0.2; }
            }
            @keyframes glow-breathe-bot {
                0%, 100% { opacity: 0.3; transform: scale(1.5); }
                50% { opacity: 0.5; transform: scale(1.7); }
            }
            @keyframes head-tilt-bot {
                0%, 100% { transform: translateX(-50%) rotate(0deg); }
                25% { transform: translateX(-50%) rotate(-3deg); }
                75% { transform: translateX(-50%) rotate(3deg); }
            }
            @keyframes antenna-sway-bot {
                0%, 100% { transform: translateX(-50%) rotate(-5deg); }
                50% { transform: translateX(-50%) rotate(5deg); }
            }
            @keyframes antenna-glow-bot {
                0%, 100% { box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8; }
                50% { box-shadow: 0 0 20px #38bdf8, 0 0 40px #38bdf8, 0 0 60px #38bdf8; }
            }
            @keyframes eye-look-bot {
                0%, 40%, 100% { transform: translateX(0); }
                45%, 55% { transform: translateX(2px); }
                60%, 80% { transform: translateX(-2px); }
            }
            @keyframes chest-pulse-bot {
                0%, 100% { transform: translateX(-50%) scale(1); }
                50% { transform: translateX(-50%) scale(1.1); }
            }
            @keyframes arm-swing-left-bot {
                0%, 100% { transform: rotate(15deg); }
                50% { transform: rotate(-15deg); }
            }
            @keyframes arm-wave-bot {
                0%, 100% { transform: rotate(-30deg); }
                50% { transform: rotate(10deg); }
            }
            @keyframes finger-wave-bot {
                0%, 100% { transform: rotate(0deg) translateY(0); }
                50% { transform: rotate(-10deg) translateY(-2px); }
            }
            @keyframes leg-walk-left-bot {
                0%, 100% { transform: rotate(-20deg); }
                50% { transform: rotate(20deg); }
            }
            @keyframes leg-walk-right-bot {
                0%, 100% { transform: rotate(20deg); }
                50% { transform: rotate(-20deg); }
            }
            @keyframes sparkle-bot {
                0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }
            .walking-bot { animation: bot-walk-across 20s linear infinite; }
            .walking-bot-bounce { animation: bot-bounce-walk 0.5s ease-in-out infinite; }
            .walking-bot-shadow { animation: shadow-pulse-bot 0.5s ease-in-out infinite; }
            .walking-bot-glow { animation: glow-breathe-bot 2s ease-in-out infinite; }
            .walking-bot-head { animation: head-tilt-bot 1s ease-in-out infinite; }
            .walking-bot-antenna { animation: antenna-sway-bot 0.8s ease-in-out infinite; }
            .walking-bot-antenna-light { animation: antenna-glow-bot 1s ease-in-out infinite; }
            .walking-bot-eye { animation: eye-look-bot 3s ease-in-out infinite; }
            .walking-bot-chest { animation: chest-pulse-bot 1.5s ease-in-out infinite; }
            .walking-bot-arm-left { animation: arm-swing-left-bot 0.5s ease-in-out infinite; transform-origin: top center; }
            .walking-bot-arm-right { animation: arm-wave-bot 0.4s ease-in-out infinite; transform-origin: top center; }
            .walking-bot-finger { animation: finger-wave-bot 0.3s ease-in-out infinite; }
            .walking-bot-finger-delay-1 { animation: finger-wave-bot 0.3s ease-in-out infinite 0.1s; }
            .walking-bot-finger-delay-2 { animation: finger-wave-bot 0.3s ease-in-out infinite 0.2s; }
            .walking-bot-leg-left { animation: leg-walk-left-bot 0.5s ease-in-out infinite; transform-origin: top center; }
            .walking-bot-leg-right { animation: leg-walk-right-bot 0.5s ease-in-out infinite; transform-origin: top center; }
            .walking-bot-sparkle { animation: sparkle-bot 1.5s ease-in-out infinite; }
            .walking-bot-sparkle-delay { animation: sparkle-bot 1.5s ease-in-out infinite 0.5s; }
            .walking-bot-antenna-glow { animation: antenna-glow-bot 1s ease-in-out infinite; box-shadow: 0 0 10px #38bdf8, 0 0 20px #38bdf8; }
            .walking-bot-eyeball { box-shadow: 0 0 15px #38bdf8, inset 0 2px 4px rgba(255,255,255,0.5); }
            .walking-bot-chest { box-shadow: 0 0 20px #38bdf8, 0 0 40px #38bdf8; }

            .animate-fade-in-up-1 {
                animation: fade-in-up 1s ease-out forwards;
                opacity: 0;
            }
            .animate-fade-in-up-2 {
                animation: fade-in-up 1s ease-out 0.2s forwards;
                opacity: 0;
            }
            .animate-typing {
                position: relative;
                display: inline-block;
            }
            .animate-typing-text {
                opacity: 0;
                animation: typing-fade-in 3.5s steps(150, end) 0.5s forwards;
            }
            @keyframes typing-fade-in {
                0% {
                    opacity: 0;
                    max-width: 0;
                }
                1% {
                    opacity: 1;
                }
                100% {
                    opacity: 1;
                    max-width: 100%;
                }
            }
            .animate-typing::after {
                content: '';
                position: absolute;
                right: -2px;
                top: 0;
                width: 2px;
                height: 100%;
                background-color: rgb(249, 115, 22);
                animation: blink-caret 0.75s step-end infinite 0.5s;
            }
            .animate-fade-in-up-3 {
                animation: fade-in-up 1s ease-out 0.4s forwards;
                opacity: 0;
            }
            .animate-fade-in-right {
                animation: fade-in-right 1s ease-out 0.4s forwards;
                opacity: 0;
            }
            .animate-fade-in-right > span:nth-child(1) {
                animation: fade-in-right 0.6s ease-out 0.5s forwards;
                opacity: 0;
            }
            .animate-fade-in-right > span:nth-child(3) {
                animation: fade-in-right 0.6s ease-out 0.7s forwards;
                opacity: 0;
            }
            .animate-fade-in-right > span:nth-child(5) {
                animation: fade-in-right 0.6s ease-out 0.9s forwards;
                opacity: 0;
            }
            .animate-fade-in-right > span:nth-child(7) {
                animation: fade-in-right 0.6s ease-out 1.1s forwards;
                opacity: 0;
            }
            .animate-fade-in-right > span:nth-child(9) {
                animation: fade-in-right 0.6s ease-out 1.3s forwards;
                opacity: 0;
            }
            .animate-gradient {
                background-size: 400% 400%;
                animation: gradient 10s ease infinite;
            }
            .animate-float {
                animation: float 3s ease-in-out infinite;
            }
            .animate-wave-1 { animation: wave-pulse-1 2s ease-out infinite; }
            .animate-wave-2 { animation: wave-pulse-2 2s ease-out infinite; }
            .animate-wave-3 { animation: wave-pulse-3 2s ease-out infinite; }

            /* Responsive animation control using CSS media queries */
            @media (max-width: 768px), (prefers-reduced-motion: reduce) {
                .responsive-animate {
                    animation: none !important;
                }
                .responsive-opacity {
                    opacity: 0.05 !important;
                }
            }
            `}} />

            <section className="pt-20 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/40 to-blue-50" role="region" aria-labelledby="hero-heading">

                {/* Animated Background Elements */}
                {mounted && (
                    <>
                        {/* Floating Orbs */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
                            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow"></div>
                        </div>
                        
                        {/* Animated Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: 'linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}></div>
                        
                        {/* Floating Particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        animationDelay: `${Math.random() * 5}s`,
                                        animationDuration: `${3 + Math.random() * 4}s`
                                    }}
                                ></div>
                            ))}
                        </div>

                        {/* Animated Lines */}
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse-slow"></div>
                        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                    </>
                )}

                <div className="container mx-auto relative z-30 max-w-7xl">

                    {/* Main Hero - Image Left, Content Right */}
                    <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 items-center min-h-[60vh]">
                        
                        {/* Left Side - Content */}
                        <div className="order-1 lg:order-1 text-center lg:text-left">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-full mb-6 animate-fade-in-up-1 shadow-sm">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm font-bold text-blue-700">AI-Powered Voice Platform</span>
                            </div>

                            {/* Main Headline */}
                            <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 mb-6 leading-[1.1] animate-fade-in-up-2">
                                <span className="block">
                                    <span className="text-gray-900">Your AI Voice Assistant</span>
                                    <span className="block text-blue-600 mt-2">Never Sleeps</span>
                                </span>
                            </h1>

                            {/* Tagline Box */}
                            <div className="bg-white border-l-4 border-blue-600 rounded-xl p-5 mb-8 animate-fade-in-up-3 shadow-lg shadow-blue-500/5">
                                <p className="text-gray-500 text-base italic mb-2">"Your receptionist sleeps, gets sick, takes breaks."</p>
                                <p className="text-blue-600 font-black text-lg uppercase tracking-wider">WE NEVER DO.</p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-base lg:text-lg mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up-3">
                                Transform your business with <strong className="text-gray-900">AI voice agents</strong> that handle unlimited calls, provide instant responses, and deliver detailed analytics.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10 animate-fade-in-up-3">
                                <Link
                                    href="/signup"
                                    className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 flex items-center justify-center gap-2 text-base relative overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="relative flex items-center gap-2">
                                        Start Free Trial
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="group px-8 py-4 bg-white text-blue-600 border-2 border-blue-200 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base"
                                    aria-label="Watch demo video"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                        </svg>
                                    </div>
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in-up-3">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-700 font-medium">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-700 font-medium">Setup in 5 minutes</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm text-gray-700 font-medium">50+ Languages</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Image with Glow Effect */}
                        <div className="relative order-2 lg:order-2 flex justify-center lg:justify-end">
                            
                            {/* Glow Effect Behind Image */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-80 h-80 lg:w-96 lg:h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse-slow" />
                            </div>
                          
                            {/* Main Image - Clean PNG look */}
                            <img
                                src="https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval/landingpage_dhuzrr"
                                alt="AI Voice Assistant"
                                className="relative z-30 w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain animate-float"
                                style={{ filter: 'drop-shadow(0 30px 60px rgba(59, 130, 246, 0.25))' }}
                            />
                            
                            {/* Floating Badge - Bottom Left */}
                            <div className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-5 border border-gray-100 animate-fade-in-up-3 z-40 hover:scale-105 transition-transform cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <PhoneCall className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900">95%</p>
                                        <p className="text-sm text-gray-500 font-medium">Success Rate</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Stats Badge - Top Right */}
                            <div className="absolute top-12 right-0 bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-5 border border-gray-100 animate-fade-in-up-2 z-40 hover:scale-105 transition-transform cursor-default">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                        <TrendingUp className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-black text-gray-900">24/7</p>
                                        <p className="text-sm text-gray-500">Always Available</p>
                                    </div>
                                </div>
                            </div>
                        </div>
            {/* Vapi Animation Styles (global for hero SVG) */}
            <style>{`
                .vapi-hero-wave {
                    opacity: 0.5;
                    transform-origin: 50% 50%;
                    stroke-dasharray: 8 8;
                }
                .vapi-hero-wave1 {
                    animation: vapi-wave1 2.5s linear infinite;
                }
                .vapi-hero-wave2 {
                    animation: vapi-wave2 3.2s linear infinite;
                }
                .vapi-hero-wave3 {
                    animation: vapi-wave3 4.1s linear infinite;
                }
                @keyframes vapi-wave1 {
                    0% { stroke-dashoffset: 0; opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { stroke-dashoffset: 64; opacity: 0.5; }
                }
                @keyframes vapi-wave2 {
                    0% { stroke-dashoffset: 0; opacity: 0.4; }
                    50% { opacity: 0.7; }
                    100% { stroke-dashoffset: 64; opacity: 0.4; }
                }
                @keyframes vapi-wave3 {
                    0% { stroke-dashoffset: 0; opacity: 0.3; }
                    50% { opacity: 0.6; }
                    100% { stroke-dashoffset: 64; opacity: 0.3; }
                }
                .vapi-hero-mic {
                    filter: drop-shadow(0 0 12px #38bdf8) drop-shadow(0 0 24px #f97316);
                    transform-origin: 50% 80%;
                    animation: vapi-mic-bounce 2.2s ease-in-out infinite;
                }
                @keyframes vapi-mic-bounce {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.08) translateY(-8px); }
                }
            `}</style>
                    </div>

                    {/* Feature Cards Below Hero */}
                    <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: PhoneCall, title: "Smart Call Handling", desc: "AI handles unlimited concurrent calls with human-like conversations", color: "from-blue-500 to-blue-600" },
                            { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every call with detailed insights and performance metrics", color: "from-blue-500 to-blue-600" },
                            { icon: Clock, title: "24/7 Availability", desc: "Never miss a call. Your AI assistant works around the clock", color: "from-cyan-500 to-cyan-600" },
                            { icon: Globe, title: "50+ Languages", desc: "Communicate with customers in their preferred language", color: "from-teal-500 to-teal-600" }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <feature.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 shadow-2xl shadow-blue-500/30">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { value: "99.9%", label: "Uptime Guarantee" },
                                { value: "750ms", label: "Response Time" },
                                { value: "10M+", label: "Calls Handled" },
                                { value: "500+", label: "Happy Clients" }
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-blue-100 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Header - Fixed above the scrolling content */}
            <section className="py-12 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
                <div className="container mx-auto px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-400/30 text-sm text-blue-600 font-semibold mb-4 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4" />
                        <span>🎯 Our AI Voice Services</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your AI Voice Solution
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Select from our comprehensive suite of AI voice services. Each solution is ready to deploy on our platform and can be customized for your business needs.
                    </p>
                </div>
            </section>

            {/* AI Voice Use Cases Section - Style Pinned Scroll */}
            <section ref={storySectionRef} className="h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
                <div className="container mx-auto h-full px-8 flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">

                        {/* LEFT: Floating Illustrations */}
                        <div className="relative h-[85vh] max-h-[600px] flex items-center justify-start pl-2">
                            {services.map((s, i) => (
                                <div key={i} className={`exo-illustration absolute inset-0 flex items-center justify-start ${i === 0 ? '' : 'pointer-events-none'}`}>
                                    <img
                                        src={s.img}
                                        alt={s.title}
                                        className="exo-main-img h-[75vh] max-h-[550px] object-contain drop-shadow-2xl"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Content */}
                        <div className="relative h-[85vh] max-h-[600px] flex flex-col justify-center">
                            {services.map((s, i) => (
                                <div key={i} className={`exo-content flex flex-col justify-center ${i === 0 ? '' : 'absolute inset-0'}`}>
                                    {/* Stat Badge */}
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${s.color} text-white text-sm font-bold mb-4 w-fit`}>
                                        <CheckCircle className="h-4 w-4" />
                                        <span>{s.stat} {s.statLabel}</span>
                                    </div>

                                    <h2 className={`text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                                        {s.title}
                                    </h2>
                                    <p className="text-lg text-gray-500 mb-3 font-medium">{s.subtitle}</p>
                                    <p className="text-base text-gray-600 mb-5 leading-relaxed max-w-lg">
                                        {s.desc}
                                    </p>

                                    {/* Audio Player - only interactive when active */}
                                    <div className="mb-5 bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-w-md">
                                        <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">🎧 Listen to Sample Call</p>
                                        {activeService === i ? (
                                            <audio
                                                controls
                                                className="w-full h-10"
                                                style={{ accentColor: '#f97316' }}
                                                preload="metadata"
                                            >
                                                <source src={s.audio} type="audio/mpeg" />
                                                Your browser does not support audio.
                                            </audio>
                                        ) : (
                                            <div className="w-full h-10 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400">
                                                Scroll to activate audio
                                            </div>
                                        )}
                                    </div>

                                    {/* Feature Cards Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {s.features.map((f, fi) => (
                                            <div key={fi} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${s.color} flex items-center justify-center mb-2`}>
                                                    {f.icon === 'Calendar' && <Calendar className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Clock' && <Clock className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Users' && <Users className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Shield' && <Shield className="h-5 w-5 text-white" />}
                                                    {f.icon === 'PhoneCall' && <PhoneCall className="h-5 w-5 text-white" />}
                                                    {f.icon === 'MessageSquare' && <MessageSquare className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Globe' && <Globe className="h-5 w-5 text-white" />}
                                                    {f.icon === 'TrendingUp' && <TrendingUp className="h-5 w-5 text-white" />}
                                                    {f.icon === 'BarChart3' && <BarChart3 className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Zap' && <Zap className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Headphones' && <Headphones className="h-5 w-5 text-white" />}
                                                    {f.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5 text-white" />}
                                                    {f.icon === 'Award' && <Award className="h-5 w-5 text-white" />}
                                                    {f.icon === 'LayoutDashboard' && <LayoutDashboard className="h-5 w-5 text-white" />}
                                                </div>
                                                <p className="text-xs text-gray-700 font-medium leading-tight">{f.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* Real-Time Performance Dashboard */}
            <PerformanceDashboard />

            <ProductShowcase/>



            {/* Why Choose DigitalBot - Bento Grid Style */}
            <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            The DigitalBot Advantage
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Enterprise-grade AI voice solutions that scale with your business
                        </p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[120px]">

                        {/* Feature 1 - Instant Setup (Large) */}
                        <div className="col-span-2 row-span-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-1 rounded-full text-xs font-medium mb-3">
                                    <Zap className="h-3 w-3" /> Quick Start
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Instant Setup</h3>
                                <p className="text-sm text-orange-100 mb-3">
                                    Deploy your AI voice assistant in under 5 minutes with zero-code integration. Connect to your existing systems seamlessly.
                                </p>
                                <ul className="text-xs text-orange-100 space-y-1">
                                    <li className="flex items-center gap-1.5">
                                        <CheckCircle className="h-3 w-3 text-orange-200" /> No technical expertise needed
                                    </li>
                                
                                    <li className="flex items-center gap-1.5">
                                        <CheckCircle className="h-3 w-3 text-orange-200" /> Instant API integration
                                    </li>
                                </ul>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-3xl font-bold text-white">5 min</div>
                                    <div className="text-orange-200 text-xs">Setup Time</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-white">0</div>
                                    <div className="text-orange-200 text-xs">Code Required</div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Enterprise Security */}
                        <div className="col-span-2 row-span-1 bg-gray-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="h-5 w-5 text-emerald-400" />
                                <h3 className="text-base font-bold text-white">Enterprise Security</h3>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">AES-256 encryption, SOC 2 certified, GDPR & HIPAA compliant.</p>
                            <div className="flex gap-1.5">
                                <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">SOC 2</span>
                                <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">GDPR</span>
                                <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">HIPAA</span>
                            </div>
                        </div>

                        {/* Feature 3 - 24/7 Operations */}
                        <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-white" />
                                <h3 className="text-sm font-bold text-white">24/7 Operations</h3>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">99.9%</div>
                                <div className="text-purple-200 text-xs">Uptime SLA</div>
                            </div>
                        </div>

                        {/* Feature 4 - Auto-Scaling */}
                        <div className="col-span-1 row-span-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-white" />
                                <h3 className="text-sm font-bold text-white">Auto-Scaling</h3>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">100K+</div>
                                <div className="text-amber-100 text-xs">Conversations</div>
                            </div>
                        </div>

                        {/* Feature 5 - Omnichannel */}
                        <div className="col-span-1 row-span-1 bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 flex flex-col justify-between border border-orange-200/50 group hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-orange-500" />
                                <h3 className="text-sm font-bold text-gray-800">Omnichannel</h3>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-500">6+</div>
                                <div className="text-gray-500 text-xs">Channels</div>
                            </div>
                        </div>

                        {/* Feature 6 - Proven Results */}
                        <div className="col-span-1 row-span-1 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-2xl p-4 flex flex-col justify-between border border-teal-200/50 group hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-teal-500" />
                                <h3 className="text-sm font-bold text-gray-800">Proven Results</h3>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-teal-500">90 Day</div>
                                <div className="text-gray-500 text-xs">ROI Payback</div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="col-span-2 row-span-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center justify-between border border-gray-200/50">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-0.5">Ready to transform your business?</h3>
                                <p className="text-xs text-gray-500">14-day free trial • No credit card • Cancel anytime</p>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/signup" className="inline-flex items-center gap-1.5 bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm shadow-lg shadow-orange-500/20">
                                    Start Free <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                                <Link href="/contact" className="inline-flex items-center gap-1.5 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:bg-white transition-colors text-sm">
                                    Demo
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}
