"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await signIn("credentials", { ...values, redirect: false });
    if (!result?.error) router.push("/dashboard");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input placeholder="Email" {...form.register("email")} />
      <Input type="password" placeholder="Password" {...form.register("password")} />
      <Button className="w-full">Login</Button>
    </form>
  );
}
