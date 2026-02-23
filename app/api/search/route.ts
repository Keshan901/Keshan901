import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "all";
    const minEngagement = Number(searchParams.get("minEngagement") ?? 0);

    const [keywords, hashtags, formulas] = await Promise.all([
      prisma.keyword.findMany({ where: { term: { contains: query }, ...(category === "all" ? {} : { category }), engagement: { gte: minEngagement } }, orderBy: { usageCount: "desc" } }),
      prisma.hashtag.findMany({ where: { tag: { contains: query }, ...(category === "all" ? {} : { category }), engagement: { gte: minEngagement } }, orderBy: { usageCount: "desc" }, take: 50 }),
      prisma.contentFormula.findMany({ where: { OR: [{ title: { contains: query } }, { template: { contains: query } }], ...(category === "all" ? {} : { category }), avgEngagementRate: { gte: minEngagement } }, orderBy: { avgEngagementRate: "desc" } }),
    ]);

    return NextResponse.json({ keywords, hashtags, formulas, maintenance: false });
  } catch {
    return NextResponse.json({ maintenance: true, message: "This in maintence mode recover soonly" }, { status: 503 });
  }
}
