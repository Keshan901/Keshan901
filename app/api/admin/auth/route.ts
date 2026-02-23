import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminSession } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email = String(body.email ?? "").toLowerCase();

  const user = await prisma.userAccount.findUnique({ where: { email } });
  if (!user || user.role !== "ADMIN" || !user.isActive) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = await createAdminSession(user.id);
  await prisma.userAccount.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

  const response = NextResponse.json({ ok: true, user: { email: user.email, role: user.role } });
  response.cookies.set("admin_session", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", { path: "/", maxAge: 0 });
  return response;
}
