import { PostType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type FeedFilters = {
  query?: string;
  type?: PostType;
  category?: string;
  tag?: string;
};

export type FeedPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  type: PostType;
  tags: string[];
  views: number;
  createdAt: Date;
  publishedAt: Date | null;
  favoritesCount: number;
  categoryName: string | null;
};

const VALID_TYPES = new Set(Object.values(PostType));

export function normalizeFilters(searchParams: Record<string, string | string[] | undefined>): FeedFilters {
  const query = typeof searchParams.q === "string" ? searchParams.q.trim() : "";
  const typeInput = typeof searchParams.type === "string" ? searchParams.type : "";
  const category = typeof searchParams.category === "string" ? searchParams.category.trim() : "";
  const tag = typeof searchParams.tag === "string" ? searchParams.tag.trim() : "";

  return {
    query: query || undefined,
    type: VALID_TYPES.has(typeInput as PostType) ? (typeInput as PostType) : undefined,
    category: category || undefined,
    tag: tag || undefined
  };
}

export async function getFilterOptions() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, name: true }, orderBy: { name: "asc" } }),
    prisma.post.findMany({ where: { isPublished: true }, select: { tags: true } })
  ]);

  const tagSet = new Set<string>();
  for (const post of tags) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }

  return {
    categories,
    tags: [...tagSet].sort((a, b) => a.localeCompare(b))
  };
}

export async function getExplorePosts(filters: FeedFilters): Promise<FeedPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: { slug: filters.category } } : {}),
      ...(filters.tag ? { tags: { has: filters.tag } } : {}),
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query, mode: "insensitive" } },
              { excerpt: { contains: filters.query, mode: "insensitive" } },
              { content: { contains: filters.query, mode: "insensitive" } }
            ]
          }
        : {})
    },
    include: {
      category: { select: { name: true } },
      _count: { select: { favorites: true } }
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    type: post.type,
    tags: post.tags,
    views: post.views,
    createdAt: post.createdAt,
    publishedAt: post.publishedAt,
    favoritesCount: post._count.favorites,
    categoryName: post.category?.name ?? null
  }));
}

export async function getTrendingPosts(filters: FeedFilters): Promise<FeedPost[]> {
  const posts = await getExplorePosts(filters);
  const now = Date.now();

  return posts
    .map((post) => {
      const published = post.publishedAt?.getTime() ?? post.createdAt.getTime();
      const ageHours = Math.max(1, (now - published) / (1000 * 60 * 60));
      const recency = 100 / ageHours;
      const score = post.views + post.favoritesCount * 10 + recency;

      return { ...post, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ score: _score, ...post }) => post);
}
