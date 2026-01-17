 <section className="relative min-h-[200vh] bg-white dark:from-slate-900 dark:via-gray-900 dark:to-slate-800" id="use-cases">
          <div className="flex flex-col lg:flex-row">
            {/* LEFT SIDE - STICKY/FIXED */}
            <div className="lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex items-center justify-center p-8 lg:p-16">
              <div className="relative max-w-lg w-full">
                {/* Animated Background Shapes */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

                {/* Main Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-400/20 border border-orange-400/30 mb-6">
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-bold text-orange-500">AI VOICE AGENTS</span>
                  </div>

                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                    AI Voice Agent Solutions
                    <br />
                    <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                      for Every Industry
                    </span>
                  </h2>

                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    From healthcare to e-commerce, our AI voice assistants deliver <span className="text-orange-400 font-bold">measurable ROI</span> across all sectors.
                  </p>

                  {/* Animated Image Container */}
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <Image
                      src="/images/ai-voice-agent.png"
                      alt="AI Voice Agent Platform"
                      width={600}
                      height={400}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Floating Badge */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="text-white">
                        <div className="text-2xl font-black">24/7</div>
                        <div className="text-sm text-white/80">Always Available</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center animate-bounce">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - SCROLLING CONTENT */}
            <div className="lg:w-1/2 py-10 lg:py-16 px-4 lg:px-8 flex flex-col gap-10">
              <div className="flex flex-col gap-8">

                {/* Healthcare & Medical */}
                <div className="group opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                  <div className="relative p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-orange-200/40 hover:border-orange-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-400/10 shadow-md">
                    {/* Icon Badge */}
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>

                    {/* Image First */}
                    <div className="mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/hospital.png"
                        alt="AI Voice Assistant for Healthcare & Medical"
                        width={600}
                        height={350}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="mb-4">
                        <span className="inline-block px-2 py-0.5 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                          Healthcare Industry
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
                          Healthcare & Medical
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                          Transform patient care with AI-powered automation that handles appointments, screenings, and support 24/7.
                        </p>
                      </div>

                      {/* Feature List */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Automated Appointment Scheduling</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">24/7 booking and reminders</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Patient Pre-Screening</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">Triage and symptom assessment</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Prescription Refills</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">Automated medication management</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-500/10 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">HIPAA-Compliant</div>
                            <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">Secure patient communication</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Estate */}
                <div className="group opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                  <div className="relative p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-blue-200/40 hover:border-blue-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-400/10 shadow-md">
                    <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>

                    <div className="mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/female-real-estate.jpg"
                        alt="AI Voice Assistant for Real Estate"
                        width={600}
                        height={350}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                          Real Estate Industry
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                          Real Estate Solutions
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                          Never miss a lead with AI agents that handle inquiries, schedule showings, and qualify buyers instantly.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">24/7 Property Inquiries</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Never miss a lead</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Automated Showing Scheduling</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Instant appointments</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Lead Qualification</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Automatic buyer scoring</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Follow-up Automation</div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Nurture leads effectively</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hospitality & Hotels */}
                <div className="group opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                  <div className="relative p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-purple-200/40 hover:border-purple-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-400/10 shadow-md">
                    <div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>

                    <div className="mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/hotel-reception.jpg"
                        alt="AI Voice Assistant for Hotels & Hospitality"
                        width={600}
                        height={350}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="inline-block px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                          Hospitality Industry
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-500 transition-colors">
                          Hotels & Hospitality
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                          Deliver exceptional guest experiences with multilingual AI support available around the clock.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Reservation Management</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Booking and confirmations</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Guest Services</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Room service and concierge</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Multi-Language Support</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Serve international guests</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">24/7 Front Desk</div>
                            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">Always available assistance</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* E-commerce & Business */}
                <div className="group opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                  <div className="relative p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-green-200/40 hover:border-green-400/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-400/10 shadow-md">
                    <div className="absolute -top-4 -left-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>

                    <div className="mb-3 rounded-xl overflow-hidden">
                      <Image
                        src="/images/ai-voice-agent.png"
                        alt="AI Voice Agent for E-commerce & Business"
                        width={600}
                        height={350}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div>
                      <div className="mb-4">
                        <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                          E-commerce Industry
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-green-500 transition-colors">
                          E-commerce & Business
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 text-sm">
                          Boost sales and customer satisfaction with AI that handles orders, support, and recommendations instantly.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Order Tracking</div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">Real-time status updates</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Customer Support</div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">Instant query resolution</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Product Recommendations</div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">AI-powered upselling</div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-500/10 hover:bg-green-100 dark:hover:bg-green-500/20 transition-colors">
                          <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 dark:text-white text-sm">Returns & Exchanges</div>
                            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">Automated processing</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
