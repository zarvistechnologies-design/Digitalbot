"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, BarChart3, Bot, Brain, CheckCircle, Clock, Globe, MessageCircle, Mic, Pause, Play, Shield, Sparkles, TrendingUp, Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const features = [
  {
    icon: Brain,
    title: "Natural Language Understanding",
    description: "Advanced NLU engine that comprehends context, intent, and sentiment across multiple languages, delivering human-like conversational AI experiences.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-500 to-blue-600",
    glow: "from-blue-400 via-blue-500 to-blue-600"
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Lightning-fast conversational AI responds in under 750ms, maintaining natural conversation flow without awkward delays or interruptions.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-400 to-blue-500",
    glow: "from-blue-400 via-blue-500 to-blue-600"
  },
  {
    icon: MessageCircle,
    title: "Multi-Turn Conversations",
    description: "Conversational AI maintains context across multiple exchanges, remembering previous interactions to provide coherent, relevant responses.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-400 to-blue-500",
    glow: "from-blue-400 via-blue-500 to-blue-400"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Conversational AI platform supporting 30+ languages with native-level pronunciation, cultural awareness, and automatic language detection.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-500 to-blue-600",
    glow: "from-blue-500 via-blue-500 to-blue-600"
  },
  {
    icon: Sparkles,
    title: "Emotion Recognition",
    description: "Advanced conversational AI detects customer emotions through voice tone and word choice, adapting responses for empathetic interactions.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-500 to-blue-500",
    glow: "from-blue-400 via-blue-400 to-blue-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and GDPR-ready conversational AI infrastructure protecting every customer interaction.",
    borderColor: "border-blue-400",
    iconBg: "from-blue-500 to-blue-600",
    glow: "from-blue-500 via-blue-500 to-blue-600"
  },
]

const useCases = [
  {
    icon: Users,
    title: "Customer Service Automation",
    description: "Deploy conversational AI to handle customer inquiries, resolve issues, and provide 24/7 support across all channels simultaneously.",
    metric: "80% ticket reduction"
  },
  {
    icon: TrendingUp,
    title: "Sales Qualification",
    description: "Use conversational AI to engage leads, qualify prospects, schedule demos, and nurture opportunities through intelligent conversations.",
    metric: "3x more qualified leads"
  },
  {
    icon: Clock,
    title: "Appointment Scheduling",
    description: "Conversational AI seamlessly manages calendars, books appointments, sends reminders, and handles rescheduling requests automatically.",
    metric: "95% booking accuracy"
  },
  {
    icon: BarChart3,
    title: "Market Research",
    description: "Gather customer feedback, conduct surveys, and analyze sentiment using conversational AI that adapts questions based on responses.",
    metric: "10x survey completion"
  },
]

const sampleConversation = [
  { speaker: "Customer", text: "Hi, I need help with my order." },
  { speaker: "AI Agent", text: "I'd be happy to help! Could you provide your order number?" },
  { speaker: "Customer", text: "It's ORDER-12345." },
  { speaker: "AI Agent", text: "Thank you! Your order is on its way and will arrive tomorrow by 3 PM." },
]

