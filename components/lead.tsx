"use client"

import { ArrowRight, BarChart3, Building2, CheckCircle2, Clock, Globe, Headphones, Mail, MessageSquare, Phone, Send, Shield, Sparkles, Star, User, Users, Zap } from "lucide-react"
import { useState } from "react"

export function Lead() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const submitData = new FormData()
      submitData.append("access_key", "8f0556d8-66c3-4e2d-810e-5de948aff5ce")
      submitData.append("subject", `New Lead from ${formData.company}`)
      submitData.append("from_name", "DigitalBot Lead Form")
      submitData.append("name", formData.name)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("company", formData.company)
      submitData.append("message", formData.message)
      submitData.append("redirect", "false")
      submitData.append("to", "hello@metic.ai")

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData
      })

      const data = await response.json()

      if (data.success) {
        setIsSuccess(true)
        const savedEmail = formData.email
        setFormData({
          name: "",
          email: savedEmail,
          phone: "",
          company: "",
          message: ""
        })

        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        throw new Error(data.message || "Failed to submit form")
      }
    } catch (err) {
      console.error("Form submission error:", err)
      setError("Failed to submit form. Please try again or email us directly at hello@metic.ai")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Main Lead Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-orange-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-orange-200/40 to-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-gradient-to-br from-rose-200/30 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] w-4 h-4 bg-orange-400 rounded-full opacity-70 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-48 right-[20%] w-3 h-3 bg-orange-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-[25%] w-5 h-5 bg-emerald-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-rose-400 rounded-full opacity-70 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute bottom-48 right-[30%] w-3 h-3 bg-orange-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
          <div className="absolute top-24 left-[40%] w-2 h-2 bg-orange-400 rounded-full opacity-50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.8s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Form */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-orange-500/20 to-orange-400/20 rounded-3xl blur-2xl opacity-60" />
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl shadow-orange-500/10 border border-white/40">
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 via-orange-500/10 to-transparent rounded-bl-[100px]" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-orange-400/10 via-orange-500/10 to-transparent rounded-tr-[80px]" />

                  <div className="relative z-10">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
                        <Send className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Request a Demo</h3>
                      <p className="text-gray-500 text-sm">Fill out the form and we'll get back to you within 24 hours</p>
                    </div>

                    {/* Success Message */}
                    {isSuccess && (
                      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-emerald-700 font-semibold">Thank you for your interest!</p>
                          <p className="text-emerald-600 text-sm">We'll contact you shortly</p>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <User className="w-3 h-3 text-orange-500" /> Full Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-orange-500" /> Work Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      {/* Phone & Company Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-orange-500" /> Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-orange-500" /> Company
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all"
                            placeholder="Your Company Inc."
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-orange-500" /> How can we help?
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl resize-none outline-none transition-all"
                          placeholder="Tell us about your business needs..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-14 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group btn-glow"
                      >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Request Free Demo
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      {/* Trust Badges */}
                      <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Shield className="w-4 h-4 text-orange-500" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200" />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-4 h-4 text-orange-500" />
                          <span>4.9/5 Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Attractive Content */}
              <div className="hidden lg:flex flex-col gap-8">
                {/* Hero Tagline */}
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50/80 border border-orange-200/50 rounded-full mb-5">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-orange-700">AI-Powered Voice Agents</span>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                    Transform Every Call Into a{" "}
                    <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Growth Opportunity</span>
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Our AI voice assistants handle customer calls 24/7 — booking appointments, answering questions, and closing deals while you focus on what matters.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="space-y-4">
                  {[
                    { icon: Headphones, title: "Natural Conversations", desc: "Human-like AI that understands context and intent" },
                    { icon: Zap, title: "Instant Setup", desc: "Go live in under 10 minutes with zero coding" },
                    { icon: Globe, title: "50+ Languages", desc: "Speak your customers' language, anywhere in the world" },
                    { icon: BarChart3, title: "Real-time Analytics", desc: "Track every call, sentiment, and conversion metric" },
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 border border-gray-100 hover:shadow-md hover:border-orange-200/60 transition-all duration-300 group">
                      <div className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20 group-hover:scale-110 transition-transform">
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-0.5">{feature.title}</h4>
                        <p className="text-sm text-gray-500">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Proof Mini */}
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                  <div className="relative z-10 flex items-center gap-4 w-full">
                    {/* Avatar Stack */}
                    <div className="flex -space-x-3 flex-shrink-0">
                      {["bg-orange-500", "bg-emerald-500", "bg-blue-500", "bg-rose-500"].map((bg, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full ${bg} border-2 border-gray-900 flex items-center justify-center text-white font-bold text-xs`}>
                          {["A", "S", "M", "K"][i]}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm">
                        <span className="text-white font-semibold">500+</span> businesses trust us with <span className="text-white font-semibold">2M+</span> calls/month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Section Below - White Background with Success Stories */}
  
    </>
  )
}
