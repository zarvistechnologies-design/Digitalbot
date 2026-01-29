"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
<<<<<<< HEAD
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowRight, 
  Award, 
  Building2, 
  CheckCircle2, 
  Globe, 
  Heart, 
  Lightbulb, 
  MapPin,
  Newspaper,
  Quote,
  Rocket, 
  Shield, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Users, 
  Zap 
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

// Enhanced Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0
  }
=======
import { ArrowRight, Award, BarChart3, Building2, CheckCircle, Globe, Heart, Lightbulb, Phone, Rocket, Shield, Sparkles, Star, Target, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

// Animated counter component
function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2000 }: { end: number; suffix?: string; prefix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Mini Bar Chart Component
function MiniBarChart({ data, colors }: { data: number[]; colors: string[] }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-3 rounded-t-sm ${colors[i % colors.length]} transition-all duration-500`}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  )
>>>>>>> 138b57ba3cb1a461051c9b31e7e6358ebc30b97a
}

const fadeInDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { 
    opacity: 1, 
    y: 0
  }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0
  }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0
  }
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}

const scaleOnHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05
  }
}

const stats = [
  { number: "500+", label: "Businesses Served", icon: Building2 },
  { number: "50+", label: "Countries Worldwide", icon: Globe },
  { number: "2M+", label: "Conversations Daily", icon: Zap },
  { number: "99.9%", label: "Uptime Guarantee", icon: Award }
]

const values = [
  {
    icon: Target,
<<<<<<< HEAD
    title: "Customer First",
    description: "We obsess over our customers' success. Every decision starts with understanding their needs and delivering exceptional value.",
    gradient: "from-blue-500 to-blue-500"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We push boundaries and embrace new technologies to create groundbreaking AI voice solutions that redefine what's possible.",
    gradient: "from-purple-500 to-pink-500"
=======
    title: "Customer-Centric",
    description: "Every feature we build solves real customer problems and drives measurable business value.",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We push the boundaries of AI voice technology to deliver cutting-edge experiences.",
    gradient: "from-amber-500 to-orange-500",
    bgColor: "bg-amber-50"
>>>>>>> 138b57ba3cb1a461051c9b31e7e6358ebc30b97a
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We protect customer data with enterprise-grade security and transparent practices. Your trust is our foundation.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Heart,
    title: "Empathy",
    description: "We build AI that understands emotions and responds with genuine care, creating meaningful human-machine connections.",
    gradient: "from-red-500 to-pink-500"
  },
  {
    icon: Rocket,
    title: "Speed & Scale",
    description: "We move fast, iterate quickly, and scale globally. Agility and growth mindset drive everything we do.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Sparkles,
    title: "Excellence",
<<<<<<< HEAD
    description: "We set the bar high and constantly raise it. Good enough isn't in our vocabulary—we deliver exceptional.",
    gradient: "from-yellow-500 to-blue-500"
  }
=======
    description: "We maintain the highest standards in accuracy, security, and performance.",
    gradient: "from-emerald-500 to-teal-500",
    bgColor: "bg-emerald-50"
  },
  {
    icon: Heart,
    title: "Collaboration",
    description: "We believe in the power of human-AI collaboration to transform businesses.",
    gradient: "from-rose-500 to-pink-500",
    bgColor: "bg-rose-50"
  },
>>>>>>> 138b57ba3cb1a461051c9b31e7e6358ebc30b97a
]

const founders = [
  {
<<<<<<< HEAD
    name: "Sarah Chen",
    role: "Co-Founder & CEO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    quote: "We're not just building AI voice assistants—we're creating the future of human-business communication.",
    bio: "Former VP of AI at Google, 15+ years in conversational AI"
  },
  {
    name: "Michael Rodriguez",
    role: "Co-Founder & CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    quote: "Technology should amplify human capabilities, not replace them. That's our north star.",
    bio: "Ex-Amazon Alexa Lead, MIT AI Lab Researcher"
  }
]

const press = [
  {
    logo: "TechCrunch",
    title: "DigitalBot.ai Raises $10M to Revolutionize Voice AI",
    publication: "TechCrunch",
    date: "January 2025",
    url: "#"
  },
  {
    logo: "Forbes",
    title: "The Future of Customer Service: AI Voice Agents",
    publication: "Forbes",
    date: "December 2024",
    url: "#"
  },
  {
    logo: "Wired",
    title: "How DigitalBot.ai is Making Voice AI Accessible",
    publication: "Wired",
    date: "November 2024",
    url: "#"
  }
]

const locations = [
  { city: "San Francisco", country: "USA", type: "HQ", icon: "🏢" },
  { city: "London", country: "UK", type: "Office", icon: "🏙️" },
  { city: "Singapore", country: "SG", type: "Office", icon: "🌆" },
  { city: "Remote", country: "Global", type: "Team", icon: "🌍" }
=======
    year: "2024 Q1",
    title: "Founded DigitalBot.ai",
    description: "Started with a vision to democratize AI voice technology",
    icon: Building2,
    color: "bg-blue-500"
  },
  {
    year: "2024 Q2",
    title: "First 100 Customers",
    description: "Reached milestone serving 100+ businesses globally",
    icon: Users,
    color: "bg-emerald-500"
  },
  {
    year: "2024 Q3",
    title: "Platform Launch",
    description: "Multi-language support with analytics dashboard",
    icon: Globe,
    color: "bg-violet-500"
  },
  {
    year: "2024 Q4",
    title: "1M+ Conversations",
    description: "Processed over 1 million voice conversations",
    icon: Zap,
    color: "bg-amber-500"
  },
  {
    year: "2025",
    title: "Rapid Growth",
    description: "500+ businesses, expanding to new markets",
    icon: Rocket,
    color: "bg-rose-500"
  },
]

const teamStats = [
  { label: "Team Members", value: 50, suffix: "+", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
  { label: "Countries", value: 25, suffix: "+", icon: Globe, color: "text-emerald-600", bgColor: "bg-emerald-50" },
  { label: "Years Experience", value: 100, suffix: "+", icon: Award, color: "text-violet-600", bgColor: "bg-violet-50" },
  { label: "Patents Filed", value: 12, suffix: "", icon: Lightbulb, color: "text-amber-600", bgColor: "bg-amber-50" },
>>>>>>> 138b57ba3cb1a461051c9b31e7e6358ebc30b97a
]

export default function About() {
  return (
    <>
      <Header />
<<<<<<< HEAD
      
      <main className="min-h-screen bg-white text-gray-900 overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
          {/* Hero Background Image */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
            <div className="absolute inset-0 opacity-40">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1769347227/Gemini_Generated_Image_4ec9xe4ec9xe4ec9_v9os9q.png"
                alt="Global Network Connections"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Animated Gradient Orbs */}
            <motion.div
              className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-cyan-400/20 rounded-full blur-3xl"
              animate={{
                x: [0, 30, 0],
                y: [0, 20, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-500/20 rounded-full blur-3xl"
              animate={{
                x: [0, -30, 0],
                y: [0, -20, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center"
            >
              <motion.div variants={fadeInDown} className="mb-4 md:mb-6">
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-400 text-white border-none px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium shadow-lg shadow-blue-500/30">
                  ✨ About DigitalBot.ai
                </Badge>
              </motion.div>

              <motion.h1 
                variants={fadeInUp}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight px-4"
              >
                We're Building the{" "}
                <motion.span 
                  className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent inline-block"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Future of Voice AI
                </motion.span>
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8 md:mb-12 px-4 leading-relaxed"
              >
                Empowering businesses worldwide with intelligent AI voice assistants that understand, 
                engage, and deliver exceptional customer experiences—24/7, in any language.
              </motion.p>

              {/* Stats Grid */}
              <motion.div 
                variants={staggerContainer}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-5xl mx-auto px-4"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInScale}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      boxShadow: index % 2 === 0 ? "0 20px 40px -12px rgba(56, 189, 248, 0.3)" : "0 20px 40px -12px rgba(147, 51, 234, 0.3)"
                    }}
                    className="group bg-gradient-to-br from-white to-gray-50 border border-blue-500 rounded-2xl p-4 md:p-6 hover:border-blue-500 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {/* Hover Gradient Overlay */}
                    <div className={`absolute inset-0 ${index % 2 === 0 ? 'bg-gradient-to-br from-cyan-400/5 to-sky-400/5' : 'bg-gradient-to-br from-purple-500/5 to-purple-400/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <motion.div
                      animate={{
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative z-10"
                    >
                      <stat.icon className={`w-8 h-8 md:w-10 md:h-10 mb-3 mx-auto transition-colors ${index % 2 === 0 ? 'text-blue-500 group-hover:text-blue-600' : 'text-purple-500 group-hover:text-purple-600'}`} />
                      <div className={`text-2xl md:text-3xl font-bold mb-1 ${index % 2 === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-400' : 'bg-gradient-to-r from-purple-500 to-purple-400'} bg-clip-text text-transparent`}>
                        {stat.number}
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(56, 189, 248, 0.15) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="text-center"
            >
              <motion.h2 
                variants={fadeInDown}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8"
              >
                Our{" "}
                <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                  Mission
                </span>
              </motion.h2>
              
              <motion.div 
                variants={fadeInScale}
                whileHover={{ scale: 1.02 }}
                className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-200/50 overflow-hidden group"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative z-10">
                  <motion.p 
                    variants={fadeInUp}
                    className="text-xl sm:text-2xl md:text-3xl text-gray-900 font-semibold leading-relaxed mb-4 md:mb-6"
                  >
                    To democratize AI voice technology and make intelligent, empathetic voice assistants 
                    accessible to every business—regardless of size or technical expertise.
                  </motion.p>
                  
                  <motion.div 
                    variants={fadeInUp}
                    className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4 md:mb-6 rounded-full"
                  />
                  
                  <motion.p 
                    variants={fadeInUp}
                    className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto"
                  >
                    We envision a world where every customer interaction is personalized, efficient, and delightful. 
                    Where businesses can scale their customer service infinitely without sacrificing quality. 
                    Where AI amplifies human capabilities rather than replacing them.
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Values */}
        <section className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-12">
                <motion.h2 
                  variants={fadeInDown}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4"
                >
                  Our{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                    Core Values
                  </span>
                </motion.h2>
                <motion.p 
                  variants={fadeInUp}
                  className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4"
                >
                  The principles that guide everything we build and every decision we make
                </motion.p>
              </motion.div>

              <motion.div 
                variants={staggerContainer}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInScale}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                    }}
                    className="group"
                  >
                    <Card className="bg-white border-blue-500 hover:border-blue-500 transition-all duration-500 h-full overflow-hidden relative">
                      {/* Background Gradient on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      
                      <CardContent className="p-6 md:p-8 relative z-10">
                        <motion.div 
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        >
                          <value.icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        </motion.div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-gray-900 transition-colors group-hover:text-blue-500">
                          {value.title}
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>







        {/* Careers CTA */}
        <section className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-200 rounded-3xl p-6 md:p-10 lg:p-12 text-center overflow-hidden group"
            >
              {/* Animated Background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10">
                <motion.div 
                  variants={fadeInDown}
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Users className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mx-auto mb-4 md:mb-6" />
                </motion.div>
                
                <motion.h2 
                  variants={fadeInUp}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6"
                >
                  Join Our{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
                    Team
                  </span>
                </motion.h2>
                
                <motion.p 
                  variants={fadeInUp}
                  className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
                >
                  We're looking for passionate innovators, builders, and dreamers to help us shape 
                  the future of AI voice technology. Are you ready to make an impact?
                </motion.p>

                <motion.div 
                  variants={fadeInUp} 
                  className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
                >
                  <Link href="/careers">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white border-none px-6 py-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-shadow">
                        View Open Positions
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/contact">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-900 hover:bg-gray-100 px-6 py-6">
                        Get In Touch
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-2xl"
            >
              {/* Animated Gradient Background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{ backgroundSize: '200% 200%' }}
              />
              
              {/* Animated Pattern Overlay */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Floating Orbs */}
              <motion.div
                className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                animate={{
                  x: [0, -40, 0],
                  y: [0, -20, 0],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10 p-6 md:p-10 lg:p-12 text-center">
                <motion.div 
                  variants={fadeInDown}
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white mx-auto mb-4 md:mb-6 drop-shadow-lg" />
                </motion.div>

                <motion.h2 
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight px-4"
                >
                  Ready to Transform Your Business?
                </motion.h2>

                <motion.p 
                  variants={fadeInUp}
                  className="text-base sm:text-lg md:text-xl text-white/95 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-4"
                >
                  Join 500+ businesses using DigitalBot.ai to deliver exceptional customer experiences. 
                  Start your free trial today—no credit card required.
                </motion.p>

                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center"
                >
                  <Link href="/signup">
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" className="bg-black hover:bg-gray-900 text-white px-6 md:px-8 py-6 shadow-xl hover:shadow-2xl transition-shadow">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/contact">
                    <motion.div 
                      whileHover={{ scale: 1.05, y: -2 }} 
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-6 md:px-8 py-6 transition-all">
                        Schedule Demo
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
=======

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-28 pb-20 px-4 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-[120px]" />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-32 left-[10%] w-4 h-4 bg-blue-400 rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute top-48 right-[15%] w-3 h-3 bg-violet-400 rounded-full opacity-50 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
            <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-emerald-400 rounded-full opacity-40 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute top-1/3 right-[10%] w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-ping" style={{ animationDuration: '2s' }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">Home</Link></li>
                <li className="text-gray-400">/</li>
                <li className="text-blue-600 font-semibold">About</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-bold text-blue-600">About Our Company</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  Building the Future of
                  <span className="block text-blue-600 mt-2">AI Voice Technology</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We're on a mission to democratize AI voice technology, making intelligent voice assistants accessible to businesses of all sizes. Our platform handles millions of conversations with human-like quality.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="group px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl flex items-center gap-2">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/services" className="px-6 py-3 bg-white border-2 border-blue-200 text-blue-600 font-bold rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all">
                    Our Services
                  </Link>
                </div>
              </div>

              {/* Right - Stats Dashboard */}
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Company Overview</h3>
                      <p className="text-sm text-gray-500">Real-time metrics</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-xs font-semibold text-emerald-700">Live</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Customers</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={500} suffix="+" />
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Calls/Day</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={50} suffix="K" />
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Uptime</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">99.9%</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm text-gray-600">Languages</span>
                      </div>
                      <p className="text-3xl font-black text-gray-900">
                        <AnimatedCounter end={50} suffix="+" />
                      </p>
                    </div>
                  </div>

                  {/* Growth Chart */}
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-gray-700">Monthly Growth</span>
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> +127%
                      </span>
                    </div>
                    <MiniBarChart 
                      data={[30, 45, 55, 40, 65, 75, 60, 85, 95, 80, 100, 90]} 
                      colors={['bg-blue-400', 'bg-blue-500', 'bg-blue-600']}
                    />
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>Jan</span>
                      <span>Jun</span>
                      <span>Dec</span>
                    </div>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-black text-gray-900">4.9</p>
                      <p className="text-xs text-gray-500">Customer Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                  <Rocket className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
                  Transforming Business Communication with AI
                </h2>
                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  We envision a world where every business, regardless of size, has access to intelligent AI voice technology. Our platform empowers companies to deliver exceptional customer experiences 24/7.
                </p>
                <div className="flex flex-wrap gap-4">
                  {['Human-like Conversations', 'Instant Responses', 'Always Available'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-white font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Conversations', value: '10M+', icon: Phone, color: 'from-emerald-400 to-teal-500' },
                  { label: 'Response Time', value: '<500ms', icon: Zap, color: 'from-amber-400 to-orange-500' },
                  { label: 'Satisfaction', value: '98%', icon: Heart, color: 'from-rose-400 to-pink-500' },
                  { label: 'Cost Saved', value: '$5M+', icon: TrendingUp, color: 'from-violet-400 to-purple-500' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-blue-200">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <Heart className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-blue-600">Our Core Values</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These principles guide every decision we make and every product we build.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <div
                  key={i}
                  className={`group ${value.bgColor} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-200 rounded-full mb-6">
                <Rocket className="w-4 h-4 text-violet-600" />
                <span className="text-sm font-bold text-violet-600">Our Journey</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                Milestones & Achievements
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                From a small startup to a global AI voice platform - here's our story.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-violet-500 to-rose-500 -translate-x-1/2 hidden lg:block rounded-full" />

              <div className="space-y-8 lg:space-y-12">
                {milestones.map((milestone, i) => (
                  <div key={i} className={`relative lg:flex items-center ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`lg:w-1/2 ${i % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16'}`}>
                      <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all inline-block ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                        <span className="text-sm font-bold text-blue-600 mb-2 block">{milestone.year}</span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600 text-sm">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
                      <div className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center shadow-lg`}>
                        <milestone.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Empty space for other side */}
                    <div className="lg:w-1/2 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
                <Users className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-600">Our Team</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                The People Behind DigitalBot
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A diverse team of AI engineers, designers, and customer success experts.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamStats.map((stat, i) => (
                <div key={i} className={`${stat.bgColor} rounded-2xl p-8 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-1`}>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join 500+ companies already using DigitalBot to automate their customer communications.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/signup" className="group px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-blue-500/30 text-white font-bold rounded-xl hover:bg-blue-500/50 transition-all border border-white/30">
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
>>>>>>> 138b57ba3cb1a461051c9b31e7e6358ebc30b97a
      </main>

      <Footer />
    </>
  )
}
