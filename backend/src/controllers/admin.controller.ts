import type { Request, Response } from "express";

import { getTrackers } from "../services/admin.service";

export async function getAdminTrackers(_req: Request, res: Response) {
  const data = await getTrackers();
  res.json(data);
}
