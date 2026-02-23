import { prisma } from "@/lib/prisma";

export default async function TipsPage() {
  const tips = await prisma.contentTip.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-brand.deep p-6 text-white">
        <h1 className="text-3xl font-bold">Content Tips & Engagement Playbook</h1>
        <p className="mt-2 text-slate-200">Actionable guidance for using each viral formula effectively, including best posting times and engagement strategy notes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip) => (
          <article key={tip.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand.deep">{tip.formula}</h2>
            <p className="mt-3 text-sm text-slate-700"><span className="font-semibold">Best posting time:</span> {tip.postingTime}</p>
            <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Engagement strategy:</span> {tip.strategy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
