"use client"
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Award, BarChart3, Bot, Calendar, CalendarCheck, CheckCircle, Clock, CreditCard, FileText, Headphones, LayoutDashboard, Megaphone, MessageSquare, Mic, Phone, PhoneCall, PlusCircle, Send, Shield, Stethoscope, TrendingUp, User, Users, Zap } from "lucide-react";
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
        sidebarItems: ['Dashboard', 'Calls', 'Billing'],
    },
    {
        id: 'doctor',
        label: 'Doctor Appointments',
        icon: Calendar,
        assistantName: 'Dr. Appointment Bot',
        assistantId: 'ID:23569842',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Total Appointments', value: '1,425', icon: Calendar, color: 'text-orange-500' },
            { label: 'Active Doctors', value: '12', icon: Users, color: 'text-orange-500' },
            { label: "Today's Schedule", value: '28', icon: Clock, color: 'text-orange-500' },
            { label: 'AI Auto-Created', value: '847', icon: Zap, color: 'text-orange-500' },
        ],
        chartData: [38, 62, 45, 78, 55, 85, 70, 60, 90, 73],
        donutPercent: 84,
        donutStats: [
            { label: 'Total Calls', value: '1,425 calls', color: 'bg-orange-500' },
            { label: 'Total minute use', value: '4,856 min', color: 'bg-orange-400' },
            { label: 'Avg. call duration', value: '3,145 min', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Calls', 'Billing', 'Appointments', 'Book Appointment', 'Doctors', 'Availability'],
        appointments: [
            { name: 'Rahul Sharma', phone: '+91 987-654-3210', doctor: 'Dr. Priya Patel', date: 'Jun 15, 2025', time: '10:30 AM', status: 'confirmed', purpose: 'Regular health checkup', source: 'ai', confidence: 92 },
            { name: 'Anjali Verma', phone: '+91 876-543-2109', doctor: 'Dr. Amit Kumar', date: 'Jun 15, 2025', time: '11:00 AM', status: 'scheduled', purpose: 'Follow-up consultation', source: 'ai', confidence: 88 },
            { name: 'Vikram Singh', phone: '+91 765-432-1098', doctor: 'Dr. Priya Patel', date: 'Jun 15, 2025', time: '2:00 PM', status: 'completed', purpose: 'Dental cleaning', source: 'manual', confidence: 0 },
            { name: 'Meera Joshi', phone: '+91 654-321-0987', doctor: 'Dr. Sneha Rao', date: 'Jun 16, 2025', time: '9:30 AM', status: 'cancelled', purpose: 'Eye examination', source: 'ai', confidence: 95 },
        ],
    },
    {
        id: 'leads',
        label: 'Lead Generation',
        icon: TrendingUp,
        assistantName: 'Lead Gen Assistant',
        assistantId: 'ID:45782310',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Total Calls', value: '9,630', icon: PhoneCall, color: 'text-orange-500' },
            { label: 'Leads Captured', value: '3,210', icon: Users, color: 'text-orange-500' },
            { label: 'Conversion Rate', value: '34%', icon: TrendingUp, color: 'text-orange-500' },
        ],
        chartData: [52, 40, 68, 55, 82, 63, 75, 90, 48, 86],
        donutPercent: 78,
        donutStats: [
            { label: 'Qualified Leads', value: '2,504 leads', color: 'bg-orange-500' },
            { label: 'Follow ups', value: '706 pending', color: 'bg-orange-400' },
            { label: 'Conversion rate', value: '34%', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Calls', 'Billing', 'Leads', 'Campaigns'],
        leads: [
            { id: 'a3f2c891', from: '+91 987-654-3210', to: '+91 470-504-3155', duration: '4:32', timeAgo: '2h ago', isLead: true, name: 'Priya Enterprises', interest: 'Voice AI Solution', confidence: 94, need: 'Automated customer support for 500+ daily calls' },
            { id: 'b7d4e562', from: '+91 876-543-2109', to: '+91 470-504-3155', duration: '2:15', timeAgo: '3h ago', isLead: true, name: 'Medico Health', interest: 'Appointment Booking', confidence: 87, need: 'AI-powered scheduling for multi-location clinic' },
            { id: 'c1e8f234', from: '+91 765-432-1098', to: '+91 470-504-3155', duration: '1:08', timeAgo: '5h ago', isLead: false, name: '', interest: '', confidence: 0, need: '' },
            { id: 'd5g9h678', from: '+91 654-321-0987', to: '+91 470-504-3155', duration: '6:45', timeAgo: '6h ago', isLead: true, name: 'TechNova Solutions', interest: 'Lead Gen AI Agent', confidence: 91, need: 'Outbound sales automation for B2B pipeline' },
        ],
    },
    {
        id: 'support',
        label: 'Customer Support',
        icon: Headphones,
        assistantName: 'Support Assistant',
        assistantId: 'ID:67891234',
        mobNumber: '+1 470 504 3155',
        stats: [
            { label: 'Active Campaigns', value: '8', icon: Zap, color: 'text-orange-500' },
            { label: 'Total Contacts', value: '5,840', icon: Users, color: 'text-orange-500' },
            { label: 'Success Rate', value: '96%', icon: Award, color: 'text-orange-500' },
        ],
        chartData: [60, 78, 52, 88, 70, 95, 65, 82, 73, 90],
        donutPercent: 96,
        donutStats: [
            { label: 'Resolved', value: '5,840 tickets', color: 'bg-orange-500' },
            { label: 'Escalated', value: '243 tickets', color: 'bg-orange-400' },
            { label: 'Avg. resolution', value: '2.8 min', color: 'bg-orange-500' },
        ],
        sidebarItems: ['Dashboard', 'Calls', 'Billing', 'Support Campaigns', 'AI Agents'],
        campaigns: [
            { name: 'Rent Reminder - June', type: 'rent-reminder', status: 'active', total: 450, completed: 312, failed: 18, pending: 120, successRate: 94.5, avgDuration: '2:45' },
            { name: 'Appointment Follow-up', type: 'appointment-reminder', status: 'active', total: 280, completed: 195, failed: 8, pending: 77, successRate: 96.1, avgDuration: '3:12' },
            { name: 'Customer Survey Q2', type: 'survey', status: 'completed', total: 1200, completed: 1080, failed: 72, pending: 0, successRate: 93.8, avgDuration: '4:30' },
            { name: 'Payment Reminder', type: 'payment-reminder', status: 'paused', total: 350, completed: 142, failed: 12, pending: 196, successRate: 92.2, avgDuration: '2:15' },
        ],
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
        sidebarItems: ['Dashboard', 'Calls', 'Billing', 'Appointments', 'Book Appointment', 'Doctors', 'Availability', 'Bot Sessions', 'Templates', 'Patient Contacts'],
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
    Calls: PhoneCall,
    Billing: CreditCard,
    Appointments: Calendar,
    'Book Appointment': PlusCircle,
    Doctors: Stethoscope,
    Availability: CalendarCheck,
    Leads: Users,
    Campaigns: Megaphone,
    'Support Campaigns': Megaphone,
    'AI Agents': Bot,
    'Bot Sessions': MessageSquare,
    Templates: FileText,
    'Patient Contacts': Send,
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
                                <div className={`grid gap-3 sm:gap-4 mb-5 ${tab.id === 'doctor' ? 'grid-cols-4' : 'grid-cols-3'}`}>
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

                                {/* === DOCTOR APPOINTMENTS TAB === */}
                                {tab.id === 'doctor' ? (
                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                        {/* Search & Filter Bar */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex-1 relative">
                                                <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                <div className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-400 bg-white">Search patient name...</div>
                                            </div>
                                            <div className="px-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-500 font-medium bg-white">All Status ▼</div>
                                            <div className="px-3 py-2 border border-slate-200 rounded-lg text-[11px] text-slate-500 font-medium bg-white">All Months ▼</div>
                                        </div>
                                        {/* Appointment Cards */}
                                        {(tab as any).appointments?.map((apt: any, i: number) => {
                                            const statusStyles: Record<string, string> = {
                                                confirmed: 'bg-green-100 text-green-700 border-green-300',
                                                scheduled: 'bg-orange-100 text-orange-700 border-orange-300',
                                                completed: 'bg-purple-100 text-purple-700 border-purple-300',
                                                cancelled: 'bg-red-100 text-red-700 border-red-300',
                                            };
                                            return (
                                                <div key={i} className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-xl border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer">
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-md">
                                                                <User className="w-5 h-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-slate-900">{apt.name}</h4>
                                                                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                                                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{apt.phone}</span>
                                                                        <button className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded text-[9px] font-bold">
                                                                            <Bot className="w-2.5 h-2.5" /> Follow-up
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${statusStyles[apt.status] || 'bg-slate-100 text-slate-600'}`}>{apt.status}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                                {apt.source === 'ai' && (
                                                                    <>
                                                                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-[9px] font-bold"><Zap className="w-2.5 h-2.5" /> AI Auto-Created</span>
                                                                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[9px] font-bold">{apt.confidence}% Confidence</span>
                                                                    </>
                                                                )}
                                                                {apt.source === 'manual' && (
                                                                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold">Manual</span>
                                                                )}
                                                            </div>
                                                            <div className="flex gap-2 mb-2">
                                                                <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-md">
                                                                    <Calendar className="w-3 h-3 text-orange-600" />
                                                                    <span className="text-[10px] font-semibold text-slate-700">{apt.date}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-md">
                                                                    <Clock className="w-3 h-3 text-orange-600" />
                                                                    <span className="text-[10px] font-semibold text-slate-700">{apt.time}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded-md">
                                                                    <Stethoscope className="w-3 h-3 text-blue-600" />
                                                                    <span className="text-[10px] font-semibold text-slate-700">{apt.doctor}</span>
                                                                </div>
                                                            </div>
                                                            <div className="bg-slate-50 px-3 py-2 rounded-md border border-slate-200">
                                                                <div className="flex items-start gap-1.5">
                                                                    <FileText className="w-3 h-3 text-slate-400 mt-0.5" />
                                                                    <div>
                                                                        <span className="text-[9px] text-slate-400 font-medium">Purpose</span>
                                                                        <p className="text-[11px] text-slate-700 font-medium">{apt.purpose}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                /* === LEAD GENERATION TAB === */
                                ) : tab.id === 'leads' ? (
                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                        {(tab as any).leads?.map((lead: any, i: number) => (
                                            <div key={i} className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                                                lead.isLead ? 'border-l-4 border-l-green-400 bg-gradient-to-r from-green-50/40 to-white' : 'border-l-4 border-l-slate-300 border-slate-200'
                                            }`}>
                                                <div className="p-3.5">
                                                    <div className="flex items-center gap-3 mb-2.5">
                                                        <span className="text-[9px] font-mono text-white bg-slate-700 px-2 py-0.5 rounded">ID: {lead.id}</span>
                                                        <span className="text-[10px] text-slate-600 font-medium">{lead.from} → {lead.to}</span>
                                                        <span className="text-[10px] text-slate-400">{lead.timeAgo}</span>
                                                        <span className="text-[10px] font-medium text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">{lead.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {lead.isLead ? (
                                                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-medium">
                                                                <CheckCircle className="h-3 w-3" /> Analyzed
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-medium">
                                                                <Clock className="h-3 w-3" /> Pending Analysis
                                                            </div>
                                                        )}
                                                    </div>
                                                    {lead.isLead && (
                                                        <div className="bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg p-3 border border-green-200">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                                                <span className="text-[11px] font-bold text-green-800">Lead Identified</span>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-[10px]">
                                                                <div>
                                                                    <span className="text-sky-600 font-medium">Customer:</span>
                                                                    <p className="text-green-800 font-semibold">{lead.name}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sky-600 font-medium">Confidence:</span>
                                                                    <p className="text-green-800 font-semibold">{lead.confidence}%</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sky-600 font-medium">Interest:</span>
                                                                    <p className="text-green-800 font-semibold">{lead.interest}</p>
                                                                </div>
                                                                <div>
                                                                    <span className="text-sky-600 font-medium">Need:</span>
                                                                    <p className="text-green-800 font-semibold truncate">{lead.need}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                /* === CUSTOMER SUPPORT TAB === */
                                ) : tab.id === 'support' ? (
                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                        {(tab as any).campaigns?.map((camp: any, i: number) => {
                                            const statusMap: Record<string, { bg: string; text: string; dot: string }> = {
                                                active: { bg: 'bg-green-50 border-green-200', text: 'text-green-700', dot: 'bg-green-500' },
                                                completed: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500' },
                                                paused: { bg: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-700', dot: 'bg-yellow-500' },
                                            };
                                            const st = statusMap[camp.status] || statusMap.active;
                                            const progressPct = Math.round((camp.completed / camp.total) * 100);
                                            return (
                                                <div key={i} className="bg-white rounded-xl border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer p-4">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                                                                <Headphones className="w-4 h-4 text-white" />
                                                            </div>
                                                            <div>
                                                                <h4 className="text-sm font-bold text-slate-900">{camp.name}</h4>
                                                                <span className="text-[10px] text-slate-400 capitalize">{camp.type.replace('-', ' ')}</span>
                                                            </div>
                                                        </div>
                                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[9px] font-bold capitalize ${st.bg} ${st.text}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${camp.status === 'active' ? 'animate-pulse' : ''}`} />
                                                            {camp.status}
                                                        </div>
                                                    </div>
                                                    {/* Progress Bar */}
                                                    <div className="mb-3">
                                                        <div className="flex items-center justify-between text-[10px] mb-1">
                                                            <span className="text-slate-500 font-medium">Progress</span>
                                                            <span className="font-bold text-slate-700">{progressPct}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 rounded-full h-2">
                                                            <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                                                        </div>
                                                    </div>
                                                    {/* Stats Row */}
                                                    <div className="grid grid-cols-4 gap-2">
                                                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                                                            <p className="text-[9px] text-slate-400 font-medium">Total</p>
                                                            <p className="text-sm font-bold text-slate-800">{camp.total}</p>
                                                        </div>
                                                        <div className="bg-green-50 rounded-lg p-2 text-center">
                                                            <p className="text-[9px] text-green-600 font-medium">Done</p>
                                                            <p className="text-sm font-bold text-green-700">{camp.completed}</p>
                                                        </div>
                                                        <div className="bg-red-50 rounded-lg p-2 text-center">
                                                            <p className="text-[9px] text-red-500 font-medium">Failed</p>
                                                            <p className="text-sm font-bold text-red-600">{camp.failed}</p>
                                                        </div>
                                                        <div className="bg-orange-50 rounded-lg p-2 text-center">
                                                            <p className="text-[9px] text-orange-500 font-medium">Pending</p>
                                                            <p className="text-sm font-bold text-orange-600">{camp.pending}</p>
                                                        </div>
                                                    </div>
                                                    {/* Footer Stats */}
                                                    <div className="flex items-center gap-4 mt-2.5 pt-2.5 border-t border-slate-100">
                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Award className="w-3 h-3 text-orange-500" /> Success: <strong className="text-slate-700">{camp.successRate}%</strong></span>
                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3 text-orange-500" /> Avg: <strong className="text-slate-700">{camp.avgDuration}</strong></span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                /* === WHATSAPP CHATBOT TAB === */
                                ) : isWhatsApp ? (
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
                                            <div className="p-3 space-y-2 max-h-[220px] sm:max-h-[250px] overflow-y-auto" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cdefs%3E%3Cpattern id=\'p\' width=\'20\' height=\'20\' patternUnits=\'userSpaceOnUse\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'0.8\' fill=\'%23d5ccb9\' opacity=\'0.3\'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width=\'200\' height=\'200\' fill=\'%23efeae2\'/%3E%3Crect width=\'200\' height=\'200\' fill=\'url(%23p)\'/%3E%3C/svg%3E")' }}>
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

                                /* === GENERAL DASHBOARD TAB (default) === */
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

// Business chatbot showcase data
const bizChats = {
    travel: [
        { from: 'bot', text: 'Welcome to TravelBot! 🌍 Where would you like to go?' },
        { from: 'user', text: 'I want to plan a trip to Manali' },
        { from: 'bot', text: 'Great choice! 🏔️ Manali packages start at ₹8,999. Dates?' },
        { from: 'user', text: 'Dec 20 - Dec 25 for 2 people' },
        { from: 'bot', text: '✅ Found 3 packages! Deluxe Resort with breakfast at ₹12,499/person. Shall I book?' },
        { from: 'user', text: 'Yes, book it!' },
        { from: 'bot', text: '🎉 Booking confirmed! Ref: TB-2847. Payment link sent.' },
    ],
    doctor: [
        { from: 'bot', text: 'Hello! 👋 Welcome to MedCare. How can I help you today?' },
        { from: 'user', text: 'I need an appointment with a dentist' },
        { from: 'bot', text: 'Sure! Dr. Sharma is available tomorrow at 10 AM & 3 PM. Which works?' },
        { from: 'user', text: '3 PM works' },
        { from: 'bot', text: '✅ Appointment booked with Dr. Sharma at 3:00 PM, Clinic: Sector 15.' },
        { from: 'user', text: 'Can you send me a reminder?' },
        { from: 'bot', text: '📩 Reminder set! You\'ll get a WhatsApp alert 1 hour before.' },
    ],
    salon: [
        { from: 'bot', text: 'Hey! 💇 Welcome to StyleHub. Book your next look!' },
        { from: 'user', text: 'I want a haircut and beard trim' },
        { from: 'bot', text: 'Haircut + Beard Trim combo: ₹399. Available slots today: 11 AM, 2 PM, 5 PM' },
        { from: 'user', text: '5 PM please' },
        { from: 'bot', text: '✅ Booked! Stylist: Raj at 5:00 PM. See you at StyleHub MG Road!' },
        { from: 'user', text: 'Can I add a facial too?' },
        { from: 'bot', text: 'Added! New total: ₹799. Updated booking confirmed. ✨' },
    ],
    event: [
        { from: 'bot', text: 'Hi! 🎫 Welcome to EventHub. What event are you looking for?' },
        { from: 'user', text: 'Any concerts this weekend?' },
        { from: 'bot', text: '🎵 2 events found:\n1. Arijit Singh Live - Sat 7PM\n2. Sunburn Festival - Sun 4PM' },
        { from: 'user', text: '2 tickets for Arijit Singh please' },
        { from: 'bot', text: '🎟️ 2x VIP tickets reserved! Total: ₹2,998. Pay within 10 min to confirm.' },
        { from: 'user', text: 'Done, paid!' },
        { from: 'bot', text: '✅ Confirmed! E-tickets sent. Gate 3, Row B, Seats 14-15. Enjoy! 🎶' },
    ],
    support: [
        { from: 'bot', text: 'Hello! 🎧 How can I assist you today?' },
        { from: 'user', text: 'My order #4521 hasn\'t arrived yet' },
        { from: 'bot', text: 'Let me check... 📦 Order #4521 is with the courier. ETA: Today by 6 PM.' },
        { from: 'user', text: 'Can I change the delivery address?' },
        { from: 'bot', text: 'Sure! Please share your new delivery address.' },
        { from: 'user', text: '42, Park Street, Kolkata' },
        { from: 'bot', text: '✅ Address updated! Delivery rescheduled to tomorrow by 12 PM.' },
    ],
    restaurant: [
        { from: 'bot', text: 'Welcome to FoodieSpot! 🍽️ Reserve a table or order delivery?' },
        { from: 'user', text: 'Table for 4 tonight at 8 PM' },
        { from: 'bot', text: '✅ Table for 4 at 8:00 PM confirmed! Would you like to pre-order?' },
        { from: 'user', text: 'Yes, show me the specials' },
        { from: 'bot', text: '🔥 Today\'s specials:\n1. Butter Chicken - ₹349\n2. Paneer Tikka - ₹249' },
        { from: 'user', text: '2 Butter Chicken and 1 Biryani' },
        { from: 'bot', text: '🍛 Pre-order placed! Total: ₹997. Ready when you arrive at 8 PM!' },
    ],
    realestate: [
        { from: 'bot', text: 'Hi! 🏠 Looking to buy, rent, or sell property?' },
        { from: 'user', text: 'Looking for 2BHK apartments in Noida' },
        { from: 'bot', text: '🔍 Found 12 listings! Budget range?' },
        { from: 'user', text: '30-50 lakhs' },
        { from: 'bot', text: '🏢 Top 3 matches:\n1. Sector 75 - ₹35L\n2. Sector 137 - ₹42L\n3. Sector 150 - ₹48L' },
        { from: 'user', text: 'Schedule visit for Sector 137' },
        { from: 'bot', text: '✅ Site visit booked for tomorrow 11 AM. Agent: Mr. Verma will meet you!' },
    ],
    ecommerce: [
        { from: 'bot', text: 'Hey! 🛒 Welcome to ShopSmart. What are you looking for?' },
        { from: 'user', text: 'Wireless earbuds under 2000' },
        { from: 'bot', text: '🎧 Top picks:\n1. BoAt Airdopes - ₹1,299\n2. JBL Wave - ₹1,799' },
        { from: 'user', text: 'I\'ll take the JBL Wave' },
        { from: 'bot', text: '🛍️ Added to cart! Apply FIRST10 for 10% off. Proceed to pay?' },
        { from: 'user', text: 'Yes' },
        { from: 'bot', text: '✅ Order placed! ₹1,619 after discount. Delivery by Wed.' },
    ],
};

const bizVoiceLabels = {
    travel: 'Helping with trip booking...',
    doctor: 'Scheduling appointment...',
    salon: 'Booking your session...',
    event: 'Reserving your tickets...',
    support: 'Resolving your query...',
    restaurant: 'Taking your reservation...',
    realestate: 'Finding properties...',
    ecommerce: 'Processing your order...',
};

const bizTitles = {
    travel: 'AI Travel Agent on WhatsApp',
    doctor: 'AI-Powered Doctor Appointments',
    salon: 'Smart Salon & Barber Booking',
    event: 'Automated Event Ticket Booking',
    support: '24/7 AI Customer Support',
    restaurant: 'Restaurant Reservations & Orders',
    realestate: 'AI Real Estate Assistant',
    ecommerce: 'E-Commerce Shopping Assistant',
};

const bizDescriptions = {
    travel: 'Let customers browse destinations, compare packages, and book trips — all through WhatsApp and voice calls.',
    doctor: 'Patients can find doctors, book appointments, get reminders, and receive follow-ups automatically.',
    salon: 'Clients pick services, choose time slots, and confirm bookings instantly — no calls needed.',
    event: 'From discovery to tickets in hand — AI handles search, selection, payment, and e-ticket delivery.',
    support: 'Resolve queries instantly, track orders, process returns, and escalate complex cases to humans.',
    restaurant: 'Tables, takeaway, and pre-orders — your AI handles the full dining experience via chat.',
    realestate: 'AI matches buyers with properties, schedules site visits, and connects them with agents.',
    ecommerce: 'Product search, recommendations, cart management, and order tracking — all conversational.',
};

const bizFeatures = {
    travel: ['Instant package search & booking', 'Multi-destination itinerary planning', 'Payment collection via WhatsApp', 'Real-time flight & hotel updates', 'Post-trip feedback collection'],
    doctor: ['Find doctors by specialty & location', 'Smart slot management', 'Automated reminders & follow-ups', 'Prescription & report sharing', 'Emergency escalation support'],
    salon: ['Service menu with pricing', 'Stylist preference selection', 'Combo deals & offers', 'Loyalty points tracking', 'Review & rating collection'],
    event: ['Event discovery & recommendations', 'Seat selection & pricing', 'Group booking support', 'E-ticket delivery', 'Event day reminders & updates'],
    support: ['Order tracking & status updates', 'Return & refund processing', 'FAQ auto-resolution', 'Smart escalation to humans', 'CSAT survey after resolution'],
    restaurant: ['Table reservation with preferences', 'Full menu browsing', 'Takeaway & delivery orders', 'Special dietary accommodations', 'Loyalty rewards management'],
    realestate: ['Property search with filters', 'Virtual tour scheduling', 'EMI calculator integration', 'Document collection automation', 'Agent matching & scheduling'],
    ecommerce: ['Product search & recommendations', 'Cart & wishlist management', 'Order placement & tracking', 'Return & exchange handling', 'Personalized deal alerts'],
};

// Rich phone chat data with cards & chips for the iPhone mockup
const bizPhoneChats = {
    travel: [
        { from: 'bot', text: 'The holiday season is almost here! 🌍\nStart planning your dream getaway with special <b>30% discount</b>', cards: [
            { emoji: '🏔️', title: 'Manali', color: 'bg-gradient-to-br from-orange-300 to-orange-500' },
            { emoji: '🏖️', title: 'Beach', color: 'bg-gradient-to-br from-orange-300 to-orange-500' },
        ]},
        { from: 'user', text: "I'd love to book Manali! What dates are available?" },
        { from: 'bot', text: 'Great choice! 🏔️ Here are the available dates for Manali:\n📅 Dec 20 - Dec 25\n📅 Dec 27 - Jan 1\n📅 Jan 5 - Jan 10', chips: ['Dec 20-25', 'Dec 27-Jan 1'] },
        { from: 'user', text: 'Dec 20-25 works! How much for 2 adults?' },
        { from: 'bot', text: '💰 Package for 2 Adults:\n✈️ Flight + Hotel: ₹24,999\n🏨 Snow Valley Resort (⭐4.7)\n🍽️ Breakfast included\n🎿 Free snow activities!' },
        { from: 'user', text: 'Amazing! Book it please 🙌' },
        { from: 'bot', text: '✅ <b>Booking Confirmed!</b>\n🎫 ID: TRV-20251220\n📩 Details sent to your email\nHave a wonderful trip! 🎉', chips: ['Download Itinerary', 'Add Traveler'] },
    ],
    doctor: [
        { from: 'bot', text: 'Welcome to MedCare! 👋\nBook appointments with <b>top specialists</b> near you', cards: [
            { emoji: '🦷', title: 'Dentist', color: 'bg-gradient-to-br from-blue-300 to-blue-500' },
            { emoji: '❤️', title: 'Cardio', color: 'bg-gradient-to-br from-red-300 to-red-500' },
        ]},
        { from: 'user', text: 'I need a dentist appointment for tomorrow' },
        { from: 'bot', text: 'Dr. Sharma is available tomorrow:\n🕐 10:00 AM - Sector 15\n🕐 3:00 PM - Sector 22\n🕐 5:30 PM - Sector 15', chips: ['10 AM', '3 PM', '5:30 PM'] },
        { from: 'user', text: '10 AM works for me' },
        { from: 'bot', text: '✅ Slot confirmed with <b>Dr. Sharma</b>\n📍 MedCare Clinic, Sector 15\n🕐 Tomorrow 10:00 AM\n💳 Consultation: ₹500' },
        { from: 'user', text: 'Can I pay online?' },
        { from: 'bot', text: '💳 Payment link sent!\n✅ ₹500 paid successfully\n📩 Confirmation SMS sent\n🔔 Reminder set for tomorrow 9 AM\nStay healthy! 😊', chips: ['Reschedule', 'Cancel'] },
    ],
    salon: [
        { from: 'bot', text: 'Welcome to StyleHub! 💇\nPick your service and book <b>instantly</b>', cards: [
            { emoji: '✂️', title: 'Haircut', color: 'bg-gradient-to-br from-pink-300 to-pink-500' },
            { emoji: '🧔', title: 'Beard', color: 'bg-gradient-to-br from-purple-300 to-purple-500' },
        ]},
        { from: 'user', text: 'Haircut + Beard trim combo please' },
        { from: 'bot', text: '✂️ Combo: ₹399 only!\nAvailable slots today:\n🕐 11 AM • 2 PM • 5 PM\nStylist: Raj (⭐ 4.8)', chips: ['11 AM', '2 PM', '5 PM'] },
        { from: 'user', text: '2 PM with Raj, please!' },
        { from: 'bot', text: '✅ <b>Booked!</b>\n💇 Haircut + Beard Trim\n🕐 Today 2:00 PM\n👦 Stylist: Raj\n💰 ₹399 (pay at salon)' },
        { from: 'user', text: 'Can I add a head massage too?' },
        { from: 'bot', text: '🧖 Head Massage added!\n📋 Updated bill:\n✂️ Haircut + Beard: ₹399\n💆 Head Massage: ₹199\n💰 <b>Total: ₹598</b>\nSee you at 2 PM! ✨', chips: ['Get Directions', 'Cancel'] },
    ],
    event: [
        { from: 'bot', text: 'What\'s happening this weekend! 🎉\nBrowse <b>trending events</b> near you', cards: [
            { emoji: '🎵', title: 'Concerts', color: 'bg-gradient-to-br from-purple-300 to-purple-500' },
            { emoji: '🎭', title: 'Theatre', color: 'bg-gradient-to-br from-amber-300 to-amber-500' },
        ]},
        { from: 'user', text: 'Any concerts this Saturday?' },
        { from: 'bot', text: '🎵 Found 2 events:\n1. Arijit Singh Live - 7 PM - ₹1,499\n2. Sunburn Fest - 4 PM - ₹999\nSelect to book:', chips: ['Arijit Singh', 'Sunburn Fest'] },
        { from: 'user', text: 'Arijit Singh Live! 2 tickets please' },
        { from: 'bot', text: '🎟️ 2x Arijit Singh Live\n📅 Saturday, 7:00 PM\n📍 Jawaharlal Nehru Stadium\n💰 Total: ₹2,998' },
        { from: 'user', text: 'Booked! Will I get e-tickets?' },
        { from: 'bot', text: '✅ <b>Tickets Confirmed!</b>\n📱 E-tickets sent via WhatsApp\n🎫 Booking ID: EVT-8821\n🚪 Gate opens at 5:30 PM\nEnjoy the show! 🎶', chips: ['Download Tickets', 'Share'] },
    ],
    support: [
        { from: 'bot', text: 'Hello! 🎧 How can we help?\nChoose a <b>quick option</b> below', cards: [
            { emoji: '📦', title: 'Track Order', color: 'bg-gradient-to-br from-teal-300 to-teal-500' },
            { emoji: '🔄', title: 'Return', color: 'bg-gradient-to-br from-cyan-300 to-cyan-500' },
        ]},
        { from: 'user', text: 'My order #4521 hasn\'t arrived yet' },
        { from: 'bot', text: '📦 Order #4521 Status:\n🚚 Out for delivery\n📍 Near your location\n⏰ ETA: Today by 6 PM', chips: ['Track Live', 'Change Address'] },
        { from: 'user', text: 'It\'s 7 PM and still not delivered 😡' },
        { from: 'bot', text: '😔 We sincerely apologize!\nI\'ve escalated your order.\n📞 Delivery partner will call in 10 mins\n🎁 <b>₹100 coupon</b> added to your account' },
        { from: 'user', text: 'Okay, thanks for the quick response!' },
        { from: 'bot', text: 'You\'re welcome! 🙏\n✅ Issue logged: #SUP-4521\n📩 Updates via WhatsApp\nAnything else I can help with?', chips: ['Rate Us', 'More Help'] },
    ],
    restaurant: [
        { from: 'bot', text: 'Welcome to FoodieSpot! 🍽️\nReserve or order with <b>one tap</b>', cards: [
            { emoji: '🪑', title: 'Reserve', color: 'bg-gradient-to-br from-red-300 to-red-500' },
            { emoji: '🛵', title: 'Delivery', color: 'bg-gradient-to-br from-orange-300 to-orange-500' },
        ]},
        { from: 'user', text: 'Table for 4 tonight at 8 PM' },
        { from: 'bot', text: '✅ Reserved! Table for 4 at 8 PM\n🔥 Today\'s specials:\n• Butter Chicken - ₹349\n• Paneer Tikka - ₹249', chips: ['Pre-order', 'View Menu'] },
        { from: 'user', text: 'Pre-order 2x Butter Chicken & 1x Paneer Tikka' },
        { from: 'bot', text: '🍽️ Pre-order confirmed!\n• 2x Butter Chicken: ₹698\n• 1x Paneer Tikka: ₹249\n💰 <b>Total: ₹947</b>\nReady when you arrive!' },
        { from: 'user', text: 'Perfect! Can we get a window seat?' },
        { from: 'bot', text: '🪟 Window seat reserved! 🎉\n📍 FoodieSpot, MG Road\n🕗 Tonight 8:00 PM\n👥 4 guests\n🍽️ Food pre-ordered\nBon appétit! ✨', chips: ['Get Directions', 'Modify'] },
    ],
    realestate: [
        { from: 'bot', text: 'Find your dream home! 🏠\nSearch from <b>10,000+ listings</b>', cards: [
            { emoji: '🏢', title: '2BHK', color: 'bg-gradient-to-br from-emerald-300 to-emerald-500' },
            { emoji: '🏡', title: '3BHK', color: 'bg-gradient-to-br from-green-300 to-green-500' },
        ]},
        { from: 'user', text: '2BHK apartments in Noida, 30-50L budget' },
        { from: 'bot', text: '🏢 Top matches:\n1. Sector 75 - ₹35L - 1050sqft\n2. Sector 137 - ₹42L - 1200sqft\n3. Sector 150 - ₹48L - 1350sqft', chips: ['Schedule Visit', 'EMI Calculator'] },
        { from: 'user', text: 'Schedule visit for Sector 137 property' },
        { from: 'bot', text: '🏢 <b>Gaur City, Sector 137</b>\n📍 1200 sqft, East-facing\n🅿️ Covered parking included\n📅 Visit available: Sat 11 AM, Sun 3 PM', chips: ['Sat 11 AM', 'Sun 3 PM'] },
        { from: 'user', text: 'Saturday 11 AM please' },
        { from: 'bot', text: '✅ <b>Visit Booked!</b>\n📅 Sat, 11:00 AM\n📍 Gaur City, Sector 137\n👤 Agent: Mr. Verma (📞 +91-98XXX)\n📋 Bring: ID proof\nSee you there! 🏠', chips: ['EMI Calculator', 'More Properties'] },
    ],
    ecommerce: [
        { from: 'bot', text: 'Hey! 🛒 ShopSmart Deals\nGet <b>extra 15% off</b> today only!', cards: [
            { emoji: '🎧', title: 'Earbuds', color: 'bg-gradient-to-br from-amber-300 to-amber-500' },
            { emoji: '📱', title: 'Phones', color: 'bg-gradient-to-br from-slate-400 to-slate-600' },
        ]},
        { from: 'user', text: 'Wireless earbuds under ₹2,000' },
        { from: 'bot', text: '🎧 Best picks:\n1. BoAt Airdopes - ₹1,299\n2. Noise Buds Pro - ₹1,499\n3. JBL Wave - ₹1,799', chips: ['Add to Cart', 'Compare'] },
        { from: 'user', text: 'Add BoAt Airdopes to cart' },
        { from: 'bot', text: '🛒 Added to cart!\n🎧 BoAt Airdopes 441: ₹1,299\n🏷️ 15% off applied: <b>-₹195</b>\n💰 You pay: <b>₹1,104</b>' },
        { from: 'user', text: 'Checkout! COD available?' },
        { from: 'bot', text: '✅ <b>Order Placed!</b>\n📦 BoAt Airdopes 441\n💰 ₹1,104 (COD)\n🚚 Delivery: Tomorrow by 7 PM\n📱 Track: #SS-77291\nHappy Shopping! 🎉', chips: ['Track Order', 'Shop More'] },
    ],
    education: [
        { from: 'bot', text: 'Welcome to EduBot! 📚\nExplore <b>courses & admissions</b>', cards: [
            { emoji: '🎓', title: 'MBA', color: 'bg-gradient-to-br from-indigo-300 to-indigo-500' },
            { emoji: '💻', title: 'B.Tech', color: 'bg-gradient-to-br from-blue-300 to-blue-500' },
        ]},
        { from: 'user', text: 'MBA admission process and fees?' },
        { from: 'bot', text: '🎓 MBA 2025 Intake:\n📋 Application: Open till Jan 15\n💰 Fees: ₹8.5L/year\n📊 CAT/GMAT accepted', chips: ['Apply Now', 'Download Brochure'] },
        { from: 'user', text: 'I scored 92 percentile in CAT. Am I eligible?' },
        { from: 'bot', text: '🎯 Great score! You qualify for:\n✅ General Management\n✅ Marketing\n✅ Finance\n🏆 Scholarship: Up to 30% merit-based!' },
        { from: 'user', text: 'How do I apply for the scholarship?' },
        { from: 'bot', text: '📝 <b>Scholarship Steps:</b>\n1️⃣ Fill online form\n2️⃣ Upload CAT scorecard\n3️⃣ PI round (virtual)\n⏰ Deadline: Jan 15\n📩 Form link sent!\nBest of luck! 🌟', chips: ['Apply Now', 'Talk to Advisor'] },
    ],
    fitness: [
        { from: 'bot', text: 'Hey! 💪 FitLife Gym\nYour <b>fitness journey</b> starts here', cards: [
            { emoji: '🏋️', title: 'Gym', color: 'bg-gradient-to-br from-lime-300 to-lime-500' },
            { emoji: '🧘', title: 'Yoga', color: 'bg-gradient-to-br from-green-300 to-green-500' },
        ]},
        { from: 'user', text: 'Monthly membership plans?' },
        { from: 'bot', text: '🏋️ Plans:\n1. Basic - ₹999/mo\n2. Premium - ₹1,999/mo (+ pool)\n3. Elite - ₹2,999/mo (+ trainer)', chips: ['Join Now', 'Free Trial'] },
        { from: 'user', text: 'I want Elite plan with a personal trainer' },
        { from: 'bot', text: '💪 Elite Plan - ₹2,999/mo\n👤 Trainer: Arjun (NSCA Certified)\n🏊 Pool + Steam + Sauna included\n📅 Starts from tomorrow!' },
        { from: 'user', text: 'Sign me up! Can I start with a free trial?' },
        { from: 'bot', text: '✅ <b>3-Day Free Trial Activated!</b>\n📍 FitLife, Sector 18\n🕐 Open: 5 AM - 11 PM\n👤 Trainer session @ 7 AM\n📱 Download our app for diet plan\nLet\'s crush it! 🔥', chips: ['Get Directions', 'Diet Plan'] },
    ],
    insurance: [
        { from: 'bot', text: 'Hi! 🛡️ InsureBot\nGet <b>instant quotes</b> on all plans', cards: [
            { emoji: '❤️', title: 'Health', color: 'bg-gradient-to-br from-sky-300 to-sky-500' },
            { emoji: '🚗', title: 'Motor', color: 'bg-gradient-to-br from-blue-300 to-blue-500' },
        ]},
        { from: 'user', text: 'Health insurance for family of 4' },
        { from: 'bot', text: '🛡️ Family Floater Plans:\n1. ₹5L cover - ₹8,400/yr\n2. ₹10L cover - ₹12,900/yr\n3. ₹25L cover - ₹18,500/yr', chips: ['Get Quote', 'Compare Plans'] },
        { from: 'user', text: '₹10L cover looks good. What\'s included?' },
        { from: 'bot', text: '📋 ₹10L Family Floater:\n✅ Cashless at 5000+ hospitals\n✅ Pre & post hospitalization\n✅ Day-care procedures\n✅ No co-pay\n👨‍👩‍👧‍👦 All 4 members covered' },
        { from: 'user', text: 'Great, I want to buy this plan' },
        { from: 'bot', text: '✅ <b>Policy Issued!</b>\n🛡️ ₹10L Family Health Plan\n📋 Policy #: INS-2025-8834\n💰 ₹12,900/yr (EMI available)\n📩 Documents sent to email\nYour family is protected! 💚', chips: ['Download Policy', 'Add Rider'] },
    ],
    banking: [
        { from: 'bot', text: 'Welcome! 🏦 BankBot\nManage your <b>accounts securely</b>', cards: [
            { emoji: '💳', title: 'Cards', color: 'bg-gradient-to-br from-violet-300 to-violet-500' },
            { emoji: '💰', title: 'Loans', color: 'bg-gradient-to-br from-purple-300 to-purple-500' },
        ]},
        { from: 'user', text: 'Check my account balance' },
        { from: 'bot', text: '🏦 Account: ****4521\n💰 Balance: ₹45,230.50\n📊 Last txn: -₹1,200 (Amazon)\n📅 Statement ready', chips: ['Mini Statement', 'Transfer'] },
        { from: 'user', text: 'Transfer ₹5,000 to Rahul' },
        { from: 'bot', text: '📤 Transfer Details:\n👤 To: Rahul Sharma (****7890)\n💰 Amount: ₹5,000\n🏦 IMPS Transfer\n\n⚠️ Please confirm:', chips: ['✅ Confirm', '❌ Cancel'] },
        { from: 'user', text: '✅ Confirm' },
        { from: 'bot', text: '✅ <b>Transfer Successful!</b>\n💰 ₹5,000 sent to Rahul\n📋 Ref: IMPS-928347561\n💳 New Balance: ₹40,230.50\n📩 SMS confirmation sent\nAnything else? 😊', chips: ['Another Transfer', 'Statement'] },
    ],
    logistics: [
        { from: 'bot', text: 'Hi! 🚚 ShipFast Logistics\nTrack & manage <b>shipments easily</b>', cards: [
            { emoji: '📦', title: 'Track', color: 'bg-gradient-to-br from-yellow-300 to-yellow-500' },
            { emoji: '🚛', title: 'Ship', color: 'bg-gradient-to-br from-orange-300 to-orange-500' },
        ]},
        { from: 'user', text: 'Track shipment #SF-78234' },
        { from: 'bot', text: '📦 Shipment #SF-78234:\n✅ Picked up - Delhi\n🚚 In transit - Jaipur Hub\n📍 ETA: Tomorrow 2 PM', chips: ['Live Track', 'Reschedule'] },
        { from: 'user', text: 'Can I reschedule to next Monday?' },
        { from: 'bot', text: '📅 Reschedule options:\n1. Monday 10 AM - 2 PM\n2. Monday 2 PM - 6 PM\n3. Monday 6 PM - 9 PM\n📍 Same address: Jaipur', chips: ['10AM-2PM', '2PM-6PM', '6PM-9PM'] },
        { from: 'user', text: '2PM-6PM slot please' },
        { from: 'bot', text: '✅ <b>Rescheduled!</b>\n📦 #SF-78234\n📅 Monday, 2 PM - 6 PM\n📍 Jaipur delivery address\n📱 Driver will call 30 min before\nPackage on its way! 📬', chips: ['Track Again', 'New Shipment'] },
    ],
    hotel: [
        { from: 'bot', text: 'Welcome! 🏨 StayEasy Hotels\nBook <b>luxury stays</b> instantly', cards: [
            { emoji: '🌟', title: 'Luxury', color: 'bg-gradient-to-br from-rose-300 to-rose-500' },
            { emoji: '🏖️', title: 'Resort', color: 'bg-gradient-to-br from-pink-300 to-pink-500' },
        ]},
        { from: 'user', text: 'Rooms in Goa for Dec 25-28' },
        { from: 'bot', text: '🏨 Goa Stays (Dec 25-28):\n1. Beach Resort - ₹4,999/night ⭐4.5\n2. Heritage Villa - ₹6,499/night ⭐4.8', chips: ['Book Now', 'View Photos'] },
        { from: 'user', text: 'Book Heritage Villa for 3 nights' },
        { from: 'bot', text: '🏡 Heritage Villa - Goa\n📅 Dec 25-28 (3 nights)\n💰 ₹6,499 × 3 = <b>₹19,497</b>\n🍳 Breakfast + 🏊 Pool included\n🅿️ Free parking' },
        { from: 'user', text: 'Book it! Any late checkout option?' },
        { from: 'bot', text: '✅ <b>Booking Confirmed!</b>\n🏨 Heritage Villa, Goa\n📋 Booking: #HTV-9928\n🕐 Late checkout till 2 PM: FREE!\n📩 Voucher sent via WhatsApp\nEnjoy your vacay! 🌴', chips: ['Download Voucher', 'Add Activity'] },
    ],
    automotive: [
        { from: 'bot', text: 'Hi! 🚗 AutoCare\nBook <b>service & test drives</b>', cards: [
            { emoji: '🔧', title: 'Service', color: 'bg-gradient-to-br from-slate-400 to-slate-600' },
            { emoji: '🚘', title: 'Test Drive', color: 'bg-gradient-to-br from-gray-400 to-gray-600' },
        ]},
        { from: 'user', text: 'Book a test drive for Tata Nexon' },
        { from: 'bot', text: '🚗 Tata Nexon Test Drive:\n📍 Showroom: MG Road\n📅 Available: Tomorrow 11 AM, 3 PM\n🎁 Bonus: Free accessories worth ₹15K', chips: ['11 AM', '3 PM'] },
        { from: 'user', text: '11 AM tomorrow please' },
        { from: 'bot', text: '✅ Test Drive Booked!\n🚗 Tata Nexon EV (Blue)\n📅 Tomorrow 11:00 AM\n📍 AutoCare, MG Road\n👤 Sales: Mr. Kapoor' },
        { from: 'user', text: 'What about exchange offer for my old car?' },
        { from: 'bot', text: '🔄 <b>Exchange Bonus!</b>\n🚗 Old car evaluation: FREE\n💰 Up to ₹75,000 exchange value\n📋 Bring: RC book + Insurance\n🎁 Extra ₹15K off on Nexon!\nDrive your dream! 🏎️', chips: ['Confirm Visit', 'EMI Options'] },
    ],
    legal: [
        { from: 'bot', text: 'Hello! ⚖️ LegalBot\nGet <b>legal help</b> in minutes', cards: [
            { emoji: '📄', title: 'Contracts', color: 'bg-gradient-to-br from-stone-400 to-stone-600' },
            { emoji: '🏛️', title: 'Consult', color: 'bg-gradient-to-br from-amber-300 to-amber-500' },
        ]},
        { from: 'user', text: 'Need help with rental agreement' },
        { from: 'bot', text: '📄 Rental Agreement:\n✅ E-stamp paper included\n✅ Lawyer verified\n💰 Starting ₹999\n⏰ Ready in 24 hours', chips: ['Start Now', 'Talk to Lawyer'] },
        { from: 'user', text: 'Start now! It\'s for 11 months in Bangalore' },
        { from: 'bot', text: '📋 Details noted:\n📍 Location: Bangalore\n📅 Duration: 11 months\n🏠 Please share:\n1. Landlord name\n2. Tenant name\n3. Monthly rent\n4. Security deposit' },
        { from: 'user', text: 'Landlord: Mr. Rao, Tenant: Me, Rent: ₹25K, Deposit: ₹1L' },
        { from: 'bot', text: '✅ <b>Agreement Ready!</b>\n📄 11-month rental agreement\n💰 ₹999 (e-stamp included)\n📋 Ref: #LEG-5567\n📩 Draft sent for review\n✍️ E-sign link shared!\nLegally sorted! ⚖️', chips: ['Review Draft', 'Make Changes'] },
    ],
    grocery: [
        { from: 'bot', text: 'Hi! 🥬 FreshMart\nOrder <b>fresh groceries</b> on WhatsApp', cards: [
            { emoji: '🍎', title: 'Fruits', color: 'bg-gradient-to-br from-green-300 to-green-500' },
            { emoji: '🥛', title: 'Dairy', color: 'bg-gradient-to-br from-yellow-200 to-yellow-400' },
        ]},
        { from: 'user', text: 'Weekly grocery basket for family' },
        { from: 'bot', text: '🛒 Family Weekly Basket:\n🥬 Veggies - ₹250\n🍎 Fruits - ₹350\n🥛 Dairy - ₹200\n📦 Total: ₹800', chips: ['Order Now', 'Customize'] },
        { from: 'user', text: 'Customize - add 2kg rice and cooking oil' },
        { from: 'bot', text: '🛒 Updated basket:\n🥬 Veggies: ₹250\n🍎 Fruits: ₹350\n🥛 Dairy: ₹200\n🍚 Rice 2kg: ₹140\n🫒 Oil 1L: ₹180\n💰 <b>Total: ₹1,120</b>' },
        { from: 'user', text: 'Order! Deliver by 6 PM please' },
        { from: 'bot', text: '✅ <b>Order Confirmed!</b>\n📦 Order #FM-3321\n💰 ₹1,120 (COD)\n🚴 Delivery by 6:00 PM\n📍 Your saved address\n🥬 Farm-fresh guaranteed!\nHappy cooking! 👨‍🍳', chips: ['Track Order', 'Reorder'] },
    ],
    telecom: [
        { from: 'bot', text: 'Hey! 📱 TeleBot\nManage your <b>mobile plans</b> easily', cards: [
            { emoji: '📶', title: 'Recharge', color: 'bg-gradient-to-br from-cyan-300 to-cyan-500' },
            { emoji: '🌐', title: 'Broadband', color: 'bg-gradient-to-br from-teal-300 to-teal-500' },
        ]},
        { from: 'user', text: 'Best prepaid plans with 2GB/day' },
        { from: 'bot', text: '📶 Prepaid Plans (2GB/day):\n1. ₹239 - 28 days\n2. ₹599 - 84 days ⭐Best Value\n3. ₹2,999 - 365 days', chips: ['Recharge Now', 'Compare'] },
        { from: 'user', text: '₹599 plan for 84 days please' },
        { from: 'bot', text: '📋 Plan Summary:\n📶 2GB/day + Unlimited calls\n📅 Valid: 84 days\n🎵 Free JioSaavn/Hotstar\n💰 ₹599\n\nProceed to pay?', chips: ['UPI', 'Card', 'Wallet'] },
        { from: 'user', text: 'UPI payment' },
        { from: 'bot', text: '✅ <b>Recharge Successful!</b>\n📱 +91-98XXX-XXXXX\n📶 2GB/day activated\n📅 Valid till: March 8, 2025\n💰 Paid: ₹599 via UPI\n📩 Receipt sent!\nStay connected! 📡', chips: ['Auto-Recharge ON', 'More Plans'] },
    ],
};

export default function Hero() {
    const [counts, setCounts] = useState([0, 0, 0])
    const [activeBiz, setActiveBiz] = useState('travel')

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
                            {/* Surface shadow */}
                            <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-[18px] sm:h-[28px] bg-black/15 rounded-[50%] blur-xl pointer-events-none rotate-[-6deg]" />
                            <div className="w-[140px] sm:w-[220px] md:w-[260px] h-[280px] sm:h-[430px] md:h-[500px] rounded-[28px] sm:rounded-[40px] border-[3px] sm:border-[5px] border-[#1d1d1f] bg-[#ece5dd] shadow-[0_30px_80px_rgba(0,0,0,0.18)] rotate-[-6deg] overflow-hidden flex flex-col relative">
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
                            {/* Surface shadow */}
                            <div className="absolute -bottom-5 sm:-bottom-8 left-1/2 -translate-x-1/2 w-[75%] h-[20px] sm:h-[32px] bg-black/18 rounded-[50%] blur-xl pointer-events-none" />
                            <div className="w-[160px] sm:w-[250px] md:w-[300px] h-[320px] sm:h-[490px] md:h-[580px] rounded-[30px] sm:rounded-[44px] border-[3px] sm:border-[5px] border-[#1d1d1f] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col relative">
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

            {/* Stop Losing Customers Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-[#fafafa] relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
                                <span className="text-orange-500 text-sm">✨</span>
                                <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">AI That Never Sleeps</span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                Stop losing customers.<br />
                                <span className="text-orange-500">Start converting 24/7.</span>
                            </h2>

                            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
                                Every missed call is a missed sale. Let AI handle your calls, WhatsApp, and bookings — while you focus on growing your business.
                            </p>

                            {/* Stats */}
                            <div className="flex gap-8 sm:gap-12">
                                <div>
                                    <p className="text-3xl sm:text-4xl font-bold text-slate-900">10x</p>
                                    <p className="text-sm text-slate-500 mt-1">Faster Response</p>
                                </div>
                                <div>
                                    <p className="text-3xl sm:text-4xl font-bold text-slate-900">90%</p>
                                    <p className="text-sm text-slate-500 mt-1">Cost Savings</p>
                                </div>
                                <div>
                                    <p className="text-3xl sm:text-4xl font-bold text-slate-900">24/7</p>
                                    <p className="text-sm text-slate-500 mt-1">Always Online</p>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="/signup"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 text-sm"
                                >
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://wa.me/917304aborad"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-semibold rounded-full hover:border-green-400 hover:text-green-600 transition-all duration-300 text-sm"
                                >
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>

                        {/* Right Visual - Man with WhatsApp Phone */}
                        <div className="relative flex justify-center items-center">
                            {/* Concentric green circles */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                                <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] rounded-full border border-green-200/40" />
                                <div className="absolute w-[250px] h-[250px] sm:w-[330px] sm:h-[330px] lg:w-[400px] lg:h-[400px] rounded-full border border-green-200/50" />
                                <div className="absolute w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] lg:w-[300px] lg:h-[300px] rounded-full border border-green-300/40" />
                            </div>

                            {/* Chat bubble icon floating */}
                            <div className="absolute top-4 right-8 sm:top-8 sm:right-12 w-12 h-12 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
                                <MessageSquare className="h-6 w-6 text-white" />
                            </div>

                            {/* Main image */}
                            <div className="relative z-10">
                                <img
                                    src="/images/bean-bag-man.png"
                                    alt="Person using WhatsApp Business with DigitalBot AI"
                                    className="w-[340px] sm:w-[440px] lg:w-[540px] h-auto object-contain drop-shadow-2xl"
                                />
                            </div>

                            {/* Floating WhatsApp chat card */}
                            <div className="absolute left-0 sm:left-[-20px] top-[15%] z-20 w-[200px] sm:w-[240px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                {/* WhatsApp header */}
                                <div className="bg-[#075e54] px-3 py-2 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center">
                                        <span className="text-white text-[8px] font-bold">DB</span>
                                    </div>
                                    <div>
                                        <p className="text-white text-[10px] font-semibold">ABC Jewellers ✅</p>
                                        <p className="text-green-200 text-[8px]">Online</p>
                                    </div>
                                </div>
                                {/* Chat messages */}
                                <div className="bg-[#ece5dd] px-2 py-2 space-y-1.5">
                                    <div className="bg-white rounded-lg px-2 py-1.5 shadow-sm max-w-[90%]">
                                        <p className="text-[8px] text-slate-800">Hi Aadi, 👋</p>
                                        <p className="text-[8px] text-slate-700 mt-0.5">Thank you for reaching out! ✨ Explore our latest jewelry collection:</p>
                                        <p className="text-[7px] text-blue-500 mt-0.5">🔗 www.goldjewels.com</p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="bg-white rounded-lg px-2 py-1 shadow-sm text-center">
                                            <p className="text-[8px] text-blue-600 font-medium">View More Collections</p>
                                        </div>
                                        <div className="bg-white rounded-lg px-2 py-1 shadow-sm text-center">
                                            <p className="text-[8px] text-blue-600 font-medium">Get Price Details</p>
                                        </div>
                                        <div className="bg-white rounded-lg px-2 py-1 shadow-sm text-center">
                                            <p className="text-[8px] text-blue-600 font-medium">Talk to Support</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-[#d9fdd3] rounded-lg px-2 py-1 shadow-sm">
                                            <p className="text-[8px] text-slate-800">View More Collection</p>
                                            <p className="text-right text-[6px] text-slate-400">10:14 am ✓✓</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bot emoji floating */}
                            <div className="absolute top-[10%] left-[10%] z-20 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shadow-md" style={{ animation: 'badge-float 4s ease-in-out infinite' }}>
                                <span className="text-lg">🤖</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Dashboard Showcase Section */}
            <DashboardShowcase />

            {/* WhatsApp Chatbot Section */}
            <section className="py-12 sm:py-16 lg:py-20 bg-white relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                            Get Your <span className="text-orange-500">Customized Chatbot</span>
                        </h2>
                        <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto">
                            Pick your industry — watch the AI chatbot in action
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                        {/* LEFT: iPhone WhatsApp Mockup */}
                        <div className="flex justify-center order-2 lg:order-1">
                            <div className="relative">
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
                                    {/* Dynamic Chat messages */}
                                    <div className="bg-[#efeae2] p-3 space-y-2 max-h-[360px] sm:max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                                        <p className="text-center text-[9px] text-slate-500 bg-white/70 rounded-full px-3 py-0.5 mx-auto w-fit">Today 8:30 AM</p>
                                        {(bizPhoneChats[activeBiz as keyof typeof bizPhoneChats] || bizPhoneChats.travel).map((msg: { from: string; text: string; cards?: { emoji: string; title: string; color: string }[]; chips?: string[] }, idx: number) => (
                                            <div key={`${activeBiz}-${idx}`}>
                                                {msg.from === 'user' ? (
                                                    <div className="flex justify-end">
                                                        <div className="max-w-[75%] bg-[#dcf8c6] rounded-xl rounded-tr-none px-3 py-2 shadow-sm">
                                                            <p className="text-[11px] text-slate-800">{msg.text}</p>
                                                            <p className="text-[8px] text-slate-400 text-right mt-0.5">8:31 ✓✓</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-start">
                                                        <div className="max-w-[85%] bg-white rounded-xl rounded-tl-none px-3 py-2 shadow-sm">
                                                            <p className="text-[11px] text-slate-800" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                                                            {msg.cards && (
                                                                <div className="grid grid-cols-2 gap-1.5 mt-2">
                                                                    {msg.cards.map((card, ci) => (
                                                                        <div key={ci} className="rounded-lg overflow-hidden bg-slate-100">
                                                                            <div className={`h-14 ${card.color} flex items-end p-1.5`}>
                                                                                <span className="text-[9px] text-white font-bold bg-black/30 px-1.5 py-0.5 rounded">{card.emoji} {card.title}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {msg.chips && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {msg.chips.map((chip, ci) => (
                                                                        <span key={ci} className="text-[9px] bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full font-medium">{chip}</span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            <p className="text-[8px] text-slate-400 text-right mt-1">8:30 ✓✓</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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

                        {/* RIGHT: Service Filter Buttons Grid */}
                        <div className="order-1 lg:order-2">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5 text-center lg:text-left">Select your business</p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                                {[
                                    { id: 'travel', label: 'Travel', emoji: '✈️', color: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200', active: 'bg-orange-500 text-white border-orange-500 shadow-orange-500/30' },
                                    { id: 'doctor', label: 'Doctor', emoji: '🏥', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200', active: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30' },
                                    { id: 'salon', label: 'Salon', emoji: '💇', color: 'bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200', active: 'bg-pink-500 text-white border-pink-500 shadow-pink-500/30' },
                                    { id: 'event', label: 'Events', emoji: '🎫', color: 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200', active: 'bg-purple-500 text-white border-purple-500 shadow-purple-500/30' },
                                    { id: 'support', label: 'Support', emoji: '🎧', color: 'bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200', active: 'bg-teal-500 text-white border-teal-500 shadow-teal-500/30' },
                                    { id: 'restaurant', label: 'Restaurant', emoji: '🍽️', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200', active: 'bg-red-500 text-white border-red-500 shadow-red-500/30' },
                                    { id: 'realestate', label: 'Real Estate', emoji: '🏠', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200', active: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30' },
                                    { id: 'ecommerce', label: 'E-Commerce', emoji: '🛒', color: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200', active: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/30' },
                                    { id: 'education', label: 'Education', emoji: '📚', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200', active: 'bg-indigo-500 text-white border-indigo-500 shadow-indigo-500/30' },
                                    { id: 'fitness', label: 'Fitness', emoji: '💪', color: 'bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200', active: 'bg-lime-600 text-white border-lime-600 shadow-lime-600/30' },
                                    { id: 'insurance', label: 'Insurance', emoji: '🛡️', color: 'bg-sky-100 text-sky-700 border-sky-200 hover:bg-sky-200', active: 'bg-sky-500 text-white border-sky-500 shadow-sky-500/30' },
                                    { id: 'banking', label: 'Banking', emoji: '🏦', color: 'bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200', active: 'bg-violet-500 text-white border-violet-500 shadow-violet-500/30' },
                                    { id: 'logistics', label: 'Logistics', emoji: '🚚', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200', active: 'bg-yellow-500 text-white border-yellow-500 shadow-yellow-500/30' },
                                    { id: 'hotel', label: 'Hotels', emoji: '🏨', color: 'bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200', active: 'bg-rose-500 text-white border-rose-500 shadow-rose-500/30' },
                                    { id: 'automotive', label: 'Automotive', emoji: '🚗', color: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200', active: 'bg-slate-600 text-white border-slate-600 shadow-slate-600/30' },
                                    { id: 'legal', label: 'Legal', emoji: '⚖️', color: 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200', active: 'bg-stone-500 text-white border-stone-500 shadow-stone-500/30' },
                                    { id: 'grocery', label: 'Grocery', emoji: '🥬', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200', active: 'bg-green-500 text-white border-green-500 shadow-green-500/30' },
                                    { id: 'telecom', label: 'Telecom', emoji: '📱', color: 'bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200', active: 'bg-cyan-500 text-white border-cyan-500 shadow-cyan-500/30' },
                                ].map((biz) => (
                                    <button
                                        key={biz.id}
                                        onClick={() => setActiveBiz(biz.id)}
                                        className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl border text-xs font-semibold transition-all duration-300 ${
                                            activeBiz === biz.id ? biz.active + ' shadow-lg scale-105' : biz.color
                                        }`}
                                    >
                                        <span className="text-xl">{biz.emoji}</span>
                                        <span className="text-[11px] leading-tight">{biz.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center lg:justify-start">
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
                                <Link href="/contact" className="px-7 py-3 text-slate-700 font-medium rounded-xl border border-slate-200 hover:border-orange-300 hover:text-orange-600 transition-all text-sm text-center bg-white">
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
            <section className="py-16 sm:py-20 bg-[#fafafa] relative overflow-hidden">
                <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-5 py-2 rounded-full mb-6">
                            <span className="text-sm font-semibold text-orange-700">Voice Garden</span>
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
 

        </>
    )
}
