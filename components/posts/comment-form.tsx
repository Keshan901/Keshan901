"use client";

import { FormEvent, useState, useTransition } from "react";

import { createComment } from "@/app/actions/comments";

export function CommentForm({ postId }: { postId: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = message;

    startTransition(async () => {
      try {
        setError(null);
        await createComment(postId, content);
        setMessage("");
      } catch (submissionError) {
        setError(submissionError instanceof Error ? submissionError.message : "Failed to post comment");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <label className="text-sm font-medium">Add a comment</label>
      <textarea
        required
        minLength={2}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="min-h-24 w-full rounded-md border border-white/20 bg-slate-900/70 p-3 text-sm"
        placeholder="Share your thoughts..."
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-fuchsia-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}
