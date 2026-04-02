 "use client"
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Phone, Clock, Globe, Zap, Shield } from 'lucide-react'

interface StatProps {
  value: number
  suffix?: string
  prefix?: string
  label: string
  icon: React.ElementType
  duration?: number
  decimals?: number
  color?: string
  bgColor?: string
}

function AnimatedStat({ value, suffix = '', prefix = '', label, icon: Icon, duration = 2, decimals = 0, color = 'from-orange-500 to-orange-600', bgColor = 'from-orange-50 to-orange-50/50' }: StatProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!isInView) return

    let start = 0
    const end = value
    const incrementTime = (duration * 1000) / end
    const step = Math.max(1, Math.floor(end / 100))

    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, incrementTime * step)

    return () => clearInterval(timer)
  }, [isInView, value, duration])

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals) 
    : count.toLocaleString()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="group relative"
    >
      <div className={`bg-gradient-to-br ${bgColor} rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
        {/* Icon */}
        <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
          <Icon className="h-7 w-7 text-white" />
        </div>

        {/* Value */}
        <div className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
          {prefix}
          <span className="tabular-nums">{formattedValue}</span>
          <span className={`bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{suffix}</span>
        </div>

        {/* Label */}
        <p className="text-gray-600 font-medium">{label}</p>
      </div>
    </motion.div>
  )
}

const stats = [
  { value: 10, suffix: 'M+', label: 'Calls Handled', icon: Phone, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-50/50' },
  { value: 99.9, suffix: '%', label: 'Uptime Guarantee', icon: Shield, decimals: 1, color: 'from-emerald-500 to-teal-500', bgColor: 'from-emerald-50 to-emerald-100/50' },
  { value: 750, suffix: 'ms', prefix: '<', label: 'Response Time', icon: Zap, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-50/50' },
  { value: 50, suffix: '+', label: 'Languages Supported', icon: Globe, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-100/50' },
  { value: 24, suffix: '/7', label: 'AI Availability', icon: Clock, color: 'from-rose-500 to-pink-500', bgColor: 'from-rose-50 to-rose-100/50' },
  { value: 300, suffix: '%', label: 'Average ROI', icon: TrendingUp, color: 'from-orange-500 to-orange-600', bgColor: 'from-orange-50 to-orange-50/50' },
]

export default function AnimatedStats() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)',
        backgroundSize: '32px 32px'
      }}></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-orange-50/60 text-orange-700 rounded-full text-sm font-semibold mb-4 border border-orange-200/40">
            Platform Performance
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Numbers That <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Speak for Themselves</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Industry-leading performance metrics that power thousands of businesses worldwide
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              label={stat.label}
              icon={stat.icon}
              decimals={stat.decimals}
              color={stat.color}
              bgColor={stat.bgColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
