"use client"

import { ArrowRight, Award, Clock, Linkedin, Mail, Phone, Shield, Sparkles, TrendingUp, Twitter } from "lucide-react"
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
    <footer className="relative bg-white border-t border-gray-200 overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Enhanced Premium Feature Banner - Orange theme */}
        <div className="py-3 mb-2">
          <div className="relative glass-strong bg-gradient-to-r from-orange-500/90 via-orange-600/90 to-orange-600/90 rounded-3xl p-8 shadow-2xl shadow-orange-500/20 overflow-hidden group border border-orange-400/20">
            {/* Enhanced Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tl from-white/15 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Start Your AI Journey Today
                </h3>
                <p className="text-white/80 text-sm md:text-base font-medium">
                  Join 10,000+ businesses automating customer interactions with AI
                </p>
              </div>
              <Link
                href="/contact#contact-form"
                className="group/btn px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-3 whitespace-nowrap border border-orange-200/30 uppercase tracking-widest"
              >
                <span className="text-orange-600">
                  GET STARTED FREE
                </span>
                <ArrowRight className="w-5 h-5 text-orange-600 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">

          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-4 space-y-6">
            <div className="group relative inline-block">
              <Link href="/" className="block">
                {/* Glow effect - orange */}
                <div className="absolute -inset-6 bg-gradient-to-r from-orange-500/40 via-orange-600/40 to-orange-600/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
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

            <p className="text-slate-600 leading-relaxed text-base pr-4">
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
                  { icon: Mail, link: "mailto:contact@digitalbot.ai", label: "Email", bg: "bg-orange-500", hover: "hover:bg-orange-600", shadow: "shadow-orange-500/30" },
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
                <a href="mailto:contact@digitalbot.ai" className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-orange-500 transition-colors group">
                  <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  contact@digitalbot.ai
                </a>
                <a href="tel:+918000000000" className="flex items-center gap-2.5 text-sm text-slate-500 hover:text-orange-500 transition-colors group">
                  <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                  +91 80000 00000
                </a>
              </div>
            </div>
          </div>

          {/* Enhanced AI Services Grid - Orange theme */}
          <div className="lg:col-span-8">
            {/* Quick Links - orange */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-orange-100/30">
              {[
                { title: "Product", links: [
                  { name: "Features", href: "/services" },
                  { name: "Pricing", href: "/pricing" },
                  { name: "API Docs", href: "/docs" },
                  { name: "Integration", href: "/services#api" }
                ]},
                { title: "Company", links: [
                  { name: "About Us", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Careers", href: "/careers" },
                  { name: "Contact", href: "/contact" }
                ]},
                { title: "Resources", links: [
                  { name: "Tutorials", href: "/docs" },
                  { name: "Case Studies", href: "/blog" },
                  { name: "Webinars", href: "/blog" }
                ]},
                { title: "Legal", links: [
                  { name: "Privacy policy", href: "/privacy" },
                  { name: "Terms", href: "/terms" },
                  { name: "Security", href: "/security" },
                  { name: "Compliance", href: "/compliance" }
                ]}
              ].map((column, idx) => (
                <div key={idx}>
                  <h4 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-1 h-4 bg-gradient-to-b from-orange-500 via-orange-500 to-orange-600 rounded-full" />
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-500 hover:text-orange-600 transition-colors duration-300 flex items-center gap-2 group"
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
        <div className="border-t border-orange-100/30 pt-5 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Enhanced Copyright with Animation - Orange theme */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 via-orange-500 to-orange-600 shadow-lg shadow-orange-500/20" />
              </div>
              <p className="text-slate-600 text-sm font-semibold">
                © 2025 <span className="font-bold text-gradient">DIGITALBOT.AI</span> • ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Enhanced Badges - orange */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="px-4 py-2 glass-card rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-orange-200/30">
                <Shield className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">SOC 2 CERTIFIED</span>
              </div>
              <div className="px-4 py-2 glass-card rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-orange-200/30">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">99.9% UPTIME</span>
              </div>
              <div className="px-4 py-2 glass-card rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 border border-orange-200/30">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">TRUSTED BY 10K+</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </footer>
  )
}


