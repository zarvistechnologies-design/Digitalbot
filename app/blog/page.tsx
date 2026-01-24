import { Header } from "@/components/header"
import { PageBackground } from "@/components/page-background"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, User, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const blogPosts = [
  {
    slug: "future-of-ai-customer-service-2024",
    title: "The Future of AI Customer Service: Trends to Watch in 2024",
    excerpt:
      "Explore the latest developments in conversational AI and how they're reshaping customer service experiences.",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Trends",
    featured: true,
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&q=80"
  },
  {
    slug: "implement-first-chatbot-guide",
    title: "How to Implement Your First Chatbot: A Step-by-Step Guide",
    excerpt:
      "Learn the essential steps to successfully deploy an AI chatbot for your business, from planning to launch.",
    author: "Marcus Rodriguez",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Tutorial",
    featured: false,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=500&fit=crop&q=80"
  },
  {
    slug: "measuring-chatbot-success-metrics",
    title: "Measuring Chatbot Success: Key Metrics That Matter",
    excerpt: "Discover the most important KPIs to track when evaluating your chatbot's performance and ROI.",
    author: "Emily Watson",
    date: "2024-01-05",
    readTime: "6 min read",
    category: "Analytics",
    featured: false,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&q=80"
  },
  {
    slug: "nlp-making-chatbots-human",
    title: "Natural Language Processing: Making Chatbots More Human",
    excerpt: "Deep dive into NLP technologies that enable chatbots to understand and respond more naturally.",
    author: "David Kim",
    date: "2023-12-28",
    readTime: "10 min read",
    category: "Technology",
    featured: false,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=500&fit=crop&q=80"
  },
  {
    slug: "techcorp-case-study-40-percent-increase",
    title: "Case Study: How TechCorp Increased Customer Satisfaction by 40%",
    excerpt: "Real-world example of how implementing AI chatbots transformed a company's customer service operations.",
    author: "Sarah Chen",
    date: "2023-12-20",
    readTime: "7 min read",
    category: "Case Study",
    featured: false,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop&q=80"
  },
  {
    slug: "multi-channel-chatbot-strategy",
    title: "Multi-Channel Chatbot Strategy: Reaching Customers Everywhere",
    excerpt: "Learn how to deploy chatbots across multiple platforms for a unified customer experience.",
    author: "Marcus Rodriguez",
    date: "2023-12-15",
    readTime: "9 min read",
    category: "Strategy",
    featured: false,
    image: "https://images.unsplash.com/photo-1600267185393-e158a98703de?w=800&h=500&fit=crop&q=80"
  },
]

export default function Blog() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b bg-white py-20 md:py-32">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgb(59, 130, 246) 1px, transparent 1px),
                  linear-gradient(to bottom, rgb(168, 85, 247) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          {/* Floating Gradient Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-radial from-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-radial from-blue-200/25 to-transparent rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-blue-200/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-full px-5 py-2 mb-8 border-2 border-blue-300 shadow-lg">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-semibold">Insights & Resources</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-700 text-transparent bg-clip-text">
                  AI Voice Agent
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-transparent bg-clip-text">
                    Blog & Resources
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 via-blue-300/30 to-blue-400/30 blur-2xl -z-10 scale-110" />
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
                Explore insights and updates on AI voice assistants, automation, and business transformation. Stay ahead with our latest articles.
              </p>

              <div className="flex flex-wrap gap-6 justify-center items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-blue-500">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Latest AI Trends</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full border border-blue-500">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Expert Guides</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-full px-5 py-2 mb-4 border-2 border-blue-300 shadow-lg">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-semibold">Featured Post</span>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-blue-700 to-blue-700 text-transparent bg-clip-text">
                  Latest Insights
                </h2>
              </div>
              <div className="max-w-4xl mx-auto group">
                <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-blue-500 hover:border-blue-500 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  {/* Featured Image */}
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t bg-white to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-lg">
                      {featuredPost.category}
                    </Badge>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-700 group-hover:bg-clip-text transition-all duration-300">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <Button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                        Read Full Article
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-blue-700 to-blue-700 text-transparent bg-clip-text">
                Recent Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stay updated with the latest in AI voice technology and best practices
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <div
                  key={index}
                  className="group bg-white border-2 border-blue-500 hover:border-blue-500 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Post Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white border-none">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-blue-700 group-hover:bg-clip-text transition-all duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4 text-blue-600" />
                        <span>{post.author}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 rounded-2xl p-12 text-center border-2 border-blue-500 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-blue-700 to-blue-700 text-transparent bg-clip-text">
                Stay Updated
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest insights on AI voice agents and conversational AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-3 rounded-full border-2 border-blue-500 bg-white text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-full whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








