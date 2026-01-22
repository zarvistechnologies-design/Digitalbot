import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PageBackground } from "@/components/page-background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    <main className="min-h-screen bg-white">
      <PageBackground />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
            Documentation
          </h1>
          <p className="text-lg sm:text-xl font-semibold bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg shadow-sky-500/30 border border-sky-500/30 text-gray-700 mb-8 max-w-3xl mx-auto">
            Everything you need to build, deploy, and manage <span className="font-bold bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 bg-clip-text text-transparent">intelligent AI voice assistants</span> with DigitalBot.ai
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-700 hover:to-sky-900 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50">
              View API Reference
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {docSections.map((section, index) => (
              <Card key={index} className="border-2 border-sky-500 bg-white hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <section.icon className="h-6 w-6 text-sky-700" />
                    </div>
                    <Badge variant="secondary" className="bg-sky-100 text-sky-700">{section.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl text-sky-800">{section.title}</CardTitle>
                  <CardDescription className="text-gray-600">{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {section.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-center text-sm text-gray-600 hover:text-sky-700 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full border-sky-500 text-sky-700 hover:bg-sky-50 bg-transparent"
                  >
                    Explore Section
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-sky-800 mb-4">Quick Links</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Jump to the most commonly accessed resources
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Card
                key={index}
                className="border-2 border-sky-500 bg-white hover:shadow-md hover:shadow-sky-500/30 transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-sky-800 mb-2 group-hover:text-sky-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-sky-500 shadow-lg shadow-sky-500/30">
            <h2 className="text-3xl font-bold text-sky-800 mb-4">Need Help?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button size="lg" className="bg-gradient-to-r from-sky-600 to-sky-800 hover:from-sky-700 hover:to-sky-900 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-sky-500 text-sky-700 hover:bg-sky-50 bg-transparent">
                Join Community
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}






