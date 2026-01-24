import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
  description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses. Start free trial.",
  keywords: [
    "ai call center",
    "ai call center software",
    "automated call center",
    "ai phone system",
    "call center automation",
    "ai customer service",
    "virtual call center",
    "ai call routing",
    "call center ai solution",
    "ai contact center",
    "automated phone system",
    "ai voice call center",
    "call center automation software",
    "ai powered call center",
    "intelligent call routing",
  ],
  openGraph: {
    title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
    description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-call-center",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Call Center Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Call Center | 24/7 Automated Call Center Software - DigitalBot.ai 2025",
    description: "Deploy an AI call center that handles unlimited calls 24/7. Intelligent routing, real-time analytics & CRM integration. Trusted by 500+ businesses.",
    images: ["/images/ai-voice-agent.png"],
  },
};

export default function AICallCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
