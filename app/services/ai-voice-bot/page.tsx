"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import Link from "next/link"
import { BenefitsGrid, FAQSection, FeaturesGrid, FinalCTASection, HeroCTAButtons, TrustIndicators, UseCasesGrid, VoiceConversationPlayer } from "./components"

// Pre-computed FAQ entities for JSON-LD
const faqEntities = [
  { "@type": "Question", "name": "What is an AI Voice Bot?", "acceptedAnswer": { "@type": "Answer", "text": "An AI Voice Bot is an advanced artificial intelligence system that uses natural language processing (NLP) and machine learning to conduct voice conversations with customers." } },
  { "@type": "Question", "name": "How does an AI Voice Bot work?", "acceptedAnswer": { "@type": "Answer", "text": "AI Voice Bots work through Speech Recognition, Natural Language Processing, AI Decision Engine, Voice Synthesis, and Continuous Learning." } },
  { "@type": "Question", "name": "What are the benefits of using AI Voice Bot?", "acceptedAnswer": { "@type": "Answer", "text": "24/7 Availability, Cost Reduction up to 70%, Unlimited Scalability, Consistent Service Quality, Faster Response Times, and Multilingual Support." } },
  { "@type": "Question", "name": "Can AI Voice Bot understand different accents?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, our AI Voice Bot supports 50+ languages and automatically detects the caller's language, adapting in real-time." } },
  { "@type": "Question", "name": "How quickly can I deploy an AI Voice Bot?", "acceptedAnswer": { "@type": "Answer", "text": "With DigitalBot.ai, you can deploy a fully functional AI Voice Bot in as little as 5-10 minutes." } },
]

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "AI Voice Bot by DigitalBot.ai",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Customer Service Software",
      "operatingSystem": "Web, iOS, Android, Windows, macOS",
      "offers": {
        "@type": "Offer",
        "price": "55",
        "priceCurrency": "USD",
        "priceValidUntil": "2025-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://www.digitalbot.ai/pricing"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "description": "AI Voice Bot platform for automated customer service with natural language processing, 24/7 availability, and unlimited scalability.",
      "url": "https://www.digitalbot.ai/services/ai-voice-bot",
      "image": "https://www.digitalbot.ai/og-ai-voice-bot.jpg",
      "publisher": {
        "@type": "Organization",
        "name": "DigitalBot.ai",
        "logo": { "@type": "ImageObject", "url": "https://www.digitalbot.ai/logo.png" }
      },
      "featureList": [
        "24/7 Automated Voice Assistance",
        "Natural Language Processing",
        "Multi-language Support (50+ Languages)",
        "Real-time Analytics Dashboard",
        "Enterprise Security & Compliance"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": faqEntities
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.digitalbot.ai" },
        { "@type": "ListItem", "position": 2, "name": "Services", "item": "https://www.digitalbot.ai/services" },
        { "@type": "ListItem", "position": 3, "name": "AI Voice Bot", "item": "https://www.digitalbot.ai/services/ai-voice-bot" }
      ]
    }
  ]
}

