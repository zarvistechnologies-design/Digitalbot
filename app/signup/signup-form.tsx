'use client'

import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Lock, Mail, Sparkles, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SignupFormProps {
  initialService?: string
}

type ServiceKey = 'event-booking-crm' | 'pathology-diagnostic' | 'lead-analysis' | 'customer-support' | 'doctor-dashboard' | 'appointment' | 'appointment-whatsapp' | 'tankro' | ''

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
    else if (['event-booking-crm', 'event-booking', 'event booking crm', 'events'].includes(serviceFromUrl)) setSelectedService('event-booking-crm')
    else if (serviceFromUrl === 'appointment') setSelectedService('appointment')
    else if (['doctor', 'doctor-dashboard', 'doctor dashboard', 'clinic', 'healthcare'].includes(serviceFromUrl)) setSelectedService('doctor-dashboard')
    else if (['doctor-desk', 'doctor desk', 'appointment-whatsapp', 'appointment whatsapp', 'doctor-whatsapp', 'doctor whatsapp', 'doctor+whatsapp', 'doctor + whatsapp'].includes(serviceFromUrl)) setSelectedService('appointment-whatsapp')
    else if (serviceFromUrl === 'customer-support') setSelectedService('customer-support')
    else if (['tankro', 'tankro-dashboard', 'tankro dashboard', 'tank', 'tank cleaning'].includes(serviceFromUrl)) setSelectedService('tankro')
    else if (['pathology', 'pathology-diagnostic', 'diagnostic', 'diagnostic-center', 'diagnostic center'].includes(serviceFromUrl)) setSelectedService('pathology-diagnostic')
  }, [searchParams, initialService])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const getSelectedService = (): ServiceKey => selectedService

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    
    const service = getSelectedService()
    if (!service) newErrors.service = 'Invalid service selected'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    
    const service = getSelectedService()

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api'}/auth/register`, {
        ...form,
        selectedService: service,
      })

      alert('Registration successful! Please login to continue.')
      router.push(`/login?service=${service}`)
    } catch (err: any) {
      console.error(err)
      alert(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const getServiceInfo = () => {
    switch (selectedService) {
      case 'event-booking-crm':
        return { title: 'Event Booking CRM', gradient: 'from-amber-500 to-orange-600' }
      case 'lead-analysis':
        return { title: 'Lead Analysis Service', gradient: 'from-orange-500 to-violet-500' }
      case 'appointment':
        return { title: 'Appointment Service', gradient: 'from-violet-500 to-orange-600' }
      case 'doctor-dashboard':
        return { title: 'Doctor Dashboard Service', gradient: 'from-orange-500 to-violet-500' }
      case 'appointment-whatsapp':
        return { title: 'Doctor Desk', gradient: 'from-emerald-500 to-teal-600' }
      case 'customer-support':
        return { title: 'Customer Support AI', gradient: 'from-orange-500 to-violet-500' }
      case 'tankro':
        return { title: 'Tankro Service Dashboard', gradient: 'from-orange-500 to-violet-500' }
      case 'pathology-diagnostic':
        return { title: 'Pathology Diagnostic Center', gradient: 'from-teal-600 to-sky-600' }
      default:
        return { title: 'DigitalBot Service', gradient: 'from-orange-500 to-violet-600' }
    }
  }

  const { title } = getServiceInfo()

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(500px,0.92fr)] lg:overflow-hidden">
        <section className="hidden h-screen overflow-hidden border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="relative min-h-0 flex-1">
            <Image
              src="/images/signup-professionals.png"
              alt="Healthcare, events, support, and business professionals"
              fill
              priority
              sizes="(min-width: 1280px) 55vw, 50vw"
              quality={82}
              className="object-cover object-center"
            />
            <Link href="/" className="absolute left-8 top-5 z-10 inline-flex">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-9 w-auto"
              />
            </Link>
          </div>
          <div className="shrink-0 px-10 py-7 xl:px-12 xl:py-8">
            <h1 className="max-w-xl text-3xl font-bold leading-tight text-slate-950 xl:text-4xl">
              Start with the workspace your team needs.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
              Create a secure account for your selected service, then connect your team and voice workflow.
            </p>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 lg:h-screen lg:min-h-0 lg:px-12">
          <div className="w-full max-w-lg">
            <div className="mb-6 flex items-center justify-between gap-4">
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to services
              </Link>
              <Link
                href="/login"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-700"
              >
                Login
              </Link>
            </div>

            <div className="mb-5 overflow-hidden rounded-lg bg-slate-100 lg:hidden">
              <Image
                src="/images/signup-professionals.png"
                alt="Healthcare, events, support, and business professionals"
                width={1440}
                height={960}
                sizes="100vw"
                quality={82}
                className="aspect-[3/2] h-auto w-full object-cover"
              />
            </div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.07)] sm:p-8"
            >
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  Sign Up
                </span>
                <h1 className="mt-2 text-2xl font-bold text-slate-950">Create your account</h1>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Your account opens directly in the selected workspace.
                </p>
              </div>

              <div className="mb-4 flex items-center gap-3 rounded-md border border-orange-200 bg-orange-50 px-4 py-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange-700">Selected workspace</p>
                  <p className="mt-1 truncate text-sm font-bold text-slate-950">
                    {selectedService ? title : 'No workspace selected'}
                  </p>
                </div>
                {!selectedService && (
                  <Link href="/get-started" className="text-sm font-bold text-orange-700">
                    Choose
                  </Link>
                )}
              </div>

              <div className="grid gap-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</span>
                  <span className="flex h-11 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <User className="h-5 w-5 shrink-0 text-slate-400" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                  </span>
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Email Address</span>
                  <span className="flex h-11 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@company.com"
                      value={form.email}
                      onChange={handleChange}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                  </span>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-slate-700">Password</span>
                  <span className="flex h-11 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      placeholder="Minimum 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                    />
                  </span>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </label>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.98 }}
                disabled={loading || !selectedService}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </motion.button>
            </motion.form>
          </div>
        </section>
      </div>
    </main>
  )
}