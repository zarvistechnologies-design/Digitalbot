"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowRight, Bot, Check, HelpCircle, MessageCircle, Mic, Shield, Star, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Animated counter
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

function WhatsAppLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="currentColor">
      <path d="M16.04 3C8.9 3 3.1 8.73 3.1 15.8c0 2.27.6 4.48 1.75 6.42L3 29l6.98-1.82a13.1 13.1 0 0 0 6.06 1.5c7.14 0 12.95-5.74 12.95-12.8C29 8.73 23.18 3 16.04 3Zm0 23.5c-1.9 0-3.76-.5-5.39-1.45l-.39-.23-4.14 1.08 1.1-4.01-.26-.41a10.52 10.52 0 0 1-1.65-5.68c0-5.85 4.82-10.61 10.73-10.61 5.92 0 10.74 4.76 10.74 10.61S21.96 26.5 16.04 26.5Zm5.88-7.95c-.32-.16-1.9-.93-2.2-1.03-.3-.11-.52-.16-.74.16-.21.31-.84 1.03-1.03 1.24-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.84-1.6-1.89-1.8-2.21-.18-.31-.02-.48.14-.64.15-.14.32-.37.48-.56.16-.18.21-.31.32-.52.1-.21.05-.39-.03-.55-.08-.16-.74-1.76-1.01-2.42-.27-.63-.54-.55-.74-.56h-.63c-.21 0-.55.08-.84.4-.3.31-1.1 1.06-1.1 2.6 0 1.53 1.13 3.01 1.29 3.22.16.21 2.22 3.36 5.38 4.71.75.32 1.34.52 1.8.66.75.24 1.44.2 1.98.12.6-.09 1.9-.77 2.16-1.5.27-.75.27-1.38.19-1.51-.08-.13-.3-.21-.62-.37Z" />
    </svg>
  )
}

