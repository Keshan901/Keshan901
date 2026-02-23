import { fetchFromBuzzSumo, fetchFromMetaGraph, fetchFromPublicFallback, fetchFromTwitterV2 } from "@/lib/providers";
import type { ViralItem } from "@/lib/types";

export class APIIntegrationManager {
  async fetchAllProviders(): Promise<ViralItem[]> {
    const results = await Promise.allSettled([
      fetchFromBuzzSumo(),
      fetchFromMetaGraph(),
      fetchFromTwitterV2(),
      fetchFromPublicFallback(),
    ]);

    const merged = results
      .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
      .filter((item) => item.term.length > 2);

    const dedup = new Map<string, ViralItem>();
    for (const item of merged) {
      const key = item.term.toLowerCase();
      const existing = dedup.get(key);
      if (!existing || item.engagement > existing.engagement) dedup.set(key, item);
    }

    return [...dedup.values()].sort((a, b) => b.engagement - a.engagement);
  }
}
