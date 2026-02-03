"use client"

import { ArrowRight, BarChart3, Bot, Brain, CheckCircle, Clock, Globe, Headphones, Mic, Phone, Play, Shield, TrendingUp, Users, Workflow, Zap, LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Brain, Mic, Workflow, BarChart3, Shield, Bot, Clock, Users, TrendingUp, Zap, Headphones, Phone, Globe
}

// Hero CTA Buttons (Client Component for icons)
export function HeroCTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link href="/contact" className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
        Start Free Trial
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Link>
      <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 font-semibold text-base rounded-xl hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/10">
        <Play className="mr-2 h-5 w-5" />
        Watch Demo
      </Link>
    </div>
  )
}

// Trust Indicators (Client Component for icons)
export function TrustIndicators() {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-200" />
            <span className="font-medium">500+ Active Deployments</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-200" />
            <span className="font-medium">4.9/5 Customer Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-200" />
            <span className="font-medium">50+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-200" />
            <span className="font-medium">SOC 2 Certified</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Final CTA Section (Client Component for icons)
export function FinalCTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.05),transparent_50%)]"></div>
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto text-center relative z-10 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
          <span className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></span>
          <span className="text-sm font-semibold text-white">Ready to Transform Your Business?</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Deploy Your AI Voice Bot Today
        </h2>

        <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 500+ businesses using <strong className="text-white">AI Voice Bot</strong> to automate customer conversations and reduce operational costs by 70%.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link href="/contact" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white/30 text-white font-semibold text-base rounded-xl hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300">
            Schedule Demo
          </Link>
        </div>

        <p className="text-sm text-blue-200">
          No credit card required • Free 14-day trial • Setup in 5 minutes
        </p>
      </div>
    </section>
  )
}

const features = [
  { iconName: "Brain", title: "Advanced AI Technology", description: "Powered by cutting-edge natural language processing and deep learning algorithms for accurate voice understanding and human-like responses." },
  { iconName: "Mic", title: "Natural Voice Synthesis", description: "Crystal-clear, human-like voice output with emotion detection and contextual tone adjustment for authentic conversations." },
  { iconName: "Workflow", title: "Custom Conversation Flows", description: "Design tailored dialogue paths for your specific business needs with our intuitive no-code conversation builder." },
  { iconName: "BarChart3", title: "Real-Time Analytics Dashboard", description: "Comprehensive insights into every conversation with detailed metrics, sentiment analysis, and performance tracking." },
  { iconName: "Shield", title: "Enterprise-Grade Security", description: "Bank-level encryption, SOC 2 compliance, GDPR ready with end-to-end data protection and privacy controls." },
  { iconName: "Bot", title: "Omnichannel Integration", description: "Seamlessly deploy across phone systems, web chat, mobile apps, WhatsApp, SMS, and messaging platforms." },
]

const benefits = [
  { iconName: "Clock", title: "24/7 Availability", stat: "100%", description: "Never miss a customer call, day or night" },
  { iconName: "Users", title: "Unlimited Scalability", stat: "∞", description: "Handle thousands of calls simultaneously" },
  { iconName: "TrendingUp", title: "Cost Reduction", stat: "70%", description: "Lower operational costs vs human agents" },
  { iconName: "Zap", title: "Instant Response", stat: "<1s", description: "Lightning-fast AI-powered responses" },
]

const useCases = [
  { title: "Customer Support Automation", description: "Handle FAQs, troubleshooting, and support tickets automatically with AI voice bots that understand context and provide accurate solutions.", iconName: "Headphones" },
  { title: "Appointment Scheduling", description: "Automate booking, rescheduling, and reminders for appointments across healthcare, salons, and service businesses.", iconName: "Phone" },
  { title: "Lead Qualification", description: "Engage prospects, qualify leads, and route high-value opportunities to your sales team automatically.", iconName: "TrendingUp" },
  { title: "Order Status & Tracking", description: "Provide instant updates on orders, deliveries, and shipments without human intervention.", iconName: "Globe" },
]

