import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Appointment Scheduling | 24/7 Automated Booking | DigitalBot",
  description:
    "Transform your appointment booking with AI-powered virtual receptionist. Automate calls & WhatsApp scheduling, reduce no-shows by 40%, and sync with Google Calendar. 24/7 availability, HIPAA compliant.",
  keywords: [
    "AI appointment scheduling",
    "automated booking system",
    "virtual receptionist",
    "doctor appointment AI",
    "WhatsApp booking",
    "Google Calendar sync",
    "medical scheduling software",
    "reduce no-shows",
    "24/7 appointment booking",
    "voice AI scheduling",
    "healthcare automation",
    "clinic management",
  ],
  openGraph: {
    title: "AI Appointment Scheduling | Never Miss a Booking Again",
    description:
      "Your AI-powered virtual receptionist answers calls and WhatsApp messages instantly, schedules appointments automatically, and syncs with calendars 24/7.",
    type: "website",
    url: "https://digitalbot.ai/services/appointments",
    siteName: "DigitalBot",
    images: [
      {
        url: "https://digitalbot.ai/images/appointments-og.png",
        width: 1200,
        height: 630,
        alt: "DigitalBot AI Appointment Scheduling Dashboard",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Appointment Scheduling | DigitalBot",
    description:
      "Automate your appointment booking with AI. 24/7 availability, WhatsApp integration, 40% fewer no-shows.",
    images: ["https://digitalbot.ai/images/appointments-twitter.png"],
    creator: "@digitalbot_ai",
  },
  alternates: {
    canonical: "https://digitalbot.ai/services/appointments",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Technology",
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "DigitalBot AI Appointment Scheduling",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "AI-powered appointment scheduling software that automates booking via calls and WhatsApp, integrates with Google Calendar, and reduces no-shows by 40%.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free trial available",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "1000",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "24/7 AI-powered call handling",
        "WhatsApp appointment booking",
        "Google Calendar integration",
        "Automated reminder notifications",
        "Multi-doctor dashboard",
        "HIPAA compliant",
        "50+ language support",
        "Real-time slot optimization",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does AI appointment scheduling work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our AI receptionist answers calls and WhatsApp messages 24/7, understands patient requests using natural language processing, checks real-time availability, books appointments, and sends automatic confirmations—all without human intervention.",
          },
        },
        {
          "@type": "Question",
          name: "Can the AI integrate with my existing calendar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! DigitalBot seamlessly integrates with Google Calendar and other calendar systems. All appointments are synced in real-time, preventing double bookings and keeping doctors informed.",
          },
        },
        {
          "@type": "Question",
          name: "How much can I reduce no-shows?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Our clients typically see a 40% reduction in no-shows thanks to automated WhatsApp reminders sent before appointments, with confirmation tracking.",
          },
        },
        {
          "@type": "Question",
          name: "Is the system HIPAA compliant?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, DigitalBot is fully HIPAA compliant with enterprise-grade security, end-to-end encryption, and secure data handling practices suitable for healthcare applications.",
          },
        },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://digitalbot.ai",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Services",
          item: "https://digitalbot.ai/services",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "AI Appointment Scheduling",
          item: "https://digitalbot.ai/services/appointments",
        },
      ],
    },
  ],
};

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
