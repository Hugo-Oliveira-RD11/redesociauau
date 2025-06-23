import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { create, list, react, update } from "../controllers/comment.controller";

const router = express.Router();

router.post("/:postId", authenticate, create as any);
router.get("/:postId", authenticate, list as any);
router.post("/:commentId/react", authenticate, react as any);
router.put("/comments/:commentId", authenticate, update as any);

export default router;
