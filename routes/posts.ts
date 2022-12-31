import { Router } from "express";
import controller from "../controllers/posts.js";
const router = Router();
router.post("/setrank", controller.setRank);
router.get("/robloxuserpfp", controller.robloxUserPfp);
export default router;
