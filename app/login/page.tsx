'use client';
import { clearCache } from '@/lib/cache';
import { ArrowLeft, ArrowRight, Building2, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  selectedService?: string;
  bookingOnboardingComplete?: boolean;
  bookingBusinessType?: string;
}

const bookingServices = new Set(['booking-crm', 'event-booking-crm']);

function getDashboardDestination(user?: User | null) {
  if (user?.selectedService === 'akiara') return '/dashboard/akiara-sessions';
  if (user?.selectedService === 'healthiQure patient navigation') return '/dashboard/bot-sessions';
  if (user?.selectedService === 'pathology-diagnostic') return '/dashboard/pathology';
  if (bookingServices.has(String(user?.selectedService || '').toLowerCase())) {
    return user?.bookingOnboardingComplete ? '/dashboard' : '/dashboard/booking-crm/setup';
  }
  return '/dashboard';
}

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      router.push(getDashboardDestination(user));
    }
  }, [router]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    localStorage.clear();
    sessionStorage.clear();
    clearCache();

    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-46ss.onrender.com/api';
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: { token?: string; user?: User; error?: string } = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;

        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (data.user.id) localStorage.setItem('userId', data.user.id);
        }
        router.push(getDashboardDestination(data.user));
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(460px,0.92fr)] lg:overflow-hidden">
        <section className="hidden h-screen overflow-hidden bg-slate-950 lg:flex lg:flex-col">
          <div className="relative z-10 px-10 pb-6 pt-10 xl:px-14 xl:pt-12">
            <div className="flex items-center justify-between gap-6">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                  alt="DigitalBot.AI"
                  width={1450}
                  height={460}
                  priority
                  className="h-14 w-auto sm:h-16 drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                />
              </Link>
              <span className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
                <Building2 className="h-4 w-4 text-orange-300" />
                Multi-service workspaces
              </span>
            </div>
            <div className="mt-8 max-w-2xl">
              <h1 className="text-4xl font-bold leading-tight text-white">
                One login for every DigitalBot dashboard.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                Access your doctors, diagnostics, events, leads, and support workspace from one secure account.
              </p>
            </div>
          </div>
          <div className="relative min-h-0 flex-1">
            <Image
              src="/images/login-professionals.png"
              alt="Doctors, engineers, and business professionals"
              fill
              priority
              sizes="(min-width: 1280px) 55vw, 50vw"
              quality={82}
              className="object-cover object-center"
            />
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
              <Link
                href="/get-started"
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-700"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">Login</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Welcome back</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sign in to continue to your assigned service dashboard.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Email Address</span>
                  <span className="flex h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                      required
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                  <span className="flex h-12 items-center gap-3 rounded-md border border-slate-300 bg-white px-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                      required
                    />
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-12 w-full items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                New here?{' '}
                <Link href="/get-started" className="font-bold text-orange-700 hover:text-orange-800">
                  Choose a service
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
