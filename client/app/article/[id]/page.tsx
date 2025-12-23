import { notFound } from "next/navigation"
import { ArticleHeader } from "@/components/article-header"
import { ArticleContent } from "@/components/article-content"
import { ReadingAssistant } from "@/components/reading-assistant"
import { ActivationPathway } from "@/components/activation-pathway"
import { RelatedArticles } from "@/components/related-articles"
import { getArticleBySlug, getArticleById, getStrapiImageUrl } from "@/lib/strapi"

// Service color mapping
const serviceColors: Record<string, string> = {
  strategy: "#0A2463",
  technology: "#0066CC",
  compliance: "#2E7D32",
  glynac: "#0066CC",
  phh: "#E2725B",
  tollbooth: "#00C49A",
  talent: "#7B68EE",
  labs: "#00D4AA",
  default: "#00D4AA",
}

// Fallback article for when Strapi is unavailable
const fallbackArticle = {
  id: "1",
  title: "Navigating the New Fiduciary Landscape",
  subtitle: "Understanding the evolving regulatory requirements and their impact on advisory practices",
  author: "Sarah Mitchell",
  authorRole: "Chief Compliance Officer",
  publishDate: "2024-12-01",
  readTime: 8,
  service: "Strategy",
  serviceColor: "#0A2463",
  image: "/regulatory-compliance-abstract.jpg",
  content: `
    <p>The fiduciary landscape has undergone significant transformation in recent years. As regulatory bodies continue to refine their expectations, advisory firms must adapt their practices to remain compliant while delivering exceptional client value.</p>
    
    <h2>The Evolution of Fiduciary Standards</h2>
    <p>Recent regulatory changes have fundamentally altered how financial advisors operate. The emphasis on client-first practices has never been stronger, requiring firms to demonstrate clear evidence of their fiduciary commitment.</p>
    
    <blockquote>Understanding your fiduciary obligations isn't just about compliance—it's about building lasting trust with your clients.</blockquote>
    
    <h3>Key Regulatory Changes</h3>
    <ul>
      <li>Enhanced disclosure requirements for fee structures</li>
      <li>Stricter documentation standards for investment recommendations</li>
      <li>Expanded conflict of interest identification protocols</li>
      <li>Increased oversight of third-party relationships</li>
    </ul>
    
    <h2>Implementing Compliance-First Strategies</h2>
    <p>Forward-thinking firms are embedding compliance into their culture rather than treating it as a checkbox exercise. This approach creates sustainable practices that protect both clients and the firm.</p>
    
    <p>Technology plays a crucial role in modern compliance. Automated monitoring systems, advanced documentation tools, and real-time reporting capabilities enable firms to maintain oversight at scale.</p>
    
    <h3>Best Practices for 2025</h3>
    <p>As we move forward, successful firms will prioritize transparency, systematic documentation, and proactive risk management. The integration of compliance technology with advisory workflows represents the future of the industry.</p>
  `,
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Try to fetch from Strapi (by slug first, then by ID)
  let strapiArticle = await getArticleBySlug(id)

  if (!strapiArticle && !isNaN(Number(id))) {
    strapiArticle = await getArticleById(id)
  }

  // Convert Strapi article to display format or use fallback
  const article = strapiArticle ? {
    id: strapiArticle.documentId || String(strapiArticle.id),
    title: strapiArticle.title,
    subtitle: strapiArticle.description || "",
    author: strapiArticle.author?.name || "Acumen Team",
    authorRole: "Content Strategist",
    publishDate: strapiArticle.publishedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
    readTime: Math.ceil((strapiArticle.content?.length || 500) / 200),
    service: strapiArticle.category?.name || "Insights",
    serviceColor: serviceColors[strapiArticle.category?.slug?.toLowerCase() || "default"] || serviceColors.default,
    image: getStrapiImageUrl(strapiArticle.cover) || "/placeholder.svg",
    content: strapiArticle.content || "<p>No content available.</p>",
    categorySlug: strapiArticle.category?.slug || "insights",
  } : fallbackArticle

  return (
    <div className="min-h-screen">
      <ArticleHeader article={article} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid lg:grid-cols-[1fr_300px] gap-12">
        <div>
          <ArticleContent content={article.content} serviceColor={article.serviceColor} />
          <ActivationPathway service={article.service} />
          <RelatedArticles currentArticleId={article.id} />
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <ReadingAssistant articleTitle={article.title} />
        </aside>
      </div>
    </div>
  )
}
