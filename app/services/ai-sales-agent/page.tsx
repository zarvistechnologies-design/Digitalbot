import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { VoiceConversationPlayer } from "@/components/voice-conversation-player"
import { ArrowRight, CheckCircle, Mic, Phone, Target } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

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
};

export default function AISalesAgent() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Light Theme */}
        <section className="relative overflow-hidden bg-white py-8 px-3 sm:px-4 lg:px-6">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(234, 88, 12, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(234, 88, 12, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          {/* Floating sky Elements */}
          <div className="absolute top-5 right-10 w-24 h-24 bg-gradient-to-bl from-sky-400/15 to-sky-600/8 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-10 left-5 w-28 h-28 bg-gradient-to-tr from-sky-500/8 to-sky-400/12 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-20 h-20 bg-gradient-to-r from-sky-300/6 via-sky-400/10 to-sky-500/6 rounded-full blur-lg" />

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-6 items-start">

              {/* Left Content */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 mb-4 border border-sky-500 uppercase tracking-widest" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold">AI Sales Agent Platform</span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent mb-3 leading-tight text-left">
                  <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 drop-shadow-sm tracking-widest uppercase">AI Sales Agent</span>
                  <span className="inline-block px-4 py-2 rounded-xl text-white bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 shadow-lg shadow-sky-400/40 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-sky-500">
                    <span className="absolute inset-0 bg-gradient-to-tr from-sky-400/25 via-transparent to-transparent"></span>
                    <span className="relative z-10 uppercase tracking-wider">Never Stops Selling</span>
                  </span>
                </h1>

                <div className="p-3 bg-sky-400/5 backdrop-blur-md border border-sky-400/30 shadow-md shadow-sky-400/20" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <p className="text-xs sm:text-sm font-bold text-sky-600 mb-2">
                    "Sales reps sleep, take breaks, get tired, need training."
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-white inline-block bg-sky-500 px-3 py-1 shadow-sm shadow-sky-600/30 border border-sky-500 uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}>
                    <span className="relative z-10">WE NEVER DO.</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Transform sales with <span className="font-bold text-sky-600">AI sales agents</span> that qualify leads, handle objections, and close deals 24/7.
                  Trusted by <span className="font-semibold text-sky-600">500+ businesses</span> with <span className="font-semibold text-sky-600">45% higher conversion</span> rates.
                  Our <span className="font-bold text-sky-600">AI sales platform</span> automates conversations and scales revenue without scaling headcount.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Lead Qualification</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Deal Closing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">24/7 Outreach</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">CRM Integration</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-white bg-sky-500 shadow-md hover:shadow-sky-600/30 transition-all duration-300 hover:scale-105 border border-sky-500 uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    Start Free Trial
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-sky-600 bg-transparent border border-sky-400 hover:bg-sky-400/10 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Book Demo
                  </Link>
                </div>
              </div>

              {/* Right HD Image */}
              <div className="relative">
                <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-400/20 border border-sky-400/30">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&contrast=120&brightness=110"
                    alt="AI Sales Agent Technology - Automated Sales Conversations Dashboard"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-sky-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white backdrop-blur-md rounded-xl p-4 border border-sky-400/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                          <Target className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">Live Sales AI</div>
                          <div className="text-xs text-sky-600">Closing deals 24/7</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-600 font-medium">✓ 45% Higher Conversion</span>
                        <span className="text-sky-600 font-medium tracking-wide">Always Selling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Demo Section - Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
          <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-sky-400/15 to-sky-500/15 rounded-full blur-lg animate-pulse" />
          <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-sky-500/12 to-sky-600/12 rounded-full blur-lg animate-pulse delay-1000" />

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 mb-4 border border-sky-500 uppercase tracking-widest" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="w-3 h-3 animate-pulse" />
                <span className="text-xs font-bold">Live AI Sales Demo</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent mb-3 uppercase tracking-wide">
                Hear AI Sales Agent in Action
              </h2>
              <p className="text-gray-700 text-sm max-w-2xl leading-relaxed">
                Listen to how our AI handles real sales conversations and closes deals naturally
              </p>
            </div>
            <div className="bg-white backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-sky-400/30">
              <VoiceConversationPlayer audioSrc="/sample-sales-conversation.mp3" />
            </div>
          </div>
        </section>

        {/* FAQ Section - Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-sky-400/20 to-sky-500/20 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-br from-sky-500/15 to-sky-600/15 rounded-full filter blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-32 right-32 w-20 h-20 bg-gradient-to-br from-sky-300/25 to-sky-400/25 rounded-full filter blur-lg animate-pulse delay-500"></div>
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-8">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs uppercase tracking-wide shadow-md animate-pulse" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Target className="w-3 h-3 inline mr-1" />
                  Common Questions
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-sky-600 uppercase tracking-wide">
                AI Sales Agent FAQ
              </h2>
              <p className="text-gray-700 text-sm max-w-3xl leading-relaxed">
                Everything you need to know about <span className="text-sky-600 font-semibold">AI Sales Agents</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {/* FAQ 1 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      What is an AI sales agent and how does it work?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      An AI sales agent is an intelligent voice assistant that handles sales conversations, qualifies leads, answers questions, handles objections, and closes deals automatically using natural language processing and machine learning.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 2 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      Can AI sales agents replace human sales reps?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      AI sales agents complement your sales team by handling initial outreach, lead qualification, and follow-ups. This frees your human reps to focus on high-value conversations and relationship building.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 3 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      How do AI sales agents qualify leads?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      AI sales agents ask intelligent qualifying questions, score leads based on your criteria, and automatically route hot leads to your sales team while nurturing cold leads with follow-up campaigns.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 4 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      What is the ROI of using AI sales agents?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Businesses typically see 45% higher conversion rates, 70% reduction in lead response time, and 3x more qualified leads. ROI is delivered within the first 30-60 days.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 5 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      Can AI sales agents handle objections?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Yes! Our AI is trained on thousands of sales conversations and can handle common objections about price, timing, competition, and features using proven sales techniques.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ 6 */}
              <div className="group relative bg-sky-50 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-md hover:shadow-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-300 border border-sky-400/30">
                      6
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold mb-2 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 text-transparent bg-clip-text tracking-wide">
                      How quickly can I deploy AI sales agents?
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      Most businesses are up and running within 5-7 days. We help configure sales scripts, integrate with CRM, and train the AI on your products/services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-sky-400/15 to-sky-500/15 rounded-full blur-lg animate-pulse" />
            <div className="absolute bottom-10 right-20 w-24 h-24 bg-gradient-to-br from-sky-500/12 to-sky-600/12 rounded-full blur-lg animate-pulse delay-1000" />
            <div className="absolute top-16 right-32 w-16 h-16 bg-gradient-to-br from-sky-300/20 to-sky-400/20 rounded-full blur-lg animate-pulse delay-500" />
          </div>

          <div className="container mx-auto max-w-4xl text-left relative z-10">
            <div className="inline-flex items-center gap-2 bg-sky-500 text-white px-3 py-1 mb-4 border border-sky-500 uppercase tracking-widest" style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
            }}>
              <Target className="w-3 h-3" />
              <span className="text-xs font-bold">10X Your Sales Today</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent uppercase tracking-wide">
              Ready to 10X Your Sales with AI?
            </h2>

            <p className="text-gray-700 text-sm mb-6 max-w-2xl leading-relaxed">
              Join 500+ businesses using AI sales agents to qualify more leads, close more deals, and scale revenue without scaling headcount.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/signup">
                <Button className="group relative bg-sky-500 hover:bg-sky-400 text-white px-6 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-400/30 border border-sky-500 uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link href="/contact">
                <Button variant="outline" className="group bg-white hover:bg-sky-50 text-sky-600 hover:text-sky-700 border border-sky-400/30 hover:border-sky-400 px-6 py-2 text-sm font-bold transition-all duration-300 backdrop-blur-md uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-gray-700">
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="w-3 h-3 text-sky-600" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="w-3 h-3 text-sky-600" />
                <span>Setup in 7 Days</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-sky-100 border border-sky-400/20 backdrop-blur-sm" style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
              }}>
                <CheckCircle className="w-3 h-3 text-sky-600" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








