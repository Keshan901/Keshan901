export default function TikTokCreatesLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10">
      <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </main>
  );
}
