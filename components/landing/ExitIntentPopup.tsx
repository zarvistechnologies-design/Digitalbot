"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem('exitPopupShown')
    if (shown) {
      setHasShown(true)
      return
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when mouse leaves toward top of page
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitPopupShown', 'true')
      }
    }

    // Add listener after a delay to avoid immediate triggers
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-100 to-violet-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-100 to-violet-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50"></div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Gift Icon */}
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                <Gift className="h-10 w-10 text-white" />
              </div>

              {/* Headline */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Wait! Don't Leave Empty-Handed
              </h3>

              {/* Subheadline */}
              <p className="text-gray-600 mb-6">
                Get <span className="font-bold text-orange-600">500 credits FREE</span> to test our AI voice platform. No credit card required!
              </p>

              {/* Urgency Banner */}
              <div className="bg-orange-50/60 border border-orange-200/40 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
                <Clock className="h-5 w-5 text-orange-600" />
                <span className="text-orange-800 font-medium">
                  Limited offer - Expires in 24 hours
                </span>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-600">
                <span className="flex items-center gap-1">✓ 500 free credits</span>
                <span className="flex items-center gap-1">✓ No credit card</span>
                <span className="flex items-center gap-1">✓ Cancel anytime</span>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Link 
                  href="/contact#contact-form"
                  className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-600 to-violet-600 text-white font-bold rounded-xl hover:from-orange-700 hover:to-violet-700 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:scale-[1.02] btn-glow"
                >
                  Claim My 500 Free Credits
                  <ArrowRight className="h-5 w-5" />
                </Link>
                
                <button
                  onClick={handleClose}
                  className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
                >
                  No thanks, I don't want free Credits
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
