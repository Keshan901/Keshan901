export default function ExploreLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-10">
      <div className="h-10 w-48 animate-pulse rounded bg-white/10" />
      <div className="mt-6 grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </main>
  );
}
