import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [categories, hashtags] = await Promise.all([
    prisma.hashtagCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.hashtag.findMany({ include: { taxonomy: true }, orderBy: { usageCount: "desc" } })
  ]);
  return NextResponse.json({ categories, hashtags });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const hashtag = await prisma.hashtag.create({
    data: {
      tag: body.tag,
      category: body.category,
      usageCount: Number(body.usageCount ?? 0),
      engagement: Number(body.engagement ?? 0),
      source: body.source ?? "admin",
      trending: Number(body.engagement ?? 0) >= 8.5
    }
  });
  return NextResponse.json({ hashtag });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const updated = await prisma.hashtag.update({
    where: { id: Number(body.id) },
    data: {
      tag: body.tag,
      categoryId: body.categoryId ? Number(body.categoryId) : null,
      category: body.category,
      usageCount: Number(body.usageCount ?? 0),
      engagement: Number(body.engagement ?? 0),
      source: body.source ?? "admin",
      trending: Number(body.engagement ?? 0) >= 8.5
    }
  });
  return NextResponse.json({ hashtag: updated });
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  await prisma.hashtag.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
