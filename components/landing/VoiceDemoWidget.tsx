"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Phone, PhoneOff, X, Volume2, Sparkles } from 'lucide-react'

export default function VoiceDemoWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("Click the button to start talking with our AI assistant!")
  const [callDuration, setCallDuration] = useState(0)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const vapiRef = useRef<any>(null)

  // Sound wave animation
  const [soundBars] = useState(() => Array.from({ length: 8 }, () => Math.random()))

  useEffect(() => {
    // Load Vapi SDK
    const loadVapi = async () => {
      try {
        const Vapi = (await import("@vapi-ai/web")).default
        vapiRef.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "")
        
        vapiRef.current.on("call-start", () => {
          setIsCallActive(true)
          setIsConnecting(false)
          setTranscript("Connected! Start speaking...")
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1)
          }, 1000)
        })
        
        vapiRef.current.on("call-end", () => {
          setIsCallActive(false)
          setIsSpeaking(false)
          setTranscript("Call ended. Click to start again!")
          if (callTimerRef.current) clearInterval(callTimerRef.current)
          setCallDuration(0)
        })
        
        vapiRef.current.on("speech-start", () => setIsSpeaking(true))
        vapiRef.current.on("speech-end", () => setIsSpeaking(false))
        
        vapiRef.current.on("message", (msg: any) => {
          if (msg.type === "transcript" && msg.transcriptType === "final") {
            setTranscript(msg.transcript)
          }
        })
      } catch (error) {
        console.log("Vapi not available, using demo mode")
      }
    }
    
    if (isOpen) loadVapi()
    
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
    }
  }, [isOpen])

  const startCall = async () => {
    setIsConnecting(true)
    setTranscript("Connecting to AI assistant...")
    
    if (vapiRef.current) {
      try {
        await vapiRef.current.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || "")
      } catch (error) {
        // Demo mode fallback
        setTimeout(() => {
          setIsCallActive(true)
          setIsConnecting(false)
          setTranscript("Hi! I'm DigitalBot. I can help you with appointment scheduling, customer support, or lead generation. What would you like to know?")
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1)
          }, 1000)
          
          // Simulate AI speaking
          setTimeout(() => setIsSpeaking(true), 500)
          setTimeout(() => setIsSpeaking(false), 3000)
        }, 1500)
      }
    } else {
      // Demo mode
      setTimeout(() => {
        setIsCallActive(true)
        setIsConnecting(false)
        setTranscript("Hi! I'm DigitalBot. I can help you with appointment scheduling, customer support, or lead generation. What would you like to know?")
        callTimerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1)
        }, 1000)
        setTimeout(() => setIsSpeaking(true), 500)
        setTimeout(() => setIsSpeaking(false), 3000)
      }, 1500)
    }
  }

  const endCall = () => {
    if (vapiRef.current) {
      vapiRef.current.stop()
    }
    setIsCallActive(false)
    setIsSpeaking(false)
    if (callTimerRef.current) clearInterval(callTimerRef.current)
    setCallDuration(0)
    setTranscript("Call ended. Click to start again!")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 transition-transform group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: [
            "0 0 20px rgba(59, 130, 246, 0.4)",
            "0 0 40px rgba(59, 130, 246, 0.6)",
            "0 0 20px rgba(59, 130, 246, 0.4)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Mic className="h-7 w-7 text-white" />
        
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-20"></span>
        <span className="absolute -inset-1 rounded-full border-2 border-blue-400/50 animate-pulse"></span>
        
        {/* Label */}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Try AI Voice Demo
        </span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => !isCallActive && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-gradient-to-br from-slate-900 via-blue-900/90 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-blue-500/30"
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => { endCall(); setIsOpen(false); }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 text-sm font-medium">Live AI Demo</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Talk to DigitalBot</h3>
                <p className="text-gray-400 text-sm">Experience our AI voice assistant in real-time</p>
              </div>

              {/* Voice Visualizer */}
              <div className="relative h-32 flex items-center justify-center mb-8">
                {/* Outer glow ring */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isCallActive ? 'bg-blue-500/10' : 'bg-gray-800/50'
                }`}></div>
                
                {/* Sound bars */}
                <div className="flex items-center gap-1 h-16">
                  {soundBars.map((height, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 rounded-full ${isCallActive ? 'bg-gradient-to-t from-blue-500 to-cyan-400' : 'bg-gray-600'}`}
                      animate={{
                        height: isSpeaking 
                          ? [16, 32 + height * 32, 16] 
                          : isCallActive 
                            ? [12, 20, 12]
                            : 16
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                    />
                  ))}
                </div>

                {/* Status indicator */}
                {isConnecting && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Transcript */}
              <div className="bg-black/30 rounded-2xl p-4 mb-6 min-h-[80px]">
                <div className="flex items-start gap-2">
                  <Volume2 className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300 text-sm leading-relaxed">{transcript}</p>
                </div>
              </div>

              {/* Call Duration */}
              {isCallActive && (
                <div className="text-center mb-4">
                  <span className="text-blue-400 font-mono text-lg">{formatTime(callDuration)}</span>
                </div>
              )}

              {/* Call Button */}
              <motion.button
                onClick={isCallActive ? endCall : startCall}
                disabled={isConnecting}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  isCallActive 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
                } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: isConnecting ? 1 : 1.02 }}
                whileTap={{ scale: isConnecting ? 1 : 0.98 }}
              >
                {isConnecting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : isCallActive ? (
                  <>
                    <PhoneOff className="h-5 w-5" />
                    End Call
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    Start Voice Demo
                  </>
                )}
              </motion.button>

              {/* Features */}
              <div className="flex justify-center gap-6 mt-6 text-xs text-gray-500">
                <span>🌍 50+ Languages</span>
                <span>⚡ Real-time</span>
                <span>🔒 Secure</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
