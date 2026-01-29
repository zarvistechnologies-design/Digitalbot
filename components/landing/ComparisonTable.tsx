"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, X, HelpCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const competitors = [
  {
    name: "DigitalBot",
    isUs: true,
    logo: "🤖",
    features: {
      pricing: "$0.05/min",
      languages: "50+",
      latency: "<500ms",
      uptime: "99.9%",
      freeMinutes: "500",
      customVoice: true,
      apiAccess: true,
      crm: true,
      hipaa: true,
      whiteLabel: true,
      support: "24/7 Premium",
      analytics: "Real-time + AI Insights",
    }
  },
  {
    name: "Vapi.ai",
    isUs: false,
    logo: "V",
    features: {
      pricing: "$0.05/min",
      languages: "40+",
      latency: "<600ms",
      uptime: "99.5%",
      freeMinutes: "100",
      customVoice: true,
      apiAccess: true,
      crm: false,
      hipaa: true,
      whiteLabel: false,
      support: "Business Hours",
      analytics: "Basic",
    }
  },
  {
    name: "Bland.ai",
    isUs: false,
    logo: "B",
    features: {
      pricing: "$0.07/min",
      languages: "30+",
      latency: "<700ms",
      uptime: "99%",
      freeMinutes: "0",
      customVoice: true,
      apiAccess: true,
      crm: true,
      hipaa: false,
      whiteLabel: true,
      support: "Email Only",
      analytics: "Standard",
    }
  },
  {
    name: "Twilio Voice",
    isUs: false,
    logo: "T",
    features: {
      pricing: "$0.014/min + Dev",
      languages: "20+",
      latency: "<1000ms",
      uptime: "99.95%",
      freeMinutes: "$15 credit",
      customVoice: false,
      apiAccess: true,
      crm: false,
      hipaa: true,
      whiteLabel: true,
      support: "Paid Plans",
      analytics: "Basic Logs",
    }
  }
]

const featureLabels: Record<string, string> = {
  pricing: "Pricing",
  languages: "Languages",
  latency: "Response Time",
  uptime: "Uptime SLA",
  freeMinutes: "Free Trial",
  customVoice: "Custom Voice Clone",
  apiAccess: "API Access",
  crm: "CRM Integration",
  hipaa: "HIPAA Compliant",
  whiteLabel: "White Label",
  support: "Support",
  analytics: "Analytics",
}

export default function ComparisonTable() {
  const [showAll, setShowAll] = useState(false)

  const displayFeatures = showAll 
    ? Object.keys(featureLabels) 
    : Object.keys(featureLabels).slice(0, 7)

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
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-semibold mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            See How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Stack Up</span>
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Compare DigitalBot with other AI voice platforms and see why businesses choose us
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        >
          {/* Header Row */}
          <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
            <div className="p-4 font-semibold text-gray-700">Features</div>
            {competitors.map((comp) => (
              <div 
                key={comp.name}
                className={`p-4 text-center ${comp.isUs ? 'bg-blue-50' : ''}`}
              >
                <div className={`inline-flex items-center gap-2 font-bold ${comp.isUs ? 'text-blue-600' : 'text-gray-700'}`}>
                  <span className="text-xl">{comp.logo}</span>
                  {comp.name}
                  {comp.isUs && (
                    <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-bold">
                      Best
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {displayFeatures.map((featureKey, index) => (
            <div 
              key={featureKey}
              className={`grid grid-cols-5 border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
            >
              <div className="p-4 flex items-center gap-2 text-gray-700 font-medium">
                {featureLabels[featureKey]}
              </div>
              {competitors.map((comp) => {
                const value = comp.features[featureKey as keyof typeof comp.features]
                return (
                  <div 
                    key={`${comp.name}-${featureKey}`}
                    className={`p-4 text-center ${comp.isUs ? 'bg-blue-50/50' : ''}`}
                  >
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 mx-auto" />
                      )
                    ) : (
                      <span className={`${comp.isUs ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                        {value}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </motion.div>

        {/* Show More Button */}
        {!showAll && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="text-white hover:text-blue-200 font-medium text-sm flex items-center gap-1 mx-auto"
            >
              Show all features <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Free Trial - 500 Minutes Free
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">No credit card required</p>
        </motion.div>
      </div>
    </section>
  )
}
