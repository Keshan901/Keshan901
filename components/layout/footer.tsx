import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-3">
        <div><p className="text-lg font-semibold">ViralVault</p><p className="text-sm text-zinc-400">Find viral opportunities daily.</p></div>
        <div className="space-y-2 text-sm"><Link href="/privacy">Privacy</Link><br/><Link href="/terms">Terms</Link></div>
        <div className="space-x-3 text-sm"><a href="https://x.com">X</a><a href="https://instagram.com">Instagram</a></div>
      </div>
    </footer>
  );
}