const plans = [
  {
    name: "Case-based Chatbot",
    icon: MessageCircle,
    useWhatsAppIcon: true,
    description: "Structured WhatsApp automation for teams that need reliable lead handling.",
    monthlyPrice: 799,
    crm: "1 CRM integration",
    tags: ["WhatsApp", "Flows", "Lead routing"],
    features: [
      "WhatsApp automation",
      "Predefined conversation flows",
      "Lead capture & routing",
      "Basic analytics dashboard",
      "Chatbot-triggered responses",
    ],
    popular: false,
    cta: "Start with Chatbot",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "AI Chatbot",
    icon: Bot,
    useWhatsAppIcon: true,
    description: "AI-powered WhatsApp growth suite for campaigns, segmentation, and insights.",
    monthlyPrice: 1999,
    crm: "3 CRM integrations",
    tags: ["NLU", "Broadcasts", "AI insights"],
    features: [
      "Everything in Case-based",
      "Natural language understanding",
      "Multi-intent AI responses",
      "Bulk WhatsApp messaging dashboard",
      "Campaign broadcasts & scheduling",
      "AI analytics & insights",
      "Audience segmentation",
    ],
    popular: true,
    cta: "Choose AI Chatbot",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Voice AI",
    icon: Mic,
    description: "Natural AI voice calls with free minutes, multilingual support, and call intelligence.",
    monthlyPrice: 1400,
    crm: "200 free minutes, then ₹7/min",
    tags: ["Voice calls", "10+ languages", "Sentiment"],
    features: [
      "AI voice conversations",
      "Works on Zonara & all platforms",
      "Multilingual support (10+ languages)",
      "Advanced analytics dashboard",
      "AI call sentiment analysis",
      "Real-time transcription & summaries",
      "Call performance reports",
    ],
    popular: false,
    cta: "Start Voice AI",
    gradient: "from-violet-500 to-indigo-600",
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and our team helps with the transition.",
  },
  {
    question: "What happens after the 200 free Voice AI minutes?",
    answer:
      "Voice AI includes 200 free minutes every month. After that, usage is billed at ₹7 per minute.",
  },
  {
    question: "How many CRM integrations are included?",
    answer:
      "The Case-based Chatbot plan includes 1 CRM integration, while the AI Chatbot plan includes 3 CRM integrations.",
  },
  {
    question: "What languages are supported?",
    answer: "Voice AI supports 10+ languages, so you can handle customer calls across multiple regions and audiences.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a free demo so you can experience the power of our AI voice agents before committing to any plan.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include onboarding support, and our team helps you set up the right workflows, dashboards, and integrations.",
  },
]

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const isYearly = billingCycle === "yearly"
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]">
        {/* Pricing Plans Section */}
        <section id="plans" className="pt-28 pb-20 px-4 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6">
                <Star className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">Choose Your Plan</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                Pick the right automation plan
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
                Clean pricing for chat automation, AI messaging, and voice conversations.
              </p>

              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
                {[
                  { value: "monthly", label: "Monthly" },
                  { value: "yearly", label: "Yearly" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setBillingCycle(option.value as "monthly" | "yearly")}
                    className={`min-w-24 rounded-lg px-5 py-2 text-sm font-semibold transition-all ${
                      billingCycle === option.value
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    aria-pressed={billingCycle === option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`
                    relative flex h-full flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden group
                    hover:shadow-2xl hover:-translate-y-1
                    ${plan.popular
                      ? 'border-emerald-400 shadow-2xl shadow-emerald-100 lg:scale-[1.03]'
                      : 'border-slate-200 shadow-lg hover:border-orange-200'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute right-5 top-5 z-10 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-emerald-200">
                      Most Popular
                    </div>
                  )}

                  <div className={`h-1.5 bg-gradient-to-r ${plan.gradient}`} />

                  <div className="flex h-full flex-col p-6 lg:p-8">
                    <div className="mb-6 flex items-start gap-4 pr-24 md:pr-0 lg:pr-20">
                      <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform shrink-0`}>
                        {plan.useWhatsAppIcon ? (
                          <WhatsAppLogo className="w-8 h-8 text-white" />
                        ) : (
                          <plan.icon className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-500">{plan.description}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-950">
                          {formatPrice(isYearly ? plan.monthlyPrice * 12 : plan.monthlyPrice)}
                        </span>
                        <span className="pb-1.5 text-sm font-medium text-slate-400">
                          /{isYearly ? "year" : "month"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        {isYearly
                          ? `${formatPrice(plan.monthlyPrice)} per month, billed yearly`
                          : "Switch to yearly to see annual charges"}
                      </p>
                      {plan.name !== "Voice AI" && plan.crm && (
                        <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {plan.crm}
                        </p>
                      )}
                    </div>

                    <div className="mb-7 flex flex-wrap gap-2">
                      {plan.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                            plan.popular || plan.useWhatsAppIcon
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              : 'border-orange-100 bg-orange-50 text-orange-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href="/contact#contact-form"
                      className={`
                        flex items-center justify-center gap-2 w-full py-3.5 font-semibold rounded-xl transition-all duration-200 mb-8 group/btn
                        ${plan.popular
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-100'
                          : 'bg-slate-950 hover:bg-slate-800 text-white'
                        }
                      `}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    <div className="mt-auto space-y-3">
                      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">What&apos;s included</p>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center text-sm font-medium text-slate-500">
              All plans include onboarding support &middot; Cancel anytime &middot; GST applicable.
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Secure & Compliant", desc: "SOC 2, GDPR & HIPAA compliant", color: "from-orange-500 to-violet-500", bgColor: "bg-slate-50" },
                { icon: Zap, title: "5-Minute Setup", desc: "No code required, instant deployment", color: "from-violet-500 to-orange-500", bgColor: "bg-slate-50" },
                { icon: Star, title: "Cancel Anytime", desc: "No long-term contracts or commitments", color: "from-emerald-500 to-teal-500", bgColor: "bg-slate-50" },
              ].map((badge, i) => (
                <div key={i} className={`${badge.bgColor} rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all hover:-translate-y-1`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{badge.title}</h3>
                    <p className="text-sm text-slate-500">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white/80 backdrop-blur-sm relative overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-slate-100/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-orange-100/30 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full mb-6">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600 tracking-wide uppercase">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden px-2"
                >
                  <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline py-5 px-4 text-base">
                    <div className="flex items-center gap-4 pr-4">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-orange-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-500 text-sm leading-relaxed pb-5 pl-16 pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-orange-600 to-violet-700">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
              <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies already using DigitalBot to automate their customer communications with AI voice agents.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact#contact-form" className="group px-8 py-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact#contact-form" className="px-8 py-4 bg-orange-500/30 text-white font-medium rounded-xl hover:bg-orange-500/50 transition-all border border-white/30">
                Contact Sales
              </Link>
            </div>

            {/* Trust items */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {["No Credit Card", "5-Min Setup", "Cancel Anytime", "Enterprise Security"].map((item, i) => (
                <span key={i} className="text-orange-200 text-sm font-medium">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
