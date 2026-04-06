"use client"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import {
    Activity,
    Award,
    Banknote,
    BarChart3,
    Bot,
    Briefcase,
    Building2,
    Calculator,
    Car,
    ChevronDown,
    Globe,
    GraduationCap,
    Headphones,
    HeartPulse,
    Home as HomeIcon,
    Laptop,
    Menu,
    MessageCircle,
    Phone,
    ShoppingCart,
    Sparkles,
    TrendingUp,
    Users,
    X,
    Zap
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])



    const navItems = [
        { href: "/", label: "Home" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/pricing", label: "Pricing" },
        { href: "/contact", label: "Contact" },
    ]

    // Solutions — WhatsApp Bot Services industry grid
    const solutions = [
        { href: "/solutions/education", label: "Education", icon: GraduationCap },
        { href: "/solutions/car-dealership", label: "Car Dealership", icon: Car },
        { href: "/solutions/real-estate", label: "Real Estate", icon: HomeIcon },
        { href: "/solutions/coaching", label: "Coaching", icon: Award },
        { href: "/solutions/automobile", label: "Automobile", icon: Car },
        { href: "/solutions/marketing", label: "Marketing", icon: TrendingUp },
        { href: "/solutions/insurance", label: "Insurance", icon: Briefcase },
        { href: "/solutions/consulting", label: "Consulting", icon: Building2 },
        { href: "/solutions/healthcare", label: "Healthcare", icon: HeartPulse },
        { href: "/solutions/accounting-legal", label: "Accounting", icon: Calculator },
        { href: "/solutions/saas", label: "SaaS", icon: Globe },
        { href: "/solutions/financial-services", label: "Financial Services", icon: Banknote },
        { href: "/solutions/ecommerce", label: "E-commerce", icon: ShoppingCart },
        { href: "/solutions/it-services", label: "IT Services", icon: Laptop },
        { href: "/solutions/bpo", label: "BPO", icon: Headphones },
        { href: "/solutions/recruitment", label: "Recruitment", icon: Users },
    ]

    type ServiceItem = {
        href: string
        label: string
        desc: string
        icon: React.ElementType
        badge?: string
    }

    const voiceServices: ServiceItem[] = [
        { href: "/services/ai-voice-bot", label: "AI Voice Bot", desc: "Intelligent voice automation", icon: Bot },
        { href: "/services/voice-ai-business", label: "Voice AI for Business", desc: "Enterprise solutions", icon: TrendingUp },
        { href: "/services/voice-automation-software", label: "Voice Automation", desc: "Workflow automation", icon: Zap },
        { href: "/services/conversational-ai", label: "Conversational AI", desc: "Natural conversations", icon: Activity },
    ]

    const aiServices: ServiceItem[] = [
        { href: "/services/ai-customer-support", label: "AI Customer Support", desc: "24/7 assistance", icon: Sparkles },
        { href: "/services/ai-call-center", label: "AI Call Center", desc: "Call automation", icon: Phone },
        { href: "/services/ai-sales-agent", label: "AI Sales Agent", desc: "Sales automation", icon: BarChart3 },
        { href: "/services/ai-virtual-receptionist", label: "Virtual Receptionist", desc: "Front desk AI", icon: Sparkles },
        { href: "/services/whatsapp-bot", label: "WhatsApp Bot", desc: "Automated messaging 24/7", icon: MessageCircle, badge: "NEW" },
    ]

    return (
        <>
            <style suppressHydrationWarning>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .hdr-root { font-family: 'Plus Jakarta Sans', sans-serif; }

                .hdr-bar {
                    background: rgba(255,255,255,0.82);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(0,0,0,0.07);
                }
                .hdr-bar-scrolled {
                    background: rgba(255,255,255,0.97);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border-bottom: 1px solid rgba(234,88,12,0.15);
                    box-shadow: 0 2px 30px rgba(0,0,0,0.08);
                }
                .hdr-mega {
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 18px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.11), 0 4px 16px rgba(234,88,12,0.05);
                }
                .hdr-sol-item {
                    display: flex; align-items: center; gap: 10px;
                    padding: 10px 12px; border-radius: 10px;
                    border: 1px solid transparent;
                    transition: all 0.16s ease;
                    text-decoration: none; color: #374151;
                }
                .hdr-sol-item:hover {
                    background: #fff7ed;
                    border-color: rgba(234,88,12,0.18);
                    color: #ea580c;
                }
                .hdr-sol-item:hover .sol-icon {
                    background: linear-gradient(135deg,#f97316,#ea580c);
                    color: white;
                }
                .sol-icon {
                    width:34px; height:34px; border-radius:8px;
                    background:#fff7ed; display:flex; align-items:center; justify-content:center;
                    color:#f97316; flex-shrink:0; transition:all 0.16s ease;
                }
                .hdr-svc-item {
                    display:flex; align-items:center; gap:10px;
                    padding:9px 10px; border-radius:10px;
                    transition:all 0.15s ease;
                    text-decoration:none; color:#374151;
                }
                .hdr-svc-item:hover { background:#fff7ed; color:#ea580c; }
                .hdr-svc-item:hover .svc-icon {
                    background: linear-gradient(135deg,#f97316,#ea580c);
                    color:white;
                }
                .svc-icon {
                    width:32px; height:32px; border-radius:8px;
                    background:#f3f4f6; display:flex; align-items:center; justify-content:center;
                    color:#f97316; flex-shrink:0; transition:all 0.15s ease;
                }
                .wa-item:hover { background:#f0fdf4 !important; color:#16a34a !important; }
                .wa-item:hover .svc-icon { background:linear-gradient(135deg,#25D366,#128C7E) !important; color:white !important; }
                .wa-icon-base { background:#f0fdf4 !important; color:#25D366 !important; }
                .wa-badge {
                    font-size:9px; font-weight:700; padding:1px 5px; border-radius:4px;
                    background:linear-gradient(135deg,#25D366,#128C7E); color:white;
                    letter-spacing:.05em; box-shadow:0 2px 8px rgba(37,211,102,.3);
                }
                .hdr-nav-link {
                    position:relative; padding:8px 14px;
                    font-size:14px; font-weight:550; color:#374151;
                    text-decoration:none; transition:color 0.16s; border-radius:8px;
                }
                .hdr-nav-link:hover,.hdr-nav-link.active { color:#ea580c; }
                .hdr-nav-link::after {
                    content:''; position:absolute; bottom:2px; left:50%;
                    transform:translateX(-50%); width:0; height:2px; border-radius:99px;
                    background:linear-gradient(90deg,#f97316,#ea580c);
                    transition:width 0.2s ease;
                }
                .hdr-nav-link:hover::after,.hdr-nav-link.active::after { width:70%; }
                .hdr-trigger {
                    display:flex; align-items:center; gap:4px; padding:8px 14px;
                    font-size:14px; font-weight:550; color:#374151;
                    background:none; border:none; cursor:pointer; border-radius:8px;
                    position:relative; transition:color 0.16s;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .hdr-trigger:hover { color:#ea580c; }
                .hdr-trigger::after {
                    content:''; position:absolute; bottom:2px; left:50%;
                    transform:translateX(-50%); width:0; height:2px; border-radius:99px;
                    background:linear-gradient(90deg,#f97316,#ea580c);
                    transition:width 0.2s ease;
                }
                .hdr-trigger:hover::after { width:70%; }
                .hdr-cta {
                    display:flex; align-items:center; gap:6px; padding:9px 20px;
                    background:linear-gradient(135deg,#f97316,#ea580c); color:white;
                    font-size:13.5px; font-weight:600; border-radius:10px;
                    text-decoration:none; transition:all 0.2s ease;
                    box-shadow:0 4px 14px rgba(234,88,12,.28);
                }
                .hdr-cta:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(234,88,12,.38); }
                .hdr-social {
                    width:36px; height:36px; border-radius:9px;
                    display:flex; align-items:center; justify-content:center;
                    transition:all 0.18s ease; text-decoration:none;
                }
                .hdr-social:hover { transform:translateY(-2px); }
                .left-panel {
                    background:linear-gradient(160deg,#fff7ed 0%,#ffedd5 100%);
                    border-right:1px solid rgba(234,88,12,.1);
                }
                .sec-label {
                    font-size:10px; font-weight:700; letter-spacing:.08em;
                    color:#9ca3af; text-transform:uppercase; margin-bottom:8px;
                }
            `}</style>

            <header className={cn("hdr-root fixed top-0 w-full z-50 transition-all duration-400", isScrolled ? "hdr-bar-scrolled" : "hdr-bar")}>
                <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[66px]">

                        {/* Logo */}
                        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            <Link href="/" className="flex items-center group" onClick={() => setIsMenuOpen(false)}>
                                <Image
                                    src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                                    alt="DigitalBot.AI"
                                    width={1450} height={460} priority
                                    className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>
                        </motion.div>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {/* Home Link */}
                            <Link href="/" className={cn("hdr-nav-link", pathname === "/" && "active")}>
                                Home
                            </Link>

                            {/* Solutions Dropdown */}
                            <div className="relative" onMouseEnter={() => setActiveDropdown("solutions")} onMouseLeave={() => setActiveDropdown(null)}>
                                <button className="hdr-trigger">
                                    WhatsApp Bot Services
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === "solutions" && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === "solutions" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[520px]"
                                        >
                                            <div className="hdr-mega overflow-hidden">
                                                <div className="px-6 pt-5 pb-3 border-b border-gray-100">
                                                    <p className="text-[13px] font-bold text-slate-800">WhatsApp Bot Services by Industry</p>
                                                    <p className="text-[11.5px] text-slate-400 mt-0.5">AI-powered WhatsApp automation for every sector</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 p-4">
                                                    {solutions.map((sol) => {
                                                        const Icon = sol.icon
                                                        return (
                                                            <Link key={sol.href} href={sol.href} className="hdr-sol-item">
                                                                <span className="sol-icon"><Icon className="w-4 h-4" /></span>
                                                                <span className="text-[13px] font-[550]">{sol.label}</span>
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                                <div className="px-4 pb-4">
                                                    <Link href="/solutions" className="flex items-center justify-center w-full py-2.5 rounded-xl text-[12.5px] font-semibold text-orange-600 border border-orange-200 hover:bg-orange-50 transition-colors">
                                                        View All Solutions →
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Services Dropdown */}
                            <div className="relative" onMouseEnter={() => setActiveDropdown("services")} onMouseLeave={() => setActiveDropdown(null)}>
                                <button className="hdr-trigger">
                                    Voice Agent Service
                                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", activeDropdown === "services" && "rotate-180")} />
                                </button>
                                <AnimatePresence>
                                    {activeDropdown === "services" && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 top-full pt-3 w-[760px]"
                                        >
                                            <div className="hdr-mega overflow-hidden flex">
                                                {/* Left accent */}
                                                <div className="left-panel w-[210px] p-6 flex-shrink-0">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                                                        <Zap className="w-3 h-3" /> AI POWERED
                                                    </span>
                                                    <h3 className="mt-3 text-[16px] font-bold text-slate-900 leading-snug">
                                                        Solutions That Drive<br />
                                                        <span className="text-orange-500">Business Growth</span>
                                                    </h3>
                                                    <p className="mt-2 text-[11.5px] text-slate-500 leading-relaxed">
                                                        Voice AI, WhatsApp automation & intelligent support — all in one platform.
                                                    </p>
                                                    <Link
                                                        href="/contact#contact-form"
                                                        className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 text-white text-[12px] font-semibold rounded-lg transition-all"
                                                        style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 12px rgba(234,88,12,.25)" }}
                                                    >
                                                        <Sparkles className="w-3.5 h-3.5" /> Request a Demo
                                                    </Link>
                                                </div>

                                                {/* Voice */}
                                                <div className="flex-1 p-5 border-r border-gray-100">
                                                    <div className="sec-label">Voice Solutions</div>
                                                    <div className="space-y-0.5">
                                                        {voiceServices.map((s) => {
                                                            const Icon = s.icon
                                                            return (
                                                                <Link key={s.href} href={s.href} className="hdr-svc-item">
                                                                    <span className="svc-icon"><Icon className="w-3.5 h-3.5" /></span>
                                                                    <div>
                                                                        <div className="text-[13px] font-[550]">{s.label}</div>
                                                                        <div className="text-[11px] text-slate-400">{s.desc}</div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* AI + WhatsApp */}
                                                <div className="flex-1 p-5">
                                                    <div className="sec-label">AI Services</div>
                                                    <div className="space-y-0.5">
                                                        {aiServices.map((s) => {
                                                            const Icon = s.icon
                                                            const isWA = s.href.includes("whatsapp")
                                                            return (
                                                                <Link key={s.href} href={s.href} className={cn("hdr-svc-item", isWA && "wa-item")}>
                                                                    <span className={cn("svc-icon", isWA && "wa-icon-base")}>
                                                                        <Icon className="w-3.5 h-3.5" />
                                                                    </span>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-[13px] font-[550]">{s.label}</span>
                                                                            {s.badge && <span className="wa-badge">{s.badge}</span>}
                                                                        </div>
                                                                        <div className="text-[11px] text-slate-400">{s.desc}</div>
                                                                    </div>
                                                                </Link>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                                                        <Link
                                                            href="/services/leads"
                                                            className="flex items-center gap-1.5 px-3.5 py-2 text-white text-[12px] font-semibold rounded-lg transition-all"
                                                            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}
                                                        >
                                                            <BarChart3 className="w-3.5 h-3.5" /> Lead Analysis
                                                        </Link>
                                                        <Link
                                                            href="/services/appointments"
                                                            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-orange-50 text-slate-600 hover:text-orange-600 text-[12px] font-semibold rounded-lg transition-all"
                                                        >
                                                            <Phone className="w-3.5 h-3.5" /> Appointments
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Other Nav Items */}
                            {navItems.filter(item => item.href !== "/").map((item) => (
                                <Link key={item.href} href={item.href} className={cn("hdr-nav-link", pathname === item.href && "active")}>
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Right: Contact Us + CTA */}
                        <div className="hidden lg:flex items-center gap-2.5">
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105"
                                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 2px 10px rgba(234,88,12,.3)" }}
                            >
                                <Phone className="w-3.5 h-3.5" /> Contact Us
                            </Link>
                            <Link href="/login" className="hdr-cta">
                                <Sparkles className="w-3.5 h-3.5" /> Login
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.22 }}
                                className="lg:hidden overflow-hidden bg-white border-t border-gray-100 rounded-b-2xl"
                            >
                                <nav className="py-4 space-y-0.5 px-2">
                                    {/* Home Link */}
                                    <Link
                                        href="/"
                                        className={cn(
                                            "block px-4 py-3 text-sm font-[550] rounded-xl transition-colors",
                                            pathname === "/"
                                                ? "bg-orange-50 text-orange-600"
                                                : "text-slate-600 hover:bg-orange-50/70 hover:text-orange-600"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>

                                    {/* Mobile Solutions */}
                                    <div className="pt-3 mt-2 border-t border-gray-100">
                                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">WhatsApp Bot Services</div>
                                        <div className="grid grid-cols-2 gap-0.5 max-h-[400px] overflow-y-auto">
                                            {solutions.map((sol) => (
                                                <Link
                                                    key={sol.href} href={sol.href}
                                                    className="block px-4 py-2.5 text-[13px] font-[500] text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                                                    onClick={() => setIsMenuOpen(false)}
                                                >
                                                    {sol.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mobile Services */}
                                    <div className="pt-3 mt-2 border-t border-gray-100">
                                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voice Agent Service</div>
                                        {[...voiceServices, ...aiServices].map((s) => (
                                            <Link
                                                key={s.href} href={s.href}
                                                className="flex items-center gap-2 px-4 py-2.5 text-[13px] text-slate-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-colors"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {s.label}
                                                {s.badge && <span className="wa-badge">{s.badge}</span>}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Other Nav Items */}
                                    <div className="pt-3 mt-2 border-t border-gray-100">
                                        {navItems.filter(item => item.href !== "/").map((item) => (
                                            <Link
                                                key={item.href} href={item.href}
                                                className={cn(
                                                    "block px-4 py-3 text-sm font-[550] rounded-xl transition-colors",
                                                    pathname === item.href
                                                        ? "bg-orange-50 text-orange-600"
                                                        : "text-slate-600 hover:bg-orange-50/70 hover:text-orange-600"
                                                )}
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Mobile Contact Us */}
                                    <div className="pt-4 flex items-center justify-center">
                                        <Link
                                            href="/contact"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                                            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 14px rgba(234,88,12,.3)" }}
                                        >
                                            <Phone className="w-5 h-5" /> Contact Us
                                        </Link>
                                    </div>

                                    {/* Mobile CTA */}
                                    <div className="pt-2 px-2 pb-2">
                                        <Link
                                            href="/login"
                                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold text-white"
                                            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 14px rgba(234,88,12,.3)" }}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <Sparkles className="w-4 h-4" /> Get Started Free
                                        </Link>
                                    </div>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </header>

        </>
    )
}