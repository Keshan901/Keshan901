import { ApplicationStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError } from "@/lib/security/api";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (session?.user.role !== Role.ADMIN) return apiError("Forbidden", 403);
  const body = await request.json();
  const app = await prisma.creatorApplication.update({ where: { id: body.id }, data: { status: body.status } });
  if (body.status === ApplicationStatus.APPROVED) {
    await prisma.user.update({ where: { id: app.userId }, data: { role: Role.CREATOR } });
  }
  return Response.json(app);
}
