"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, Award, BarChart3, Building2, CheckCircle, Globe, Heart, Lightbulb, Phone, Rocket, Shield, Sparkles, Star, Target, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Animated counter component
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Mini Bar Chart Component
function MiniBarChart({ data, colors }: { data: number[]; colors: string[] }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-3 rounded-t-sm ${colors[i % colors.length]} transition-all duration-500`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  )
}

const values = [
  {
    icon: Target,
    title: "Customer-Centric",
    description: "Every feature we build solves real customer problems and drives measurable business value.",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push the boundaries of AI voice technology to deliver cutting-edge experiences.",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50"
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We maintain the highest standards in accuracy, security, and performance.",
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    icon: Heart,
    title: "Collaboration",
    description: "We believe in the power of human-AI collaboration to transform businesses.",
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50"
  },
]

const milestones = [
  {
    year: "2024 Q1",
    title: "Founded DigitalBot.ai",
    description: "Started with a vision to democratize AI voice technology",
    icon: Building2,
    color: "bg-blue-500"
  },
  {
    year: "2024 Q2",
    title: "First 100 Customers",
    description: "Reached milestone serving 100+ businesses globally",
    icon: Users,
    color: "bg-emerald-500"
  },
  {
    year: "2024 Q3",
    title: "Platform Launch",
    description: "Multi-language support with analytics dashboard",
    icon: Globe,
    color: "bg-violet-500"
  },
  {
    year: "2024 Q4",
    title: "1M+ Conversations",
    description: "Processed over 1 million voice conversations",
    icon: Zap,
    color: "bg-amber-500"
  },
  {
    year: "2025",
    title: "Rapid Growth",
    description: "500+ businesses, expanding to new markets",
    icon: Rocket,
    color: "bg-rose-500"
  },
]

const teamStats = [
  { label: "Team Members", value: 50, suffix: "+", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Countries", value: 25, suffix: "+", icon: Globe, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { label: "Years Experience", value: 100, suffix: "+", icon: Award, color: "text-violet-600", bgColor: "bg-violet-50" },
  { label: "Patents Filed", value: 12, suffix: "", icon: Lightbulb, color: "text-amber-600", bgColor: "bg-amber-50" },
]

export default function About() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-emerald-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-blue-600 font-semibold">About</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">About Our Company</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  Building the Future of
                  <span className="block text-blue-600 mt-2">AI Voice Technology</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We're on a mission to democratize AI voice technology, making intelligent voice assistants accessible to businesses of all sizes. Our platform handles millions of conversations with human-like quality.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/services" className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all">
                    Our Services
                  </Link>
                </div>
              </div>

              {/* Right - Stats Dashboard */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Company Overview</h3>
                      <p className="text-sm text-gray-500">Real-time metrics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-700">Live</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Customers</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={500} suffix="+" />
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Calls/Day</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={50} suffix="K" />
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Uptime</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">99.9%</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Languages</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={50} suffix="+" />
                      </p>
                    </div>
                  </div>

                  {/* Growth Chart */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-700">Monthly Growth</span>
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +127%
                      </span>
                    </div>
                    <MiniBarChart 
                      data={[30, 45, 55, 40, 65, 75, 60, 85, 95, 80, 100, 90]} 
                      colors={['bg-blue-400', 'bg-blue-500', 'bg-blue-600']}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Jan</span>
                      <span>Jun</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">4.9</p>
                      <p className="text-xs text-gray-500">Customer Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                  <Rocket className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  Transforming Business Communication with AI
                </h2>
                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  We envision a world where every business, regardless of size, has access to intelligent AI voice technology. Our platform empowers companies to deliver exceptional customer experiences 24/7.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Human-like Conversations', 'Instant Responses', 'Always Available'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Conversations', value: '10M+', icon: Phone, color: 'from-emerald-400 to-teal-500' },
                  { label: 'Response Time', value: '<500ms', icon: Zap, color: 'from-amber-400 to-orange-500' },
                  { label: 'Satisfaction', value: '98%', icon: Heart, color: 'from-rose-400 to-pink-500' },
                  { label: 'Cost Saved', value: '$5M+', icon: TrendingUp, color: 'from-violet-400 to-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Heart className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Our Core Values</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide every decision we make and every product we build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <div
                  key={i}
                  className={`group ${value.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-6">
                <Rocket className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Milestones & Achievements
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From a small startup to a global AI voice platform - here's our story.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-violet-500 to-rose-500 -translate-x-1/2 hidden lg:block rounded-full" />

              <div className="space-y-8 lg:space-y-12">
                {milestones.map((milestone, i) => (
                  <div key={i} className={`relative lg:flex items-center ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all inline-block ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                        <span className="text-sm font-bold text-blue-600 mb-2 block">{milestone.year}</span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
                      <div className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <milestone.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Empty space for other side */}
                    <div className="lg:w-1/2 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">Our Team</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                The People Behind DigitalBot
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A diverse team of AI engineers, designers, and customer success experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamStats.map((stat, i) => (
                <div key={i} className={`${stat.bgColor} rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-1`}>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies already using DigitalBot to automate their customer communications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-blue-500/30 text-white font-bold rounded-xl hover:bg-blue-500/50 transition-all border border-white/30">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
