import { NextResponse } from "next/server";

export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function safeApi<T>(handler: () => Promise<T>) {
  return handler().catch((error) => {
    console.error("API error", error);
    return apiError("Unexpected server error", 500);
  });
}
