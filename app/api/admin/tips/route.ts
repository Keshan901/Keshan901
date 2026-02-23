import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const tips = await prisma.contentTip.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ tips });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const tip = await prisma.contentTip.create({ data: { formula: body.formula, postingTime: body.postingTime, strategy: body.strategy } });
  return NextResponse.json({ tip });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const tip = await prisma.contentTip.update({ where: { id: Number(body.id) }, data: { formula: body.formula, postingTime: body.postingTime, strategy: body.strategy } });
  return NextResponse.json({ tip });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await prisma.contentTip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
