'use client';
import { PageBackground } from '@/components/page-background';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// Define the shape of the user data expected from the backend
interface User {
  id: string; // example user property
  email: string; // example user property
  // ... other user properties
}

export default function LoginPage(): JSX.Element {
  // 1. State variables with explicit types
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // 2. useEffect hook
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  // 3. handleLogin function with explicit types for the event
  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear any old cached data first
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://digital-api-tef8.onrender.com/api';
      console.log('🔐 Attempting login to:', API_URL);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Define a general type for the JSON response
      const data: { token?: string; user?: User; error?: string } = await response.json();

      if (response.ok && data.token) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        
        // Store token in cookie for middleware access (expires in 24 hours)
        document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
        
        // Store user object as a JSON string
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          // Store userId separately for billing and other features
          if (data.user.id) {
            localStorage.setItem('userId', data.user.id);
          }
        }
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      // TypeScript recommends casting 'err' to 'Error' for reliable access to 'message'
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Input change handlers with explicit types for the event
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 5. Component return type (JSX.Element)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fafbff] via-white to-[#f0f0ff] p-4 relative overflow-hidden">
      <PageBackground />
      <div className="glass-strong p-8 rounded-3xl shadow-2xl shadow-indigo-500/8 w-full max-w-md relative z-10 border border-white/40">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500">
            Sign in to access your call dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 6. Form event handler uses the typed handleLogin */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              // 7. Used the typed change handler
              onChange={handleEmailChange}
              className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              // 8. Used the typed change handler
              onChange={handlePasswordChange}
              className="w-full px-4 py-3 border border-slate-200/60 rounded-xl bg-white/60 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 btn-glow"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account? Contact your administrator
        </p>
      </div>
    </div>
  );
}






