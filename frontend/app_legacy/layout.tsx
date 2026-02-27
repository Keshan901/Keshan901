import type { Metadata } from "next";
import "./globals.css";

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Next.js App Router + shadcn/ui",
  description: "Scaffolded Next.js TypeScript app with TailwindCSS and shadcn/ui"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
