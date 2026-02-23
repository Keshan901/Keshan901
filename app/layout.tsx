import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-semibold text-brand.deep">
              Viral Keywords Report DB
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/" className="text-slate-700 hover:text-brand.teal">
                Dashboard
              </Link>
              <Link href="/tips" className="text-slate-700 hover:text-brand.teal">
                Content Tips
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
