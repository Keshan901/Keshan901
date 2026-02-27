import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  AUTH_LOCKOUT_DURATION_MS,
  AUTH_LOCKOUT_MAX_FAILURES,
  hashIp,
  rateLimitAuthRoute
} from "@/lib/security";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const clientIp = request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const rateLimit = rateLimitAuthRoute(`credentials:${hashIp(clientIp)}`);

        if (rateLimit.limited) {
          throw new Error("Too many auth requests. Please try again later.");
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email }
        });

        if (!user || !user.isActive) {
          return null;
        }

        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account temporarily locked due to repeated failed login attempts.");
        }

        const validPassword = await compare(parsed.data.password, user.passwordHash);

        if (!validPassword) {
          const nextFailedCount = user.failedLoginAttempts + 1;
          const shouldLock = nextFailedCount >= AUTH_LOCKOUT_MAX_FAILURES;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: nextFailedCount,
              lockedUntil: shouldLock ? new Date(Date.now() + AUTH_LOCKOUT_DURATION_MS) : null
            }
          });

          await prisma.auditLog.create({
            data: {
              action: shouldLock ? "AUTH_LOCKOUT" : "AUTH_FAILED_LOGIN",
              entityType: "User",
              entityId: user.id,
              actorId: user.id,
              ipAddress: clientIp,
              metadata: {
                failedLoginAttempts: nextFailedCount,
                lockoutApplied: shouldLock
              }
            }
          });

          return null;
        }

        if (user.failedLoginAttempts > 0 || user.lockedUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null
            }
          });
        }

        await prisma.auditLog.create({
          data: {
            action: "AUTH_LOGIN_SUCCESS",
            entityType: "User",
            entityId: user.id,
            actorId: user.id,
            ipAddress: clientIp
          }
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    }
  }
});
