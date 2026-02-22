"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LeadFormMini } from "@/components/lead-form-mini"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Check, HelpCircle, Rocket, Shield, Sparkles, Star, TrendingUp, Zap } from "lucide-react"
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

const plans = [
  {
    name: "Launch",
    icon: Rocket,
    description: "Ideal for startups, freelancers, and early adopters",
    usdPrice: 9,
    inrPrice: 800,
    minutes: 100,
    features: [
      "100 AI voice minutes",
      "2 voice agents, simultaneous channels (Any Language)",
      "Call summary",
      "AI analytics dashboard and leads",
      "Incoming/Outgoing telephone calls",
      "Website voice bot integration",
      "Dedicated support",
      "Valid for two months",
    ],
    popular: false,
    cta: "Get Started",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    borderHover: "hover:border-blue-400",
  },
  {
    name: "Scale",
    icon: TrendingUp,
    description: "Perfect for growing businesses with higher conversation volumes",
    usdPrice: 45,
    inrPrice: 4000,
    minutes: 600,
    features: [
      "600 AI voice minutes",
      "5 voice agents, simultaneous channels (Any Language)",
      "Call summary",
      "AI based analytics dashboard and leads",
      "Incoming/Outgoing telephone calls",
      "Website voice bot integration",
      "Dedicated support",
      "Valid for three months",
    ],
    popular: true,
    cta: "Get Started",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50",
    borderHover: "hover:border-amber-400",
  },
  {
    name: "Custom",
    icon: Sparkles,
    description: "Tailored solutions based on your specific requirements",
    usdPrice: null,
    inrPrice: null,
    minutes: null,
    features: [
      "Custom AI voice minutes",
      "Unlimited voice agents",
      "Advanced call analytics",
      "Custom integrations",
      "Priority support",
      "Flexible validity period",
      "White-label options",
      "Dedicated account manager",
    ],
    popular: false,
    cta: "Contact Sales",
    gradient: "from-violet-500 to-purple-500",
    bgColor: "bg-violet-50",
    borderHover: "hover:border-violet-400",
  },
]

const faqs = [
  {
    question: "Can I change my plan at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any billing differences.",
  },
  {
    question: "What happens if I exceed my voice minute limit?",
    answer:
      "We'll notify you when you're approaching your limit. You can either upgrade your plan or purchase additional voice minutes as add-ons.",
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer:
      "Our Custom plan includes tailored solutions, dedicated support, and can be configured to your specific requirements. Contact our sales team for more details.",
  },
  {
    question: "What languages are supported?",
    answer: "Our AI voice agents support any language, allowing you to serve customers globally without language barriers.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! We offer a free demo so you can experience the power of our AI voice agents before committing to any plan.",
  },
  {
    question: "What kind of support do you provide?",
    answer: "All plans include dedicated support. Our Scale and Custom plans come with priority assistance and a dedicated account manager.",
  },
]

export default function Pricing() {
  const [isINR, setIsINR] = useState(false)

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-28 pb-16 px-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-amber-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-blue-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-violet-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-orange-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-blue-600 font-semibold">Pricing</li>
              </ol>
            </nav>

            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-6">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-600">Simple, Transparent Pricing</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                AI Voice Agent Plans
                <span className="block text-blue-600 mt-2">Built for Every Business</span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                Choose the perfect plan for your business. All plans include our powerful AI voice technology, analytics dashboard, and dedicated support.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact#contact-form" className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                  Request a Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#plans" className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all">
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: 500, suffix: "+", label: "Businesses Trust Us" },
                { value: 10, suffix: "M+", label: "Calls Handled" },
                { value: 99, suffix: ".9%", label: "Uptime Guarantee" },
                { value: 50, suffix: "+", label: "Languages Supported" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-white mb-1">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-blue-200 text-sm font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans Section */}
        <section id="plans" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Star className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Choose Your Plan</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                AI Voice Agent Plans
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Flexible plans designed to grow with your business
              </p>

              {/* Currency Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={`text-sm font-semibold transition-colors ${!isINR ? 'text-blue-600' : 'text-gray-400'}`}>USD ($)</span>
                <Switch
                  checked={isINR}
                  onCheckedChange={setIsINR}
                  className="data-[state=checked]:bg-blue-600"
                />
                <span className={`text-sm font-semibold transition-colors ${isINR ? 'text-blue-600' : 'text-gray-400'}`}>INR (₹)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`
                    relative bg-white rounded-3xl border transition-all duration-300 overflow-hidden group
                    hover:shadow-2xl hover:-translate-y-2
                    ${plan.popular
                      ? 'border-blue-400 shadow-2xl shadow-blue-500/15 scale-[1.02]'
                      : `border-gray-200 shadow-lg ${plan.borderHover}`
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500" />
                  )}

                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${plan.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                        <plan.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                          {plan.popular && (
                            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      {plan.usdPrice ? (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-black text-gray-900">
                              {isINR ? `₹${plan.inrPrice}` : `$${plan.usdPrice}`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {plan.minutes} AI voice minutes included
                          </p>
                        </div>
                      ) : (
                        <div>
                          <span className="text-5xl font-black text-gray-900">Custom</span>
                          <p className="text-sm text-gray-500 mt-1">Tailored to your needs</p>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/contact#contact-form"
                      className={`
                        flex items-center justify-center gap-2 w-full py-3.5 font-bold rounded-xl transition-all duration-200 mb-8 group/btn
                        ${plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl'
                          : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
                        }
                      `}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Features */}
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">What&apos;s included</p>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className={`w-5 h-5 bg-gradient-to-br ${plan.gradient} rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Secure & Compliant", desc: "SOC 2, GDPR & HIPAA compliant", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-50" },
                { icon: Zap, title: "5-Minute Setup", desc: "No code required, instant deployment", color: "from-amber-500 to-orange-500", bgColor: "bg-amber-50" },
                { icon: Star, title: "Cancel Anytime", desc: "No long-term contracts or commitments", color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-50" },
              ].map((badge, i) => (
                <div key={i} className={`${badge.bgColor} rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-all hover:-translate-y-1`}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center shadow-lg shrink-0`}>
                    <badge.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{badge.title}</h3>
                    <p className="text-sm text-gray-600">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">Get In Touch</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Request a Personalized Demo
              </h2>
              <p className="text-lg text-gray-600">
                See how DigitalBot can transform your customer interactions
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <LeadFormMini />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white relative overflow-hidden">
          {/* Subtle background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-amber-100/30 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-6">
                <HelpCircle className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600">FAQ</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden px-2"
                >
                  <AccordionTrigger className="text-left font-bold text-gray-900 hover:no-underline py-5 px-4 text-base">
                    <div className="flex items-center gap-4 pr-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 text-sm leading-relaxed pb-5 pl-16 pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies already using DigitalBot to automate their customer communications with AI voice agents.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact#contact-form" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact#contact-form" className="px-8 py-4 bg-blue-500/30 text-white font-bold rounded-xl hover:bg-blue-500/50 transition-all border border-white/30">
                Contact Sales
              </Link>
            </div>

            {/* Trust items */}
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {["🎯 No Credit Card", "⚡ 5-Min Setup", "💎 Cancel Anytime", "🔒 Enterprise Security"].map((item, i) => (
                <span key={i} className="text-blue-200 text-sm font-medium">{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}










