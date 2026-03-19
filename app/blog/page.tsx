import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
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
        <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbff] via-white to-[#f0f0ff] py-20 md:py-32">
          {/* Subtle Slate Blur Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-2 mb-8">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">Insights & Resources</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 tracking-tight mb-6 leading-tight">
                <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-violet-600 bg-clip-text text-transparent">
                  AI Voice Agent
                </span>
                <br />
                <span className="mt-2 inline-block">
                  Blog & Resources
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 leading-relaxed mb-10 max-w-3xl mx-auto">
                Explore insights and updates on AI voice assistants, automation, and business transformation. Stay ahead with our latest articles.
              </p>

              <div className="flex flex-wrap gap-4 justify-center items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Latest AI Trends</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-full">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Expert Guides</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-20 bg-gradient-to-b from-white to-[#fafbff]">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium tracking-wide text-slate-600 uppercase">Featured Post</span>
                </div>
                <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
                  Latest Insights
                </h2>
              </div>
              <div className="max-w-4xl mx-auto group">
                <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500">
                  {/* Featured Image */}
                  <div className="relative h-80 w-full overflow-hidden">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900 text-white text-xs font-medium rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4 group-hover:text-orange-600 transition-colors duration-300">
                      {featuredPost.title}
                    </h3>
                    <p className="text-lg text-slate-500 leading-relaxed mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium rounded-lg px-6 py-3 hover:bg-slate-800 transition-colors duration-300"
                    >
                      Read Full Article
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="py-20 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                Recent Articles
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto">
                Stay updated with the latest in AI voice technology and best practices
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <div
                  key={index}
                  className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
                >
                  {/* Post Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-3 group-hover:text-orange-600 transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-sm text-slate-600 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors duration-300"
                      >
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
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
        <section className="py-20 bg-gradient-to-b from-[#fafbff] to-white">
          <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto glass-card bg-orange-50/30 rounded-2xl p-12 text-center border border-orange-200/40">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                Stay Updated
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest insights on AI voice agents and conversational AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-6 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium rounded-lg px-8 py-3 whitespace-nowrap hover:bg-slate-800 transition-colors duration-300">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}








