import { PostStatus, PostType, Role } from "@prisma/client";

import { prisma } from "../config/prisma";

export async function getTrackers() {
  const [users, posts, categories, tips] = await Promise.all([
    prisma.user.findMany(),
    prisma.post.findMany(),
    prisma.category.findMany(),
    prisma.dailyTip.findMany()
  ]);

  const stats = {
    users: users.length,
    admins: users.filter((x) => x.role === Role.ADMIN).length,
    lockedUsers: users.filter((x) => !x.isActive).length,
    posts: posts.length,
    publishedPosts: posts.filter((x) => x.status === PostStatus.PUBLISHED).length,
    scheduledPosts: posts.filter((x) => x.status === PostStatus.SCHEDULED).length,
    categories: categories.length,
    subcategories: categories.filter((x) => Boolean(x.parentId)).length,
    dailyTips: tips.length
  };

  const postByStatus = Object.values(PostStatus).map((status) => ({
    label: status,
    value: posts.filter((post) => post.status === status).length
  }));

  const postByType = Object.values(PostType).map((type) => ({
    label: type,
    value: posts.filter((post) => post.type === type).length
  }));

  return { trackers: { stats, postByStatus, postByType } };
}
