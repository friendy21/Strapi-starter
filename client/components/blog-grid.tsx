"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Clock, TrendingUp, Lightbulb, Shield, Zap, Loader2 } from "lucide-react"
import Link from "next/link"
import { Article, getArticles, getStrapiImageUrl } from "@/lib/strapi"

// Default content types (can be fetched from Strapi categories in the future)
const contentTypes = [
  { id: "all", label: "All Insights", icon: Lightbulb },
  { id: "strategy", label: "Strategy Insights", icon: TrendingUp },
  { id: "technology", label: "Technology Briefs", icon: Zap },
  { id: "compliance", label: "Compliance Updates", icon: Shield },
]

// Service color mapping
const serviceColors: Record<string, string> = {
  strategy: "#0A2463",
  technology: "#0066CC",
  glynac: "#0066CC",
  phh: "#E2725B",
  tollbooth: "#00C49A",
  talent: "#7B68EE",
  labs: "#00D4AA",
  compliance: "#2E7D32",
  default: "#00D4AA",
}

// Fallback posts for when Strapi is unavailable
const fallbackPosts = [
  {
    id: 1,
    title: "Navigating the New Fiduciary Landscape",
    description: "Understanding the evolving regulatory requirements and their impact on advisory practices.",
    category: { slug: "compliance", name: "Compliance" },
    readTime: 8,
    image: "/regulatory-compliance-abstract.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "AI-Powered Client Engagement",
    description: "Leveraging intelligent systems to transform client relationships.",
    category: { slug: "technology", name: "Technology" },
    readTime: 6,
    image: "/ai-neural-network.png",
    featured: false,
  },
  {
    id: 3,
    title: "Real Estate Investment Strategies for 2025",
    description: "Latest insights on optimizing real estate portfolios in changing markets.",
    category: { slug: "strategy", name: "Strategy" },
    readTime: 10,
    image: "/modern-real-estate-skyline.png",
    featured: false,
  },
]

export function BlogGrid() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch articles from Strapi
  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      setError(null)
      try {
        const data = await getArticles({
          category: activeFilter !== "all" ? activeFilter : undefined
        })
        setArticles(data)
      } catch (err) {
        console.error("Failed to fetch articles:", err)
        setError("Failed to load articles")
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [activeFilter])

  // Convert Strapi article to display format
  const getDisplayPosts = () => {
    if (articles.length === 0 && !loading) {
      // Use fallback posts if no articles from Strapi
      return fallbackPosts.map(post => ({
        ...post,
        serviceColor: serviceColors[post.category?.slug || "default"] || serviceColors.default,
        service: post.category?.name || "Insights",
      }))
    }

    return articles.map((article, index) => ({
      id: article.id,
      documentId: article.documentId,
      title: article.title,
      excerpt: article.description || "",
      category: article.category?.slug || "insights",
      service: article.category?.name || "Insights",
      serviceColor: serviceColors[article.category?.slug?.toLowerCase() || "default"] || serviceColors.default,
      readTime: Math.ceil((article.content?.length || 500) / 200), // Estimate read time
      image: getStrapiImageUrl(article.cover) || "/placeholder.svg",
      featured: index === 0, // First article is featured
      slug: article.slug,
    }))
  }

  const displayPosts = getDisplayPosts()

  return (
    <div>
      {/* Filter System */}
      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {contentTypes.map((type) => {
          const Icon = type.icon
          return (
            <button
              key={type.id}
              onClick={() => setActiveFilter(type.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeFilter === type.id
                  ? "bg-[#00D4AA] text-white shadow-lg scale-105"
                  : "bg-card hover:bg-accent text-foreground border border-border"
                }`}
            >
              <Icon size={18} />
              {type.label}
            </button>
          )
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00D4AA]" />
          <span className="ml-3 text-muted-foreground">Loading insights...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => setActiveFilter(activeFilter)}
            className="px-4 py-2 bg-[#00D4AA] text-white rounded-lg hover:bg-[#00B894] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Blog Grid */}
      {!loading && !error && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group relative ${post.featured ? "md:col-span-2 md:row-span-2" : ""}`}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Link href={`/article/${post.slug || post.id}`}>
                  <div
                    className="relative h-full bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-2xl"
                    style={{
                      boxShadow:
                        hoveredCard === post.id
                          ? `0 20px 60px -10px ${post.serviceColor}40`
                          : "0 4px 6px rgba(0,0,0,0.1)",
                      borderColor: hoveredCard === post.id ? post.serviceColor : "var(--border)",
                    }}
                  >
                    {/* Service Tag */}
                    <div
                      className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
                      style={{ backgroundColor: `${post.serviceColor}dd` }}
                    >
                      {post.service}
                    </div>

                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className={`p-6 ${post.featured ? "md:p-8" : ""}`}>
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                        <Clock size={16} />
                        <span>{post.readTime} min read</span>
                      </div>

                      <h3 className={`font-bold mb-3 text-balance ${post.featured ? "text-2xl md:text-3xl" : "text-xl"}`}>
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>

                      <div className="flex items-center gap-2 text-[#00D4AA] font-semibold group-hover:gap-4 transition-all">
                        Read More
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Animated Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        border: `2px solid ${post.serviceColor}`,
                        opacity: hoveredCard === post.id ? 1 : 0,
                      }}
                      animate={{
                        opacity: hoveredCard === post.id ? [0.3, 0.6, 0.3] : 0,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {displayPosts.length === 0 && !loading && !error && (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No content found for this filter.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try selecting a different category or check back later.
          </p>
        </div>
      )}
    </div>
  )
}
