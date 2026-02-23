import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [users, hashtags, keywords, apis, events] = await Promise.all([
    prisma.userAccount.count(),
    prisma.hashtag.count(),
    prisma.keyword.count(),
    prisma.apiCredential.count({ where: { enabled: true } }),
    prisma.analyticsEvent.findMany({ orderBy: { occurredAt: "desc" }, take: 30 })
  ]);

  return NextResponse.json({ stats: { users, hashtags, keywords, activeApis: apis }, events });
}
