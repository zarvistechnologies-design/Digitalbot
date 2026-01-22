"use client"

import { Building2, CheckCircle2, Mail, MessageSquare, Phone, Send, User } from "lucide-react"
import { useState } from "react"

export function LeadFormMini() {
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
        setTimeout(() => setIsSuccess(false), 5000)
      } else {
        throw new Error(data.message || "Failed to submit form")
      }
    } catch (err) {
      setError("Failed to submit form. Please try again or email us directly at hello@metic.ai")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white via-sky-50 to-sky-100 border border-sky-500/30 rounded-xl shadow-2xl p-6 space-y-4 relative overflow-hidden"
        style={{
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
          boxShadow: '0 0 30px rgba(234, 88, 12, 0.3)'
        }}>

        {/* Light Theme Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-transparent to-sky-600/5 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-sky-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-sky-500/10 rounded-full blur-lg"></div>

        <div className="relative z-10">
          <h3 className="text-xl font-bold text-sky-600 mb-4 text-center uppercase tracking-wide"
            style={{ textShadow: '0 0 10px rgba(234, 88, 12, 0.3)' }}>
            Contact Sales
          </h3>

          {isSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg flex items-center gap-2 text-emerald-700 text-sm mb-4"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)'
              }}>
              <CheckCircle2 className="w-4 h-4" /> Thank you! We'll contact you soon.
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-700 text-sm mb-4"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
              }}>
              {error}
            </div>
          )}
          <div className="relative group">
            <User className="absolute left-3 top-3 w-4 h-4 text-sky-500 z-10" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-10 pr-3 py-2.5 bg-white/70 border border-sky-400/30 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:bg-white outline-none transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-sky-500 z-10" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Work Email"
              className="w-full pl-10 pr-3 py-2.5 bg-white/70 border border-sky-400/30 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:bg-white outline-none transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-3 top-3 w-4 h-4 text-sky-500 z-10" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-10 pr-3 py-2.5 bg-white/70 border border-sky-400/30 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:bg-white outline-none transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          <div className="relative group">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-sky-500 z-10" />
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full pl-10 pr-3 py-2.5 bg-white/70 border border-sky-400/30 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:bg-white outline-none transition-all duration-300"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          <div className="relative group">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-sky-500 z-10" />
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help?"
              rows={3}
              className="w-full pl-10 pr-3 py-2.5 bg-white/70 border border-sky-400/30 text-gray-900 placeholder-gray-500 focus:border-sky-500 focus:bg-white outline-none transition-all duration-300 resize-none"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30 uppercase tracking-wide"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
            }}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Request Demo
              </>
            )}
          </button>

          <div className="text-xs text-gray-600 text-center mt-3">
            By submitting, you agree to our <a href="/privacy" className="text-sky-600 underline hover:text-sky-700 transition-colors">Privacy Policy</a>.
          </div>

          <div className="flex flex-col gap-1 text-xs text-center text-gray-700 mt-2 p-3 bg-sky-50/50 border border-sky-400/20 rounded-lg">
            <span>Email: <a href="mailto:hello@digitalbot.ai" className="text-sky-600 underline hover:text-sky-700 transition-colors">hello@digitalbot.ai</a></span>
            <span>Phone: <a href="tel:+917892518414" className="text-sky-600 underline hover:text-sky-700 transition-colors">+91 78925 18414</a></span>
          </div>
        </div>
      </form>
    </div>
  )
}
