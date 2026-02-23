import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.analyticsEvent.findMany({ orderBy: { occurredAt: "asc" }, take: 120 });
  const chart = events.map((event) => ({ date: event.occurredAt.toISOString().slice(0, 10), engagement: event.engagement, type: event.eventType }));
  return NextResponse.json({ chart, events });
}
