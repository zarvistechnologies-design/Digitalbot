import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Sales Agent | Automated Sales Conversations That Close Deals - DigitalBot.ai 2025",
  description: "Deploy AI sales agents that qualify leads, handle objections, and close deals 24/7. Trusted by 500+ businesses. 45% higher conversion rates. Start free trial.",
  keywords: [
    "ai sales agent",
    "ai sales automation",
    "automated sales calls",
    "ai lead qualification",
    "sales conversation ai",
    "ai sales assistant",
    "sales bot",
    "ai sales rep",
    "automated lead generation",
    "sales ai platform",
    "ai sales calls",
    "sales automation software",
    "ai sales pipeline",
    "conversational sales ai",
    "ai sales technology"
  ],
  openGraph: {
    title: "AI Sales Agent | Automated Sales Conversations That Close Deals - DigitalBot.ai 2025",
    description: "Deploy AI sales agents that qualify leads, handle objections, and close deals 24/7. Trusted by 500+ businesses with 45% higher conversion rates.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-sales-agent",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Sales Agent Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Sales Agent | Automated Sales Conversations That Close Deals - DigitalBot.ai 2025",
    description: "Deploy AI sales agents that qualify leads, handle objections, and close deals 24/7. Trusted by 500+ businesses with 45% higher conversion rates.",
    images: ["/images/ai-voice-agent.png"],
  },
  alternates: {
    canonical: "https://www.digitalbot.ai/services/ai-sales-agent"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AISalesAgentLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
