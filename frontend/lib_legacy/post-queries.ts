import { CommentStatus, PostType } from "@prisma/client";

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
            favorites: true,
            comments: true
          }
        }
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }]
    });

    return posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      type: post.type,
      views: post.views,
      favoritesCount: post._count.favorites,
      commentsCount: post._count.comments,
      tags: post.tags,
      thumbnailUrl: post.thumbnailUrl,
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
          favorites: true,
          comments: true
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
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    type: post.type,
    views: post.views,
    favoritesCount: post._count.favorites,
    commentsCount: post._count.comments,
    tags: post.tags,
    thumbnailUrl: post.thumbnailUrl,
    isFavorited: post.favorites.length > 0
  }));
}

export async function getPostBySlugWithComments(slug: string, userId?: string) {
  if (!userId) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        _count: { select: { favorites: true, comments: true } },
        comments: {
          where: { status: CommentStatus.VISIBLE },
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!post) {
      return null;
    }

    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      type: post.type,
      views: post.views,
      favoritesCount: post._count.favorites,
      commentsCount: post._count.comments,
      tags: post.tags,
      thumbnailUrl: post.thumbnailUrl,
      isFavorited: false,
      comments: post.comments
    };
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      _count: { select: { favorites: true, comments: true } },
      favorites: {
        where: { userId },
        select: { id: true }
      },
      comments: {
        where: { status: CommentStatus.VISIBLE },
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    type: post.type,
    views: post.views,
    favoritesCount: post._count.favorites,
    commentsCount: post._count.comments,
    tags: post.tags,
    thumbnailUrl: post.thumbnailUrl,
    isFavorited: post.favorites.length > 0,
    comments: post.comments
  };
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
              select: { favorites: true, comments: true }
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
        _count: { select: { favorites: true, comments: true } },
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
      slug: item.post.slug,
      title: item.post.title,
      excerpt: item.post.excerpt,
      type: item.post.type,
      views: item.post.views,
      favoritesCount: item.post._count.favorites,
      commentsCount: item.post._count.comments,
      tags: item.post.tags,
      thumbnailUrl: item.post.thumbnailUrl,
      isFavorited: true
    })),
    recommended: recommended.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      type: post.type,
      views: post.views,
      favoritesCount: post._count.favorites,
      commentsCount: post._count.comments,
      tags: post.tags,
      thumbnailUrl: post.thumbnailUrl,
      isFavorited: post.favorites.length > 0
    }))
  };
}

export async function getCommentsForModeration() {
  return prisma.comment.findMany({
    include: {
      post: { select: { title: true, slug: true, type: true } },
      user: { select: { email: true, name: true } },
      moderatedBy: { select: { email: true, name: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });
}

export async function getTikTokCreatesData(query: string) {
  const filter = query.trim();

  const [videos, featuredPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        isPublished: true,
        AND: [
          { OR: [{ type: PostType.TIKTOK_TIP }, { isTikTokFeatured: true }] },
          ...(filter
            ? [
                {
                  OR: [
                    { title: { contains: filter, mode: "insensitive" } },
                    { tags: { has: filter.toLowerCase() } }
                  ]
                }
              ]
            : [])
        ]
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: 18
    }),
    prisma.post.findMany({
      where: {
        isPublished: true,
        isTikTokFeatured: true
      },
      orderBy: [{ views: "desc" }, { publishedAt: "desc" }],
      take: 6
    })
  ]);

  return { videos, featuredPosts };
}
