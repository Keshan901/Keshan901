import { createHash } from "crypto";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const AUTH_WINDOW_MS = 15 * 60 * 1000;
const AUTH_MAX_ATTEMPTS = 20;
const authRequestBuckets = new Map<string, RateLimitEntry>();

export const AUTH_LOCKOUT_MAX_FAILURES = 5;
export const AUTH_LOCKOUT_DURATION_MS = 15 * 60 * 1000;

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function rateLimitAuthRoute(key: string) {
  const now = Date.now();
  const current = authRequestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    authRequestBuckets.set(key, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return {
      limited: false,
      remaining: AUTH_MAX_ATTEMPTS - 1,
      resetAt: now + AUTH_WINDOW_MS
    };
  }

  current.count += 1;

  if (current.count > AUTH_MAX_ATTEMPTS) {
    return {
      limited: true,
      remaining: 0,
      resetAt: current.resetAt
    };
  }

  return {
    limited: false,
    remaining: AUTH_MAX_ATTEMPTS - current.count,
    resetAt: current.resetAt
  };
}

export const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Content-Security-Policy": [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "form-action 'self'"
  ].join("; ")
};
