import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all([
    prisma.hashtagCategory.upsert({ where: { name: "marketing" }, update: {}, create: { name: "marketing", description: "Growth and brand hashtags", color: "#0ea5a4" } }),
    prisma.hashtagCategory.upsert({ where: { name: "education" }, update: {}, create: { name: "education", description: "Educational hashtags", color: "#2563eb" } }),
    prisma.hashtagCategory.upsert({ where: { name: "video" }, update: {}, create: { name: "video", description: "Reels and short-form video", color: "#9333ea" } }),
  ]);

  await prisma.userAccount.upsert({
    where: { email: "admin@viral.local" },
    update: { role: UserRole.ADMIN, isActive: true },
    create: { email: "admin@viral.local", name: "Admin", role: UserRole.ADMIN, isActive: true }
  });

  await prisma.userAccount.upsert({
    where: { email: "editor@viral.local" },
    update: { role: UserRole.EDITOR },
    create: { email: "editor@viral.local", name: "Editor", role: UserRole.EDITOR, isActive: true }
  });

  const keywords = [
    { term: "story-driven hook", category: "video", usageCount: 890, engagement: 8.9, source: "seed" },
    { term: "before and after reveal", category: "image", usageCount: 650, engagement: 7.6, source: "seed" },
    { term: "3-step tutorial", category: "education", usageCount: 710, engagement: 8.2, source: "seed" },
    { term: "behind the scenes", category: "lifestyle", usageCount: 520, engagement: 7.1, source: "seed" },
    { term: "myth vs fact", category: "education", usageCount: 480, engagement: 7.9, source: "seed" }
  ];

  const hashtags = [
    { tag: "#ViralNow", category: "marketing", usageCount: 4100, engagement: 9.1, trending: true, source: "seed", categoryId: categories[0].id },
    { tag: "#MustWatch", category: "video", usageCount: 3900, engagement: 8.8, trending: true, source: "seed", categoryId: categories[2].id },
    { tag: "#CreatorTips", category: "education", usageCount: 3600, engagement: 8.6, trending: true, source: "seed", categoryId: categories[1].id }
  ];

  for (const keyword of keywords) {
    const record = await prisma.keyword.upsert({ where: { term: keyword.term }, update: keyword, create: keyword });
    await prisma.dailyTrendSnapshot.upsert({
      where: { day_keywordId: { day: new Date(new Date().toISOString().slice(0, 10)), keywordId: record.id } },
      update: { usageCount: keyword.usageCount, engagement: keyword.engagement },
      create: { day: new Date(new Date().toISOString().slice(0, 10)), keywordId: record.id, usageCount: keyword.usageCount, engagement: keyword.engagement }
    });
  }

  for (const hashtag of hashtags) {
    await prisma.hashtag.upsert({ where: { tag: hashtag.tag }, update: hashtag, create: hashtag });
  }

  await prisma.contentFormula.upsert({
    where: { title: "Problem → Agitate → Solve" },
    update: {},
    create: {
      title: "Problem → Agitate → Solve",
      template: "Start with pain, amplify consequences, then give the practical fix.",
      contentType: "short video",
      avgEngagementRate: 8.9,
      category: "conversion"
    }
  });

  await prisma.siteSetting.upsert({ where: { key: "site_name" }, update: { value: "Viral Keywords Report DB" }, create: { key: "site_name", value: "Viral Keywords Report DB", updatedBy: "seed" } });
  await prisma.siteSetting.upsert({ where: { key: "default_provider" }, update: { value: "public-trends" }, create: { key: "default_provider", value: "public-trends", updatedBy: "seed" } });

  await prisma.apiCredential.upsert({ where: { provider: "buzzsumo" }, update: {}, create: { provider: "buzzsumo", apiKey: "", enabled: false, lastStatus: "not-configured" } });
  await prisma.apiCredential.upsert({ where: { provider: "meta-graph" }, update: {}, create: { provider: "meta-graph", apiKey: "", enabled: false, lastStatus: "not-configured" } });
  await prisma.apiCredential.upsert({ where: { provider: "twitter-v2" }, update: {}, create: { provider: "twitter-v2", apiKey: "", enabled: false, lastStatus: "not-configured" } });
}

main().finally(async () => prisma.$disconnect());
