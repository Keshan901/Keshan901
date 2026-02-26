import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/card";
import CopyButtons from "@/components/explore/copy-buttons";

export const runtime = "nodejs";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; platform?: string; sort?: string }> }) {
  const params = await searchParams;
  const keywordSets = await prisma.keywordSet.findMany({
    where: {
      visibility: "PUBLIC",
      ...(params.q ? { title: { contains: params.q, mode: "insensitive" } } : {}),
      ...(params.category ? { category: params.category } : {}),
      ...(params.platform ? { platform: params.platform } : {}),
    },
    orderBy: params.sort === "newest" ? { createdAt: "desc" } : { copyCount: "desc" },
    take: 30,
  });

  const hashtagSets = await prisma.hashtagSet.findMany({ where: { visibility: "PUBLIC" }, take: 30, orderBy: { copyCount: "desc" } });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Explore Viral Sets</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {keywordSets.map((set) => (
          <Card key={set.id}>
            <h2 className="font-semibold">{set.title}</h2>
            <p className="text-sm text-zinc-400">{set.platform} • {set.category} • {set.language}</p>
            <ul className="my-3 list-inside list-disc">{set.content.map((line) => <li key={line}>{line}</li>)}</ul>
            <CopyButtons lines={set.content} />
          </Card>
        ))}
      </div>
      <h2 className="text-2xl font-semibold">Trending Hashtags</h2>
      <div className="grid gap-4 md:grid-cols-2">{hashtagSets.map((set) => <Card key={set.id}><h3 className="font-semibold">{set.title}</h3><CopyButtons lines={set.content} /></Card>)}</div>
    </div>
  );
}
