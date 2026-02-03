"use client"

import { Building2, CheckCircle2, Mail, MessageSquare, Phone, Send, Sparkles, User, Zap, Star, Shield, Clock, Users, ArrowRight, Play, Headphones, BarChart3, Globe } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

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
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-amber-200/40 to-orange-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-violet-200/40 to-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/3 w-64 h-64 bg-gradient-to-br from-rose-200/30 to-pink-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] w-4 h-4 bg-amber-400 rounded-full opacity-70 animate-bounce" style={{ animationDuration: '3s' }} />
          <div className="absolute top-48 right-[20%] w-3 h-3 bg-violet-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-32 left-[25%] w-5 h-5 bg-emerald-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-rose-400 rounded-full opacity-70 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute bottom-48 right-[30%] w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
          <div className="absolute top-24 left-[40%] w-2 h-2 bg-orange-400 rounded-full opacity-50 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.8s' }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Side - Info with Image */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-sm font-bold text-blue-600">Get Started Today</span>
                </div>

                {/* Heading */}
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
                    <span className="text-gray-900">Transform Your Business with</span>
                    <br />
                    <span className="text-blue-600">
                      AI Voice Assistants
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Join thousands of businesses automating customer interactions.
                    Get a personalized demo and discover how AI can revolutionize your operations.
                  </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Zap, text: "5 Min Setup", gradient: "from-amber-400 to-orange-500", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
                    { icon: Shield, text: "No Card Required", gradient: "from-emerald-400 to-teal-500", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" },
                    { icon: Headphones, text: "Free Consultation", gradient: "from-violet-400 to-purple-500", bgColor: "bg-violet-50", borderColor: "border-violet-200" },
                    { icon: Building2, text: "Enterprise Ready", gradient: "from-rose-400 to-pink-500", bgColor: "bg-rose-50", borderColor: "border-rose-200" }
                  ].map((feature, idx) => (
                    <div key={idx} className={`group p-4 ${feature.bgColor} rounded-xl ${feature.borderColor} border hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                        <feature.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-gray-800 font-semibold text-sm">{feature.text}</p>
                    </div>
                  ))}
                </div>

                {/* Image with Stats Overlay */}
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20">
                    <Image 
                      src="https://res.cloudinary.com/dvwmbidka/image/upload/v1748463847/landingpage_dhuzrr.png"
                      alt="AI Voice Assistant Dashboard"
                      width={600}
                      height={350}
                      className="w-full h-auto object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    
                    {/* Stats on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">10K+</div>
                            <div className="text-xs text-gray-300">Active Users</div>
                          </div>
                          <div className="w-px h-10 bg-white/20" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="text-xs text-gray-300">Uptime</div>
                          </div>
                          <div className="w-px h-10 bg-white/20" />
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">24/7</div>
                            <div className="text-xs text-gray-300">Support</div>
                          </div>
                        </div>
                        {/* Play Button */}
                        <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 border border-white/30">
                          <Play className="w-6 h-6 text-white fill-white ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -top-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                    🔥 Most Popular
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-60" />
                
                <div className="relative bg-white rounded-3xl p-8 shadow-2xl shadow-blue-500/10 border border-gray-100">
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-bl-[100px]" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-tr-[80px]" />

                  <div className="relative z-10">
                    {/* Form Header */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
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
                            <User className="w-3 h-3 text-blue-500" /> Full Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Mail className="w-3 h-3 text-blue-500" /> Work Email
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all"
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>

                      {/* Phone & Company Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-blue-500" /> Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                        <div>
                          <label htmlFor="company" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-blue-500" /> Company
                          </label>
                          <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full h-12 px-4 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl outline-none transition-all"
                            placeholder="Your Company Inc."
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div>
                        <label htmlFor="message" className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-blue-500" /> How can we help?
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl resize-none outline-none transition-all"
                          placeholder="Tell us about your business needs..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
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
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="w-px h-4 bg-gray-200" />
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-4 h-4 text-blue-500" />
                          <span>4.9/5 Rating</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Section Below - White Background with Success Stories */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-4">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Real Results</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Businesses <span className="text-blue-600">Thriving</span> with AI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how companies are transforming their customer experience with our AI voice assistants
            </p>
          </div>

          {/* Success Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Users, value: "2M+", label: "Calls Handled" },
              { icon: Clock, value: "85%", label: "Time Saved" },
              { icon: Star, value: "4.9", label: "Avg Rating" },
              { icon: Globe, value: "50+", label: "Languages" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-blue-50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Success Story Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Healthcare Plus",
                role: "Medical Center",
                quote: "Reduced appointment no-shows by 60% with automated reminders and scheduling.",
                stat: "60%",
                statLabel: "Less No-shows"
              },
              {
                name: "TechCorp Solutions",
                role: "IT Services",
                quote: "Our support team now handles 3x more inquiries with the same headcount.",
                stat: "3x",
                statLabel: "More Efficiency"
              },
              {
                name: "Retail Giants",
                role: "E-commerce",
                quote: "Customer satisfaction scores jumped from 3.2 to 4.8 within 3 months.",
                stat: "4.8",
                statLabel: "CSAT Score"
              }
            ].map((story, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                {/* Quote */}
                <div className="mb-6">
                  <div className="text-4xl text-blue-200 font-serif mb-2">"</div>
                  <p className="text-gray-700 leading-relaxed">{story.quote}</p>
                </div>
                
                {/* Stat Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold mb-6">
                  <span className="text-lg">{story.stat}</span>
                  <span className="text-white/80">{story.statLabel}</span>
                </div>

                {/* Company Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {story.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-500">{story.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to Join These Success Stories?
                </h3>
                <p className="text-gray-400">Start your free trial today. No credit card required.</p>
              </div>
              <div className="flex items-center gap-4">
                <a href="/contact#contact-form" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href="/contact#contact-form" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  Talk to Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
