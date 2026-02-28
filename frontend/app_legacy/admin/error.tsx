"use client";

import { RouteError } from "@/components/common/route-error";

export default function RouteSegmentError({ error, reset }: { error: Error; reset: () => void }) {
  return <RouteError title="Page failed to load" error={error} reset={reset} />;
}
