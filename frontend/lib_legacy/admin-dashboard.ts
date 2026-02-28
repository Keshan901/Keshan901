import { PostStatus, PostType, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type Params = Record<string, string | string[] | undefined>;

function pick(input: string | string[] | undefined) {
  return typeof input === "string" ? input.trim() : "";
}

export function normalizeAdminFilters(params: Params) {
  const q = pick(params.q);
  const role = pick(params.role);
  const status = pick(params.status);

  return {
    q,
    role: role === Role.ADMIN || role === Role.USER ? (role as Role) : undefined,
    status: Object.values(PostStatus).includes(status as PostStatus) ? (status as PostStatus) : undefined
  };
}

export async function getAdminDashboardData(filters: ReturnType<typeof normalizeAdminFilters>) {
  const userWhere = {
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.q
      ? {
          OR: [
            { email: { contains: filters.q, mode: "insensitive" as const } },
            { username: { contains: filters.q, mode: "insensitive" as const } },
            { name: { contains: filters.q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const postWhere = {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            { slug: { contains: filters.q, mode: "insensitive" as const } }
          ]
        }
      : {})
  };

  const [users, posts, categories, dailyTips] = await Promise.all([
    prisma.user.findMany({ where: userWhere, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.post.findMany({
      where: postWhere,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.dailyTip.findMany({ orderBy: { tipDate: "asc" }, take: 100 })
  ]);

  const postByStatus = Object.values(PostStatus).map((status) => ({
    label: status,
    value: posts.filter((post) => post.status === status).length
  }));

  const postByType = Object.values(PostType).map((type) => ({
    label: type,
    value: posts.filter((post) => post.type === type).length
  }));

  const stats = {
    users: users.length,
    admins: users.filter((user) => user.role === Role.ADMIN).length,
    lockedUsers: users.filter((user) => !user.isActive).length,
    posts: posts.length,
    publishedPosts: posts.filter((post) => post.status === PostStatus.PUBLISHED).length,
    scheduledPosts: posts.filter((post) => post.status === PostStatus.SCHEDULED).length,
    categories: categories.length,
    subcategories: categories.filter((category) => Boolean(category.parentId)).length,
    dailyTips: dailyTips.length
  };

  return {
    users,
    posts,
    categories,
    dailyTips,
    postTypes: Object.values(PostType),
    postStatuses: Object.values(PostStatus),
    roles: Object.values(Role),
    trackers: {
      stats,
      postByStatus,
      postByType
    }
  };
}
