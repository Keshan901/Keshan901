import { PrismaClient, PostStatus, PostType, Role } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

const adminPasswordHash = hashSync("AdminPass123!", 12);
const writerPasswordHash = hashSync("WriterPass123!", 12);

async function main() {
  const [newsCategory, blogCategory, adviceCategory, tiktokCategory] = await Promise.all([
    prisma.category.upsert({
      where: { slug: "news" },
      update: { name: "News", description: "Industry and company updates" },
      create: { name: "News", slug: "news", description: "Industry and company updates" }
    }),
    prisma.category.upsert({
      where: { slug: "blog" },
      update: { name: "Blog", description: "Long-form stories and articles" },
      create: { name: "Blog", slug: "blog", description: "Long-form stories and articles" }
    }),
    prisma.category.upsert({
      where: { slug: "advice" },
      update: { name: "Advice", description: "Practical guidance and best practices" },
      create: { name: "Advice", slug: "advice", description: "Practical guidance and best practices" }
    }),
    prisma.category.upsert({
      where: { slug: "tiktok-tip" },
      update: { name: "TikTok Tips", description: "Short-form growth tactics" },
      create: { name: "TikTok Tips", slug: "tiktok-tip", description: "Short-form growth tactics" }
    })
  ]);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { username: "admin", name: "Admin User", role: Role.ADMIN, passwordHash: adminPasswordHash },
    create: {
      email: "admin@example.com",
      username: "admin",
      name: "Admin User",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
      bio: "Platform administrator and editor"
    }
  });

  const writerUser = await prisma.user.upsert({
    where: { email: "writer@example.com" },
    update: { username: "writer", name: "Writer User", role: Role.USER, passwordHash: writerPasswordHash },
    create: {
      email: "writer@example.com",
      username: "writer",
      name: "Writer User",
      role: Role.USER,
      passwordHash: writerPasswordHash,
      bio: "Writes insights and practical guides"
    }
  });

  const newsPost = await prisma.post.upsert({
    where: { slug: "new-platform-updates" },
    update: {
      title: "New Platform Updates",
      content: "We just shipped several quality-of-life improvements.",
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: newsCategory.id,
      tags: ["product", "release"],
      views: 120,
      thumbnailUrl: "/uploads/news-thumb.jpg"
    },
    create: {
      title: "New Platform Updates",
      slug: "new-platform-updates",
      excerpt: "A quick overview of this week’s key launches.",
      content: "We just shipped several quality-of-life improvements.",
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: newsCategory.id,
      tags: ["product", "release"],
      views: 120,
      thumbnailUrl: "/uploads/news-thumb.jpg"
    }
  });

  const advicePost = await prisma.post.upsert({
    where: { slug: "how-to-build-a-daily-content-routine" },
    update: {
      title: "How to Build a Daily Content Routine",
      content: "Start with one repeatable format and iterate weekly.",
      type: PostType.ADVICE,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: writerUser.id,
      categoryId: adviceCategory.id,
      tags: ["strategy", "creator"],
      views: 95,
      thumbnailUrl: "/uploads/advice-thumb.jpg"
    },
    create: {
      title: "How to Build a Daily Content Routine",
      slug: "how-to-build-a-daily-content-routine",
      excerpt: "A repeatable process for consistent publishing.",
      content: "Start with one repeatable format and iterate weekly.",
      type: PostType.ADVICE,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: writerUser.id,
      categoryId: adviceCategory.id,
      tags: ["strategy", "creator"],
      views: 95,
      thumbnailUrl: "/uploads/advice-thumb.jpg"
    }
  });


  const tiktokPost = await prisma.post.upsert({
    where: { slug: "three-tiktok-hooks-for-fast-retention" },
    update: {
      title: "Three TikTok Hooks for Faster Retention",
      content: "Open with a hard contrast, tease the payoff, and show the result within 3 seconds.",
      type: PostType.TIKTOK_TIP,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: tiktokCategory.id,
      tags: ["tiktok", "hooks", "retention"],
      views: 180,
      thumbnailUrl: "/uploads/tiktok-thumb.jpg",
      videoUrl: "/uploads/tiktok-demo.mp4",
      isTikTokFeatured: true
    },
    create: {
      title: "Three TikTok Hooks for Faster Retention",
      slug: "three-tiktok-hooks-for-fast-retention",
      excerpt: "High-performing opening patterns for short-form video.",
      content: "Open with a hard contrast, tease the payoff, and show the result within 3 seconds.",
      type: PostType.TIKTOK_TIP,
      status: PostStatus.PUBLISHED,
      isPublished: true,
      publishedAt: new Date(),
      authorId: adminUser.id,
      categoryId: tiktokCategory.id,
      tags: ["tiktok", "hooks", "retention"],
      views: 180,
      thumbnailUrl: "/uploads/tiktok-thumb.jpg",
      videoUrl: "/uploads/tiktok-demo.mp4",
      isTikTokFeatured: true
    }
  });

  await prisma.favorite.upsert({
    where: { userId_postId: { userId: writerUser.id, postId: newsPost.id } },
    update: {},
    create: { userId: writerUser.id, postId: newsPost.id }
  });

  const rootComment = await prisma.comment.create({
    data: { body: "Great release notes — very clear and practical.", postId: newsPost.id, userId: writerUser.id }
  });

  await prisma.comment.create({
    data: {
      body: "Thanks! More enhancements are on the way.",
      postId: newsPost.id,
      userId: adminUser.id,
      parentId: rootComment.id
    }
  });

  await prisma.dailyTip.upsert({
    where: { tipDate: new Date("2025-01-01T00:00:00.000Z") },
    update: {
      title: "Repurpose your best post into a short-form clip",
      content: "Take your highest-performing blog section and rewrite it into a 30-second hook.",
      sourceType: PostType.TIKTOK_TIP,
      authorId: adminUser.id
    },
    create: {
      tipDate: new Date("2025-01-01T00:00:00.000Z"),
      title: "Repurpose your best post into a short-form clip",
      content: "Take your highest-performing blog section and rewrite it into a 30-second hook.",
      sourceType: PostType.TIKTOK_TIP,
      authorId: adminUser.id
    }
  });

  await prisma.auditLog.createMany({
    data: [
      {
        action: "SEED_CREATED_POST",
        entityType: "Post",
        entityId: newsPost.id,
        actorId: adminUser.id,
        metadata: { postType: PostType.NEWS }
      },
      {
        action: "SEED_CREATED_POST",
        entityType: "Post",
        entityId: advicePost.id,
        actorId: writerUser.id,
        metadata: { postType: PostType.ADVICE }
      },
      {
        action: "SEED_CREATED_POST",
        entityType: "Post",
        entityId: tiktokPost.id,
        actorId: adminUser.id,
        metadata: { postType: PostType.TIKTOK_TIP }
      }
    ]
  });

  console.log("Seed complete");
  console.table({
    credentials: "admin@example.com / AdminPass123! | writer@example.com / WriterPass123!",
    categories: 4,
    users: 2,
    posts: 3,
    favorites: 1,
    comments: 2,
    dailyTips: 1,
    auditLogs: 3
  });
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
