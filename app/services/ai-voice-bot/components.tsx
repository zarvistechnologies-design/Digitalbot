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
    <div className="flex flex-col sm:flex-row gap-2 justify-center">
      <Link href="/signup" className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/30 hover:scale-105 transition-all duration-300 border border-blue-400 uppercase tracking-wide" style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
      }}>
        Start Free Trial <ArrowRight className="ml-1 h-3 w-3" />
      </Link>
      <Link href="/contact" className="inline-flex items-center justify-center px-3 py-1.5 border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-sm font-bold text-xs uppercase tracking-wide" style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
      }}>
        Watch Demo <Play className="ml-1 h-3 w-3" />
      </Link>
    </div>
  )
}

// Trust Indicators (Client Component for icons)
export function TrustIndicators() {
  return (
    <section className="py-4 px-3 sm:px-4 lg:px-6 bg-blue-100/40 border-y border-blue-200">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-blue-700">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            <span>500+ Active Deployments</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            <span>4.9/5 Customer Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            <span>50+ Languages Supported</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-blue-500" />
            <span>Enterprise Security (SOC 2)</span>
          </div>
        </div>
      </div>
    </section>
  )
}

// Final CTA Section (Client Component for icons)
export function FinalCTASection() {
  return (
    <section className="py-10 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-white/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto text-center relative z-10 max-w-4xl">
        <div className="inline-block mb-4">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-white/30" style={{
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
          }}>
            Ready to Transform Your Business?
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-4">
          Deploy Your AI Voice Bot Today
        </h2>

        <p className="text-sm text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed">
          Join 500+ businesses using <strong>AI Voice Bot</strong> to automate customer conversations and reduce operational costs by 70%.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 font-bold text-sm shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wide" style={{
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center px-4 py-2 bg-transparent border-2 border-white text-white font-bold text-sm shadow-lg hover:bg-white/10 hover:scale-105 transition-all duration-300 uppercase tracking-wide" style={{
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            Schedule Demo
          </Link>
        </div>

        <p className="text-xs text-white/70 mt-4">
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
    <div className="bg-white/90 backdrop-blur-md border border-blue-200 p-6 shadow-2xl shadow-blue-500/15 relative overflow-hidden" style={{
      clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
    }}>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-300 rounded-full opacity-15 filter blur-xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6 h-24 bg-gradient-to-br from-blue-100/30 to-blue-200/20 border border-blue-200 relative overflow-hidden" style={{
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
        }}>
          <div className="flex items-center justify-center gap-1.5 h-16">
            {waveformBars.map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 opacity-60"
                style={{ height: `${height}px`, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 border border-blue-400" style={{
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
          }}>
            <Play className="w-4 h-4" />
            <span>Play AI Voice Demo</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BenefitsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
      {benefits.map((benefit, index) => {
        const IconComponent = iconMap[benefit.iconName]
        return (
          <div key={index} className="bg-blue-50 backdrop-blur-md p-3 shadow-lg shadow-blue-500/15 border border-blue-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-blue-400/25 relative overflow-hidden group" style={{
            clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
          }}>
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-tr from-blue-300/30 via-blue-400/20 to-blue-500/20 rounded-full filter blur-xl group-hover:opacity-25 transition-opacity"></div>
            <IconComponent className="h-6 w-6 text-blue-600 mx-auto mb-2 relative z-10" style={{ filter: 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.2))' }} />
            <div className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 mb-1 relative z-10" style={{ textShadow: '0 0 15px rgba(234, 88, 12, 0.2)' }}>{benefit.stat}</div>
            <p className="font-extrabold text-gray-900 mb-1 relative z-10 text-xs">{benefit.title}</p>
            <p className="text-xs text-blue-600 relative z-10">{benefit.description}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {features.map((feature, index) => {
        const FeatureIcon = iconMap[feature.iconName]
        return (
          <article
            key={index}
            className="group bg-blue-50 backdrop-blur-md p-3 shadow-lg shadow-blue-500/15 border border-blue-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-400/25 relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
            itemScope
            itemType="https://schema.org/SoftwareFeature"
          >
            <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden">
              <Image src={images[index]} alt={`${feature.title} - AI Voice Bot Feature`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
              <div className="absolute top-2 left-2">
                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center shadow-lg border border-blue-400" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                  <FeatureIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-tr from-blue-300/20 via-blue-400/15 to-blue-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>
            <h3 itemProp="name" className="text-sm font-bold text-gray-900 mb-2 relative z-10">{feature.title}</h3>
            <p itemProp="description" className="text-xs text-gray-700 leading-relaxed relative z-10">{feature.description}</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {useCases.map((useCase, index) => {
        const UseCaseIcon = iconMap[useCase.iconName]
        return (
          <article
            key={index}
            className="group bg-blue-50 backdrop-blur-md p-3 shadow-lg shadow-blue-500/15 border border-blue-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-400/25 relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          >
            <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden">
              <Image src={images[index]} alt={`${useCase.title} - AI Voice Bot Use Case`} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-transparent"></div>
              <div className="absolute bottom-2 left-2">
                <div className="w-8 h-8 bg-blue-500 flex items-center justify-center shadow-lg border border-blue-400" style={{ clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))' }}>
                  <UseCaseIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-300/20 via-blue-400/15 to-blue-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>
            <h3 className="text-sm font-bold text-gray-900 mb-2 relative z-10">{useCase.title}</h3>
            <p className="text-xs text-gray-700 leading-relaxed relative z-10">{useCase.description}</p>
          </article>
        )
      })}
    </div>
  )
}

export function FAQSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {faqs.map((faq, index) => (
        <article
          key={index}
          className="bg-blue-50 backdrop-blur-md p-4 shadow-lg shadow-blue-500/15 border border-blue-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-blue-400/25 relative overflow-hidden group"
          style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))' }}
          itemScope
          itemProp="mainEntity"
          itemType="https://schema.org/Question"
        >
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-tr from-blue-300/20 via-blue-400/15 to-blue-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-6 h-6 bg-blue-500 flex items-center justify-center shadow-md flex-shrink-0 border border-blue-400" style={{ clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))' }}>
              <span className="text-white font-bold text-xs">Q</span>
            </div>
            <div className="flex-1">
              <h3 itemProp="name" className="text-sm font-bold text-gray-900 mb-2 leading-snug">{faq.question}</h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="text-xs text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
