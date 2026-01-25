import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Bot, Brain, CheckCircle, Clock, Globe, Headphones, Mic, Phone, Play, Shield, TrendingUp, Users, Workflow, Zap } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'AI Voice Bot for Customer Service | 24/7 Phone Call Automation | DigitalBot.ai',
  description: 'Deploy AI Voice Bot powered by advanced Natural Language Processing to automate customer conversations. Handle unlimited calls simultaneously with human-like voice synthesis, reduce costs by 70%, and provide instant responses 24/7. No coding required - launch your AI Voice Bot in minutes.',
  keywords: [
    'AI Voice Bot',
    'AI Voice Assistant',
    'Voice Automation',
    'Customer Service AI',
    'Phone Call Automation',
    'Natural Language Processing',
    'AI Customer Support',
    'Voice Bot Platform',
    'Automated Phone System',
    '24/7 AI Assistant',
    'Voice AI Technology',
    'Customer Service Automation',
    'AI Receptionist',
    'Voice Recognition AI',
    'Business Phone AI'
  ],
  authors: [{ name: 'DigitalBot.ai' }],
  creator: 'DigitalBot.ai',
  publisher: 'DigitalBot.ai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.digitalbot.ai/services/ai-voice-bot',
    title: 'AI Voice Bot for Customer Service | 24/7 Phone Call Automation',
    description: 'Deploy AI Voice Bot to automate customer conversations 24/7. Handle unlimited calls simultaneously, reduce costs by 70%, and get instant responses with natural language processing.',
    siteName: 'DigitalBot.ai',
    images: [
      {
        url: 'https://www.digitalbot.ai/og-ai-voice-bot.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Voice Bot Platform - 24/7 Customer Service Automation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Bot for Customer Service | 24/7 Phone Call Automation',
    description: 'Deploy AI Voice Bot to automate customer conversations 24/7. Handle unlimited calls simultaneously and reduce costs by 70%.',
    site: '@DigitalBotAI',
    creator: '@DigitalBotAI',
    images: ['https://www.digitalbot.ai/og-ai-voice-bot.jpg'],
  },
  alternates: {
    canonical: 'https://www.digitalbot.ai/services/ai-voice-bot',
  },
  other: {
    'fb:app_id': '12345678901234567',
  },
}

const features = [
  {
    icon: Brain,
    title: "Advanced AI Technology",
    description: "Powered by cutting-edge natural language processing and deep learning algorithms for accurate voice understanding and human-like responses."
  },
  {
    icon: Mic,
    title: "Natural Voice Synthesis",
    description: "Crystal-clear, human-like voice output with emotion detection and contextual tone adjustment for authentic conversations."
  },
  {
    icon: Workflow,
    title: "Custom Conversation Flows",
    description: "Design tailored dialogue paths for your specific business needs with our intuitive no-code conversation builder."
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics Dashboard",
    description: "Comprehensive insights into every conversation with detailed metrics, sentiment analysis, and performance tracking."
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Bank-level encryption, SOC 2 compliance, GDPR ready with end-to-end data protection and privacy controls."
  },
  {
    icon: Bot,
    title: "Omnichannel Integration",
    description: "Seamlessly deploy across phone systems, web chat, mobile apps, WhatsApp, SMS, and messaging platforms."
  },
]

const benefits = [
  {
    icon: Clock,
    title: "24/7 Availability",
    stat: "100%",
    description: "Never miss a customer call, day or night"
  },
  {
    icon: Users,
    title: "Unlimited Scalability",
    stat: "∞",
    description: "Handle thousands of calls simultaneously"
  },
  {
    icon: TrendingUp,
    title: "Cost Reduction",
    stat: "70%",
    description: "Lower operational costs vs human agents"
  },
  {
    icon: Zap,
    title: "Instant Response",
    stat: "<1s",
    description: "Lightning-fast AI-powered responses"
  },
]

