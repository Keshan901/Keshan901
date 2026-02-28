import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-bold">Creator Platform</h1>
      <p className="mt-3 text-slate-300">Frontend and backend are now separated and connected via API URL.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/explore" className="rounded border border-white/20 px-4 py-2">Explore</Link>
        <Link href="/trending" className="rounded border border-white/20 px-4 py-2">Trending</Link>
        <Link href="/tiktok-creates" className="rounded border border-white/20 px-4 py-2">TikTok Creates</Link>
        <Link href="/admin-dashboard" className="rounded border border-white/20 px-4 py-2">Admin Dashboard</Link>
      </div>
    </main>
  );
}
