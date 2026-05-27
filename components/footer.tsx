import { ArrowRight, Award, Clock, Linkedin, Mail, Phone, Shield, TrendingUp, Twitter } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {

  const features = [
    { icon: Clock, text: "24/7 Availability", color: "orange" },
    { icon: Shield, text: "Enterprise Security", color: "orange" },
    { icon: Award, text: "Award Winning", color: "orange" },
    { icon: TrendingUp, text: "ROI Guaranteed", color: "orange" },
  ]

  return (
    <footer className="relative isolate overflow-hidden bg-white">
      <div className="relative z-10 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end py-8">
            <Link
              href="/contact#contact-form"
              className="inline-flex w-fit items-center gap-3 rounded-xl bg-white px-8 py-4 text-sm font-bold uppercase tracking-widest text-orange-500 shadow-lg shadow-orange-100/70 ring-1 ring-orange-200 transition-all duration-300 hover:-translate-y-0.5 hover:text-orange-600"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">

          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-4 space-y-6">
            <div className="group relative inline-block">
              <Link href="/" className="block">
                {/* Glow effect - orange */}
                <div className="absolute -inset-6 bg-orange-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <Image
                  src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                  alt="DigitalBot.AI - AI Voice Assistant Platform"
                  width={320}
                  height={70}
                  loading="lazy"
                  quality={95}
                  className="h-16 w-auto relative z-10 transition-all duration-500 group-hover:scale-110"
                />
              </Link>
            </div>

            <p className="text-zinc-300 leading-relaxed text-base pr-4">
              Leading <span className="font-bold text-gradient">AI VOICE ASSISTANT PLATFORM</span> trusted by enterprises worldwide.
              Transform customer interactions with intelligent automation.
            </p>



            {/* Enhanced Social Media - Colorful */}
            <div>
              <h4 className="text-sm font-bold mb-5 flex items-center gap-2 uppercase tracking-widest">
                <span className="text-orange-500">CONNECT WITH US</span>
              </h4>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, link: "https://twitter.com/digitalbot_ai", label: "Twitter", bg: "bg-orange-500", hover: "hover:bg-orange-600", shadow: "shadow-orange-500/30" },
                  { icon: Linkedin, link: "https://linkedin.com/company/digitalbot-ai", label: "LinkedIn", bg: "bg-orange-600", hover: "hover:bg-orange-700", shadow: "shadow-orange-500/30" },
                  { icon: Phone, link: "/contact", label: "Contact Us", bg: "bg-orange-500", hover: "hover:bg-orange-600", shadow: "shadow-orange-500/30" },
                  { icon: Mail, link: "mailto:Hello@digitalbot.ai", label: "Email", bg: "bg-orange-500", hover: "hover:bg-orange-600", shadow: "shadow-orange-500/30" },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.link}
                    target={social.link.startsWith("http") || social.link.startsWith("mailto") ? "_blank" : undefined}
                    rel={social.link.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={social.label}
                    className="group/social relative"
                  >
                    <div className={`p-3 ${social.bg} ${social.hover} rounded-2xl text-white shadow-lg ${social.shadow} hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-[10px] rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none font-semibold tracking-wide">
                      {social.label}
                    </span>
                  </Link>
                ))}
              </div>
              {/* Quick Contact Info */}
              <div className="mt-6 space-y-2.5">
                <a href="mailto:Hello@digitalbot.ai" className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-orange-400 transition-colors group">
                  <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  Hello@digitalbot.ai
                </a>
                <a href="tel:+919880774053" className="flex items-center gap-2.5 text-sm text-zinc-400 hover:text-orange-400 transition-colors group">
                  <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  +91 7892518414
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced AI Services Grid - Orange theme */}
          <div className="lg:col-span-8">
            {/* Quick Links - orange */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {[
                { title: "Product", links: [
                  { name: "Features", href: "/services" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "Integration", href: "/integrations" }
                ]},
                { title: "Company", links: [
                  { name: "About Us", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" }
                ]},
                { title: "Resources", links: [
                  { name: "Tutorials", href: "/tutorials" },
                  { name: "Case Studies", href: "/case-studies" },
                  { name: "Webinars", href: "/webinars" }
                ]},
                { title: "Legal", links: [
                  { name: "Privacy policy", href: "/privacy" },
                  { name: "Terms", href: "/terms" },
                  { name: "Security", href: "/security" },
                  { name: "Compliance", href: "/compliance" }
                ]}
              ].map((column, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-white mb-4 text-sm flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-1 h-4 bg-gradient-to-b from-orange-500 via-orange-500 to-orange-600 rounded-full" />
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.href}
                          className="text-sm text-zinc-400 hover:text-orange-400 transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span className="w-0 h-px bg-gradient-to-r from-orange-500 to-orange-600 group-hover:w-4 transition-all duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Bar - orange */}
        <div className="border-t border-white/10 pt-5 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Enhanced Copyright with Animation - Orange theme */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/20" />
              </div>
              <p className="text-zinc-300 text-sm font-semibold">
                © 2025 <span className="font-bold text-gradient">DIGITALBOT.AI</span> • ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Enhanced Badges - orange */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="px-4 py-2 bg-white/5 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-white/10">
                <Shield className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest">SOC 2 CERTIFIED</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-white/10">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest">99.9% UPTIME</span>
              </div>
              <div className="px-4 py-2 bg-white/5 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-white/10">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-zinc-200 uppercase tracking-widest">TRUSTED BY 10K+</span>
              </div>
            </div>
          </div>


        </div>
        </div>
      </div>
    </footer>
  )
}
