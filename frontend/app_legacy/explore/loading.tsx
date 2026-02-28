import { FeedSkeleton } from "@/components/feed/feed-skeleton";

export default function LoadingExplore() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div>
        <div className="h-9 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-3 h-4 w-80 animate-pulse rounded bg-white/10" />
      </div>
      <div className="h-20 animate-pulse rounded-xl border border-white/10 bg-white/5" />
      <FeedSkeleton />
    </main>
  );
}
