"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="mx-auto max-w-xl space-y-3"><h2 className="text-2xl font-bold">Something went wrong</h2><Button onClick={reset}>Try again</Button></div>;
}
