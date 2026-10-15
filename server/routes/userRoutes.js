import express from "express";
import { getUserProfile, updateUserProfile, searchUsers } from "../controllers/userController.js";
import {
  sendConnectionRequest,
  removeConnection,
  getConnectionStatus,
  getUserConnections,
  getConnectionStats,
} from "../controllers/connectionController.js";
import { protect } from "../middleware/auth.js";
import { getSpotlightUsers } from "../controllers/spotlightController.js";

const router = express.Router();

router.get("/spotlight", protect, getSpotlightUsers);
router.get("/search", protect, searchUsers);
router.get("/:id", protect, getUserProfile);
router.put("/:id", protect, updateUserProfile);

router.post("/:id/connect", protect, sendConnectionRequest);
router.delete("/:id/connect", protect, removeConnection);
router.get("/:id/connection-status", protect, getConnectionStatus);
router.get("/:id/connections", protect, getUserConnections);
router.get("/:id/connection-stats", protect, getConnectionStats);

export default router;
