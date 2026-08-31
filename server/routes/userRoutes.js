import express from "express";
import { getUserProfile, updateUserProfile, searchUsers } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);

export default router;
