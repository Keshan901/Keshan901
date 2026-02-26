import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";

export async function GET() {
  const tips = await prisma.dailyTip.findMany({ orderBy: { date: "desc" }, take: 50 });
  return Response.json(tips);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.user.role !== Role.ADMIN) return apiError("Forbidden", 403);
  const body = await request.json();
  const created = await prisma.dailyTip.create({ data: { title: body.title, body: body.body, date: new Date(body.date ?? new Date()) } });
  return Response.json(created, { status: 201 });
}
