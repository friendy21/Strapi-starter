import { getLandingPage } from "@/data/loaders";
import { BlockRenderer } from "@/components/block-renderer";

// Force dynamic rendering since this page needs Strapi data
export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getLandingPage();
  const blocks = data?.data?.blocks;
  if (!blocks) return null;
  return <div>{blocks ? <BlockRenderer blocks={blocks} /> : null}</div>;
}
