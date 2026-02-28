import { apiFetch } from "@/lib/api";

type ApiPost = {
  id: string;
  title: string;
  excerpt?: string | null;
  type: string;
};

export default async function ExplorePage() {
  const data = await apiFetch<{ items: ApiPost[] }>("/posts");
  const items = data?.items ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Explore</h1>
      <p className="mt-2 text-sm text-slate-300">Loaded from backend API.</p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-white/20 p-8 text-sm text-slate-300">No posts yet.</div>
      ) : (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-cyan-200">{item.type}</p>
              <h2 className="mt-1 text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-slate-300">{item.excerpt || "No excerpt"}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
