"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

const botResponses: Record<string, string> = {
  "pricing": "Our pricing starts at just $0.05/minute with 500 free minutes to get started. No credit card required! Would you like me to explain our plans in detail?",
  "demo": "I'd love to show you a demo! You can try our live AI voice demo by clicking the microphone button in the bottom right, or I can arrange a personalized demo with our team. Which would you prefer?",
  "features": "DigitalBot offers: 50+ languages, <750ms latency, 24/7 availability, CRM integrations, HIPAA compliance, custom voice cloning, and real-time analytics. What feature interests you most?",
  "integration": "We integrate with 50+ platforms including Salesforce, HubSpot, Calendly, Google Calendar, Zapier, and more. We also have a full REST API for custom integrations!",
  "support": "We offer 24/7 premium support for all customers. You can reach us via chat, email, or phone. Enterprise customers get a dedicated success manager.",
  "default": "Thanks for reaching out! I can help with pricing, demos, features, integrations, or support questions. What would you like to know about DigitalBot?"
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! 👋 I'm DigitalBot's assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pay')) {
      return botResponses.pricing
    }
    if (lowerMessage.includes('demo') || lowerMessage.includes('try') || lowerMessage.includes('test')) {
      return botResponses.demo
    }
    if (lowerMessage.includes('feature') || lowerMessage.includes('can') || lowerMessage.includes('do')) {
      return botResponses.features
    }
    if (lowerMessage.includes('integrat') || lowerMessage.includes('connect') || lowerMessage.includes('crm')) {
      return botResponses.integration
    }
    if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('contact')) {
      return botResponses.support
    }
    
    return botResponses.default
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center hover:scale-110 transition-transform"
          >
            <MessageCircle className="h-6 w-6 text-white" />
            
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-[360px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">DigitalBot Support</p>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-indigo-100 text-xs">Online now</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${message.isBot ? '' : 'flex-row-reverse'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot 
                      ? 'bg-indigo-100' 
                      : 'bg-indigo-100'
                  }`}>
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <User className="h-4 w-4 text-indigo-600" />
                    )}
                  </div>
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    message.isBot 
                      ? 'bg-white border border-gray-200 rounded-tl-none' 
                      : 'bg-indigo-500 text-white rounded-tr-none'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 bg-white border-t border-gray-100">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['Pricing', 'Demo', 'Features', 'Support'].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => { setInput(quick); handleSend(); }}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 whitespace-nowrap transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-indigo-500 hover:bg-violet-600 disabled:bg-gray-300 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Powered by */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400 flex items-center justify-center gap-1">
                <Sparkles className="h-3 w-3" /> Powered by DigitalBot AI
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
