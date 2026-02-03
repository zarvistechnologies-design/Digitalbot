"use client"
import { ArrowRight, Award, BarChart3, CheckCircle, Clock, Globe, PhoneCall, TrendingUp, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function PerformanceDashboard() {
    return (
        <section className="py-16 px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes countUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes barGrow {
                    from { transform: scaleY(0); }
                    to { transform: scaleY(1); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .metric-card {
                    animation: countUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                .metric-card:nth-child(1) { animation-delay: 0.1s; }
                .metric-card:nth-child(2) { animation-delay: 0.2s; }
                .metric-card:nth-child(3) { animation-delay: 0.3s; }
                .bar-animate {
                    animation: barGrow 1s ease-out forwards;
                    transform-origin: bottom;
                }
            `}} />

            <div className="container mx-auto max-w-6xl relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 px-4 py-2 rounded-full text-blue-600 text-sm font-semibold mb-4">
                        <BarChart3 className="h-4 w-4" />
                        LIVE PERFORMANCE
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        See the{' '}
                        <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Impact</span>
                        {' '}in Real-Time
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our AI voice agents deliver measurable results from day one
                    </p>
                </div>

                {/* Main Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Response Time Card */}
                    <div className="metric-card bg-white rounded-2xl p-5 shadow-lg shadow-blue-100/30 border border-gray-100 group hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    -23%
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                &lt;750<span className="text-lg text-gray-500 font-normal">ms</span>
                            </div>
                            <div className="text-sm text-gray-500">Average Response Time</div>
                            <div className="mt-3 h-8 flex items-end gap-1">
                                {[40, 35, 45, 30, 25, 28, 22].map((h, i) => (
                                    <div key={i} className="flex-1 bg-blue-100 rounded-t" style={{ height: `${h}px` }}></div>
                                ))}
                            </div>
                        </div>

                        {/* Customer Satisfaction Card */}
                        <div className="metric-card bg-white rounded-2xl p-5 shadow-lg shadow-blue-100/30 border border-gray-100 group hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Award className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    +12%
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">
                                4.9<span className="text-lg text-gray-500 font-normal">/5</span>
                            </div>
                            <div className="text-sm text-gray-500">Customer Satisfaction</div>
                            <div className="mt-3 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="w-6 h-6 rounded bg-yellow-400 flex items-center justify-center">
                                        <span className="text-white text-xs">★</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cost Savings Card */}
                        <div className="metric-card bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-5 shadow-lg shadow-blue-300/30 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animation: 'shimmer 3s infinite' }}></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-white/90 text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" />
                                        Verified
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-1">85%</div>
                                <div className="text-sm text-blue-100">Cost Reduction</div>
                                <div className="mt-3 text-xs text-blue-200">
                                    Save ₹2.5L+ monthly on staffing
                                </div>
                            </div>
                        </div>
                    </div>

                {/* Bottom Stats Row */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: PhoneCall, label: 'Calls Handled', value: '1M+', trend: '+156%' },
                        { icon: Clock, label: 'Hours Saved', value: '50K+', trend: '+89%' },
                        { icon: Users, label: 'Happy Customers', value: '2,847', trend: '+45%' },
                        { icon: Globe, label: 'Languages', value: '50+', trend: 'Global' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-md shadow-blue-50 border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <stat.icon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                                        <span className="text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded">{stat.trend}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link 
                        href="/contact#contact-form" 
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 px-10 rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                    >
                        <span>Start Free Trial</span>
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <p className="mt-3 text-sm text-gray-500">No credit card required • Setup in 5 minutes</p>
                </div>
            </div>
        </section>
    );
}
