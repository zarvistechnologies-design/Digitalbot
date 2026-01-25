"use client"

import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
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
    title: "Customer First",
    description: "We obsess over our customers' success. Every decision starts with understanding their needs and delivering exceptional value.",
    gradient: "from-blue-500 to-blue-500"
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We push boundaries and embrace new technologies to create groundbreaking AI voice solutions that redefine what's possible.",
    gradient: "from-purple-500 to-pink-500"
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
    description: "We set the bar high and constantly raise it. Good enough isn't in our vocabulary—we deliver exceptional.",
    gradient: "from-yellow-500 to-blue-500"
  }
]

const founders = [
  {
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
]

export default function About() {
  return (
    <>
      <Header />
      
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
      </main>

      <Footer />
    </>
  )
}





