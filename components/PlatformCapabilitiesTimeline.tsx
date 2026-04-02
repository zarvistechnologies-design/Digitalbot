"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function PlatformCapabilitiesTimeline() {
  const featureRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [visible, setVisible] = useState([false, false, false, false]);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observers = featureRefs.map((ref, idx) => {
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(v => {
              if (v[idx]) return v;
              const next = [...v];
              next[idx] = true;
              return next;
            });
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      return observer;
    });
    featureRefs.forEach((ref, idx) => {
      if (ref.current) observers[idx].observe(ref.current);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .animate-delay-1 { animation-delay: 0.1s; }
        .animate-delay-2 { animation-delay: 0.2s; }
        .animate-delay-3 { animation-delay: 0.3s; }
        .animate-delay-4 { animation-delay: 0.4s; }
        .is-visible {
          opacity: 1 !important;
        }
      `}</style>
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-1">
          <span className="inline-block px-3 py-1 text-xs font-medium text-orange-500 bg-orange-50/60 rounded-full mb-4 border border-orange-200/40">
            Platform Capabilities
          </span>
          <h2 id="platform-capabilities" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Everything You Need to <span className="text-orange-500">Automate</span>
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            One platform. Four powerful capabilities. Endless possibilities.
          </p>
        </div>
        {/* Timeline Style Features */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200"></div>
          {/* Feature Items */}
          <div className="space-y-2 md:space-y-0">
            {/* Feature 1 */}
            <div ref={featureRefs[0]} className={`md:flex items-center gap-4 mb-2 animate-fadeInUp animate-delay-1${visible[0] ? ' is-visible' : ''}`}>
              <div className="md:w-1/2 md:text-right md:pr-12 mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 text-orange-500 text-xs font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold">1</span>
                  Appointment Scheduling
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Smart Booking System</h3>
                <p className="text-gray-500 text-sm">AI schedules appointments 24/7. WhatsApp alerts for new bookings, reschedules & cancellations.</p>
                <div className="flex md:justify-end gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">WhatsApp</span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">24/7</span>
                </div>
              </div>
              <div className="hidden md:flex w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-lg z-10 mx-auto"></div>
              <div className="md:w-1/2 md:pl-12">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Auto-Schedule</div>
                    <div className="text-xs text-gray-400">No human needed</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div ref={featureRefs[1]} className={`md:flex items-center gap-4 mb-2 animate-fadeInUp animate-delay-2${visible[1] ? ' is-visible' : ''}`}>
              <div className="md:w-1/2 md:text-right md:pr-12 order-1 md:order-none">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 md:ml-auto md:w-fit">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Lead Scoring</div>
                    <div className="text-xs text-gray-400">AI qualification</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-lg z-10 mx-auto"></div>
              <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 text-orange-500 text-xs font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold">2</span>
                  Lead Generation
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">AI-Powered Outreach</h3>
                <p className="text-gray-500 text-sm">Bulk CSV upload, outbound calling, smart lead scoring. Get notified instantly for hot leads.</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">CSV Upload</span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">Hot Alerts</span>
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div ref={featureRefs[2]} className={`md:flex items-center gap-8 mb-12 animate-fadeInUp animate-delay-3${visible[2] ? ' is-visible' : ''}`}>
              <div className="md:w-1/2 md:text-right md:pr-12 mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 text-orange-500 text-xs font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs font-bold">3</span>
                  Customer Support
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">24/7 AI Support</h3>
                <p className="text-gray-500 text-sm">Never miss a call. AI handles FAQs, complaints, order status & smart escalations.</p>
                <div className="flex md:justify-end gap-2 mt-3">
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">&lt;3s Response</span>
                  <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded">95% Resolution</span>
                </div>
              </div>
              <div className="hidden md:flex w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-lg z-10 mx-auto"></div>
              <div className="md:w-1/2 md:pl-12">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">50+ Languages</div>
                    <div className="text-xs text-gray-400">Global support</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Feature 4 */}
            <div ref={featureRefs[3]} className={`md:flex items-center gap-8 animate-fadeInUp animate-delay-4${visible[3] ? ' is-visible' : ''}`}>
              <div className="md:w-1/2 md:text-right md:pr-12 order-1 md:order-none">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 md:ml-auto md:w-fit">
                  <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Easy Connect</div>
                    <div className="text-xs text-gray-400">API ready</div>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex w-4 h-4 rounded-full bg-pink-500 border-4 border-white shadow-lg z-10 mx-auto"></div>
              <div className="md:w-1/2 md:pl-12 mb-4 md:mb-0">
                <div className="inline-flex items-center gap-2 text-pink-500 text-xs font-medium mb-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 text-xs font-bold">4</span>
                  VoiceBot Integration
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Seamless Integrations</h3>
                <p className="text-gray-500 text-sm">Connect with Twilio, Salesforce, HubSpot, Zendesk, Slack & custom APIs.</p>
                <div className="flex gap-2 mt-3 flex-wrap">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Twilio</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Salesforce</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">+4 more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom CTA */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3">
            <Link href="/contact#contact-form" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-600 text-white text-sm font-medium rounded-lg hover:from-orange-700 hover:to-orange-700 transition-all btn-glow">
              Start Free Trial
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
              View Pricing
            </Link>
          </div>
          <p className="mt-3 text-gray-400 text-xs">No credit card required • Setup in 5 minutes</p>
        </div>
      </div>
    </>
  );
}