"use client"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Activity, BarChart3, Bot, ChevronDown, Facebook, Instagram, Menu, Phone, Sparkles, TrendingUp, X, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const navItems = [
        { href: "/", label: "Home" },
        { href: "/about", label: "About" },
        { href: "/services", label: "Solutions", icon: Zap },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/pricing", label: "Pricing" },
        { href: "/contact", label: "Contact" },
    ]



    const services = [
        { href: "/services/ai-voice-bot", label: "AI Voice Bot", desc: "Intelligent voice automation", icon: Bot },
        { href: "/services/voice-ai-business", label: "Voice AI for Business", desc: "Enterprise solutions", icon: TrendingUp },
        { href: "/services/voice-automation-software", label: "Voice Automation", desc: "Workflow automation", icon: Zap },
        
        { href: "/services/conversational-ai", label: "Conversational AI", desc: "Natural conversations", icon: Activity },
        { href: "/services/ai-customer-support", label: "AI Customer Support", desc: "24/7 assistance", icon: Sparkles },
        { href: "/services/ai-call-center", label: "AI Call Center", desc: "Call automation", icon: Phone },
        { href: "/services/ai-sales-agent", label: "AI Sales Agent", desc: "Sales automation", icon: BarChart3 },
        { href: "/services/ai-virtual-receptionist", label: "Virtual Receptionist", desc: "Front desk AI", icon: Sparkles },
    ]


    const [servicesOpen, setServicesOpen] = useState(false);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-500",
                isScrolled
                    ? "glass-nav-scrolled"
                    : "glass-nav"
            )}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    {/* Enhanced Logo Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                        className="relative group"
                    >
                        <Link href="/" className="flex items-center gap-12 relative ml-0 pl-0 mr-2" onClick={() => setIsMenuOpen(false)}>
                            {/* glow orbs */}
                            <span className="absolute -top-6 -left-6 w-20 h-21 rounded-full bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-transparent blur-3xl" />
                            <span className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-tl from-orange-500/15 to-orange-300/10 blur-2xl" />

                            <div className="relative">
                                <Image
                                    src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                                    alt="DigitalBot.AI - AI Voice Assistant Platform"
                                    width={1450}
                                    height={460}
                                    priority
                                    quality={125}
                                    className="h-12 max-w-[200px] sm:h-13 sm:max-w-[240px] lg:h-14 lg:max-w-[280px] w-auto relative z-14 ml-0 pl-0 mr-10 transition-all duration-500 group-hover:scale-110"
                                />
                            </div>
                            {/* Enhanced AI Badge */}
                            <div className="absolute -bottom-2 -right-8 px-3 py-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 text-white text-[9px] font-bold shadow-lg shadow-orange-500/40 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-orange-400/30 backdrop-blur-sm"
                                style={{
                                    clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px))'
                                }}>
                                ✨ AI POWERED
                            </div>
                        </Link>
                    </motion.div>


                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-all duration-200 group",
                                    pathname === item.href
                                        ? "text-orange-600"
                                        : "text-slate-600 hover:text-orange-600"
                                )}
                            >
                                {item.label}
                                {/* Animated underline */}
                                <span className={cn(
                                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full transition-all duration-300",
                                    pathname === item.href ? "w-4/5" : "w-0 group-hover:w-4/5"
                                )} />
                            </Link>
                        ))}

                   

                        {/* Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                        >
                            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors group">
                                Services
                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    servicesOpen && "rotate-180"
                                )} />
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-orange-500 rounded-full transition-all duration-300 w-0 group-hover:w-4/5" />
                            </button>

                            <AnimatePresence>
                                {servicesOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-full pt-2 w-[850px]"
                                    >
                                        <div className="glass-strong rounded-2xl shadow-2xl shadow-orange-500/8 border border-white/40 overflow-hidden">
                                            <div className="flex">
                                                {/* Left Section - Hero */}
                                                <div className="w-[260px] p-6 border-r border-slate-100/40">
                                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                                                        Solutions That Drive<br />
                                                        <span className="text-gradient">Business Growth</span>
                                                    </h3>
                                                    <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                                                        Discover how DigitalBot helps enterprises deliver AI-powered voice automation, intelligent support, and measurable results.
                                                    </p>
                                                    <Link
                                                        href="/contact#contact-form"
                                                        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 border-2 border-orange-400 text-orange-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-500 hover:text-white hover:border-transparent text-sm font-semibold rounded-full transition-all duration-300"
                                                    >
                                                        Request a Demo
                                                    </Link>
                                                </div>

                                                {/* Middle Section - Voice Solutions */}
                                                <div className="flex-1 p-6 border-r border-slate-100/30 bg-white/20">
                                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                                        VOICE SOLUTIONS
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {services.slice(0, 4).map((service) => {
                                                            const Icon = service.icon
                                                            return (
                                                                <Link
                                                                    key={service.href}
                                                                    href={service.href}
                                                                    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg text-slate-600 hover:bg-white/60 hover:shadow-sm transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-500 flex items-center justify-center transition-all duration-300">
                                                                        <Icon className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                    <span className="text-[15px] font-medium group-hover:text-orange-600 transition-colors">
                                                                        {service.label}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Middle Section - AI Services */}
                                                <div className="flex-1 p-6 border-r border-slate-100/30 bg-white/20">
                                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                                                        AI SERVICES
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {services.slice(4).map((service) => {
                                                            const Icon = service.icon
                                                            return (
                                                                <Link
                                                                    key={service.href}
                                                                    href={service.href}
                                                                    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg text-slate-600 hover:bg-white/60 hover:shadow-sm transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-orange-50 group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-500 flex items-center justify-center transition-all duration-300">
                                                                        <Icon className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                    <span className="text-[15px] font-medium group-hover:text-orange-600 transition-colors">
                                                                        {service.label}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Premium Services */}
                                                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-5 mb-3">
                                                        PREMIUM
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href="/services/leads"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md shadow-orange-500/20"
                                                        >
                                                            <BarChart3 className="w-4 h-4" />
                                                            Lead Analysis
                                                        </Link>
                                                        <Link
                                                            href="/services/appointments"
                                                            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-sm font-medium rounded-lg transition-all duration-300"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            Appointments
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Right Section - Featured Card */}
                                                <div className="w-[220px] p-4">
                                                    <div className="h-full bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-xl p-4 flex flex-col border border-orange-100/50">
                                                        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                                                            FEATURED
                                                        </span>
                                                        <h4 className="mt-2 text-lg font-bold text-slate-900 leading-snug">
                                                            Delivering 360°<br />
                                                            Customer<br />
                                                            Experience
                                                        </h4>
                                                        <div className="mt-auto pt-4">
                                                            <div className="relative h-24 rounded-lg overflow-hidden mb-3">
                                                                <Image
                                                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=150&fit=crop"
                                                                    alt="Customer Experience"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <Link
                                                                href="/services"
                                                                className="inline-flex items-center justify-center w-full py-2 bg-white/80 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-500 hover:text-white text-orange-600 text-sm font-semibold rounded-full border border-orange-200/50 hover:border-transparent transition-all duration-300"
                                                            >
                                                                Learn More
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>

                    {/* Social Icons & CTA Button */}
                    <div className="hidden lg:flex items-center gap-3">
                        <a
                            href="https://www.instagram.com/digitalbot._ai?utm_source=qr&igsh=MTc3emoxbmdqdmVz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-orange-500 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-200 group"
                        >
                            <Instagram className="w-4 h-4 text-white" />
                        </a>
                        <a
                            href="https://www.facebook.com/profile.php?id=61583885495540"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 group"
                        >
                            <Facebook className="w-4 h-4 text-white" />
                        </a>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md shadow-orange-500/20 hover:shadow-lg hover:shadow-orange-500/30 btn-glow"
                        >
                            <Sparkles className="w-4 h-4" />
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-slate-600 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="lg:hidden overflow-hidden border-t border-slate-100/50 glass-strong rounded-b-2xl"
                        >
                            <nav className="py-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            pathname === item.href
                                                ? "bg-orange-50/60 text-orange-600"
                                                : "text-slate-600 hover:bg-orange-50/40 hover:text-orange-600"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Mobile Services */}
                                <div className="pt-3 mt-3 border-t border-slate-100/40">
                                    <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Services</div>
                                    {services.slice(0, 6).map((service) => (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-orange-50/40 hover:text-orange-600 rounded-lg transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {service.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Social Icons */}
                                <div className="pt-4 px-4 flex items-center justify-center gap-3">
                                    <a
                                        href="https://www.instagram.com/digitalbot._ai?utm_source=qr&igsh=MTc3emoxbmdqdmVz"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 via-pink-500 to-orange-500 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-200"
                                    >
                                        <Instagram className="w-5 h-5 text-white" />
                                    </a>
                                    <a
                                        href="https://www.facebook.com/profile.php?id=61583885495540"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-11 h-11 rounded-full bg-orange-600 hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200"
                                    >
                                        <Facebook className="w-5 h-5 text-white" />
                                    </a>
                                </div>

                                {/* Mobile CTA */}
                                <div className="pt-3 px-4">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white text-sm font-medium rounded-xl transition-all duration-300 shadow-md shadow-orange-500/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        Get Started Free
                                    </Link>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </header>
    )
}
