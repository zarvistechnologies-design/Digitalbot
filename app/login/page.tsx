'use client';
import { clearCache } from '@/lib/cache';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
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
  if (user?.selectedService === 'real-estate-crm') return '/dashboard/real-estate';
  if (user?.selectedService === 'hospitality-crm') return '/dashboard/hospitality';
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
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    <main className="min-h-screen overflow-hidden bg-[#fbf8f3] text-slate-950">
      <div className="grid min-h-screen lg:h-screen lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,0.92fr)]">
        <section className="relative hidden h-screen overflow-hidden lg:block">
            <Image
              src="/images/login-ai-light-v2.png"
              alt="Light abstract AI voice assistant workspace"
              fill
              priority
              sizes="(min-width: 1280px) 55vw, 50vw"
              quality={90}
              className="object-cover object-[center_58%] lg:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-[#fffaf3]/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-transparent" />

            <Link href="/" className="absolute left-8 top-7 z-10 hidden rounded-xl bg-white/95 px-4 py-2 shadow-xl backdrop-blur lg:inline-flex xl:left-12">
              <Image
                src="https://res.cloudinary.com/dew9qfpbl/image/upload/v1762971494/Gemini_Generated_Image_a19f1ha19f1ha19f-Kittl_b9jogz.svg"
                alt="DigitalBot.AI"
                width={1450}
                height={460}
                priority
                className="h-8 w-auto"
              />
            </Link>

          <div className="absolute inset-x-0 bottom-0 hidden p-8 lg:block xl:p-12">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/75 px-3 py-1.5 text-xs font-semibold text-orange-800 shadow-sm backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-orange-500" />
                Intelligent conversations, measurable results
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 xl:text-5xl">
                Your business, always ready to respond.
              </h1>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-600">
                Manage AI calls, customer journeys, bookings, and insights from one secure workspace.
              </p>
              <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-orange-600 shadow-lg shadow-orange-200/60 ring-1 ring-orange-100">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                Enterprise-grade access protection
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen overflow-hidden bg-white px-5 py-6 sm:px-10 lg:min-h-0 lg:px-14 xl:px-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,146,60,0.10),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.08),transparent_28%)]" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-orange-200 to-transparent lg:block" />

          <div className="relative z-10 mx-auto flex w-full max-w-sm flex-col">
            <header className="flex items-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-orange-50 hover:text-orange-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </header>

            <div className="my-auto py-5">
              <div className="mb-5">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-orange-600">
                  <span className="h-px w-6 bg-orange-500" />
                  Workspace access
                </span>
                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
                  Good to see<br />you again.
                </h2>
                <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                  Sign in with the account assigned to your business workspace.
                </p>
              </div>

              {error && (
                <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-3.5">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-600">Email address</span>
                  <span className="flex h-10 items-center gap-2.5 border-b-2 border-slate-200 bg-transparent px-1 transition focus-within:border-orange-500">
                    <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      type="email"
                      placeholder="your.email@company.com"
                      value={email}
                      onChange={handleEmailChange}
                      autoComplete="email"
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-600">Password</span>
                  <span className="flex h-10 items-center gap-2.5 border-b-2 border-slate-200 bg-transparent px-1 transition focus-within:border-orange-500">
                    <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={handlePasswordChange}
                      autoComplete="current-password"
                      className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="text-slate-400 transition hover:text-slate-700">
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-1.5 inline-flex h-10 w-full items-center justify-between rounded-full bg-orange-600 pl-4 pr-1 text-xs font-bold text-white shadow-lg shadow-orange-600/20 transition hover:-translate-y-0.5 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <span className="flex-1 text-center pl-10">{loading ? 'Signing in...' : 'Continue to dashboard'}</span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
                    <ArrowRight className={`h-4 w-4 transition-transform ${loading ? 'animate-pulse' : 'group-hover:translate-x-1'}`} />
                  </span>
                </button>
              </form>

              <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-[#fff8f0] px-3.5 py-2.5 ring-1 ring-orange-100">
                <div>
                  <p className="text-xs font-bold text-slate-800">New to DigitalBot?</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Find the right AI service for you.</p>
                </div>
                <Link href="/get-started" className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-orange-700 shadow-sm ring-1 ring-orange-200 transition hover:bg-orange-50">
                  Get started
                </Link>
              </div>
            </div>

            <footer className="flex items-center justify-center gap-1.5 pb-1 text-[10px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              Protected by secure, encrypted authentication
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
