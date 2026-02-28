import type { Request, Response } from "express";

import { listPosts, listTikTokPosts, listTrendingPosts } from "../services/posts.service";

export async function getPosts(_req: Request, res: Response) {
  const items = await listPosts();
  res.json({ items });
}

export async function getTrending(_req: Request, res: Response) {
  const items = await listTrendingPosts();
  res.json({ items });
}

export async function getTikTokPosts(req: Request, res: Response) {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  const items = await listTikTokPosts(q);
  res.json({ items });
}
