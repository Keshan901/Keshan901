import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")).join("\n");
  return `${headers.join(",")}\n${body}`;
}

export async function GET(request: NextRequest) {
  const type = new URL(request.url).searchParams.get("type") ?? "hashtags";
  if (type === "formulas") {
    const rows = await prisma.contentFormula.findMany({ select: { title: true, contentType: true, avgEngagementRate: true, category: true } });
    return new NextResponse(toCsv(rows), { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=formulas.csv" } });
  }
  const rows = await prisma.hashtag.findMany({ select: { tag: true, category: true, usageCount: true, engagement: true, source: true } });
  return new NextResponse(toCsv(rows), { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=hashtags.csv" } });
}
