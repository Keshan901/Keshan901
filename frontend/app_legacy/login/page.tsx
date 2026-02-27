"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("AdminPass123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center p-8">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-4">
        <input
          required
          type="email"
          className="h-10 rounded-md border px-3"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
        />
        <input
          required
          minLength={8}
          type="password"
          className="h-10 rounded-md border px-3"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
      </form>
    </main>
  );
}
