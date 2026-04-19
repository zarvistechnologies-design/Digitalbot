"use client"

import { ArrowRight, Globe, HeadphonesIcon, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

export function CTA() {
  return (
    <section className="relative py-12 sm:py-16 overflow-hidden bg-white">

      <div className="mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left — Image */}
          <div className="relative flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              <img
                src="https://www.chatbot.com/images/solutions/single/ai-subscription-chat.3963efd0f35593846e6c0d5d7306142a40210baa8804913d24cd4b293b915285.webp"
                alt="AI-powered business communication platform"
                className="relative w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right — Content */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-semibold text-orange-700 uppercase tracking-wide">The Future of Customer Engagement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
              One Platform.{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Every Conversation.
              </span>
              <br />
              Zero Missed Opportunities.
            </h2>

            <p className="text-lg text-slate-500 leading-relaxed max-w-lg">
              From AI voice calls to WhatsApp automation and smart dashboards — DigitalBot unifies every customer touchpoint into one intelligent, always-on platform.
            </p>

            {/* Feature pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Zap, label: "Voice AI Agents" },
                { icon: Globe, label: "WhatsApp Bots" },
                { icon: HeadphonesIcon, label: "24/7 Support" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                  <item.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/contact#contact-form"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 text-sm"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3.5 text-slate-900 font-semibold rounded-xl border border-slate-300 hover:border-orange-300 hover:text-orange-600 transition-all text-sm"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


