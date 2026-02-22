"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, Award, CheckCircle, Clock, Globe, Headphones, Mail, MapPin, MessageSquare, Phone, Send, Shield, Sparkles, Star, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react"

interface ContactFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  inquiry: string
  message: string
}

// Animated counter component
function AnimatedCounter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
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
      {count.toLocaleString()}{suffix}
    </span>
  )
}

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team directly",
    value: "+9178925 18414",
    action: "tel:+9178925 18414",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-blue-100/50",
    borderColor: "border-blue-200",
    iconBg: "bg-blue-500"
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 2 hours",
    value: "hello@digitalbot.ai",
    action: "mailto:hello@digitalbot.ai",
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "from-emerald-50 to-emerald-100/50",
    borderColor: "border-emerald-200",
    iconBg: "bg-emerald-500"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our AI assistant",
    value: "Available 24/7",
    action: "#chat",
    gradient: "from-violet-500 to-purple-500",
    bgColor: "from-violet-50 to-violet-100/50",
    borderColor: "border-violet-200",
    iconBg: "bg-violet-500"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our offices",
    value: "India: Behind Manyata Tech Park,\nHebbal, Bangalore 560077\n\nUSA: 300 Quail Ridge Dr NE,\nADA, MI 49301",
    action: "India: Behind Manyata Tech Park, Hebbal, Bangalore 560077 | USA: 300 Quail Ridge Dr NE, ADA, MI 49301",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-amber-100/50",
    borderColor: "border-amber-200",
    iconBg: "bg-amber-500"
  },
]

const inquiryTypes = [
  { value: "demo", label: "Request a Demo" },
  { value: "pricing", label: "Pricing Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "General Question" },
]

const stats = [
  { value: 500, suffix: "+", label: "Happy Clients", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50", iconBg: "bg-blue-500" },
  { value: 98, suffix: "%", label: "Satisfaction Rate", icon: Star, color: "text-emerald-600", bgColor: "bg-emerald-50", iconBg: "bg-emerald-500" },
  { value: 2, suffix: "hr", label: "Avg Response", icon: Clock, color: "text-violet-600", bgColor: "bg-violet-50", iconBg: "bg-violet-500" },
  { value: 50, suffix: "+", label: "Languages", icon: Globe, color: "text-amber-600", bgColor: "bg-amber-50", iconBg: "bg-amber-500" },
]

const benefits = [
  { icon: Zap, text: "Lightning-fast responses", description: "Get answers within 2 hours", color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-50" },
  { icon: Users, text: "Dedicated support team", description: "Personal account manager", color: "from-emerald-500 to-teal-500", bgColor: "bg-emerald-50" },
  { icon: Globe, text: "Global coverage", description: "Support in 50+ languages", color: "from-violet-500 to-purple-500", bgColor: "bg-violet-50" },
  { icon: Shield, text: "Enterprise security", description: "SOC2 & HIPAA compliant", color: "from-amber-500 to-orange-500", bgColor: "bg-amber-50" },
  { icon: Award, text: "Industry leaders", description: "Trusted by Fortune 500", color: "from-rose-500 to-pink-500", bgColor: "bg-rose-50" },
  { icon: TrendingUp, text: "Proven results", description: "300% average ROI", color: "from-cyan-500 to-blue-500", bgColor: "bg-cyan-50" },
]

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    inquiry: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "8f0556d8-66c3-4e2d-810e-5de948aff5ce",
          ...form
        })
      })

      const data = await response.json()
      if (data.success) {
        setSuccess("Message sent successfully! We'll get back to you within 2 hours.")
        setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", inquiry: "", message: "" })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (err) {
      setError("Failed to send message. Please try again or contact us directly.")
    } finally {
      setLoading(false)
    }
  }

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
            <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-amber-100/20 rounded-full blur-[100px]" />
          </div>

          {/* Colorful Floating Dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-emerald-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute bottom-1/4 right-[25%] w-3 h-3 bg-rose-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.8s' }} />
            <div className="absolute top-2/3 left-[8%] w-4 h-4 bg-cyan-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1.2s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-blue-600 font-semibold">Contact</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mb-6 shadow-lg shadow-blue-500/30">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-bold">Get In Touch</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  Let's Start a
                  <span className="block bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-clip-text text-transparent mt-2">Conversation</span>
                </h1>

                <p className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed">
                  Have questions about our AI voice platform? We're here to help. Reach out and we'll respond within <strong className="text-blue-600">2 hours</strong>.
                </p>

                {/* Quick Features */}
                <div className="flex flex-wrap gap-3 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-700 font-medium">2hr Response</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700 font-medium">Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full">
                    <Users className="w-4 h-4 text-violet-600" />
                    <span className="text-sm text-gray-700 font-medium">Dedicated Team</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href="#contact-form" className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                    Send Message
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="tel:+9178925 18414" className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Link>
                </div>
              </div>

              {/* Right - Stats Dashboard */}
              <div className="relative mt-8 lg:mt-0">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Contact Stats</h3>
                      <p className="text-sm text-gray-500">Real-time metrics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-700">Live</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {stats.map((stat, i) => (
                      <div key={i} className={`${stat.bgColor} rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-all hover:-translate-y-1`}>
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                            <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
                        </div>
                        <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
                          <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="hidden sm:block absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
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

        {/* Main Contact Form Section */}
        <section id="contact-form" className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-violet-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-100/30 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto max-w-2xl relative z-10">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Send us a Message</h3>
                    <p className="text-xs sm:text-sm text-gray-500">We'll get back to you within 2 hours</p>
                  </div>
                </div>

                {success && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="text-emerald-700 font-medium">{success}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Work Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                        Company *
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={form.company}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                        placeholder="Your Company Inc."
                      />
                    </div>
                    <div>
                      <label htmlFor="inquiry" className="block text-sm font-semibold text-gray-700 mb-2">
                        Inquiry Type *
                      </label>
                      <select
                        id="inquiry"
                        value={form.inquiry}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
                      >
                        <option value="">Select an option</option>
                        {inquiryTypes.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none hover:border-blue-300"
                      placeholder="Tell us about your needs..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our{" "}
                    <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  </p>
                </form>
              </div>
          </div>
        </section>

        {/* Contact Methods - Blue Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Multiple Ways to Reach Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4">
                Choose Your Preferred Channel
              </h2>
              <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
                We're available across multiple channels to ensure you can reach us in the way that works best for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.action}
                  className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <method.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-blue-200 text-sm mb-3">{method.description}</p>
                  <div className="text-white font-semibold text-sm space-y-1">
                    {method.value.split('\n').map((line: string, idx: number) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section - White */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-6">
                <Award className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600">Why Contact Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-4">
                World-Class Support Experience
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                We're committed to providing you with the best support experience in the industry.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, i) => (
                <div
                  key={i}
                  className={`group ${benefit.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.text}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Blue */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="container mx-auto max-w-4xl text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Start Today</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience the power of AI voice agents. No credit card required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#contact-form" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#contact-form" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/30 flex items-center gap-2">
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
