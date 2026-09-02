import express from "express";
import { getBadges, getUserBadges, manuallyAwardBadge } from "../controllers/badgeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getBadges);
router.get("/user/:userId", protect, getUserBadges);
router.post("/award", protect, manuallyAwardBadge);

export default router;
