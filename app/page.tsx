import { CTA } from "@/components/cta"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import Hero from "@/components/hero"
import dynamic from "next/dynamic"
import Link from "next/link"

// Dynamic imports for landing page components (client-side only)
const TestimonialCarousel = dynamic(() => import("@/components/landing/TestimonialCarousel"), { ssr: false })
const AnimatedStats = dynamic(() => import("@/components/landing/AnimatedStats"), { ssr: false })

export default function Home() {
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-orange-500 text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="min-h-screen" role="main" suppressHydrationWarning>
        <Hero />

        {/* Modern CTA Component */}
        <CTA />

        {/* Testimonials Section */}
        <TestimonialCarousel />
     
        {/* Voice Search Optimized Q&A - Clean Card Design */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-100/30 relative overflow-hidden" role="region" aria-labelledby="voice-search-qa">
          {/* CSS Animations */}
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes fadeSlideUp {
              from { opacity: 0; transform: translateY(30px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scaleIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            .qa-card {
              opacity: 0;
              animation: fadeSlideUp 0.6s ease-out forwards;
            }
            .qa-card:nth-child(1) { animation-delay: 0.1s; }
            .qa-card:nth-child(2) { animation-delay: 0.2s; }
            .qa-card:nth-child(3) { animation-delay: 0.3s; }
            .qa-header {
              opacity: 0;
              animation: scaleIn 0.5s ease-out forwards;
            }
          `}} />

          {/* Subtle Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Header */}
            <div className="text-center mb-12 qa-header">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-300/40 mb-6">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="w-2 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                </div>
                <span className="text-sm font-semibold tracking-wide">Common Questions</span>
              </div>
              <h2 id="voice-search-qa" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Common Questions About{' '}
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">AI Voice Agents</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Get answers to your most important questions about our AI voice platform
              </p>
            </div>

            {/* Q&A Grid - Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">

              {/* Left Column */}
              <div className="space-y-8 flex flex-col">

                {/* Q&A 1 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q1
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      What is an AI voice agent and how does it work?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      An AI voice agent is an intelligent conversational system that handles phone calls autonomously using advanced natural language processing.
                      Unlike human receptionists who need sleep, sick leave, and breaks, our AI voice agents operate <strong className="text-orange-600">24/7/365</strong> without interruption.
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      They understand spoken language, process customer requests in real-time, access your business data instantly, and respond with natural-sounding speech.
                      Every conversation is analyzed and stored in your personal dashboard with detailed analytics including call duration, customer sentiment, conversion rates, and actionable insights.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-orange-200">
                      <span className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">✓ Natural Language Processing</span>
                      <span className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">✓ 24/7 Availability</span>
                      <span className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">✓ Real-time Analytics</span>
                    </div>
                  </div>
                </div>

                {/* Q&A 2 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q2
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      How quickly can I deploy an AI voice assistant for my business?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our AI voice assistant platform enables deployment within <strong className="text-orange-600">24-48 hours</strong>. The streamlined process includes:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">①</span>
                        <span>Account creation & dashboard setup - 15 min</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">②</span>
                        <span>Business integration & customization - 2 hrs</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">③</span>
                        <span>Voice personality selection & training - 1 hr</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">④</span>
                        <span>Phone number provisioning - immediate</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">⑤</span>
                        <span>Testing & quality assurance - 4 hrs</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">⑥</span>
                        <span>Live deployment with full analytics</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-orange-200">
                      <div className="flex items-center gap-1.5 text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Fast Setup
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-orange-600 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Full Analytics
                      </div>
                      <div className="flex items-center gap-1.5 text-xs bg-orange-400 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        Live Support
                      </div>
                    </div>
                  </div>
                </div>

                {/* Q&A 3 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q3
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      What makes your AI voice agent better than hiring a human receptionist?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our AI voice agents never sleep, never get sick, never take breaks, and never need vacations - providing consistent <strong className="text-orange-600">24/7/365</strong> availability.
                    </p>
                    
                    <div className="bg-white/70 rounded-xl p-4 space-y-2 border border-orange-100">
                      <p className="text-gray-600 text-sm leading-relaxed">
                        • Handle unlimited simultaneous calls (humans can only handle one)
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        • Respond in under 750ms (humans average 2-3 seconds)
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        • Work in 50+ languages simultaneously
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        • Never forget customer information
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        • Cost <strong className="text-orange-600">90% less</strong> than full-time staff
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-orange-200">
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-orange-600">∞</div>
                        <div className="text-xs text-gray-500 mt-1">Simultaneous Calls</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-orange-600">750ms</div>
                        <div className="text-xs text-gray-500 mt-1">Response Time</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-orange-600">50+</div>
                        <div className="text-xs text-gray-500 mt-1">Languages</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-8 flex flex-col">

                {/* Q&A 4 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.15s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q4
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      Can AI voice assistants integrate with my existing business systems?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Yes! Our AI voice assistant platform integrates seamlessly with <strong className="text-orange-600">500+ business applications</strong> including Salesforce, HubSpot, Zendesk, Microsoft Dynamics, Google Workspace, Slack, Calendly, Shopify, WooCommerce, and custom APIs.
                    </p>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Integration takes minutes using pre-built connectors. Your AI agent automatically syncs customer data, updates CRM records, schedules appointments, creates support tickets, processes orders, and triggers workflows across your tech stack.
                    </p>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Every action is logged in your analytics dashboard with full audit trails, real-time synchronization, and bi-directional data flow.
                    </p>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-orange-200">
                      {['Salesforce', 'HubSpot', 'Zendesk', 'Slack', 'Calendly', 'Shopify', '+494 more'].map((app, i) => (
                        <span key={i} className="text-xs bg-white hover:bg-orange-100 px-3 py-1.5 rounded-full text-gray-600 hover:text-orange-600 transition-all cursor-default border border-orange-200">{app}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Q&A 5 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.25s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q5
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      What analytics and insights do I get with the AI voice agent platform?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Your personal dashboard provides comprehensive real-time analytics:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Call volume & duration metrics
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Conversation transcripts
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Customer sentiment analysis
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Conversion rate tracking
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Lead quality scoring
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Peak hour identification
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Revenue attribution
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-500">•</span>
                        Predictive analytics
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-orange-200">
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-xl mb-1">📊</div>
                        <div className="text-xs text-gray-600 font-medium">Analytics</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-xl mb-1">💬</div>
                        <div className="text-xs text-gray-600 font-medium">Transcripts</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-xl mb-1">😊</div>
                        <div className="text-xs text-gray-600 font-medium">Sentiment</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-b from-white to-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-all">
                        <div className="text-xl mb-1">📈</div>
                        <div className="text-xs text-gray-600 font-medium">Reports</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Q&A 6 */}
                <div className="qa-card group bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 hover:-translate-y-1 h-[480px] flex flex-col" style={{ animationDelay: '0.35s' }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                      Q6
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg leading-snug pt-2 group-hover:text-orange-600 transition-colors">
                      Can DigitalBot.ai help generate leads?
                    </h3>
                  </div>
                  
                  <div className="pl-16 space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      <strong className="text-orange-600">Yes.</strong> The chatbot can collect visitor information, qualify leads, book appointments, and pass data directly to your sales or CRM system.
                    </p>
                    
                    <div className="bg-white/70 rounded-xl p-4 space-y-3 border border-orange-100">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span><strong>Collect visitor information</strong> - Capture contact details automatically</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span><strong>Qualify leads</strong> - Score and prioritize prospects intelligently</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span><strong>Book appointments</strong> - Schedule meetings instantly</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-orange-500 mt-0.5">✓</span>
                        <span><strong>CRM integration</strong> - Sync data to your sales system automatically</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-orange-200">
                      <span className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">📊 Lead Scoring</span>
                      <span className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">📅 Appointment Booking</span>
                      <span className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium shadow-sm">🔗 CRM Sync</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50/50 via-white to-orange-50/30 relative" role="region" aria-labelledby="faq-section">
          <div className="container mx-auto max-w-6xl relative z-10">

            {/* Section Heading - Top Center */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-3">
                <span className="text-sm">❓</span>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Got Questions?</span>
              </div>
              <h2 id="faq-section" className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Frequently Asked <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-xl mx-auto">Everything you need to know about AI Voice Agents and how they can transform your business</p>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">

              {/* LEFT - Have Questions? */}
              <div className="bg-white rounded-2xl p-5 border border-orange-100/50 shadow-sm text-center">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face" alt="Have Questions" className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-orange-200 shadow-md" />
                <h3 className="text-lg font-bold text-gray-900 mb-3">Have Questions?</h3>
                <div className="space-y-2 text-left mb-4">
                  {['How can we help you?', '24/7 Support', 'Contact us anytime.'].map((t, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-xs font-medium text-gray-600">{t}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact#contact-form" className="block w-full py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all">
                  Contact Us
                </Link>
              </div>

              {/* CENTER - FAQ Accordion */}
              <div className="lg:col-span-2">
                {/* Search */}
                <div className="relative mb-4">
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" placeholder="Search for answers..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300" />
                </div>
                {/* Accordion */}
                <div className="space-y-2">
                  {[
                    { q: "What is an AI voice assistant and how does it work?", a: "An AI voice assistant uses natural language processing and machine learning to understand and respond to customer queries in real-time, 24/7." },
                    { q: "How can AI voice assistants improve customer service?", a: "They provide instant responses, handle multiple conversations simultaneously, and offer consistent support around the clock without wait times." },
                    { q: "Is the AI voice assistant secure for handling data?", a: "Yes — enterprise-grade security with end-to-end encryption, GDPR compliance, HIPAA compliance, and strict data privacy protocols." },
                    { q: "Can it integrate with existing business systems?", a: "Seamless integration with 500+ apps including Salesforce, HubSpot, Zendesk, Google Workspace, and custom APIs." },
                    { q: "What industries benefit most from AI voice assistants?", a: "Healthcare, e-commerce, banking, hospitality, real estate, education, telecom, and any business handling customer calls." },
                    { q: "How quickly can I get started with DigitalBot?", a: "Most businesses are up and running within 24-48 hours. Our team handles setup, integration, and training." }
                  ].map((faq, idx) => (
                    <details key={idx} className="group bg-white rounded-xl border border-gray-100 hover:border-orange-200 transition-colors">
                      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer list-none select-none">
                        <span className="w-6 h-6 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[10px] font-bold text-orange-500 flex-shrink-0">{idx + 1}</span>
                        <span className="flex-1 text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">{faq.q}</span>
                        <span className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center text-orange-400 group-open:rotate-45 transition-transform duration-300 flex-shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </span>
                      </summary>
                      <div className="px-4 pb-3 pl-[52px]">
                        <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              {/* RIGHT - Need Help? */}
              <div className="bg-white rounded-2xl p-5 border border-orange-100/50 shadow-sm text-center">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face" alt="Need Help" className="w-24 h-24 mx-auto mb-4 object-cover rounded-full border-2 border-orange-200 shadow-md" />
                <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
                <div className="space-y-2">
                  {[
                    { label: 'Help Center', href: '/docs', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
                    { label: 'Live Chat', href: '#', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                    { label: 'Send Email', href: '/contact#contact-form', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="flex items-center gap-2.5 w-full px-4 py-2.5 bg-orange-50/60 rounded-xl border border-orange-100/50 hover:border-orange-300 hover:shadow-sm transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Still Have Questions - Compact CTA */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 bg-white rounded-2xl p-5 border border-orange-100/50 shadow-sm max-w-2xl mx-auto">
              <div className="text-center sm:text-left">
                <h3 className="text-base font-bold text-gray-900">Still have questions?</h3>
                <p className="text-gray-500 text-xs">Our AI experts are here to help you find the perfect solution</p>
              </div>
              <Link href="/contact#contact-form" className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-orange-500 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 flex-shrink-0">
                Get in Touch
                <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

          </div>
        </section>

     
        {/* Comprehensive Structured Data - SEO/GEO/VSO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.digitalbot.in/#organization",
                  "name": "DigitalBot",
                  "alternateName": "DigitalBot AI Voice Agent Platform",
                  "url": "https://www.digitalbot.in",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.digitalbot.in/logo.png",
                    "width": 600,
                    "height": 600
                  },
                  "description": "AI Voice Agent Platform - Never Sleeps, Never Stops. 24/7 AI voice assistants that handle unlimited calls simultaneously with enterprise-grade analytics.",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-XXXX-XXXXXX",
                    "contactType": "customer service",
                    "availableLanguage": ["en", "hi"],
                    "areaServed": "Worldwide"
                  },
                  "sameAs": [
                    "https://www.linkedin.com/company/digitalbot",
                    "https://twitter.com/digitalbot",
                    "https://www.facebook.com/digitalbot"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.digitalbot.in/#website",
                  "url": "https://www.digitalbot.in",
                  "name": "DigitalBot - AI Voice Agent Platform",
                  "description": "AI voice agents that never sleep, never get sick, never take breaks. Transform your business with 24/7 automated call handling and real-time analytics.",
                  "publisher": {
                    "@id": "https://www.digitalbot.in/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.digitalbot.in/?s={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "name": "DigitalBot AI Voice Agent",
                  "applicationCategory": "BusinessApplication",
                  "operatingSystem": "Cloud-based",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR",
                    "description": "Free trial available"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "2847",
                    "bestRating": "5",
                    "worstRating": "1"
                  },
                  "description": "AI Voice Assistant Platform with 99.9% uptime, <750ms response time, 24/7 availability, unlimited simultaneous calls, and comprehensive analytics dashboard.",
                  "featureList": [
                    "24/7/365 AI voice agent availability",
                    "Never sleeps, never gets sick, never takes breaks",
                    "99.9% uptime guarantee",
                    "<750ms AI response latency",
                    "Unlimited simultaneous call handling",
                    "Real-time analytics dashboard",
                    "Complete conversation transcripts",
                    "Customer sentiment analysis",
                    "50+ language support",
                    "CRM and business system integration",
                    "Automated appointment scheduling",
                    "Lead qualification and scoring",
                    "HIPAA and GDPR compliance",
                    "Enterprise-grade security",
                    "Custom workflow automation"
                  ]
                },
                {
                  "@type": "Service",
                  "serviceType": "AI Voice Agent",
                  "provider": {
                    "@id": "https://www.digitalbot.in/#organization"
                  },
                  "areaServed": {
                    "@type": "Country",
                    "name": "Worldwide"
                  },
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "AI Voice Assistant Services",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Call Center Automation",
                          "description": "24/7 automated call handling with real-time analytics"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Virtual Receptionist",
                          "description": "Never sleeps, never takes breaks - always available receptionist"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Customer Support Assistant",
                          "description": "Instant customer support with sentiment analysis"
                        }
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "AI Sales Agent",
                          "description": "Automated lead qualification and conversion"
                        }
                      }
                    ]
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "What is an AI voice agent and how does it work?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "An AI voice agent is an intelligent conversational system that handles phone calls autonomously using advanced natural language processing. Unlike human receptionists who need sleep, sick leave, and breaks, our AI voice agents operate 24/7/365 without interruption. They understand spoken language, process customer requests in real-time, access your business data instantly, and respond with natural-sounding speech. Every conversation is analyzed and stored in your personal dashboard with detailed analytics including call duration, customer sentiment, conversion rates, and actionable insights."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "How quickly can I deploy an AI voice assistant for my business?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our AI voice assistant platform enables deployment within 24-48 hours. The process includes: (1) Account creation and dashboard setup - 15 minutes, (2) Business information integration and workflow customization - 2 hours, (3) Voice personality selection and training - 1 hour, (4) Phone number provisioning or existing number integration - immediate, (5) Testing and quality assurance - 4 hours, (6) Live deployment with full analytics tracking. You'll have access to real-time dashboards showing every call, conversation transcript, customer data, and performance metrics from day one."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What makes your AI voice agent better than hiring a human receptionist?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Our AI voice agents never sleep, never get sick, never take breaks, and never need vacations - providing consistent 24/7/365 availability. They handle unlimited simultaneous calls (a human receptionist can only handle one), respond in under 750 milliseconds (humans average 2-3 seconds), work in 50+ languages simultaneously, never forget customer information, provide perfect call transcriptions, generate detailed analytics automatically, integrate with all your business systems instantly, and cost 90% less than hiring full-time staff. Plus, you get a personal dashboard with real-time insights, conversion tracking, sentiment analysis, and automated reporting that no human receptionist can provide."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Can AI voice assistants integrate with my existing business systems?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Our AI voice assistant platform integrates seamlessly with 500+ business applications including Salesforce, HubSpot, Zendesk, Microsoft Dynamics, Google Workspace, Slack, Calendly, Shopify, WooCommerce, and custom APIs. Integration takes minutes using pre-built connectors. Your AI agent automatically syncs customer data, updates CRM records, schedules appointments in your calendar, creates support tickets, processes orders, and triggers workflows across your tech stack. Every action is logged in your analytics dashboard with full audit trails, real-time synchronization, and bi-directional data flow ensuring your entire team stays informed and aligned."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What analytics and insights do I get with the AI voice agent platform?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Your personal dashboard provides comprehensive real-time analytics: (1) Call volume and duration metrics with hourly/daily/weekly/monthly breakdowns, (2) Complete conversation transcripts with searchable keyword indexing, (3) Customer sentiment analysis using AI emotion detection, (4) Conversion rate tracking from initial call to completed action, (5) Lead quality scoring and automatic qualification, (6) Peak hour identification for staffing optimization, (7) Common question analysis for FAQ development, (8) Revenue attribution linking calls to closed deals, (9) Multi-language performance comparison, (10) Custom business KPI tracking, (11) Automated executive reports, and (12) Predictive analytics for demand forecasting."
                      }
                    }
                  ]
                },
                {
                  "@type": "Product",
                  "name": "AI Voice Agent Platform",
                  "description": "Enterprise AI voice assistant platform that never sleeps, never gets sick, and never takes breaks. 24/7 automated call handling with 99.9% uptime and complete analytics.",
                  "brand": {
                    "@type": "Brand",
                    "name": "DigitalBot"
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "2847"
                  },
                  "offers": {
                    "@type": "AggregateOffer",
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR",
                    "lowPrice": "0",
                    "highPrice": "999999",
                    "offerCount": "4"
                  }
                }
              ]
            })
          }}
        />

      </main>

      <Footer />
    </>
  )
}