const faqs = [
  { question: "What is an AI Voice Bot?", answer: "An AI Voice Bot is an advanced artificial intelligence system that uses natural language processing (NLP) and machine learning to conduct voice conversations with customers. It can understand spoken language, interpret intent, process requests, and respond with human-like voice synthesis - all automatically and 24/7. AI Voice Bots handle customer service, sales, support, and information queries without human intervention, providing instant responses while learning and improving from every interaction." },
  { question: "How does an AI Voice Bot work?", answer: "AI Voice Bots work through several sophisticated technologies: (1) Speech Recognition converts spoken words into text using advanced algorithms. (2) Natural Language Processing (NLP) analyzes the text to understand intent, context, and meaning. (3) AI Decision Engine processes the request and determines the appropriate response based on trained data and business logic. (4) Voice Synthesis converts the response text back into natural-sounding speech. (5) Continuous Learning improves accuracy over time by analyzing conversation patterns and outcomes." },
  { question: "What are the benefits of using AI Voice Bot for my business?", answer: "AI Voice Bots deliver multiple business benefits: (1) 24/7 Availability - Handle calls anytime without human agents. (2) Cost Reduction - Save up to 70% on customer service costs. (3) Unlimited Scalability - Manage thousands of simultaneous calls without wait times. (4) Consistent Service Quality - Provide uniform, error-free responses every time. (5) Faster Response Times - Instant answers within 1 second. (6) Data-Driven Insights - Analytics on every conversation for continuous improvement. (7) Multilingual Support - Communicate in multiple languages automatically." },
  { question: "Can AI Voice Bot understand different accents and languages?", answer: "Yes, modern AI Voice Bots are trained on diverse datasets including multiple accents, dialects, and languages. Our AI Voice Bot supports 50+ languages and automatically detects the caller's language, adapting in real-time. The advanced NLP models recognize regional accents (American, British, Australian, Indian English, etc.) and colloquial expressions. The system continuously learns from interactions to improve accuracy across different speech patterns, making it ideal for global businesses serving diverse customer bases." },
  { question: "How quickly can I deploy an AI Voice Bot?", answer: "With DigitalBot.ai, you can deploy a fully functional AI Voice Bot in as little as 5-10 minutes. Our platform offers: (1) Pre-built Templates for common use cases (customer support, appointment booking, lead qualification). (2) No-Code Builder - Design conversation flows visually without programming. (3) One-Click Integration with existing phone systems, CRM, and business tools. (4) Instant Testing & Preview before going live. Most businesses are operational within 24 hours, compared to traditional development that takes weeks or months." },
  { question: "Is my customer data secure with AI Voice Bot?", answer: "Absolutely. Security is our top priority. Our AI Voice Bot employs: (1) End-to-End Encryption - All voice data encrypted in transit and at rest using AES-256. (2) SOC 2 Type II Compliance - Regular third-party security audits. (3) GDPR & CCPA Compliant - Full data privacy compliance for global regulations. (4) Role-Based Access Controls - Granular permissions for team members. (5) Data Retention Policies - Automatic deletion per your requirements. (6) Regular Security Updates - Continuous monitoring and threat protection. Your customer conversations and data are protected with bank-level security." },
  { question: "What industries can benefit from AI Voice Bot?", answer: "AI Voice Bots deliver value across virtually all industries: (1) Healthcare - Appointment scheduling, prescription refills, patient support. (2) E-commerce - Order tracking, product inquiries, returns processing. (3) Banking & Finance - Account inquiries, transaction support, fraud alerts. (4) Real Estate - Property inquiries, showing scheduling, lead qualification. (5) Hospitality - Reservations, concierge services, guest support. (6) Telecommunications - Technical support, billing inquiries, service upgrades. (7) Insurance - Claims processing, policy information, quote requests. (8) Education - Admissions, course information, student support. Any business receiving customer calls can leverage AI Voice Bots." },
  { question: "Can AI Voice Bot integrate with my existing systems?", answer: "Yes, our AI Voice Bot offers seamless integration with popular business tools: (1) CRM Systems - Salesforce, HubSpot, Zoho, Pipedrive. (2) Help Desk - Zendesk, Freshdesk, Intercom, Help Scout. (3) Phone Systems - Twilio, RingCentral, 8x8, Vonage. (4) Calendars - Google Calendar, Outlook, Calendly. (5) E-commerce - Shopify, WooCommerce, Magento. (6) Custom APIs - RESTful API access for proprietary systems. (7) Databases - MySQL, PostgreSQL, MongoDB. Integration typically takes minutes using our pre-built connectors or custom webhooks." },
  { question: "How much does AI Voice Bot cost?", answer: "AI Voice Bot pricing is flexible and scales with your needs. Plans start at $55/month for 300 AI voice minutes (ideal for small businesses), $145/month for 1000 minutes (growing businesses), with custom enterprise packages for high-volume needs. All plans include: unlimited voice channels, 24/7 support, real-time analytics, CRM integration, and free trial period. No setup fees, no hidden costs, and you only pay for actual voice minutes used. Contact us for a custom quote based on your specific requirements and volume." },
  { question: "What makes DigitalBot.ai's AI Voice Bot different from competitors?", answer: "Our AI Voice Bot stands out through: (1) Superior Accuracy - 95%+ intent recognition vs industry average of 80%. (2) Human-Like Voice - Most natural-sounding synthesis with emotion and tone. (3) Fastest Deployment - Live in minutes, not weeks. (4) No-Code Platform - Anyone can build flows without technical skills. (5) Advanced Analytics - Deep insights into every conversation. (6) Multilingual Excellence - True understanding in 50+ languages, not just translation. (7) White-Glove Support - Dedicated success team for implementation. (8) Proven ROI - Clients see 70% cost reduction and 40% higher customer satisfaction on average." }
]

