"use client"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, BarChart3, Calendar, CheckCircle, Clock, Globe, Headphones, LayoutDashboard, MessageSquare, PhoneCall, Shield, TrendingUp, Users, Zap } from "lucide-react";
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
        color: "from-indigo-500 to-violet-500",
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
        color: "from-indigo-500 to-violet-500",
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
        color: "from-indigo-500 to-violet-500",
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
        color: "from-violet-500 to-indigo-600",
        stat: "50+",
        statLabel: "Native Integrations",
        audio: "/audio/virtual-receptionist-sample.mp3",
        features: [
            { icon: "Zap", text: "Connect with Zapier, Make, & 1000+ apps" },
            { icon: "Globe", text: "Bi-directional data flow & updates" },
            { icon: "LayoutDashboard", text: "RESTful API & SDK for developers" },
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

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Calendar, Clock, Users, Shield, TrendingUp, BarChart3, Zap, Headphones, 
    CheckCircle, MessageSquare, Award, LayoutDashboard, Globe, PhoneCall
};

export default function ServicesShowcase() {
    const storySectionRef = useRef<HTMLDivElement>(null);
    const [activeService, setActiveService] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !storySectionRef.current) return;

        const ctx = gsap.context(() => {
            const illustrations = gsap.utils.toArray<HTMLElement>(".exo-illustration");
            const contents = gsap.utils.toArray<HTMLElement>(".exo-content");

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

    return (
        <section ref={storySectionRef} className="h-screen bg-gradient-to-br from-indigo-50 via-indigo-100/30 to-indigo-50 overflow-hidden">
            <div className="h-full flex flex-col lg:flex-row items-center">
                {/* Left: Illustrations */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative flex items-center justify-center">
                    {services.map((service, i) => (
                        <div key={i} className="exo-illustration absolute inset-0 flex items-center justify-center p-8">
                            <div className="relative">
                                <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-20 blur-3xl scale-90`}></div>
                                <Image
                                    src={service.img}
                                    alt={service.title}
                                    width={400}
                                    height={400}
                                    className="relative z-10 drop-shadow-2xl"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Content */}
                <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative flex items-center">
                    {services.map((service, i) => (
                        <div key={i} className="exo-content absolute inset-0 flex items-center p-8 lg:pr-16">
                            <div className="max-w-lg">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${service.color} text-white text-xs font-semibold mb-4`}>
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    {service.subtitle}
                                </div>
                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.desc}
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {service.features.map((f, fi) => {
                                        const IconComponent = iconMap[f.icon];
                                        return (
                                            <div key={fi} className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                                                    {IconComponent && <IconComponent className="h-4 w-4 text-white" />}
                                                </div>
                                                <p className="text-xs text-gray-700 font-medium">{f.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r ${service.color} text-white`}>
                                    <span className="text-2xl font-bold">{service.stat}</span>
                                    <span className="text-sm opacity-90">{service.statLabel}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Progress Dots */}
                    <div className="absolute bottom-8 left-8 flex gap-2">
                        {services.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    i === activeService ? 'w-6 bg-indigo-600' : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
