"use client"

import { Award, Building2, CheckCircle2, CreditCard, Shield } from "lucide-react"

export function CTA() {
  const stats = [
    { number: "10K+", label: "Businesses" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Available" },
    { number: "5M+", label: "Calls" }
  ]

  const trustItems = [
    { icon: CheckCircle2, text: "SOC 2 Certified • GDPR Compliant" },
    { icon: Building2, text: "Trusted by Fortune 500 Companies" },
    { icon: CreditCard, text: "No credit card required • Cancel anytime" }
  ]

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-[#fafbff] via-white to-white">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-100/40 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card bg-orange-50/60 border-orange-200/40 px-4 py-2 rounded-full mb-6">
            <Award className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">Trusted Worldwide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight glass-heading">
            Powering Conversations for the
            <span className="block bg-gradient-to-r from-orange-500 to-orange-500 bg-clip-text text-transparent">
              World's Leading Brands
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-first, telco-grade platform ensures unmatched reliability, security, and performance at scale.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Image */}
          <div className="relative flex items-center justify-center lg:justify-start">
            {/* orange background shape */}
            <div className="absolute bottom-0 left-1/2 lg:left-[40%] -translate-x-1/2 w-[75%] h-[55%] bg-gradient-to-t from-orange-200/80 via-orange-100/60 to-orange-50/30 rounded-[50px]"></div>
            <div className="relative w-full max-w-md lg:max-w-none">
              <img
                src="https://res.cloudinary.com/dvwmbidka/image/upload/e_background_removal/stat_heubsl"
                alt="Global AI Platform Statistics"
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          {/* Right Side - Stats Card */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-orange-100/20 p-8 w-full max-w-md border border-white/40 hover:shadow-2xl transition-shadow duration-500">
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-500 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-orange-500">Trusted Platform</span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.map((stat, idx) => (
                  <div 
                    key={idx}
                    className="group p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-orange-100/30 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/50 transition-all duration-300 text-center cursor-default"
                  >
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Trust Items */}
              <div className="space-y-3">
                {trustItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 group">
                    <item.icon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


