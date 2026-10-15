import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getUserAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from "../controllers/achievementController.js";

const router = express.Router();

router.get("/user/:userId", protect, getUserAchievements);
router.post("/", protect, createAchievement);
router.put("/:id", protect, updateAchievement);
router.delete("/:id", protect, deleteAchievement);

export default router;