export default function ConversationalAI() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const playConversation = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setCurrentMessage(0)
      return
    }

    setIsPlaying(true)
    let messageIndex = 0
    const interval = setInterval(() => {
      if (messageIndex < sampleConversation.length) {
        setCurrentMessage(messageIndex + 1)
        messageIndex++
      } else {
        clearInterval(interval)
        setIsPlaying(false)
        setCurrentMessage(0)
      }
    }, 2000)
  }


  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-400 text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="min-h-screen bg-white pt-20" role="main" suppressHydrationWarning>

        {/* Hero Section - Image Left, Content Right */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="main-heading">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-center flex-row-reverse">
              {/* Left: Image */}
              <div className="relative order-1 lg:order-none">
                <div className="relative h-56 sm:h-64 lg:h-80 rounded-2xl overflow-hidden shadow-xl shadow-blue-400/20 border border-blue-400/30">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                    alt="Conversational AI Technology - Modern Business Communication Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              {/* Right: Content */}
              <div className="space-y-4">
                <h1 id="main-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight text-left">
                  Transform Customer Engagement with Conversational AI
                </h1>
                <div className="p-4 bg-blue-400/10 backdrop-blur-md border border-blue-400/30 shadow-md shadow-blue-400/20 rounded-xl">
                  <span className="text-blue-500 font-semibold text-sm">AI that understands, adapts, and delivers.</span>
                </div>
                <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
                  Deliver natural, intelligent conversations across voice, chat, and messaging channels 24/7. Our platform understands context, emotion, and intent for every customer.
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="bg-blue-400/10 border border-blue-400/30 px-3 py-1 rounded-full font-semibold text-blue-500">30+ Languages</div>
                  <div className="bg-blue-400/10 border border-blue-400/30 px-3 py-1 rounded-full font-semibold text-blue-500">95%+ Accuracy</div>
                  <div className="bg-blue-400/10 border border-blue-400/30 px-3 py-1 rounded-full font-semibold text-blue-500">24/7 Availability</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Link href="/signup" className="bg-blue-400 hover:bg-blue-300 text-black px-8 py-3 text-sm font-bold shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border border-blue-400 uppercase tracking-wide rounded-lg">
                    Get Started Free <ArrowRight className="ml-2 w-4 h-4 inline" />
                  </Link>
                  <Link href="/contact" className="bg-white border border-blue-400 text-blue-500 px-8 py-3 text-sm font-bold shadow hover:shadow-blue-400/20 transition-all duration-300 hover:scale-105 uppercase tracking-wide rounded-lg">
                    Request Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Now vertical on mobile, horizontal on desktop */}
        <section className="py-6 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="performance-stats">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex-1 bg-blue-400/5 backdrop-blur-md border border-blue-400/20 p-4 shadow-lg shadow-blue-500/25 rounded-xl flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-500">95%+</div>
                <div className="mt-1 text-blue-900 font-semibold text-xs uppercase tracking-wider">Accuracy Rate</div>
                <p className="mt-1 text-xs text-blue-500">Context-aware responses</p>
              </div>
              <div className="flex-1 bg-blue-400/5 backdrop-blur-md border border-blue-400/20 p-4 shadow-lg shadow-blue-400/25 rounded-xl flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-500">30+</div>
                <div className="mt-1 text-blue-900 font-semibold text-xs uppercase tracking-wider">Languages</div>
                <p className="mt-1 text-xs text-blue-500">Multilingual support</p>
              </div>
              <div className="flex-1 bg-blue-400/5 backdrop-blur-md border border-blue-400/20 p-4 shadow-lg shadow-blue-500/25 rounded-xl flex flex-col items-center">
                <div className="text-2xl font-bold text-blue-500">24/7</div>
                <div className="mt-1 text-blue-900 font-semibold text-xs uppercase tracking-wider">Always Active</div>
                <p className="mt-1 text-xs text-blue-500">Never stops learning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - horizontal scroll on mobile, grid on desktop */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="features-section">
          <div className="absolute top-0 left-1/4 w-24 h-24 bg-blue-500 rounded-full opacity-6 animate-pulse blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-28 h-28 bg-blue-400 rounded-full opacity-6 animate-pulse blur-xl"></div>
          <div className="container mx-auto max-w-7xl relative z-10">
            <h2 id="features-section" className="text-lg sm:text-xl lg:text-2xl font-bold text-left mb-6 text-blue-400 uppercase tracking-wide" style={{
              textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
            }}>
              Why Choose Our Conversational AI
            </h2>
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible pb-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="min-w-[260px] group bg-blue-400/5 backdrop-blur-md p-5 border border-blue-400/20 hover:border-blue-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/25 rounded-xl"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 border border-blue-400/30">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-base font-bold mb-3 text-blue-400 group-hover:text-white transition-all duration-300 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-900 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section - Vertical Timeline Style */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="use-cases">
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 id="use-cases" className="text-lg sm:text-xl lg:text-2xl font-bold text-left mb-6 text-blue-400 uppercase tracking-wide" style={{
              textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
            }}>
              Conversational AI Use Cases
            </h2>
            <div className="relative border-l-4 border-blue-400 pl-6 space-y-8">
              {useCases.map((useCase, index) => (
                <div key={index} className="relative group">
                  <span className="absolute -left-7 top-2 w-5 h-5 rounded-full bg-blue-400 border-4 border-white shadow"></span>
                  <div className="bg-blue-400/5 backdrop-blur-md border border-blue-400/20 hover:border-blue-400/60 p-5 rounded-xl transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <useCase.icon className="w-5 h-5 text-blue-500" />
                      <span className="font-bold text-blue-900 text-base">{useCase.title}</span>
                      <span className="ml-auto bg-blue-400 text-black px-2 py-0.5 rounded-full text-xs font-semibold">{useCase.metric}</span>
                    </div>
                    <p className="text-sm text-gray-900">{useCase.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section - blue Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
          {/* Background with gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-radial from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-gradient-radial from-blue-500/15 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-400 text-black px-3 py-1.5 text-xs backdrop-blur-sm border border-blue-400 shadow-lg mb-4 uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="h-3 w-3 animate-pulse" />
                <span className="font-semibold">Live Conversational AI Demo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-3 uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
              }}>
                Experience Natural AI Conversations
              </h2>
              <p className="text-sm text-gray-900 max-w-2xl">
                Listen to how our conversational AI handles real customer interactions with human-like intelligence
              </p>
            </div>

            <div className="bg-blue-400/5 backdrop-blur-md border border-blue-400/30 p-6 shadow-lg shadow-blue-500/20" style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
            }}>
              <div className="space-y-3 mb-6">
                {sampleConversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 transition-all duration-300 ${
                      msg.speaker === "Customer"
                        ? "bg-blue-400/10 border border-blue-400/30"
                        : "bg-blue-500/10 border border-blue-500/30"
                    } ${
                      currentMessage >= idx + 1 ? "opacity-100" : "opacity-100"
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                    }}
                  >
                    <p className="text-xs font-semibold text-blue-400 mb-1 uppercase tracking-wide">{msg.speaker}</p>
                    <p className="text-gray-900 text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playConversation}
                  className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-black shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 font-bold text-sm uppercase tracking-wide border border-blue-400"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  <span>
                    {isPlaying ? "Pause" : "Play"} Conversation
                  </span>
                </button>
              </div>

              {/* Visual Waveform */}
              {isPlaying && mounted && (
                <div className="mt-6 flex items-center justify-center gap-1 h-12">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const heights = [20, 35, 28, 45, 25, 40, 32, 50, 22, 38, 30, 48, 26, 42, 34, 52, 24, 36, 28, 44];
                    return (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 rounded-full animate-pulse"
                        style={{
                          height: `${heights[i]}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section - blue Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden" role="region" aria-labelledby="faq-section">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-blue-400 text-black font-semibold text-xs uppercase tracking-wide shadow-md" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  Common Questions
                </span>
              </div>
              <h2 id="faq-section" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 text-blue-400 uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
              }}>
                Conversational AI FAQ
              </h2>
              <p className="text-gray-900 text-sm max-w-2xl leading-relaxed">
                Everything you need to know about implementing conversational AI
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid gap-4">
              {[
                {
                  q: "What is conversational AI?",
                  a: "Conversational AI is advanced technology that enables machines to understand, process, and respond to human language in natural, contextual ways. It combines natural language processing, machine learning, and speech recognition to create human-like interactions across voice and text channels."
                },
                {
                  q: "How does conversational AI differ from chatbots?",
                  a: "Traditional chatbots follow pre-programmed rules and scripts, while conversational AI uses machine learning to understand context, intent, and emotion. Our conversational AI learns from interactions, maintains conversation context, and adapts responses based on user sentiment and previous exchanges."
                },
                {
                  q: "Can conversational AI handle multiple languages?",
                  a: "Yes, our conversational AI platform supports 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. The system automatically detects the speaker's language and responds with native-level pronunciation and cultural awareness."
                },
                {
                  q: "What accuracy rate can I expect from conversational AI?",
                  a: "Our conversational AI achieves 95%+ accuracy in intent recognition and speech-to-text conversion. The system continuously learns from interactions, improving performance over time. For complex queries, it seamlessly escalates to human agents with full conversation context."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="group relative bg-blue-400/5 backdrop-blur-md border border-blue-400/20 hover:border-blue-400/60 p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/20"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center text-black font-bold text-sm shadow-lg border border-blue-400/30" style={{
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                      }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-2 text-blue-400 uppercase tracking-wide">
                        {faq.q}
                      </h3>
                      <p className="text-gray-900 text-xs leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - blue Light Theme */}
        <section className="py-8 px-4 relative overflow-hidden bg-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-blue-400 text-black px-4 py-2 mb-6 border border-blue-400 shadow-lg font-semibold text-xs uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <Bot className="w-3 h-3" />
                <span>Start Building Today</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                <span className="text-blue-400 uppercase tracking-wide" style={{
                  textShadow: '0 0 20px rgba(249, 115, 22, 0.5)'
                }}>
                  Ready to Transform Your Conversations?
                </span>
              </h2>

              <p className="text-sm text-gray-900 mb-6 max-w-3xl mx-auto">
                Join thousands of businesses using conversational AI to deliver exceptional customer experiences while reducing costs by up to 80%.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <Link
                  href="/signup"
                  className="bg-blue-400 hover:bg-blue-300 text-black px-8 py-3 text-sm font-bold shadow-lg hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 border border-blue-400 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-blue-400 text-blue-400 hover:bg-blue-400/10 px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <MessageCircle className="mr-2 w-4 h-4 inline" />
                  Talk to Expert
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-400/10 border border-blue-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-400/10 border border-blue-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-400/10 border border-blue-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                  <span>Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
