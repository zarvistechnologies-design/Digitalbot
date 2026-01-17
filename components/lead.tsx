"use client"

import { Building2, CheckCircle2, Mail, MessageSquare, Phone, Send, Sparkles, User, Zap } from "lucide-react"
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

        // Reset success message after 5 seconds
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

    <section className="relative py-16 overflow-hidden bg-white">

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          <div className="grid lg:grid-cols-2 gap-8 items-center">

            {/* Left Side - Info */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-400/15 to-orange-500/15 border border-orange-400/25 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-orange-600 animate-pulse" />
                <span className="text-xs font-bold text-orange-600 tracking-wide">Get Started Today</span>
              </div>

              {/* Heading */}
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3">
                  <span className="bg-gradient-to-r from-gray-900 to-orange-800 bg-clip-text text-transparent tracking-wide">
                    Transform Your Business with
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-widest">
                    AI Voice Assistants
                  </span>
                </h2>
                <p className="text-base lg:text-lg text-gray-900 leading-relaxed">
                  Join thousands of businesses automating customer interactions.
                  Get a personalized demo and discover how AI can revolutionize your operations.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {[
                { icon: Zap, text: "Setup in 5 minutes", gradient: "from-orange-300 via-orange-400 to-orange-500", border: "border-orange-400/25", bg: "from-orange-400/15 to-orange-500/15" },
                { icon: CheckCircle2, text: "No credit card required", gradient: "from-orange-300 via-orange-400 to-orange-500", border: "border-orange-400/25", bg: "from-orange-400/15 to-orange-500/15" },
                { icon: Phone, text: "Free consultation call", gradient: "from-orange-300 via-orange-400 to-orange-500", border: "border-orange-400/25", bg: "from-orange-400/15 to-orange-500/15" },
                { icon: Building2, text: "Enterprise-ready solution", gradient: "from-orange-300 via-orange-400 to-orange-500", border: "border-orange-400/25", bg: "from-orange-400/15 to-orange-500/15" }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 group">
                  <div className={`p-1.5 bg-gradient-to-r ${feature.bg} rounded-lg group-hover:scale-110 transition-transform border ${feature.border} backdrop-blur-sm shadow-md shadow-orange-400/15`}>
                    <feature.icon className={`w-4 h-4 text-orange-600`} />
                  </div>
                  <span className="text-gray-900 font-medium text-sm tracking-wide">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-orange-400/15">
                <p className="text-xs text-orange-600 mb-2">Trusted by leading companies worldwide</p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-wide">10K+</div>
                    <div className="text-[10px] text-orange-600">Active Users</div>
                  </div>
                  <div className="w-px h-8 bg-orange-400/15" />
                  <div className="text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-wide">99.9%</div>
                    <div className="text-[10px] text-orange-600">Uptime</div>
                  </div>
                  <div className="w-px h-8 bg-orange-400/15" />
                  <div className="text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-wide">24/7</div>
                    <div className="text-[10px] text-orange-600">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="relative">
              <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-6 md:p-7 shadow-xl shadow-orange-400/25 border border-orange-400/25 relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/15 via-orange-300/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl from-orange-400/15 via-orange-300/10 to-transparent rounded-full blur-2xl" />

                <div className="relative z-10">
                  {/* Form Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent mb-2 tracking-wide">Request a Demo</h3>
                    <p className="text-sm text-gray-900">Fill out the form and we'll get back to you within 24 hours</p>
                  </div>

                  {/* Success Message */}
                  {isSuccess && (
                    <div className="mb-6 p-4 bg-orange-400/10 border border-orange-400/30 rounded-xl flex items-center gap-3 backdrop-blur-sm">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 flex-shrink-0" />
                      <div>
                        <p className="text-orange-400 font-semibold">Thank you for your interest!</p>
                        <p className="text-orange-500 text-sm">We'll contact you shortly at {formData.email}</p>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-orange-400/10 border border-orange-400/30 rounded-xl backdrop-blur-sm">
                      <p className="text-orange-400 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold text-gray-900 mb-1.5 tracking-wide">
                        Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-orange-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 h-10 bg-white/90 border border-orange-400/25 text-gray-900 text-sm placeholder:text-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 rounded-lg backdrop-blur-sm outline-none transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-900 mb-1.5">
                        Work Email *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-orange-400" />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 h-10 bg-white/90 border border-orange-400/25 text-gray-900 text-sm placeholder:text-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 rounded-lg backdrop-blur-sm outline-none transition-all"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-gray-900 mb-1.5">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-orange-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 h-10 bg-white/90 border border-orange-400/25 text-gray-900 text-sm placeholder:text-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 rounded-lg backdrop-blur-sm outline-none transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    {/* Company Field */}
                    <div>
                      <label htmlFor="company" className="block text-xs font-semibold text-gray-900 mb-1.5">
                        Company Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-4 w-4 text-orange-400" />
                        </div>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full pl-10 h-10 bg-white/90 border border-orange-400/25 text-gray-900 text-sm placeholder:text-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 rounded-lg backdrop-blur-sm outline-none transition-all"
                          placeholder="Your Company Inc."
                        />
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-gray-900 mb-1.5">
                        How can we help? *
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <MessageSquare className="h-4 w-4 text-orange-400" />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={3}
                          className="w-full pl-10 pt-2.5 pb-2.5 bg-white/90 border border-orange-400/25 text-gray-900 text-sm placeholder:text-orange-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-400/40 rounded-lg resize-none backdrop-blur-sm outline-none transition-all"
                          placeholder="Tell us about your business needs..."
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-11 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 hover:from-orange-300 hover:via-orange-400 hover:to-orange-600 text-white font-bold text-sm rounded-lg shadow-md shadow-orange-400/25 hover:shadow-lg hover:shadow-orange-400/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Request Free Demo
                        </>
                      )}
                    </button>

                    {/* Privacy Note */}
                    <p className="text-[10px] text-orange-600 text-center">
                      By submitting this form, you agree to our{" "}
                      <a href="/privacy" className="text-orange-600 hover:text-orange-700 underline">
                        Privacy Policy
                      </a>
                      . We respect your privacy and never share your data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
