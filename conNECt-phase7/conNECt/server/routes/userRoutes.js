import express from "express";
import { getUserProfile, updateUserProfile, searchUsers } from "../controllers/userController.js";
import { followUser, unfollowUser, getFollowers, getFollowing, getFollowStats } from "../controllers/followController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);

router.post("/:id/follow", protect, followUser);
router.delete("/:id/follow", protect, unfollowUser);
router.get("/:id/followers", protect, getFollowers);
router.get("/:id/following", protect, getFollowing);
router.get("/:id/follow-stats", protect, getFollowStats);

export default router;
