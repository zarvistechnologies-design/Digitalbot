"use client"

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Clock, Eye, FileText, Globe, Lock, Mail, Shield, Users, CheckCircle, Info, Sparkles, Menu, ChevronRight } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]">
        <Header />

        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 to-orange-200/20 blur-3xl -z-10"></div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-500 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-2xl text-orange-600 font-semibold mb-3">DigitalBot.ai</p>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <p className="text-sm">Last Updated: December 14, 2025</p>
              </div>
            </div>

            {/* Introduction Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border-l-4 border-orange-500 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-500 p-3 rounded-2xl shadow-lg shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Welcome to DigitalBot.ai ("we," "our," or "us"). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your information. This Privacy Policy explains our practices regarding data collection and usage when you use our website and services.
                </p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-3xl shadow-lg p-6 mb-12 border-2 border-orange-300 hover:border-orange-400 transition-colors duration-300">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-2xl shadow-lg">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-orange-900 mb-2 text-xl">Important Notice</p>
                  <p className="text-orange-800">
                    By using DigitalBot.ai, you agree to the collection and use of information in accordance with this Privacy Policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 - Information Collection */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">1. Information We Collect</h2>
              </div>

              <div className="space-y-6">
                {/* 1.1 */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border-l-4 border-orange-400 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    1.1 Information You Provide
                  </h3>
                  <p className="text-gray-700 mb-4">We may collect the following information that you voluntarily provide:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Name and contact information (email address, phone number)',
                      'Account credentials (username, password)',
                      'Business information (company name, website URL)',
                      'Communication preferences',
                      'Any other information you choose to provide through forms or interactions'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1.2 */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border-l-4 border-orange-400 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    1.2 Information from Meta/Facebook Integration
                  </h3>
                  <p className="text-gray-700 mb-4">When you connect your Meta/Facebook account to our services, we may access:</p>
                  <div className="space-y-2">
                    {[
                      'Basic profile information (name, profile picture, email)',
                      'Page information and Page access tokens',
                      'Messages and conversations from your Facebook Pages (with your explicit permission)',
                      'Page insights and analytics data',
                      'User permissions granted through Facebook Login'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-900 font-semibold flex items-center">
                      <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                      We only access data that you explicitly authorize through Meta's permission dialogs.
                    </p>
                  </div>
                </div>

                {/* 1.3 */}
                <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-6 border-l-4 border-green-400 hover:border-green-500 transition-colors">
                  <h3 className="text-xl font-bold text-green-600 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    1.3 Information from WhatsApp Business API Integration
                  </h3>
                  <p className="text-gray-700 mb-4">When you use our services via WhatsApp Business API, we collect and process:</p>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {[
                      'Your WhatsApp business phone number',
                      'Business profile information (name, description, address, website)',
                      'Message content you send and receive through our chatbot service',
                      'Customer phone numbers who interact with your business on WhatsApp',
                      'Message delivery status, read receipts, and timestamps',
                      'User interactions, preferences, and opt-in/opt-out status'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-green-50 p-5 rounded-xl border-2 border-green-300">
                    <p className="text-sm text-green-900 font-bold mb-3 flex items-center">
                      <Lock className="w-4 h-4 mr-2" />
                      Important - WhatsApp Messaging:
                    </p>
                    <div className="space-y-2">
                      {[
                        'All messages are end-to-end encrypted by WhatsApp',
                        'We only message users who have explicitly opted-in to receive messages from your business',
                        'Message content is stored securely for service delivery purposes only',
                        'Users can block or opt-out from your business messages at any time'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-green-900">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1.4 */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border-l-4 border-orange-400 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    1.4 Voice and Call Data
                  </h3>
                  <p className="text-gray-700 mb-4">When you use our AI Voice Agent services, we collect and process:</p>
                  <div className="space-y-2">
                    {[
                      'Voice recordings and audio data from calls',
                      'Call duration, timestamps, and metadata',
                      'Phone numbers (caller and recipient)',
                      'Call transcripts and conversation analysis',
                      'Voice patterns for service improvement',
                      'Customer sentiment and interaction quality metrics'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-900 font-semibold flex items-center">
                      <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                      Voice recordings are stored securely and used solely to provide and improve our AI voice services. You can request deletion at any time.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border-l-4 border-orange-400 hover:border-orange-500 transition-colors">
                  <h3 className="text-xl font-bold text-orange-600 mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" />
                    1.5 Automatically Collected Information
                  </h3>
                  <p className="text-gray-700 mb-4">We automatically collect certain information when you visit our website:</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    {[
                      'IP address and device information',
                      'Browser type and version',
                      'Operating system',
                      'Pages visited and time spent on pages',
                      'Referring website addresses',
                      'Cookies and similar tracking technologies'
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 - How We Use Info */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">2. How We Use Your Information</h2>
              </div>

              <p className="text-gray-700 mb-6 text-lg">We use the collected information for the following purposes:</p>
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { title: 'Service Delivery', desc: 'To provide, maintain, and improve our AI chatbot services', icon: '🚀' },
                  { title: 'Meta Integration', desc: 'To facilitate communication between your Facebook Pages and our chatbot platform', icon: '💬' },
                  { title: 'WhatsApp Messaging', desc: 'To send and receive messages on your behalf via WhatsApp Business API, respond to customer inquiries, and automate conversations', icon: '📱' },
                  { title: 'Account Management', desc: 'To create and manage your account, authenticate users, and provide customer support', icon: '👤' },
                  { title: 'Communication', desc: 'To send you service-related notifications, updates, and respond to your inquiries', icon: '📧' },
                  { title: 'Analytics', desc: 'To analyze usage patterns, improve our services, and develop new features', icon: '📊' },
                  { title: 'Security', desc: 'To detect, prevent, and address technical issues, fraud, and security threats', icon: '🔐' },
                  { title: 'Compliance', desc: 'To comply with legal obligations and enforce our terms of service', icon: '⚖️' },
                ].map((item, idx) => (
                  <div key={idx} className="group bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-orange-700 mb-2 text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-700">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 - Data Sharing */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">3. Data Sharing and Disclosure</h2>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-orange-300">
                <p className="text-orange-900 font-bold text-xl text-center flex items-center justify-center">
                  <Shield className="w-6 h-6 mr-2" />
                  We do not sell your personal information
                </p>
              </div>

              <p className="text-gray-700 mb-6 text-lg">We may share your information only in the following circumstances:</p>

              <div className="space-y-5">
                {[
                  { title: '3.1 With Your Consent', desc: 'We share information when you explicitly authorize us to do so.', gradient: 'from-orange-50' },
                  { title: '3.2 Service Providers', desc: 'We may share information with trusted third-party service providers who assist us in operating our website and services, such as: Cloud hosting providers, Analytics services, Payment processors, Customer support tools. These providers are contractually obligated to protect your information and use it only for the purposes we specify.', gradient: 'from-orange-50' },
                  { title: '3.3 Meta/Facebook Platform', desc: 'We share data with Meta as necessary to provide our services through their platform, in compliance with Meta\'s Platform Terms and Policies.', gradient: 'from-orange-50' },
                  { title: '3.4 Legal Requirements', desc: 'We may disclose information if required by law, court order, or to: Comply with legal processes, Protect our rights, property, or safety, Prevent fraud or security issues, Respond to government requests.', gradient: 'from-pink-50' },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-gradient-to-r ${item.gradient} to-white rounded-2xl p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300`}>
                    <h3 className="text-xl font-bold text-orange-700 mb-3">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 - Data Retention */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">4. Data Retention</h2>
              </div>

              <p className="text-gray-700 mb-8 text-lg">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When information is no longer needed, we securely delete or anonymize it.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: 'Account Information', duration: 'Retained while active + reasonable period after deletion', icon: '👤', color: 'orange' },
                  { title: 'Meta/Facebook Data', duration: 'According to service needs and Meta\'s policies', icon: '📘', color: 'orange' },
                  { title: 'Usage Logs', duration: 'Typically 12-24 months for security/analytics', icon: '📊', color: 'orange' },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-gradient-to-br from-${item.color}-50 to-white rounded-2xl p-6 text-center border border-${item.color}-200 hover:shadow-lg hover:scale-105 transition-all duration-300`}>
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <p className={`font-bold text-${item.color}-700 mb-3 text-lg`}>{item.title}</p>
                    <p className="text-sm text-gray-700">{item.duration}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 - Data Security */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">5. Data Security</h2>
              </div>

              <p className="text-gray-700 mb-6 text-lg">
                We implement industry-standard security measures to protect your information:
              </p>

              <div className="space-y-4">
                {[
                  { icon: '🔐', text: 'Encryption of data in transit (SSL/TLS) and at rest' },
                  { icon: '🛡️', text: 'Regular security assessments and vulnerability testing' },
                  { icon: '🔑', text: 'Access controls and authentication mechanisms' },
                  { icon: '☁️', text: 'Secure data storage infrastructure' },
                  { icon: '👥', text: 'Employee training on data protection' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4 bg-gradient-to-r from-orange-50 to-white rounded-2xl p-5 border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all duration-300">
                    <div className="text-3xl">{item.icon}</div>
                    <p className="text-gray-700 flex-1 pt-1">{item.text}</p>
                    <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
                <p className="text-yellow-900 text-center font-semibold flex items-center justify-center">
                  <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                  However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Section 6 - Your Rights */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">6. Your Rights and Choices</h2>
              </div>

              <p className="text-gray-700 mb-6 text-lg">You have the following rights regarding your personal information:</p>

              <div className="space-y-5">
                {[
                  { title: '6.1 Access and Portability', desc: 'You can request a copy of your personal data we hold about you.', icon: '📁' },
                  { title: '6.2 Correction', desc: 'You can update or correct inaccurate information through your account settings or by contacting us.', icon: '✏️' },
                  { title: '6.3 Deletion', desc: 'You can request deletion of your account and associated data. Note that some information may be retained as required by law or for legitimate business purposes.', icon: '🗑️' },
                  { title: '6.4 Withdraw Consent', desc: 'You can revoke permissions granted to our app through your Meta/Facebook account settings at any time.', icon: '🚫' },
                  { title: '6.5 Opt-Out', desc: 'You can opt out of marketing communications by following the unsubscribe instructions in emails or contacting us directly.', icon: '📧' },
                  { title: '6.6 Cookie Management', desc: 'You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.', icon: '🍪' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-orange-50 to-white rounded-2xl p-6 border-l-4 border-orange-500 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-orange-700 mb-2 text-lg">{item.title}</h3>
                        <p className="text-gray-700 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7 - Meta Compliance */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 mb-8 border border-orange-100/40 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-lg">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">7. Meta/Facebook Platform Compliance</h2>
              </div>

              <p className="text-gray-700 mb-6 text-lg">Our use of Meta's platform is governed by:</p>
              <div className="space-y-4">
                {[
                  { title: 'Meta Platform Terms', url: 'https://www.facebook.com/terms.php' },
                  { title: 'Meta Platform Policy', url: 'https://developers.facebook.com/docs/development/release/policies/' },
                  { title: 'Meta Data Policy', url: 'https://www.facebook.com/privacy/policy/' }
                ].map((item, idx) => (
                  <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-r from-orange-50 to-white hover:from-orange-100 hover:to-orange-50 transition-all rounded-2xl p-5 border border-orange-200 hover:border-orange-400 hover:shadow-lg group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-orange-700 text-lg mb-1">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.url}</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-orange-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </a>
                ))}
              </div>
              <div className="mt-6 bg-orange-50 p-5 rounded-2xl border border-orange-200">
                <p className="text-gray-700 flex items-start">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  We comply with all Meta requirements including data usage restrictions, user privacy protections, and platform guidelines.
                </p>
              </div>
            </section>

            {/* WhatsApp Specific Section */}
            <section className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-3xl shadow-xl p-8 md:p-10 mb-8 border-2 border-green-300 hover:border-green-400 transition-all duration-300">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">8. WhatsApp Business API Specific Terms</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-green-700 mb-4">8.1 User Consent and Opt-In Policy</h3>
                  <p className="text-gray-700 mb-4">In compliance with Meta's opt-in requirements effective November 2024, we only send WhatsApp messages to users who have:</p>
                  <div className="space-y-3">
                    {[
                      'Explicitly shared their phone number with your business',
                      'Provided clear consent to receive messages from your business',
                      'Been informed about the types of messages they will receive'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-green-50 rounded-xl p-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-green-100 p-4 rounded-xl">
                    <p className="text-sm text-green-900">Users can opt-out or block your business at any time through WhatsApp's built-in controls.</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-green-700 mb-4">8.2 Message Types and Templates</h3>
                  <p className="text-gray-700 mb-4">We use WhatsApp's approved message templates for:</p>
                  <div className="grid md:grid-cols-2 gap-3 mb-4">
                    {[
                      'Order confirmations and updates',
                      'Appointment reminders',
                      'Customer service responses',
                      'Transactional notifications',
                      'Account updates and security alerts'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 bg-green-50 rounded-lg p-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">All message templates are pre-approved by WhatsApp/Meta before use.</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-green-700 mb-4">8.3 End-to-End Encryption</h3>
                  <p className="text-gray-700">
                    All messages sent through WhatsApp are protected by end-to-end encryption using the Signal Protocol. This means only you and your customers can read the messages - not even WhatsApp, Meta, or DigitalBot.ai can access the content.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-green-700 mb-4">8.4 Data Hosting and Processing</h3>
                  <p className="text-gray-700 mb-4">
                    We use WhatsApp's Cloud API hosted by Meta. When processing your WhatsApp messages:
                  </p>
                  <div className="space-y-2">
                    {[
                      'Message metadata (delivery status, timestamps) may be shared with Meta',
                      'Message content remains end-to-end encrypted',
                      'We store messages only as long as necessary for service delivery',
                      'All data processing complies with WhatsApp\'s Business Terms and Data Processing Terms'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-2 bg-green-50 rounded-lg p-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-green-700 mb-4">8.5 WhatsApp Business Policy Compliance</h3>
                  <p className="text-gray-700 mb-4">We strictly adhere to:</p>
                  <div className="space-y-3">
                    {[
                      { text: 'WhatsApp Business Policy', url: 'https://business.whatsapp.com/policy' },
                      { text: 'WhatsApp Business Terms of Service', url: 'https://www.whatsapp.com/legal/business-terms' },
                      { text: 'WhatsApp Business Data Processing Terms', url: 'https://www.whatsapp.com/legal/business-data-processing-terms' },
                      { text: 'WhatsApp Commerce Policy (if applicable)', url: 'https://www.whatsapp.com/legal/commerce-policy' }
                    ].map((item, idx) => (
                      <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 rounded-lg p-3 transition-colors group">
                        <ChevronRight className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                        <span className="text-green-700 hover:text-green-800 font-medium text-sm">{item.text}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-6 border-2 border-green-400">
                  <h3 className="text-xl font-bold text-green-800 mb-4">Your Rights on WhatsApp</h3>
                  <p className="text-gray-900 mb-4">When using our services via WhatsApp, you have the right to:</p>
                  <div className="space-y-3">
                    {[
                      'Block or report our business number at any time',
                      'Opt-out from receiving messages by replying "STOP"',
                      'Request deletion of your conversation history',
                      'View our business profile and verify our official status'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-green-900">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Remaining Sections - Streamlined */}
            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">9. Children's Privacy</h2>
              <p className="text-gray-700 text-lg">
                Our services are not intended for children under the age of 13 (or the applicable age in your jurisdiction). We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately so we can delete it.
              </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">10. International Data Transfers</h2>
              <p className="text-gray-700 text-lg">
                Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">11. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4 text-lg">We use cookies and similar technologies to:</p>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {[
                  'Maintain your session and preferences',
                  'Analyze website usage and performance',
                  'Provide personalized experiences',
                  'Deliver relevant advertising'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-orange-50 rounded-xl p-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-lg">
                You can control cookie preferences through your browser settings. For more information, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 underline font-semibold">www.allaboutcookies.org</a>.
              </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">12. Third-Party Links</h2>
              <p className="text-gray-700 text-lg">
                Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">13. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4 text-lg">We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:</p>
              <div className="space-y-3 mb-6">
                {[
                  'Posting the updated policy on this page with a new "Last Updated" date',
                  'Sending an email notification to registered users',
                  'Displaying a prominent notice on our website'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-orange-50 rounded-xl p-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-lg">
                Your continued use of our services after changes become effective constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-3xl shadow-2xl p-10 mb-8 text-white">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold">14. Contact Us</h2>
              </div>

              <p className="mb-8 text-xl text-orange-50">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-white/20 hover:bg-white/15 transition-colors">
                <p className="font-bold text-2xl mb-6">DigitalBot.ai</p>
                <div className="space-y-4">
                  <a href="mailto:privacy@digitalbot.ai" className="flex items-center space-x-3 group">
                    <Mail className="w-6 h-6" />
                    <span className="text-lg group-hover:underline">privacy@digitalbot.ai</span>
                  </a>
                  <a href="https://www.digitalbot.ai" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                    <Globe className="w-6 h-6" />
                    <span className="text-lg group-hover:underline">https://www.digitalbot.ai</span>
                  </a>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-orange-100">We will respond to your inquiry within 30 days.</p>
                </div>
              </div>
            </section>

            <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-orange-100/40">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-4 border-b-4 border-orange-500">15. Legal Basis for Processing (GDPR)</h2>
              <p className="text-gray-700 mb-6 text-lg">If you are located in the European Economic Area (EEA), our legal bases for processing your personal data include:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'Consent', desc: 'You have given explicit consent for processing your data', icon: '✅' },
                  { title: 'Contract', desc: 'Processing is necessary to provide our services', icon: '📄' },
                  { title: 'Legal Obligation', desc: 'Processing is required to comply with laws', icon: '⚖️' },
                  { title: 'Legitimate Interests', desc: 'Processing is necessary for our legitimate business interests, provided your rights are not overridden', icon: '🎯' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <p className="font-bold text-orange-700 mb-2 text-lg">{item.title}</p>
                    <p className="text-gray-700 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
