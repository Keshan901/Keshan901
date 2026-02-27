"use client";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-semibold">Admin dashboard failed</h2>
      <p className="text-sm text-slate-300">{error.message || "Unexpected error."}</p>
      <button onClick={reset} className="rounded bg-fuchsia-500 px-4 py-2 text-sm font-medium">Retry</button>
    </main>
  );
}
