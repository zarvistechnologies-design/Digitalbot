"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Award, ChevronLeft, ChevronRight, Quote, Star, TrendingUp, Users, Zap } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    id: 1,
    name: "Dr. Shish Verma",
    role: "Doctor",
    company: "Ashish Nursing Home & E-Clinic",
    quote:
      "DigitalBot helps us manage patient calls, appointment enquiries, and follow-ups without keeping people waiting. It has made our daily clinic communication much smoother.",
    industry: "Healthcare",
    result: "Faster patient response",
    metric: "24/7",
    metricLabel: "Call support",
    gradient: "from-orange-500 via-rose-500 to-pink-500",
    soft: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    id: 2,
    name: "Amit Gupta",
    role: "Owner",
    company: "Akira Sewing Machine",
    quote:
      "Customers now get quick answers about machines, service, availability, and booking support. DigitalBot saves our team time and keeps every enquiry properly followed up.",
    industry: "Retail",
    result: "Better enquiry handling",
    metric: "2x",
    metricLabel: "Faster replies",
    gradient: "from-sky-500 via-cyan-500 to-emerald-500",
    soft: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Founder",
    company: "Urban Glow Salon",
    quote:
      "Our bookings, reminders, and customer questions are handled automatically. The system feels simple, reliable, and useful for a busy service business.",
    industry: "Salon",
    result: "More confirmed bookings",
    metric: "35%",
    metricLabel: "More bookings",
    gradient: "from-violet-500 via-fuchsia-500 to-orange-500",
    soft: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    id: 4,
    name: "Rahul Mehta",
    role: "Managing Partner",
    company: "Metro Property Advisors",
    quote:
      "DigitalBot qualifies property enquiries, captures requirements, and schedules calls with serious leads. It helps our team focus on the right customers.",
    industry: "Real Estate",
    result: "Cleaner lead follow-up",
    metric: "4x",
    metricLabel: "Lead clarity",
    gradient: "from-emerald-500 via-teal-500 to-blue-500",
    soft: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
]

const stats = [
  { icon: Users, value: "500+", label: "Happy Clients", gradient: "from-orange-500 to-rose-500" },
  { icon: TrendingUp, value: "10M+", label: "Calls Handled", gradient: "from-emerald-500 to-teal-500" },
  { icon: Award, value: "4.9/5", label: "Avg Rating", gradient: "from-violet-500 to-fuchsia-500" },
  { icon: Zap, value: "99.9%", label: "Uptime", gradient: "from-sky-500 to-blue-500" },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.98,
  }),
}

export default function TestimonialCarousel() {
  const [[activeIndex, direction], setSlide] = useState([0, 1])
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlide(([current]) => [(current + 1) % testimonials.length, 1])
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  const goToSlide = (nextIndex: number) => {
    setSlide(([current]) => [nextIndex, nextIndex > current ? 1 : -1])
  }

  const goToPrevious = () => {
    setSlide(([current]) => [(current - 1 + testimonials.length) % testimonials.length, -1])
  }

  const goToNext = () => {
    setSlide(([current]) => [(current + 1) % testimonials.length, 1])
  }

  return (
    <section className="relative overflow-hidden bg-white py-12 sm:py-16" aria-labelledby="testimonial-heading">
      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2">
            <Star className="h-4 w-4 fill-slate-950 text-slate-950" />
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-950">Client Reviews</span>
          </div>
          <h2 id="testimonial-heading" className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Trusted by Growing Businesses
          </h2>
          <p className="mt-3 text-base font-medium leading-relaxed text-slate-950">
            One simple view, sliding through real business feedback from teams using DigitalBot every day.
          </p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="rounded-lg border border-white/70 bg-white/85 p-4 text-center shadow-sm backdrop-blur"
            >
              <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r ${stat.gradient} text-white shadow-sm`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div className="text-xl font-bold text-slate-950">{stat.value}</div>
              <div className="text-xs font-medium text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-9 max-w-6xl"
        >
          <div className={`rounded-lg bg-gradient-to-r ${activeTestimonial.gradient} p-[2px] shadow-2xl shadow-slate-200/80`}>
            <div className="relative overflow-hidden rounded-lg bg-white">
              <div className={`h-2 bg-gradient-to-r ${activeTestimonial.gradient}`} />

              <div className="relative min-h-[360px] p-5 sm:p-7 lg:min-h-[300px] lg:p-8" aria-live="polite">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.article
                    key={activeTestimonial.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid h-full gap-7 lg:grid-cols-[0.72fr_1.28fr] lg:items-center"
                  >
                    <div className="border-b border-slate-100 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
                      <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${activeTestimonial.soft}`}>
                        {activeTestimonial.industry}
                      </div>

                      <div className="mt-7">
                        <div className={`bg-gradient-to-r ${activeTestimonial.gradient} bg-clip-text text-5xl font-black text-transparent sm:text-6xl`}>
                          {activeTestimonial.metric}
                        </div>
                        <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                          {activeTestimonial.metricLabel}
                        </div>
                      </div>

                      <div className="mt-7 flex gap-1" aria-label="5 star review">
                        {[...Array(5)].map((_, starIndex) => (
                          <Star key={starIndex} className="h-5 w-5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <Quote className="mb-4 h-10 w-10 text-slate-200" />
                      <blockquote className="text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
                        "{activeTestimonial.quote}"
                      </blockquote>

                      <div className="mt-7 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <div className="text-lg font-bold text-slate-950">{activeTestimonial.name}</div>
                          <div className="mt-1 text-sm text-slate-500">
                            {activeTestimonial.role}, {activeTestimonial.company}
                          </div>
                        </div>
                        <div className={`w-fit rounded-lg bg-gradient-to-r ${activeTestimonial.gradient} px-4 py-2 text-sm font-bold text-white shadow-sm`}>
                          {activeTestimonial.result}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                <div className="flex items-center gap-2">
                  {testimonials.map((testimonial, index) => (
                    <button
                      key={testimonial.id}
                      type="button"
                      onClick={() => goToSlide(index)}
                      aria-label={`Show review ${index + 1}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        index === activeIndex ? `w-9 bg-gradient-to-r ${testimonial.gradient}` : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      key={activeIndex}
                      className={`h-full rounded-full bg-gradient-to-r ${activeTestimonial.gradient}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.5, ease: "linear" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    aria-label="Previous review"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Next review"
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r ${activeTestimonial.gradient} text-white shadow-sm transition-transform hover:scale-105`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
