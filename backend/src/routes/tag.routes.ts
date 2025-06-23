import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  addTag,
  removeTag,
  getUserTagController,
  search,
  popular,
} from "../controllers/tag.controller";

const router = express.Router();

const asyncHandler =
  (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", authenticate, addTag as any);
router.delete("/:tagId", authenticate, removeTag as any);
router.get("/user/:userId", authenticate, getUserTagController as any);
router.get("/search", authenticate, asyncHandler(search as any));
router.get("/popular", authenticate, popular as any);

export default router;