// Static waveform bars for VoiceConversationPlayer
const waveformBars = [20, 27, 32, 35, 35, 32, 27, 20, 12, 5, 5, 12, 20, 27, 32, 35, 35, 32, 27, 20, 12, 5, 5, 12, 20, 27, 32, 35, 35, 32];

export function VoiceConversationPlayer() {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-8 shadow-xl shadow-blue-500/10 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        {/* Waveform Display */}
        <div className="flex items-center justify-center mb-8 h-28 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-100 relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 h-20">
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-full opacity-70"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
        
        {/* Play Button */}
        <div className="flex items-center justify-center">
          <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300">
            <Play className="w-5 h-5" />
            <span>Play AI Voice Demo</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function BenefitsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-10">
      {benefits.map((benefit, index) => {
        const IconComponent = iconMap[benefit.iconName]
        return (
          <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg shadow-blue-500/10 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl group-hover:bg-blue-300/40 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <IconComponent className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-1">{benefit.stat}</div>
              <p className="font-semibold text-gray-900 mb-1 text-sm">{benefit.title}</p>
              <p className="text-xs text-gray-600">{benefit.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function FeaturesGrid() {
  const images = [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop'
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => {
        const FeatureIcon = iconMap[feature.iconName]
        return (
          <article
            key={index}
            className="group bg-white rounded-2xl shadow-lg shadow-blue-500/10 border border-blue-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300"
            itemScope
            itemType="https://schema.org/SoftwareFeature"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <Image src={images[index]} alt={`${feature.title} - AI Voice Bot Feature`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
              <div className="absolute top-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FeatureIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <h3 itemProp="name" className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p itemProp="description" className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function UseCasesGrid() {
  const images = [
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop'
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {useCases.map((useCase, index) => {
        const UseCaseIcon = iconMap[useCase.iconName]
        return (
          <article
            key={index}
            className="group bg-white rounded-2xl shadow-lg shadow-blue-500/10 border border-blue-100 overflow-hidden hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-36 overflow-hidden">
              <Image src={images[index]} alt={`${useCase.title} - AI Voice Bot Use Case`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UseCaseIcon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-bold text-gray-900 mb-2">{useCase.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{useCase.description}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export function FAQSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {faqs.map((faq, index) => (
        <article
          key={index}
          className="group bg-white rounded-2xl p-6 shadow-lg shadow-blue-500/10 border border-blue-100 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          {/* Glow Effect */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:bg-blue-200/50 transition-colors"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <div className="flex-1">
              <h3 itemProp="name" className="text-base font-bold text-gray-900 mb-3 leading-snug">{faq.question}</h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
