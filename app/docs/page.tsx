import Link from "next/link"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { ArrowRight, Book, Code, ExternalLink, Shield, Zap } from "lucide-react"

const docSections = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Quick start guide to set up your first chatbot",
    items: ["Installation & Setup", "Creating Your First Bot", "Basic Configuration", "Testing Your Chatbot"],
    badge: "Beginner",
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation and code examples",
    items: ["Authentication", "Endpoints Overview", "Request/Response Format", "Error Handling"],
    badge: "Developer",
  },
  {
    icon: Zap,
    title: "Advanced Features",
    description: "Leverage powerful features for complex use cases",
    items: ["Natural Language Processing", "Custom Integrations", "Webhook Configuration", "Analytics & Reporting"],
    badge: "Advanced",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Best practices for secure chatbot deployment",
    items: ["Data Protection", "GDPR Compliance", "Authentication Methods", "Security Best Practices"],
    badge: "Security",
  },
]

const quickLinks = [
  { title: "API Keys", description: "Manage your API authentication", href: "#" },
  { title: "Webhooks", description: "Set up real-time notifications", href: "#" },
  { title: "SDKs", description: "Official libraries and tools", href: "#" },
  { title: "Changelog", description: "Latest updates and releases", href: "#" },
]

export default function Docs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff]">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbff] to-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-slate-900 leading-[1.1] tracking-tight mb-6">
            Documentation
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl mx-auto">
            Everything you need to build, deploy, and manage <span className="text-slate-800 font-medium">intelligent AI voice assistants</span> with DigitalBot.ai
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="#"
              className="group px-6 py-3 bg-gradient-to-r from-orange-600 to-violet-600 text-white font-medium rounded-lg hover:from-orange-500 hover:to-violet-500 transition-all shadow-sm btn-glow flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#"
              className="px-6 py-3 text-slate-600 font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              View API Reference
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#fafbff]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {docSections.map((section, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {section.badge}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{section.title}</h3>
                <p className="text-slate-500 mb-6">{section.description}</p>
                <ul className="space-y-2 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex items-center text-sm text-slate-500 hover:text-orange-600 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 shrink-0 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="#"
                  className="w-full py-2.5 text-slate-600 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-center block"
                >
                  Explore Section
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fafbff] to-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">Quick Links</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Jump to the most commonly accessed resources
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl p-6 hover:shadow-md transition-all group cursor-pointer"
              >
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {link.title}
                </h3>
                <p className="text-sm text-slate-500">{link.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#f0f0ff]">
        <div className="container mx-auto">
          <div className="glass-card bg-orange-50/30 border border-orange-200/40 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">Need Help?</h2>
            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                href="#"
                className="group px-6 py-3 bg-gradient-to-r from-orange-600 to-violet-600 text-white font-medium rounded-lg hover:from-orange-500 hover:to-violet-500 transition-all shadow-sm btn-glow flex items-center gap-2"
              >
                Contact Support
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="#"
                className="px-6 py-3 text-slate-600 font-medium rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


