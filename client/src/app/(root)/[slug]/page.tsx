import { draftMode } from "next/headers";
import { getPageBySlug } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";

// Force dynamic rendering - no static generation at build time
// This prevents any Strapi calls during Docker build
export const dynamic = 'force-dynamic';

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

