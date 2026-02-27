import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { EmptyState } from "@/components/feed/empty-state";
import { PostListCard } from "@/components/posts/post-list-card";
import { getDashboardData } from "@/lib/post-queries";

export default async function UserDashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getDashboardData(session.user.id);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-8 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-sm text-slate-300">Welcome back, {session.user.email}. Here is your personalized content.</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Link href="/news" className="rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10">News</Link>
        <Link href="/blogs" className="rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10">Blogs</Link>
        <Link href="/creators-advice" className="rounded-md border border-white/20 px-3 py-1 text-sm hover:bg-white/10">Creators Advice</Link>
      </div>

      <section className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-500/10 p-6">
        <p className="text-xs uppercase tracking-wide text-fuchsia-200">Tip of the Day</p>
        {data.tipOfTheDay ? (
          <>
            <h2 className="mt-2 text-2xl font-semibold">{data.tipOfTheDay.title}</h2>
            <p className="mt-2 text-slate-200">{data.tipOfTheDay.content}</p>
          </>
        ) : (
          <EmptyState
            title="No daily tip yet"
            description="Tip of the day will appear as soon as a real tip is published."
          />
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Daily Tips Feed</h2>
        {data.dailyTips.length === 0 ? (
          <EmptyState
            title="No tips available"
            description="There are no tips yet. Please check back after content is uploaded."
          />
        ) : (
          <div className="grid gap-4">
            {data.dailyTips.map((tip) => (
              <article key={tip.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-cyan-200">{tip.tipDate.toISOString().slice(0, 10)}</p>
                <h3 className="mt-1 text-lg font-semibold">{tip.title}</h3>
                <p className="mt-1 text-sm text-slate-300">{tip.content}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recommended Posts</h2>
        {data.recommended.length === 0 ? (
          <EmptyState
            title="No recommendations yet"
            description="Recommendations appear only when real posts are published."
          />
        ) : (
          <div className="grid gap-4">
            {data.recommended.map((post) => (
              <PostListCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Favorites</h2>
        {data.favorites.length === 0 ? (
          <EmptyState
            title="No favorites saved"
            description="Use Add Favorite on posts to build your favorites list."
          />
        ) : (
          <div className="grid gap-4">
            {data.favorites.map((post) => (
              <PostListCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
