import { Router } from "express";

import { getPosts, getTikTokPosts, getTrending } from "../controllers/posts.controller";

const router = Router();

router.get("/", getPosts);
router.get("/trending", getTrending);
router.get("/tiktok", getTikTokPosts);

export default router;
