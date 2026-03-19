"use client"
import AnimatedStats from "@/components/landing/AnimatedStats";
import { Lead } from "@/components/lead";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Award, BarChart3, Calendar, CheckCircle, Clock, Globe, Headphones, LayoutDashboard, MessageSquare, Mic, MicOff, Phone, PhoneCall, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// Services data for attractive-style scroll showcase
const services = [
    {
        title: "Doctor Appointments",
        subtitle: "24/7 AI-Powered Medical Scheduling",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_bgremoval:rgb:ffffff/doctor_appointment_i73m9a",
        desc: "Never miss a patient again. Our AI voice agent handles appointment booking, rescheduling, and confirmations around the clock—with perfect accuracy and a warm, human touch.",
        color: "from-orange-500 to-violet-500",
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
        color: "from-orange-500 to-violet-500",
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
        color: "from-orange-500 to-violet-500",
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
        color: "from-violet-500 to-orange-600",
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
        color: "from-purple-500 to-orange-500",
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
    const [counts, setCounts] = useState([0, 0, 0])

    // Vapi voice agent state
    const vapiRef = useRef<any>(null)
    const [isCallActive, setIsCallActive] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [callStatus, setCallStatus] = useState('')
    const [vapiLoaded, setVapiLoaded] = useState(false)

    // Ref for attractive scroll-story section
    const storySectionRef = useRef<HTMLDivElement>(null)
    
    // Ref for journey flowchart section
    const flowchartRef = useRef<HTMLDivElement>(null)

    // Track active service for audio
    const [activeService, setActiveService] = useState(0)

    // Fixed: Single mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false)

    // Mount effect - only run on client
    useEffect(() => {
        setMounted(true)
    }, [])

    // Initialize Vapi voice agent
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
                    setCallStatus('Listening...')
                })

                vapiInstance.on('call-end', () => {
                    setIsCallActive(false)
                    setIsSpeaking(false)
                    setCallStatus('')
                })

                vapiInstance.on('speech-start', () => {
                    setIsSpeaking(true)
                    setCallStatus('Assistant speaking...')
                })

                vapiInstance.on('speech-end', () => {
                    setIsSpeaking(false)
                    setCallStatus('Listening...')
                })

                vapiInstance.on('error', (error: any) => {
                    console.error('VAPI Error:', error)
                    setCallStatus('')
                    setIsCallActive(false)
                })
            } catch (error) {
                console.error('Failed to initialize Vapi:', error)
            }
        }

        initVapi()

        return () => {
            if (vapiRef.current) {
                try { vapiRef.current.stop() } catch (e) { console.error('Error stopping Vapi:', e) }
            }
        }
    }, [])

    const toggleCall = async () => {
        if (!vapiRef.current || !vapiLoaded) {
            setCallStatus('Initializing...')
            return
        }

        if (isCallActive) {
            try {
                vapiRef.current.stop()
            } catch (error) {
                console.error('Error stopping call:', error)
            }
        } else {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true })
                setCallStatus('Connecting...')
                await vapiRef.current.start('9ca19724-1f6c-48d1-8c62-a6107d585592')
            } catch (error) {
                console.error('Error starting call:', error)
                if (error instanceof DOMException && error.name === 'NotAllowedError') {
                    alert('Please allow microphone access to use the voice assistant')
                }
                setCallStatus('')
            }
        }
    }

    // GSAP stacking cards scroll animation
    useEffect(() => {
        if (!mounted || !storySectionRef.current) return;

        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray<HTMLElement>('.stack-card');

            cards.forEach((card, i) => {
                gsap.set(card, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                });

                ScrollTrigger.create({
                    trigger: card,
                    start: 'top 85%',
                    end: 'top 40%',
                    scrub: 0.5,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        gsap.to(card, {
                            y: 60 * (1 - progress),
                            opacity: progress,
                            scale: 0.95 + 0.05 * progress,
                            duration: 0.1,
                            overwrite: 'auto',
                        });
                    },
                    onEnter: () => setActiveService(i),
                    onEnterBack: () => setActiveService(i),
                });
            });
        }, storySectionRef);

        return () => ctx.revert();
    }, [mounted]);

    // GSAP Journey Flowchart animation with ScrollTrigger
    useEffect(() => {
        if (!mounted || !flowchartRef.current) return;

        const ctx = gsap.context(() => {
            const header = flowchartRef.current!.querySelector('.journey-header') as HTMLElement;
            const line = flowchartRef.current!.querySelector('.journey-line') as HTMLElement;
            const steps = gsap.utils.toArray<HTMLElement>('.journey-step');

            // Initial states using GSAP
            if (header) {
                gsap.set(header, { opacity: 0, y: 30 });
            }
            if (line) {
                gsap.set(line, { scaleX: 0, transformOrigin: 'left center' });
            }
            gsap.set(steps, { opacity: 0, y: 40 });

            // ScrollTrigger animation
            ScrollTrigger.create({
                trigger: flowchartRef.current,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    // Animate header first
                    if (header) {
                        gsap.to(header, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            ease: 'power2.out'
                        });
                    }

                    // Animate the connecting line
                    if (line) {
                        gsap.to(line, {
                            scaleX: 1,
                            duration: 1,
                            delay: 0.3,
                            ease: 'power2.inOut'
                        });
                    }

                    // Stagger animate the steps
                    gsap.to(steps, {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        stagger: 0.15,
                        delay: 0.5,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        }, flowchartRef);

        return () => ctx.revert();
    }, [mounted]);

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
                0%, 100% { box-shadow: 0 0 10px #fb923c, 0 0 20px #fb923c; }
                50% { box-shadow: 0 0 20px #fb923c, 0 0 40px #fb923c, 0 0 60px #fb923c; }
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
            .walking-bot-antenna-glow { animation: antenna-glow-bot 1s ease-in-out infinite; box-shadow: 0 0 10px #fb923c, 0 0 20px #fb923c; }
            .walking-bot-eyeball { box-shadow: 0 0 15px #fb923c, inset 0 2px 4px rgba(255,255,255,0.5); }
            .walking-bot-chest { box-shadow: 0 0 20px #fb923c, 0 0 40px #fb923c; }

            /* Caller Card Animation */
            @keyframes caller-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-14px); }
            }
            @keyframes caller-ring {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.15); opacity: 0.4; }
            }
            @keyframes voice-bar {
              0%, 100% { height: 8px; }
              50% { height: 24px; }
            }
            @keyframes speech-bubble-pop {
              0% { transform: scale(0.8) translateY(5px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes arrow-draw {
              0% { stroke-dashoffset: 400; opacity: 0; }
              10% { opacity: 1; }
              100% { stroke-dashoffset: 0; opacity: 1; }
            }
            @keyframes arrow-head-fade {
              0%, 70% { opacity: 0; }
              100% { opacity: 1; }
            }
            .animate-caller-float {
              animation: caller-float 4s ease-in-out infinite;
            }
            /* Screenshot carousel animation - 3 images, 4s each = 12s total */
            @keyframes screenshot-cycle {
              0%, 2% { opacity: 0; transform: translateY(20px) scale(0.95); }
              5%, 28% { opacity: 1; transform: translateY(0) scale(1); }
              33%, 100% { opacity: 0; transform: translateY(-20px) scale(0.95); }
            }
            .caller-img-wrapper {
              transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease;
            }
            .caller-img-wrapper:hover {
              transform: scale(1.05) translateY(-6px);
              filter: drop-shadow(0 20px 40px rgba(99, 102, 241, 0.2));
            }
            .caller-img-wrapper:hover .caller-speech-bubble {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
            .caller-speech-bubble {
              opacity: 0;
              transform: scale(0.85) translateY(8px);
              transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s;
            }

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

            /* Wavy Sound Effect Animations */
            @keyframes sound-wave-bar {
              0%, 100% { height: 20%; }
              50% { height: 80%; }
            }
            @keyframes sound-wave-float {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes wave-path {
              0% { d: path('M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 C1150,120 1350,40 1500,80 L1500,200 L0,200 Z'); }
              50% { d: path('M0,80 C150,40 350,120 500,80 C650,40 850,120 1000,80 C1150,40 1350,120 1500,80 L1500,200 L0,200 Z'); }
              100% { d: path('M0,80 C150,120 350,40 500,80 C650,120 850,40 1000,80 C1150,120 1350,40 1500,80 L1500,200 L0,200 Z'); }
            }
            @keyframes wave-drift {
              0% { transform: translateX(0) scaleY(1); }
              25% { transform: translateX(-2%) scaleY(1.05); }
              50% { transform: translateX(-4%) scaleY(1); }
              75% { transform: translateX(-2%) scaleY(0.95); }
              100% { transform: translateX(0) scaleY(1); }
            }
            @keyframes sound-ring {
              0% { transform: scale(0.8); opacity: 0.6; }
              100% { transform: scale(2.5); opacity: 0; }
            }

            /* Voice Mic Button Animations */
            @keyframes mic-pulse {
              0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
              70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
              100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
            }
            @keyframes mic-active-pulse {
              0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
              70% { box-shadow: 0 0 0 25px rgba(239, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            @keyframes mic-ring-expand {
              0% { transform: scale(1); opacity: 0.6; }
              100% { transform: scale(2); opacity: 0; }
            }
            .animate-mic-pulse {
              animation: mic-pulse 2s ease-out infinite;
            }
            .animate-mic-active {
              animation: mic-active-pulse 1s ease-out infinite;
            }

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

            <section className="pt-8 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]" role="region" aria-labelledby="hero-heading">

                {/* Animated Background Elements */}
                {mounted && (
                    <>
                        {/* Floating Orbs */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/15 rounded-full blur-3xl animate-float"></div>
                            <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-300/8 rounded-full blur-3xl animate-pulse-slow"></div>
                        </div>
                        
                        {/* Animated Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.08]" style={{
                            backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }}></div>
                        
                        {/* Floating Particles */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-2 h-2 bg-orange-400/20 rounded-full animate-float"
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
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/15 to-transparent animate-pulse-slow"></div>
                        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/10 to-transparent animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

                        {/* Wavy Sound Effect - Bottom Waves */}
                        <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden pointer-events-none z-10 opacity-30">
                            <svg className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 1500 200" preserveAspectRatio="none" style={{ animation: 'wave-drift 8s ease-in-out infinite' }}>
                                <path d="M0,100 C150,140 350,60 500,100 C650,140 850,60 1000,100 C1150,140 1350,60 1500,100 L1500,200 L0,200 Z" fill="url(#waveGrad1)" />
                                <defs>
                                    <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.15" />
                                        <stop offset="50%" stopColor="rgb(37,99,235)" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0.15" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 1500 200" preserveAspectRatio="none" style={{ animation: 'wave-drift 6s ease-in-out infinite reverse', animationDelay: '1s' }}>
                                <path d="M0,120 C200,160 400,80 600,120 C800,160 1000,80 1200,120 C1400,160 1500,100 1500,120 L1500,200 L0,200 Z" fill="url(#waveGrad2)" />
                                <defs>
                                    <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgb(96,165,250)" stopOpacity="0.1" />
                                        <stop offset="50%" stopColor="rgb(59,130,246)" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="rgb(96,165,250)" stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <svg className="absolute bottom-0 w-[200%] h-full" viewBox="0 0 1500 200" preserveAspectRatio="none" style={{ animation: 'wave-drift 10s ease-in-out infinite', animationDelay: '2s' }}>
                                <path d="M0,140 C100,170 300,110 500,140 C700,170 900,110 1100,140 C1300,170 1500,130 1500,140 L1500,200 L0,200 Z" fill="url(#waveGrad3)" />
                                <defs>
                                    <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgb(147,197,253)" stopOpacity="0.08" />
                                        <stop offset="50%" stopColor="rgb(96,165,250)" stopOpacity="0.18" />
                                        <stop offset="100%" stopColor="rgb(147,197,253)" stopOpacity="0.08" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Sound Wave Equalizer Bars - Left Side */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-end gap-1 h-32 opacity-20 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={`left-bar-${i}`}
                                    className="w-1 bg-gradient-to-t from-orange-400 to-violet-300 rounded-full"
                                    style={{
                                        animation: `sound-wave-bar ${0.8 + i * 0.15}s ease-in-out infinite`,
                                        animationDelay: `${i * 0.12}s`,
                                        height: '40%'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Sound Wave Equalizer Bars - Right Side */}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-end gap-1 h-32 opacity-20 pointer-events-none">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={`right-bar-${i}`}
                                    className="w-1 bg-gradient-to-t from-orange-400 to-violet-300 rounded-full"
                                    style={{
                                        animation: `sound-wave-bar ${0.9 + i * 0.12}s ease-in-out infinite`,
                                        animationDelay: `${i * 0.15 + 0.3}s`,
                                        height: '40%'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Sound Rings - Center Background */}
                        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={`ring-${i}`}
                                    className="absolute inset-0 border border-orange-300/15 rounded-full"
                                    style={{
                                        width: `${120 + i * 80}px`,
                                        height: `${120 + i * 80}px`,
                                        marginLeft: `-${(120 + i * 80) / 2}px`,
                                        marginTop: `-${(120 + i * 80) / 2}px`,
                                        animation: `sound-ring ${2 + i * 0.5}s ease-out infinite`,
                                        animationDelay: `${i * 0.7}s`
                                    }}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="container mx-auto relative z-30 max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Customer Calling - Left Side (lg+ only) */}
                    <div className="hidden lg:block absolute left-0 top-1/3 -translate-y-1/2 z-40 animate-caller-float" style={{ left: '-30px' }}>
                        <div className="caller-img-wrapper relative cursor-default">
                            {/* Customer Image */}
                            <Image
                                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1772962028/Gemini_Generated_Image_5ehrm05ehrm05ehr-removebg-preview_1_tltgob.png"
                                alt="Customer making a phone call"
                                width={280}
                                height={350}
                                className="w-56 xl:w-64 h-auto object-contain drop-shadow-lg"
                                priority
                            />

                            {/* Speech Bubble - appears on hover */}
                            <div className="caller-speech-bubble absolute -top-4 right-0 translate-x-8">
                                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-3 max-w-[200px] relative">
                                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                                        Hey, can I get an appointment with Dr. Mishra?
                                    </p>
                                    {/* Bubble tail */}
                                    <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45" />
                                </div>
                            </div>

                            {/* Calling indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-full shadow-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                </span>
                                <span className="text-[10px] font-semibold tracking-wide uppercase">Calling</span>
                            </div>
                        </div>
                    </div>

                    {/* Curved Arrow from Customer to Mic */}
                    <div className="hidden lg:block absolute z-35 pointer-events-none" style={{ left: '12%', top: '35%', width: '38%', height: '200px' }}>
                        <svg width="100%" height="100%" viewBox="0 0 500 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Gentle curve from left (image) to right (mic) */}
                            <path
                                d="M0,100 C120,100 200,30 350,20 Q430,14 480,40"
                                stroke="url(#arrowGradient)"
                                strokeWidth="2"
                                strokeDasharray="600"
                                fill="none"
                                strokeLinecap="round"
                                style={{ animation: 'arrow-draw 2.5s ease-out forwards' }}
                            />
                            {/* Arrowhead */}
                            <polygon
                                points="473,32 490,42 475,50"
                                fill="#818cf8"
                                style={{ animation: 'arrow-head-fade 2.5s ease-out forwards' }}
                            />
                            <defs>
                                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#cbd5e1" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Curved Arrow from Mic to Screenshots (Right) */}
                    <div className="hidden lg:block absolute z-35 pointer-events-none" style={{ right: '12%', top: '28%', width: '38%', height: '200px' }}>
                        <svg width="100%" height="100%" viewBox="0 0 500 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20,80 Q100,120 200,150 C300,170 400,150 490,90"
                                stroke="url(#arrowGradientRight)"
                                strokeWidth="2"
                                strokeDasharray="600"
                                fill="none"
                                strokeLinecap="round"
                                style={{ animation: 'arrow-draw 2.5s ease-out 0.5s forwards', strokeDashoffset: 600 }}
                            />
                            <polygon
                                points="483,92 498,106 480,108"
                                fill="#818cf8"
                                style={{ animation: 'arrow-head-fade 2.5s ease-out 0.5s forwards' }}
                            />
                            <defs>
                                <linearGradient id="arrowGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#cbd5e1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Dashboard Screenshots - Right Side (lg+ only) */}
                    <div className="hidden lg:block absolute right-0 top-1/3 -translate-y-1/2 z-40" style={{ right: '-40px' }}>
                        <div className="relative" style={{ width: '300px' }}>
                            {[
                                { src: 'https://res.cloudinary.com/dew9qfpbl/image/upload/v1773106306/Gemini_Generated_Image_u3kh3vu3kh3vu3kh_ee7nyy.png', alt: 'AI Dashboard Analytics', landscape: true },
                                { src: 'https://res.cloudinary.com/dew9qfpbl/image/upload/v1772967767/Screenshot_2025-11-29_202610_luufqi.png', alt: 'Call Management Dashboard', landscape: true },
                                { src: 'https://res.cloudinary.com/dew9qfpbl/image/upload/v1772967676/Screenshot_2025-11-30_131935_cg2dbq.png', alt: 'Voice Agent Performance', landscape: true },
                            ].map((img, i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl overflow-hidden shadow-2xl border border-slate-200/60 ${i > 0 ? 'absolute top-0 left-0' : 'relative'}`}
                                    style={{
                                        animation: `screenshot-cycle 12s ease-in-out infinite`,
                                        animationDelay: `${i * 4}s`,
                                        opacity: i === 0 ? undefined : 0,
                                    }}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        width={300}
                                        height={0}
                                        className="w-[300px] h-auto rounded-xl"
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Hero - Content Only */}
                    <div className="flex flex-col items-center min-h-[70vh] sm:min-h-[65vh] py-16 sm:py-20 lg:py-28 justify-center">
                        
                        {/* Content */}
                        <div className="text-center space-y-8 max-w-4xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 glass-card bg-white/70 border border-orange-100/40 px-4 py-2 rounded-full animate-fade-in-up-1 shadow-sm">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">AI Voice Agents — Now Generally Available</span>
                            </div>

                            {/* Main Headline */}
                            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-slate-900 leading-[1.1] tracking-tight animate-fade-in-up-2">
                                Your AI Voice Agent<br />
                                <span className="bg-gradient-to-r from-orange-600 via-orange-600 to-violet-600 bg-clip-text text-transparent">That Never Sleeps</span>
                            </h1>

                            {/* Tagline */}
                            <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto animate-fade-in-up-3">
                                Your receptionist sleeps, gets sick, takes breaks. <span className="text-slate-900 font-medium">We never do.</span>
                            </p>

                            {/* Voice Mic Button */}
                            <div className="flex flex-col items-center gap-3 animate-fade-in-up-3">
                                <button
                                    onClick={toggleCall}
                                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                        isCallActive
                                            ? 'bg-gradient-to-br from-red-500 to-red-600 animate-mic-active hover:from-red-600 hover:to-red-700 scale-110'
                                            : 'bg-gradient-to-br from-orange-500 to-violet-500 animate-mic-pulse hover:from-orange-600 hover:to-violet-600 hover:scale-110'
                                    } shadow-xl shadow-orange-500/20`}
                                    aria-label={isCallActive ? 'End voice call' : 'Start voice call'}
                                >
                                    {/* Animated rings when active */}
                                    {isCallActive && (
                                        <>
                                            <span className="absolute inset-0 rounded-full border-2 border-red-400" style={{ animation: 'mic-ring-expand 1.5s ease-out infinite' }} />
                                            <span className="absolute inset-0 rounded-full border-2 border-red-400" style={{ animation: 'mic-ring-expand 1.5s ease-out infinite 0.5s' }} />
                                            <span className="absolute inset-0 rounded-full border-2 border-red-400" style={{ animation: 'mic-ring-expand 1.5s ease-out infinite 1s' }} />
                                        </>
                                    )}
                                    {isCallActive ? (
                                        <Phone className="h-8 w-8 sm:h-10 sm:w-10 text-white rotate-[135deg]" />
                                    ) : (
                                        <Mic className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                                    )}
                                </button>
                                <p className="text-sm font-medium text-gray-500">
                                    {isCallActive
                                        ? <span className="text-red-500 flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />{callStatus || 'Call active'} — tap to end</span>
                                        : isSpeaking
                                            ? <span className="text-orange-500">Assistant is speaking...</span>
                                            : 'Tap to talk to our AI agent'
                                    }
                                </p>
                            </div>

                            {/* Description */}
                            <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto animate-fade-in-up-3">
                                Deploy enterprise-grade <span className="text-slate-800 font-medium">AI voice agents</span> that handle unlimited concurrent calls, respond instantly in 50+ languages, and deliver real-time analytics — all without writing a single line of code.
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up-3 pt-2">
                                <Link
                                    href="/contact#contact-form"
                                    className="group px-8 py-3.5 bg-gradient-to-r from-orange-600 to-violet-600 text-white font-medium rounded-xl hover:from-orange-700 hover:to-violet-700 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 text-sm btn-glow"
                                >
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link
                                    href="/services"
                                    className="px-8 py-3.5 text-slate-600 font-medium rounded-xl border border-slate-200/60 glass-subtle hover:border-orange-200 hover:text-orange-600 transition-all duration-300 text-sm"
                                >
                                    View Platform
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap gap-6 justify-center items-center animate-fade-in-up-3 pt-4">
                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    No credit card required
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    5-minute setup
                                </span>
                                <span className="flex items-center gap-1.5 text-sm text-slate-400">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                    50+ languages
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Feature Cards Below Hero */}
                    <div className="mt-16 sm:mt-20 lg:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {[
                            { icon: PhoneCall, title: "Smart Call Handling", desc: "Handle unlimited concurrent calls with natural, human-like conversations" },
                            { icon: BarChart3, title: "Real-Time Analytics", desc: "Track every interaction with actionable insights and live dashboards" },
                            { icon: Clock, title: "24/7 Availability", desc: "Always-on coverage — never miss a call, day or night" },
                            { icon: Globe, title: "50+ Languages", desc: "Engage customers globally in their preferred language" }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group glass-card rounded-xl p-6 hover:border-orange-200/40 hover:shadow-lg transition-all duration-400"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-violet-500 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md shadow-orange-500/15">
                                    <feature.icon className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* Numbers That Speak for Themselves */}
            <AnimatedStats />

            {/* Section Header - Fixed above the scrolling content */}
            <section className="py-8 sm:py-08 lg:py-16 bg-gradient-to-b from-white to-[#fafbff]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center space-x-2 glass-card bg-orange-50/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-orange-200/40 text-xs sm:text-sm text-orange-600 font-semibold mb-4 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4" />
                        <span>🎯 Our AI Voice Services</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
                        Choose Your AI Voice Solution
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed px-4">
                        Select from our comprehensive suite of AI voice services. Each solution is ready to deploy on our platform and can be customized for your business needs.
                    </p>
                </div>
            </section>

            {/* AI Voice Use Cases Section - Stacking Cards */}
            <section ref={storySectionRef} className="bg-gradient-to-b from-[#fafbff] to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                    <div className="space-y-8">
                        {services.map((s, i) => (
                            <div
                                key={i}
                                className="stack-card glass-strong rounded-2xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-400 overflow-hidden"
                                style={{ position: 'sticky', top: `${80 + i * 24}px`, zIndex: i + 1 }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

                                    {/* LEFT: Image */}
                                    <div className="lg:col-span-2 relative bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6 sm:p-8 min-h-[240px] sm:min-h-[300px]">
                                        <img
                                            src={s.img}
                                            alt={s.title}
                                            className="h-[200px] sm:h-[260px] object-contain drop-shadow-xl"
                                        />
                                        {/* Stat badge overlay */}
                                        <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${s.color} text-white text-xs font-bold shadow-md`}>
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            <span>{s.stat} {s.statLabel}</span>
                                        </div>
                                    </div>

                                    {/* RIGHT: Content */}
                                    <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
                                        <h3 className={`text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                                            {s.title}
                                        </h3>
                                        <p className="text-base text-gray-500 mb-2 font-medium">{s.subtitle}</p>
                                        <p className="text-sm text-gray-600 mb-5 leading-relaxed max-w-lg">
                                            {s.desc}
                                        </p>

                                        {/* Audio Player */}
                                        <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100 max-w-md">
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

                                        {/* Feature Tags */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {s.features.map((f, fi) => (
                                                <div key={fi} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                                    <div className={`w-8 h-8 rounded-md bg-gradient-to-r ${s.color} flex items-center justify-center flex-shrink-0`}>
                                                        {f.icon === 'Calendar' && <Calendar className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Clock' && <Clock className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Users' && <Users className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Shield' && <Shield className="h-4 w-4 text-white" />}
                                                        {f.icon === 'PhoneCall' && <PhoneCall className="h-4 w-4 text-white" />}
                                                        {f.icon === 'MessageSquare' && <MessageSquare className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Globe' && <Globe className="h-4 w-4 text-white" />}
                                                        {f.icon === 'TrendingUp' && <TrendingUp className="h-4 w-4 text-white" />}
                                                        {f.icon === 'BarChart3' && <BarChart3 className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Zap' && <Zap className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Headphones' && <Headphones className="h-4 w-4 text-white" />}
                                                        {f.icon === 'CheckCircle' && <CheckCircle className="h-4 w-4 text-white" />}
                                                        {f.icon === 'Award' && <Award className="h-4 w-4 text-white" />}
                                                        {f.icon === 'LayoutDashboard' && <LayoutDashboard className="h-4 w-4 text-white" />}
                                                    </div>
                                                    <p className="text-xs text-gray-700 font-medium leading-tight">{f.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Form */}
            <Lead />

            {/* Why Choose DigitalBot - Bento Grid Style */}
            <section className="py-8 px-4 bg-gradient-to-b from-white via-[#fafbff] to-white overflow-hidden">
                <div className="container mx-auto max-w-6xl">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                            The DigitalBot Advantage
                        </h2>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            Enterprise-grade AI voice solutions that scale with your business
                        </p>
                    </div>

                    {/* Grid Layout - All cards equal size */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Feature 1 - Instant Setup */}
                        <div className="bg-gradient-to-br from-orange-500 to-violet-600 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl hover:shadow-orange-500/15 transition-all duration-400 min-h-[280px]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                            <div>
                                <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur-sm">
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
                            <div className="flex gap-8 mt-4">
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
                        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl min-h-[280px] border border-orange-100/30">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/8 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="h-5 w-5 text-orange-500" />
                                    <h3 className="text-lg font-bold text-slate-900">Enterprise Security</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">AES-256 encryption, SOC 2 certified, GDPR & HIPAA compliant for maximum data protection.</p>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-auto">
                                <span className="px-3 py-1.5 bg-orange-50/60 text-orange-600 text-xs font-medium rounded border border-orange-200/40">SOC 2</span>
                                <span className="px-3 py-1.5 bg-orange-50/60 text-orange-600 text-xs font-medium rounded border border-orange-200/40">GDPR</span>
                                <span className="px-3 py-1.5 bg-orange-50/60 text-orange-600 text-xs font-medium rounded border border-orange-200/40">HIPAA</span>
                            </div>
                        </div>

                        {/* Feature 3 - 24/7 Operations */}
                        <div className="bg-gradient-to-br from-violet-500 to-orange-600 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl hover:shadow-violet-500/15 transition-all duration-400 min-h-[280px]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-bold text-white">24/7 Operations</h3>
                                </div>
                                <p className="text-sm text-purple-100 mb-4">
                                    Uninterrupted service with industry-leading uptime. Your AI assistants never sleep, ensuring constant availability for your customers.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <div className="text-4xl font-bold text-white">99.9%</div>
                                <div className="text-purple-200 text-sm">Uptime SLA Guarantee</div>
                            </div>
                        </div>

                        {/* Feature 4 - Auto-Scaling */}
                        <div className="bg-gradient-to-br from-orange-500 to-violet-500 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl hover:shadow-orange-500/15 transition-all duration-400 min-h-[280px]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="h-5 w-5 text-white" />
                                    <h3 className="text-lg font-bold text-white">Auto-Scaling</h3>
                                </div>
                                <p className="text-sm text-orange-100 mb-4">
                                    Handle spikes effortlessly with intelligent auto-scaling. From 10 to 100,000+ simultaneous conversations without performance degradation.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <div className="text-4xl font-bold text-white">100K+</div>
                                <div className="text-orange-100 text-sm">Concurrent Conversations</div>
                            </div>
                        </div>

                        {/* Feature 5 - Omnichannel */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-orange-100/30 group hover:shadow-lg transition-all duration-400 min-h-[280px]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <MessageSquare className="h-5 w-5 text-orange-500" />
                                    <h3 className="text-lg font-bold text-slate-800">Omnichannel Support</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    Seamless integration across phone, web, mobile, SMS, WhatsApp, and social media platforms.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <div className="text-4xl font-bold text-orange-500">6+</div>
                                <div className="text-slate-500 text-sm">Integrated Channels</div>
                            </div>
                        </div>

                        {/* Feature 6 - Proven Results */}
                        <div className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-emerald-100/30 group hover:shadow-lg transition-all duration-400 min-h-[280px]">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    <h3 className="text-lg font-bold text-slate-800">Proven Results</h3>
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    Industry-leading ROI with measurable impact. Most clients see positive returns within the first quarter of deployment.
                                </p>
                            </div>
                            <div className="mt-auto">
                                <div className="text-4xl font-bold text-emerald-500">90 Days</div>
                                <div className="text-slate-500 text-sm">Average ROI Payback</div>
                            </div>
                        </div>

                    </div>

                    {/* CTA Section */}
                    <div className="mt-8 glass-strong rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between border border-orange-100/30 gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">Ready to transform your business?</h3>
                            <p className="text-sm text-slate-500">14-day free trial • No credit card • Cancel anytime</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/contact#contact-form" className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-violet-500 text-white font-medium py-3 px-6 rounded-xl hover:from-orange-600 hover:to-violet-600 transition-all duration-300 shadow-lg shadow-orange-500/20 btn-glow">
                                Start Free <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/contact#contact-form" className="inline-flex items-center gap-2 text-slate-600 font-medium py-3 px-6 rounded-xl border border-slate-200/60 glass-subtle hover:border-orange-200 hover:text-orange-600 transition-all duration-300">
                                Book Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