const useCases = [
  {
    title: "Customer Support Automation",
    description: "Handle FAQs, troubleshooting, and support tickets automatically with AI voice bots that understand context and provide accurate solutions.",
    icon: Headphones
  },
  {
    title: "Appointment Scheduling",
    description: "Automate booking, rescheduling, and reminders for appointments across healthcare, salons, and service businesses.",
    icon: Phone
  },
  {
    title: "Lead Qualification",
    description: "Engage prospects, qualify leads, and route high-value opportunities to your sales team automatically.",
    icon: TrendingUp
  },
  {
    title: "Order Status & Tracking",
    description: "Provide instant updates on orders, deliveries, and shipments without human intervention.",
    icon: Globe
  },
]

const faqs = [
  {
    question: "What is an AI Voice Bot?",
    answer: "An AI Voice Bot is an advanced artificial intelligence system that uses natural language processing (NLP) and machine learning to conduct voice conversations with customers. It can understand spoken language, interpret intent, process requests, and respond with human-like voice synthesis - all automatically and 24/7. AI Voice Bots handle customer service, sales, support, and information queries without human intervention, providing instant responses while learning and improving from every interaction."
  },
  {
    question: "How does an AI Voice Bot work?",
    answer: "AI Voice Bots work through several sophisticated technologies: (1) Speech Recognition converts spoken words into text using advanced algorithms. (2) Natural Language Processing (NLP) analyzes the text to understand intent, context, and meaning. (3) AI Decision Engine processes the request and determines the appropriate response based on trained data and business logic. (4) Voice Synthesis converts the response text back into natural-sounding speech. (5) Continuous Learning improves accuracy over time by analyzing conversation patterns and outcomes."
  },
  {
    question: "What are the benefits of using AI Voice Bot for my business?",
    answer: "AI Voice Bots deliver multiple business benefits: (1) 24/7 Availability - Handle calls anytime without human agents. (2) Cost Reduction - Save up to 70% on customer service costs. (3) Unlimited Scalability - Manage thousands of simultaneous calls without wait times. (4) Consistent Service Quality - Provide uniform, error-free responses every time. (5) Faster Response Times - Instant answers within 1 second. (6) Data-Driven Insights - Analytics on every conversation for continuous improvement. (7) Multilingual Support - Communicate in multiple languages automatically."
  },
  {
    question: "Can AI Voice Bot understand different accents and languages?",
    answer: "Yes, modern AI Voice Bots are trained on diverse datasets including multiple accents, dialects, and languages. Our AI Voice Bot supports 50+ languages and automatically detects the caller's language, adapting in real-time. The advanced NLP models recognize regional accents (American, British, Australian, Indian English, etc.) and colloquial expressions. The system continuously learns from interactions to improve accuracy across different speech patterns, making it ideal for global businesses serving diverse customer bases."
  },
  {
    question: "How quickly can I deploy an AI Voice Bot?",
    answer: "With DigitalBot.ai, you can deploy a fully functional AI Voice Bot in as little as 5-10 minutes. Our platform offers: (1) Pre-built Templates for common use cases (customer support, appointment booking, lead qualification). (2) No-Code Builder - Design conversation flows visually without programming. (3) One-Click Integration with existing phone systems, CRM, and business tools. (4) Instant Testing & Preview before going live. Most businesses are operational within 24 hours, compared to traditional development that takes weeks or months."
  },
  {
    question: "Is my customer data secure with AI Voice Bot?",
    answer: "Absolutely. Security is our top priority. Our AI Voice Bot employs: (1) End-to-End Encryption - All voice data encrypted in transit and at rest using AES-256. (2) SOC 2 Type II Compliance - Regular third-party security audits. (3) GDPR & CCPA Compliant - Full data privacy compliance for global regulations. (4) Role-Based Access Controls - Granular permissions for team members. (5) Data Retention Policies - Automatic deletion per your requirements. (6) Regular Security Updates - Continuous monitoring and threat protection. Your customer conversations and data are protected with bank-level security."
  },
  {
    question: "What industries can benefit from AI Voice Bot?",
    answer: "AI Voice Bots deliver value across virtually all industries: (1) Healthcare - Appointment scheduling, prescription refills, patient support. (2) E-commerce - Order tracking, product inquiries, returns processing. (3) Banking & Finance - Account inquiries, transaction support, fraud alerts. (4) Real Estate - Property inquiries, showing scheduling, lead qualification. (5) Hospitality - Reservations, concierge services, guest support. (6) Telecommunications - Technical support, billing inquiries, service upgrades. (7) Insurance - Claims processing, policy information, quote requests. (8) Education - Admissions, course information, student support. Any business receiving customer calls can leverage AI Voice Bots."
  },
  {
    question: "Can AI Voice Bot integrate with my existing systems?",
    answer: "Yes, our AI Voice Bot offers seamless integration with popular business tools: (1) CRM Systems - Salesforce, HubSpot, Zoho, Pipedrive. (2) Help Desk - Zendesk, Freshdesk, Intercom, Help Scout. (3) Phone Systems - Twilio, RingCentral, 8x8, Vonage. (4) Calendars - Google Calendar, Outlook, Calendly. (5) E-commerce - Shopify, WooCommerce, Magento. (6) Custom APIs - RESTful API access for proprietary systems. (7) Databases - MySQL, PostgreSQL, MongoDB. Integration typically takes minutes using our pre-built connectors or custom webhooks."
  },
  {
    question: "How much does AI Voice Bot cost?",
    answer: "AI Voice Bot pricing is flexible and scales with your needs. Plans start at $55/month for 300 AI voice minutes (ideal for small businesses), $145/month for 1000 minutes (growing businesses), with custom enterprise packages for high-volume needs. All plans include: unlimited voice channels, 24/7 support, real-time analytics, CRM integration, and free trial period. No setup fees, no hidden costs, and you only pay for actual voice minutes used. Contact us for a custom quote based on your specific requirements and volume."
  },
  {
    question: "What makes DigitalBot.ai's AI Voice Bot different from competitors?",
    answer: "Our AI Voice Bot stands out through: (1) Superior Accuracy - 95%+ intent recognition vs industry average of 80%. (2) Human-Like Voice - Most natural-sounding synthesis with emotion and tone. (3) Fastest Deployment - Live in minutes, not weeks. (4) No-Code Platform - Anyone can build flows without technical skills. (5) Advanced Analytics - Deep insights into every conversation. (6) Multilingual Excellence - True understanding in 50+ languages, not just translation. (7) White-Glove Support - Dedicated success team for implementation. (8) Proven ROI - Clients see 70% cost reduction and 40% higher customer satisfaction on average."
  }
]

