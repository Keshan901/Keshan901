"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const leftLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/daily-watch", label: "Trending Contents" },
];

const rightLinks = [
  { href: "/become-a-creator", label: "Become a Creator" },
  { href: "/explore?platform=TikTok", label: "TikTok Creators" },
  { href: "/daily-watch", label: "Daily Watch" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="hidden gap-5 md:flex">{leftLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
        <Link href="/" className="text-xl font-bold">ViralVault</Link>
        <div className="hidden items-center gap-4 md:flex">
          {rightLinks.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          <Link href="/dashboard"><Button variant="gradient">Add New</Button></Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <div className="space-y-3 border-t border-border/60 p-4 md:hidden">
          {[...leftLinks, ...rightLinks].map((item) => (
            <Link className="block" key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
          <Link href="/dashboard" onClick={() => setOpen(false)}><Button variant="gradient" className="w-full">Add New</Button></Link>
        </div>
      )}
    </header>
  );
}
