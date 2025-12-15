import { draftMode } from "next/headers";
import { getAllPagesSlugs, getPageBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";

// Allow dynamic params for pages not generated at build time
export const dynamicParams = true;

// Check if we should skip static generation (set during Docker build)
const shouldSkipStaticGeneration = process.env.SKIP_STATIC_GENERATION === 'true' || !process.env.STRAPI_BASE_URL;

export async function generateStaticParams() {
  // Skip static generation if Strapi is not available (e.g., during Docker build)
  if (shouldSkipStaticGeneration) {
    console.log("generateStaticParams: Skipping - SKIP_STATIC_GENERATION is set or no STRAPI_BASE_URL");
    return [];
  }

  try {
    const pages = await getAllPagesSlugs();
    return pages.data.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    // Return empty array if Strapi is unavailable during build
    // Pages will be generated on-demand at runtime
    console.log("generateStaticParams: Strapi unavailable, using dynamic rendering");
    return [];
  }
}


interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PageBySlugRoute({ params }: PageProps) {
  const resolveParams = await params;
  const slug = await resolveParams?.slug;

  const { isEnabled: isDraftMode } = await draftMode();
  const status = isDraftMode ? "draft" : "published";

  const data = await getPageBySlug(slug, status);
  const blocks = data?.data[0]?.blocks;
  if (!blocks) return null;
  return <div>{blocks ? <BlockRenderer blocks={blocks} /> : null}</div>;
}
