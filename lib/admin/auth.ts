import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

export async function getAdminUserFromCookie() {
  const token = cookies().get("admin_session")?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;
  if (session.user.role !== "ADMIN") return null;
  return session.user;
}

export async function createAdminSession(userId: number) {
  const token = randomBytes(24).toString("hex");
  await prisma.adminSession.create({
    data: { token, userId, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) }
  });
  return token;
}
