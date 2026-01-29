"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Globe, Clock, CheckCircle, ArrowRight } from 'lucide-react'

// Simulated call data
const callTypes = [
  { type: "Appointment Booking", industry: "Healthcare", language: "English", flag: "🇺🇸", duration: "2:34" },
  { type: "Lead Qualification", industry: "Real Estate", language: "Spanish", flag: "🇪🇸", duration: "3:12" },
  { type: "Customer Support", industry: "E-commerce", language: "French", flag: "🇫🇷", duration: "1:45" },
  { type: "Order Status", industry: "Retail", language: "German", flag: "🇩🇪", duration: "1:23" },
  { type: "Reservation", industry: "Restaurant", language: "Italian", flag: "🇮🇹", duration: "2:01" },
  { type: "Appointment Reminder", industry: "Dental", language: "Portuguese", flag: "🇧🇷", duration: "0:45" },
  { type: "Sales Follow-up", industry: "SaaS", language: "English", flag: "🇬🇧", duration: "4:12" },
  { type: "Support Ticket", industry: "Tech", language: "Japanese", flag: "🇯🇵", duration: "3:34" },
  { type: "Booking Confirmation", industry: "Hotel", language: "Mandarin", flag: "🇨🇳", duration: "1:56" },
  { type: "Payment Inquiry", industry: "Finance", language: "Arabic", flag: "🇦🇪", duration: "2:23" },
]

interface Call {
  id: number
  type: string
  industry: string
  language: string
  flag: string
  duration: string
  timestamp: string
  status: 'active' | 'completed'
}

export default function LiveCallFeed() {
  const [calls, setCalls] = useState<Call[]>([])
  const [totalCalls, setTotalCalls] = useState(10847623)

  useEffect(() => {
    // Generate initial calls
    const initialCalls = Array.from({ length: 5 }, (_, i) => generateCall(i))
    setCalls(initialCalls)

    // Add new calls periodically
    const interval = setInterval(() => {
      setCalls(prev => {
        const newCall = generateCall(Date.now())
        return [newCall, ...prev.slice(0, 4)]
      })
      setTotalCalls(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  function generateCall(id: number): Call {
    const template = callTypes[Math.floor(Math.random() * callTypes.length)]
    const secondsAgo = Math.floor(Math.random() * 30)
    return {
      id,
      ...template,
      timestamp: secondsAgo === 0 ? 'Just now' : `${secondsAgo}s ago`,
      status: Math.random() > 0.3 ? 'completed' : 'active'
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Live Activity
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Calls Happening <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Right Now</span>
            </h2>
            
            <p className="text-blue-100 text-lg mb-8">
              Watch real-time AI conversations powering businesses across 50+ countries. Every second, DigitalBot handles hundreds of calls simultaneously.
            </p>

            {/* Live Counter */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-8">
              <p className="text-blue-200 text-sm font-medium mb-2">Total Calls Handled</p>
              <div className="text-4xl md:text-5xl font-black text-white tabular-nums">
                {totalCalls.toLocaleString()}
              </div>
              <p className="text-blue-200 text-sm mt-2">And counting...</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-medium">50+ Languages</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-white font-medium">24/7 Active</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Live Feed */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-700">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-white font-semibold">Live Call Feed</span>
                </div>
                <span className="text-gray-400 text-sm">Real-time</span>
              </div>

              {/* Call List */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {calls.map((call) => (
                    <motion.div
                      key={call.id}
                      layout
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            call.status === 'active' 
                              ? 'bg-green-500/20' 
                              : 'bg-blue-500/20'
                          }`}>
                            {call.status === 'active' ? (
                              <Phone className="h-5 w-5 text-green-400 animate-pulse" />
                            ) : (
                              <CheckCircle className="h-5 w-5 text-blue-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{call.type}</p>
                            <p className="text-gray-400 text-xs">{call.industry}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            <span>{call.flag}</span>
                            <span className="text-gray-300">{call.language}</span>
                          </div>
                          <p className="text-gray-500 text-xs">{call.timestamp}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Showing latest 5 calls</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
