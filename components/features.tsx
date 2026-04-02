"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BarChart3, Bot, Brain, ChevronRight, Clock, Globe, MessageSquare, Sparkles } from "lucide-react"
import { ElementType, useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

type Feature = {
    icon: ElementType
    title: string
    description: string
    gradient: string
    stats: { label: string; value: string }[]
}

const features: Feature[] = [
    {
        icon: Bot,
        title: "Intelligent AI Chatbots",
        description: "Deploy smart conversational AI that understands context, learns from interactions, and provides human-like responses with advanced natural language understanding.",
        gradient: "from-orange-500 to-orange-600",
        stats: [{ label: "Accuracy", value: "99.2%" }, { label: "Languages", value: "50+" }]
    },
    {
        icon: MessageSquare,
        title: "Multi-Channel Support",
        description: "Seamlessly integrate across websites, mobile apps, social media, and messaging platforms for a truly unified customer experience.",
        gradient: "from-orange-500 to-orange-600",
        stats: [{ label: "Channels", value: "15+" }, { label: "Integrations", value: "500+" }]
    },
    {
        icon: Brain,
        title: "Natural Language Processing",
        description: "Advanced NLP capabilities understand customer intent, sentiment, and context to deliver highly personalized responses every time.",
        gradient: "from-orange-500 to-orange-600",
        stats: [{ label: "Intent Detection", value: "98%" }, { label: "Sentiment", value: "Real-time" }]
    },
    {
        icon: BarChart3,
        title: "Conversation Analytics",
        description: "Track performance metrics, customer satisfaction, and conversation insights to continuously optimize your AI's effectiveness.",
        gradient: "from-orange-500 to-orange-600",
        stats: [{ label: "Metrics", value: "50+" }, { label: "Reports", value: "Custom" }]
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        description: "Provide instant customer support around the clock, reducing response times and dramatically improving customer satisfaction.",
        gradient: "from-orange-600 to-orange-500",
        stats: [{ label: "Uptime", value: "99.9%" }, { label: "Response", value: "<1s" }]
    },
    {
        icon: Globe,
        title: "Multi-Language Support",
        description: "Communicate with customers in their preferred language with built-in translation and localization features for global reach.",
        gradient: "from-orange-500 to-orange-600",
        stats: [{ label: "Languages", value: "50+" }, { label: "Auto-detect", value: "Yes" }]
    },
]

export function Features() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)
    const [activeFeature, setActiveFeature] = useState(0)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            )
        }, sectionRef)

        return () => ctx.revert()
    }, [mounted])

    // Auto-rotate features
    useEffect(() => {
        if (!mounted) return
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [mounted])

    const ActiveIcon = features[activeFeature].icon

    return (
        <section 
            ref={sectionRef}
            className="relative py-16 md:py-24 bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] overflow-hidden"
            role="region"
            aria-labelledby="features-heading"
        >
            {/* Background Elements */}
            {mounted && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-400/15 to-orange-300/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-orange-400/10 to-orange-300/10 rounded-full blur-3xl" />
                </div>
            )}
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border-orange-200/40 rounded-full mb-4">
                        <Sparkles className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-700">Platform Features</span>
                    </div>
                    
                    <h2 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                        Powerful Features for
                        <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"> Modern Business</span>
                    </h2>
                    
                    <p className="text-gray-600 text-base max-w-2xl mx-auto">
                        Everything you need to transform customer interactions
                    </p>
                </div>

                {/* Interactive Feature Display */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    
                    {/* Left: Feature List */}
                    <div className="space-y-2">
                        {features.map((feature, index) => {
                            const Icon = feature.icon
                            const isActive = activeFeature === index
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveFeature(index)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left group ${
                                        isActive 
                                            ? 'glass-card bg-white/80 shadow-lg shadow-orange-500/10 border-l-4 border-orange-500' 
                                            : 'hover:bg-white/60 border-l-4 border-transparent'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                        isActive 
                                            ? `bg-gradient-to-br ${feature.gradient} shadow-md` 
                                            : 'bg-gray-100 group-hover:bg-gray-200'
                                    }`}>
                                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500'}`} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-semibold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    
                                    <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                                        isActive ? 'text-orange-500 translate-x-1' : 'text-gray-300'
                                    }`} />
                                </button>
                            )
                        })}
                    </div>

                    {/* Right: Active Feature Detail */}
                    <div className="relative">
                        <div className={`bg-gradient-to-br ${features[activeFeature].gradient} rounded-2xl p-8 text-white shadow-xl transition-all duration-500`}>
                            {/* Decorative circles */}
                            <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
                            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
                            
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                                    <ActiveIcon className="w-7 h-7 text-white" />
                                </div>
                                
                                {/* Title */}
                                <h3 className="text-2xl font-bold mb-3">
                                    {features[activeFeature].title}
                                </h3>
                                
                                {/* Description */}
                                <p className="text-white/90 leading-relaxed mb-6">
                                    {features[activeFeature].description}
                                </p>
                                
                                {/* Stats */}
                                <div className="flex gap-6">
                                    {features[activeFeature].stats.map((stat, i) => (
                                        <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                                            <div className="text-xl font-bold">{stat.value}</div>
                                            <div className="text-sm text-white/70">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Progress indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {features.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveFeature(index)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                        activeFeature === index 
                                            ? 'w-8 bg-orange-500' 
                                            : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}


