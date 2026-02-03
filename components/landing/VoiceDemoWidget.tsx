"use client"
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Phone, PhoneOff, Sparkles, Volume2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Same Vapi credentials used on the hero page
const VAPI_PUBLIC_KEY = '00119fad-8530-413f-9699-e47cada57939'
const VAPI_ASSISTANT_ID = '9ca19724-1f6c-48d1-8c62-a6107d585592'

export default function VoiceDemoWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [vapiLoaded, setVapiLoaded] = useState(false)
  const [transcript, setTranscript] = useState("Click the button to start talking with our AI assistant!")
  const [callStatus, setCallStatus] = useState('')
  const [callDuration, setCallDuration] = useState(0)
  const [volumeLevel, setVolumeLevel] = useState(0)
  const callTimerRef = useRef<NodeJS.Timeout | null>(null)
  const vapiRef = useRef<any>(null)
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Sound wave animation
  const [soundBars] = useState(() => Array.from({ length: 8 }, () => Math.random()))

  // Initialize Vapi on component mount (ready before modal opens)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Don't reinitialize if already loaded
    if (vapiRef.current) return

    let vapiInstance: any = null

    const initVapi = async () => {
      try {
        const VapiModule = await import('@vapi-ai/web')
        vapiInstance = new VapiModule.default(VAPI_PUBLIC_KEY)
        vapiRef.current = vapiInstance
        setVapiLoaded(true)

        vapiInstance.on('call-start', () => {
          setIsCallActive(true)
          setIsConnecting(false)
          setTranscript("Connected! Listening for your voice...")
          setCallStatus('Call active - Listening')
          setCallDuration(0)
          callTimerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1)
          }, 1000)
        })

        vapiInstance.on('call-end', () => {
          setIsCallActive(false)
          setIsSpeaking(false)
          setIsConnecting(false)
          setTranscript("Call ended. Click to start again!")
          setCallStatus('Call ended')
          if (callTimerRef.current) {
            clearInterval(callTimerRef.current)
            callTimerRef.current = null
          }
          if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current)
            volumeIntervalRef.current = null
          }
          setCallDuration(0)
          setVolumeLevel(0)
        })

        vapiInstance.on('speech-start', () => {
          setIsSpeaking(true)
          setCallStatus('Assistant speaking...')
          // Simulate volume fluctuation
          volumeIntervalRef.current = setInterval(() => {
            setVolumeLevel(Math.random() * 100)
          }, 100)
        })
        
        vapiInstance.on('speech-end', () => {
          setIsSpeaking(false)
          setCallStatus('Call active - Listening')
          setVolumeLevel(0)
          if (volumeIntervalRef.current) {
            clearInterval(volumeIntervalRef.current)
            volumeIntervalRef.current = null
          }
        })

        vapiInstance.on('message', (message: any) => {
          if (message.type === 'transcript' && message.transcriptType === 'final') {
            setTranscript(message.transcript)
          } else if (message.type === 'end-of-speech') {
            setCallStatus('Assistant is processing...')
          }
        })

        vapiInstance.on('error', (error: any) => {
          setCallStatus(`Error: ${error.message || 'Unknown error'}`)
          setIsCallActive(false)
          setIsConnecting(false)
        })
      } catch (error) {
        setCallStatus('Failed to initialize voice assistant')
      }
    }

    initVapi()

    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current)
      if (volumeIntervalRef.current) clearInterval(volumeIntervalRef.current)
      if (vapiRef.current) {
        try {
          vapiRef.current.stop()
        } catch (e) {
          // Silent error
        }
      }
    }
  }, [])

  const startCall = async () => {
    if (!vapiRef.current || !vapiLoaded) {
      setCallStatus('Initializing...')
      // Try again after a short delay
      setTimeout(() => {
        if (vapiRef.current && vapiLoaded) {
          startCall()
        } else {
          setCallStatus('Please wait and try again...')
        }
      }, 1000)
      return
    }

    try {
      setCallStatus('Requesting microphone...')
      // Request microphone permissions explicitly
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (err) {
        setCallStatus('Microphone permission denied')
        setTranscript('Please allow microphone access to use the voice assistant')
        alert('Please allow microphone access to use the voice assistant')
        return
      }

      setIsConnecting(true)
      setCallStatus('Starting call...')
      setTranscript("Connecting to AI assistant...")
      
      await vapiRef.current.start(VAPI_ASSISTANT_ID)
    } catch (error: any) {
      const errorMsg = error?.message || error?.error?.message || 'Unknown error'
      setCallStatus(`Failed: ${errorMsg}`)
      setIsConnecting(false)
      setTranscript(`Failed to start call: ${errorMsg}. Please try again.`)
    }
  }

  const endCall = () => {
    if (vapiRef.current) {
      try {
        vapiRef.current.stop()
        setCallStatus('Stopping call...')
      } catch (error) {
        // Silent error
      }
    }
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
      volumeIntervalRef.current = null
    }
    setIsCallActive(false)
    setIsSpeaking(false)
    setIsConnecting(false)
    setVolumeLevel(0)
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current)
      callTimerRef.current = null
    }
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
