"use client"
import { motion } from 'framer-motion'

const logos = [
  { name: "Microsoft", src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
  { name: "Google", src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Salesforce", src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
  { name: "Slack", src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "Shopify", src: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
  { name: "Stripe", src: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "HubSpot", src: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HubSpot_Logo.svg" },
]

export default function CustomerLogos() {
  return (
    <section className="py-12 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden relative">
      {/* Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />
      </div>
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 relative z-10"
        >
          <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
            Trusted by innovative companies worldwide
          </p>
        </motion.div>

        {/* Logo Marquee */}
        <div className="relative z-10">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-blue-700 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-700 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling Container */}
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-16 items-center"
              animate={{ x: [0, -1200] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              {/* Double the logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 h-8 w-32 flex items-center justify-center brightness-0 invert opacity-70 hover:opacity-100 transition-all duration-300"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20 relative z-10"
        >
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-sm text-blue-200">Businesses</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-3xl font-bold text-white">10M+</p>
            <p className="text-sm text-blue-200">Calls Handled</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-3xl font-bold text-white">50+</p>
            <p className="text-sm text-blue-200">Countries</p>
          </div>
          <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
            <p className="text-3xl font-bold text-white">99.9%</p>
            <p className="text-sm text-blue-200">Uptime</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
