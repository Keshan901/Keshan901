export default function TikTokCreatesLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl space-y-8 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-56 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </main>
  );
}
