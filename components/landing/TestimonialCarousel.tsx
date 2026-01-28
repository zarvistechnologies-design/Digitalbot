"use client"
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Play, Quote, Sparkles, TrendingUp, Users, Award, Zap } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    company: "HealthFirst Clinic",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    quote: "DigitalBot reduced our no-show rate by 67% and freed up our staff to focus on patient care. The AI handles appointment scheduling flawlessly in multiple languages.",
    rating: 5,
    stats: { metric: "67%", label: "Reduction in no-shows" },
    video: false,
    industry: "Healthcare",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 2,
    name: "Michael Torres",
    role: "VP of Sales",
    company: "TechScale Inc.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    quote: "We went from 50 qualified leads per month to over 200. The AI qualification is incredibly accurate, and our sales team now only talks to hot prospects.",
    rating: 5,
    stats: { metric: "4x", label: "More qualified leads" },
    video: true,
    industry: "Technology",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Customer Success Director",
    company: "CloudServe Solutions",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    quote: "Our CSAT scores jumped from 72% to 94% within 3 months. Customers love getting instant responses 24/7, and complex issues are seamlessly escalated to our team.",
    rating: 5,
    stats: { metric: "94%", label: "Customer satisfaction" },
    video: false,
    industry: "SaaS",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 4,
    name: "James Park",
    role: "Operations Manager",
    company: "FastFood Chain",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    quote: "Handling 1000+ daily calls across 50 locations was impossible. DigitalBot now manages all reservations, orders, and inquiries with 99.9% accuracy.",
    rating: 5,
    stats: { metric: "1000+", label: "Daily calls handled" },
    video: true,
    industry: "Hospitality",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "CEO",
    company: "PropTech Realty",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    quote: "Our agents save 4 hours daily on phone calls. The AI pre-qualifies buyers, schedules showings, and follows up automatically. Game-changing technology.",
    rating: 5,
    stats: { metric: "4hrs", label: "Saved per agent daily" },
    video: false,
    industry: "Real Estate",
    color: "from-amber-500 to-orange-500"
  }
]

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-blue-500" },
  { icon: TrendingUp, value: "10M+", label: "Calls Handled", color: "text-emerald-500" },
  { icon: Award, value: "4.9/5", label: "Avg Rating", color: "text-amber-500" },
  { icon: Zap, value: "99.9%", label: "Uptime", color: "text-purple-500" }
]

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isAutoPlay) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex(prev => (prev + 1) % testimonials.length)
      }, 5000)
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlay])

  const handlePrev = () => {
    setIsAutoPlay(false)
    setActiveIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setIsAutoPlay(false)
    setActiveIndex(prev => (prev + 1) % testimonials.length)
  }

  const currentTestimonial = testimonials[activeIndex]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2" />
        
        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #3b82f6 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Trusted Worldwide</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loved by <span className="text-blue-600">Industry Leaders</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join 500+ companies transforming customer experience with AI-powered voice solutions
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100 border border-gray-100 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left - Testimonial Cards Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[400px]">
              {testimonials.map((testimonial, idx) => {
                const isActive = idx === activeIndex
                const isPrev = idx === (activeIndex - 1 + testimonials.length) % testimonials.length
                const isNext = idx === (activeIndex + 1) % testimonials.length
                
                return (
                  <motion.div
                    key={testimonial.id}
                    initial={false}
                    animate={{
                      scale: isActive ? 1 : 0.85,
                      y: isActive ? 0 : isPrev ? -40 : isNext ? 40 : 0,
                      x: isActive ? 0 : isPrev ? -20 : isNext ? 20 : 0,
                      opacity: isActive ? 1 : (isPrev || isNext) ? 0.5 : 0,
                      zIndex: isActive ? 30 : (isPrev || isNext) ? 20 : 10,
                      rotateY: isActive ? 0 : isPrev ? -5 : isNext ? 5 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => { setIsAutoPlay(false); setActiveIndex(idx); }}
                  >
                    <div className={`h-full bg-gradient-to-br ${testimonial.color} rounded-3xl p-1`}>
                      <div className="h-full bg-white rounded-[22px] p-6 flex flex-col">
                        {/* Industry Badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r ${testimonial.color} text-white text-xs font-semibold rounded-full w-fit mb-4`}>
                          {testimonial.industry}
                        </div>
                        
                        {/* Profile */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="relative">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                            />
                            {testimonial.video && (
                              <button className={`absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center shadow-md`}>
                                <Play className="h-3 w-3 text-white fill-white ml-0.5" />
                              </button>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-gray-500">{testimonial.role}</p>
                            <p className="text-xs text-gray-400">{testimonial.company}</p>
                          </div>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                          ))}
                        </div>

                        {/* Stat Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${testimonial.color} bg-opacity-10 rounded-xl w-fit`}>
                          <span className={`text-2xl font-bold bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}>
                            {testimonial.stats.metric}
                          </span>
                          <span className="text-gray-600 text-sm">{testimonial.stats.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {/* Navigation Dots - Below Cards */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setIsAutoPlay(false); setActiveIndex(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex 
                      ? `w-8 bg-gradient-to-r ${t.color}` 
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right - Quote Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                {/* Large Quote Card */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-100/50 relative overflow-hidden">
                  {/* Background Quote Mark */}
                  <div className="absolute top-4 right-4 opacity-5">
                    <Quote className="w-32 h-32 text-gray-900" />
                  </div>
                  
                  {/* Colored Accent */}
                  <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${currentTestimonial.color} rounded-l-3xl`} />
                  
                  {/* Quote Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Quote Text */}
                  <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
                    "{currentTestimonial.quote}"
                  </blockquote>
                  
                  {/* Divider */}
                  <div className={`h-1 w-20 bg-gradient-to-r ${currentTestimonial.color} rounded-full mb-6`} />
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        className={`w-14 h-14 rounded-xl object-cover ring-2 ring-offset-2 ring-gradient-to-r ${currentTestimonial.color}`}
                        style={{ 
                          boxShadow: `0 4px 14px -2px ${currentTestimonial.color.includes('blue') ? 'rgba(59,130,246,0.3)' : currentTestimonial.color.includes('emerald') ? 'rgba(16,185,129,0.3)' : currentTestimonial.color.includes('purple') ? 'rgba(168,85,247,0.3)' : currentTestimonial.color.includes('orange') ? 'rgba(249,115,22,0.3)' : 'rgba(245,158,11,0.3)'}` 
                        }}
                      />
                      <div>
                        <div className="font-bold text-gray-900">{currentTestimonial.name}</div>
                        <div className="text-sm text-gray-500">{currentTestimonial.role} at {currentTestimonial.company}</div>
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrev}
                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all hover:shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg">
                  ⭐ {currentTestimonial.stats.metric}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 mb-4">Ready to transform your business?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all hover:scale-105 flex items-center gap-2">
              Start Free Trial
              <Zap className="w-5 h-5" />
            </a>
            <a href="/contact" className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all">
              Talk to Sales
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
