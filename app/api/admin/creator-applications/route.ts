import { ApplicationStatus, Role } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError, safeApi } from "@/lib/security/api";

const schema = z.object({ id: z.string().min(1), status: z.nativeEnum(ApplicationStatus) });

export async function PATCH(request: Request): Promise<Response> {
  return safeApi(async () => {
    const session = await getSession();
    if (session?.user.role !== Role.ADMIN) return apiError("Forbidden", 403);

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return apiError("Invalid payload", 422);

    const app = await prisma.creatorApplication.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });

    if (parsed.data.status === ApplicationStatus.APPROVED) {
      await prisma.user.update({ where: { id: app.userId }, data: { role: Role.CREATOR } });
    }

    return Response.json(app);
  });
}
