import { Router } from "express";

import { getAdminTrackers } from "../controllers/admin.controller";

const router = Router();

router.get("/trackers", getAdminTrackers);

export default router;
