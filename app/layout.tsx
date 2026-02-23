import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-user";

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold text-brand.deep">Viral Keywords Report DB</Link>
            <nav className="flex flex-wrap gap-4 text-sm items-center">
              <Link href="/" className="text-slate-700 hover:text-brand.teal font-medium">Home</Link>
              <Link href="/explore" className="text-slate-700 hover:text-brand.teal">Explore</Link>
              <Link href="/explore" className="text-slate-700 hover:text-brand.teal">Popular Tags</Link>
              <Link href="/tips" className="text-slate-700 hover:text-brand.teal">Blogs</Link>
              <Link href="/favorites" className="rounded bg-brand.deep px-2 py-1 text-white">My Favorites</Link>
              <Link href="/admin" className="text-slate-700 hover:text-brand.teal">Admin</Link>
              {user ? <span className="text-brand.deep">Hi, {user.name}</span> : <><Link href="/sign-in" className="text-slate-700 hover:text-brand.teal">Sign-in</Link><Link href="/sign-up" className="rounded border px-2 py-1 text-brand.deep">Join with us</Link></>}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
