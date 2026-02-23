import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";

export default async function DailyWatchPage() {
  const posts = await prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, take: 20 });
  const trending = posts.slice(0, 3);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-4 md:col-span-2">
        <h1 className="text-3xl font-bold">Daily Watch</h1>
        {posts.map((post) => <Card key={post.id}><h2 className="text-xl font-semibold"><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p></Card>)}
      </div>
      <aside className="space-y-4"><h2 className="text-xl font-semibold">Trending posts</h2>{trending.map((post) => <Card key={post.id}>{post.title}</Card>)}</aside>
    </div>
  );
}
