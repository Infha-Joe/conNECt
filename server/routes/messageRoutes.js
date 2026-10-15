import express from "express";
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
} from "../controllers/messageController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/unread/count", protect, getUnreadMessageCount);

router.get("/:userId", protect, getMessages);
router.post("/:userId", protect, sendMessage);
router.put("/:userId/read", protect, markMessagesAsRead);

export default router;
