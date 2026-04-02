"use client"
import { AnimatePresence, motion } from 'framer-motion'
import { Award, ChevronLeft, ChevronRight, Play, Quote, Sparkles, Star, TrendingUp, Users, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

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
    color: "from-orange-500 to-orange-600"
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
    color: "from-orange-500 to-pink-500"
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
    color: "from-orange-500 to-orange-600"
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
    color: "from-orange-500 to-orange-600"
  }
]

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", color: "text-orange-600", bgColor: "bg-orange-50", iconBg: "bg-orange-500" },
  { icon: TrendingUp, value: "10M+", label: "Calls Handled", color: "text-emerald-600", bgColor: "bg-emerald-50", iconBg: "bg-emerald-500" },
  { icon: Award, value: "4.9/5", label: "Avg Rating", color: "text-orange-600", bgColor: "bg-orange-50", iconBg: "bg-orange-500" },
  { icon: Zap, value: "99.9%", label: "Uptime", color: "text-orange-600", bgColor: "bg-orange-50", iconBg: "bg-orange-500" }
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
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-white" aria-hidden="true" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50/60 border border-orange-200/40 rounded-full mb-3">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Trusted Worldwide</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Loved by <span className="text-orange-600">Industry Leaders</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Join 500+ companies transforming customer experience with AI-powered voice solutions
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.bgColor} rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
              <div className={`text-xl font-bold text-gray-900`}>{stat.value}</div>
              <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-5 items-center">
          
          {/* Left - Testimonial Cards Stack */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[300px]">
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
                    <div className={`h-full bg-gradient-to-br ${testimonial.color} rounded-2xl p-0.5`}>
                      <div className="h-full bg-white rounded-[14px] p-4 flex flex-col">
                        {/* Industry Badge */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-gradient-to-r ${testimonial.color} text-white text-[10px] font-semibold rounded-full w-fit mb-3`}>
                          {testimonial.industry}
                        </div>
                        
                        {/* Profile */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-xl object-cover shadow-md"
                            />
                            {testimonial.video && (
                              <button className={`absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center shadow-sm`}>
                                <Play className="h-2 w-2 text-white fill-white ml-0.5" />
                              </button>
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                            <p className="text-[10px] text-gray-400">{testimonial.company}</p>
                          </div>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-orange-400 fill-orange-400" />
                          ))}
                        </div>

                        {/* Stat Badge */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${testimonial.color} bg-opacity-10 rounded-lg w-fit`}>
                          <span className={`text-lg font-bold bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}>
                            {testimonial.stats.metric}
                          </span>
                          <span className="text-gray-600 text-xs">{testimonial.stats.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            
            {/* Navigation Dots - Below Cards */}
            <div className="flex items-center justify-center gap-2 mt-4">
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
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 md:p-7 border border-gray-100 shadow-lg shadow-gray-100/50 relative overflow-hidden">
                  {/* Background Quote Mark */}
                  <div className="absolute top-3 right-3 opacity-5">
                    <Quote className="w-20 h-20 text-gray-900" />
                  </div>
                  
                  {/* Colored Accent */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${currentTestimonial.color} rounded-l-2xl`} />
                  
                  {/* Quote Icon */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTestimonial.color} flex items-center justify-center mb-4 shadow-md`}>
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Quote Text */}
                  <blockquote className="text-base md:text-lg text-gray-800 font-medium leading-relaxed mb-5">
                    "{currentTestimonial.quote}"
                  </blockquote>
                  
                  {/* Divider */}
                  <div className={`h-0.5 w-16 bg-gradient-to-r ${currentTestimonial.color} rounded-full mb-4`} />
                  
                  {/* Author Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        className={`w-10 h-10 rounded-lg object-cover ring-2 ring-offset-1 ring-gradient-to-r ${currentTestimonial.color}`}
                        style={{ 
                          boxShadow: `0 4px 14px -2px ${currentTestimonial.color.includes('orange') ? 'rgba(99,102,241,0.3)' : currentTestimonial.color.includes('emerald') ? 'rgba(16,185,129,0.3)' : currentTestimonial.color.includes('purple') ? 'rgba(168,85,247,0.3)' : currentTestimonial.color.includes('violet') ? 'rgba(139,92,246,0.3)' : 'rgba(99,102,241,0.3)'}` 
                        }}
                      />
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{currentTestimonial.name}</div>
                        <div className="text-xs text-gray-500">{currentTestimonial.role} at {currentTestimonial.company}</div>
                      </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className="flex gap-1.5">
                      <button
                        onClick={handlePrev}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 flex items-center justify-center transition-all hover:shadow-lg"
                      >
                        <ChevronRight className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-orange-600 text-white text-xs font-bold rounded-lg shadow-md">
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
          className="text-center mt-8"
        >
          <p className="text-gray-500 text-sm mb-3">Ready to transform your business?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/contact#contact-form" className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white text-sm font-bold rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-2 btn-glow">
              Start Free Trial
              <Zap className="w-4 h-4" />
            </a>
            <a href="/contact#contact-form" className="px-6 py-2.5 bg-white text-orange-600 text-sm font-semibold rounded-xl border border-orange-200/40 hover:border-orange-300/40 hover:shadow-md transition-all">
              Talk to Sales
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
