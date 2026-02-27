import Link from "next/link";

import { FavoriteToggle } from "@/components/posts/favorite-toggle";

type PostItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  type: string;
  views: number;
  favoritesCount: number;
  commentsCount: number;
  isFavorited: boolean;
  tags: string[];
};

function detailHref(type: string, slug: string) {
  if (type === "NEWS") {
    return `/news/${slug}`;
  }

  if (type === "BLOG") {
    return `/blogs/${slug}`;
  }

  return "/creators-advice";
}

export function PostListCard({ post, canFavorite }: { post: PostItem; canFavorite?: boolean }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-xl font-semibold">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-300">{post.excerpt || "No excerpt available."}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-white/20 px-2 py-1">{post.type}</span>
        <span className="rounded-full border border-white/20 px-2 py-1">Views: {post.views}</span>
        <span className="rounded-full border border-white/20 px-2 py-1">Favorites: {post.favoritesCount}</span>
        <span className="rounded-full border border-white/20 px-2 py-1">Comments: {post.commentsCount}</span>
        {post.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-cyan-300/40 px-2 py-1 text-cyan-200">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {canFavorite ? (
          <FavoriteToggle postId={post.id} isFavorited={post.isFavorited} />
        ) : (
          <Link href="/login" className="text-xs text-fuchsia-300 hover:underline">
            Sign in to manage favorites
          </Link>
        )}
        <Link href={detailHref(post.type, post.slug)} className="text-xs text-cyan-300 hover:underline">
          Open post
        </Link>
      </div>
    </article>
  );
}
