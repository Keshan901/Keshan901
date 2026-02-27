import { PostType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getPostsByType(type: PostType, userId?: string) {
  if (!userId) {
    const posts = await prisma.post.findMany({
      where: {
        isPublished: true,
        type
      },
      include: {
        _count: {
          select: {
            favorites: true
          }
        }
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      type: post.type,
      views: post.views,
      favoritesCount: post._count.favorites,
      tags: post.tags,
      isFavorited: false
    }));
  }

  const posts = await prisma.post.findMany({
    where: {
      isPublished: true,
      type
    },
    include: {
      _count: {
        select: {
          favorites: true
        }
      },
      favorites: {
        where: {
          userId
        },
        select: {
          id: true
        }
      }
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    type: post.type,
    views: post.views,
    favoritesCount: post._count.favorites,
    tags: post.tags,
    isFavorited: post.favorites.length > 0
  }));
}

export async function getDashboardData(userId: string) {
  const [tipOfTheDay, dailyTips, favorites, recommended] = await Promise.all([
    prisma.dailyTip.findFirst({ orderBy: [{ tipDate: "desc" }, { createdAt: "desc" }] }),
    prisma.dailyTip.findMany({ orderBy: [{ tipDate: "desc" }, { createdAt: "desc" }], take: 8 }),
    prisma.favorite.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            _count: {
              select: { favorites: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 8
    }),
    prisma.post.findMany({
      where: { isPublished: true },
      include: {
        _count: { select: { favorites: true } },
        favorites: {
          where: { userId },
          select: { id: true }
        }
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: 8
    })
  ]);

  return {
    tipOfTheDay,
    dailyTips,
    favorites: favorites.map((item) => ({
      id: item.post.id,
      title: item.post.title,
      excerpt: item.post.excerpt,
      type: item.post.type,
      views: item.post.views,
      favoritesCount: item.post._count.favorites,
      tags: item.post.tags,
      isFavorited: true
    })),
    recommended: recommended.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      type: post.type,
      views: post.views,
      favoritesCount: post._count.favorites,
      tags: post.tags,
      isFavorited: post.favorites.length > 0
    }))
  };
}
