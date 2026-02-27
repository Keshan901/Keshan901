"use client";

import { useTransition } from "react";

import { moderateComment } from "@/app/actions/comments";

export function AdminCommentActions({ commentId }: { commentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex gap-2">
      <button
        disabled={pending}
        onClick={() => startTransition(() => moderateComment(commentId, "hide", "Hidden by admin"))}
        className="rounded border border-yellow-400/50 px-2 py-1 text-xs text-yellow-200 disabled:opacity-60"
      >
        Hide
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => moderateComment(commentId, "delete", "Deleted by admin"))}
        className="rounded border border-red-400/50 px-2 py-1 text-xs text-red-200 disabled:opacity-60"
      >
        Delete
      </button>
      <button
        disabled={pending}
        onClick={() => startTransition(() => moderateComment(commentId, "restore", "Restored by admin"))}
        className="rounded border border-emerald-400/50 px-2 py-1 text-xs text-emerald-200 disabled:opacity-60"
      >
        Restore
      </button>
    </div>
  );
}
