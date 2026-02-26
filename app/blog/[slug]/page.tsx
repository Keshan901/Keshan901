import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";
import { sanitizeMarkdownToHtml } from "@/lib/security/sanitize";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") return notFound();

  const safe = sanitizeMarkdownToHtml(post.contentMarkdown);
  return <Card><h1 className="mb-4 text-3xl font-bold">{post.title}</h1><article dangerouslySetInnerHTML={{ __html: safe }} /></Card>;
}
