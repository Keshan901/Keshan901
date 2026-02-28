import { apiFetch } from "@/lib/api";

type TikTokItem = { id: string; title: string; thumbnailUrl?: string | null; views: number };

export default async function TikTokCreatesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";

  const data = await apiFetch<{ items: TikTokItem[] }>(`/posts/tiktok?q=${encodeURIComponent(q)}`);
  const items = data?.items ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10">
      <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-700/40 to-cyan-700/30 p-8">
        <h1 className="text-4xl font-bold">TikTok Creates</h1>
        <form action="/tiktok-creates" className="mt-4 max-w-xl">
          <input name="q" defaultValue={q} placeholder="Search TikTok ideas" className="h-11 w-full rounded-full border border-white/20 bg-black/40 px-4 text-sm" />
        </form>
      </section>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-white/20 p-8 text-sm text-slate-300">No TikTok items found.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <div className="h-48 bg-slate-900">
                {item.thumbnailUrl ? (
                  <img src={item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">No thumbnail</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="line-clamp-2 text-sm font-semibold">{item.title}</h2>
                <p className="mt-1 text-xs text-cyan-200">{item.views} views</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
