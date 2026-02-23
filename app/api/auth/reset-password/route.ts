import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { apiError, safeApi } from "@/lib/security/api";
import { resetPasswordSchema } from "@/lib/validators/auth";

export async function POST(request: Request): Promise<Response> {
  return safeApi(async () => {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return apiError("Invalid payload", 422);

    const email = Buffer.from(parsed.data.token, "base64").toString("utf-8");
    if (!email.includes("@")) return apiError("Invalid token", 400);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) return apiError("Invalid token", 400);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: await argon2.hash(parsed.data.password), failedLoginAttempts: 0, lockedUntil: null },
    });

    return Response.json({ success: true });
  });
}
