import { CommentStatus } from "@prisma/client";

type CommentItem = {
  id: string;
  body: string;
  status: CommentStatus;
  createdAt: Date;
  user: { name: string | null; email: string | null } | null;
};

export function CommentList({ comments }: { comments: CommentItem[] }) {
  if (comments.length === 0) {
    return <p className="text-sm text-slate-300">No comments yet.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article key={comment.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs text-slate-400">
            {comment.user?.name || comment.user?.email || "Anonymous"} · {comment.createdAt.toISOString().slice(0, 10)}
          </p>
          <p className="mt-2 text-sm text-slate-100">{comment.body}</p>
        </article>
      ))}
    </div>
  );
}
