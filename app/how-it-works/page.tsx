"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  CheckCircle,
  UserPlus,
  Settings,
  Link as LinkIcon,
  Zap,
  Brain,
  BarChart3,
  Users,
  Workflow,
  Shield,
  TrendingUp,
  Sparkles,
  Star,
  Quote
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-accent/5 pt-32 pb-24 lg:pt-44 lg:pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Floating orbs */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-[10%] h-72 w-72 rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-20 right-[10%] h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
        />
        
        <div className="container relative mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div variants={fadeInScale}>
              <Badge className="mb-8 bg-gradient-to-r from-accent/10 to-blue-500/10 text-accent hover:from-accent/20 hover:to-blue-500/20 border-accent/20 px-4 py-1.5">
                <Sparkles className="mr-2 h-4 w-4" />
                Simple & Powerful
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl"
            >
              How DigitalBot{" "}
              <motion.span 
                className="bg-gradient-to-r from-accent via-blue-500 to-amber-500 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%',
                }}
              >
                Works
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="mb-12 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
            >
              Transform your business communications in four simple steps—no technical expertise required
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white group px-8 py-6 text-base shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all"
              >
                <Link href="/signup">
                  Try DigitalBot Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group px-8 py-6 text-base border-2 hover:border-accent/50 hover:bg-accent/5"
              >
                <Link href="#demo">
                  <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                  Watch Demo
                </Link>
              </Button>
            </motion.div>

            {/* Decorative illustration */}
            <motion.div
              variants={fadeInScale}
              className="relative"
            >
              <div className="rounded-3xl border-2 border-accent/10 bg-gradient-to-br from-background via-accent/5 to-background p-12 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-center gap-6 sm:gap-10 lg:gap-16 flex-wrap">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Brain className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-accent drop-shadow-lg" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Zap className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-accent drop-shadow-lg" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <ArrowRight className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <TrendingUp className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 text-accent drop-shadow-lg" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Step-by-Step Flow */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-32 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 -right-32 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-20 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Badge className="mb-4 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
                <Sparkles className="mr-1 h-3 w-3" />
                Getting Started
              </Badge>
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Simple Steps to Get Started
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Launch your AI-powered call center in minutes with our intuitive setup process
            </p>
          </motion.div>

          {/* Desktop Flow with Connecting Lines */}
          <div className="hidden lg:block relative">
            {/* Connecting Line SVG */}
            <motion.svg
              className="absolute top-24 left-0 w-full h-2 -z-0"
              viewBox="0 0 100 2"
              preserveAspectRatio="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            >
              <motion.path
                d="M 10,1 L 90,1"
                stroke="url(#gradient)"
                strokeWidth="0.5"
                fill="none"
                strokeDasharray="2 2"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </motion.svg>

            <div className="grid grid-cols-4 gap-8">
              {[
                {
                  icon: UserPlus,
                  number: "01",
                  title: "Create Your Account",
                  description: "Sign up in 60 seconds with your email. No credit card required to start your free trial.",
                  delay: 0
                },
                {
                  icon: Settings,
                  number: "02",
                  title: "Define Your Use Cases",
                  description: "Choose from pre-built templates for customer support, sales, scheduling, or customize your own AI workflows.",
                  delay: 0.2
                },
                {
                  icon: LinkIcon,
                  number: "03",
                  title: "Connect Your Data",
                  description: "Integrate with your CRM, calendar, and business tools. One-click connections to Salesforce, HubSpot, Google Calendar, and more.",
                  delay: 0.4
                },
                {
                  icon: Zap,
                  number: "04",
                  title: "Automate & Optimize",
                  description: "Launch your AI agents and watch real-time analytics. Continuously optimize with insights from every conversation.",
                  delay: 0.6
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: step.delay,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  {/* Number Badge at Top */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: step.delay + 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-white font-bold text-lg shadow-lg shadow-accent/50">
                        {step.number}
                      </div>
                      {/* Pulse animation */}
                      <motion.div
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                        className="absolute inset-0 rounded-full bg-accent"
                      />
                    </div>
                  </motion.div>

                  <Card className="relative h-full overflow-hidden border-2 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 group mt-8 bg-gradient-to-br from-background to-accent/5">
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="p-6 relative">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-blue-500/20 text-accent border border-accent/20 shadow-lg"
                      >
                        <step.icon className="h-8 w-8" />
                      </motion.div>

                      <h3 className="mb-3 text-xl font-bold group-hover:text-accent transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>

                      {/* Arrow indicator */}
                      <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-6 flex items-center gap-2 text-accent text-sm font-medium"
                      >
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.div>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                          {index === 3 ? "Get Started" : "Next Step"}
                        </span>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Flow */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:hidden"
          >
            {[
              {
                icon: UserPlus,
                number: "01",
                title: "Create Your Account",
                description: "Sign up in 60 seconds with your email. No credit card required to start your free trial."
              },
              {
                icon: Settings,
                number: "02",
                title: "Define Your Use Cases",
                description: "Choose from pre-built templates for customer support, sales, scheduling, or customize your own AI workflows."
              },
              {
                icon: LinkIcon,
                number: "03",
                title: "Connect Your Data",
                description: "Integrate with your CRM, calendar, and business tools. One-click connections to Salesforce, HubSpot, Google Calendar, and more."
              },
              {
                icon: Zap,
                number: "04",
                title: "Automate & Optimize",
                description: "Launch your AI agents and watch real-time analytics. Continuously optimize with insights from every conversation."
              }
            ].map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="relative h-full overflow-hidden border-2 hover:border-accent/50 hover:shadow-xl transition-all group bg-gradient-to-br from-background to-accent/5">
                  <div className="absolute top-4 right-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-white font-bold shadow-lg shadow-accent/30">
                      {step.number}
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20"
                    >
                      <step.icon className="h-7 w-7" />
                    </motion.div>
                    
                    <h3 className="mb-3 text-xl font-bold group-hover:text-accent transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                    
                    <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-accent" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="border-t bg-gradient-to-b from-background via-accent/3 to-background py-24 lg:py-32 relative overflow-hidden">
        {/* Background decoration */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-full blur-3xl" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.div variants={fadeInScale}>
              <Badge className="mb-6 bg-gradient-to-r from-accent/10 to-blue-500/10 text-accent hover:from-accent/20 hover:to-blue-500/20 border-accent/20 px-4 py-1.5">
                <Sparkles className="mr-2 h-4 w-4" />
                Capabilities
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6"
            >
              What You Can Do with DigitalBot
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Powerful features designed to transform every customer interaction
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
          >
            {[
              {
                icon: Brain,
                title: "Intelligent Automation",
                description: "AI-powered conversation flows that understand context, intent, and sentiment to deliver natural interactions.",
                gradient: "from-accent to-blue-500"
              },
              {
                icon: BarChart3,
                title: "Real-Time Insights",
                description: "Comprehensive analytics dashboards with live call metrics, performance tracking, and actionable business intelligence.",
                gradient: "from-blue-500 to-amber-500"
              },
              {
                icon: LinkIcon,
                title: "Cross-Platform Integrations",
                description: "Seamlessly connect with your existing tech stack including CRMs, calendars, helpdesks, and communication tools.",
                gradient: "from-accent to-blue-600"
              },
              {
                icon: Workflow,
                title: "Custom Workflows",
                description: "Build and deploy custom conversation flows with our visual workflow builder—no coding required.",
                gradient: "from-blue-600 to-accent"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Manage multiple team members with role-based access, shared workspaces, and collaborative call handling.",
                gradient: "from-accent to-blue-400"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption, GDPR compliance, and SOC 2 certified infrastructure to keep your data secure.",
                gradient: "from-blue-400 to-accent"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full border-2 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 transition-all duration-300 group relative overflow-hidden bg-gradient-to-br from-background to-accent/5">
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <CardContent className="p-8 relative z-10">
                    <motion.div 
                      className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-xl shadow-accent/20`}
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="h-8 w-8" />
                    </motion.div>
                    <h3 className="mb-4 text-xl font-bold group-hover:text-accent transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {feature.description}
                    </p>
                    
                    {/* Animated bottom accent */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-blue-500"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why DigitalBot Works */}
      <section className="border-t py-24 lg:py-32 relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-blue-500/5"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.div variants={fadeInScale}>
              <Badge className="mb-6 bg-gradient-to-r from-accent/10 to-blue-500/10 text-accent hover:from-accent/20 hover:to-blue-500/20 border-accent/20 px-4 py-1.5">
                <Shield className="mr-2 h-4 w-4" />
                Why Choose Us
              </Badge>
            </motion.div>
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6"
            >
              Why DigitalBot Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Built on proven technology and designed for reliability at scale
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Shield,
                title: "99.9% Uptime",
                description: "Enterprise-grade reliability with redundant infrastructure",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Sub-second response times for instant customer engagement",
                color: "from-yellow-500 to-blue-500"
              },
              {
                icon: TrendingUp,
                title: "Infinitely Scalable",
                description: "Handle 10 or 10,000 calls simultaneously without degradation",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Brain,
                title: "Continuously Learning",
                description: "AI models improve with every conversation and interaction",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: CheckCircle,
                title: "Proven Results",
                description: "Average 85% automation rate across 1000+ deployments",
                color: "from-accent to-blue-500"
              },
              {
                icon: Sparkles,
                title: "Simple to Use",
                description: "Intuitive interface designed for non-technical teams",
                color: "from-indigo-500 to-purple-500"
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="h-full border-2 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/10 transition-all duration-300 group bg-gradient-to-br from-background to-accent/5 relative overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-blue-500/10 text-accent border border-accent/20 shadow-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <benefit.icon className="h-6 w-6" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-bold text-lg group-hover:text-accent transition-colors">
                          {benefit.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom accent line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color}`}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t py-24 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0 bg-gradient-to-br from-accent/10 via-blue-500/10 to-accent/10"
          style={{
            backgroundSize: '200% 200%',
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl text-center"
          >
            <motion.div 
              variants={fadeInScale}
              className="relative"
            >
              <div className="rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-background via-accent/5 to-background p-12 lg:p-20 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Glowing orbs */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-0 right-0 h-64 w-64 bg-accent rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  className="absolute bottom-0 left-0 h-64 w-64 bg-blue-500 rounded-full blur-3xl"
                />

                <div className="relative z-10">
                  <motion.div variants={fadeInUp}>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-6xl">
                      Ready to Transform Your{" "}
                      <span className="bg-gradient-to-r from-accent via-blue-500 to-accent bg-clip-text text-transparent">
                        Workflow?
                      </span>
                    </h2>
                  </motion.div>
                  
                  <motion.p 
                    variants={fadeInUp}
                    className="mb-12 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
                  >
                    Join thousands of businesses using DigitalBot to deliver exceptional customer experiences
                  </motion.p>

                  <motion.div 
                    variants={fadeInUp}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        className="bg-accent hover:bg-accent/90 text-white group px-10 py-7 text-lg shadow-2xl shadow-accent/30 hover:shadow-3xl hover:shadow-accent/40 transition-all"
                      >
                        <Link href="/signup">
                          Start Free Trial
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </motion.div>
                        </Link>
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="px-10 py-7 text-lg border-2 hover:border-accent/50 hover:bg-accent/5 backdrop-blur-sm"
                      >
                        <Link href="/contact">
                          Contact Sales
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    variants={fadeInUp}
                    className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>14-day free trial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>Cancel anytime</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
