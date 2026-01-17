"use client"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Award, BarChart3, Calendar, CheckCircle, Clock, Globe, Headphones, LayoutDashboard, MessageSquare, Mic, MicOff, PhoneCall, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
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
        color: "from-orange-500 to-red-500",
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

    // Scroll animation for flowchart
    const [flowchartVisible, setFlowchartVisible] = useState(false)
    const flowchartRef = useRef<HTMLDivElement>(null)

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

    // GSAP Journey Flowchart animation
    useEffect(() => {
        if (!mounted || !flowchartRef.current) return;

        const ctx = gsap.context(() => {
            const header = flowchartRef.current?.querySelector('.journey-header');
            const line = flowchartRef.current?.querySelector('.journey-line');
            const steps = gsap.utils.toArray<HTMLElement>('.journey-step');

            // Initial states
            gsap.set(header, { opacity: 0, y: 30 });
            gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
            gsap.set(steps, { opacity: 0, y: 40 });

            // Create scroll-triggered animation
            ScrollTrigger.create({
                trigger: flowchartRef.current,
                start: "top 80%",
                onEnter: () => {
                    // Animate header first
                    gsap.to(header, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });

                    // Animate the connecting line
                    gsap.to(line, {
                        scaleX: 1,
                        duration: 1,
                        delay: 0.3,
                        ease: "power2.inOut"
                    });

                    // Stagger animate the steps
                    gsap.to(steps, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.15,
                        delay: 0.5,
                        ease: "back.out(1.2)"
                    });
                },
                once: true
            });
        }, flowchartRef);

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

    // Scroll detection for flowchart section
    useEffect(() => {
        if (!mounted || !flowchartRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setFlowchartVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px'
            }
        );

        observer.observe(flowchartRef.current);

        return () => {
            if (flowchartRef.current) {
                observer.unobserve(flowchartRef.current);
            }
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
                            className="absolute top-2 right-2 z-10 p-2 bg-orange-100 hover:bg-orange-200 rounded-full text-orange-600 font-bold text-lg shadow"
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

            <section className="pt-16 pb-8 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-white" role="region" aria-labelledby="hero-heading">

                {mounted && (
                    <>
                        <div className="absolute inset-0 overflow-hidden pointer-events-none responsive-opacity">
                            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/10 to-transparent animate-pulse-slow responsive-animate"></div>
                            <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-600/8 to-transparent animate-pulse-slow responsive-animate" style={{ animationDelay: '1s' }}></div>
                        </div>
                    </>
                )}

                <div className="container mx-auto relative z-30 max-w-5xl">

                    {/* Hero Content - Text First */}
                    <div className="flex flex-col items-center text-center animate-fade-in-up-2">

                        {/* Main Headline */}
                        <div className="mb-4">
                            <p className="text-sm sm:text-base text-gray-500 mb-2 font-medium tracking-wide">Transform Your Business with</p>
                            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-2">
                                AI Voice <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Assistants</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-orange-600 font-semibold">AI Voice Agent Platform</p>
                        </div>

                        {/* Tagline */}
                        <div className="mb-4">
                            <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Never Sleeps, Never Stops</p>
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
                                <p className="text-gray-600 text-sm sm:text-base italic mb-2">"Your receptionist sleeps, gets sick, takes breaks."</p>
                                <p className="text-orange-600 font-bold text-lg sm:text-xl uppercase tracking-wider">WE NEVER DO.</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-base sm:text-lg max-w-3xl mb-4 leading-relaxed">
                            Transform your business with <strong className="font-semibold text-gray-700">AI voice agents</strong> that handle unlimited calls simultaneously, provide instant responses, and deliver <strong className="font-semibold text-gray-700">detailed analytics</strong> through your <strong className="font-semibold text-gray-700">personal dashboard</strong>. Our <strong className="font-semibold text-gray-700">AI voice assistant</strong> platform automates customer service, lead qualification, and business communications.
                        </p>

                        {/* Feature Highlights */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <BarChart3 className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Real-Time Analytics</span>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <LayoutDashboard className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Personal Dashboard</span>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <PhoneCall className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">Call Automation</span>
                            </div>
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <Globe className="h-4 w-4 text-orange-600" />
                                <span className="text-sm font-medium text-gray-700">50+ Languages</span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <button
                                onClick={() => setShowVideo(true)}
                                className="px-8 py-3.5 bg-white text-orange-600 border-2 border-orange-500 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-300 hover:shadow-lg"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                }}
                                aria-label="Watch demo video"
                            >
                                Watch Demo
                            </button>
                            <Link
                                href="/signup"
                                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                Start Free Trial
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* Voice Bot Section - Below Content */}
                        <div className="w-full flex flex-col items-center">
                            <p className="text-gray-500 text-sm mb-4 font-medium">Try our AI Voice Assistant</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Full Width Equalizer Section */}
            <section className="w-full bg-gradient-to-b from-gray-50 to-white py-16 relative overflow-hidden">
                {/* Enhanced background pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                {/* Animated glow effect when active */}
                {mounted && isCallActive && (
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-orange-500/20 via-orange-500/5 to-transparent rounded-full animate-pulse-slow"></div>
                    </div>
                )}

                <div className="w-full px-4 sm:px-8 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-orange-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 mb-4">
                            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                            <span className="text-sm font-medium text-orange-700">
                                {isCallActive ? 'Live Conversation' : 'AI Voice Demo'}
                            </span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Experience AI Voice in Action
                        </h3>
                        <p className="text-gray-600 max-w-lg mx-auto">
                            Click the button below to have a real conversation with our AI assistant
                        </p>
                    </div>

                    {/* Equalizer Bars - Full Width with Morphing Container */}
                    <div className="flex items-end justify-center gap-1 sm:gap-2 h-40 sm:h-52 mb-8 w-full relative">
                        {/* Morphing blob background when speaking */}
                        {mounted && isSpeaking && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-32 bg-gradient-to-r from-orange-400/20 via-amber-400/20 to-orange-400/20 blur-2xl animate-morph"></div>
                            </div>
                        )}

                        {/* Sonic wave effect */}
                        {mounted && isSpeaking && (
                            <>
                                <div className="absolute bottom-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent animate-sonic origin-center"></div>
                                <div className="absolute bottom-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent animate-sonic origin-center" style={{ animationDelay: '0.5s' }}></div>
                            </>
                        )}

                        {mounted && [...Array(60)].map((_, i) => {
                            // Create a wave pattern - higher in the middle, lower at edges
                            const centerIndex = 29.5;
                            const distanceFromCenter = Math.abs(i - centerIndex);
                            const baseHeight = Math.max(20, 100 - (distanceFromCenter * 2.5));
                            const randomFactor = (soundBarHeightsRef.current[i % 40] || 0.5) * 25;
                            const volumeBoost = isSpeaking ? (volumeLevel / 100) * 15 : 0;

                            // Color pattern - vibrant colors matching the reference
                            const colors = [
                                'bg-orange-500', 'bg-amber-400', 'bg-yellow-400', 'bg-orange-400',
                                'bg-pink-400', 'bg-fuchsia-400', 'bg-purple-400', 'bg-violet-400',
                                'bg-cyan-400', 'bg-teal-400', 'bg-emerald-400', 'bg-green-400',
                                'bg-orange-300', 'bg-red-400', 'bg-rose-400', 'bg-white'
                            ];
                            const colorIndex = i % colors.length;
                            const barColor = colors[colorIndex];

                            return (
                                <div
                                    key={i}
                                    className={`w-2 sm:w-3 md:w-4 rounded-full transition-all duration-150 ${barColor} shadow-sm relative`}
                                    style={{
                                        height: isSpeaking
                                            ? `${baseHeight + randomFactor + volumeBoost}%`
                                            : isCallActive
                                                ? `${baseHeight * 0.6 + randomFactor * 0.4}%`
                                                : isConnecting
                                                    ? `${baseHeight * 0.5}%`
                                                    : `${baseHeight * 0.4}%`,
                                        animation: isSpeaking
                                            ? `bounce-bar 0.${3 + (i % 5)}s ease-in-out infinite`
                                            : isCallActive
                                                ? `bounce-bar 0.${6 + (i % 4)}s ease-in-out infinite`
                                                : isConnecting
                                                    ? `ripple 1.${i % 5}s ease-in-out infinite`
                                                    : 'none',
                                        animationDelay: `${(i % 12) * 0.05}s`,
                                        opacity: isSpeaking ? 1 : isCallActive ? 0.85 : isConnecting ? 0.7 : 0.6,
                                        filter: isSpeaking ? 'drop-shadow(0 4px 8px rgba(249, 115, 22, 0.4))' : 'none'
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Enhanced Talk Button with Visual Feedback */}
                    <div className="flex flex-col items-center mb-8">
                        {/* Call Duration Timer */}
                        {mounted && isCallActive && (
                            <div className="flex items-center gap-2 mb-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                <span className="text-white font-mono text-sm">
                                    {String(Math.floor(callDuration / 60)).padStart(2, '0')}:{String(callDuration % 60).padStart(2, '0')}
                                </span>
                            </div>
                        )}

                        {/* Main Button with Orbital Rings */}
                        <div className="relative">
                            {/* Orbital rings when active */}
                            {mounted && isCallActive && (
                                <>
                                    {/* Orbiting dots */}
                                    <div className="absolute inset-0 w-full h-full" style={{ animation: 'rotate-border 3s linear infinite' }}>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50"></div>
                                    </div>
                                    <div className="absolute inset-0 w-full h-full" style={{ animation: 'rotate-border 4s linear infinite reverse' }}>
                                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-400 rounded-full shadow-lg shadow-amber-400/50"></div>
                                    </div>
                                    <div className="absolute inset-0 w-full h-full" style={{ animation: 'rotate-border 5s linear infinite' }}>
                                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"></div>
                                    </div>
                                    {/* Breathing glow effect */}
                                    <div className="absolute inset-0 -m-2 rounded-full bg-gradient-to-r from-orange-500/20 via-transparent to-orange-500/20 animate-breathe"></div>
                                    {/* Ripple rings */}
                                    <div className="absolute inset-0 -m-6 rounded-full border border-orange-500/30 animate-ripple"></div>
                                    <div className="absolute inset-0 -m-10 rounded-full border border-orange-500/20 animate-ripple" style={{ animationDelay: '0.5s' }}></div>
                                </>
                            )}

                            {/* Connecting - rotating dashed border */}
                            {mounted && isConnecting && (
                                <>
                                    <svg className="absolute inset-0 -m-4 w-[calc(100%+32px)] h-[calc(100%+32px)]" style={{ animation: 'rotate-border 2s linear infinite' }}>
                                        <rect
                                            x="2" y="2"
                                            width="calc(100% - 4px)" height="calc(100% - 4px)"
                                            rx="9999" ry="9999"
                                            fill="none"
                                            stroke="#f97316"
                                            strokeWidth="2"
                                            strokeDasharray="10 5"
                                            className="animate-glow-pulse"
                                        />
                                    </svg>
                                </>
                            )}

                            <button
                                onClick={toggleCall}
                                disabled={callStatus.startsWith('Requesting') || callStatus.startsWith('Starting') || callStatus.startsWith('Stopping')}
                                className={`relative flex items-center justify-center gap-3
                                    px-12 py-5 rounded-full transition-all duration-300
                                    font-semibold text-sm sm:text-base tracking-wider
                                    disabled:opacity-70 disabled:cursor-not-allowed
                                    transform hover:scale-105 active:scale-95
                                    ${isCallActive
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-2xl shadow-red-500/40'
                                        : isConnecting
                                            ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-xl'
                                            : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-xl hover:shadow-orange-500/40'
                                    }`}
                                aria-label={isCallActive ? "Stop conversation with AI assistant" : "Start conversation with AI assistant"}
                            >
                                {/* Microphone Icon with glow */}
                                <div className={`relative ${isCallActive ? 'animate-glow-pulse' : ''}`}>
                                    {isCallActive ? (
                                        <MicOff className="w-5 h-5" />
                                    ) : (
                                        <Mic className={`w-5 h-5 ${isConnecting ? 'animate-bounce' : ''}`} />
                                    )}
                                </div>
                                <span className="uppercase font-bold">
                                    {isConnecting ? 'Connecting...' : isCallActive ? 'End Call' : 'Talk to AI'}
                                </span>

                                {/* Circular sound wave animation */}
                                <div className="flex items-center gap-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-full bg-white/90 transition-all duration-200`}
                                            style={{
                                                width: isCallActive || isConnecting ? '6px' : '4px',
                                                height: isCallActive || isConnecting ? '6px' : '4px',
                                                animation: isCallActive
                                                    ? `ripple 1.${2 + i}s ease-in-out infinite`
                                                    : isConnecting
                                                        ? `ripple 1.${5 + i}s ease-in-out infinite`
                                                        : 'none',
                                                animationDelay: `${i * 0.15}s`
                                            }}
                                        />
                                    ))}
                                </div>
                            </button>
                        </div>

                        {/* Voice Activity Indicator - Orbital Style */}
                        {mounted && isCallActive && (
                            <div className="mt-6 flex items-center gap-4">
                                {/* Left orbiting dots */}
                                <div className="relative w-8 h-8">
                                    <div className={`absolute inset-0 rounded-full border ${isSpeaking ? 'border-orange-400' : 'border-gray-300'} transition-colors duration-300`}></div>
                                    <div
                                        className={`absolute w-2 h-2 rounded-full ${isSpeaking ? 'bg-orange-500' : 'bg-gray-400'} transition-colors duration-300`}
                                        style={{
                                            animation: isSpeaking ? 'orbit-1 1.5s linear infinite' : 'none',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-4px',
                                            marginLeft: '-4px'
                                        }}
                                    ></div>
                                </div>

                                {/* Status text with morphing background */}
                                <div className={`relative px-4 py-2 rounded-full ${isSpeaking ? 'bg-orange-100' : 'bg-gray-100'} transition-all duration-300`}>
                                    <span className={`text-sm font-semibold ${isSpeaking ? 'text-orange-600' : 'text-gray-500'}`}>
                                        {isSpeaking ? '🎙️ AI Speaking' : '👂 Listening...'}
                                    </span>
                                    {isSpeaking && (
                                        <div className="absolute inset-0 rounded-full bg-orange-400/20 animate-ripple"></div>
                                    )}
                                </div>

                                {/* Right orbiting dots */}
                                <div className="relative w-8 h-8">
                                    <div className={`absolute inset-0 rounded-full border ${isSpeaking ? 'border-orange-400' : 'border-gray-300'} transition-colors duration-300`}></div>
                                    <div
                                        className={`absolute w-2 h-2 rounded-full ${isSpeaking ? 'bg-orange-500' : 'bg-gray-400'} transition-colors duration-300`}
                                        style={{
                                            animation: isSpeaking ? 'orbit-1 1.5s linear infinite reverse' : 'none',
                                            top: '50%',
                                            left: '50%',
                                            marginTop: '-4px',
                                            marginLeft: '-4px'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Transcript Display */}
                    <div className="flex justify-center">
                        <div suppressHydrationWarning className={`w-full max-w-2xl rounded-2xl border-2 transition-all duration-300 overflow-hidden ${isCallActive ? 'border-orange-400 shadow-xl shadow-orange-100/50' : 'border-gray-200 shadow-lg'}`}>
                            {/* Header Bar */}
                            <div className={`px-5 py-3 flex items-center justify-between ${isCallActive ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${isCallActive ? 'bg-white animate-pulse' : 'bg-orange-500'}`}></div>
                                    <span suppressHydrationWarning className={`text-sm font-semibold uppercase tracking-wider ${isCallActive ? 'text-white' : 'text-gray-700'}`}>
                                        {callStatus || "Ready to assist"}
                                    </span>
                                </div>
                                {isCallActive && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/80 text-xs">Live</span>
                                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                                    </div>
                                )}
                            </div>

                            {/* Transcript Content */}
                            <div className="bg-white p-5">
                                <div className="flex gap-3">
                                    {/* AI Avatar */}
                                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isCallActive ? 'bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30' : 'bg-gradient-to-br from-gray-200 to-gray-300'} ${isSpeaking ? 'animate-pulse' : ''}`}>
                                        <Sparkles className={`w-5 h-5 ${isCallActive ? 'text-white' : 'text-gray-600'}`} />
                                    </div>

                                    {/* Message Bubble */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 text-sm">AI Assistant</span>
                                            {isSpeaking && (
                                                <span className="text-xs text-orange-500 flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                                    Speaking
                                                </span>
                                            )}
                                        </div>
                                        <p suppressHydrationWarning className="text-gray-700 leading-relaxed text-base">
                                            {transcript}
                                            {isSpeaking && <span className="inline-block w-0.5 h-4 bg-orange-500 ml-1 animate-pulse"></span>}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions Bar */}
                            <div className="bg-gray-50 px-5 py-3 flex items-center justify-between border-t border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Globe className="w-3.5 h-3.5" />
                                        <span>50+ Languages</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Shield className="w-3.5 h-3.5" />
                                        <span>Secure</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400">
                                    Powered by AI
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Header - Fixed above the scrolling content */}
            <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-8 text-center">
                    <div className="inline-flex items-center space-x-2 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-400/30 text-sm text-orange-600 font-semibold mb-4 uppercase tracking-widest">
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
            <section ref={storySectionRef} className="h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
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
                                            <div key={fi} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition-all">
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

            {/* Scroll-Animated Journey Flowchart - GSAP Enhanced */}
            <section ref={flowchartRef} className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-orange-300/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">

                    {/* Section Header */}
                    <div className="text-center mb-10 journey-header">
                        <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-full text-orange-600 text-xs font-semibold mb-3 uppercase tracking-wider">
                            <Zap className="h-3 w-3" />
                            How It Works
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Your Journey to <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Effortless Communication</span>
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">Transform your business in 4 simple steps</p>
                    </div>

                    {/* Horizontal Timeline - Desktop / Vertical - Mobile */}
                    <div className="relative">
                        {/* Connecting Line - Horizontal on desktop */}
                        <div className="journey-line absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 via-orange-500 to-green-500 hidden md:block"></div>

                        {/* Steps Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">

                            {/* Step 1 */}
                            <div className="journey-step relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-lg flex items-center justify-center mb-4 relative z-10 border-4 border-white">
                                        <span className="text-white font-bold text-sm">1</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 w-full text-center group">
                                        <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <span className="text-2xl">❌</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">The Problem</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">Missing calls & high costs draining resources</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="journey-step relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center mb-4 relative z-10 border-4 border-white">
                                        <span className="text-white font-bold text-sm">2</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 w-full text-center group">
                                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <Zap className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">AI Solution</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">24/7 intelligent voice handling</p>
                                        <div className="mt-2 flex flex-wrap justify-center gap-1">
                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">Human-like</span>
                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">50+ Languages</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="journey-step relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center mb-4 relative z-10 border-4 border-white">
                                        <span className="text-white font-bold text-sm">3</span>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 w-full text-center group">
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Quick Setup</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">5-minute setup, no coding needed</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600">
                                                <CheckCircle className="h-3 w-3 text-blue-500" /> Choose use case
                                            </div>
                                            <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600">
                                                <CheckCircle className="h-3 w-3 text-blue-500" /> Connect & go live
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="journey-step relative">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center mb-4 relative z-10 border-4 border-white">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 shadow-lg border border-green-200 hover:shadow-xl hover:border-green-300 transition-all duration-300 w-full text-center group">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 mb-1">Results</h3>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <div className="bg-white rounded-lg p-1.5">
                                                <div className="text-sm font-bold text-green-600">85%</div>
                                                <div className="text-[9px] text-gray-500">Cost Cut</div>
                                            </div>
                                            <div className="bg-white rounded-lg p-1.5">
                                                <div className="text-sm font-bold text-green-600">24/7</div>
                                                <div className="text-[9px] text-gray-500">Available</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="mt-8 text-center">
                            <Link href="/signup" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-8 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-sm">
                                Get Started Now <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* How DigitalBot Powers AI-Driven Conversations Section */}
            <section className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-0 p-0">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-0 p-0 tracking-tight">
                            How <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">DigitalBot</span> Powers AI-Driven Conversations
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-0 p-0">
                            One intelligent AI voice platform handling appointments, calls, and customer engagement—end to end.
                        </p>
                    </div>
                    <div className="flex justify-center mt-0 pt-0">
                        <div className="relative w-full  max-w-4xl">
                            <img
                                src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/workflow2_itpthn"
                                alt="DigitalBot AI-Driven Conversation Workflow"
                                className="w-full h-auto object-contain"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Why Choose DigitalBot - Compact Image Showcase */}
            <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                            The DigitalBot Advantage
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Enterprise-grade AI voice solutions that scale with your business
                        </p>
                    </div>

                    {/* Compact Feature Blocks */}
                    <div className="space-y-5">

                        {/* Feature 1 - Instant Setup */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl p-6 lg:p-8">
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center gap-1.5 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                                    <Zap className="h-3 w-3" /> Quick Start
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Instant Setup</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Deploy your AI voice assistant in under 5 minutes with zero-code integration.
                                </p>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-2xl font-bold text-orange-500">5 min</div>
                                        <div className="text-gray-500 text-xs">Setup Time</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-orange-500">0</div>
                                        <div className="text-gray-500 text-xs">Code Required</div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 flex justify-center">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-setup-image"
                                    alt="Instant Setup Dashboard"
                                    className="w-full max-w-[200px] h-auto object-contain drop-shadow-xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Feature 2 - Enterprise Security */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 lg:p-8">
                            <div className="flex justify-center">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-security-image"
                                    alt="Enterprise Security Shield"
                                    className="w-full max-w-[200px] h-auto object-contain drop-shadow-xl"
                                    loading="lazy"
                                />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                                    <Shield className="h-3 w-3" /> Protected
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">Enterprise Security</h3>
                                <p className="text-sm text-gray-300 mb-4">
                                    AES-256 encryption, SOC 2 certified, GDPR & HIPAA compliant.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded">SOC 2</span>
                                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded">GDPR</span>
                                    <span className="px-3 py-1 bg-white/10 text-white text-xs font-medium rounded">HIPAA</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - 24/7 Operations */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-gradient-to-r from-purple-50 to-indigo-100/50 rounded-2xl p-6 lg:p-8">
                            <div className="order-2 lg:order-1">
                                <div className="inline-flex items-center gap-1.5 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                                    <Clock className="h-3 w-3" /> Always On
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">24/7 Operations</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Unlimited concurrent conversations with 99.9% uptime SLA.
                                </p>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-2xl font-bold text-purple-500">99.9%</div>
                                        <div className="text-gray-500 text-xs">Uptime</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-500">∞</div>
                                        <div className="text-gray-500 text-xs">Concurrent</div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 flex justify-center">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-247-image"
                                    alt="24/7 Operations Globe"
                                    className="w-full max-w-[200px] h-auto object-contain drop-shadow-xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                        {/* Feature 4 - Auto-Scaling */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-gradient-to-r from-blue-50 to-cyan-100/50 rounded-2xl p-6 lg:p-8">
                            <div className="flex justify-center">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-scaling-image"
                                    alt="Auto-Scaling Infrastructure"
                                    className="w-full max-w-[200px] h-auto object-contain drop-shadow-xl"
                                    loading="lazy"
                                />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium mb-3">
                                    <TrendingUp className="h-3 w-3" /> Scalable
                                </div>
                                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Auto-Scaling</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    From 10 to 100,000+ conversations instantly. Pay only for what you use.
                                </p>
                                <div className="flex items-center gap-6">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-500">100K+</div>
                                        <div className="text-gray-500 text-xs">Conversations</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-blue-500">$0</div>
                                        <div className="text-gray-500 text-xs">Overhead</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 5 & 6 - Two Column */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            {/* Omnichannel */}
                            <div className="bg-gradient-to-br from-rose-50 to-pink-100/50 rounded-2xl p-6 flex items-center gap-5">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-omnichannel-image"
                                    alt="Omnichannel Dashboard"
                                    className="w-24 h-24 object-contain drop-shadow-lg flex-shrink-0"
                                    loading="lazy"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Omnichannel</h3>
                                    <p className="text-sm text-gray-600 mb-2">Web, mobile, WhatsApp, SMS, Slack & Teams.</p>
                                    <div className="text-xl font-bold text-rose-500">6+ Channels</div>
                                </div>
                            </div>

                            {/* Proven Results */}
                            <div className="bg-gradient-to-br from-teal-50 to-emerald-100/50 rounded-2xl p-6 flex items-center gap-5">
                                <img
                                    src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/v1/your-results-image"
                                    alt="Proven Results Analytics"
                                    className="w-24 h-24 object-contain drop-shadow-lg flex-shrink-0"
                                    loading="lazy"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">Proven Results</h3>
                                    <p className="text-sm text-gray-600 mb-2">85% automation, 60% cost reduction.</p>
                                    <div className="text-xl font-bold text-teal-500">90 Day ROI</div>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* Compact CTA */}
                    <div className="mt-12 text-center">
                        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-5">
                            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-medium py-3 px-8 rounded-lg hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
                                Start Free Trial <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-gray-700 font-medium py-3 px-8 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                                Book Demo
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" /> 14-day free trial
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" /> No credit card
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle className="h-4 w-4 text-green-500" /> Cancel anytime
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
