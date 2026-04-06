import ChatbotWidget from "@/components/chatbot-widget"
import { Analytics } from "@vercel/analytics/next"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import Script from "next/script"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "AI Voice Agent | AI Voice Assistant Platform - DigitalBot.ai 2025",
  description: "🤖 Leading AI Voice Agent & AI Voice Assistant Platform. 24/7 automated customer service that never sleeps. Personal analytics dashboard. Free 14-day trial!",
  keywords: "ai voice agent, ai voice assistant, voice agent platform, ai assistant platform, conversational ai agent, intelligent voice assistant, ai voice technology, voice agent software, ai assistant software, automated voice agent, smart voice assistant, ai powered voice agent, enterprise voice assistant, business voice agent, ai voice agent platform, voice assistant solution, ai agent automation, voice ai assistant, conversational voice agent, ai customer service agent, voice assistant technology, ai voice bot, intelligent ai agent, voice agent system, ai assistant system, automated ai assistant, ai voice platform, voice agent service, ai assistant service, business ai voice agent, ai voice agent solution, voice assistant automation, ai agent platform, intelligent voice agent, ai voice assistant technology, voice agent automation, ai assistant automation, enterprise ai voice agent, business ai assistant, ai voice agent software, voice assistant platform, ai powered assistant, conversational ai assistant, ai voice agent system, voice assistant system, automated voice assistant, ai voice solutions, voice agent solutions, ai assistant solutions, enterprise voice agent, business voice assistant",
  authors: [{ name: "DigitalBot.ai Team - AI Voice Technology Experts" }],
  creator: "DigitalBot.ai - AI Voice Agent & Assistant Platform",
  publisher: "DigitalBot.ai - Leading AI Voice Technology Provider",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  metadataBase: new URL("https://www.digitalbot.ai"),
  alternates: {
    canonical: "https://www.digitalbot.ai",
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.digitalbot.ai",
    title: "AI Voice Agent | AI Voice Assistant Platform - DigitalBot.ai 2025",
    description: "🤖 Leading AI Voice Agent & AI Voice Assistant Platform. 24/7 automated customer service that never sleeps. Personal analytics dashboard. Free 14-day trial!",
    siteName: "DigitalBot.ai - AI Voice Agent & Assistant Platform",
    images: [
      {
        url: "/og-ai-voice-agent-assistant.jpg",
        width: 1200,
        height: 630,
        alt: "AI Voice Agent & AI Voice Assistant Platform - DigitalBot.ai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@digitalbot_ai",
    creator: "@digitalbot_ai",
    title: "AI Voice Agent | AI Voice Assistant Platform - DigitalBot.ai 2025",
    description: "🤖 Leading AI Voice Agent & AI Voice Assistant Platform. 24/7 automated customer service that never sleeps. Free 14-day trial!",
    images: ["/twitter-ai-voice-agent-assistant.jpg"],
  },
  verification: {
    google: "f2bf8afb699100cd",
  },
  category: "Technology",
  classification: "AI Voice Assistant Business Automation Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.digitalbot.ai/#organization",
        "name": "DigitalBot.ai",
        "url": "https://www.digitalbot.ai",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.digitalbot.ai/logo.png",
          "width": 400,
          "height": 400
        },
        "description": "Leading AI Voice Agent and AI Voice Assistant platform for businesses. Create intelligent conversational AI agents with advanced natural language processing and voice technology.",
        "sameAs": [
          "https://twitter.com/digitalbot_ai",
          "https://linkedin.com/company/digitalbot-ai",
          "https://facebook.com/digitalbot.ai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.digitalbot.ai/#website",
        "url": "https://www.digitalbot.ai",
        "name": "DigitalBot.ai - AI Voice Agent & AI Voice Assistant Platform",
        "description": "AI Voice Agent and AI Voice Assistant platform for building intelligent conversational agents. Advanced voice AI technology for customer service automation and business communication.",
        "publisher": {
          "@id": "https://www.digitalbot.ai/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.digitalbot.ai/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "SoftwareApplication",
        "name": "AI Voice Agent & AI Voice Assistant Platform",
        "description": "Advanced AI Voice Agent and AI Voice Assistant platform with natural language processing, voice recognition, and conversational AI capabilities for businesses. Automate customer service with intelligent voice agents.",
        "url": "https://www.digitalbot.ai",
        "operatingSystem": "Web Browser",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free trial available"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "1247",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is an AI Voice Agent and AI Voice Assistant?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An AI Voice Agent and AI Voice Assistant are intelligent conversational systems that use natural language processing, speech recognition, and machine learning to communicate with users through voice interactions. They can handle customer service, sales inquiries, appointment scheduling, and provide 24/7 automated support for businesses."
            }
          },
          {
            "@type": "Question",
            "name": "How does AI Voice Agent and AI Voice Assistant technology work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Agents and AI Voice Assistants combine speech recognition, natural language understanding, machine learning, and text-to-speech synthesis to create human-like conversations. They process spoken language, understand intent, access relevant information, and respond naturally in real-time to provide intelligent customer interactions."
            }
          },
          {
            "@type": "Question",
            "name": "What are the benefits of using an AI Voice Agent and AI Voice Assistant?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Agents and AI Voice Assistants provide 24/7 customer support, reduce operational costs, improve response times, handle multiple conversations simultaneously, and offer personalized experiences. They can increase customer satisfaction while reducing the workload on human agents and never take breaks."
            }
          },
          {
            "@type": "Question",
            "name": "Can AI Voice Assistants integrate with existing business systems?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AI Voice Assistants offer seamless integration with CRM systems, help desk software, e-commerce platforms, and custom APIs. This ensures smooth data flow and enables the assistant to access customer information, update records, and perform actions within existing workflows."
            }
          },
          {
            "@type": "Question",
            "name": "What is the difference between an AI Voice Agent and traditional IVR systems?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Agents use natural language understanding for genuine conversations, while traditional IVR relies on pre-recorded menus. AI Voice Agents understand context, handle complex queries, learn from interactions, and provide personalized responses for a more natural customer experience."
            }
          },
          {
            "@type": "Question",
            "name": "How much does an AI Voice Assistant platform cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Assistant platforms typically cost $0.05-$0.15 per minute for pay-as-you-go plans, or $500-$5000+ per month for subscription plans depending on call volume and features. Pricing varies based on usage volume, features, and integration requirements."
            }
          },
          {
            "@type": "Question",
            "name": "Can AI Voice Agents make outbound calls for sales and appointments?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AI Voice Agents excel at outbound calls for sales outreach, appointment scheduling, follow-ups, reminders, and surveys. They can handle objections, answer questions, close deals, or book appointments autonomously while maintaining personalized interactions."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the speech recognition in AI Voice Assistants?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Modern AI Voice Assistants achieve 95-98% accuracy in speech recognition. They use advanced deep learning models trained on millions of conversations across various accents, dialects, and speaking styles, continuously improving through machine learning."
            }
          },
          {
            "@type": "Question",
            "name": "What analytics and reporting features are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Assistant platforms provide comprehensive analytics including call volume metrics, conversation duration, resolution rates, customer sentiment analysis, query patterns, performance scores, real-time dashboards, detailed reports, KPIs, conversation recordings, and transcripts."
            }
          },
          {
            "@type": "Question",
            "name": "Can the AI Voice Agent transfer calls to human agents when needed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, AI Voice Agents have intelligent escalation capabilities. They recognize complex queries or customer requests for human assistance and seamlessly transfer calls with all conversation context and customer information to ensure continuity."
            }
          },
          {
            "@type": "Question",
            "name": "How does the AI Voice Assistant learn and improve over time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI Voice Assistants use machine learning to continuously improve by analyzing conversation patterns, learning from feedback, adapting to new vocabulary, identifying customer intents, updating knowledge bases, and incorporating new training data from real interactions."
            }
          },
          {
            "@type": "Question",
            "name": "What happens if the AI Voice Agent encounters technical issues during a call?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The system maintains 99.9% uptime with automatic failover to backup servers, routing to human agents, or providing alternative contact methods. All conversations are logged with real-time monitoring and automated recovery protocols to ensure service continuity."
            }
          }
        ]
      }
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased relative bg-white`} suppressHydrationWarning>
        {/* Google Ads Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17791353502"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17791353502');
          `}
        </Script>
        
        {/* Mobile Performance Optimization */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Mobile optimizations */
            @media (max-width: 768px) {
              /* Optimize touch interactions */
              button, [role="button"] {
                -webkit-tap-highlight-color: transparent;
                touch-action: manipulation;
              }
              
              /* Improve mobile performance */
              * {
                -webkit-overflow-scrolling: touch;
              }
            }
            
            /* Prevent hydration flash */
            .hero-section {
              min-height: 100vh;
            }
          `
        }} />
        
        {children}
        <ChatbotWidget />
        <Analytics />
      </body>
    </html>
  )
}
