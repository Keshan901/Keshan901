import { cn } from "@/lib/utils/cn";

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("w-full rounded-md border border-border bg-input px-3 py-2 text-sm")}{...props} />;
}
