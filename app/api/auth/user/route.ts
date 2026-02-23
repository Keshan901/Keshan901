import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createUserSession } from "@/lib/auth-user";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const mode = body.mode as "signin" | "signup";
  const email = String(body.email ?? "").toLowerCase();
  const password = String(body.password ?? "");
  const name = String(body.name ?? "Member");

  let user = await prisma.userAccount.findUnique({ where: { email } });

  if (mode === "signup") {
    if (!user) {
      user = await prisma.userAccount.create({ data: { email, name, password, role: "VIEWER", isActive: true } });
    }
  }

  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createUserSession(user.id);
  await prisma.userAccount.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const response = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  response.cookies.set("user_session", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("user_session", "", { path: "/", maxAge: 0 });
  return response;
}
