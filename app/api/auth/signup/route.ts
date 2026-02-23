import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { apiError, safeApi } from "@/lib/security/api";
import { rateLimit } from "@/lib/security/rate-limit";
import { signupSchema } from "@/lib/validators/auth";

export async function POST(request: Request) {
  return safeApi(async () => {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limit = rateLimit(`signup:${ip}`, 10, 60_000);
    if (!limit.success) return apiError("Too many requests", 429);

    const json = await request.json();
    const parsed = signupSchema.safeParse(json);
    if (!parsed.success) return apiError("Invalid payload", 422);

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return apiError("Email already in use", 409);

    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash: await argon2.hash(parsed.data.password),
      },
    });

    console.info(`TODO: send verification email to ${parsed.data.email}`);
    return Response.json({ success: true });
  });
}
