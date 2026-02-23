import { prisma } from "@/lib/prisma";

export default async function ExplorePage() {
  const [hashtags, keywords, formulas, tips] = await Promise.all([
    prisma.hashtag.findMany({ orderBy: { usageCount: "desc" }, take: 500 }),
    prisma.keyword.findMany({ orderBy: { usageCount: "desc" }, take: 500 }),
    prisma.contentFormula.findMany({ orderBy: { avgEngagementRate: "desc" }, take: 500 }),
    prisma.contentTip.findMany({ orderBy: { updatedAt: "desc" }, take: 200 })
  ]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-brand.deep p-8 text-white">
        <h1 className="text-3xl font-bold">Explore Viral Intelligence</h1>
        <p className="mt-2 text-slate-200">All hashtags, keywords, formulas, and tips in one advanced searchable experience.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          <input className="rounded border border-white/30 bg-white/10 px-3 py-2" placeholder="Advanced search term" readOnly />
          <input className="rounded border border-white/30 bg-white/10 px-3 py-2" placeholder="Filter category" readOnly />
          <input className="rounded border border-white/30 bg-white/10 px-3 py-2" placeholder="Min engagement" readOnly />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hashtags.map((h)=> <article key={`h-${h.id}`} className="rounded-xl border bg-white p-3"><p className="font-semibold">{h.tag}</p><p className="text-xs text-slate-600">{h.category} · {h.engagement}%</p></article>)}
        {keywords.map((k)=> <article key={`k-${k.id}`} className="rounded-xl border bg-white p-3"><p className="font-semibold">{k.term}</p><p className="text-xs text-slate-600">{k.category} · {k.engagement}%</p></article>)}
        {formulas.map((f)=> <article key={`f-${f.id}`} className="rounded-xl border bg-white p-3"><p className="font-semibold">{f.title}</p><p className="text-xs text-slate-600">{f.contentType} · {f.avgEngagementRate}%</p></article>)}
        {tips.map((t)=> <article key={`t-${t.id}`} className="rounded-xl border bg-white p-3"><p className="font-semibold">{t.formula}</p><p className="text-xs text-slate-600">{t.postingTime}</p></article>)}
      </div>
    </section>
  );
}
