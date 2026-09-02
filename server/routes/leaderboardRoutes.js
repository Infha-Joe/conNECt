import express from "express";
import { getLeaderboard } from "../controllers/challengeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);

export default router;
