import cron from "node-cron";
import { prisma } from "../lib/prisma";
import { APIIntegrationManager } from "../lib/apiIntegrationManager";
import type { ViralItem } from "../lib/types";

const manager = new APIIntegrationManager();

function normalizeHashtag(term: string): string {
  const base = term.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").split(" ").filter(Boolean).slice(0, 2).join("");
  return `#${base || "viral"}`;
}

async function persistViralItems(items: ViralItem[]) {
  const today = new Date(new Date().toISOString().slice(0, 10));
  for (const item of items) {
    const keyword = await prisma.keyword.upsert({ where: { term: item.term }, update: item, create: item });
    await prisma.dailyTrendSnapshot.upsert({
      where: { day_keywordId: { day: today, keywordId: keyword.id } },
      update: { usageCount: item.usageCount, engagement: item.engagement },
      create: { day: today, keywordId: keyword.id, usageCount: item.usageCount, engagement: item.engagement }
    });
    await prisma.hashtag.upsert({
      where: { tag: normalizeHashtag(item.term) },
      update: { usageCount: item.usageCount, engagement: item.engagement, category: item.category, source: item.source },
      create: { tag: normalizeHashtag(item.term), usageCount: item.usageCount, engagement: item.engagement, category: item.category, source: item.source }
    });
    await prisma.analyticsEvent.create({ data: { eventType: "ingest", entityType: "keyword", entityValue: item.term, engagement: item.engagement } });
  }
}

async function fetchAndStore() {
  const all = await manager.fetchAllProviders();
  if (all.length === 0) return;
  await persistViralItems(all);
  console.log(`Stored ${all.length} viral records`);
}

if (process.argv.includes("--once")) {
  fetchAndStore().finally(async () => prisma.$disconnect());
} else {
  cron.schedule("0 3 * * *", () => fetchAndStore().catch((err) => console.error("Scheduled fetch failed", err)));
  console.log("Daily fetch job scheduled for 03:00 UTC");
}
