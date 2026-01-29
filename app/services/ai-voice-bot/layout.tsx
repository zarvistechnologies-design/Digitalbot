import { Metadata } from 'next'

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

export default function AIVoiceBotLayout({
  children,
}: {
  children: React.ReactNode
}) {
<<<<<<< HEAD
  return <>{children}</>
=======
  return children
>>>>>>> bac5f2a6123da4d7fd066b4d35bfc365e5e7f94f
}
