"use client"
import { ArrowRight, Award, Calendar, CheckCircle, Clock, Headphones, MessageSquare, Mic, Shield, Square, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from 'react';

interface LottieAnimation {
    destroy: () => void;
    setSpeed: (speed: number) => void;
    play: () => void;
    pause: () => void;
    stop: () => void;
}

interface LottiePlayer {
    loadAnimation: (params: {
        container: HTMLElement | null;
        renderer: 'svg' | 'canvas' | 'html';
        loop: boolean;
        autoplay: boolean;
        path: string;
    }) => LottieAnimation;
}

declare global {
    interface Window {
        lottie?: LottiePlayer;
    }
}

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
    const lottieAnimationRef = useRef<LottieAnimation | null>(null)
    const [vapiLoaded, setVapiLoaded] = useState(false)
    const soundBarHeightsRef = useRef<number[]>([])
    
    // Scroll animation for flowchart
    const [flowchartVisible, setFlowchartVisible] = useState(false)
    const flowchartRef = useRef<HTMLDivElement>(null)

    // Fixed: Single mounted state to prevent hydration mismatch
    const [mounted, setMounted] = useState(false)

    // Mount effect - only run on client
    useEffect(() => {
        setMounted(true)
        // Initialize stable random heights for sound bars
        soundBarHeightsRef.current = Array.from({ length: 12 }, () => Math.random())
    }, [])

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
                    setTranscript("Listening for your request...")
                    setCallStatus('Call active - Listening')
                })

                vapiInstance.on('call-end', () => {
                    setIsCallActive(false)
                    setIsSpeaking(false)
                    setTranscript("Hello! I'm your AI assistant. Click the microphone to start a conversation.")
                    setCallStatus('Call ended')
                })

                vapiInstance.on('speech-start', () => {
                    setIsSpeaking(true)
                    setCallStatus('Assistant speaking...')
                })

                vapiInstance.on('speech-end', () => {
                    setIsSpeaking(false)
                    setCallStatus('Call active - Listening')
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
                await vapiRef.current.start('9ca19724-1f6c-48d1-8c62-a6107d585592')
            } catch (error) {
                console.error('Error starting call:', error)
                setCallStatus(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
        }
    }

    useEffect(() => {
        if (typeof window === 'undefined') return

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        script.async = true;

        const handleLoad = () => {
            try {
                if (window.lottie && document.getElementById('lottie-animation')) {
                    lottieAnimationRef.current = window.lottie.loadAnimation({
                        container: document.getElementById('lottie-animation'),
                        renderer: 'svg',
                        loop: true,
                        autoplay: true,
                        path: '/animations/circle-waves.json'
                    });
                }
            } catch (error) {
                console.error('Error loading lottie animation:', error);
            }
        };

        script.onload = handleLoad;
        script.onerror = (error) => {
            console.error('Failed to load lottie script:', error);
        };

        document.body.appendChild(script);

        return () => {
            if (lottieAnimationRef.current) {
                try {
                    lottieAnimationRef.current.destroy();
                } catch (error) {
                    console.error('Error destroying lottie animation:', error);
                }
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    useEffect(() => {
        if (lottieAnimationRef.current) {
            try {
                if (isSpeaking) {
                    lottieAnimationRef.current.setSpeed(1.5);
                } else {
                    lottieAnimationRef.current.setSpeed(1.0);
                }
            } catch (error) {
                console.error('Error setting lottie speed:', error);
            }
        }
    }, [isSpeaking]);

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
                                src="https://www.youtube.com/embed/-68LXmyR6GI?autoplay=1"
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

            <section className="pt-10 pb-4 px-4 sm:px-8 lg:px-26 relative overflow-hidden min-h-screen bg-white">

                {mounted && (
                  <>
                    <div className="absolute inset-0 overflow-hidden pointer-events-none responsive-opacity">
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-orange-500/15 to-transparent animate-pulse-slow responsive-animate drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]"></div>
                        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-orange-600/12 to-transparent animate-pulse-slow responsive-animate drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]" style={{ animationDelay: '1s' }}></div>
                    </div>
                  </>
                )}

                <div className="container mx-auto relative z-30 max-w-6xl opacity-100">

{/* Centered Column Layout - Top to Bottom */}
<div className="flex flex-col items-center justify-center gap-10 animate-fade-in-up-2 pt-1/4">

    {/* Voice Assistant Section - Top */}
    <div className="w-full flex flex-col items-center justify-center">
    <div className="relative w-full flex items-center justify-center mb-2 sm:mb-2" style={{height: '60vw', maxHeight: '500px', minHeight: '300px', overflow: 'hidden'}}>
            <div className="absolute inset-0 flex items-center justify-center" style={{clipPath: 'inset(1)', maxWidth: '800px', maxHeight: '900px', margin: '0 auto'}}>
            <div className="relative flex items-center justify-center w-[98vw] max-w-[480px] h-[65vw] max-h-[400px] sm:w-[700px] sm:h-[480px] lg:w-[850px] lg:h-[620px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={` rounded-full transition-all duration-500 ${
                            isSpeaking
                                ? 'bg-orange-500/40 blur-3xl animate-pulse shadow-[0_0_200px_rgba(249,115,22,0.6)]'
                                : 'bg-orange-500/25 blur-3xl shadow-[0_0_80px_rgba(249,115,22,0.4)]'
                            }`}></div>
                    </div>

                    <div className={`relative transition-all duration-500 ${isSpeaking ? 'scale-110' : 'scale-105'}`}>
                        <div
                            id="lottie-animation"
                            className="w-[80vw] h-[80vw] max-w-[420px] max-h-[420px] sm:w-[700px] sm:h-[480px] lg:w-[850px] lg:h-[620px]"
                            style={{
                                filter: isSpeaking
                                    ? 'saturate(1.3) brightness(1.1)'
                                    : 'saturate(1.1) brightness(1.0)'
                            }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button
                                onClick={toggleCall}
                                disabled={callStatus.startsWith('Requesting') || callStatus.startsWith('Starting') || callStatus.startsWith('Stopping')}
                                className={`relative z-30 flex flex-col items-center justify-center
                                    w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-all duration-300
                                    backdrop-blur-md border-2
                                    ${isCallActive
                                        ? 'bg-gradient-to-br from-red-500/70 via-red-600/70 to-red-700/70 border-red-400/50 hover:border-red-300 text-white shadow-2xl shadow-red-500/60 animate-pulse-slow hover:shadow-red-400/80'
                                        : 'bg-gradient-to-br from-orange-500/70 via-orange-600/70 to-orange-700/70 border-orange-400/50 hover:border-orange-300 text-white shadow-2xl shadow-orange-500/60 hover:shadow-orange-400/80 hover:scale-110'
                                    }
                                    before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-tr before:from-white/20 before:to-transparent before:opacity-50
                                    `}
                                aria-label={isCallActive ? "Stop conversation with AI assistant" : "Start conversation with AI assistant in any Language"}
                            >
                                {/* Glossy overlay effect */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-white/10 to-transparent pointer-events-none"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-bl from-transparent via-transparent to-black/20 pointer-events-none"></div>
                                {/* Rotating ring effect */}
                                {!isCallActive && mounted && (
                                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin-slow"></div>
                                )}
                                <div className="mb-1 relative z-10">
                                    <Mic className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-lg" />
                                </div>
                                <div className="flex items-end justify-center gap-0.5 h-4 sm:h-10 relative z-10">
                                    {[...Array(12)].map((_, i) => {
                                        const centerIndex = 5.5;
                                        const maxHeight = 12 - (Math.abs(i - centerIndex) * 0.8);
                                        const minHeight = 2;
                                        const randomValue = soundBarHeightsRef.current[i] || 0.5;
                                        return (
                                            <div
                                                key={i}
                                                className={`w-0.5 sm:w-1 transition-all duration-300 rounded-full ${
                                                    isSpeaking
                                                        ? 'bg-gradient-to-t from-white via-orange-100 to-white shadow-lg shadow-orange-200/50'
                                                        : isCallActive
                                                            ? 'bg-gradient-to-t from-white/70 via-orange-100/70 to-white/70 shadow-md shadow-orange-200/30'
                                                            : 'bg-gradient-to-t from-white/40 via-orange-100/40 to-white/40'
                                                }`}
                                                style={{
                                                    height: isSpeaking
                                                        ? `${randomValue * (maxHeight - 4) + 4}px`
                                                        : isCallActive
                                                            ? `${minHeight + (maxHeight - minHeight) * 0.3}px`
                                                            : `${minHeight}px`,
                                                    animation: isSpeaking
                                                        ? `sound-bar-pulse 0.${4 + (i % 4)}s ease-in-out infinite`
                                                        : isCallActive
                                                            ? `sound-bar-pulse 0.${6 + (i % 3)}s ease-in-out infinite`
                                                            : 'none',
                                                    animationDelay: `${i * 0.05}s`
                                                }}
                                            ></div>
                                        );
                                    })}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


                            {/* Transcript Display */}
                            <div suppressHydrationWarning className={`w-full max-w-2xl p-6 rounded-2xl border transition-all duration-300 mb-2 ${isCallActive ? 'bg-white border-orange-500 shadow-lg shadow-orange-500/40' : 'bg-gray-100 border-gray-300'}`}>
                                <div suppressHydrationWarning className="text-xs font-semibold uppercase text-orange-600 mb-(-2)">{callStatus || "Ready to assist"}</div>

                                <p suppressHydrationWarning className="text-sm sm:text-base text-gray-900 font-medium transition-colors duration-500">{transcript}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-8 justify-center">
                                <button
                                    suppressHydrationWarning
                                    onClick={toggleCall}
                                    className={`px-6 py-3 text-white font-semibold shadow-xl transition-all duration-300 group ${isCallActive
                                        ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-400 hover:from-red-700 hover:to-red-500 shadow-red-400/50 transform hover:scale-105'
                                        : 'bg-gradient-to-r from-orange-600 via-orange-500 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-orange-500/60 hover:shadow-orange-600/70 transform hover:scale-105'
                                    } flex items-center`}
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                    }}
                                    aria-label={isCallActive ? "Stop conversation with AI assistant" : "Start conversation with AI assistant in any Language"}
                                >
                                    {isCallActive ? 'Stop Conversation' : 'Start Conversation'}
                                    {isCallActive ? (
                                        <Square className="ml-2 h-4 w-4" />
                                    ) : (
                                        <Mic className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="px-6 py-3 text-orange-600 bg-white border-2 border-orange-400/50 hover:bg-gray-50 hover:border-orange-400/70 shadow-lg shadow-orange-400/30 hover:shadow-orange-500/40 transition-transform hover:scale-105"
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                    }}
                                    aria-label="Watch demo video"
                                >
                                    Watch Demo
                                </button>
                            </div>

                            {/* H1 Heading */}
                            <div className="mt-12 text-center">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 bg-clip-text text-transparent drop-shadow-lg">
                                    AI Voice Agent | AI Voice Assistant
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Scroll-Animated Journey Flowchart */}
            <section ref={flowchartRef} className="py-20 px-4 bg-gradient-to-b from-white via-orange-50/20 to-white relative overflow-hidden">
                <div className="container mx-auto max-w-4xl relative z-10">
                    
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                            Your Journey to <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Effortless Communication</span>
                        </h2>
                        <p className="text-lg text-gray-600">See how easy it is to transform your business with AI voice automation</p>
                    </div>

                    {/* Vertical Flowchart */}
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 transform -translate-x-1/2 hidden md:block"></div>

                        {/* Step 1: The Problem */}
                        <div className={`relative mb-20 transition-all duration-700 ${flowchartVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '0ms' }}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/2 md:text-right">
                                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300">
                                        <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
                                            <span className="text-3xl">❌</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">The Challenge</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Missing customer calls, overwhelming support tickets, and high operational costs draining your resources
                                        </p>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex-shrink-0 shadow-lg relative z-20 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">1</span>
                                </div>
                                <div className="md:w-1/2"></div>
                            </div>
                        </div>

                        {/* Step 2: Our Solution */}
                        <div className={`relative mb-20 transition-all duration-700 ${flowchartVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '200ms' }}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/2"></div>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex-shrink-0 shadow-lg relative z-20 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">2</span>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300">
                                        <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
                                            <Zap className="h-8 w-8 text-orange-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Voice Assistant</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Our intelligent AI handles calls 24/7, understands natural language in any language, and responds instantly
                                        </p>
                                        <ul className="space-y-2">
                                            <li className="flex items-center text-sm text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                                                Human-like conversations
                                            </li>
                                            <li className="flex items-center text-sm text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                                                Multi-language support
                                            </li>
                                            <li className="flex items-center text-sm text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                                                No wait times, ever
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: How It Works */}
                        <div className={`relative mb-20 transition-all duration-700 ${flowchartVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '400ms' }}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/2 md:text-right">
                                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300">
                                        <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                                            <Users className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Simple 3-Step Process</h3>
                                        <div className="space-y-4 text-left">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Choose Your Use Case</p>
                                                    <p className="text-sm text-gray-600">Pick from appointments, support, sales, or custom</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Quick Setup</p>
                                                    <p className="text-sm text-gray-600">Connect in 5 minutes - no coding required</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Go Live</p>
                                                    <p className="text-sm text-gray-600">Start handling calls immediately</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex-shrink-0 shadow-lg relative z-20 flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">3</span>
                                </div>
                                <div className="md:w-1/2"></div>
                            </div>
                        </div>

                        {/* Step 4: The Results */}
                        <div className={`relative transition-all duration-700 ${flowchartVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`} style={{ transitionDelay: '600ms' }}>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="md:w-1/2"></div>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex-shrink-0 shadow-lg relative z-20 flex items-center justify-center">
                                    <span className="text-white font-bold text-2xl">✓</span>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-xl p-8 border-2 border-green-200 hover:border-green-400 transition-all duration-300">
                                        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                                            <TrendingUp className="h-8 w-8 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Transform Your Business</h3>
                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            Join thousands of businesses saving time and money while delighting customers
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">85%</div>
                                                <div className="text-xs text-gray-600">Cost Reduction</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">24/7</div>
                                                <div className="text-xs text-gray-600">Availability</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">100%</div>
                                                <div className="text-xs text-gray-600">Call Coverage</div>
                                            </div>
                                            <div className="text-center p-3 bg-white rounded-lg">
                                                <div className="text-2xl font-bold text-orange-600">&lt;2min</div>
                                                <div className="text-xs text-gray-600">Setup Time</div>
                                            </div>
                                        </div>
                                        <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                                            Get Started Now <ArrowRight className="inline-block ml-2 h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Voice Use Cases Section */}
            <section className="py-8 px-4 bg-white relative overflow-hidden">
                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center space-x-2 bg-orange-500/10 px-3 py-1.5 border border-orange-400/30 text-xs sm:text-sm text-orange-600 font-semibold mb-4 uppercase tracking-widest" style={{
                            clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                            boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)'
                        }}>
                            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>🎯 Our AI Voice Services</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-4 uppercase tracking-wider shimmer-text" style={{
                            textShadow: '0 0 20px rgba(249, 115, 22, 0.5)'
                        }}>
                            Choose Your AI Voice Solution
                        </h2>
                        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto">
                            Select from our comprehensive suite of AI voice services. Each solution is ready to deploy on our platform and can be customized for your business needs.
                        </p>
                    </div>

                    {/* Use Cases Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-12">
                        {/* Doctor Appointments */}
                        <div className="group relative bg-gradient-to-br from-orange-500/10 via-white/90 to-orange-600/10 border border-orange-400/30 overflow-hidden transition-all duration-500 hover:border-orange-300/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2" style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}>
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                    src="/images/image/doctorappointment.png"
                                    alt="AI Doctor Appointment Scheduling - Medical Healthcare Assistant"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-3 left-3">
                                    <div className="p-2 bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                    Doctor Appointments
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                                    24/7 AI scheduling for medical appointments. Handles patient inquiries, insurance verification, and appointment confirmations automatically.
                                </p>
                                <audio controls className="w-full mb-3 h-8" style={{ accentColor: '#f97316' }}>
                                    <source src="/audio/doctor-appointment-sample.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-widest">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>95% Booking Success</span>
                                </div>
                            </div>
                        </div>

                        {/* Virtual Receptionist */}
                        <div className="group relative bg-gradient-to-br from-orange-500/10 via-white/90 to-orange-600/10 border border-orange-400/30 overflow-hidden transition-all duration-500 hover:border-orange-300/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2" style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}>
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop&crop=center&auto=format&q=90"
                                    alt="AI Virtual Receptionist - Professional Business Assistant"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-3 left-3">
                                    <div className="p-2 bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg">
                                        <Users className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                    Virtual Receptionist
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                                    Professional AI receptionist that greets callers, routes calls, takes messages, and provides company information with human-like interaction.
                                </p>
                                <audio controls className="w-full mb-3 h-8" style={{ accentColor: '#f97316' }}>
                                    <source src="/audio/virtual-receptionist-sample.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-widest">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>100% Call Coverage</span>
                                </div>
                            </div>
                        </div>

                        {/* Lead Generation */}
                        <div className="group relative bg-gradient-to-br from-orange-500/10 via-white/90 to-orange-600/10 border border-orange-400/30 overflow-hidden transition-all duration-500 hover:border-orange-300/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2" style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}>
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center&auto=format&q=90"
                                    alt="AI Lead Generation Outbound Calls - Sales Automation"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-3 left-3">
                                    <div className="p-2 bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                    Lead Generation
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                                    Automated outbound calling for lead qualification, follow-ups, and appointment setting. Convert prospects into customers 24/7.
                                </p>
                                <audio controls className="w-full mb-3 h-8" style={{ accentColor: '#f97316' }}>
                                    <source src="/audio/lead-generation-sample.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-widest">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>3x More Leads</span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Care Voice Agent */}
                        <div className="group relative bg-gradient-to-br from-orange-500/10 via-white/90 to-orange-600/10 border border-orange-400/30 overflow-hidden transition-all duration-500 hover:border-orange-300/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2" style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}>
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1553775282-20af80779df7?w=600&h=400&fit=crop&crop=center&auto=format&q=90"
                                    alt="AI Customer Care Voice Agent - Support Assistance"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-3 left-3">
                                    <div className="p-2 bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg">
                                        <Headphones className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                    Customer Care Agent
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                                    Intelligent customer support that handles inquiries, troubleshooting, and escalations with empathy and accuracy.
                                </p>
                                <audio controls className="w-full mb-3 h-8" style={{ accentColor: '#f97316' }}>
                                    <source src="/audio/customer-care-sample.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-widest">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>90% Resolution Rate</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Call Center */}
                        <div className="group relative bg-gradient-to-br from-orange-500/10 via-white/90 to-orange-600/10 border border-orange-400/30 overflow-hidden transition-all duration-500 hover:border-orange-300/60 hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] hover:-translate-y-2" style={{
                            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
                        }}>
                            <div className="relative h-32 sm:h-40 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop&crop=center&auto=format&q=90"
                                    alt="AI Call Center Operations - Enterprise Communication Hub"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute top-3 left-3">
                                    <div className="p-2 bg-orange-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg">
                                        <Shield className="h-5 w-5 text-orange-600" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-600 mb-2 uppercase tracking-wide group-hover:text-orange-500 transition-colors">
                                    AI Call Center
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 min-h-[60px]">
                                    Complete call center automation with intelligent routing, queue management, and real-time analytics for enterprise-scale operations.
                                </p>
                                <audio controls className="w-full mb-3 h-8" style={{ accentColor: '#f97316' }}>
                                    <source src="/audio/call-center-sample.mp3" type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                                <div className="flex items-center gap-2 text-xs text-orange-600 font-semibold uppercase tracking-widest">
                                    <CheckCircle className="h-3 w-3" />
                                    <span>Unlimited Capacity</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compact Features Section with HD Images */}
            <section className="py-8 px-4 bg-white relative overflow-hidden">

                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-10">
                        <span className="inline-block bg-orange-500/10 px-4 py-2 border border-orange-400/30 text-xs sm:text-sm text-orange-600 font-semibold uppercase tracking-widest rounded-full mb-3" style={{letterSpacing: '0.15em'}}>Enterprise-Ready Solution</span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-700 mb-3 tracking-tight drop-shadow-lg">Why Choose Our AI Voice Assistant?</h2>
                        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-medium">Deploy intelligent voice automation that transforms customer interactions and drives measurable business results.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        {deploymentFeatures.map((feature, index) => {
                            const featureImages = [
                                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop', // Instant Setup - Dashboard
                                'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=500&h=400&fit=crop', // Security - Lock
                                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=400&fit=crop', // 24/7 Operations - Clock
                                'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=400&fit=crop', // Auto-Scaling - Growth
                                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop', // Omnichannel - Team
                                'https://images.unsplash.com/photo-1557821552-17105176677c?w=500&h=400&fit=crop'  // Proven Results - Success
                            ];

                            return (
                                <div
                                    key={index}
                                    className="bg-orange-400/5 border border-orange-400/20 overflow-hidden transition-all duration-400 hover:border-orange-400/60 hover:shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:-translate-y-3 group relative"
                                    style={{
                                        clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))'
                                    }}
                                >
                                    {/* HD Feature Image */}
                                    <div className="relative h-28 sm:h-32 md:h-36 mb-4 rounded-md overflow-hidden">
                                        <img
                                            src={featureImages[index]}
                                            alt={`${feature.title} - AI Voice Assistant Feature`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>

                                    {/* Content - Compact */}
                                    <div className="space-y-2 relative z-10 px-2 pb-2 flex flex-col items-center text-center">
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 shadow-md -mt-8 z-10 relative mb-2">
                                            <feature.icon className="h-6 w-6 text-white drop-shadow" />
                                        </span>
                                        <h3 className="text-base sm:text-lg font-extrabold text-orange-600 group-hover:text-orange-500 transition-colors uppercase tracking-wider mb-0">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Cyberpunk CTA */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-700/20 border-2 border-orange-400/30" style={{
                        clipPath: 'polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 40px 100%, 0 calc(100% - 40px))',
                        boxShadow: '0 0 50px rgba(249, 115, 22, 0.3)'
                    }}>
                        <div className="relative z-10 p-6 sm:p-8 text-center">
                            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 mb-3 uppercase tracking-wider shimmer-text">
                                Ready to Transform Your Customer Service?
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 mb-6 max-w-xl mx-auto">
                                Join 50,000+ companies using AI voice automation. Start your free trial - no credit card required.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
                                <button className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg font-bold px-6 py-3 text-sm sm:text-base transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] flex items-center uppercase tracking-widest" style={{
                                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                }}>
                                    Start Free Trial
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </button>
                                <button className="bg-transparent text-orange-600 border-2 border-orange-600 hover:bg-orange-100/30 font-bold px-6 py-3 text-sm sm:text-base transition-all uppercase tracking-widest" style={{
                                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                                }}>
                                    Book Demo
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-gray-700 text-xs sm:text-sm uppercase tracking-widest">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>14-day trial</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>No credit card</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
