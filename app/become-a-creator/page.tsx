"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creatorApplicationSchema } from "@/lib/validators/content";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function BecomeCreatorPage() {
  const form = useForm<z.infer<typeof creatorApplicationSchema>>({ resolver: zodResolver(creatorApplicationSchema) });
  const onSubmit = form.handleSubmit(async (values) => {
    await fetch("/api/creator-application", { method: "POST", body: JSON.stringify(values) });
    alert("Application submitted");
  });

  return <Card className="mx-auto max-w-2xl"><h1 className="text-3xl font-bold">Become a Creator</h1><p className="mt-2 text-zinc-300">Publish public packs and build your profile.</p><form className="mt-4 space-y-3" onSubmit={onSubmit}><Textarea rows={6} placeholder="Tell us about your niche and track record..." {...form.register("message")} /><Button>Apply</Button></form></Card>;
}
