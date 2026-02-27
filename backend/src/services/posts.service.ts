import { PostType } from "@prisma/client";

import { prisma } from "../config/prisma";

export async function listPosts() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    type: post.type,
    views: post.views,
    tags: post.tags,
    thumbnailUrl: post.thumbnailUrl
  }));
}

export async function listTrendingPosts() {
  const posts = await prisma.post.findMany({
    where: { isPublished: true },
    include: { _count: { select: { favorites: true } } },
    take: 100
  });

  const now = Date.now();

  return posts
    .map((post) => {
      const t = post.publishedAt?.getTime() ?? post.createdAt.getTime();
      const ageHours = Math.max(1, (now - t) / (1000 * 60 * 60));
      const recency = 100 / ageHours;
      const score = post.views + post._count.favorites * 10 + recency;

      return { id: post.id, title: post.title, type: post.type, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
}

export async function listTikTokPosts(query: string) {
  const q = query.trim();
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      AND: [
        { OR: [{ type: PostType.TIKTOK_TIP }, { isTikTokFeatured: true }] },
        ...(q
          ? [
              {
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { tags: { has: q.toLowerCase() } }
                ]
              }
            ]
          : [])
      ]
    },
    orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
    take: 30
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    views: post.views,
    thumbnailUrl: post.thumbnailUrl,
    videoUrl: post.videoUrl
  }));
}
