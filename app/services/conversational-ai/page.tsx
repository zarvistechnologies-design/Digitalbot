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
    borderColor: "border-sky-400",
    iconBg: "from-sky-500 to-sky-600",
    glow: "from-sky-400 via-sky-500 to-sky-600"
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Lightning-fast conversational AI responds in under 750ms, maintaining natural conversation flow without awkward delays or interruptions.",
    borderColor: "border-sky-400",
    iconBg: "from-sky-400 to-sky-500",
    glow: "from-sky-400 via-sky-500 to-sky-600"
  },
  {
    icon: MessageCircle,
    title: "Multi-Turn Conversations",
    description: "Conversational AI maintains context across multiple exchanges, remembering previous interactions to provide coherent, relevant responses.",
    borderColor: "border-sky-400",
    iconBg: "from-sky-400 to-sky-500",
    glow: "from-sky-400 via-sky-500 to-sky-400"
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Conversational AI platform supporting 30+ languages with native-level pronunciation, cultural awareness, and automatic language detection.",
    borderColor: "border-sky-400",
    iconBg: "from-sky-500 to-sky-600",
    glow: "from-sky-500 via-sky-500 to-sky-600"
  },
  {
    icon: Sparkles,
    title: "Emotion Recognition",
    description: "Advanced conversational AI detects customer emotions through voice tone and word choice, adapting responses for empathetic interactions.",
    borderColor: "border-sky-400",
    iconBg: "from-sky-500 to-sky-500",
    glow: "from-sky-400 via-sky-400 to-sky-600"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and GDPR-ready conversational AI infrastructure protecting every customer interaction.",
    borderColor: "border-sky-400",
    iconBg: "from-sky-500 to-sky-600",
    glow: "from-sky-500 via-sky-500 to-sky-600"
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sky-400 text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" className="min-h-screen bg-white" role="main" suppressHydrationWarning>

        {/* Stats Section - Above the Fold */}
        <section className="py-6 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="performance-stats">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left md:text-center">
              <div className="bg-sky-400/5 backdrop-blur-md border border-sky-400/20 p-3 shadow-lg shadow-sky-500/25 transition-transform duration-300 hover:scale-[1.02] hover:shadow-sky-500/40 relative overflow-hidden group" style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-sky-500 rounded-full opacity-15 filter blur-xl group-hover:opacity-25 transition-opacity"></div>
                <div className="text-lg sm:text-xl font-bold text-sky-500 relative z-10" style={{
                  textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
                }}>95%+</div>
                <div className="mt-1 text-sky-900 font-semibold text-xs relative z-10 uppercase tracking-wider">Accuracy Rate</div>
                <p className="mt-1 text-xs text-sky-500 relative z-10">Context-aware responses</p>
              </div>

              <div className="bg-sky-400/5 backdrop-blur-md border border-sky-400/20 p-3 shadow-lg shadow-sky-400/25 transition-transform duration-300 hover:scale-[1.02] hover:shadow-sky-400/40 relative overflow-hidden group" style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-sky-500 rounded-full opacity-15 filter blur-xl group-hover:opacity-25 transition-opacity"></div>
                <div className="text-lg sm:text-xl font-bold text-sky-500 relative z-10" style={{
                  textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
                }}>30+</div>
                <div className="mt-1 text-sky-900 font-semibold text-xs relative z-10 uppercase tracking-wider">Languages</div>
                <p className="mt-1 text-xs text-sky-500 relative z-10">Multilingual support</p>
              </div>

              <div className="bg-sky-400/5 backdrop-blur-md border border-sky-400/20 p-3 shadow-lg shadow-sky-500/25 transition-transform duration-300 hover:scale-[1.02] hover:shadow-sky-500/40 relative overflow-hidden group" style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}>
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-sky-500 rounded-full opacity-15 filter blur-xl group-hover:opacity-25 transition-opacity"></div>
                <div className="text-lg sm:text-xl font-bold text-sky-500 relative z-10" style={{
                  textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
                }}>24/7</div>
                <div className="mt-1 text-sky-900 font-semibold text-xs relative z-10 uppercase tracking-wider">Always Active</div>
                <p className="mt-1 text-xs text-sky-500 relative z-10">Never stops learning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section - sky Light Theme */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="main-heading">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-6 items-start">

              {/* Left Content */}
              <div className="space-y-4">
                <h1 id="main-heading" className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight text-left">
                  <span className="block mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 drop-shadow-sm tracking-widest">Conversational AI Platform</span>
                  <span className="inline-block px-4 py-2 rounded-xl text-black bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 shadow-lg shadow-sky-400/40 text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-sky-400">
                    <span className="absolute inset-0 bg-gradient-to-tr from-sky-400/25 via-transparent to-transparent"></span>
                    <span className="relative z-10">Human-Like Conversations</span>
                  </span>
                </h1>

                <div className="p-3 bg-sky-400/5 backdrop-blur-md border border-sky-400/30 shadow-md shadow-sky-400/20" style={{
                  clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                }}>
                  <p className="text-xs sm:text-sm font-bold text-sky-400 mb-2">
                    "Traditional chatbots follow scripts. Our AI understands context."
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-black inline-block bg-sky-400 px-3 py-1 shadow-sm shadow-sky-500/30 border border-sky-400 uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}>
                    <span className="relative z-10">WE CREATE EXPERIENCES.</span>
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-gray-900 leading-relaxed">
                  Transform customer interactions with <span className="font-bold text-sky-400">conversational AI</span> that understands context, emotion, and intent.
                  Deliver natural, intelligent conversations across voice, chat, and messaging channels 24/7 with comprehensive <span className="font-semibold text-sky-400">analytics dashboard</span>.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-400" style={{
                      boxShadow: '0 0 6px rgba(249, 115, 22, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Context-Aware AI</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-400" style={{
                      boxShadow: '0 0 6px rgba(249, 115, 22, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Emotion Detection</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-400" style={{
                      boxShadow: '0 0 6px rgba(249, 115, 22, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">Multi-Turn Dialog</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-sky-400" style={{
                      boxShadow: '0 0 6px rgba(249, 115, 22, 0.4)'
                    }}></span>
                    <span className="font-medium text-gray-900 uppercase tracking-wide text-xs">30+ Languages</span>
                  </div>
                </div>

                {/* sky Light CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-black bg-sky-400 shadow-md hover:shadow-sky-500/30 transition-all duration-300 hover:scale-105 border border-sky-400 uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    Start Building
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold text-sky-400 bg-transparent border border-sky-400 hover:bg-sky-400/10 transition-all duration-300 hover:scale-105 shadow-sm uppercase tracking-wide"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}
                  >
                    <Mic className="mr-2 w-3 h-3" />
                    See Demo
                  </Link>
                </div>
              </div>

              {/* Right HD Image */}
              <div className="relative">
                <div className="relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden shadow-lg shadow-sky-400/20 border border-sky-400/30">
                  <Image
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop"
                    alt="Conversational AI Technology - Modern Business Communication Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-sky-900/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/90 backdrop-blur-md rounded-xl p-4 border border-sky-400/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg border border-sky-400/30">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">Live AI Conversation</div>
                          <div className="text-xs text-sky-400">Context-aware dialog</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-sky-400 font-medium">✓ 95%+ Accuracy</span>
                        <span className="text-sky-400 font-medium tracking-wide">30+ Languages</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section - sky Light Theme */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="features-section">
          {/* Floating circles */}
          <div className="absolute top-0 left-1/4 w-24 h-24 bg-sky-500 rounded-full opacity-6 animate-pulse blur-xl"></div>
          <div className="absolute bottom-0 right-1/4 w-28 h-28 bg-sky-400 rounded-full opacity-6 animate-pulse blur-xl"></div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <h2 id="features-section" className="text-lg sm:text-xl lg:text-2xl font-bold text-left mb-6 text-sky-400 uppercase tracking-wide" style={{
              textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
            }}>
              Why Choose Our Conversational AI
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group bg-sky-400/5 backdrop-blur-md p-5 border border-sky-400/20 hover:border-sky-400/60 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-sky-500/25"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 border border-sky-400/30">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>

                  <h3 className="text-base font-bold mb-3 text-sky-400 group-hover:text-white transition-all duration-300 uppercase tracking-wide">
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

        {/* Use Cases Section - Compact Design */}
        <section className="py-8 px-3 sm:px-4 lg:px-6 bg-white relative overflow-hidden" role="region" aria-labelledby="use-cases">
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 id="use-cases" className="text-lg sm:text-xl lg:text-2xl font-bold text-left mb-6 text-sky-400 uppercase tracking-wide" style={{
              textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
            }}>
              Conversational AI Use Cases
            </h2>

            <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto">
              {useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="group bg-sky-400/5 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-sky-500/20"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 border border-sky-400/30">
                      <useCase.icon className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-bold mb-3 text-sky-400 group-hover:text-white transition-all duration-300 uppercase tracking-wide">
                        {useCase.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-900 text-sm leading-relaxed mb-4">
                    {useCase.description}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 bg-sky-400/10 text-sky-400 text-xs font-semibold border border-sky-400/30 uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}>
                    <CheckCircle className="h-3 w-3 mr-2" />
                    {useCase.metric}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section - sky Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white">
          {/* Background with gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-gradient-radial from-sky-400/20 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-gradient-radial from-sky-500/15 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gradient-radial from-sky-400/10 to-transparent rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-left mb-8">
              <div className="inline-flex items-center space-x-2 bg-sky-400 text-black px-3 py-1.5 text-xs backdrop-blur-sm border border-sky-400 shadow-lg mb-4 uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}>
                <Mic className="h-3 w-3 animate-pulse" />
                <span className="font-semibold">Live Conversational AI Demo</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-sky-400 mb-3 uppercase tracking-wide" style={{
                textShadow: '0 0 15px rgba(249, 115, 22, 0.4)'
              }}>
                Experience Natural AI Conversations
              </h2>
              <p className="text-sm text-gray-900 max-w-2xl">
                Listen to how our conversational AI handles real customer interactions with human-like intelligence
              </p>
            </div>

            <div className="bg-sky-400/5 backdrop-blur-md border border-sky-400/30 p-6 shadow-lg shadow-sky-500/20" style={{
              clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
            }}>
              <div className="space-y-3 mb-6">
                {sampleConversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 transition-all duration-300 ${
                      msg.speaker === "Customer"
                        ? "bg-sky-400/10 border border-sky-400/30"
                        : "bg-sky-500/10 border border-sky-500/30"
                    } ${
                      currentMessage >= idx + 1 ? "opacity-100" : "opacity-100"
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                    }}
                  >
                    <p className="text-xs font-semibold text-sky-400 mb-1 uppercase tracking-wide">{msg.speaker}</p>
                    <p className="text-gray-900 text-sm">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playConversation}
                  className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 hover:from-sky-600 hover:via-sky-700 hover:to-sky-800 text-black shadow-lg hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 font-bold text-sm uppercase tracking-wide border border-sky-400"
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
                        className="w-1 bg-gradient-to-t from-sky-500 via-sky-400 to-sky-300 rounded-full animate-pulse"
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

        {/* FAQ Section - sky Light Theme */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden" role="region" aria-labelledby="faq-section">
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-left mb-6">
              <div className="inline-block mb-3">
                <span className="px-3 py-1 bg-sky-400 text-black font-semibold text-xs uppercase tracking-wide shadow-md" style={{
                  clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                }}>
                  Common Questions
                </span>
              </div>
              <h2 id="faq-section" className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 text-sky-400 uppercase tracking-wide" style={{
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
                  className="group relative bg-sky-400/5 backdrop-blur-md border border-sky-400/20 hover:border-sky-400/60 p-5 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-sky-500/20"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                  }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 flex items-center justify-center text-black font-bold text-sm shadow-lg border border-sky-400/30" style={{
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                      }}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-2 text-sky-400 uppercase tracking-wide">
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

        {/* CTA Section - sky Light Theme */}
        <section className="py-8 px-4 relative overflow-hidden bg-white">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-sky-400 text-black px-4 py-2 mb-6 border border-sky-400 shadow-lg font-semibold text-xs uppercase tracking-wide" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <Bot className="w-3 h-3" />
                <span>Start Building Today</span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                <span className="text-sky-400 uppercase tracking-wide" style={{
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
                  className="bg-sky-400 hover:bg-sky-300 text-black px-8 py-3 text-sm font-bold shadow-lg hover:shadow-sky-500/40 transition-all duration-300 hover:scale-105 border border-sky-400 uppercase tracking-wide"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4 inline" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-sky-400 text-sky-400 hover:bg-sky-400/10 px-8 py-3 text-sm font-bold uppercase tracking-wide transition-all duration-300"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <MessageCircle className="mr-2 w-4 h-4 inline" />
                  Talk to Expert
                </Link>
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-400/10 border border-sky-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-sky-400" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-400/10 border border-sky-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-sky-400" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-sky-400/10 border border-sky-400/30 text-xs font-medium text-gray uppercase tracking-wide" style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
                  <CheckCircle className="w-3 h-3 text-sky-400" />
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
