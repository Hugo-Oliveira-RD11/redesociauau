import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  create,
  uploadImagePost,
  list,
  feed,
  react,
  remove,
  update,
} from "../controllers/post.controller";
import { upload } from "../utils/fileUpload";

const router = express.Router();

const asyncHandler =
  (fn: express.RequestHandler) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

router.post("/", authenticate, asyncHandler(create as any));
router.post(
  "/upload",
  authenticate,
  upload.single("image"),
  asyncHandler(uploadImagePost as any)
);
router.get("/", authenticate, asyncHandler(list as any));
router.get("/feed", authenticate, asyncHandler(feed as any));
router.post("/:postId/react", authenticate, asyncHandler(react as any));
router.delete("/:postId", authenticate, asyncHandler(remove as any));
router.put("/:postId", authenticate, asyncHandler(update as any)); // Fixed route to be consistent

export default router;
