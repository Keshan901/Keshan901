import { notFound } from "next/navigation";
import { PostType } from "@prisma/client";

import { auth } from "@/auth";
import { CommentForm } from "@/components/posts/comment-form";
import { CommentList } from "@/components/posts/comment-list";
import { FavoriteToggle } from "@/components/posts/favorite-toggle";
import { getPostBySlugWithComments } from "@/lib/post-queries";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth();
  const post = await getPostBySlugWithComments(slug, session?.user?.id);

  if (!post || post.type !== PostType.BLOG) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl space-y-6 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="mt-3 text-slate-200">{post.content}</p>
        <div className="mt-4 flex items-center gap-3 text-xs">
          <span>Views: {post.views}</span>
          <span>Favorites: {post.favoritesCount}</span>
          <span>Comments: {post.commentsCount}</span>
          {session?.user?.id ? <FavoriteToggle postId={post.id} isFavorited={post.isFavorited} /> : null}
        </div>
      </article>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Comments</h2>
        {session?.user?.id ? <CommentForm postId={post.id} /> : <p className="text-sm text-slate-300">Sign in to comment.</p>}
        <CommentList comments={post.comments} />
      </section>
    </main>
  );
}
