"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { LeadFormMini } from "@/components/lead-form-mini"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowRight, Check, Rocket, Sparkles, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const plans = [
  {
    name: "Launch",
    icon: Rocket,
    description: "Ideal for startups, freelancers, and early adopters",
    usdPrice: 9,
    inrPrice: 800,
    minutes: 100,
    features: [
      { name: "100 AI voice minutes", included: true },
      { name: "2 voice agents, simultaneous channels (Any Language)", included: true },
      { name: "Call summary", included: true },
      { name: "AI analytics dashboard and leads", included: true },
      { name: "Incoming/Outgoing telephone calls", included: true },
      { name: "Website voice bot integration", included: true },
      { name: "Dedicated support", included: true },
      { name: "Valid for two months", included: true },
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    name: "Scale",
    icon: TrendingUp,
    description: "Perfect for growing businesses with higher conversation volumes",
    usdPrice: 45,
    inrPrice: 4000,
    minutes: 600,
    features: [
      { name: "600 AI voice minutes", included: true },
      { name: "5 voice agents, simultaneous channels (Any Language)", included: true },
      { name: "Call summary", included: true },
      { name: "AI based analytics dashboard and leads", included: true },
      { name: "Incoming/Outgoing telephone calls", included: true },
      { name: "Website voice bot integration", included: true },
      { name: "Dedicated support", included: true },
      { name: "Valid for three months", included: true },
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    name: "Custom",
    icon: Sparkles,
    description: "Tailored solutions based on your specific requirements",
    usdPrice: null,
    inrPrice: null,
    minutes: null,
    features: [
      { name: "Custom AI voice minutes", included: true },
      { name: "Unlimited voice agents", included: true },
      { name: "Advanced call analytics", included: true },
      { name: "Custom integrations", included: true },
      { name: "Priority support", included: true },
      { name: "Flexible validity period", included: true },
      { name: "White-label options", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    popular: false,
    cta: "Contact Sales",
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
]

export default function Pricing() {
  const [isINR, setIsINR] = useState(false)
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-sky-600">
      <Header />

      {/* Hero Section - Cyberpunk */}
      <section className="py-16 px-3 sm:px-4 lg:px-6 relative overflow-hidden bg-white">

        <div className="container mx-auto max-w-7xl relative z-10 text-center">
          <div className="inline-block mb-4">
            <span
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/50 border border-sky-500 text-sky-600"
              style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
            >
              ⚡ Pricing Plans
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
            <span className="block mb-2 bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 bg-clip-text text-transparent">
              AI Voice Agent
            </span>
            <span
              className="inline-block px-6 py-2 text-gray-900 bg-white/70 border border-sky-500 text-sm sm:text-base lg:text-lg relative"
              style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-sky-500/20 via-transparent to-sky-500/20"></span>
              <span className="relative z-10">Select Your Business Plan</span>
            </span>
          </h1>

          <div className="max-w-3xl mx-auto mb-6 p-4 bg-white/60 border border-sky-500/30 text-xs sm:text-sm">
            <p className="text-gray-900 leading-relaxed">
              Ready to see the power of AI voice automation? Request a personalized demo and our team will show you how DigitalBot can streamline your customer interactions, boost productivity, and deliver real business results.
            </p>
          </div>

          <Button
            size="sm"
            className="px-6 py-2 text-sm font-bold bg-sky-500 text-white hover:bg-sky-400 transition-all duration-300 hover:scale-105"
            onClick={() => window.open("https://www.digitalbot.ai/contact", "_blank")}
          >
            Request a Demo
            <ArrowRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </section>

      {/* Pricing Plans Section - Cyberpunk */}
      <section className="py-16 px-3 sm:px-4 lg:px-6 relative overflow-hidden bg-white">

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/50 border border-sky-500 text-sky-600"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                💎 Choose Your Plan
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 bg-clip-text text-transparent mb-4 uppercase tracking-wider drop-shadow-lg">
              AI Voice Agent Plans
            </h2>

            {/* Currency Toggle */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className={`text-sm ${!isINR ? 'text-sky-600' : 'text-sky-400'}`}>USD</span>
              <Switch
                checked={isINR}
                onCheckedChange={setIsINR}
                className="data-[state=checked]:bg-sky-500"
              />
              <span className={`text-sm ${isINR ? 'text-sky-600' : 'text-sky-400'}`}>INR</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={plan.name}
                className={`
                  relative bg-white/60 border hover:scale-105 transition-all duration-300 overflow-hidden
                  ${plan.popular
                    ? 'border-sky-400 shadow-lg shadow-sky-500/20'
                    : 'border-sky-500/30 hover:border-sky-500'
                  }
                `}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-sky-500 text-white text-xs px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">
                    <div
                      className="w-12 h-12 bg-white/70 border border-sky-500 flex items-center justify-center"
                      style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                    >
                      <plan.icon className="h-5 w-5 text-sky-600" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-sky-600 mb-2 uppercase tracking-wide">{plan.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-700 leading-relaxed">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    {plan.usdPrice ? (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-sky-600">
                          {isINR ? `₹${plan.inrPrice}` : `$${plan.usdPrice}`}
                        </span>
                        <span className="text-xs text-sky-500 block">
                          {plan.minutes} AI voice minutes
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-2xl font-bold text-sky-600">Custom</span>
                        <span className="text-xs text-sky-500 block">Contact for pricing</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-sky-600 shrink-0" />
                        <span className="text-gray-900">{feature.name}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`
                      w-full text-sm py-2 transition-all duration-300
                      ${plan.popular
                        ? 'bg-sky-500 text-white hover:bg-sky-400'
                        : 'bg-white border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white'
                      }
                    `}
                    onClick={() => window.open("https://www.digitalbot.ai/contact", "_blank")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section - Cyberpunk */}
      <section className="py-12 px-3 sm:px-4 lg:px-6 relative bg-white">

        <div className="container mx-auto max-w-2xl relative z-10">
          <div
            className="p-6 bg-white/60 border border-sky-500/30"
            style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
          >
            <LeadFormMini />
          </div>
        </div>
      </section>

      {/* FAQ Section - Cyberpunk */}
      <section className="py-16 px-3 sm:px-4 lg:px-6 relative bg-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(234, 88, 12, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)`
          }}
        ></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/50 border border-sky-500 text-sky-600"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                ❓ Frequently Asked Questions
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 bg-clip-text text-transparent mb-4 uppercase tracking-wider drop-shadow-lg">
              Everything You Need to Know
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-sky-500/30 bg-white/60 hover:border-sky-500 hover:scale-[1.02] transition-all duration-300 group relative overflow-hidden"
                  style={{ clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <AccordionTrigger className="text-left font-bold text-sky-600 text-base uppercase tracking-wide hover:no-underline py-4 px-4 group relative">
                    <div className="flex items-center gap-3 pr-3 w-full">
                      <div
                        className="w-8 h-8 bg-white/70 border border-sky-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                      >
                        <span className="text-sky-600 font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="flex-1 text-xs">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-900 text-sm leading-relaxed pt-1 pb-4 pl-12 pr-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section - Cyberpunk */}
      <section className="py-16 px-3 sm:px-4 lg:px-6 relative bg-white overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 20%, rgba(234, 88, 12, 0.2) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(234, 88, 12, 0.2) 0%, transparent 50%)`
          }}
        ></div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div
            className="p-8 bg-white/60 border border-sky-500/50 text-center relative overflow-hidden"
            style={{ clipPath: 'polygon(30px 0%, 100% 0%, calc(100% - 30px) 100%, 0% 100%)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-transparent to-sky-500/10"></div>

            <div className="relative z-10">
              <div className="inline-block mb-4">
                <span
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/50 border border-sky-500 text-sky-600"
                  style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
                >
                  🚀 Start Your Journey
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 uppercase tracking-wider drop-shadow-lg">
                <span className="bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 bg-clip-text text-transparent">
                  Ready to Transform Your
                </span>
                <br />
                <span
                  className="inline-block mt-3 px-6 py-2 bg-white/70 border border-sky-500 text-gray-900 text-sm sm:text-base"
                  style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
                >
                  Customer Experience?
                </span>
              </h2>

              <p className="text-base text-gray-900 max-w-3xl mx-auto mb-6 leading-relaxed px-4 py-3 bg-white/50 border border-sky-500/30">
                Join thousands of businesses using AI voice assistants to automate calls, boost conversions, and delight customers 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                <Button
                  size="sm"
                  className="bg-sky-500 text-white hover:bg-sky-400 transition-all duration-300 hover:scale-105 text-sm px-6 py-2 font-bold"
                  onClick={() => window.open("https://www.digitalbot.ai/contact", "_blank")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white border border-sky-500 text-sky-600 hover:bg-sky-500 hover:text-white transition-all duration-300 hover:scale-105 text-sm px-6 py-2 font-bold"
                  onClick={() => window.open("https://www.digitalbot.ai/contact", "_blank")}
                >
                  Contact Sales
                </Button>
              </div>

              {/* Trust Badges - Cyberpunk */}
              <div className="flex flex-wrap justify-center gap-3 items-center">
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 border border-sky-500/30 hover:scale-105 transition-all text-xs"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  <div className="w-2 h-2 bg-sky-600 animate-pulse"></div>
                  <span className="font-bold text-sky-600">🎯 No Credit Card</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 border border-sky-500/30 hover:scale-105 transition-all text-xs"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  <div className="w-2 h-2 bg-sky-600 animate-pulse"></div>
                  <span className="font-bold text-sky-600">⚡ Setup in 5 Minutes</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-white/50 border border-sky-500/30 hover:scale-105 transition-all text-xs"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  <div className="w-2 h-2 bg-sky-600 animate-pulse"></div>
                  <span className="font-bold text-sky-600">💎 Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}










