"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@viral.local");
  const [error, setError] = useState("");
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
    if (!res.ok) return setError("Invalid admin account");
    router.push("/admin");
  }

  return (
    <section className="mx-auto mt-12 max-w-md rounded-xl border bg-white p-6">
      <h1 className="text-xl font-semibold">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-600">Use seeded admin user: admin@viral.local</p>
      <form onSubmit={login} className="mt-4 space-y-3">
        <input className="w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button className="w-full rounded bg-brand.deep py-2 text-white">Sign in</button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </section>
  );
}
