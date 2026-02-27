import { apiFetch } from "@/lib/api";

type TrendingItem = { id: string; title: string; score: number; type: string };

export default async function TrendingPage() {
  const data = await apiFetch<{ items: TrendingItem[] }>("/posts/trending");
  const items = data?.items ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Trending</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/20 p-8 text-sm text-slate-300">No trending content yet.</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item, idx) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-fuchsia-200">#{idx + 1} · {item.type} · Score {item.score.toFixed(2)}</p>
              <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
