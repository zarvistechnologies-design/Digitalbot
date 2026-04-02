"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (500px)
      setIsVisible(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-2xl shadow-black/10"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left - Text */}
              <div className="text-center sm:text-left">
                <p className="text-gray-900 font-semibold text-sm sm:text-base">
                  Ready to transform your business calls?
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Get 500 free minutes • No credit card required
                </p>
              </div>

              {/* Right - CTA */}
              <div className="flex items-center gap-3">
                <Link
                  href="/contact#contact-form"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-105 text-sm whitespace-nowrap btn-glow"
                >
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/contact#contact-form"
                  className="hidden sm:inline-flex items-center px-5 py-3 text-gray-700 font-medium hover:text-orange-600 transition-colors text-sm whitespace-nowrap"
                >
                  Book Demo
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
