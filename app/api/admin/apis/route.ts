import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";
import { APIIntegrationManager } from "@/lib/apiIntegrationManager";

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const apis = await prisma.apiCredential.findMany({ orderBy: { provider: "asc" } });
  return NextResponse.json({ apis });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const api = await prisma.apiCredential.upsert({
    where: { provider: body.provider },
    update: { apiKey: body.apiKey, apiSecret: body.apiSecret ?? null, baseUrl: body.baseUrl ?? null, enabled: Boolean(body.enabled) },
    create: { provider: body.provider, apiKey: body.apiKey, apiSecret: body.apiSecret ?? null, baseUrl: body.baseUrl ?? null, enabled: Boolean(body.enabled) }
  });
  return NextResponse.json({ api });
}

export async function POST() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const manager = new APIIntegrationManager();
  const data = await manager.fetchAllProviders();
  return NextResponse.json({ total: data.length, sample: data.slice(0, 20) });
}
