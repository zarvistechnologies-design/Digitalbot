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
      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Request a Demo</h3>
            <p className="text-sm text-gray-500">We'll get back to you within 2 hours</p>
          </div>
        </div>

          {isSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-sm mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-medium">Thank you! We'll contact you soon.</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm mb-4">
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          )}

          <div className="relative group">
            <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Work Email"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
            />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
            />
          </div>

          <div className="relative group">
            <Building2 className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="Company Name"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-300"
            />
          </div>

          <div className="relative group">
            <MessageSquare className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
            <textarea
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="How can we help?"
              rows={3}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none hover:border-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl group"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Request Demo
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            By submitting, you agree to our <a href="/privacy" className="text-blue-600 hover:underline transition-colors">Privacy Policy</a>.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-2 pt-4 border-t border-gray-100">
            <a href="mailto:hello@digitalbot.ai" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Mail className="w-3.5 h-3.5" />
              hello@digitalbot.ai
            </a>
            <span className="text-gray-300">|</span>
            <a href="tel:+917892518414" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +91 78925 18414
            </a>
          </div>
      </form>
    </div>
  )
}
