"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export default function SignupPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const onSubmit = form.handleSubmit(async (values) => {
    await fetch("/api/auth/signup", { method: "POST", body: JSON.stringify(values) });
    window.location.href = "/login";
  });

  return (
    <Card className="mx-auto max-w-md"><h1 className="mb-4 text-2xl font-bold">Create account</h1><form onSubmit={onSubmit} className="space-y-3"><Input placeholder="Name" {...form.register("name")} /><Input placeholder="Email" {...form.register("email")} /><Input type="password" placeholder="Password" {...form.register("password")} /><Button className="w-full">Sign up</Button></form></Card>
  );
}
