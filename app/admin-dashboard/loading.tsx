export default function AdminDashboardLoading() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1400px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <div className="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-48 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}