// VoiceConversationPlayer Component
const VoiceConversationPlayer = () => {
  return (
    <div className="bg-white/90 backdrop-blur-md border border-orange-200 p-6 shadow-2xl shadow-orange-500/15 relative overflow-hidden" style={{
      clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
    }}>
      <div className="absolute -top-4 -left-4 w-16 h-16 bg-orange-300 rounded-full opacity-15 filter blur-xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6 h-24 bg-gradient-to-br from-orange-100/30 to-orange-200/20 border border-orange-200 relative overflow-hidden" style={{
          clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
        }}>
          <div className="flex items-center justify-center gap-1.5 h-16">
            {Array.from({ length: 30 }, (_, i) => {
              const height = Math.sin(i * 0.5) * 15 + 20;
              return (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-orange-500 via-orange-400 to-orange-300 opacity-60"
                  style={{
                    height: `${height}px`,
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
                  }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-orange-500 text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 border border-orange-400" style={{
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

export default function AIVoiceBot() {

  // Comprehensive JSON-LD Structured Data for Maximum SEO
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
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Sarah Johnson"
          },
          "reviewBody": "Best AI voice bot platform we've used. Reduced our call center costs by 70% while improving customer satisfaction."
        },
        "description": "AI Voice Bot platform for automated customer service with natural language processing, 24/7 availability, and unlimited scalability. Deploy intelligent voice assistants in minutes.",
        "url": "https://www.digitalbot.ai/services/ai-voice-bot",
        "image": "https://www.digitalbot.ai/og-ai-voice-bot.jpg",
        "publisher": {
          "@type": "Organization",
          "name": "DigitalBot.ai",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.digitalbot.ai/logo.png"
          }
        },
        "featureList": [
          "24/7 Automated Voice Assistance",
          "Natural Language Processing",
          "Multi-language Support (50+ Languages)",
          "Real-time Analytics Dashboard",
          "Enterprise Security & Compliance",
          "Omnichannel Integration",
          "No-Code Conversation Builder",
          "CRM Integration",
          "Sentiment Analysis",
          "Voice Emotion Detection"
        ],
        "screenshot": "https://www.digitalbot.ai/screenshots/ai-voice-bot-dashboard.jpg"
      },
      {
        "@type": "Product",
        "name": "AI Voice Bot Solution",
        "description": "Enterprise AI voice automation platform for customer service, sales, and support. Automate phone conversations with human-like AI voice bots.",
        "brand": {
          "@type": "Brand",
          "name": "DigitalBot.ai"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "USD",
          "lowPrice": "55",
          "highPrice": "999",
          "offerCount": "3",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1250"
        }
      },
      {
        "@type": "Service",
        "serviceType": "AI Voice Bot Implementation",
        "provider": {
          "@type": "Organization",
          "name": "DigitalBot.ai"
        },
        "areaServed": "Worldwide",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "AI Voice Bot Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "AI Voice Bot Setup & Configuration"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Custom Voice Bot Development"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Voice Bot Analytics & Optimization"
              }
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq, index) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "VideoObject",
        "name": "AI Voice Bot Demo - DigitalBot.ai",
        "description": "See how AI Voice Bot handles customer conversations with natural language processing and human-like responses",
        "thumbnailUrl": "https://www.digitalbot.ai/video-thumbnail-ai-voice-bot.jpg",
        "uploadDate": "2024-01-15",
        "duration": "PT2M30S",
        "contentUrl": "https://www.digitalbot.ai/videos/ai-voice-bot-demo.mp4"
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.digitalbot.ai"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://www.digitalbot.ai/services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "AI Voice Bot",
            "item": "https://www.digitalbot.ai/services/ai-voice-bot"
          }
        ]
      }
    ]
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-white text-gray-900" role="main">
        <Header />

        {/* Hero Section */}
        <section className="pt-20 pb-8 px-3 sm:px-4 lg:px-6 relative overflow-hidden bg-white" aria-labelledby="hero-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] bg-gradient-radial from-orange-200/25 to-transparent rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-[60%] left-[60%] w-[250px] h-[250px] bg-gradient-radial from-orange-300/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          </div>

          <div className="container mx-auto text-center relative z-10 max-w-6xl">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <ol className="flex items-center justify-center space-x-2 text-xs text-orange-600" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/" className="hover:text-gray-900 transition-colors" itemProp="item">
                    <span itemProp="name">Home</span>
                  </Link>
                  <meta itemProp="position" content="1" />
                </li>
                <li className="text-orange-600">/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <Link href="/services" className="hover:text-gray-900 transition-colors" itemProp="item">
                    <span itemProp="name">Services</span>
                  </Link>
                  <meta itemProp="position" content="2" />
                </li>
                <li className="text-orange-600">/</li>
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span itemProp="name" className="text-gray-900 font-semibold">AI Voice Bot</span>
                  <meta itemProp="position" content="3" />
                </li>
              </ol>
            </nav>

            {/* Hero Badge */}
            <div className="inline-block mb-3">
              <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg animate-pulse border border-orange-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                🤖 #1 AI Voice Bot Platform
              </span>
            </div>

            {/* H1 Heading */}
            <h1 id="hero-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              <span className="block mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                AI Voice Bot for Customer Service
              </span>
              <span className="inline-block px-4 py-2 text-white bg-orange-500 shadow-lg shadow-orange-500/30 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-orange-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <span className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-transparent to-transparent"></span>
                <span className="relative z-10">Automate 24/7 Phone Calls</span>
              </span>
            </h1>

            {/* SEO-Rich Description */}
            <div className="max-w-4xl mx-auto mb-6 p-3 bg-orange-50 backdrop-blur-md border border-orange-200 shadow-md shadow-orange-500/10" style={{
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
            }}>
              <p className="text-xs sm:text-sm text-gray-900 leading-relaxed font-medium">
                Deploy <strong className="text-orange-600">AI Voice Bot</strong> powered by advanced <strong className="text-orange-600">Natural Language Processing</strong> to automate customer conversations. Handle unlimited calls simultaneously with <strong className="text-orange-600">human-like voice synthesis</strong>, reduce costs by 70%, and provide instant responses 24/7. No coding required - launch your <strong className="text-orange-600">AI Voice Bot</strong> in minutes.
              </p>
            </div>

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 max-w-5xl mx-auto mb-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-orange-50 backdrop-blur-md p-3 shadow-lg shadow-orange-500/15 border border-orange-200 transition-transform duration-300 hover:scale-[1.02] hover:shadow-orange-400/25 relative overflow-hidden group" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-tr from-orange-300/30 via-orange-400/20 to-orange-500/20 rounded-full filter blur-xl group-hover:opacity-25 transition-opacity"></div>
                  <benefit.icon className="h-6 w-6 text-orange-600 mx-auto mb-2 relative z-10" style={{
                    filter: 'drop-shadow(0 0 6px rgba(234, 88, 12, 0.2))'
                  }} />
                  <div className="text-lg sm:text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 mb-1 relative z-10" style={{
                    textShadow: '0 0 15px rgba(234, 88, 12, 0.2)'
                  }}>{benefit.stat}</div>
                  <p className="font-extrabold text-gray-900 mb-1 relative z-10 text-xs">{benefit.title}</p>
                  <p className="text-xs text-orange-600 relative z-10">{benefit.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/signup" className="inline-flex items-center justify-center px-3 py-1.5 bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30 hover:scale-105 transition-all duration-300 border border-orange-400 uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                Start Free Trial <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-3 py-1.5 border border-orange-500 text-orange-600 bg-transparent hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-sm font-bold text-xs uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                Watch Demo <Play className="ml-1 h-3 w-3" />
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-orange-600">
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">Setup in 5 Minutes</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">1000+ Businesses Use AI Voice Bot</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" aria-labelledby="features-heading">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[10%] left-[10%] w-[250px] h-[250px] bg-gradient-radial from-orange-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-orange-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  AI Voice Bot Features
                </span>
              </div>
              <h2 id="features-heading" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  Everything Your AI Voice Bot Needs
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Enterprise-grade <strong className="text-orange-600">AI voice bot</strong> capabilities designed to transform your customer communication and automate phone interactions
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {features.map((feature, index) => {
                const images = [
                  'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2070&auto=format&fit=crop'
                ];
                return (
                  <article
                    key={index}
                    className="group bg-orange-50 backdrop-blur-md p-3 shadow-lg shadow-orange-500/15 border border-orange-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-orange-400/25 relative overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                    }}
                    itemScope
                    itemType="https://schema.org/SoftwareFeature"
                  >
                    {/* HD Image Header */}
                    <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden">
                      <Image
                        src={images[index]}
                        alt={`${feature.title} - AI Voice Bot Feature`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <div className="w-8 h-8 bg-orange-500 flex items-center justify-center shadow-lg border border-orange-400" style={{
                          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                        }}>
                          <feature.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Glow */}
                    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-tr from-orange-300/20 via-orange-400/15 to-orange-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity duration-300"></div>

                    {/* Content */}
                    <h3 itemProp="name" className="text-sm font-bold text-gray-900 mb-2 relative z-10">
                      {feature.title}
                    </h3>
                    <p itemProp="description" className="text-xs text-gray-700 leading-relaxed relative z-10">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" aria-labelledby="usecases-heading">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[30%] left-[20%] w-[150px] h-[150px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[15%] w-[200px] h-[200px] bg-gradient-radial from-orange-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto relative z-10 max-w-7xl">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg border border-orange-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Real-World Applications
                </span>
              </div>
              <h2 id="usecases-heading" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3">
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                  AI Voice Bot Use Cases
                </span>
              </h2>
              <p className="text-sm text-gray-700 max-w-3xl mx-auto leading-relaxed">
                See how businesses leverage <strong className="text-orange-600">AI voice bot</strong> technology to streamline operations and enhance customer experience
              </p>
            </div>

            {/* Use Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {useCases.map((useCase, index) => {
                const images = [
                  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=2076&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop'
                ];
                return (
                  <article
                    key={index}
                    className="group bg-orange-50 backdrop-blur-md p-3 shadow-lg shadow-orange-500/15 border border-orange-200 transition-all duration-300 hover:scale-[1.01] hover:shadow-orange-400/25 relative overflow-hidden"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                    }}
                  >
                    {/* HD Image Header */}
                    <div className="relative h-32 -mx-3 -mt-3 mb-3 overflow-hidden">
                      <Image
                        src={images[index]}
                        alt={`${useCase.title} - AI Voice Bot Use Case`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-white/30 to-transparent"></div>
                      <div className="absolute bottom-2 left-2">
                        <div className="w-8 h-8 bg-orange-500 flex items-center justify-center shadow-lg border border-orange-400" style={{
                          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                        }}>
                          <useCase.icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Decorative Glow */}
                    <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-orange-300/20 via-orange-400/15 to-orange-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>

                    {/* Content */}
                    <h3 className="text-sm font-bold text-gray-900 mb-2 relative z-10">
                      {useCase.title}
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed relative z-10">
                      {useCase.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sample Conversation Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[200px] h-[200px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] bg-gradient-radial from-orange-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-gradient-radial from-orange-300/20 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-orange-100 backdrop-blur-sm px-2 py-1 border border-orange-200 shadow-sm mb-3" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <Mic className="h-3 w-3 text-orange-600 animate-pulse" />
                <span className="font-medium text-gray-900 text-xs">AI Voice Demonstration</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-2" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.15)'
              }}>
                Experience Natural AI Conversations
              </h2>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                Listen to how our <strong className="text-orange-600">AI voice bot</strong> handles real customer interactions with human-like responses
              </p>
            </div>

            {/* Audio Player Card */}
            <div className="relative">
              <VoiceConversationPlayer />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="faq-section">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-24 h-24 bg-gradient-to-br from-orange-200/20 to-orange-300/15 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-28 h-28 bg-gradient-to-br from-orange-200/25 to-orange-300/20 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-orange-300/15 to-orange-400/15 rounded-full filter blur-lg animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Section Header */}
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg animate-pulse border border-orange-400" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  Got Questions? We've Got Answers
                </span>
              </div>
              <h2 id="faq-section" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 text-gray-900">
                <span className="block mb-1">Frequently Asked</span>
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent" style={{
                  textShadow: '0 0 15px rgba(234, 88, 12, 0.15)'
                }}>
                  Questions
                </span>
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl mx-auto leading-relaxed">
                Everything you need to know about <span className="text-orange-600 font-semibold">AI Voice Bots</span> and how to implement them
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {faqs.map((faq, index) => {
                return (
                  <div key={index} className="group relative bg-orange-50 backdrop-blur-md p-3 border border-orange-200 hover:border-orange-400 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-orange-500/15" style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}>
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-orange-500 flex items-center justify-center text-white font-bold text-xs shadow-sm rotate-12 group-hover:rotate-0 transition-transform border border-orange-400" style={{
                      clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))'
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-sm font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 mt-1">
                      {faq.question}
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" aria-labelledby="cta-heading">
          {/* Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] left-[10%] w-[200px] h-[200px] bg-gradient-radial from-orange-200/30 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] bg-gradient-radial from-orange-200/25 to-transparent rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] bg-gradient-radial from-orange-300/20 to-transparent rounded-full blur-xl animate-pulse"></div>
          </div>

          <div className="container mx-auto max-w-5xl text-center relative z-10">
            {/* CTA Badge */}
            <div className="inline-block mb-3">
              <span className="px-3 py-1 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg animate-pulse border border-orange-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                🚀 Start Free Trial
              </span>
            </div>

            {/* CTA Heading */}
            <h2 id="cta-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              <span className="block mb-2 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Transform Customer Service
              </span>
              <span className="inline-block px-4 py-2 text-white bg-orange-500 shadow-lg shadow-orange-500/30 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-orange-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <span className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-transparent to-transparent"></span>
                <span className="relative z-10">With AI Voice Bot Today</span>
              </span>
            </h2>

            {/* CTA Description */}
            <div className="max-w-3xl mx-auto mb-6 p-3 bg-orange-50 backdrop-blur-md border border-orange-200 shadow-md shadow-orange-500/10" style={{
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
            }}>
              <p className="text-xs sm:text-sm text-gray-900 leading-relaxed font-medium">
                Launch your <strong className="text-orange-600">AI voice bot</strong> in <strong className="text-orange-600">5 minutes</strong> and start automating customer conversations. <strong className="text-orange-600">No credit card required.</strong> Join 1000+ businesses saving 70% on support costs.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-6">
              <Link href="/signup" className="inline-flex items-center justify-center px-3 py-1.5 bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30 hover:scale-105 transition-all duration-300 border border-orange-400 uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                Start Free Trial Now <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-3 py-1.5 border border-orange-500 text-orange-600 bg-transparent hover:bg-orange-50 hover:scale-105 transition-all duration-300 shadow-sm font-bold text-xs uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Phone className="mr-1 h-3 w-3" />
                Book Live Demo
              </Link>
            </div>

            {/* Trust Signals - Cyberpunk Cards */}
            <div className="flex flex-wrap justify-center gap-3 items-center">
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 backdrop-blur-md border border-orange-200 shadow-lg shadow-orange-500/10 hover:scale-105 transition-all duration-300 group relative overflow-hidden" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-300/20 via-orange-400/15 to-orange-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>
                <Shield className="h-4 w-4 text-orange-600 relative z-10" />
                <span className="font-bold text-gray-900 relative z-10 text-xs">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 backdrop-blur-md border border-orange-200 shadow-lg shadow-orange-500/10 hover:scale-105 transition-all duration-300 group relative overflow-hidden" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-300/20 via-orange-400/15 to-orange-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>
                <Headphones className="h-4 w-4 text-orange-600 relative z-10" />
                <span className="font-bold text-gray-900 relative z-10 text-xs">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 backdrop-blur-md border border-orange-200 shadow-lg shadow-orange-500/10 hover:scale-105 transition-all duration-300 group relative overflow-hidden" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-orange-300/20 via-orange-400/15 to-orange-500/15 rounded-full filter blur-xl group-hover:opacity-30 transition-opacity"></div>
                <TrendingUp className="h-4 w-4 text-orange-600 relative z-10" />
                <span className="font-bold text-gray-900 relative z-10 text-xs">1000+ Businesses</span>
              </div>
            </div>

            {/* Additional Trust Signals */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-orange-600">
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">Free 14-Day Trial</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 backdrop-blur-sm border border-orange-200 shadow-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="h-3 w-3 text-orange-600" />
                <span className="font-semibold text-gray-900">Setup in 5 Minutes</span>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  )
}







