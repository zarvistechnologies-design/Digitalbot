import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, BookOpen, Calendar, ChevronRight, Clock, Mail, TrendingUp, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const blogPosts = [
  {
    slug: "future-of-ai-customer-service-2024",
    title: "The Future of AI Customer Service: Trends to Watch in 2026",
    excerpt: "Explore the latest developments in conversational AI and how they're reshaping customer service experiences.",
    author: "Sarah Chen",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "AI Trends",
    featured: true,
    image: "/images/blog_landingpage.png",
  },
  {
    slug: "implement-first-chatbot-guide",
    title: "How to Implement Your First Chatbot: A Step-by-Step Guide",
    excerpt: "Learn the essential steps to successfully deploy an AI chatbot for your business, from planning to launch.",
    author: "Marcus Rodriguez",
    date: "2024-01-10",
    readTime: "8 min read",
    category: "Tutorial",
    featured: false,
    image: "/images/blog_tutorial.png",
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
    image: "/images/blog_analytics.png",
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
    image: "/images/blog_technology.png",
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
    image: "/images/blog_casestudy.png",
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
    image: "/images/blog_strategy.png",
  },
]

const topics = ["All", "AI Trends", "Tutorial", "Analytics", "Technology", "Case Study", "Strategy"]

export default function Blog() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-orange-50/60 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
          <div className="container relative z-10 mx-auto max-w-7xl">
            <nav className="mb-8 flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm">
                <li>
                  <Link href="/" className="text-slate-500 transition-colors hover:text-orange-600">
                    Home
                  </Link>
                </li>
                <li><ChevronRight className="h-4 w-4 text-slate-300" /></li>
                <li className="font-medium text-orange-600">Blog</li>
              </ol>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 shadow-sm">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-orange-700">DigitalBot insights</span>
                </div>
                <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-slate-950 sm:text-5xl lg:text-6xl">
                  Ideas for building smarter customer conversations.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                  Practical guides, AI voice trends, product thinking, and customer operations playbooks for teams adopting automation.
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {topics.slice(1, 5).map((topic) => (
                    <span key={topic} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {featuredPost && (
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70">
                    <div className="relative h-[360px] overflow-hidden rounded-2xl">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                        <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">Featured</span>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">{featuredPost.category}</span>
                      </div>
                      <div className="absolute bottom-5 left-5 right-5">
                        <div className="mb-3 flex flex-wrap gap-3 text-xs font-medium text-white/80">
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(featuredPost.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{featuredPost.readTime}</span>
                        </div>
                        <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{featuredPost.title}</h2>
                      </div>
                    </div>
                  </article>
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">Explore topics</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">Latest articles and resources.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Browse practical advice for AI voice assistants, automation strategy, analytics, and customer experience.
              </p>
            </div>

            <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
              {topics.map((topic, index) => (
                <button
                  key={topic}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    index === 0
                      ? "border-slate-950 bg-slate-950 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:text-orange-600"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {regularPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  <article className="h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-slate-200/70">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-slate-950" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-semibold leading-snug text-slate-950 transition-colors group-hover:text-orange-600">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-xs font-medium text-slate-500">{new Date(post.date).toLocaleDateString()}</span>
                        <span className="inline-flex items-center text-sm font-semibold text-orange-600">
                          Read more
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
              <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white sm:p-8 lg:p-10">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2">
                  <TrendingUp className="h-4 w-4 text-orange-300" />
                  <span className="text-sm font-semibold text-orange-200">Editor&apos;s path</span>
                </div>
                <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Start with the reads that move teams fastest.</h2>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  A practical sequence for leaders evaluating AI voice automation for customer communication.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: "Plan", text: "Pick your first workflow and success metrics." },
                  { title: "Launch", text: "Design scripts, handoffs, and operational rules." },
                  { title: "Improve", text: "Use analytics to tune conversations and ROI." },
                ].map((item, index) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <span className="text-sm font-semibold text-orange-600">0{index + 1}</span>
                    <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 text-center sm:p-8 lg:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 ring-1 ring-orange-100">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">Get the next AI operations insight.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Subscribe for practical articles on AI voice agents, customer automation, and better business communication.
              </p>
              <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 text-slate-950 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button className="inline-flex h-12 items-center justify-center rounded-lg bg-orange-500 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-600">
                  Subscribe
                  <ArrowRight className="ml-2 h-5 w-5" />
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
