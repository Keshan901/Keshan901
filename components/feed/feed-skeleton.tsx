export function FeedSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-3 w-14 rounded bg-white/10" />
          <div className="mt-3 h-6 w-1/2 rounded bg-white/10" />
          <div className="mt-3 h-4 w-full rounded bg-white/10" />
          <div className="mt-2 h-4 w-4/5 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
