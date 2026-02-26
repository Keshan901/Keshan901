"use client";

import { Button } from "@/components/ui/button";

export default function CopyButtons({ lines }: { lines: string[] }) {
  const copyAll = async () => navigator.clipboard.writeText(lines.join("\n"));
  const copyOne = async (line: string) => navigator.clipboard.writeText(line);

  return (
    <div className="space-y-2">
      <Button size="sm" onClick={copyAll}>Copy All</Button>
      <div className="flex flex-wrap gap-2">{lines.map((line) => <Button size="sm" variant="outline" key={line} onClick={() => copyOne(line)}>Copy: {line}</Button>)}</div>
    </div>
  );
}
