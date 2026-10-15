import express from "express";
import {
  getUserPosts,
  createPost,
  getFeedPosts,
  likePost,
  addComment,
  getPostComments,
  deletePost,
  getPost,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeedPosts);
router.get("/user", protect, getUserPosts);
router.delete("/:id", protect, deletePost);
router.get("/:id", protect, getPost);
router.post("/:id/like", protect, likePost);
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getPostComments);

export default router;
