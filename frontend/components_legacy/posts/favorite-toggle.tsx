"use client";

import { useTransition } from "react";

import { toggleFavorite } from "@/app/actions/favorites";

type Props = {
  postId: string;
  isFavorited: boolean;
};

export function FavoriteToggle({ postId, isFavorited }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => toggleFavorite(postId))}
      disabled={pending}
      className="rounded-md border border-white/20 px-3 py-1 text-xs font-medium transition hover:bg-white/10 disabled:opacity-50"
    >
      {pending ? "Updating..." : isFavorited ? "★ Favorited" : "☆ Add Favorite"}
    </button>
  );
}
