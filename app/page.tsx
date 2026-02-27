import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Next.js + Tailwind + shadcn/ui</h1>
      <p className="text-muted-foreground">Starter now includes Prisma MongoDB and secure auth scaffolding.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/admin">Admin</Link>
        </Button>
      </div>
    </main>
  );
}
