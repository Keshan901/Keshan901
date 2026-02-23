import { prisma } from "@/lib/prisma";
import SearchDashboard from "@/components/SearchDashboard";

export default async function HomePage() {
  const [keywords, hashtags, formulas] = await Promise.all([
    prisma.keyword.findMany({ orderBy: { usageCount: "desc" } }),
    prisma.hashtag.findMany({ orderBy: { usageCount: "desc" } }),
    prisma.contentFormula.findMany({ orderBy: { avgEngagementRate: "desc" } }),
  ]);

  return <SearchDashboard keywords={keywords} hashtags={hashtags} formulas={formulas} />;
}
