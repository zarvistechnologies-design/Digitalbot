"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import Link from "next/link"
import { BenefitsGrid, FeaturesGrid, UseCasesGrid, FAQSection, VoiceConversationPlayer, HeroCTAButtons, TrustIndicators, FinalCTASection } from "./components"

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

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 text-gray-900" role="main">
        <Header />

        {/* Hero Section */}
        <section className="pt-20 pb-8 px-3 sm:px-4 lg:px-6 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50" aria-labelledby="hero-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-[60%] left-[60%] w-[250px] h-[250px] bg-gradient-radial from-blue-300/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="container mx-auto text-center relative z-10 max-w-6xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center justify-center space-x-2 text-xs text-blue-600" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/" className="hover:text-gray-900 transition-colors" itemProp="item">
                    <span itemProp="name">Home</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <li className="text-blue-600">/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/services" className="hover:text-gray-900 transition-colors" itemProp="item">
                    <span itemProp="name">Services</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                <li className="text-blue-600">/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span itemProp="name" className="text-gray-900 font-semibold">AI Voice Bot</span>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>

            {/* Badge */}
            <div className="inline-block mb-4">
              <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-blue-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                #1 AI Voice Bot Platform
              </span>
            </div>

            {/* Main Headline */}
            <h1 id="hero-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                AI Voice Bot
              </span>
              <br />
              <span className="text-gray-900 text-lg sm:text-xl lg:text-2xl">
                Intelligent Voice Automation for Business
              </span>
            </h1>

            {/* Description */}
            <div className="max-w-3xl mx-auto mb-6 bg-blue-100/40 backdrop-blur-sm p-3 border border-blue-200 shadow-lg shadow-blue-500/15" style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
            }}>
              <p className="text-xs sm:text-sm text-gray-900 leading-relaxed font-medium">
                Deploy <strong className="text-blue-600">AI Voice Bot</strong> powered by advanced <strong className="text-blue-600">Natural Language Processing</strong> to automate customer conversations. Handle unlimited calls simultaneously with <strong className="text-blue-600">human-like voice synthesis</strong>, reduce costs by 70%, and provide instant responses 24/7. No coding required - launch your <strong className="text-blue-600">AI Voice Bot</strong> in minutes.
              </p>
            </div>

            {/* Key Benefits Grid */}
            <BenefitsGrid />

            {/* CTA Buttons */}
            <HeroCTAButtons />
          </div>
        </section>

        {/* Trust Indicators */}
        <TrustIndicators />

        {/* Features Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden" aria-labelledby="features-heading">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-blue-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Enterprise-Grade Features
                </span>
              </div>
              <h2 id="features-heading" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  AI Voice Bot Features
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade <strong className="text-blue-600">AI voice bot</strong> capabilities designed to transform your customer communication and automate phone interactions
              </p>
            </div>

            {/* Features Grid */}
            <FeaturesGrid />
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden" aria-labelledby="usecases-heading">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[30%] left-[20%] w-[150px] h-[150px] bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[200px] h-[200px] bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-blue-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Real-World Applications
                </span>
              </div>
              <h2 id="usecases-heading" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  AI Voice Bot Use Cases
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                See how businesses leverage <strong className="text-blue-600">AI voice bot</strong> technology to streamline operations and enhance customer experience
              </p>
            </div>

            {/* Use Cases Grid */}
            <UseCasesGrid />
          </div>
        </section>

        {/* Sample Conversation Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-blue-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Experience AI Voice
                </span>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  Hear AI Voice Bot in Action
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Listen to how our <strong className="text-blue-600">AI voice bot</strong> handles real customer interactions with natural conversation flow
              </p>
            </div>

            {/* Voice Demo Player */}
            <div className="max-w-2xl mx-auto">
              <VoiceConversationPlayer />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden" aria-labelledby="faq-heading">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-[200px] h-[200px] bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[15%] right-[10%] w-[200px] h-[200px] bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-blue-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Frequently Asked Questions
                </span>
              </div>
              <h2 id="faq-heading" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                  AI Voice Bot FAQ
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Get answers to common questions about <strong className="text-blue-600">AI voice bot</strong> technology and implementation
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








