import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowRight,
    BarChart3,
    Bot,
    Check,
    Code,
    Globe,
    Headphones,
    MessageSquare,
    Phone,
    Shield,
    Smartphone,
    Users,
    Zap
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
  description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
  keywords: [
    "ai voice assistant services",
    "ai call center solutions",
    "ai customer support",
    "ai sales agent",
    "virtual receptionist ai",
    "voice automation software",
    "conversational ai platform",
    "ai voice bot services",
    "business phone automation",
    "ai appointment scheduling",
    "voice ai for business",
    "automated customer service",
    "ai voice technology",
    "enterprise voice ai",
    "ai phone system",
  ],
  openGraph: {
    title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
    description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
    type: "website",
    url: "https://digitalbot.ai/services",
    images: [
      {
        url: "/images/ai-voice-agent.png",
        width: 1200,
        height: 630,
        alt: "AI Voice Assistant Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Voice Assistant Services | AI Call Center Solutions - DigitalBot.ai 2025",
    description: "Transform your business with AI voice assistant services. AI call center, customer support, sales agents & virtual receptionists. Trusted by 500+ businesses.",
    images: ["/images/ai-voice-agent.png"],
  },
};

const services = [
  {
    icon: Phone,
    title: "AI Call Center",
    description:
      "24/7 automated call handling with intelligent routing, real-time analytics, and seamless CRM integration.",
    features: [
      "Unlimited concurrent calls",
      "Smart call routing",
      "Real-time transcriptions",
      "Multi-language support",
    ],
    popular: true,
    href: "/services/ai-call-center",
  },
  {
    icon: Headphones,
    title: "AI Customer Support",
    description:
      "Instant, personalized customer service that resolves issues 24/7 with human-like conversations.",
    features: [
      "Instant issue resolution",
      "Knowledge base integration",
      "Sentiment analysis",
      "Escalation protocols",
    ],
    popular: true,
    href: "/services/ai-customer-support",
  },
  {
    icon: Users,
    title: "AI Sales Agent",
    description:
      "Intelligent sales conversations that qualify leads, book appointments, and close deals automatically.",
    features: [
      "Lead qualification",
      "Product recommendations",
      "Objection handling",
      "Follow-up automation",
    ],
    popular: false,
    href: "/services/ai-sales-agent",
  },
  {
    icon: MessageSquare,
    title: "AI Virtual Receptionist",
    description:
      "Professional call answering and appointment scheduling that never misses a call or opportunity.",
    features: [
      "Call screening",
      "Appointment booking",
      "Message taking",
      "Calendar integration",
    ],
    popular: false,
    href: "/services/ai-virtual-receptionist",
  },
  {
    icon: Bot,
    title: "AI Voice Bot",
    description:
      "Custom voice bots for specific business workflows with natural conversations and smart integrations.",
    features: [
      "Custom workflows",
      "API integrations",
      "Voice customization",
      "Analytics dashboard",
    ],
    popular: false,
    href: "/services/ai-voice-bot",
  },
  {
    icon: Zap,
    title: "Voice Automation Software",
    description:
      "Enterprise-grade voice automation platform with advanced features and unlimited scalability.",
    features: [
      "No-code builder",
      "Enterprise security",
      "Custom integrations",
      "Dedicated support",
    ],
    popular: false,
    href: "/services/voice-automation-software",
  },
];

const industries = [
  { name: "Healthcare", icon: Headphones, description: "Patient scheduling & support" },
  { name: "Real Estate", icon: Globe, description: "Property inquiries & tours" },
  { name: "Hospitality", icon: Shield, description: "Reservations & guest services" },
  { name: "E-commerce", icon: Smartphone, description: "Order tracking & support" },
  { name: "Financial Services", icon: BarChart3, description: "Account support & queries" },
  { name: "Technology", icon: Code, description: "Technical support & demos" },
];

const stats = [
  { label: "Active Businesses", value: "500+", icon: Users },
  { label: "Conversations Handled", value: "2M+", icon: MessageSquare },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Average Response Time", value: "<1s", icon: Zap },
];

export default function Services() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 text-gray-900 relative overflow-hidden">
      <Header />

      {/* Hero Section - Cyberpunk Design */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
        {/* Cyberpunk Grid Background */}
        <div className="fixed inset-0 z-0" style={{
          background: 'linear-gradient(rgba(234, 88, 12, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 88, 12, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Cyberpunk Floating Elements */}
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-br from-sky-400/15 via-sky-500/15 to-sky-600/15 rounded-full filter blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-bl from-sky-400/15 via-sky-600/15 to-sky-600/15 rounded-full filter blur-2xl animate-float-reverse"></div>
        
        <div className="relative z-10 container mx-auto text-left md:text-center">
          {/* Breadcrumb */}
          <nav className="flex justify-start md:justify-center mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-xs bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-sky-400/20 shadow-md shadow-sky-500/15">
              <li>
                <Link href="/" className="text-gray-900 hover:text-sky-600 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li className="text-gray-900">→</li>
              <li className="text-sky-600 font-bold">Services</li>
            </ol>
          </nav>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 uppercase tracking-wide">
            <span className="block mb-2 shimmer-text text-sky-600" style={{
              textShadow: '0 0 15px rgba(234, 88, 12, 0.3)'
            }}>
              What AI Voice Assistant
            </span>
            <span className="inline-block px-4 py-2 text-white bg-sky-500 shadow-lg text-lg sm:text-xl lg:text-2xl relative overflow-hidden border border-sky-400 hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
            }}>
              <span className="relative z-10 font-black tracking-wide">Services Do We Offer?</span>
            </span>
          </h1>
          
          <div className="max-w-5xl mx-auto mb-6 p-4 bg-gradient-to-r from-sky-500/8 via-white/90 to-sky-600/8 border border-sky-400/30 rounded-xl shadow-lg backdrop-blur-md" style={{
            clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
          }}>
            <p className="text-sm sm:text-base text-gray-900 leading-relaxed">
              We provide <span className="font-bold text-sky-600">comprehensive AI voice assistant services</span> including AI call centers, customer support automation, sales agents, and virtual receptionists. 
              Trusted by <span className="font-extrabold shimmer-text text-sky-600">500+ businesses</span> across <span className="font-extrabold shimmer-text text-sky-600">25+ countries</span> to handle <span className="font-extrabold shimmer-text text-sky-600">2M+ conversations</span> monthly.
            </p>
          </div>
          
          {/* Stats Grid - Modern Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-6xl mx-auto mb-8">
            {stats.map((stat, index) => {
              return (
                <div
                  key={index}
                  className="bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 shadow-md hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] hover:scale-102 transition-all duration-300 relative overflow-hidden group"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-tr from-sky-400/15 via-sky-500/15 to-sky-600/15 rounded-full opacity-15 filter blur-2xl group-hover:opacity-25 transition-opacity"></div>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-bl from-sky-400/15 via-sky-600/15 to-sky-600/15 rounded-full opacity-15 filter blur-2xl group-hover:opacity-25 transition-opacity"></div>
                  <stat.icon className="h-5 w-5 mx-auto mb-2 text-sky-600 relative z-10" />
                  <div className="text-xl font-extrabold shimmer-text text-sky-600 mb-1 relative z-10">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-900 font-semibold relative z-10 uppercase tracking-wide">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-start md:justify-center">
            <Link href="/contact">
              <button className="bg-sky-500 text-white hover:bg-sky-600 font-bold px-4 py-3 text-sm uppercase tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] flex items-center" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="bg-transparent text-sky-600 border border-sky-400 hover:bg-sky-400/10 font-bold px-4 py-3 text-sm uppercase tracking-wide transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(234,88,12,0.2)]" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid - Modern Design */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
        {/* Modern Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-300/15 via-sky-500/15 to-sky-500/15 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-300/15 via-sky-400/15 to-sky-500/15 rounded-full filter blur-2xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-left md:text-center mb-10">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-sky-500/8 border border-sky-400/20 text-sky-600 font-bold text-xs uppercase tracking-wide shadow-md" style={{
                clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                boxShadow: '0 0 10px rgba(234, 88, 12, 0.15)'
              }}>
                ⭐ Premium AI Services
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 uppercase tracking-wide">
              <span className="block mb-2 shimmer-text text-sky-600" style={{
                textShadow: '0 0 15px rgba(234, 88, 12, 0.3)'
              }}>
                Our AI Voice Assistant
              </span>
              <span className="inline-block px-4 py-2 text-white bg-sky-500 shadow-lg border border-sky-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                Service Suite
              </span>
            </h2>
            <p className="text-sm text-gray-900 max-w-4xl mx-auto leading-relaxed">
              Choose from our <span className="font-bold text-sky-600">comprehensive suite</span> of AI-powered voice solutions designed to <span className="font-bold text-sky-600">automate and enhance</span> every aspect of your business communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, index) => {
              const serviceImages = [
                'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400&auto=format&fit=crop', // AI Call Center
                'https://images.unsplash.com/photo-1553775282-20af80779df7?q=80&w=400&auto=format&fit=crop', // AI Customer Support
                'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=400&auto=format&fit=crop', // AI Sales Agent
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', // AI Virtual Receptionist
                'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=400&auto=format&fit=crop', // AI Voice Bot
                'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&auto=format&fit=crop'  // Voice Automation
              ];
              
              return (
                <Link key={index} href={service.href}>
                  <Card className="relative bg-white border border-sky-400/20 hover:border-sky-300/40 hover:scale-102 hover:shadow-[0_0_25px_rgba(234,88,12,0.3)] shadow-md hover:shadow-lg transition-all duration-300 h-full group cursor-pointer overflow-hidden" style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}>
                    {/* HD Service Image */}
                    <div className="relative h-24 sm:h-28 overflow-hidden">
                      <img 
                        src={serviceImages[index]} 
                        alt={`${service.title} - AI Voice Assistant Service`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent"></div>
                      <div className="absolute top-2 left-2">
                        <div className="p-1 bg-sky-400/15 backdrop-blur-sm border border-sky-300/20 rounded">
                          <service.icon className="h-4 w-4 text-sky-600" />
                        </div>
                      </div>
                    </div>

                    {/* Modern Glow Effect */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-sky-300/20 via-sky-400/20 to-sky-300/20 rounded-full filter blur-2xl group-hover:blur-xl transition-all"></div>
                    
                    {/* Numbered Badge - Modern */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white rounded-lg flex items-center justify-center font-extrabold text-sm shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border border-sky-400" style={{
                      boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)'
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {service.popular && (
                      <Badge className="absolute -top-2 right-4 bg-sky-500 text-white shadow-lg animate-pulse border-2 border-sky-400">
                        ⭐ Popular
                      </Badge>
                    )}

                    <CardHeader className="pt-4 pb-3">
                      <CardTitle className="text-sm font-bold text-sky-600 mb-2 text-center group-hover:text-sky-600 transition-all uppercase tracking-wide">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-900 text-center leading-relaxed text-xs">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <ul className="space-y-1 mb-4">
                        {service.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-xs text-gray-900 group-hover:text-gray-900 transition-colors"
                          >
                            <div className="w-3 h-3 rounded-full bg-sky-500 flex items-center justify-center mr-2 flex-shrink-0">
                              <Check className="h-2 w-2 text-white" />
                            </div>
                            <span className="font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-center text-sky-600 group-hover:text-sky-600 transition-colors font-bold pt-3 border-t border-sky-400/15 uppercase tracking-wide text-xs">
                        Learn More
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries Section - Modern */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
        {/* Modern Grid Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, rgba(234, 88, 12, 0.2) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(234, 88, 12, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-left md:text-center mb-10">
            <div className="inline-block mb-4" style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
            }}>
              <span className="px-4 py-2 bg-sky-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg border border-sky-400 block" style={{
                boxShadow: '0 0 12px rgba(234, 88, 12, 0.4)'
              }}>
                🌍 Global Reach
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              <span className="block mb-2 shimmer-text text-sky-600" style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                background: 'linear-gradient(90deg, #ea580c, #ea7f1f, #ea580c)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                Industries We Serve
              </span>
              <span className="inline-block text-gray-900 text-lg font-semibold">
                Across <span className="text-sky-600">25+ Countries</span>
              </span>
            </h2>
            <p className="text-sm text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Our AI voice assistants are <span className="font-bold text-sky-600">trusted across multiple industries</span> to deliver exceptional customer experiences and <span className="font-bold text-sky-600">operational efficiency</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {industries.map((industry, index) => {
              const industryImages = [
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400&auto=format&fit=crop', // Healthcare
                'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&auto=format&fit=crop', // Real Estate
                'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop', // E-commerce
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop', // Finance
                'https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=400&auto=format&fit=crop', // Hospitality
                'https://images.unsplash.com/photo-1497486751825-1233686d5d80?q=80&w=400&auto=format&fit=crop'  // Education
              ];
              
              return (
                <Card
                  key={index}
                  className="bg-white border border-sky-400/15 hover:border-sky-300/30 hover:scale-102 hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
                  }}
                >
                  <CardContent className="p-4 text-center relative">
                    {/* HD Industry Image */}
                    <div className="relative w-full h-20 mb-3 overflow-hidden" style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                    }}>
                      <img 
                        src={industryImages[index]} 
                        alt={`${industry.name} - AI Voice Solutions`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"></div>
                      <div className="absolute bottom-1 left-1">
                        <div className="p-1 bg-sky-400/15 backdrop-blur-sm border border-sky-300/20 rounded">
                          <industry.icon className="h-4 w-4 text-sky-300" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Modern Glow */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-sky-300/15 via-sky-400/15 to-sky-300/15 rounded-full filter blur-xl group-hover:blur-lg transition-all"></div>
                    
                    <h3 className="text-sm font-bold text-sky-600 mb-2 group-hover:text-sky-600 transition-all relative z-10 uppercase tracking-wide">
                      {industry.name}
                    </h3>
                    <p className="text-xs text-gray-700 font-medium relative z-10">{industry.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section - Modern */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 overflow-hidden">
        {/* Modern Background */}
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-sky-300/15 via-sky-400/15 to-sky-500/15 rounded-full filter blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-gradient-to-bl from-sky-300/15 via-sky-500/15 to-sky-500/15 rounded-full filter blur-2xl"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-left md:text-center mb-10">
            <div className="inline-block mb-4" style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
            }}>
              <span className="px-4 py-2 bg-sky-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg border border-sky-400 block" style={{
                boxShadow: '0 0 12px rgba(234, 88, 12, 0.4)'
              }}>
                🚀 Simple Setup
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
              <span className="block mb-2 text-gray-900">
                How Do Our AI Voice
              </span>
              <span className="inline-block px-4 py-2 text-white bg-sky-500 shadow-lg border border-sky-400" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                boxShadow: '0 0 20px rgba(234, 88, 12, 0.4)'
              }}>
                Services Work?
              </span>
            </h2>
            <p className="text-sm text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Get started in <span className="font-bold text-sky-600">three simple steps</span> and transform your business communication with <span className="font-bold text-sky-600">AI voice technology</span>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                step: "1",
                title: "Consultation & Setup",
                description: "We analyze your business needs and configure your AI voice assistant with custom workflows, integrations, and brand personality.",
              },
              {
                step: "2",
                title: "Training & Integration",
                description: "Our team trains your AI on your specific use cases and seamlessly integrates with your existing CRM, phone system, and tools.",
              },
              {
                step: "3",
                title: "Launch & Optimize",
                description: "Go live with 24/7 AI voice support and continuously improve performance with real-time analytics and ongoing optimization.",
              },
            ].map((item, idx) => {
              return (
                <div
                  key={idx}
                  className="relative bg-white p-6 border border-sky-400/20 hover:border-sky-300/40 hover:scale-102 hover:shadow-[0_0_20px_rgba(234,88,12,0.2)] shadow-md hover:shadow-lg transition-all duration-300 group overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                  }}
                >
                  {/* Modern Glow */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-sky-300/20 via-sky-400/20 to-sky-300/20 rounded-full filter blur-2xl group-hover:blur-xl transition-all"></div>
                  
                  {/* Step Number Badge - Modern */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-sky-500 text-white font-extrabold text-lg shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 border-2 border-sky-400 flex items-center justify-center" style={{
                    clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                    boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)'
                  }}>
                    {item.step}
                  </div>

                  <div className="pt-8 relative z-10">
                    <h3 className="text-lg font-extrabold text-sky-600 mb-3 text-center group-hover:text-sky-600 transition-all uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-gray-700 text-center leading-relaxed font-medium text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section - Modern */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50 relative overflow-hidden" role="region" aria-labelledby="faq-section">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-sky-500/15 to-sky-600/15 rounded-full filter blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-sky-400/15 to-sky-500/15 rounded-full filter blur-2xl animate-float-reverse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-sky-500/15 to-sky-600/15 rounded-full filter blur-2xl animate-pulse"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-left md:text-center mb-10">
            <div className="inline-block mb-4" style={{
              clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
            }}>
              <span className="px-4 py-2 bg-sky-500 text-white font-bold text-xs uppercase tracking-wide shadow-lg block" style={{
                boxShadow: '0 0 12px rgba(234, 88, 12, 0.4)'
              }}>
                Got Questions? We've Got Answers
              </span>
            </div>
            <h2 id="faq-section" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
              <span className="block mb-2 text-gray-900">Frequently Asked</span>
              <span className="shimmer-text text-sky-600" style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                background: 'linear-gradient(90deg, #ea580c, #ea7f1f, #ea580c)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'shimmer 2s infinite'
              }}>
                Questions
              </span>
            </h2>
            <p className="text-gray-700 text-sm max-w-4xl mx-auto leading-relaxed">
              Everything you need to know about <span className="text-sky-600 font-semibold">AI Voice Assistant Services</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* FAQ 1 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)'
              }}>
                01
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                What AI voice assistant services do you offer?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                We offer comprehensive AI voice solutions including AI call centers, customer support automation, sales agents, virtual receptionists, voice bots, and enterprise voice automation software. Each service is customizable to your business needs and integrates seamlessly with your existing systems.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)'
              }}>
                02
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                How quickly can I implement AI voice services?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Most businesses launch their AI voice assistant within 5-10 days. We handle setup, CRM integration, conversation training, and testing. Our team provides hands-on support to ensure smooth deployment and immediate value delivery.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 10px rgba(234, 88, 12, 0.4)'
              }}>
                03
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                Which industries benefit from AI voice assistants?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                AI voice assistants transform healthcare, real estate, hospitality, e-commerce, financial services, and technology sectors. Any business with customer communication needs benefits from 24/7 availability, instant responses, and scalable automation without hiring additional staff.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                04
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                Can AI voice services integrate with my existing systems?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Yes! Our AI voice platform integrates with popular CRMs (Salesforce, HubSpot, Zoho), phone systems, help desk software, scheduling tools, and custom APIs. We ensure seamless data flow and real-time synchronization with your tech stack.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                05
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                What ROI can I expect from AI voice automation?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Businesses typically see 40-60% cost reduction, 85% faster response times, and 45% higher conversion rates. AI voice services deliver ROI within 30-60 days by eliminating staffing costs, reducing missed calls, and providing 24/7 availability without overtime or benefits.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                06
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                Is AI voice technology secure and compliant?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Absolutely. Our platform is SOC 2 and HIPAA compliant with end-to-end encryption, data privacy controls, GDPR compliance, and comprehensive audit trails. All conversations are encrypted and stored securely with role-based access controls.
              </p>
            </div>

            {/* FAQ 7 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                07
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                How does AI handle multiple languages?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Our AI voice assistants support 60+ languages with natural accents and context-aware translations. The system automatically detects the caller's language and responds fluently, making it perfect for global businesses serving diverse customer bases.
              </p>
            </div>

            {/* FAQ 8 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                08
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                What support do you provide after launch?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                We provide 24/7 technical support, regular performance optimization, conversation training updates, analytics reviews, and dedicated account management. Our team monitors your AI continuously and makes improvements based on real conversation data.
              </p>
            </div>

            {/* FAQ 9 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                09
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                Can I customize the AI voice and personality?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Yes! You can customize voice tone, personality, speaking style, and conversation flow to match your brand. Choose from multiple voice options, adjust response speeds, and train the AI on your specific terminology and brand guidelines.
              </p>
            </div>

            {/* FAQ 10 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                10
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                Do I need technical expertise to use AI voice services?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Not at all! Our platform features a no-code visual builder for creating and managing conversations. We handle all technical setup, integration, and maintenance. You simply define your business rules and we make the AI work for you.
              </p>
            </div>

            {/* FAQ 11 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                11
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                How scalable are AI voice assistant services?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Infinitely scalable! Our cloud infrastructure handles unlimited concurrent calls without quality degradation. Whether you receive 10 calls or 10,000 calls daily, the AI maintains consistent performance with no additional setup or hiring required.
              </p>
            </div>

            {/* FAQ 12 */}
            <div className="group relative bg-white backdrop-blur-md p-4 border border-sky-400/20 hover:border-sky-300/40 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(234,88,12,0.2)]" style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-md rotate-12 group-hover:rotate-0 transition-transform" style={{
                clipPath: 'polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))',
                boxShadow: '0 0 15px rgba(234, 88, 12, 0.5)'
              }}>
                12
              </div>
              <h3 className="text-sm font-bold text-sky-600 mb-3 mt-2 uppercase tracking-wide">
                What analytics and reporting do you provide?
              </h3>
              <p className="text-gray-700 leading-relaxed text-xs">
                Our real-time dashboard shows call volume, conversation outcomes, customer sentiment, response times, conversion rates, and ROI metrics. Access detailed transcripts, identify trends, and export custom reports to track performance against your business KPIs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Modern */}
      <section className="py-12 px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100/30 to-blue-50">
        {/* Modern Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-8">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle, rgba(234, 88, 12, 0.3) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-sky-400/20 via-sky-500/20 to-sky-600/20 rounded-full filter blur-2xl animate-float-slow"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-sky-400/20 via-sky-500/20 to-sky-600/20 rounded-full filter blur-2xl animate-float-reverse"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="bg-white p-6 md:p-8 border-2 border-sky-400/30 hover:border-sky-300/50 shadow-lg hover:shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:scale-[1.01] transition-all text-left md:text-center relative overflow-hidden group" style={{
            clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
          }}>
            {/* Modern Inner Glow */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-sky-300/20 via-sky-400/20 to-sky-500/20 rounded-full filter blur-3xl group-hover:blur-2xl transition-all"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-tl from-sky-300/20 via-sky-500/20 to-sky-300/20 rounded-full filter blur-3xl group-hover:blur-2xl transition-all"></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-6" style={{
                clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)'
              }}>
                <span className="px-6 py-3 bg-sky-500 text-white font-bold text-sm uppercase tracking-wider shadow-2xl block border-2 border-sky-400" style={{
                  boxShadow: '0 0 20px rgba(234, 88, 12, 0.5)'
                }}>
                  Limited Time Offer
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">
                <span className="block mb-2 text-gray-900">
                  Ready to Transform Your
                </span>
                <span className="inline-block px-4 py-2 text-white bg-sky-500 shadow-lg border border-sky-400 animate-gradient relative" style={{
                  clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                  boxShadow: '0 0 20px rgba(234, 88, 12, 0.4)'
                }}>
                  <span className="relative z-10">Business Communication?</span>
                </span>
              </h2>
              
              <div className="max-w-3xl mx-auto mb-6 p-4 bg-gradient-to-r from-sky-500/8 via-sky-400/4 to-sky-500/8 border border-sky-400/20" style={{
                clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))'
              }}>
                <p className="text-sm text-gray-900 leading-relaxed font-medium">
                  Join <span className="font-extrabold text-sky-600">500+ businesses</span> already using DigitalBot.ai to handle <span className="font-extrabold text-sky-600">millions of customer conversations</span> with AI voice technology. <span className="font-bold text-sky-600">Start your free trial today</span>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Link href="/contact">
                  <Button className="bg-sky-500 text-white hover:bg-sky-600 hover:scale-102 transition-all px-6 py-3 text-sm font-bold shadow-lg border border-sky-400 uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                    boxShadow: '0 0 15px rgba(234, 88, 12, 0.4)'
                  }}>
                    Start Free Trial Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline" className="border border-sky-400 text-sky-600 hover:bg-sky-400/10 px-6 py-3 text-sm font-bold shadow-md hover:scale-102 transition-all uppercase tracking-wide" style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))'
                  }}>
                    View Pricing Plans
                  </Button>
                </Link>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-900 text-sm mt-8">
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" style={{
                    boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)'
                  }}></span>
                  <span className="font-semibold text-gray-900 uppercase tracking-wide">No Credit Card Required</span>
                </span>
                <span className="text-sky-500">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" style={{
                    boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)'
                  }}></span>
                  <span className="font-semibold text-gray-900 uppercase tracking-wide">Cancel Anytime</span>
                </span>
                <span className="text-sky-500">•</span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 animate-pulse" style={{
                    boxShadow: '0 0 10px rgba(234, 88, 12, 0.5)'
                  }}></span>
                  <span className="font-semibold text-gray-900 uppercase tracking-wide">5-Min Setup</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Structured Data - Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "AI Voice Assistant Services",
            "description": "Comprehensive AI voice assistant services including AI call center, customer support, sales agents, and virtual receptionists. Trusted by 500+ businesses across 25+ countries.",
            "provider": {
              "@type": "Organization",
              "name": "DigitalBot.ai",
              "url": "https://digitalbot.ai",
              "logo": "https://digitalbot.ai/images/logos/logo.svg",
              "foundingDate": "2024",
              "description": "Leading AI voice assistant platform serving 500+ businesses",
            },
            "serviceType": "AI Voice Assistant Services",
            "areaServed": {
              "@type": "GeoShape",
              "name": "Global - 25+ Countries",
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "AI Voice Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Call Center",
                    "description": "24/7 automated call handling with intelligent routing and real-time analytics",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Customer Support",
                    "description": "Instant, personalized customer service that resolves issues 24/7",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Sales Agent",
                    "description": "Intelligent sales conversations that qualify leads and book appointments",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Virtual Receptionist",
                    "description": "Professional call answering and appointment scheduling 24/7",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Voice Bot",
                    "description": "Custom voice bots for specific business workflows",
                  },
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Voice Automation Software",
                    "description": "Enterprise-grade voice automation platform",
                  },
                },
              ],
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500",
            },
          }),
        }}
      />

      {/* Structured Data - FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What AI voice assistant services do you offer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer comprehensive AI voice solutions including AI call centers, customer support automation, sales agents, virtual receptionists, voice bots, and enterprise voice automation software. Each service is customizable to your business needs and integrates seamlessly with your existing systems."
                }
              },
              {
                "@type": "Question",
                "name": "How quickly can I implement AI voice services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most businesses launch their AI voice assistant within 5-10 days. We handle setup, CRM integration, conversation training, and testing. Our team provides hands-on support to ensure smooth deployment and immediate value delivery."
                }
              },
              {
                "@type": "Question",
                "name": "Which industries benefit from AI voice assistants?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "AI voice assistants transform healthcare, real estate, hospitality, e-commerce, financial services, and technology sectors. Any business with customer communication needs benefits from 24/7 availability, instant responses, and scalable automation without hiring additional staff."
                }
              },
              {
                "@type": "Question",
                "name": "Can AI voice services integrate with my existing systems?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! Our AI voice platform integrates with popular CRMs (Salesforce, HubSpot, Zoho), phone systems, help desk software, scheduling tools, and custom APIs. We ensure seamless data flow and real-time synchronization with your tech stack."
                }
              },
              {
                "@type": "Question",
                "name": "What ROI can I expect from AI voice automation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Businesses typically see 40-60% cost reduction, 85% faster response times, and 45% higher conversion rates. AI voice services deliver ROI within 30-60 days by eliminating staffing costs, reducing missed calls, and providing 24/7 availability without overtime or benefits."
                }
              },
              {
                "@type": "Question",
                "name": "Is AI voice technology secure and compliant?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. Our platform is SOC 2 and HIPAA compliant with end-to-end encryption, data privacy controls, GDPR compliance, and comprehensive audit trails. All conversations are encrypted and stored securely with role-based access controls."
                }
              },
              {
                "@type": "Question",
                "name": "How does AI handle multiple languages?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI voice assistants support 60+ languages with natural accents and context-aware translations. The system automatically detects the caller's language and responds fluently, making it perfect for global businesses serving diverse customer bases."
                }
              },
              {
                "@type": "Question",
                "name": "What support do you provide after launch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We provide 24/7 technical support, regular performance optimization, conversation training updates, analytics reviews, and dedicated account management. Our team monitors your AI continuously and makes improvements based on real conversation data."
                }
              },
              {
                "@type": "Question",
                "name": "Can I customize the AI voice and personality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! You can customize voice tone, personality, speaking style, and conversation flow to match your brand. Choose from multiple voice options, adjust response speeds, and train the AI on your specific terminology and brand guidelines."
                }
              },
              {
                "@type": "Question",
                "name": "Do I need technical expertise to use AI voice services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not at all! Our platform features a no-code visual builder for creating and managing conversations. We handle all technical setup, integration, and maintenance. You simply define your business rules and we make the AI work for you."
                }
              },
              {
                "@type": "Question",
                "name": "How scalable are AI voice assistant services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Infinitely scalable! Our cloud infrastructure handles unlimited concurrent calls without quality degradation. Whether you receive 10 calls or 10,000 calls daily, the AI maintains consistent performance with no additional setup or hiring required."
                }
              },
              {
                "@type": "Question",
                "name": "What analytics and reporting do you provide?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our real-time dashboard shows call volume, conversation outcomes, customer sentiment, response times, conversion rates, and ROI metrics. Access detailed transcripts, identify trends, and export custom reports to track performance against your business KPIs."
                }
              }
            ]
          }),
        }}
      />
    </main>
  );
}









