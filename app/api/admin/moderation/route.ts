import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";
import { apiError, safeApi } from "@/lib/security/api";

export async function DELETE(request: Request): Promise<Response> {
  return safeApi(async () => {
    const session = await getSession();
    if (session?.user.role !== Role.ADMIN) return apiError("Forbidden", 403);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");
    if (!type || !id) return apiError("Missing params", 400);

    if (type === "keyword") {
      await prisma.keywordSet.delete({ where: { id } });
      return Response.json({ success: true });
    }

    if (type === "hashtag") {
      await prisma.hashtagSet.delete({ where: { id } });
      return Response.json({ success: true });
    }

    return apiError("Invalid type", 422);
  });
}
