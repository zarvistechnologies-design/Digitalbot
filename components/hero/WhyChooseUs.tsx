"use client"
import { ArrowRight, Award, CheckCircle, Clock, MessageSquare, Shield, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

export default function WhyChooseUs() {
    return (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <div className="text-center mb-10">
                    <p className="text-blue-500 font-semibold text-sm uppercase tracking-widest mb-2">Why Choose Us</p>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        The DigitalBot Advantage
                    </h2>
                    <p className="text-gray-500 max-w-xl mx-auto">
                        Enterprise-grade AI voice solutions that scale with your business
                    </p>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 auto-rows-[120px]">

                    {/* Feature 1 - Instant Setup (Large) */}
                    <div className="col-span-2 row-span-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        <div>
                            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white px-2.5 py-1 rounded-full text-xs font-medium mb-3">
                                <Zap className="h-3 w-3" /> Quick Start
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Instant Setup</h3>
                            <p className="text-sm text-orange-100 mb-3">
                                Deploy your AI voice assistant in under 5 minutes with zero-code integration. Connect to your existing systems seamlessly.
                            </p>
                            <ul className="text-xs text-orange-100 space-y-1">
                                <li className="flex items-center gap-1.5">
                                    <CheckCircle className="h-3 w-3 text-orange-200" /> No technical expertise needed
                                </li>
                                <li className="flex items-center gap-1.5">
                                    <CheckCircle className="h-3 w-3 text-orange-200" /> Instant API integration
                                </li>
                            </ul>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <div className="text-3xl font-bold text-white">5 min</div>
                                <div className="text-orange-200 text-xs">Setup Time</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">0</div>
                                <div className="text-orange-200 text-xs">Code Required</div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2 - Enterprise Security */}
                    <div className="col-span-2 row-span-1 bg-gray-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="h-5 w-5 text-emerald-400" />
                            <h3 className="text-base font-bold text-white">Enterprise Security</h3>
                        </div>
                        <p className="text-xs text-gray-400 mb-2">AES-256 encryption, SOC 2 certified, GDPR & HIPAA compliant.</p>
                        <div className="flex gap-1.5">
                            <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">SOC 2</span>
                            <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">GDPR</span>
                            <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-medium rounded">HIPAA</span>
                        </div>
                    </div>

                    {/* Feature 3 - 24/7 Operations */}
                    <div className="col-span-1 row-span-1 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-white" />
                            <h3 className="text-sm font-bold text-white">24/7 Operations</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">99.9%</div>
                            <div className="text-purple-200 text-xs">Uptime SLA</div>
                        </div>
                    </div>

                    {/* Feature 4 - Auto-Scaling */}
                    <div className="col-span-1 row-span-1 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-white" />
                            <h3 className="text-sm font-bold text-white">Auto-Scaling</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">100K+</div>
                            <div className="text-amber-100 text-xs">Conversations</div>
                        </div>
                    </div>

                    {/* Feature 5 - Omnichannel */}
                    <div className="col-span-1 row-span-1 bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 flex flex-col justify-between border border-orange-200/50 group hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-orange-500" />
                            <h3 className="text-sm font-bold text-gray-800">Omnichannel</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-500">6+</div>
                            <div className="text-gray-500 text-xs">Channels</div>
                        </div>
                    </div>

                    {/* Feature 6 - Proven Results */}
                    <div className="col-span-1 row-span-1 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-2xl p-4 flex flex-col justify-between border border-teal-200/50 group hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-teal-500" />
                            <h3 className="text-sm font-bold text-gray-800">Proven Results</h3>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-teal-500">90 Day</div>
                            <div className="text-gray-500 text-xs">ROI Payback</div>
                        </div>
                    </div>

                    {/* CTA Card */}
                    <div className="col-span-2 row-span-1 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 flex items-center justify-between border border-gray-200/50">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 mb-0.5">Ready to transform your business?</h3>
                            <p className="text-xs text-gray-500">14-day free trial • No credit card • Cancel anytime</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/signup" className="inline-flex items-center gap-1.5 bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm shadow-lg shadow-orange-500/20">
                                Start Free <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center gap-1.5 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:bg-white transition-colors text-sm">
                                Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
