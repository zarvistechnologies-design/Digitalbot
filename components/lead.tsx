"use client"

import { ArrowRight, Building2, CheckCircle2, Mail, MessageSquare, Mic, Phone, PhoneCall, Send, Shield, Star, User, Zap } from "lucide-react"
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
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-white pointer-events-none" aria-hidden="true" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
              {/* Left: Form */}
              <div className="relative">
                <div className="relative bg-white rounded-3xl p-8 shadow-lg border border-gray-100">

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

              {/* Right: Two-Phone Preview */}
              <div className="hidden lg:flex justify-center">
                <div className="relative w-full max-w-[520px] min-h-[560px] overflow-hidden rounded-[32px] border border-[#2b2038] bg-[radial-gradient(circle_at_top_left,_rgba(196,181,253,0.55),transparent_30%),radial-gradient(circle_at_top_right,_rgba(251,146,60,0.35),transparent_28%),radial-gradient(circle_at_bottom_center,_rgba(168,139,250,0.28),transparent_35%),linear-gradient(135deg,#17131f_0%,#120f1f_42%,#241521_100%)] p-6 shadow-[0_30px_80px_rgba(15,10,30,0.35)]">
                  <div className="absolute inset-x-10 bottom-0 h-24 rounded-full bg-white/20 blur-3xl" />

                  <div className="flex items-center justify-between text-white/80">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium backdrop-blur">
                      <Zap className="h-3.5 w-3.5 text-orange-300" />
                      Live Voice UI
                    </div>
                    <div className="rounded-full border border-orange-300/40 bg-orange-400/10 px-4 py-1.5 text-[11px] font-medium text-orange-100 backdrop-blur">
                      Get Started
                    </div>
                  </div>

                  <div className="relative mt-8 h-[460px]">
                    <div className="absolute left-0 top-8 max-w-[170px] space-y-3 text-white">
                      <p className="text-2xl font-semibold leading-tight">
                        See your AI agent working in real time.
                      </p>
                      <p className="text-sm leading-6 text-white/70">
                        Calls, summaries, transfers, and bookings — all in one smart flow.
                      </p>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs text-white/80 backdrop-blur">
                        <PhoneCall className="h-3.5 w-3.5 text-orange-300" />
                        50K+ calls automated
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-[110px] h-[250px] w-[160px] rounded-[28px] border-[6px] border-[#15121d] bg-[linear-gradient(180deg,#5642b1_0%,#1a1630_55%,#111018_100%)] p-3 shadow-[0_20px_50px_rgba(12,8,24,0.6)]">
                      <div className="mx-auto mb-3 h-5 w-20 rounded-full bg-black/70" />
                      <div className="rounded-[20px] bg-white/10 p-3 backdrop-blur">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                            <Mic className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">DigitalBot</p>
                            <p className="text-[10px] text-white/60">AI call assistant</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-xl bg-blue-500/30 px-2 py-1 text-[10px] text-white">
                          <span>Call summary</span>
                          <span>GET</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-4 top-0 h-[390px] w-[210px] rounded-[34px] border-[7px] border-[#15121d] bg-[linear-gradient(180deg,#5b47c8_0%,#221c46_50%,#0e1018_100%)] p-4 shadow-[0_30px_70px_rgba(8,6,20,0.65)]">
                      <div className="mx-auto mb-4 h-6 w-24 rounded-full bg-black/80" />
                      <div className="mb-4 flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 text-white/90 backdrop-blur">
                        <span className="text-[11px]">AI Voice Console</span>
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[10px]">⋯</span>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                          <p className="text-xs text-white/60">Now live</p>
                          <p className="mt-1 text-[28px] font-semibold leading-8 text-white">Hey, your AI agent is handling calls.</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/50">Search conversations</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-2xl bg-white/10 p-3">
                            <p className="text-[10px] text-white/60">Lead</p>
                            <p className="mt-3 text-sm font-medium text-white">Booked demo</p>
                          </div>
                          <div className="rounded-2xl bg-white/10 p-3">
                            <p className="text-[10px] text-white/60">Transfer</p>
                            <p className="mt-3 text-sm font-medium text-white">Agent ready</p>
                          </div>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-r from-orange-400/80 to-amber-300/80 p-3 text-[#1a1023]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Today</p>
                          <p className="mt-1 text-sm font-semibold">12 appointments confirmed</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-0 top-24 rounded-2xl border border-white/15 bg-white/90 px-3 py-2 shadow-lg">
                      <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                        <MessageSquare className="h-3.5 w-3.5 text-orange-500" />
                        50K+ happy users
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
  
    </>
  )
}
