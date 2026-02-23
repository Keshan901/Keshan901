import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const keywords = [
  { term: "story-driven hook", category: "video", usageCount: 890, engagement: 8.9, source: "seed" },
  { term: "before and after reveal", category: "image", usageCount: 650, engagement: 7.6, source: "seed" },
  { term: "3-step tutorial", category: "education", usageCount: 710, engagement: 8.2, source: "seed" },
  { term: "behind the scenes", category: "lifestyle", usageCount: 520, engagement: 7.1, source: "seed" },
  { term: "myth vs fact", category: "education", usageCount: 480, engagement: 7.9, source: "seed" }
];

const hashtags = [
  { tag: "#ViralNow", category: "general", usageCount: 4100, engagement: 9.1, trending: true, source: "seed" },
  { tag: "#MustWatch", category: "video", usageCount: 3900, engagement: 8.8, trending: true, source: "seed" },
  { tag: "#CreatorTips", category: "education", usageCount: 3600, engagement: 8.6, trending: true, source: "seed" },
  { tag: "#SocialGrowth", category: "marketing", usageCount: 3400, engagement: 8.5, trending: true, source: "seed" },
  { tag: "#ReelStrategy", category: "video", usageCount: 3300, engagement: 8.4, trending: true, source: "seed" },
  { tag: "#AudienceLove", category: "community", usageCount: 3200, engagement: 8.4, trending: true, source: "seed" },
  { tag: "#HookFormula", category: "copywriting", usageCount: 3100, engagement: 8.2, trending: true, source: "seed" },
  { tag: "#DailyInsights", category: "news", usageCount: 3000, engagement: 8.1, trending: true, source: "seed" },
  { tag: "#BoostReach", category: "marketing", usageCount: 2900, engagement: 7.9, trending: true, source: "seed" },
  { tag: "#ContentPlaybook", category: "education", usageCount: 2800, engagement: 7.8, trending: true, source: "seed" }
];

const formulas = [
  {
    title: "Problem → Agitate → Solve",
    template: "Start with the audience pain point, magnify the cost of ignoring it, and end with your actionable solution.",
    contentType: "short video",
    avgEngagementRate: 8.9,
    category: "conversion"
  },
  {
    title: "Hook → Story → Offer",
    template: "Open with a contrarian hook, tell a personal narrative, then present your call-to-action.",
    contentType: "reel",
    avgEngagementRate: 8.6,
    category: "storytelling"
  },
  {
    title: "Before → After → Bridge",
    template: "Show current state, desired state, and the bridge steps your audience can follow.",
    contentType: "carousel",
    avgEngagementRate: 8.1,
    category: "education"
  }
];

async function main() {
  for (const keyword of keywords) {
    const record = await prisma.keyword.upsert({
      where: { term: keyword.term },
      update: keyword,
      create: keyword
    });

    await prisma.dailyTrendSnapshot.upsert({
      where: {
        day_keywordId: {
          day: new Date(new Date().toISOString().slice(0, 10)),
          keywordId: record.id
        }
      },
      update: {
        usageCount: keyword.usageCount,
        engagement: keyword.engagement
      },
      create: {
        day: new Date(new Date().toISOString().slice(0, 10)),
        keywordId: record.id,
        usageCount: keyword.usageCount,
        engagement: keyword.engagement
      }
    });
  }

  for (const hashtag of hashtags) {
    await prisma.hashtag.upsert({
      where: { tag: hashtag.tag },
      update: hashtag,
      create: hashtag
    });
  }

  for (const formula of formulas) {
    await prisma.contentFormula.upsert({
      where: { title: formula.title },
      update: formula,
      create: formula
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
