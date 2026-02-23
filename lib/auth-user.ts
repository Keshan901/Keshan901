import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function getCurrentUser() {
  const token = cookies().get("user_session")?.value;
  if (!token) return null;
  const session = await prisma.userSession.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;
  return session.user;
}

export async function createUserSession(userId: number) {
  const token = randomBytes(24).toString("hex");
  await prisma.userSession.create({ data: { token, userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
  return token;
}
