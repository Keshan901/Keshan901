import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return apiError("Unauthorized", 401);
  const items = await prisma.savedItem.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  return Response.json(items);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return apiError("Unauthorized", 401);
  const body = await request.json();
  const created = await prisma.savedItem.create({ data: { userId: session.user.id, itemId: body.itemId, itemType: body.itemType } });
  return Response.json(created, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session?.user) return apiError("Unauthorized", 401);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return apiError("id required", 400);
  await prisma.savedItem.delete({ where: { id } });
  return Response.json({ success: true });
}