export default function AIVoiceBot() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-to-r from-orange-500 to-orange-500 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="min-h-screen" role="main" suppressHydrationWarning>

        {/* Hero Section - Premium Redesign */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]" aria-labelledby="hero-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(139,92,246,0.1),transparent_50%)]"></div>
          
          {/* Decorative Blur Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
          
          {/* Floating Decorative Icons */}
          <div className="absolute top-32 right-20 opacity-10">
            <div className="w-24 h-24 border-2 border-orange-300 rounded-2xl rotate-12"></div>
          </div>
          <div className="absolute bottom-40 left-20 opacity-10">
            <div className="w-16 h-16 border-2 border-orange-300 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              
              {/* Breadcrumb Navigation */}
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center justify-center space-x-2 text-sm text-orange-600" itemScope itemType="https://schema.org/BreadcrumbList">
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/" className="hover:text-orange-800 transition-colors font-medium" itemProp="item">
                      <span itemProp="name">Home</span>
                    </Link>
                    <meta itemProp="position" content="1" />
                  </li>
                  <li className="text-orange-400">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href="/services" className="hover:text-orange-800 transition-colors font-medium" itemProp="item">
                      <span itemProp="name">Services</span>
                    </Link>
                    <meta itemProp="position" content="2" />
                  </li>
                  <li className="text-orange-400">/</li>
                  <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <span itemProp="name" className="text-gray-800 font-semibold">AI Voice Bot</span>
                    <meta itemProp="position" content="3" />
                  </li>
                </ol>
              </nav>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border border-orange-200/40 rounded-full mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-orange-700">#1 AI Voice Bot Platform</span>
              </div>

              {/* Main Headline */}
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">Intelligent </span>
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  AI Voice Bot
                </span>
                <br />
                <span className="text-gray-700 text-2xl sm:text-3xl lg:text-4xl font-medium">
                  for Automated Customer Conversations
                </span>
              </h1>

              {/* Description Card */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-orange-100/40 shadow-lg shadow-orange-500/10">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    Deploy <strong className="text-orange-600">AI Voice Bot</strong> powered by advanced <strong className="text-orange-600">Natural Language Processing</strong> to automate customer conversations. Handle unlimited calls simultaneously with <strong className="text-orange-600">human-like voice synthesis</strong>, reduce costs by 70%, and provide instant responses 24/7.
                  </p>
                </div>
              </div>

              {/* Key Benefits Grid */}
              <BenefitsGrid />

              {/* CTA Buttons */}
              <HeroCTAButtons />
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Features Section - Premium */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f0ff] via-white to-[#fafbff] relative overflow-hidden" aria-labelledby="features-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_70%)]"></div>
          <div className="absolute top-20 right-20 w-64 h-64 bg-orange-100/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border border-orange-200/40 rounded-full mb-4">
                <span className="text-sm font-semibold text-orange-700">Enterprise-Grade Features</span>
              </div>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="text-gray-900">Powerful </span>
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  AI Voice Bot Features
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Enterprise-grade <strong className="text-orange-600">AI voice bot</strong> capabilities designed to transform your customer communication
              </p>
            </div>

            {/* Features Grid */}
            <FeaturesGrid />
          </div>
        </section>

        {/* Use Cases Section - Premium */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbff] via-white to-white relative overflow-hidden" aria-labelledby="usecases-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.1),transparent_60%)]"></div>
          <div className="absolute top-40 left-10 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border border-orange-200/40 rounded-full mb-4">
                <span className="text-sm font-semibold text-orange-700">Real-World Applications</span>
              </div>
              <h2 id="usecases-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  AI Voice Bot
                </span>
                <span className="text-gray-900"> Use Cases</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                See how businesses leverage <strong className="text-orange-600">AI voice bot</strong> technology to streamline operations
              </p>
            </div>

            {/* Use Cases Grid */}
            <UseCasesGrid />
          </div>
        </section>

        {/* Voice Demo Section - Premium */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f0f0ff] via-white to-[#fafbff] relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(99,102,241,0.1),transparent_60%)]"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto relative z-10 max-w-4xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border border-orange-200/40 rounded-full mb-4">
                <span className="text-sm font-semibold text-orange-700">Experience AI Voice</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 glass-heading">
                <span className="text-gray-900">Hear </span>
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  AI Voice Bot
                </span>
                <span className="text-gray-900"> in Action</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Listen to how our <strong className="text-orange-600">AI voice bot</strong> handles real customer interactions
              </p>
            </div>

            {/* Voice Demo Player */}
            <VoiceConversationPlayer />
          </div>
        </section>

        {/* FAQ Section - Premium */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbff] via-white to-white relative overflow-hidden" aria-labelledby="faq-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.06),transparent_70%)]"></div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-100/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card bg-orange-50/60 border border-orange-200/40 rounded-full mb-4">
                <span className="text-sm font-semibold text-orange-700">Frequently Asked Questions</span>
              </div>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  AI Voice Bot
                </span>
                <span className="text-gray-900"> FAQ</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about <strong className="text-orange-600">AI voice bot</strong> technology
              </p>
            </div>

            {/* FAQ Grid */}
            <FAQSection />
          </div>
        </section>

        {/* Final CTA Section */}
        <FinalCTASection />
      </main>

      <Footer />
    </>
  )
}








