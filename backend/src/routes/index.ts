import type { Request, Response } from "express";
import { Router } from "express";

import adminRoutes from "./admin.routes";
import postsRoutes from "./posts.routes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

router.use("/posts", postsRoutes);
router.use("/admin", adminRoutes);

export default router;
