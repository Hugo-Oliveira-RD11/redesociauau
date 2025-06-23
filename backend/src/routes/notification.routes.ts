import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { list, markAsRead } from "../controllers/notification.controller";

const router = express.Router();

router.get("/", authenticate, list as any);
router.patch("/:notificationId/read", authenticate, markAsRead as any);

export default router;
