"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  return <Card className="mx-auto max-w-md"><h1 className="mb-4 text-xl font-bold">Forgot Password</h1><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" /><Button className="mt-3" onClick={() => fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })}>Send reset email</Button></Card>;
}
