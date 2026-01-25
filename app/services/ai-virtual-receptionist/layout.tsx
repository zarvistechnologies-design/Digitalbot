import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Virtual Receptionist | 24/7 Automated Call Answering Service - DigitalBot.ai 2026",
  description: "AI-powered virtual receptionist that answers calls, books appointments, and routes inquiries 24/7 in 30+ languages. Save 70% on reception costs with HIPAA-compliant voice AI. Never miss a call again.",
  keywords: [
    "ai virtual receptionist",
    "virtual receptionist ai",
    "24/7 call answering",
    "automated receptionist",
    "ai phone answering service",
    "virtual receptionist service",
    "ai answering service",
    "automated call answering",
    "ai receptionist software",
    "virtual phone receptionist",
    "ai front desk receptionist",
    "automated appointment booking",
    "ai call screening",
    "virtual office receptionist",
    "ai phone system for small business",
  ],
  openGraph: {
    title: "AI Virtual Receptionist | 24/7 Automated Call Answering Service - DigitalBot.ai 2026",
    description: "AI-powered virtual receptionist that answers calls, books appointments, and routes inquiries 24/7 in 30+ languages. Save 70% on reception costs with HIPAA-compliant voice AI.",
    type: "website",
    url: "https://digitalbot.ai/services/ai-virtual-receptionist",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Virtual Receptionist - 24/7 Call Answering Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Virtual Receptionist | 24/7 Automated Call Answering Service - DigitalBot.ai 2026",
    description: "AI-powered virtual receptionist that answers calls, books appointments, and routes inquiries 24/7 in 30+ languages. Save 70% on reception costs with HIPAA-compliant voice AI.",
    images: ["/images/ai-voice-agent.png"],
  },
};

export default function AIVirtualReceptionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
