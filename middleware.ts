import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { rateLimitAuthRoute, SECURITY_HEADERS, hashIp } from "@/lib/security";

const publicRoutes = new Set(["/", "/login"]);

function applySecurityHeaders(response: NextResponse) {
  for (const [header, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(header, value);
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const limit = rateLimitAuthRoute(`route:${hashIp(ip)}:${pathname}`);

    if (limit.limited) {
      const response = NextResponse.json({ message: "Too many requests" }, { status: 429 });
      response.headers.set("Retry-After", String(Math.ceil((limit.resetAt - Date.now()) / 1000)));
      applySecurityHeaders(response);
      return response;
    }
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isLoggedIn = Boolean(token?.sub);

  if (!publicRoutes.has(pathname) && (pathname.startsWith("/admin") || pathname.startsWith("/admin-dashboard"))) {
    if (!isLoggedIn || token?.role !== "ADMIN") {
      const response = NextResponse.redirect(new URL("/login", request.url));
      applySecurityHeaders(response);
      return response;
    }
  }

  if (!publicRoutes.has(pathname) && pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      applySecurityHeaders(response);
      return response;
    }
  }

  if (!publicRoutes.has(pathname) && pathname.startsWith("/user-dashboard")) {
    if (!isLoggedIn) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      applySecurityHeaders(response);
      return response;
    }

    if (token?.role !== "USER") {
      const response = NextResponse.redirect(new URL("/admin", request.url));
      applySecurityHeaders(response);
      return response;
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
