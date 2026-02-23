import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await prisma.userAccount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ users });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const user = await prisma.userAccount.update({ where: { id: Number(body.id) }, data: { role: body.role, isActive: Boolean(body.isActive) } });
  return NextResponse.json({ user });
}
