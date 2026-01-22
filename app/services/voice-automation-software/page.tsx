"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Bot, CheckCircle, Clock, Headphones, Mic, Pause, Phone, Play, Shield, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const features = [
  {
    icon: Bot,
    title: "Intelligent Voice Automation",
    description: "Advanced AI-powered voice automation software that understands natural language and provides human-like responses for seamless customer interactions.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-500 to-sky-400",
    glow: "from-sky-400 via-sky-500 to-sky-300",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop"
  },
  {
    icon: Zap,
    title: "Instant Response Times",
    description: "Lightning-fast voice automation software delivers responses in under 750ms, ensuring smooth conversations without awkward pauses or delays.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-400 to-sky-500",
    glow: "from-sky-400 via-sky-500 to-sky-300",
    image: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8a83f?w=400&h=300&fit=crop"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Voice automation software that never sleeps, handling unlimited customer calls simultaneously around the clock without human intervention.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-400 to-sky-500",
    glow: "from-sky-400 via-sky-500 to-sky-400",
    image: "https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=400&h=300&fit=crop"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR standards ensuring your voice automation software protects sensitive customer data.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-500 to-sky-400",
    glow: "from-sky-500 via-sky-400 to-sky-300",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop"
  },
  {
    icon: Users,
    title: "Unlimited Scalability",
    description: "Voice automation software that scales effortlessly from 10 to 10,000 concurrent conversations, growing with your business needs.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-500 to-sky-400",
    glow: "from-sky-400 via-sky-300 to-sky-500",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Comprehensive dashboards provide actionable insights on every conversation, helping optimize your voice automation software performance.",
    borderColor: "border-sky-300/30",
    iconBg: "from-sky-500 to-sky-400",
    glow: "from-sky-500 via-sky-400 to-sky-300",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop"
  },
]

const benefits = [
  {
    icon: Clock,
    stat: "24/7",
    title: "Always Available",
    description: "Never miss a customer call"
  },
  {
    icon: Users,
    stat: "∞",
    title: "Unlimited Calls",
    description: "Handle thousands simultaneously"
  },
  {
    icon: TrendingUp,
    stat: "400%",
    title: "Productivity Boost",
    description: "Automate routine tasks"
  },
  {
    icon: Zap,
    stat: "<1s",
    title: "Instant Response",
    description: "Lightning-fast interactions"
  },
]

const sampleConversation = [
  { speaker: "Customer", text: "Hi, I need help with my order." },
  { speaker: "AI Agent", text: "I'd be happy to help! Could you provide your order number?" },
  { speaker: "Customer", text: "It's ORDER-12345." },
  { speaker: "AI Agent", text: "Thank you! Your order is on its way and will arrive tomorrow by 3 PM." },
]

