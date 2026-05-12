import type { Metadata } from "next"

const title = "AI Customer Support Automation | DigitalBot"
const description = "Deliver 24/7 AI customer support with DigitalBot. Automate resolutions, boost CSAT, and empower agents with omnichannel AI that speaks your brand voice."
const keywords = [
  "AI customer support",
  "AI support automation",
  "voice AI customer service",
  "AI helpdesk platform",
  "DigitalBot customer support",
  "AI ticket deflection",
  "AI call center software",
  "AI chatbot for support",
  "customer experience automation"
]

export const metadata: Metadata = {
  title,
  description,
  keywords,
  openGraph: {
    title,
    description,
    url: "https://www.digitalbot.ai/services/ai-customer-support",
    type: "website",
    locale: "en_US",
    siteName: "DigitalBot",
    images: [
      {
        url: "https://www.digitalbot.ai/og/digitalbot-ai-customer-support.jpg",
        width: 1200,
        height: 630,
        alt: "DigitalBot AI Customer Support Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.digitalbot.ai/og/digitalbot-ai-customer-support.jpg"],
    creator: "@digitalbotai"
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "https://www.digitalbot.ai/services/ai-customer-support"
  }
}
