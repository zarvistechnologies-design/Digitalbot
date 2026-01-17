"use client"
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BarChart3, Bot, Headphones, MessageSquare, Mic, PhoneCall, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

const ProductShowcase = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Animate each card on scroll
        cardsRef.current.forEach((card, index) => {
            if (!card) return;
            
            gsap.fromTo(card,
                { 
                    opacity: 0, 
                    y: 50,
                    scale: 0.95
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 88%",
                        end: "top 65%",
                        toggleActions: "play none none reverse"
                    },
                    delay: index * 0.08
                }
            );

            // Hover animations
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    const setCardRef = (el: HTMLDivElement | null, index: number) => {
        cardsRef.current[index] = el;
    };

    return (
        <section ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-orange-500 text-xs font-semibold tracking-wider uppercase mb-3">
                        <Sparkles className="h-3.5 w-3.5" />
                        Our Solutions
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        AI-Powered <span className="text-orange-500">Ecosystem</span>
                    </h2>
                    <p className="text-base text-gray-600 max-w-xl mx-auto">
                        Transform your customer communication with intelligent automation
                    </p>
                </div>

                {/* Bento Grid Layout - Matching Reference */}
                <div className="grid grid-cols-12 gap-4 lg:gap-5">
                    
                    {/* Row 1 */}
                    
                    {/* Card 1 - AI Voice Agent (Tall Left) */}
                    <div 
                        ref={(el) => setCardRef(el, 0)}
                        className="col-span-12 sm:col-span-6 lg:col-span-3 row-span-2 bg-gradient-to-br from-orange-50 to-orange-100/60 rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            AI-Powered<br/>Voice Agent
                        </h3>
                        <Link href="/services/ai-voice-bot" className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <div className="mt-4 relative">
                            <img 
                                src="/images/image/ai agent.jpg" 
                                alt="AI Voice Agent"
                                className="w-full h-48 object-cover rounded-xl"
                            />
                            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                    <PhoneCall className="h-3 w-3 text-orange-500" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">24/7 Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Smart Call Center */}
                    <div 
                        ref={(el) => setCardRef(el, 1)}
                        className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-gray-200 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            DigitalBot Call<br/>Center
                        </h3>
                        <Link href="/services/ai-call-center" className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        {/* Mini UI mockup */}
                        <div className="absolute top-4 right-4 bg-gray-900 rounded-xl p-3 w-36 shadow-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                    <span className="text-[8px] text-white">✓</span>
                                </div>
                                <span className="text-[10px] text-gray-300">Preparing call...</span>
                            </div>
                            <div className="space-y-1.5 text-[9px] text-gray-400">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                                    <span>Voice call to user</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    <span>Call initiated</span>
                                </div>
                            </div>
                            <div className="mt-3 bg-gray-800 rounded-lg px-2 py-1.5 flex items-center gap-2">
                                <span className="text-[10px] text-gray-400">+ Ask anything</span>
                                <Mic className="h-3 w-3 text-gray-500 ml-auto" />
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Circular Automation Graphic */}
                    <div 
                        ref={(el) => setCardRef(el, 2)}
                        className="col-span-12 lg:col-span-6 bg-white border border-gray-50 rounded-2xl p-6 relative overflow-hidden group cursor-pointer flex items-center justify-center"
                    >
                        <div className="relative w-40 h-40">
                            {/* Animated circles */}
                            <svg className="w-full h-full" viewBox="0 0 160 160">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="#f97316" strokeWidth="2" opacity="0.15" />
                                <circle cx="80" cy="80" r="55" fill="none" stroke="#22d3ee" strokeWidth="2" opacity="0.25" />
                                <circle cx="80" cy="80" r="40" fill="none" stroke="#a855f7" strokeWidth="2" opacity="0.35" />
                                {/* Central icon */}
                                <circle cx="80" cy="80" r="25" fill="url(#centerGradient)" />
                                <defs>
                                    <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#22d3ee" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Labels around circle */}
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[11px] font-semibold text-gray-400 tracking-wide">Automate</span>
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 text-[11px] font-semibold text-gray-400 tracking-wide">Optimize</span>
                            <span className="absolute top-1/2 -right-4 -translate-y-1/2 text-[11px] font-semibold text-cyan-500 tracking-wide rotate-90">Personalize</span>
                            <span className="absolute top-1/2 -left-4 -translate-y-1/2 text-[11px] font-semibold text-purple-500 tracking-wide -rotate-90">Observe</span>
                        </div>
                        <div className="ml-8 text-left">
                            <p className="text-sm text-gray-500 mb-1">Powered by</p>
                            <p className="text-lg font-bold text-gray-900">AI Intelligence</p>
                            <p className="text-sm text-gray-500">Loop</p>
                        </div>
                    </div>

                    {/* Row 2 */}

                    {/* Card 4 - Stats Card (40%) */}
                    <div 
                        ref={(el) => setCardRef(el, 3)}
                        className="col-span-6 lg:col-span-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="text-4xl font-bold text-emerald-500">40</span>
                                <span className="text-2xl font-bold text-emerald-500">%</span>
                                <p className="text-sm text-gray-600 mt-2">Higher Agent<br/>Productivity</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                <BarChart3 className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Card 5 - Platform (with person image) */}
                    <div 
                        ref={(el) => setCardRef(el, 4)}
                        className="col-span-6 lg:col-span-3 row-span-2 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 relative overflow-hidden group cursor-pointer"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                            DigitalBot<br/>Platform
                        </h3>
                        <Link href="/services" className="inline-flex items-center gap-1 text-cyan-600 font-medium text-sm hover:gap-2 transition-all">
                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <div className="mt-4 relative">
                            <img 
                                src="/images/image/digitalbot platform.jpg" 
                                alt="Platform User"
                                className="w-full h-44 object-cover rounded-xl"
                            />
                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                                    <MessageSquare className="h-4 w-4 text-cyan-500" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-sm flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 6 - Conversational AI */}
                    <div 
                        ref={(el) => setCardRef(el, 5)}
                        className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-gray-200 transition-colors"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                            AI-Powered Conversational<br/>Quality Analysis
                        </h3>
                        <Link href="/services/conversational-ai" className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Row 3 */}

                    {/* Card 7 - Customer Support */}
                    <div 
                        ref={(el) => setCardRef(el, 6)}
                        className="col-span-6 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-gray-200 transition-colors"
                    >
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            AI Customer<br/>Support
                        </h3>
                        <Link href="/services/ai-customer-support" className="inline-flex items-center gap-1 text-orange-500 font-medium text-sm hover:gap-2 transition-all">
                            Learn More <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Card 8 - VoiceStream */}
                    <div 
                        ref={(el) => setCardRef(el, 7)}
                        className="col-span-6 lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-gray-200 transition-colors flex items-center gap-4"
                    >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Headphones className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-gray-900">VoiceStream</p>
                            <Link href="/services/voice-ai-business" className="inline-flex items-center gap-1 text-purple-500 font-medium text-sm hover:gap-2 transition-all">
                                Learn More <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProductShowcase;
