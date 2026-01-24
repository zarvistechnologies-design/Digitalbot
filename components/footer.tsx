"use client"

import { ArrowRight, Award, Bot, Building2, Clock, Facebook, Globe, HeadphonesIcon, Instagram, Linkedin, Mail, MessageSquare, Phone, Shield, Sparkles, TrendingUp, Twitter, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Footer() {

  const services = [
    { name: "AI Voice Bot", href: "/services/ai-voice-bot", icon: Bot, gradient: "from-blue-400 to-blue-500", description: "24/7 automated voice assistance" },
    { name: "Voice AI for Business", href: "/services/voice-ai-business", icon: Building2, gradient: "from-blue-300 to-blue-500", description: "Enterprise AI solutions" },
    { name: "Voice Automation", href: "/services/voice-automation-software", icon: Zap, gradient: "from-blue-400 to-blue-600", description: "Streamline workflows" },
    { name: "AI Customer Support", href: "/services/ai-customer-support", icon: HeadphonesIcon, gradient: "from-blue-300 to-blue-600", description: "Smart support system" },
    { name: "Conversational AI", href: "/services/conversational-ai", icon: MessageSquare, gradient: "from-blue-400 to-blue-500", description: "Natural conversations" },
    { name: "AI Call Center", href: "/services/ai-call-center", icon: Phone, gradient: "from-blue-300 to-blue-500", description: "Automated call handling" },
    { name: "AI Sales Agent", href: "/services/ai-sales-agent", icon: Users, gradient: "from-blue-400 to-blue-600", description: "Boost sales conversions" },
    { name: "Virtual Receptionist", href: "/services/ai-virtual-receptionist", icon: Sparkles, gradient: "from-blue-300 to-blue-600", description: "Professional front desk AI" },
  ]

  const features = [
    { icon: Clock, text: "24/7 Availability", color: "cyan" },
    { icon: Shield, text: "Enterprise Security", color: "teal" },
    { icon: Award, text: "Award Winning", color: "cyan" },
    { icon: TrendingUp, text: "ROI Guaranteed", color: "cyan" },
  ]

  return (
    <footer className="relative bg-white border-t-2 border-blue-400/25 overflow-hidden">
      {/* Pure white background, all blue gradients and orbs removed for consistency */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Enhanced Premium Feature Banner - Purple/blue */}
        <div className="py-12 mb-8">
          <div className="relative bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 rounded-3xl p-8 shadow-2xl shadow-blue-400/50 overflow-hidden group border-2 border-blue-400/30">
            {/* Enhanced Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Decorative sparkles */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/30 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tl from-blue-400/30 to-transparent rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-gray-900">
                <h3 className="text-lg md:text-xl font-bold mb-2 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Start Your AI Journey Today
                </h3>
                <p className="text-gray-900/90 text-sm md:text-base font-medium">
                  Join 10,000+ businesses automating customer interactions with AI
                </p>
              </div>
              <Link
                href="/signup"
                className="group/btn px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 whitespace-nowrap border-2 border-blue-400/30 uppercase tracking-widest"
              >
                <span className="text-blue-600">
                  GET STARTED FREE
                </span>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-12">

          {/* Brand Section - Enhanced */}
          <div className="lg:col-span-4 space-y-6">
            <div className="group relative inline-block">
              <Link href="/" className="block">
                {/* Glow effect - blue */}
                <div className="absolute -inset-6 bg-gradient-to-r from-blue-400/40 via-blue-300/40 to-blue-500/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
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

            <p className="text-gray-900 leading-relaxed text-base pr-4">
              Leading <span className="font-bold bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">AI VOICE ASSISTANT PLATFORM</span> trusted by enterprises worldwide.
              Transform customer interactions with intelligent automation.
            </p>

            {/* Enhanced Trust Badges - Purple/blue */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, idx) => {
                const colors = [
                  { bg: 'from-white/90 via-white/95 to-white', border: 'border-blue-400/50 hover:border-blue-300', icon: 'from-blue-400 to-blue-500', shadow: 'hover:shadow-blue-400/30' },
                  { bg: 'from-white/90 via-white/95 to-white', border: 'border-blue-400/50 hover:border-blue-300', icon: 'from-blue-300 to-blue-600', shadow: 'hover:shadow-blue-400/30' },
                  { bg: 'from-white/90 via-white/95 to-white', border: 'border-blue-400/50 hover:border-blue-300', icon: 'from-blue-400 to-blue-500', shadow: 'hover:shadow-blue-400/30' },
                  { bg: 'from-white/90 via-white/95 to-white', border: 'border-blue-400/50 hover:border-blue-300', icon: 'from-blue-300 to-blue-600', shadow: 'hover:shadow-blue-400/30' },
                ]
                const colorSet = colors[idx]
                return (
                  <div key={idx} className={`flex items-center gap-2 p-3 bg-white/90 backdrop-blur-sm rounded-xl border-2 ${colorSet.border} shadow-md ${colorSet.shadow} transition-all duration-300 group hover:scale-105`}>
                    <div className={`p-2 bg-gradient-to-br ${colorSet.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-4 h-4 text-blue-600`} />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide">{feature.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Enhanced Social Media - Purple/blue */}
            <div>
              <h4 className="text-sm font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-2 uppercase tracking-widest">
                <Globe className="w-4 h-4 text-blue-600" />
                CONNECT WITH US
              </h4>
              <div className="flex items-center gap-2">
                {[
                  { icon: Twitter, link: "https://twitter.com/digitalbot_ai", label: "Twitter", color: "from-blue-400 to-blue-500" },
                  { icon: Linkedin, link: "https://linkedin.com/company/digitalbot-ai", label: "LinkedIn", color: "from-blue-300 to-blue-600" },
                  { icon: Instagram, link: "https://www.instagram.com/digitalbot._ai?utm_source=qr&igsh=MTc3emoxbmdqdmVz", label: "Instagram", color: "from-blue-400 to-blue-500" },
                  { icon: Facebook, link: "https://www.facebook.com/profile.php?id=61583885495540", label: "Facebook", color: "from-blue-300 to-blue-600" },
                  { icon: Mail, link: "mailto:contact@digitalbot.ai", label: "Email", color: "from-blue-400 to-blue-500" }
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group/social relative"
                  >
                    <div className={`p-3 bg-gradient-to-br ${social.color} rounded-xl text-white shadow-lg hover:shadow-2xl hover:shadow-blue-400/50 transition-all duration-300 hover:scale-125 hover:rotate-12 border border-blue-400/30`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    {/* Enhanced Tooltip */}
                    <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none shadow-xl border border-blue-500 font-bold uppercase tracking-wide">
                      {social.label}
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced AI Services Grid - Purple/blue */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 rounded-xl shadow-lg shadow-blue-400/30 animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-widest">
                  AI-POWERED SOLUTIONS
                </h3>
              </div>
              <p className="text-gray-900 text-sm font-medium">Explore our comprehensive suite of AI voice automation services</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
              {services.map((service, idx) => {
                const Icon = service.icon
                const colorSets = [
                  { gradient: 'from-blue-400 via-blue-300 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/90 to-white/80' },
                  { gradient: 'from-blue-300 via-blue-400 to-blue-600', border: 'border-blue-400/50', iconBg: 'from-white/80 to-white/70' },
                  { gradient: 'from-blue-400 via-blue-400 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/90 to-white/80' },
                  { gradient: 'from-blue-300 via-blue-400 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/80 to-white/70' },
                  { gradient: 'from-blue-400 via-blue-300 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/90 to-white/80' },
                  { gradient: 'from-blue-300 via-blue-400 to-blue-600', border: 'border-blue-400/50', iconBg: 'from-white/80 to-white/70' },
                  { gradient: 'from-blue-400 via-blue-400 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/90 to-white/80' },
                  { gradient: 'from-blue-300 via-blue-400 to-blue-500', border: 'border-blue-400/50', iconBg: 'from-white/80 to-white/70' },
                ]
                const colorSet = colorSets[idx % colorSets.length]
                return (
                  <Link
                    key={idx}
                    href={service.href}
                    className="group/card relative"
                  >
                    <div className={`
                      relative p-5 rounded-2xl border-2 transition-all duration-500 overflow-hidden h-full
                      bg-white/90 backdrop-blur-sm ${colorSet.border} hover:border-transparent shadow-md hover:shadow-xl hover:shadow-blue-400/30
                      hover:bg-gradient-to-br hover:${colorSet.gradient} hover:scale-105 hover:-translate-y-2
                    `}>
                      {/* Icon with enhanced animation */}
                      <div className={`
                        mb-3 p-3 rounded-xl transition-all duration-500
                        bg-gradient-to-br ${colorSet.iconBg}
                        group-hover/card:bg-blue-400/30 group-hover/card:backdrop-blur-md group-hover/card:scale-110 group-hover/card:rotate-12
                      `}>
                        <Icon className="w-6 h-6 text-blue-600 transition-all duration-500 group-hover/card:text-white group-hover/card:scale-110" />
                      </div>

                      {/* Text */}
                      <h4 className="font-bold text-sm mb-1 text-gray-900 transition-colors duration-500 group-hover/card:text-white uppercase tracking-wide">
                        {service.name}
                      </h4>
                      <p className="text-xs text-gray-900 transition-colors duration-500 group-hover/card:text-white/90">
                        {service.description}
                      </p>

                      {/* Enhanced Arrow indicator with pulse */}
                      <div className="absolute top-4 right-4 opacity-0 -translate-x-2 transition-all duration-500 group-hover/card:opacity-100 group-hover/card:translate-x-0 group-hover/card:scale-110">
                        <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                      </div>

                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent -translate-x-full group-hover/card:animate-shimmer" />
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Quick Links - blue */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t-2 border-blue-400/30">
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
                  <h4 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2 uppercase tracking-widest">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500 rounded-full" />
                    {column.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {column.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          href={link.href}
                          className="text-sm text-gray-900 hover:text-blue-600 transition-colors duration-300 flex items-center gap-2 group"
                        >
                          <span className="w-0 h-px bg-gradient-to-r from-blue-400 to-blue-500 group-hover:w-4 transition-all duration-300" />
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

        {/* Enhanced Bottom Bar - blue */}
        <div className="border-t-2 border-blue-400/50 pt-8 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Enhanced Copyright with Animation - Purple/blue */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 animate-ping absolute" />
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 shadow-lg shadow-blue-400/30" />
              </div>
              <p className="text-gray-900 text-sm font-semibold">
                © 2025 <span className="font-bold bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">DIGITALBOT.AI</span> • ALL RIGHTS RESERVED
              </p>
            </div>

            {/* Enhanced Badges - blue */}
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <div className="px-4 py-2 bg-gradient-to-r from-white/90 via-white/95 to-white backdrop-blur-sm border-2 border-blue-400/50 hover:border-blue-300 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-400/30">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">SOC 2 CERTIFIED</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-white/90 via-white/95 to-white backdrop-blur-sm border-2 border-blue-400/50 hover:border-blue-300 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-400/30">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">99.9% UPTIME</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-white/90 via-white/95 to-white backdrop-blur-sm border-2 border-blue-400/50 hover:border-blue-300 rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-400/30">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">TRUSTED BY 10K+</span>
              </div>
            </div>
          </div>

          {/* Enhanced Tagline - blue */}
          <div className="mt-6 text-center">
            <div className="text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 flex-wrap">
              <span className="text-gray-900">🤖</span>
              <p className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                POWERED BY ADVANCED AI • BUILT FOR ENTERPRISE • TRUSTED WORLDWIDE • NEVER SLEEPS, NEVER QUITS
              </p>
              <span className="text-gray-900">✨</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


