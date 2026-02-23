import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const snapshots = await prisma.dailyTrendSnapshot.findMany({
    include: { keyword: true },
    orderBy: [{ day: "asc" }, { usageCount: "desc" }],
    take: 200,
  });

  return NextResponse.json({ snapshots });
}
