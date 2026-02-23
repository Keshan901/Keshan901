import SearchDashboard from "@/components/SearchDashboard";
import { getCurrentUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  try {
    const user = await getCurrentUser();
    const [keywords, hashtags, formulas] = await Promise.all([
      prisma.keyword.findMany({ orderBy: { usageCount: "desc" } }),
      prisma.hashtag.findMany({ orderBy: { usageCount: "desc" } }),
      prisma.contentFormula.findMany({ orderBy: { avgEngagementRate: "desc" } }),
    ]);

    return <SearchDashboard keywords={keywords} hashtags={hashtags} formulas={formulas} isSignedIn={Boolean(user)} />;
  } catch {
    return <section className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center text-amber-900"><h1 className="text-2xl font-bold">This in maintence mode recover soonly</h1><p className="mt-2">Our data services are temporarily unavailable. Please check back shortly.</p></section>;
  }
}
