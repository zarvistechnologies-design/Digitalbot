"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageBackground } from "@/components/page-background";
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
  Clock,
  Heart,
  MapPin,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const openPositions = [
  {
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "San Francisco, CA",
    type: "Full-time",
    description:
      "Lead the development of our next-generation conversational AI platform.",
    requirements: ["5+ years in AI/ML", "Python expertise", "NLP experience"],
  },
  {
    title: "Product Manager - AI",
    department: "Product",
    location: "Remote",
    type: "Full-time",
    description:
      "Drive product strategy for our AI chatbot platform and customer experience.",
    requirements: [
      "3+ years product management",
      "AI/ML background",
      "Customer-focused",
    ],
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "New York, NY",
    type: "Full-time",
    description:
      "Help our enterprise customers maximize value from our AI chatbot solutions.",
    requirements: [
      "Customer success experience",
      "Technical aptitude",
      "Communication skills",
    ],
  },
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build beautiful, responsive interfaces for our chatbot management platform.",
    requirements: ["React/Next.js expertise", "TypeScript", "UI/UX sensibility"],
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description:
      "Comprehensive health, dental, and vision insurance plus wellness programs.",
  },
  {
    icon: Zap,
    title: "Growth & Learning",
    description:
      "Annual learning budget, conference attendance, and skill development opportunities.",
  },
  {
    icon: Users,
    title: "Work-Life Balance",
    description: "Flexible hours, remote culture, and unlimited paid time off.",
  },
  {
    icon: Trophy,
    title: "Equity & Rewards",
    description:
      "Competitive pay, equity options, and performance-based bonuses.",
  },
];

export default function Careers() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <PageBackground />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="relative z-10 container mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            Careers at DigitalBot.ai
          </h1>
          <p className="text-lg sm:text-xl font-semibold bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg shadow-blue-500/30 border border-blue-500/30 text-gray-700 mb-8 max-w-3xl mx-auto">
            Join our team and help shape the future of <span className="font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">AI-powered business automation</span>. We value innovation, collaboration, and growth.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 shadow-lg shadow-blue-500/40 rounded-full transition-all duration-300"
          >
            View Open Positions
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Culture  Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              Why Work With Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in empowering talent and building products that truly make
              a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="text-center border-2 border-blue-500 shadow-lg shadow-blue-500/30 bg-white/90 backdrop-blur-sm hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-500 rounded-2xl"
              >
                <CardHeader>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <benefit.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg text-blue-700 font-semibold">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore roles that fit your passion and expertise.
            </p>
          </div>

          <div className="space-y-6 max-w-4xl mx-auto">
            {openPositions.map((position, index) => (
              <Card
                key={index}
                className="border-2 border-blue-500 bg-white hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300 rounded-2xl"
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-blue-800 font-bold mb-2">
                        {position.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <Badge className="bg-blue-100 text-blue-700 font-medium">
                          {position.department}
                        </Badge>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                          {position.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-blue-500" />
                          {position.type}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)] rounded-full">
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{position.description}</p>
                  <div>
                    <h4 className="font-semibold text-blue-700 mb-2">
                      Key Requirements:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-center">
                          <ArrowRight className="h-3 w-3 mr-2 text-blue-500 shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="container mx-auto">
          <div className="bg-white/90 rounded-3xl p-12 shadow-xl shadow-blue-500/30 border-2 border-blue-500">
            <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
              Don't See the Right Role?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always looking for passionate, curious minds. Share your
              resume, and we'll reach out when the right opportunity comes along.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold rounded-full shadow-lg shadow-blue-500/40"
            >
              Send Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}





