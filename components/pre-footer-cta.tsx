"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function PreFooterCTA() {
  return (
    <section className="pt-4 pb-2 sm:pt-6 sm:pb-3 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          {/* Left — Text Only */}
          <div className="flex-1 w-full">
            <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">AI That Never Sleeps</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
              <span className="text-slate-900">Stop losing customers.</span>{" "}
              <span className="text-orange-500">Start converting 24/7.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              Every missed call is a missed sale. Let AI handle your calls, WhatsApp, and bookings — while you focus on growing your business.
            </p>

            <div className="flex flex-wrap gap-8 mb-8">
              {[
                { val: "10x", label: "Faster Response" },
                { val: "90%", label: "Cost Savings" },
                { val: "24/7", label: "Always Online" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-extrabold text-slate-900">{s.val}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact#contact-form"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-orange-500/20 hover:bg-orange-600 hover:shadow-xl hover:scale-105 transition-all text-base"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="https://wa.me/919082393950?text=Hi%20I%20want%20to%20book%20a%20free%20demo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-800 font-semibold px-7 py-3.5 rounded-full hover:border-orange-300 hover:text-orange-600 transition-all text-base"
              >
                <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </Link>
            </div>
          </div>

          {/* Right — Image */}
          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <img
              src="/jewellery-automated-chat.png"
              alt="Automated Client Communication"
              className="w-full max-w-[680px] h-auto object-contain"
              loading="lazy"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
