import { auth } from "@/auth";
import { AdminCommentActions } from "@/components/posts/admin-comment-actions";
import { getCommentsForModeration } from "@/lib/post-queries";

export default async function AdminPage() {
  const session = await auth();
  const comments = await getCommentsForModeration();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl space-y-6 p-8">
      <h1 className="text-3xl font-bold">Admin Moderation</h1>
      <a href="/admin-dashboard" className="text-sm text-cyan-300 hover:underline">Open advanced admin dashboard</a>
      <p className="text-muted-foreground">Authenticated as: {session?.user?.email}</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Comment Moderation (blogs/news)</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-slate-300">No comments to moderate.</p>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-400">
                  {comment.post.type} · {comment.post.title} · Status: {comment.status}
                </p>
                <p className="mt-2 text-sm">{comment.body}</p>
                <p className="mt-1 text-xs text-slate-400">
                  By {comment.user?.name || comment.user?.email || "Anonymous"}
                </p>
                {comment.moderationReason ? (
                  <p className="mt-1 text-xs text-amber-300">Reason: {comment.moderationReason}</p>
                ) : null}
                <AdminCommentActions commentId={comment.id} />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
