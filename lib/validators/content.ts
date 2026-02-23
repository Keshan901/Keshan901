import { z } from "zod";

export const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  platform: z.string().optional(),
  sort: z.enum(["trending", "newest", "most-copied"]).optional(),
});

export const setSchema = z.object({
  title: z.string().min(3).max(120),
  platform: z.enum(["TikTok", "Instagram", "Facebook", "YouTube"]),
  category: z.string().min(2).max(40),
  language: z.string().min(2).max(30),
  content: z.array(z.string().min(1)).min(2).max(50),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});

export const creatorApplicationSchema = z.object({
  message: z.string().min(20).max(500),
});

export const blogSchema = z.object({
  slug: z.string().min(3).max(120).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3).max(120),
  excerpt: z.string().min(10).max(200),
  contentMarkdown: z.string().min(20),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
