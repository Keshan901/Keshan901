"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/user", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "signup", name, email, password }) });
    if (!res.ok) return setError("Unable to create account");
    router.push("/explore");
  }

  return <section className="mx-auto mt-10 max-w-md rounded-xl border bg-white p-6"><h1 className="text-xl font-semibold">Join with us</h1><form onSubmit={submit} className="mt-4 space-y-3"><input className="w-full rounded border px-3 py-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} /><input className="w-full rounded border px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><input className="w-full rounded border px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /><button className="w-full rounded bg-brand.deep py-2 text-white">Create account</button></form>{error && <p className="mt-2 text-sm text-red-600">{error}</p>}</section>;
}
