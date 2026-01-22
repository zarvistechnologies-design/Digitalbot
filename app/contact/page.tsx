"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import Image from "next/image"
import { Phone, Mail, MapPin, MessageCircle, CheckCircle, XCircle, ArrowRight, Clock, Users, Bot, Headphones, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface ContactFormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  inquiry: string
  message: string
}

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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.id]: e.target.value }))
  }

  const handleSelectChange = (value: string) => {
    setForm(prev => ({ ...prev, inquiry: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("https://digital-api-tef8.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error("Failed to send message")

      setSuccess("Message sent successfully! We'll get back to you within 2 minutes.")
      setForm({ firstName: "", lastName: "", email: "", phone: "", company: "", inquiry: "", message: "" })
    } catch (err) {
      setError("Failed to send message. Please try again or contact us directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50/30 via-white to-sky-50/20 text-gray-900">
      <Header />

      {/* Hero Section - Clean & Modern */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_70%)]" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-sky-100 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
              <span className="text-sky-600 font-semibold text-sm">24/7 AI Voice Agent Support</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Transform Your{" "}
              <span className="bg-gradient-to-r from-sky-500 to-sky-600 bg-clip-text text-transparent">
                Business Together
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Ready to elevate your customer experience with AI voice agents? Our experts are just a message away. 
              Let's discuss how we can help your business grow with 24/7 AI automation.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { icon: Users, value: "500+", label: "Businesses" },
                { icon: Bot, value: "2M+", label: "Conversations" },
                { icon: Clock, value: "24/7", label: "Support" }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-sky-100 rounded-full mb-3">
                      <Icon className="w-6 h-6 text-sky-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Contact Form & Info */}
      <section className="pb-20 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(249,115,22,0.06),transparent_50%)]" />
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">

            {/* Contact Form - Modern & Clean */}
            <Card className="border-2 border-sky-200/60 bg-gradient-to-br from-white via-sky-50/20 to-white shadow-xl shadow-sky-500/10 rounded-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/40 via-transparent to-transparent rounded-full blur-3xl" />
              <CardHeader className="p-8 border-b border-sky-100/50 relative z-10 bg-gradient-to-r from-sky-50/30 to-transparent">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a message
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll get back to you within 2 minutes
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 relative z-10">
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{success}</span>
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 mb-2 block">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={form.firstName}
                        onChange={handleChange}
                        className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mb-2 block">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={form.lastName}
                        onChange={handleChange}
                        className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                        Email <span className="text-sky-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
                        Phone <span className="text-sky-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700 mb-2 block">
                      Company
                    </Label>
                    <Input
                      id="company"
                      placeholder="Your Company Name"
                      value={form.company}
                      onChange={handleChange}
                      className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inquiry" className="text-sm font-medium text-gray-700 mb-2 block">
                      Inquiry Type <span className="text-sky-500">*</span>
                    </Label>
                    <Select value={form.inquiry} onValueChange={handleSelectChange} required>
                      <SelectTrigger className="h-11 bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500">
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">💼 Sales Inquiry</SelectItem>
                        <SelectItem value="support">🛠️ Technical Support</SelectItem>
                        <SelectItem value="partnership">🤝 Partnership</SelectItem>
                        <SelectItem value="demo">🎯 Request Demo</SelectItem>
                        <SelectItem value="other">💡 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700 mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your AI voice automation project and how we can help..."
                      className="min-h-[120px] bg-gray-50 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                    disabled={loading}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {loading ? "SENDING..." : "SEND MESSAGE"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information - Clean Cards */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Other ways to reach us</h3>
              
              {[
                {
                  icon: Mail,
                  title: "Email Us",
                  value: "hello@metic.ai",
                  subtitle: "We'll respond within 2 minutes",
                  action: "mailto:hello@metic.ai"
                },
                {
                  icon: Phone,
                  title: "Call Us",
                  value: "+91 95823 67843",
                  subtitle: "Available 24/7 for voice support",
                  action: "tel:+919582367843"
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.action}
                    className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                      <Icon className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-500 mb-1">{item.title}</div>
                      <div className="text-lg font-bold text-gray-900 mb-1">{item.value}</div>
                      <div className="text-sm text-gray-600">{item.subtitle}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                  </a>
                );
              })}

              {/* Office Locations */}
              <div className="space-y-3 pt-2">
                <h4 className="text-lg font-bold text-gray-900">Visit Our Offices</h4>
                
                {/* US Office */}
                <div className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all group">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                    <MapPin className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 mb-1">United States</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Grand Rapids, Michigan</div>
                    <div className="text-sm text-gray-600">300 Quail Ridge Dr NE, ADA, MI 49301</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                </div>

                {/* India Office */}
                <div className="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all group">
                  <div className="flex-shrink-0 w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-500 transition-colors">
                    <MapPin className="w-6 h-6 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500 mb-1">India</div>
                    <div className="text-lg font-bold text-gray-900 mb-1">Bangalore, Karnataka</div>
                    <div className="text-sm text-gray-600">Behind Manyata Tech Park, Hebbal, Bangalore 560077</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>

              {/* Business Hours */}
              <Card className="border border-gray-200 bg-gradient-to-br from-sky-50 to-white">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-sky-600" />
                    </div>
                    <h3 className="font-bold text-gray-900">Business Hours</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Weekend & Holidays</span>
                      <span className="font-semibold text-sky-600">AI Support 24/7</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sky-600">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                        <span className="text-xs font-semibold">AI Voice Agent Always Available</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Clean & Simple */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers about our AI voice automation platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "How quickly can I get started?",
                answer: "Most businesses are up and running within 5-7 days. We handle the entire setup process including integration with your existing systems."
              },
              {
                question: "What's included in support?",
                answer: "24/7 technical support, regular system updates, performance monitoring, and dedicated account management for enterprise clients."
              },
              {
                question: "Do you offer custom integrations?",
                answer: "Yes! We integrate with CRMs, help desk software, phone systems, and custom APIs. Our team handles all technical implementation."
              },
              {
                question: "Is there a free trial available?",
                answer: "Absolutely! We offer a 14-day free trial with full access to our AI voice platform and dedicated onboarding support."
              }
            ].map((faq, idx) => (
              <Card key={idx} className="border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
