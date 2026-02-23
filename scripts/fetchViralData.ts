import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { fetchFromBrandwatch, fetchFromBuzzSumo, fetchFromMetaGraph, fetchFromPublicFallback } from "../lib/providers";
import type { ViralItem } from "../lib/types";

function normalizeHashtag(term: string): string {
  const base = term
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .join("");

  return `#${base || "viral"}`;
}

async function persistViralItems(items: ViralItem[]) {
  const today = new Date(new Date().toISOString().slice(0, 10));

  for (const item of items) {
    const keyword = await prisma.keyword.upsert({
      where: { term: item.term },
      update: {
        usageCount: item.usageCount,
        engagement: item.engagement,
        category: item.category,
        source: item.source,
      },
      create: item,
    });

    await prisma.dailyTrendSnapshot.upsert({
      where: {
        day_keywordId: {
          day: today,
          keywordId: keyword.id,
        },
      },
      update: {
        usageCount: item.usageCount,
        engagement: item.engagement,
      },
      create: {
        day: today,
        keywordId: keyword.id,
        usageCount: item.usageCount,
        engagement: item.engagement,
      },
    });

    await prisma.hashtag.upsert({
      where: { tag: normalizeHashtag(item.term) },
      update: {
        usageCount: item.usageCount,
        engagement: item.engagement,
        category: item.category,
        source: item.source,
      },
      create: {
        tag: normalizeHashtag(item.term),
        usageCount: item.usageCount,
        engagement: item.engagement,
        category: item.category,
        source: item.source,
        trending: false,
      },
    });
  }
}

async function fetchAndStore() {
  const [meta, buzz, brandwatch, fallback] = await Promise.allSettled([
    fetchFromMetaGraph(),
    fetchFromBuzzSumo(),
    fetchFromBrandwatch(),
    fetchFromPublicFallback(),
  ]);

  const all = [meta, buzz, brandwatch, fallback]
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item) => item.term.length > 2);

  if (all.length === 0) {
    console.log("No external data available. Retaining existing dataset.");
    return;
  }

  await persistViralItems(all);
  console.log(`Stored ${all.length} viral records`);
}

if (process.argv.includes("--once")) {
  fetchAndStore()
    .catch((err) => {
      console.error("Fetch job failed", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else {
  cron.schedule("0 3 * * *", () => {
    fetchAndStore().catch((err) => console.error("Scheduled fetch failed", err));
  });
  console.log("Daily fetch job scheduled for 03:00 UTC");
}
