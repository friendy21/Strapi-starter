"use client"

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"

const relatedArticles = [
  {
    id: "2",
    title: "AI-Powered Client Engagement",
    service: "Glynac",
    serviceColor: "#0066CC",
    readTime: 6,
    image: "/ai-neural-network.png",
  },
  {
    id: "3",
    title: "Real Estate Investment Strategies for 2025",
    service: "PHH",
    serviceColor: "#E2725B",
    readTime: 10,
    image: "/modern-real-estate-skyline.png",
  },
]

export function RelatedArticles({ currentArticleId }: { currentArticleId: string }) {
  const related = relatedArticles.filter((a) => a.id !== currentArticleId).slice(0, 2)

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-8">Continue Reading</h3>
      <div className="grid md:grid-cols-2 gap-6">
        {related.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group block bg-card rounded-lg overflow-hidden border border-border hover:border-[#00D4AA] hover:shadow-xl transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
                style={{ backgroundColor: `${article.serviceColor}dd` }}
              >
                {article.service}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                <Clock size={16} />
                <span>{article.readTime} min read</span>
              </div>
              <h4 className="font-bold text-lg mb-3 text-balance">{article.title}</h4>
              <div className="flex items-center gap-2 text-[#00D4AA] font-semibold group-hover:gap-4 transition-all">
                Read Article
                <ArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
