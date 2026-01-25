"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomerSupportSidebar from "./CustomerSupportSidebar";

export default function CustomerSupportLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    
    if (!token) {
      // No token, redirect to signup for customer support
      router.push('/signup?service=customer-support');
      return;
    }

    // Verify token is valid (basic check)
    try {
      // Token exists, user is authenticated
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      // Invalid token, clear and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setLoading(false);
      router.push('/signup?service=customer-support');
    }
  }, [router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <span className="text-3xl">🎧</span>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading Customer Support...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
      <CustomerSupportSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-blue-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎧</span>
            <span className="font-bold text-gray-900">Customer Support AI</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-72 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
