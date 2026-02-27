import type { FeedPost } from "@/lib/feeds";

export function PostCard({ post, index }: { post: FeedPost; index: number }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-wide text-fuchsia-300">#{index + 1}</p>
      <h3 className="mt-2 text-xl font-semibold">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{post.excerpt || "No excerpt provided."}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
        <span className="rounded-full border border-white/20 px-2 py-1">{post.type}</span>
        {post.categoryName ? <span className="rounded-full border border-white/20 px-2 py-1">{post.categoryName}</span> : null}
        <span className="rounded-full border border-white/20 px-2 py-1">Views: {post.views}</span>
        <span className="rounded-full border border-white/20 px-2 py-1">Favorites: {post.favoritesCount}</span>
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-cyan-300/30 px-2 py-1 text-cyan-200">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
