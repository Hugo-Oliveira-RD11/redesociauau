import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  create,
  join,
  addMember,
  removeMember,
  deleteGroup,
  getPosts,
  search,
} from "../controllers/group.controller";

const router = express.Router();

const asyncHandler =
  (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", authenticate, asyncHandler(create as any));
router.post("/:groupId/join", authenticate, asyncHandler(join as any));
router.delete("/:groupId", authenticate, asyncHandler(deleteGroup as any));
router.post("/:groupId/members", authenticate, asyncHandler(addMember as any));
router.delete(
  "/:groupId/members/:userId",
  authenticate,
  asyncHandler(removeMember as any)
);
router.get("/:groupId/posts", authenticate, asyncHandler(getPosts as any));
router.get("/search", authenticate, asyncHandler(search as any));

export default router;