export default function VoiceAutomation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)

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
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Modern Light */}
        <section className="relative overflow-hidden bg-white py-16 md:py-20">
          <div
            className="absolute inset-0 bg-white bg-cover bg-center"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`
            }}
          >
            <div className="absolute inset-0 bg-white/40"></div>
          </div>

          {/* Light Grid Background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(249, 115, 22, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`
            }}
          ></div>

          <div className="w-full px-3 sm:px-4 relative z-10">
            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 bg-sky-50 border border-sky-300 text-sky-600 px-4 py-2 mb-6"
                style={{ clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)' }}
              >
                <Mic className="w-3 h-3" />
                <span className="text-xs font-bold tracking-wide">Enterprise Voice Automation Software</span>
              </div>

              <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                  Automate Every Voice
                </span>
                <br />
                <span
                  className="relative inline-block mt-2 px-4 py-2 bg-sky-50 border border-sky-300 text-gray-900 text-sm"
                  style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-sky-300/20 via-transparent to-sky-300/20"></span>
                  <span className="relative z-10">Interaction with AI</span>
                </span>
              </h1>

              <p className="text-sm md:text-base mb-8 text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Transform your business with intelligent <strong className="text-sky-600">voice automation software</strong> that handles calls,
                schedules appointments, qualifies leads, and provides instant support 24/7 without human intervention.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <Button asChild size="sm" className="bg-sky-500 text-white hover:bg-sky-600 px-6 transition-all duration-300 hover:scale-105">
                  <Link href="/signup">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline" className="border border-sky-400 text-sky-600 hover:bg-sky-50 hover:text-sky-700 px-6">
                  <Link href="/contact">
                    <Phone className="mr-2 w-3 h-3" />
                    Request Demo
                  </Link>
                </Button>
              </div>

              <div
                className="inline-flex flex-col gap-3 bg-sky-50 border border-sky-200 p-4"
                style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
              >
                <div className="flex flex-wrap gap-4 justify-center items-center text-xs font-medium">
                  <div className="flex items-center gap-2 text-sky-600">
                    <CheckCircle className="w-3 h-3 text-sky-600" />
                    <span>99.9% Uptime SLA</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>SOC 2 Type II Certified</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Shield className="w-3 h-3 text-sky-600" />
                    <span>GDPR & HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-600">
                    <Zap className="w-3 h-3 text-sky-600" />
                    <span>&lt;750ms Response Time</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid - Modern Light */}
        <section className="py-12 bg-gray-50">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=250&fit=crop')`
            }}
          >
            <div className="absolute inset-0 bg-gray-50/60"></div>
          </div>

          <div className="container mx-auto px-3 sm:px-4 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-lg md:text-xl font-bold mb-4 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                Why Choose Our Voice Automation Software
              </h2>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                The most advanced voice automation software platform built for modern businesses
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full\">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-sky-200 overflow-hidden shadow-sm hover:shadow-md hover:border-sky-400 hover:scale-105 transition-all duration-300"
                  style={{ clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)' }}
                >
                  {/* Image Section */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <div
                      className="w-10 h-10 bg-sky-50 border border-sky-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                      style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                    >
                      <feature.icon className="w-4 h-4 text-sky-600" />
                    </div>

                    <h3 className="text-sm font-bold mb-2 text-sky-600 group-hover:text-sky-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Features Section - Left Image */}
        <section className="py-12 bg-white">
          <div className="w-full px-3 sm:px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full\">
              {/* Image Left */}
              <div className="hidden md:block relative h-96 overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop"
                  alt="Voice Automation Interface"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content Right */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                  Intelligent Conversation Flow
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Our advanced AI understands context, handles complex conversations, and makes intelligent decisions based on customer intent and company policies.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Natural language understanding across 30+ languages</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Context-aware responses that feel human-like</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Seamless handoff to human agents when needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Continuous learning from every interaction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Visual Features Section - Right Image */}
        <section className="py-12 bg-gray-50">
          <div className="w-full px-3 sm:px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full">
              {/* Content Left */}
              <div>
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                  Real-Time Performance Analytics
                </h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Get comprehensive insights into every conversation with detailed analytics, performance metrics, and actionable recommendations to optimize your operations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Live dashboards with call metrics and KPIs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Detailed conversation transcripts and recordings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">AI sentiment analysis and quality scoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Custom reports and export capabilities</span>
                  </li>
                </ul>
              </div>

              {/* Image Right */}
              <div className="hidden md:block relative h-96 overflow-hidden rounded-lg shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop"
                  alt="Real-Time Analytics Dashboard"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Audio Conversation Demo - Modern Light */}
        <section className="py-12 px-3 sm:px-4 relative overflow-hidden bg-white">
          {/* Light Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-3"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop')`
            }}
          >
            <div className="absolute inset-0 bg-white/30"></div>
          </div>

          {/* Animated Grid */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(to right, rgba(249, 115, 22, 0.05) 1px, transparent 1px),
                               linear-gradient(to bottom, rgba(249, 115, 22, 0.05) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="w-full px-3 sm:px-4 relative z-10">
            <div className="text-center mb-8\">
              <div
                className="inline-flex items-center space-x-2 bg-sky-50 text-sky-600 px-4 py-2 text-xs border border-sky-300 shadow-lg mb-4"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                <Mic className="h-3 w-3 animate-pulse" />
                <span className="font-semibold">AI Voice Demonstration</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 bg-clip-text text-transparent mb-4">
                Experience Natural AI Conversations
              </h2>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                Listen to how our voice automation software handles real customer interactions with intelligence and empathy
              </p>
            </div>

            <div
              className="bg-gray-50 border border-sky-200 p-6 shadow-lg"
              style={{ clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)' }}
            >
              <div className="space-y-3 mb-6">
                {sampleConversation.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 ${
                      msg.speaker === "Customer"
                        ? "bg-white border border-sky-300/30 text-gray-900"
                        : "bg-sky-50 border border-sky-300/50 text-sky-900"
                    } ${
                      currentMessage >= idx + 1 ? "opacity-100 animate-fade-in" : "opacity-30"
                    } `}
                    style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
                  >
                    <p className="text-xs font-semibold text-sky-600 mb-1">{msg.speaker}</p>
                    <p className="text-gray-900 text-xs">{msg.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={playConversation}
                  className="group flex items-center gap-2 px-4 py-2 bg-sky-50 border border-sky-400 text-sky-600 hover:bg-sky-100 hover:text-sky-700 transition-all duration-300 hover:scale-105 hover:border-sky-500"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span className="font-semibold text-xs">
                    {isPlaying ? "Pause" : "Play"} Conversation
                  </span>
                </button>
              </div>

              {/* Visual Waveform - Modern Light */}
              {isPlaying && (
                <div className="mt-4 flex items-center justify-center gap-1 h-12">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const heights = [15, 25, 20, 30, 18, 28, 22, 32, 16, 26, 21, 31, 19, 29, 23, 33, 17, 27, 24, 34, 14, 24, 19, 29, 21, 31, 25, 35, 18, 28];
                    return (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-sky-500 via-sky-400 to-sky-300 animate-waveform"
                        style={{
                          height: `${heights[i]}px`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section - Modern Light */}
        <section className="relative py-12 overflow-hidden bg-gray-50">
          {/* Light Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop')`
            }}
          >
            <div className="absolute inset-0 bg-gray-50/60"></div>
          </div>

          <div className="w-full px-3 sm:px-4 relative z-10">
            <div className="text-center mb-12\">
              <div
                className="inline-flex items-center gap-2 bg-sky-50 border border-sky-300 px-4 py-2 mb-4"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                <Headphones className="w-3 h-3 text-sky-600" />
                <span className="text-xs font-semibold text-sky-600">Common Questions</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold mb-4 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                Voice Automation Software FAQ
              </h2>
              <p className="text-sm text-gray-700 max-w-2xl mx-auto">
                Everything you need to know about implementing voice automation software
              </p>
            </div>
            <div className="w-full grid gap-4">
              {[
                {
                  q: "What is voice automation software?",
                  a: "Voice automation software uses advanced AI to automate phone conversations, handle customer inquiries, schedule appointments, qualify leads, and perform other voice-based tasks without human intervention. Our platform provides natural-sounding conversations with <750ms response times."
                },
                {
                  q: "How does voice automation software integrate with existing systems?",
                  a: "Our voice automation software offers pre-built integrations with major CRM platforms (Salesforce, HubSpot), scheduling tools (Calendly, Google Calendar), ticketing systems (Zendesk, Freshdesk), and custom API connections. Implementation typically takes 2-5 business days with our technical team's support."
                },
                {
                  q: "Can voice automation software handle multiple languages?",
                  a: "Yes, our voice automation software supports 30+ languages including English, Spanish, French, German, Mandarin, Japanese, and more. The AI automatically detects the caller's language and responds accordingly, with native-level pronunciation and cultural awareness."
                },
                {
                  q: "What is the accuracy rate of voice automation software?",
                  a: "Our voice automation software achieves 95%+ accuracy in speech recognition and intent classification. The AI continuously learns from interactions, improving performance over time. For complex queries beyond its capability, it seamlessly transfers to human agents with full context."
                },
                {
                  q: "How secure is voice automation software for handling sensitive data?",
                  a: "Our voice automation software is SOC 2 Type II certified, GDPR compliant, and HIPAA-ready. All voice data is encrypted in transit (TLS 1.3) and at rest (AES-256). We provide audit logs, role-based access control, and comply with industry-specific regulations for healthcare, finance, and government sectors."
                },
                {
                  q: "What ROI can I expect from voice automation software?",
                  a: "Businesses using our voice automation software typically see 60-80% reduction in call handling costs, 24/7 availability increasing conversion rates by 35-50%, and staff redeployment to high-value tasks. Most clients achieve positive ROI within 3-6 months, with payback accelerating as call volumes scale."
                },
                {
                  q: "How customizable is the voice automation software?",
                  a: "Highly customizable. You can configure conversation flows, brand voice personality, hold music, transfer rules, working hours, and custom responses. Advanced users can build conditional logic, integrate webhooks for real-time data, and create industry-specific workflows without coding."
                },
                {
                  q: "What happens if the voice automation software doesn't understand a caller?",
                  a: "Our voice automation software has multiple fallback mechanisms: (1) clarifying questions, (2) offering menu options, (3) seamless transfer to human agents with full conversation context. The system logs unclear interactions to improve AI training, continuously reducing escalation rates."
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="group relative bg-white border border-sky-200 p-6 hover:border-sky-400 hover:scale-105 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                  style={{ clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <div className="flex gap-4 relative z-10">
                    <div className="flex-shrink-0">
                      <div
                        className="w-8 h-8 bg-sky-50 border border-sky-300 flex items-center justify-center text-sky-600 font-bold text-sm group-hover:scale-110 transition-transform"
                        style={{ clipPath: 'polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)' }}
                      >
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-2 text-sky-600 group-hover:text-sky-700 transition-colors">
                        {faq.q}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-xs">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Modern Light */}
        <section className="relative py-12 overflow-hidden bg-white">
          {/* Light Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-3"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop')`
            }}
          >
            <div className="absolute inset-0 bg-white/30"></div>
          </div>

          <div className="w-full px-3 sm:px-4 relative z-10">
            <div className="w-full text-center">
              <div
                className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 mb-6 border border-sky-300"
                style={{ clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)' }}
              >
                <Bot className="w-3 h-3" />
                <span className="text-xs font-semibold">Start Your Voice Automation Journey</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                  Ready to Automate Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600 text-transparent bg-clip-text">
                  Voice Communications?
                </span>
              </h2>

              <p className="text-sm text-gray-700 mb-8 max-w-2xl mx-auto">
                Join thousands of businesses using our voice automation software to deliver exceptional customer experiences while reducing costs by up to 80%.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
                <Button
                  asChild
                  size="sm"
                  className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-2 text-sm transition-all duration-300 hover:scale-105"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="border border-sky-400 text-sky-600 hover:bg-sky-50 hover:text-sky-700 px-6 py-2 text-sm"
                  style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
                >
                  <Link href="/contact">
                    <Phone className="mr-2 w-3 h-3" />
                    Talk to Sales
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 text-sky-600"
                  style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                >
                  <CheckCircle className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium">No Credit Card Required</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 text-sky-600"
                  style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                >
                  <CheckCircle className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium">14-Day Free Trial</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 text-sky-600"
                  style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                >
                  <CheckCircle className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium">Cancel Anytime</span>
                </div>
                <div
                  className="flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-200 text-sky-600"
                  style={{ clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)' }}
                >
                  <CheckCircle className="w-3 h-3 text-sky-600" />
                  <span className="text-xs font-medium">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








