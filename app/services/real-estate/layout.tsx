import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real Estate Voice Agent | AI Property Lead Qualification - DigitalBot.ai",
  description:
    "Deploy an AI real estate voice agent that answers property calls, qualifies buyers, captures budget and location, and helps book site visits 24/7.",
  keywords: [
    "real estate voice agent",
    "ai real estate assistant",
    "ai property lead qualification",
    "real estate call automation",
    "ai site visit booking",
    "property inquiry automation",
    "real estate ai voice bot",
    "ai agent for builders",
    "ai agent for brokers",
    "real estate lead follow up",
  ],
  openGraph: {
    title: "Real Estate Voice Agent | AI Property Lead Qualification - DigitalBot.ai",
    description:
      "Answer property calls, qualify buyers, capture requirements, and book site visits with an AI voice agent built for real estate teams.",
    type: "website",
    url: "https://www.digitalbot.ai/services/real-estate",
    images: [
      {
        url: "/images/voice_realestate_1.png",
        width: 1200,
        height: 630,
        alt: "Real estate AI voice agent lead qualification flow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real Estate Voice Agent | AI Property Lead Qualification - DigitalBot.ai",
    description:
      "AI voice agent for real estate teams that qualifies buyers and helps book site visits from every property inquiry.",
    images: ["/images/voice_realestate_1.png"],
  },
  alternates: {
    canonical: "https://www.digitalbot.ai/services/real-estate",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RealEstateLayout({ children }: { children: React.ReactNode }) {
  return children
}
