import express from "express";
import {
  createPost,
  getFeedPosts,
  likePost,
  addComment,
  getPostComments,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeedPosts);
router.post("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getPostComments);

export default router;
