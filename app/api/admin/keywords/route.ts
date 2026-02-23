import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const keywords = await prisma.keyword.findMany({ orderBy: { usageCount: "desc" } });
  return NextResponse.json({ keywords });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const keyword = await prisma.keyword.create({ data: { term: body.term, category: body.category, usageCount: Number(body.usageCount ?? 0), engagement: Number(body.engagement ?? 0), source: body.source ?? "admin" } });
  return NextResponse.json({ keyword });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const keyword = await prisma.keyword.update({ where: { id: Number(body.id) }, data: { term: body.term, category: body.category, usageCount: Number(body.usageCount), engagement: Number(body.engagement) } });
  return NextResponse.json({ keyword });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await prisma.keyword.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
