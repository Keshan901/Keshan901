import { apiFetch } from "@/lib/api";

type Stats = Record<string, number>;
type Chart = Array<{ label: string; value: number }>;

type AdminData = {
  trackers: {
    stats: Stats;
    postByStatus: Chart;
    postByType: Chart;
  };
};

function ChartBar({ data }: { data: Chart }) {
  const max = Math.max(1, ...data.map((x) => x.value));

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label}>
          <div className="mb-1 flex justify-between text-xs text-slate-300">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>
          <div className="h-2 rounded bg-white/10">
            <div className="h-full rounded bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const data = await apiFetch<AdminData>("/admin/trackers");
  const stats = data?.trackers.stats ?? {};
  const postByStatus = data?.trackers.postByStatus ?? [];
  const postByType = data?.trackers.postByType ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h1 className="text-lg font-semibold">Admin Sidebar</h1>
          <div className="mt-3 space-y-1 text-sm text-slate-300">
            <p>Trackers</p>
            <p>Users</p>
            <p>Posts</p>
            <p>Categories</p>
            <p>Daily tips</p>
            <p>TikTok ideas/videos</p>
          </div>
        </aside>

        <section className="space-y-6">
          <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-fuchsia-700/40 to-cyan-700/20 p-6">
            <h2 className="text-3xl font-bold">Admin Dashboard</h2>
            <p className="mt-2 text-sm text-slate-300">Trackers and chart-based insights from backend API.</p>
          </header>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {Object.keys(stats).length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/20 p-6 text-sm text-slate-300">No tracker data yet.</div>
            ) : (
              Object.entries(stats).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{key}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <h3 className="mb-3 text-sm font-medium">Posts by Status</h3>
              {postByStatus.length === 0 ? <p className="text-xs text-slate-300">No data.</p> : <ChartBar data={postByStatus} />}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <h3 className="mb-3 text-sm font-medium">Posts by Type</h3>
              {postByType.length === 0 ? <p className="text-xs text-slate-300">No data.</p> : <ChartBar data={postByType} />}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
