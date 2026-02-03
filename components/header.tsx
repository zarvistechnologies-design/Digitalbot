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
                "fixed top-0 w-full z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white shadow-sm"
                    : "bg-white"
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
                            {/* sky glow orbs */}
                            <span className="absolute -top-6 -left-6 w-20 h-21 rounded-full bg-gradient-to-br from-blue-500/25 via-blue-300/15 to-transparent blur-3xl" />
                            <span className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-tl from-blue-500/20 to-blue-300/10 blur-2xl" />

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
                            <div className="absolute -bottom-2 -right-8 px-3 py-1 bg-gradient-to-r from-blue-500 via-blue-300 to-blue-500 text-white text-[9px] font-bold shadow-lg shadow-blue-500/60 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-blue-500/30 backdrop-blur-sm"
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
                                        ? "text-blue-500"
                                        : "text-gray-700 hover:text-blue-500"
                                )}
                            >
                                {item.label}
                                {/* Animated underline */}
                                <span className={cn(
                                    "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300",
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
                            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors group">
                                Services
                                <ChevronDown className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    servicesOpen && "rotate-180"
                                )} />
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-500 transition-all duration-300 w-0 group-hover:w-4/5" />
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
                                        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-300/50 border border-gray-200 overflow-hidden">
                                            <div className="flex">
                                                {/* Left Section - Hero */}
                                                <div className="w-[260px] p-6 border-r border-gray-100/60">
                                                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                        Solutions That Drive<br />
                                                        <span className="text-blue-500">Business Growth</span>
                                                    </h3>
                                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                                                        Discover how DigitalBot helps enterprises deliver AI-powered voice automation, intelligent support, and measurable results.
                                                    </p>
                                                    <Link
                                                        href="/contact#contact-form"
                                                        className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-sm font-semibold rounded-full transition-all duration-200"
                                                    >
                                                        Request a Demo
                                                    </Link>
                                                </div>

                                                {/* Middle Section - Voice Solutions */}
                                                <div className="flex-1 p-6 border-r border-gray-100 bg-gray-50/30">
                                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                                        VOICE SOLUTIONS
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {services.slice(0, 4).map((service) => {
                                                            const Icon = service.icon
                                                            return (
                                                                <Link
                                                                    key={service.href}
                                                                    href={service.href}
                                                                    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                                                                        <Icon className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                    <span className="text-[15px] font-medium group-hover:text-blue-500 transition-colors">
                                                                        {service.label}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Middle Section - AI Services */}
                                                <div className="flex-1 p-6 border-r border-gray-100 bg-gray-50/30">
                                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                                        AI SERVICES
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {services.slice(4).map((service) => {
                                                            const Icon = service.icon
                                                            return (
                                                                <Link
                                                                    key={service.href}
                                                                    href={service.href}
                                                                    className="flex items-center gap-3 py-2.5 px-3 -mx-3 rounded-lg text-gray-700 hover:bg-white hover:shadow-sm transition-all group"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-500 flex items-center justify-center transition-colors">
                                                                        <Icon className="w-4 h-4 text-blue-500 group-hover:text-white transition-colors" />
                                                                    </div>
                                                                    <span className="text-[15px] font-medium group-hover:text-blue-500 transition-colors">
                                                                        {service.label}
                                                                    </span>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>

                                                    {/* Premium Services */}
                                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-5 mb-3">
                                                        PREMIUM
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href="/services/leads"
                                                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                                                        >
                                                            <BarChart3 className="w-4 h-4" />
                                                            Lead Analysis
                                                        </Link>
                                                        <Link
                                                            href="/services/appointments"
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                            Appointments
                                                        </Link>
                                                    </div>
                                                </div>

                                                {/* Right Section - Featured Card */}
                                                <div className="w-[220px] p-4">
                                                    <div className="h-full bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 flex flex-col">
                                                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                                                            FEATURED
                                                        </span>
                                                        <h4 className="mt-2 text-lg font-bold text-gray-900 leading-snug">
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
                                                                className="inline-flex items-center justify-center w-full py-2 bg-white hover:bg-blue-500 hover:text-white text-blue-500 text-sm font-semibold rounded-full border border-blue-200 transition-all duration-200"
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
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-200 group"
                        >
                            <Instagram className="w-4 h-4 text-white" />
                        </a>
                        <a
                            href="https://www.facebook.com/profile.php?id=61583885495540"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 group"
                        >
                            <Facebook className="w-4 h-4 text-white" />
                        </a>
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            <Sparkles className="w-4 h-4" />
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
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
                            className="lg:hidden overflow-hidden border-t border-gray-100"
                        >
                            <nav className="py-4 space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                            pathname === item.href
                                                ? "bg-blue-50 text-blue-500"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-500"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.label}
                                    </Link>
                                ))}

                                {/* Mobile Services */}
                                <div className="pt-3 mt-3 border-t border-gray-100">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Services</div>
                                    {services.slice(0, 6).map((service) => (
                                        <Link
                                            key={service.href}
                                            href={service.href}
                                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-500 rounded-lg transition-colors"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {service.label}
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile CTA */}
                                <div className="pt-4 px-4">
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
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
