import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError, safeApi } from "@/lib/security/api";

const saveSchema = z.object({ itemType: z.enum(["KEYWORD", "HASHTAG"]), itemId: z.string().min(1) });

export async function GET(): Promise<Response> {
  return safeApi(async () => {
    const session = await getSession();
    if (!session?.user) return apiError("Unauthorized", 401);
    const items = await prisma.savedItem.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
    return Response.json(items);
  });
}

export async function POST(request: Request): Promise<Response> {
  return safeApi(async () => {
    const session = await getSession();
    if (!session?.user) return apiError("Unauthorized", 401);
    const parsed = saveSchema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid payload", 422);

    const created = await prisma.savedItem.create({
      data: { userId: session.user.id, itemId: parsed.data.itemId, itemType: parsed.data.itemType },
    });
    return Response.json(created, { status: 201 });
  });
}

export async function DELETE(request: Request): Promise<Response> {
  return safeApi(async () => {
    const session = await getSession();
    if (!session?.user) return apiError("Unauthorized", 401);
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return apiError("id required", 400);

    const existing = await prisma.savedItem.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.user.id) return apiError("Not found", 404);

    await prisma.savedItem.delete({ where: { id } });
    return Response.json({ success: true });
  });
}
