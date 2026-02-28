"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-sm text-slate-300">{error.message || "Unexpected error."}</p>
      <button onClick={reset} className="rounded bg-fuchsia-500 px-4 py-2 text-sm font-medium">
        Try again
      </button>
    </main>
  );
}
