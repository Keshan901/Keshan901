"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  return <Card className="mx-auto max-w-md"><h1 className="mb-4 text-xl font-bold">Reset Password</h1><div className="space-y-3"><Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token" /><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" /><Button onClick={() => fetch("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, password }) })}>Reset password</Button></div></Card>;
}
