import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  send,
  conversation,
  conversations,
} from "../controllers/message.controller";

const router = express.Router();

router.post("/:userId", authenticate, send as any);
router.get("/:userId", authenticate, conversation as any);
router.get("/", authenticate, conversations as any);

export default router;
