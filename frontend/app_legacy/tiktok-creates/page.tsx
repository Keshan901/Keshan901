import Link from "next/link";

import { getTikTokCreatesData } from "@/lib/post-queries";

export default async function TikTokCreatesPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const data = await getTikTokCreatesData(query);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-8 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-fuchsia-700/50 via-purple-700/30 to-cyan-700/30 p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-200">TikTok Creates</p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">High-retention short-form ideas</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Search only TikTok content, discover feature-worthy videos, and quickly jump into practical creative ideas.
        </p>
        <form action="/tiktok-creates" className="mt-5 max-w-xl">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search TikTok ideas, hooks, and topics"
            className="h-11 w-full rounded-full border border-white/20 bg-black/40 px-4 text-sm placeholder:text-slate-300"
          />
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Video Cards</h2>
          {data.videos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-10 text-center text-sm text-slate-300">
              No TikTok content yet. Add ideas or videos from admin dashboard.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {data.videos.map((post) => (
                <article key={post.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  <div className="h-52 w-full bg-slate-900">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-400">No thumbnail</div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs text-cyan-200">{post.views} views</p>
                    <h3 className="line-clamp-2 text-base font-semibold">{post.title}</h3>
                    <Link href={post.type === "BLOG" ? `/blogs/${post.slug}` : post.type === "NEWS" ? `/news/${post.slug}` : "/creators-advice"} className="mt-2 inline-block text-xs text-fuchsia-200 hover:underline">
                      Open idea
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-3">
          <h2 className="text-xl font-semibold">Featured Picks</h2>
          {data.featuredPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.03] p-6 text-sm text-slate-300">
              No featured TikTok posts yet.
            </div>
          ) : (
            data.featuredPosts.map((post) => (
              <article key={post.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs text-fuchsia-200">Featured</p>
                <h3 className="mt-1 text-sm font-semibold">{post.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-slate-300">{post.excerpt || post.content}</p>
              </article>
            ))
          )}
        </aside>
      </section>
    </main>
  );
}
