"use client"
import PlatformFeatures from "@/components/platform-features";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Award, BarChart3, Calendar, CheckCircle, Clock, Globe, Headphones, LayoutDashboard, MessageSquare, Mic, PhoneCall, Shield, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

// Services data for attractive-style scroll showcase
const services = [
    {
        title: "Doctor Appointments",
        subtitle: "24/7 AI-Powered Medical Scheduling",
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/b_rgb:16a34a/doctor_appointment_i73m9a",
        desc: "Never miss a patient again. Our AI voice agent handles appointment booking, rescheduling, and confirmations around the clock—with perfect accuracy and a warm, human touch.",
        color: "from-orange-500 to-orange-500",
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
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/b_rgb:2563eb/lead_generation_qas7wm",
        desc: "Scale your sales pipeline effortlessly. Our AI makes thousands of outbound calls daily, qualifying leads and booking meetings while your team focuses on closing.",
        color: "from-orange-500 to-orange-500",
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
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/b_rgb:38bdf8/customercareagent_k6wqe8",
        desc: "Delight customers with instant, empathetic support. Our AI resolves issues on the first call, escalates complex cases smartly, and keeps your CSAT scores soaring.",
        color: "from-orange-500 to-orange-500",
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
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/b_rgb:94a3b8/voicebot_integaration_pjlorx",
        desc: "Connect our AI voice agents directly into your existing workflows. From CRM updates to calendar syncing, our voicebot integrates with the tools you already use.",
        color: "from-orange-500 to-orange-600",
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
        img: "https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/b_rgb:7c3aed/ai_call_center_kalt8q",
        desc: "Transform your entire call center operation. Handle unlimited concurrent calls with intelligent routing, real-time analytics, and seamless human handoff when needed.",
        color: "from-orange-500 to-orange-500",
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

// Dashboard data for each service
const dashboardTabs = [
    {
        id: 'general',
        label: 'General Dashboard',
        icon: LayoutDashboard,
        assistantName: 'AI Voice Assistant',
        assistantId: 'ID:98234567',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Total Calls', value: '8,420', icon: PhoneCall, color: 'text-orange-500' },
            { label: 'Avg. Call Duration', value: '3.2m', icon: Clock, color: 'text-orange-500' },
            { label: 'Total Minute Use', value: '26,944m', icon: BarChart3, color: 'text-orange-500' },
        ],
        chartData: [45, 72, 58, 83, 67, 91, 76, 88, 95, 80],
        donutPercent: 91,
        donutStats: [
            { label: 'Total Calls', value: '8,420 calls', color: 'bg-orange-500' },
            { label: 'Total minute use', value: '26,944 min', color: 'bg-orange-400' },
            { label: 'Avg. call duration', value: '3.2 min', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Configure', 'Prompt', 'Actions', 'Deployment', 'Calls'],
    },
    {
        id: 'doctor',
        label: 'Doctor Appointments',
        icon: Calendar,
        assistantName: 'Dr. Appointment Bot',
        assistantId: 'ID:23569842',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Appointments', value: '1,425', icon: Calendar, color: 'text-orange-500' },
            { label: 'Avg. Call Duration', value: '3.1m', icon: Clock, color: 'text-orange-500' },
            { label: 'Total Minute Use', value: '4,856m', icon: BarChart3, color: 'text-orange-500' },
        ],
        chartData: [38, 62, 45, 78, 55, 85, 70, 60, 90, 73],
        donutPercent: 84,
        donutStats: [
            { label: 'Total Calls', value: '1,425 calls', color: 'bg-orange-500' },
            { label: 'Total minute use', value: '4,856 min', color: 'bg-orange-400' },
            { label: 'Avg. call duration', value: '3,145 min', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Configure', 'Prompt', 'Actions', 'Deployment', 'Calls'],
    },
    {
        id: 'leads',
        label: 'Lead Generation',
        icon: TrendingUp,
        assistantName: 'Lead Gen Assistant',
        assistantId: 'ID:45782310',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Leads Captured', value: '3,210', icon: Users, color: 'text-orange-500' },
            { label: 'Conversion Rate', value: '34%', icon: TrendingUp, color: 'text-orange-500' },
            { label: 'Calls Made', value: '9,630m', icon: PhoneCall, color: 'text-orange-500' },
        ],
        chartData: [52, 40, 68, 55, 82, 63, 75, 90, 48, 86],
        donutPercent: 78,
        donutStats: [
            { label: 'Qualified Leads', value: '2,504 leads', color: 'bg-orange-500' },
            { label: 'Follow ups', value: '706 pending', color: 'bg-orange-400' },
            { label: 'Conversion rate', value: '34%', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Configure', 'Prompt', 'Actions', 'Campaigns', 'Leads'],
    },
    {
        id: 'support',
        label: 'Customer Support',
        icon: Headphones,
        assistantName: 'Support Assistant',
        assistantId: 'ID:67891234',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Tickets Resolved', value: '5,840', icon: CheckCircle, color: 'text-orange-500' },
            { label: 'Avg. Resolution', value: '2.8m', icon: Clock, color: 'text-orange-500' },
            { label: 'Satisfaction', value: '96%', icon: Award, color: 'text-orange-500' },
        ],
        chartData: [60, 78, 52, 88, 70, 95, 65, 82, 73, 90],
        donutPercent: 96,
        donutStats: [
            { label: 'Resolved', value: '5,840 tickets', color: 'bg-orange-500' },
            { label: 'Escalated', value: '243 tickets', color: 'bg-orange-400' },
            { label: 'Avg. resolution', value: '2.8 min', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Configure', 'Prompt', 'Actions', 'Tickets', 'Reports'],
    },
    {
        id: 'whatsapp',
        label: 'WhatsApp Chatbot',
        icon: MessageSquare,
        assistantName: 'WhatsApp Bot',
        assistantId: 'ID:88901256',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Messages Sent', value: '24,300', icon: MessageSquare, color: 'text-orange-500' },
            { label: 'Active Chats', value: '1,840', icon: Users, color: 'text-orange-500' },
            { label: 'Response Rate', value: '99.2%', icon: Zap, color: 'text-orange-500' },
        ],
        chartData: [55, 82, 68, 92, 75, 88, 60, 95, 78, 85],
        donutPercent: 94,
        donutStats: [
            { label: 'Auto-resolved', value: '22,842 chats', color: 'bg-orange-500' },
            { label: 'Escalated', value: '1,458 chats', color: 'bg-orange-400' },
            { label: 'Avg. response', value: '< 3 sec', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Configure', 'Prompt', 'Actions', 'Chats', 'Contacts'],
        whatsappChat: [
            { from: 'user', text: 'Hi, I want to book an appointment with Dr. Sharma for tomorrow.', time: '10:32 AM' },
            { from: 'bot', text: 'Hello! 👋 I\'d be happy to help you book an appointment with Dr. Sharma. Let me check tomorrow\'s availability for you.', time: '10:32 AM' },
            { from: 'bot', text: 'Dr. Sharma has the following slots available tomorrow:\n\n🕐 9:00 AM\n🕐 11:30 AM\n🕐 2:00 PM\n🕐 4:30 PM\n\nWhich time works best for you?', time: '10:32 AM' },
            { from: 'user', text: 'The 11:30 AM slot please', time: '10:33 AM' },
            { from: 'bot', text: 'Your appointment has been confirmed! ✅\n\n📋 Dr. Sharma\n📅 Tomorrow, 11:30 AM\n📍 City Health Clinic, Room 204\n\nYou\'ll receive an SMS reminder 1 hour before. Is there anything else I can help with?', time: '10:33 AM' },
            { from: 'user', text: 'No that\'s all, thank you!', time: '10:34 AM' },
            { from: 'bot', text: 'You\'re welcome! Have a great day! 😊', time: '10:34 AM' },
        ],
    },
];

const sidebarIcons: Record<string, any> = {
    Dashboard: LayoutDashboard,
    Configure: Shield,
    Prompt: MessageSquare,
    Actions: Zap,
    Deployment: Globe,
    Calls: PhoneCall,
    Campaigns: TrendingUp,
    Leads: Users,
    Tickets: Headphones,
    Reports: BarChart3,
    Chats: MessageSquare,
    Contacts: Users,
};

function DashboardShowcase() {
    const [activeTab, setActiveTab] = useState(0);
    const tab = dashboardTabs[activeTab];
    const maxChart = Math.max(...tab.chartData);
    const isWhatsApp = tab.id === 'whatsapp';

    return (
        <section className="pt-0 pb-16 sm:pb-20 bg-white relative overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes dash-fade-in { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
                @keyframes dash-scale { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
                .dash-animate { animation: dash-fade-in 0.6s ease-out both; }
                .dash-scale { animation: dash-scale 0.7s ease-out 0.2s both; }
            `}} />

            <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-10 sm:mb-14 dash-animate">
                    <div className="inline-flex items-center gap-2 bg-white border border-orange-100 px-4 py-2 rounded-full shadow-sm mb-5">
                        <LayoutDashboard className="h-4 w-4 text-orange-500" />
                        <span className="text-xs font-semibold tracking-wide text-slate-600 uppercase">See Our Dashboard</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        One Platform, Every{' '}
                        <span className="text-orange-500">AI Service</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Manage doctor appointments, lead generation, customer support, and more — all from a single, powerful dashboard.
                    </p>
                </div>

                {/* Tab buttons */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 dash-animate" style={{ animationDelay: '0.15s' }}>
                    {dashboardTabs.map((t, i) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(i)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                                activeTab === i
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-200 hover:text-orange-600'
                            }`}
                        >
                            <t.icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Dashboard mockup */}
                <div className="dash-scale relative mx-auto max-w-6xl" key={tab.id}>
                    {/* Horizontal scroll wrapper for mobile */}
                    <div className="overflow-x-auto sm:overflow-x-visible -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 sm:pb-0">
                    {/* Tablet frame */}
                    <div className="rounded-[24px] sm:rounded-[32px] border-[6px] sm:border-[8px] border-slate-800 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.12)] overflow-hidden min-w-[700px] sm:min-w-0">

                        {/* Dashboard content */}
                        <div className="flex">
                            {/* Sidebar */}
                            <div className="flex flex-col w-[180px] sm:w-[200px] lg:w-[220px] border-r border-slate-100 bg-slate-50/60 py-5 px-3 flex-shrink-0">
                                {/* Logo */}
                                <div className="flex items-center gap-2 px-3 mb-5">
                                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                {/* Assistant info */}
                                <div className="bg-white rounded-xl border border-slate-100 p-3 mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-6 w-6 rounded-lg bg-slate-100 flex items-center justify-center">
                                            <tab.icon className="h-3.5 w-3.5 text-slate-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 leading-tight">{tab.assistantName}</p>
                                            <p className="text-[9px] text-slate-400">{tab.assistantId}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1.5">Mob: {tab.mobNumber}</p>
                                    <button className="mt-2 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-semibold py-1.5 rounded-lg">
                                        <PhoneCall className="h-3 w-3" />
                                        Test Assistant
                                    </button>
                                </div>

                                {/* Nav items */}
                                <nav className="space-y-0.5">
                                    {tab.sidebarItems.map((item, i) => {
                                        const Icon = sidebarIcons[item] || LayoutDashboard;
                                        return (
                                            <div key={item} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                                i === 0 ? 'bg-orange-50 text-orange-600' : 'text-slate-500 hover:bg-slate-100'
                                            }`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {item}
                                            </div>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* Main content */}
                            <div className="flex-1 p-4 sm:p-5 lg:p-6 overflow-hidden">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-800">Dashboard</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] text-slate-500 font-medium">Type</span>
                                        <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-[10px] text-orange-600 font-semibold flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                                            Live
                                        </span>
                                        <span className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] text-slate-500 font-medium">Last Week</span>
                                    </div>
                                </div>

                                {/* Stat cards */}
                                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
                                    {tab.stats.map((stat, i) => (
                                        <div key={i} className="rounded-xl border border-slate-100 bg-white p-3 sm:p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <div className={`h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center`}>
                                                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                                                </div>
                                                <span className="text-[10px] sm:text-xs text-slate-400 font-medium">{stat.label}</span>
                                            </div>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart + Donut row OR WhatsApp Chat */}
                                {isWhatsApp ? (
                                    <div className="grid grid-cols-5 gap-4">
                                        {/* WhatsApp Chat */}
                                        <div className="col-span-3 rounded-xl border border-slate-100 bg-[#efeae2] overflow-hidden">
                                            <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                                                    <MessageSquare className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">DigitalBot AI</p>
                                                    <p className="text-[10px] text-orange-200">online</p>
                                                </div>
                                                <div className="ml-auto flex items-center gap-3 text-white/80">
                                                    <PhoneCall className="h-4 w-4" />
                                                    <span className="text-[10px]">⋮</span>
                                                </div>
                                            </div>
                                            <div className="p-3 space-y-2 max-h-[340px] sm:max-h-[400px] overflow-y-auto" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'0.8\' fill=\'%23d5ccb9\' opacity=\'0.3\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'200\' height=\'200\' fill=\'%23efeae2\'/%3E%3Crect width=\'200\' height=\'200\' fill=\'url(%23p)\'/%3E%3C/svg%3E")' }}>
                                                {(tab as any).whatsappChat?.map((msg: any, i: number) => (
                                                    <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] rounded-xl px-3 py-2 shadow-sm ${
                                                            msg.from === 'user'
                                                                ? 'bg-[#dcf8c6] rounded-tr-none'
                                                                : 'bg-white rounded-tl-none'
                                                        }`}>
                                                            <p className="text-[11px] sm:text-xs text-slate-800 whitespace-pre-line leading-relaxed">{msg.text}</p>
                                                            <p className="text-[8px] sm:text-[9px] text-slate-400 text-right mt-0.5">{msg.time} {msg.from === 'user' ? '✓✓' : ''}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-slate-100">
                                                <span className="text-slate-400 text-lg">😊</span>
                                                <div className="flex-1 rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[11px] text-slate-400">Type a message...</div>
                                                <div className="h-7 w-7 rounded-full bg-[#075e54] flex items-center justify-center">
                                                    <Mic className="h-3.5 w-3.5 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Donut chart */}
                                        <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-4">
                                            <p className="text-xs font-semibold text-slate-700 mb-3">Chat Analytics</p>
                                            <div className="flex justify-center mb-3">
                                                <div className="relative w-[90px] h-[90px] sm:w-[100px] sm:h-[100px]">
                                                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#25d366" strokeWidth="3"
                                                            strokeDasharray={`${tab.donutPercent} ${100 - tab.donutPercent}`} strokeLinecap="round" />
                                                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#075e54" strokeWidth="3"
                                                            strokeDasharray={`${Math.round(tab.donutPercent * 0.35)} ${100 - Math.round(tab.donutPercent * 0.35)}`}
                                                            strokeDashoffset={`-${tab.donutPercent}`} strokeLinecap="round" />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-[8px] text-slate-400">Auto-resolved</span>
                                                        <span className="text-lg font-bold text-slate-800">{tab.donutPercent}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="text-slate-500 font-medium">Status</span>
                                                    <span className="text-slate-500 font-medium">Result</span>
                                                </div>
                                                {tab.donutStats.map((s, i) => (
                                                    <div key={i} className="flex items-center justify-between text-[10px]">
                                                        <span className="flex items-center gap-1.5">
                                                            <span className={`w-2 h-2 rounded-full ${s.color}`} />
                                                            <span className="text-slate-600">{s.label}</span>
                                                        </span>
                                                        <span className="font-semibold text-slate-700">{s.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                <div className="grid grid-cols-5 gap-4">
                                    {/* Chart */}
                                    <div className="col-span-3 rounded-xl border border-slate-100 bg-white p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700">Total Call Analysis</p>
                                                <p className="text-[10px] text-slate-400">{tab.stats[0].value}</p>
                                            </div>
                                            <span className="px-2.5 py-1 rounded-md border border-slate-200 text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                                Total Calls <span className="text-[8px]">▼</span>
                                            </span>
                                        </div>
                                        {/* Bar chart */}
                                        <div className="flex items-end gap-2 sm:gap-3 px-2" style={{ height: '200px' }}>
                                            {tab.chartData.map((val, i) => {
                                                return (
                                                <div key={i} className="flex-1 flex flex-col items-stretch justify-end">
                                                    <div
                                                        className="rounded-t-xl bg-gradient-to-t from-orange-500 to-orange-400 shadow-sm"
                                                        style={{ height: `${Math.round((val / maxChart) * 170)}px`, minWidth: '24px' }}
                                                    />
                                                    <span className="text-[7px] sm:text-[8px] text-slate-400 text-center mt-1.5">{9 + i}am</span>
                                                </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Donut chart */}
                                    <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-4">
                                        <p className="text-xs font-semibold text-slate-700 mb-3">Total Calls</p>
                                        <div className="flex justify-center mb-3">
                                            <div className="relative w-[90px] h-[90px] sm:w-[100px] sm:h-[100px]">
                                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3"
                                                        strokeDasharray={`${tab.donutPercent} ${100 - tab.donutPercent}`} strokeLinecap="round" />
                                                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3"
                                                        strokeDasharray={`${Math.round(tab.donutPercent * 0.35)} ${100 - Math.round(tab.donutPercent * 0.35)}`}
                                                        strokeDashoffset={`-${tab.donutPercent}`} strokeLinecap="round" />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-[8px] text-slate-400">Summary</span>
                                                    <span className="text-lg font-bold text-slate-800">{tab.donutPercent}%</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-slate-500 font-medium">Status</span>
                                                <span className="text-slate-500 font-medium">Result</span>
                                            </div>
                                            {tab.donutStats.map((s, i) => (
                                                <div key={i} className="flex items-center justify-between text-[10px]">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${s.color}`} />
                                                        <span className="text-slate-600">{s.label}</span>
                                                    </span>
                                                    <span className="font-semibold text-slate-700">{s.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>
                    </div>{/* end scroll wrapper */}
                </div>
            </div>
        </section>
    );
}

export default function Hero() {
    const [counts, setCounts] = useState([0, 0, 0])

    // Vapi voice agent state
    const vapiRef = useRef<any>(null)
    const [isCallActive, setIsCallActive] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [callStatus, setCallStatus] = useState('')
    const [vapiLoaded, setVapiLoaded] = useState(false)


    // Ref for journey flowchart section
    const flowchartRef = useRef<HTMLDivElement>(null)

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

            <section className="pt-8 pb-16 px-4 sm:px-8 lg:px-16 relative overflow-hidden min-h-screen bg-white" role="region" aria-labelledby="hero-heading">

                <div className="absolute inset-0 bg-white pointer-events-none" aria-hidden="true"></div>

                {/* Hero animations */}
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes hero-float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-14px); }
                    }
                    @keyframes hero-float-delay {
                        0%, 100% { transform: translateY(0) rotate(-6deg); }
                        50% { transform: translateY(-10px) rotate(-6deg); }
                    }
                    @keyframes hero-slide-up {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes hero-scale-in {
                        from { opacity: 0; transform: scale(0.88); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    @keyframes badge-float {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        33% { transform: translateY(-6px) translateX(4px); }
                        66% { transform: translateY(4px) translateX(-3px); }
                    }
                    .hero-phone-main { animation: hero-float 5s ease-in-out infinite; }
                    .hero-phone-secondary { animation: hero-float-delay 5.5s ease-in-out infinite 0.4s; }
                    .hero-slide-1 { animation: hero-slide-up 0.7s ease-out 0.1s both; }
                    .hero-slide-2 { animation: hero-slide-up 0.7s ease-out 0.25s both; }
                    .hero-slide-3 { animation: hero-slide-up 0.7s ease-out 0.4s both; }
                    .hero-slide-4 { animation: hero-slide-up 0.7s ease-out 0.55s both; }
                    .hero-phones-in { animation: hero-scale-in 0.9s ease-out 0.3s both; }
                    .hero-badge-float { animation: badge-float 4s ease-in-out infinite; }
                    .hero-badge-float-2 { animation: badge-float 4.5s ease-in-out infinite 1s; }
                    @keyframes wave-bar {
                        0% { transform: scaleY(0.3); }
                        100% { transform: scaleY(1); }
                    }
                `}} />

                <div className="container mx-auto relative z-30 max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Top: Badge + Headline */}
                    <div className="text-center pt-10 sm:pt-14 lg:pt-16 space-y-5">
                        <div className="inline-flex items-center gap-2 bg-white border border-orange-100 px-4 py-2 rounded-full shadow-sm hero-slide-1">
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">AI Voice Agents — Now Generally Available</span>
                        </div>

                        <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-[1.08] tracking-tight hero-slide-2">
                            Elevate Your Business With<br />
                            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent">WhatsApp Bots & Voice Agents</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto hero-slide-3">
                            Your receptionist sleeps, gets sick, takes breaks. <span className="text-slate-900 font-medium">We never do.</span>
                        </p>
                    </div>

                    {/* Center: Two Large Phones */}
                    <div className="relative flex justify-center items-end mt-8 sm:mt-16 hero-phones-in" style={{ minHeight: 'clamp(340px, 50vw, 520px)' }}>
                        {/* Subtle glow behind phones */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] sm:w-[420px] h-[220px] sm:h-[320px] rounded-full bg-gradient-to-t from-slate-100/40 via-slate-50/20 to-transparent blur-3xl pointer-events-none" />

                        {/* Left Phone (secondary, tilted) - WhatsApp Chat */}
                        <div className="hero-phone-secondary relative z-10 mr-[-30px] sm:mr-[-50px] mb-4 sm:mb-8">
                            <div className="w-[140px] sm:w-[220px] md:w-[260px] h-[280px] sm:h-[430px] md:h-[500px] rounded-[28px] sm:rounded-[40px] border-[3px] sm:border-[5px] border-[#1d1d1f] bg-[#ece5dd] shadow-[0_30px_80px_rgba(0,0,0,0.12)] rotate-[-6deg] overflow-hidden flex flex-col relative">
                                {/* Dynamic Island */}
                                <div className="absolute top-[3px] sm:top-[6px] left-1/2 -translate-x-1/2 z-20 w-[40px] sm:w-[65px] h-[10px] sm:h-[18px] bg-[#1d1d1f] rounded-full" />
                                {/* WhatsApp Header - right at top with space for Dynamic Island */}
                                <div className="bg-[#075e54] px-2 sm:px-3 pt-[16px] sm:pt-[28px] pb-1 sm:pb-1.5 flex items-center gap-1.5 sm:gap-2">
                                    <span className="text-white text-[10px] sm:text-xs">←</span>
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-[9px] sm:text-xs">D</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-[9px] sm:text-[11px] font-semibold truncate">DigitalBot AI</p>
                                        <p className="text-green-200 text-[7px] sm:text-[9px]"><span className="text-orange-400">●</span> Verified Business</p>
                                    </div>
                                    <span className="text-white text-[10px] sm:text-xs">📞</span>
                                </div>
                                {/* Chat Messages */}
                                <div className="flex-1 bg-[#ece5dd] px-1.5 sm:px-2 py-1.5 overflow-y-auto space-y-1.5">
                                    {/* Date Badge */}
                                    <div className="text-center">
                                        <span className="text-[6px] sm:text-[7px] text-slate-600 bg-white/80 px-1.5 py-0.5 rounded shadow-sm">Today 8:30 AM</span>
                                    </div>
                                    {/* Bot - Holiday Promo */}
                                    <div className="max-w-[88%]">
                                        <div className="bg-white rounded-lg rounded-tl-sm px-2 py-1.5 shadow-sm">
                                            <p className="text-[8px] sm:text-[9px] text-slate-900 font-semibold leading-snug">The holiday season is almost here!</p>
                                            <p className="text-[7px] sm:text-[8px] text-slate-700 mt-0.5 leading-snug">Start planning your dream getaway with special <span className="font-bold">30% discount</span></p>
                                            <div className="flex gap-1 mt-1.5">
                                                <div className="flex-1 rounded-lg overflow-hidden shadow-sm">
                                                    <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-1.5 sm:p-2 text-center">
                                                        <span className="text-[7px] sm:text-[8px] text-white font-semibold">🏔 Manali</span>
                                                    </div>
                                                    <div className="bg-white px-1 py-0.5">
                                                        <p className="text-[6px] sm:text-[7px] font-medium text-slate-800">Manali</p>
                                                        <p className="text-[5px] sm:text-[6px] text-orange-500">📍 Book Now</p>
                                                        <p className="text-[5px] sm:text-[6px] text-orange-500">📞 Call Agent</p>
                                                    </div>
                                                </div>
                                                <div className="flex-1 rounded-lg overflow-hidden shadow-sm">
                                                    <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-1.5 sm:p-2 text-center">
                                                        <span className="text-[7px] sm:text-[8px] text-white font-semibold">🏖 Beach</span>
                                                    </div>
                                                    <div className="bg-white px-1 py-0.5">
                                                        <p className="text-[6px] sm:text-[7px] font-medium text-slate-800">Lakshadweep</p>
                                                        <p className="text-[5px] sm:text-[6px] text-orange-500">📍 Book Now</p>
                                                        <p className="text-[5px] sm:text-[6px] text-orange-500">📞 Call Agent</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right mt-1"><span className="text-[6px] text-slate-400">8:30 ✓✓</span></div>
                                        </div>
                                    </div>
                                    {/* User - Book Manali */}
                                    <div className="flex justify-end">
                                        <div className="max-w-[78%] bg-[#d9fdd3] rounded-lg rounded-tr-sm px-2 py-1 shadow-sm">
                                            <p className="text-[8px] sm:text-[9px] text-slate-800">I&apos;d love to book Manali! What dates are available?</p>
                                            <div className="text-right"><span className="text-[6px] text-slate-500">8:31 ✓✓</span></div>
                                        </div>
                                    </div>
                                    {/* Bot - Available Dates */}
                                    <div className="max-w-[88%]">
                                        <div className="bg-white rounded-lg rounded-tl-sm px-2 py-1.5 shadow-sm">
                                            <p className="text-[8px] sm:text-[9px] text-slate-800">Great choice! 🏕 Here are the available dates for Manali:</p>
                                            <div className="mt-1 space-y-0.5 text-[7px] sm:text-[8px] text-slate-700">
                                                <p>📅 Dec 20 - Dec 25</p>
                                                <p>📅 Dec 27 - Jan 1</p>
                                                <p>📅 Jan 5 - Jan 10</p>
                                            </div>
                                            <div className="flex gap-1 mt-1.5">
                                                <span className="px-1.5 py-0.5 rounded-full border border-orange-400 text-[6px] sm:text-[7px] text-orange-600 font-medium">Dec 20-25</span>
                                                <span className="px-1.5 py-0.5 rounded-full border border-orange-400 text-[6px] sm:text-[7px] text-orange-600 font-medium">Dec 27-Jan 1</span>
                                            </div>
                                            <div className="text-right mt-1"><span className="text-[6px] text-slate-400">8:31 ✓✓</span></div>
                                        </div>
                                    </div>
                                </div>
                                {/* Message Input Bar */}
                                <div className="bg-white px-1.5 sm:px-2 py-1.5 flex items-center gap-1.5 border-t border-slate-200">
                                    <span className="text-[10px] sm:text-sm">😊</span>
                                    <div className="flex-1 bg-slate-100 rounded-full px-2 py-1">
                                        <p className="text-[7px] sm:text-[8px] text-slate-400">Type a message...</p>
                                    </div>
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#25d366] flex items-center justify-center">
                                        <span className="text-white text-[8px] sm:text-[10px]">🎤</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Phone (main, straight) - Voice Agent Studio */}
                        <div className="hero-phone-main relative z-20">
                            <div className="w-[160px] sm:w-[250px] md:w-[300px] h-[320px] sm:h-[490px] md:h-[580px] rounded-[30px] sm:rounded-[44px] border-[3px] sm:border-[5px] border-[#1d1d1f] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col relative">
                                {/* Dynamic Island */}
                                <div className="absolute top-[4px] sm:top-[7px] left-1/2 -translate-x-1/2 z-20 w-[45px] sm:w-[75px] h-[11px] sm:h-[20px] bg-[#1d1d1f] rounded-full" />
                                {/* Content area with top padding for Dynamic Island */}
                                <div className="flex flex-col items-center flex-1 pt-5 sm:pt-10 px-1.5 sm:px-5 pb-1.5 sm:pb-4 space-y-1.5 sm:space-y-4">
                                    {/* Header badge */}
                                    <div className="w-full flex items-center justify-between rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 px-2 sm:px-4 py-1.5 sm:py-2.5">
                                        <span className="text-[8px] sm:text-sm font-semibold text-indigo-700">Voice Agent Studio</span>
                                        <div className="flex items-center gap-1">
                                            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                            <span className="text-[7px] sm:text-[10px] text-indigo-600 font-medium">Ready</span>
                                        </div>
                                    </div>
                                    {/* Main message */}
                                    <div className="w-full rounded-xl sm:rounded-2xl bg-white border border-slate-100 p-2 sm:p-4 text-center">
                                        <p className="text-[7px] sm:text-xs text-indigo-600 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">Zero Effort</p>
                                        <p className="text-[13px] sm:text-xl md:text-2xl font-bold leading-tight text-orange-600">Your voice bot, ready in hours.</p>
                                    </div>
                                    {/* Sound wave - purple palette */}
                                    <div className="w-full flex items-end justify-center gap-[2px] h-8 sm:h-16">
                                        {[
                                            { h: 0.3, c: 'bg-purple-300' }, { h: 0.5, c: 'bg-purple-400' }, { h: 0.8, c: 'bg-purple-500' },
                                            { h: 0.4, c: 'bg-purple-300' }, { h: 1, c: 'bg-purple-500' }, { h: 0.6, c: 'bg-purple-400' },
                                            { h: 0.9, c: 'bg-purple-500' }, { h: 0.3, c: 'bg-purple-300' }, { h: 0.7, c: 'bg-purple-400' },
                                            { h: 1, c: 'bg-purple-500' }, { h: 0.5, c: 'bg-purple-400' }, { h: 0.8, c: 'bg-purple-500' },
                                            { h: 0.4, c: 'bg-purple-300' }, { h: 0.9, c: 'bg-purple-500' }, { h: 0.6, c: 'bg-purple-400' },
                                            { h: 0.3, c: 'bg-purple-300' }, { h: 0.7, c: 'bg-purple-400' }, { h: 0.5, c: 'bg-purple-300' },
                                            { h: 1, c: 'bg-purple-500' }, { h: 0.4, c: 'bg-purple-400' },
                                        ].map((bar, i) => (
                                            <div key={i} className={`w-[2px] sm:w-[3px] rounded-full ${bar.c}`} style={{ height: `${bar.h * 100}%`, opacity: 0.85 }} />
                                        ))}
                                    </div>
                                    {/* Steps */}
                                    <div className="w-full grid grid-cols-2 gap-1.5 sm:gap-2.5">
                                        <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 p-1.5 sm:p-3 text-center">
                                            <p className="text-[7px] sm:text-[10px] text-indigo-600 uppercase font-bold tracking-wider">Step 1</p>
                                            <p className="mt-0.5 text-[8px] sm:text-xs font-semibold text-purple-700">Share needs</p>
                                        </div>
                                        <div className="rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 p-1.5 sm:p-3 text-center">
                                            <p className="text-[7px] sm:text-[10px] text-indigo-600 uppercase font-bold tracking-wider">Step 2</p>
                                            <p className="mt-0.5 text-[8px] sm:text-xs font-semibold text-purple-700">We build it</p>
                                        </div>
                                    </div>
                                    {/* Bottom CTA */}
                                    <div className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-2 sm:p-4 text-white text-center shadow-md shadow-orange-500/20">
                                        <p className="text-[7px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.15em]">No Code Needed</p>
                                        <p className="mt-0.5 text-[11px] sm:text-base font-bold">Just tell us & go live 🚀</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating badges */}
                        <div className="hidden sm:block absolute left-[8%] lg:left-[14%] top-20 hero-badge-float">
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg shadow-slate-100/30">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <PhoneCall className="h-4 w-4 text-orange-500" />
                                    50K+ calls automated
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block absolute right-[8%] lg:right-[14%] top-32 hero-badge-float-2">
                            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg shadow-slate-100/30">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <MessageSquare className="h-4 w-4 text-orange-500" />
                                    50K+ happy users
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block absolute right-[10%] bottom-28 hero-badge-float">
                            <div className="rounded-2xl border border-orange-100 bg-white px-4 py-2.5 shadow-lg shadow-orange-100/30">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <CheckCircle className="h-4 w-4 text-orange-500" />
                                    99.9% uptime
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom: CTAs */}
                    <div className="text-center mt-10 sm:mt-14 space-y-6 hero-slide-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                            <a
                                href="/contact"
                                className="group px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 text-sm btn-glow"
                            >
                                Get Started Free
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </a>
                            <a
                                href="/contact"
                                className="group px-8 py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/30 flex items-center justify-center gap-2 text-sm"
                            >
                                Schedule a Demo
                            </a>
                        </div>
                    </div>
                </div>

            </section>

            {/* Dashboard Showcase Section */}
            <DashboardShowcase />

            {/* WhatsApp Chatbot Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* LEFT: iPhone WhatsApp Mockup */}
                        <div className="flex justify-center">
                            <div className="relative">
                                {/* Annotation labels */}
                                <div className="hidden lg:block absolute -left-44 top-[22%] text-right">
                                    <p className="text-sm font-semibold text-slate-700">Branding & Logo</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="h-px w-16 bg-orange-300 inline-block" />
                                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                                    </div>
                                </div>
                                <div className="hidden lg:block absolute -left-48 top-[55%] text-right">
                                    <p className="text-sm font-semibold text-slate-700">Rich Media, Chips</p>
                                    <p className="text-sm font-semibold text-slate-700">& Carousels</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="h-px w-16 bg-orange-300 inline-block" />
                                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                                    </div>
                                </div>
                                <div className="hidden lg:block absolute -left-44 bottom-[15%] text-right">
                                    <p className="text-sm font-semibold text-slate-700">Suggested Actions</p>
                                    <div className="flex items-center justify-end gap-1 mt-1">
                                        <span className="h-px w-16 bg-orange-300 inline-block" style={{ borderStyle: 'dashed' }} />
                                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                                    </div>
                                </div>
                                <div className="hidden lg:block absolute -right-44 top-[22%] text-left">
                                    <p className="text-sm font-semibold text-slate-700">Verified Sender</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                                        <span className="h-px w-16 bg-orange-300 inline-block" />
                                    </div>
                                </div>
                                <div className="hidden lg:block absolute -right-48 bottom-[18%] text-left">
                                    <p className="text-sm font-semibold text-slate-700">Delivery and</p>
                                    <p className="text-sm font-semibold text-slate-700">Read Receipts</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                                        <span className="h-px w-16 bg-orange-300 inline-block" />
                                    </div>
                                </div>

                                {/* iPhone Frame */}
                                <div className="w-[280px] sm:w-[300px] rounded-[40px] border-[6px] border-slate-800 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden">
                                    {/* Status bar */}
                                    <div className="bg-[#075e54] px-4 pt-2 pb-0">
                                        <div className="flex items-center justify-between text-white text-[10px] mb-2">
                                            <span>9:41</span>
                                            <div className="mx-auto w-20 h-5 rounded-full bg-slate-900" />
                                            <div className="flex items-center gap-1">
                                                <span>5G</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* WhatsApp header */}
                                    <div className="bg-[#075e54] px-3 py-2 flex items-center gap-2">
                                        <ArrowRight className="h-4 w-4 text-white rotate-180" />
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">D</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-white">DigitalBot AI</p>
                                            <p className="text-[10px] text-orange-200 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-orange-300" />
                                                Verified Business
                                            </p>
                                        </div>
                                        <PhoneCall className="h-4 w-4 text-white/80" />
                                    </div>
                                    {/* Chat messages */}
                                    <div className="bg-[#efeae2] p-3 space-y-2 min-h-[380px] sm:min-h-[420px]">
                                        <p className="text-center text-[9px] text-slate-500 bg-white/70 rounded-full px-3 py-0.5 mx-auto w-fit">Today 8:30 AM</p>
                                        {/* Bot message with rich content */}
                                        <div className="flex justify-start">
                                            <div className="max-w-[85%] bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm">
                                                <p className="text-[11px] text-slate-800 font-medium">The holiday season is almost here!</p>
                                                <p className="text-[11px] text-slate-600 mt-1">Start planning your dream getaway with special <span className="font-bold text-slate-800">30% discount</span></p>
                                                {/* Image carousel */}
                                                <div className="grid grid-cols-2 gap-1.5 mt-2">
                                                    <div className="rounded-lg overflow-hidden bg-slate-100">
                                                        <div className="h-16 bg-gradient-to-br from-orange-300 to-orange-500 flex items-end p-1.5">
                                                            <span className="text-[9px] text-white font-bold bg-black/30 px-1.5 py-0.5 rounded">🏔️ Manali</span>
                                                        </div>
                                                        <div className="p-1.5 space-y-1">
                                                            <p className="text-[9px] font-bold text-slate-700">Manali</p>
                                                            <p className="text-[8px] text-orange-600 font-medium">📍 Book Now</p>
                                                            <p className="text-[8px] text-orange-500 font-medium">📞 Call Agent</p>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-lg overflow-hidden bg-slate-100">
                                                        <div className="h-16 bg-gradient-to-br from-orange-300 to-orange-500 flex items-end p-1.5">
                                                            <span className="text-[9px] text-white font-bold bg-black/30 px-1.5 py-0.5 rounded">🏖️ Beach</span>
                                                        </div>
                                                        <div className="p-1.5 space-y-1">
                                                            <p className="text-[9px] font-bold text-slate-700">Lakshadweep</p>
                                                            <p className="text-[8px] text-orange-600 font-medium">📍 Book Now</p>
                                                            <p className="text-[8px] text-orange-500 font-medium">📞 Call Agent</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-[8px] text-slate-400 text-right mt-1">8:30 ✓✓</p>
                                            </div>
                                        </div>
                                        {/* User reply */}
                                        <div className="flex justify-end">
                                            <div className="max-w-[75%] bg-[#dcf8c6] rounded-xl rounded-tr-none px-3 py-2 shadow-sm">
                                                <p className="text-[11px] text-slate-800">I&apos;d love to book Manali! What dates are available?</p>
                                                <p className="text-[8px] text-slate-400 text-right mt-0.5">8:31 ✓✓</p>
                                            </div>
                                        </div>
                                        {/* Bot reply */}
                                        <div className="flex justify-start">
                                            <div className="max-w-[85%] bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm">
                                                <p className="text-[11px] text-slate-800">Great choice! 🏔️ Here are the available dates for Manali:</p>
                                                <p className="text-[11px] text-slate-600 mt-1">📅 Dec 20 - Dec 25<br/>📅 Dec 27 - Jan 1<br/>📅 Jan 5 - Jan 10</p>
                                                <div className="flex gap-1.5 mt-2">
                                                    <span className="text-[9px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-full font-medium">Dec 20-25</span>
                                                    <span className="text-[9px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-1 rounded-full font-medium">Dec 27-Jan 1</span>
                                                </div>
                                                <p className="text-[8px] text-slate-400 text-right mt-1">8:31 ✓✓</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Input bar */}
                                    <div className="bg-[#efeae2] px-2 pb-3">
                                        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1.5">
                                            <span className="text-lg">😊</span>
                                            <span className="flex-1 text-[11px] text-slate-400">Type a message...</span>
                                            <div className="h-7 w-7 rounded-full bg-[#075e54] flex items-center justify-center">
                                                <Mic className="h-3.5 w-3.5 text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Get Customized Chatbot */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <MessageSquare className="h-4 w-4 text-orange-600" />
                                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">WhatsApp Chatbot</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                                Get Your{' '}
                                <span className="text-orange-500">Customized Chatbot</span>
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                                Deliver interactive messages directly to your customer&apos;s WhatsApp. Rich media, carousels, quick replies, and verified sender — all automated with AI.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: CheckCircle, text: 'Rich media with images, carousels & buttons' },
                                    { icon: CheckCircle, text: 'Verified business sender with branding' },
                                    { icon: CheckCircle, text: 'Delivery & read receipts tracking' },
                                    { icon: CheckCircle, text: 'Human-like AI conversations 24/7' },
                                    { icon: CheckCircle, text: 'Suggested quick actions & smart replies' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-600">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link href="/contact#contact-form" className="group px-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm">
                                    Get Started
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link href="/contact" className="px-7 py-3 text-slate-600 font-medium rounded-xl border border-slate-200 hover:border-orange-200 hover:text-orange-600 transition-all text-sm text-center">
                                    Book a Free Demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Voice AI Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* LEFT: Voice AI Content */}
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <Mic className="h-4 w-4 text-orange-600" />
                                <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">AI Voice Agent</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                                How{' '}
                                <span className="text-orange-500">Voice AI</span>{' '}
                                Transforms Your Business
                            </h2>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                                Your AI voice agent handles calls, books appointments, qualifies leads, and provides customer support — all while sounding completely natural and human-like.
                            </p>
                            <div className="space-y-3">
                                {[
                                    { icon: CheckCircle, text: 'Handle unlimited concurrent calls naturally' },
                                    { icon: CheckCircle, text: 'Book & reschedule appointments with calendar sync' },
                                    { icon: CheckCircle, text: 'Qualify leads and route to your sales team' },
                                    { icon: CheckCircle, text: '24/7 customer support — never miss a call' },
                                    { icon: CheckCircle, text: 'Real-time transcription & call analytics' },
                                    { icon: CheckCircle, text: '50+ languages with native-quality voice' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                        <span className="text-sm text-slate-800">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Link href="/contact#contact-form" className="group px-7 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 text-sm">
                                    Try Voice AI Free
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link href="/contact" className="px-7 py-3 text-slate-900 font-medium rounded-xl border border-slate-300 hover:border-orange-300 hover:text-orange-600 transition-all text-sm text-center">
                                    Book a Free Demo
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT: Voice Agent Image */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-[680px]">
                                <div className="absolute -inset-6 bg-gradient-to-r from-orange-100/60 to-orange-50/40 rounded-3xl blur-3xl" />
                                <img
                                    src="/images/telecom_i98unj.webp"
                                    alt="AI Voice Agent - Call Handling"
                                    className="relative w-full h-auto rounded-2xl drop-shadow-2xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Voice Garden - Service Samples */}
            <section className="py-16 sm:py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-5 py-2 rounded-full mb-6">
                            <span className="text-sm font-semibold text-slate-700">Voice Garden</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-5 leading-tight">
                            Leverage AI voice call agents who sound<br className="hidden sm:block" /> and act like real people
                        </h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                            Handle your phone calls 24/7 with human-like voices and intelligent speech detection for realistic customer interactions.
                        </p>
                    </div>

                    {/* Service Sample Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {services.slice(0, 4).map((service, i) => (
                            <div key={i} className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-[3/4]">
                                {/* Person image as background */}
                                <img
                                    src={service.img}
                                    alt={service.title}
                                    className="absolute inset-0 w-full h-full object-cover object-top"
                                    loading="lazy"
                                />
                                {/* Bottom gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                {/* Play button centered */}
                                <button
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    onClick={() => {
                                        const audio = new Audio(service.audio);
                                        audio.play();
                                    }}
                                    aria-label={`Play ${service.title} sample`}
                                >
                                    <div className="h-14 w-14 rounded-full bg-orange-400/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500/90 transition-all shadow-lg">
                                        <svg className="h-6 w-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Title at bottom */}
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-base font-bold text-white drop-shadow-lg">{service.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Platform Features Showcase */}
            <PlatformFeatures />


                        {/* DigitalBot Features Grid (updated for DigitalBot advantages) */}
                        <section className="py-14 bg-[#f7f7fd]">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12">
                                    The DigitalBot <span className="text-orange-500">Advantage</span>
                                </h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Feature Card 1 */}
                                    <div className="rounded-3xl bg-[#f3f0ff] p-8 flex flex-col justify-between min-h-[320px] shadow-sm">
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">24/7 AI Customer Support</h3>
                                            <div className="text-lg text-gray-600 mb-2">Never miss a call or message. DigitalBot works around the clock for your business.</div>
                                        </div>
                                        <div className="flex justify-center items-end mt-6">
                                            <img src="/images/woman-laptop.avif" alt="24/7 Support" className="w-40 h-40 object-cover rounded-2xl" />
                                        </div>
                                    </div>

                                    {/* Feature Card 2 */}
                                    <div className="rounded-3xl bg-white p-8 flex flex-col justify-between min-h-[320px] shadow-sm">
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Omnichannel Engagement</h3>
                                            <div className="text-lg text-gray-600 mb-2">Voice, WhatsApp, SMS, and web — all handled simultaneously by one AI.</div>
                                        </div>
                                        <div className="flex justify-center items-end mt-6">
                                            <div className="w-40 h-28 bg-gradient-to-br from-[#a259ff] to-[#00dbde] rounded-2xl flex items-center justify-center">
                                                <span className="text-white text-xl font-bold">Voice + WhatsApp</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Feature Card 3 */}
                                    <div className="rounded-3xl bg-white p-8 flex flex-col justify-between min-h-[320px] shadow-sm">
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Instant Deployment</h3>
                                            <div className="text-lg text-gray-600 mb-2">Go live in minutes with zero-code onboarding and seamless integration.</div>
                                        </div>
                                        <div className="flex justify-center items-end mt-6">
                                            <svg width="56" height="56" fill="none" stroke="#a259ff" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                        </div>
                                    </div>

                                    {/* Feature Card 4 */}
                                    <div className="rounded-3xl bg-[#e6fcf5] p-8 flex flex-col justify-between min-h-[320px] shadow-sm">
                                        <div>
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4">Real-time Analytics</h3>
                                            <div className="text-lg text-gray-600 mb-2">Track every conversation, call, and customer interaction with live dashboards.</div>
                                        </div>
                                        <div className="flex justify-center items-end mt-6">
                                            <div className="w-28 h-28 bg-gradient-to-br from-[#00dbde] to-[#a259ff] rounded-full flex items-center justify-center">
                                                <span className="text-white text-xl font-bold">Analytics</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


        </>
    )
}
