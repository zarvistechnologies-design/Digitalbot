import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Customer Support | 24/7 Automated Support | DigitalBot",
  description:
    "Deploy AI customer support that resolves 80% of tickets instantly. 60+ languages, 98% CSAT, HIPAA compliant. Trusted by 500+ businesses for world-class support automation.",
  keywords: [
    "AI customer support",
    "customer service automation",
    "AI chatbot for support",
    "support ticket automation",
    "conversational AI support",
    "24/7 customer service",
    "CSAT improvement",
    "customer support AI",
    "automated customer service",
    "AI help desk",
    "multilingual support AI",
    "customer experience automation",
    "DigitalBot"
  ],
  openGraph: {
    title: "AI Customer Support | 24/7 Automated Support | DigitalBot",
    description:
      "Deploy AI customer support that resolves 80% of tickets instantly. 60+ languages, 98% CSAT, HIPAA compliant. Trusted by 500+ businesses.",
    url: "https://www.digitalbot.ai/services/ai-customer-support",
    siteName: "DigitalBot.ai",
    images: [
      {
        url: "https://www.digitalbot.ai/og-customer-support.png",
        width: 1200,
        height: 630,
        alt: "DigitalBot AI Customer Support Platform"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Customer Support | 24/7 Automated Support | DigitalBot",
    description:
      "Deploy AI customer support that resolves 80% of tickets instantly. 60+ languages, 98% CSAT, HIPAA compliant.",
    images: ["https://www.digitalbot.ai/og-customer-support.png"]
  },
  alternates: {
    canonical: "https://www.digitalbot.ai/services/ai-customer-support"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function AICustomerSupportLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
