'use client'

import { PageBackground } from '@/components/page-background'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Lock, Mail, Sparkles, User } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SignupFormProps {
  initialService?: string
}

type ServiceKey = 'lead-analysis' | 'appointment' | 'customer-support' | ''

export function SignupForm({ initialService }: SignupFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedService, setSelectedService] = useState<ServiceKey>('')

  // Initialize service based on query - read from URL directly
  useEffect(() => {
    const serviceFromUrl = searchParams.get('service') || initialService
    if (!serviceFromUrl) return
    if (serviceFromUrl === 'lead' || serviceFromUrl === 'lead-analysis') setSelectedService('lead-analysis')
    else if (serviceFromUrl === 'appointment') setSelectedService('appointment')
    else if (serviceFromUrl === 'customer-support') setSelectedService('customer-support')
  }, [searchParams, initialService])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const getServiceFromUrl = (): ServiceKey => {
    const serviceFromUrl = searchParams.get('service') || initialService
    if (serviceFromUrl === 'lead' || serviceFromUrl === 'lead-analysis') return 'lead-analysis'
    if (serviceFromUrl === 'appointment') return 'appointment'
    if (serviceFromUrl === 'customer-support') return 'customer-support'
    return selectedService
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    const service = getServiceFromUrl()
    if (!service) newErrors.service = 'Invalid service selected'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    
    // Get service directly from URL to ensure we have it
    const service = getServiceFromUrl()

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-tef8.onrender.com/api'}/auth/register`, {
        ...form,
        selectedService: service,
      })

      alert('Registration successful! Please login to continue.')
      router.push('/login')
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const getServiceInfo = () => {
    switch (selectedService) {
      case 'lead-analysis':
        return { title: 'Lead Analysis Service', gradient: 'from-blue-400 to-blue-700' }
      case 'appointment':
        return { title: 'Appointment Service', gradient: 'from-blue-500 to-blue-600' }
      case 'customer-support':
        return { title: 'Customer Support AI', gradient: 'from-cyan-500 to-blue-600' }
      default:
        return { title: 'DigitalBot Service', gradient: 'from-blue-500 to-blue-700' }
    }
  }

  const { title, gradient } = getServiceInfo()

  return (
    <div className="flex justify-center items-center min-h-screen bg-white relative overflow-hidden px-4">
      <PageBackground />

      {/* Animated glow */}
      <div className="absolute w-[700px] h-[700px] bg-blue-500/20 blur-[180px] rounded-full -top-40 -left-20 animate-pulse" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl shadow-blue-500/40 w-full max-w-md border border-blue-400/70 hover:shadow-blue-500/60 hover:scale-[1.02] transition-transform duration-300"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h2 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>
            Sign Up for {title}
          </h2>
        </div>

        {/* Name */}
        <div className="mb-4">
          <div className="flex items-center gap-2 border rounded px-3 py-2 bg-white/70 backdrop-blur">
            <User className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <div className="flex items-center gap-2 border rounded px-3 py-2 bg-white/70 backdrop-blur">
            <Mail className="w-5 h-5 text-gray-500" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center gap-2 border rounded px-3 py-2 bg-white/70 backdrop-blur">
            <Lock className="w-5 h-5 text-gray-500" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none"
            />
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        {/* Service error */}
        {errors.service && <p className="text-sm text-red-500 mb-4">{errors.service}</p>}

        {/* Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white w-full py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60"
        >
          {loading ? 'Registering...' : 'Create Account'}
        </motion.button>
      </motion.form>
    </div>
  )
}
