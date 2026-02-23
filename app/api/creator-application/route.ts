import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";
import { creatorApplicationSchema } from "@/lib/validators/content";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) return apiError("Unauthorized", 401);
  const parsed = creatorApplicationSchema.safeParse(await request.json());
  if (!parsed.success) return apiError("Invalid payload", 422);

  const created = await prisma.creatorApplication.create({ data: { userId: session.user.id, message: parsed.data.message } });
  return Response.json(created, { status: 201 });
}
