import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const formulas = await prisma.contentFormula.findMany({ orderBy: { avgEngagementRate: "desc" } });
  return NextResponse.json({ formulas });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const formula = await prisma.contentFormula.create({ data: { title: body.title, template: body.template, category: body.category, contentType: body.contentType, avgEngagementRate: Number(body.avgEngagementRate ?? 0) } });
  return NextResponse.json({ formula });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const formula = await prisma.contentFormula.update({ where: { id: Number(body.id) }, data: { title: body.title, template: body.template, category: body.category, contentType: body.contentType, avgEngagementRate: Number(body.avgEngagementRate ?? 0) } });
  return NextResponse.json({ formula });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await prisma.contentFormula.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
