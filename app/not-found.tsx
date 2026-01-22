import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle, Home, Shield, Users, Zap } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Page Not Found | DigitalBot.ai",
  description: "The page you're looking for doesn't exist. It may have been moved or deleted.",
  robots: "noindex, nofollow",
}

export default function NotFound() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
          }
          .shimmer-text {
            background: linear-gradient(90deg, #ff9800 0%, #fbbf24 50%, #fff7ed 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }
        `
      }} />

      <Header />
      <main className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-4 py-20">
        {/* Glassmorphism/gradient background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-sky-200/30 rounded-full blur-3xl" />
        </div>

        {/* Animated gradient lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-pulse" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-sky-400/20 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Glass card */}
        <div className="max-w-3xl mx-auto text-center relative z-10">

          {/* Alert Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <AlertTriangle className="w-16 h-16 text-sky-400 animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <AlertTriangle className="w-16 h-16 text-sky-400 opacity-20" />
              </div>
            </div>
          </div>

          {/* 404 Number with Gradient Effect */}
          <div className="mb-8 relative">
            <h1 className="text-[8rem] md:text-[12rem] font-black leading-none mb-4 relative inline-block">
              <span className="absolute inset-0 text-sky-300 opacity-60 blur-sm">404</span>
              <span className="absolute inset-0 text-sky-200 opacity-60 blur-sm translate-x-1 translate-y-1">404</span>
              <span className="relative shimmer-text animate-pulse">404</span>
            </h1>
            {/* Gradient Lines */}
            <div className="absolute top-1/4 left-0 right-0 h-1 bg-gradient-to-r from-sky-400/40 via-sky-300/40 to-transparent animate-pulse" />
            <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-gradient-to-r from-sky-200/40 via-sky-400/40 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-wider">
              <span className="shimmer-text" style={{
                textShadow: '0 0 20px rgba(255, 152, 0, 0.5)'
              }}>
                PAGE NOT FOUND
              </span>
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-sky-400 via-60% to-sky-200" />
          </div>

          {/* Description Box */}
          <div className="mb-8 backdrop-blur-md bg-white/60 border border-sky-200/60 shadow-xl overflow-hidden p-6" style={{
            clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
          }}>
            <p className="text-base md:text-lg text-sky-700 mb-2 font-mono">
              <span className="text-sky-500 font-bold">[ERROR 404]</span> Neural pathway not found
            </p>
            <p className="text-gray-700 text-sm">
              The requested data stream has been corrupted or relocated.
              System cannot establish connection to target coordinates.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              asChild
              size="lg"
              className="group relative bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl shadow-lg hover:shadow-sky-400/40 transition-all duration-300 w-full sm:w-auto overflow-hidden hover:scale-105"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}
            >
              <Link href="/" className="flex items-center gap-2 relative z-10 uppercase tracking-widest px-8 py-3 text-sm">
                <Home className="w-5 h-5" />
                <span>Return Home</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="group bg-white/60 border-2 border-sky-400 hover:border-sky-500 hover:bg-sky-100/30 text-sky-500 hover:text-sky-600 font-black rounded-xl shadow-lg hover:shadow-sky-400/30 transition-all duration-300 w-full sm:w-auto"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
              }}
            >
              <Link href="/contact" className="flex items-center gap-2 uppercase tracking-widest px-8 py-3 text-sm">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span>Contact Support</span>
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-sky-500 uppercase tracking-widest mb-8">
            <div className="flex items-center gap-1.5 border border-sky-400/30 px-3 py-1.5 rounded" style={{
              boxShadow: '0 0 10px rgba(255, 152, 0, 0.2)'
            }}>
              <Shield className="h-4 w-4 text-sky-400" />
              <span className="font-bold">Enterprise Secure</span>
            </div>
            <div className="flex items-center gap-1.5 border border-sky-400/30 px-3 py-1.5 rounded" style={{
              boxShadow: '0 0 10px rgba(255, 152, 0, 0.2)'
            }}>
              <CheckCircle className="h-4 w-4 text-sky-400" />
              <span className="font-bold">99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-1.5 border border-sky-400/30 px-3 py-1.5 rounded" style={{
              boxShadow: '0 0 10px rgba(255, 152, 0, 0.2)'
            }}>
              <Users className="h-4 w-4 text-sky-400" />
              <span className="font-bold">50k+ Users</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-b border-sky-400/20 py-6 backdrop-blur-sm bg-white/40">
            <p className="text-xs text-sky-500 mb-4 font-mono tracking-wider uppercase">
              {'>'} QUICK ACCESS NODES:
            </p>
            <div className="flex flex-wrap gap-3 justify-center font-mono text-sm">
              <Link
                href="/services"
                className="px-3 py-1 border border-sky-400/50 text-sky-500 hover:bg-sky-400/10 hover:border-sky-500 hover:shadow-[0_0_10px_rgba(255,152,0,0.2)] transition-all duration-300 group"
              >
                <span className="group-hover:text-sky-700">SERVICES</span>
              </Link>
              <Link
                href="/pricing"
                className="px-3 py-1 border border-sky-400/50 text-sky-500 hover:bg-sky-400/10 hover:border-sky-500 hover:shadow-[0_0_10px_rgba(255,152,0,0.2)] transition-all duration-300 group"
              >
                <span className="group-hover:text-sky-700">PRICING</span>
              </Link>
              <Link
                href="/blog"
                className="px-3 py-1 border border-sky-400/50 text-sky-500 hover:bg-sky-400/10 hover:border-sky-500 hover:shadow-[0_0_10px_rgba(255,152,0,0.2)] transition-all duration-300 group"
              >
                <span className="group-hover:text-sky-700">BLOG</span>
              </Link>
              <Link
                href="/docs"
                className="px-3 py-1 border border-sky-400/50 text-sky-500 hover:bg-sky-400/10 hover:border-sky-500 hover:shadow-[0_0_10px_rgba(255,152,0,0.2)] transition-all duration-300 group"
              >
                <span className="group-hover:text-sky-700">DOCS</span>
              </Link>
              <Link
                href="/about"
                className="px-3 py-1 border border-sky-400/50 text-sky-500 hover:bg-sky-400/10 hover:border-sky-500 hover:shadow-[0_0_10px_rgba(255,152,0,0.2)] transition-all duration-300 group"
              >
                <span className="group-hover:text-sky-700">ABOUT</span>
              </Link>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="mt-8 flex justify-center items-center gap-2 font-mono text-xs text-sky-400">
            <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_10px_rgba(255,152,0,0.8)]" />
            <span>SYSTEM.STATUS: ONLINE</span>
          </div>
        </div>

        {/* Animated Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-sky-400 animate-pulse" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-sky-400 animate-pulse" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-sky-400 animate-pulse" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-sky-400 animate-pulse" />
      </main>
      <Footer />
    </>
  )
}
