import express from "express";
import { register, login, me } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", register as any);
router.post("/login", login as any);
router.get("/me", me as any);

export default router;
