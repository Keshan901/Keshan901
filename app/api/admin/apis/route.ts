import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminUserFromCookie } from "@/lib/admin/auth";
import { APIIntegrationManager } from "@/lib/apiIntegrationManager";

const placeholderProviders = ["meta-graph", "twitter-v2", "public-trends"];

export async function GET() {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  for (const provider of placeholderProviders) {
    await prisma.apiCredential.upsert({
      where: { provider },
      update: {},
      create: { provider, apiKey: "", enabled: provider === "public-trends", lastStatus: provider === "public-trends" ? "active" : "not-configured" }
    });
  }

  const apis = await prisma.apiCredential.findMany({ orderBy: { provider: "asc" } });
  return NextResponse.json({ apis });
}

export async function PUT(request: NextRequest) {
  const admin = await getAdminUserFromCookie();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  const api = await prisma.apiCredential.upsert({
    where: { provider: body.provider },
    update: {
      apiKey: body.apiKey,
      apiSecret: body.apiSecret ?? null,
      baseUrl: body.baseUrl ?? null,
      enabled: Boolean(body.enabled),
      lastStatus: body.apiKey ? "configured" : "not-configured",
      lastTested: new Date()
    },
    create: {
      provider: body.provider,
      apiKey: body.apiKey,
      apiSecret: body.apiSecret ?? null,
      baseUrl: body.baseUrl ?? null,
      enabled: Boolean(body.enabled),
      lastStatus: body.apiKey ? "configured" : "not-configured",
      lastTested: new Date()
    }
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
