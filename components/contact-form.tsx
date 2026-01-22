"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, MessageCircle } from "lucide-react"
import React, { ChangeEvent, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

interface ContactFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  inquiry: string;
  message: string;
}

export function ContactForm() {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setForm({ ...form, [id as keyof ContactFormState]: value })
  }

  const handleSelectChange = (value: string) => {
    setForm({ ...form, inquiry: value });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    if (!form.phone || !form.email || !form.inquiry) {
      setError("Please fill in all mandatory fields: Phone, Email, and Inquiry Type.")
      setLoading(false)
      return;
    }

    try {
      const res = await fetch("https://digital-api-tef8.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(data.message || "Message sent successfully! We'll contact you ASAP.")
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          inquiry: "",
          message: ""
        })
      } else {
        setError(data.error || "Failed to submit form.")
      }
    } catch (err) {
      console.error(err)
      setError("Network error: Could not connect to the server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-lg border border-sky-400/25 hover:border-sky-300/50 shadow-2xl hover:shadow-sky-400/20 transition-all duration-500 relative overflow-hidden group rounded-2xl">
      {/* Decorative Glow */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-sky-400/20 rounded-full filter blur-3xl group-hover:blur-2xl transition-all"></div>

      <CardHeader className="p-6 sm:p-8 relative z-10">
        <div className="inline-block mb-4">
          <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg border border-sky-300/50"
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))'
                }}>
            ✉️ AI Voice Agent Contact Form
          </span>
        </div>
        <CardTitle className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent mb-4 uppercase tracking-wider">
          Send us a message
        </CardTitle>
        <CardDescription className="text-base sm:text-lg font-medium bg-white/90 backdrop-blur-sm rounded-xl px-6 py-4 shadow-lg border border-sky-400/25 text-gray-900">
          Reach out to our AI voice agent team for <span className="font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">24/7 support</span>, <span className="font-bold bg-gradient-to-r from-sky-300 to-sky-500 bg-clip-text text-transparent">partnership opportunities</span>, or general inquiries. We're here to help your business grow with AI voice automation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6 sm:p-8 relative z-10">
        {success && (
          <div className="bg-white/90 backdrop-blur-sm border border-sky-400/50 text-sky-600 p-4 rounded-xl text-sm font-semibold shadow-lg shadow-sky-400/20">
            ✓ {success}
          </div>
        )}
        {error && (
          <div className="bg-white/90 backdrop-blur-sm border border-red-400/50 text-red-600 p-4 rounded-xl text-sm font-semibold shadow-lg shadow-red-400/20">
            ✗ {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-bold text-sky-600 uppercase tracking-wide">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-bold text-sky-600 uppercase tracking-wide">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-sky-600 uppercase tracking-wide">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-sky-600 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={form.phone}
                onChange={handleChange}
                required
                className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-bold text-sky-600 uppercase tracking-wide">Company Name</Label>
            <Input
              id="company"
              placeholder="Your Company Name"
              value={form.company}
              onChange={handleChange}
              className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inquiry" className="text-sm font-bold text-sky-600 uppercase tracking-wide">
              AI Voice Agent Inquiry Type <span className="text-red-500">*</span>
            </Label>
            <Select value={form.inquiry} onValueChange={handleSelectChange} required>
              <SelectTrigger className="h-12 bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900">
                <SelectValue placeholder="Select AI voice agent inquiry type" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-lg border border-sky-400/50 text-gray-900">
                <SelectItem value="sales">💼 AI Voice Agent Sales Inquiry</SelectItem>
                <SelectItem value="support">🛠️ Technical Support & Setup</SelectItem>
                <SelectItem value="partnership">🤝 Partnership & Integration</SelectItem>
                <SelectItem value="demo">🎯 Request AI Voice Demo</SelectItem>
                <SelectItem value="other">💡 Other AI Voice Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-bold text-sky-600 uppercase tracking-wide">Project Details</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your AI voice agent project and how we can help automate your business..."
              className="min-h-[140px] bg-white/90 border border-sky-400/50 focus:border-sky-300 rounded-xl shadow-sm hover:shadow-md hover:shadow-sky-400/20 transition-all text-gray-900 placeholder:text-sky-400"
              value={form.message}
              onChange={handleChange}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 hover:from-sky-300 hover:via-sky-400 hover:to-sky-600 text-black font-bold shadow-2xl shadow-sky-400/40 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_rgba(255,140,0,0.9)] hover:-translate-y-1 h-14 text-lg uppercase tracking-widest"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}
            disabled={loading}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {loading ? "Sending AI Message..." : "Send Message to AI Team"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
