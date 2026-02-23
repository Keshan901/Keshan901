import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const snapshots = await prisma.dailyTrendSnapshot.findMany({ include: { keyword: true }, orderBy: [{ day: "asc" }, { usageCount: "desc" }], take: 200 });
    return NextResponse.json({ snapshots, maintenance: false });
  } catch {
    return NextResponse.json({ maintenance: true, message: "This in maintence mode recover soonly" }, { status: 503 });
  }
}
