import express from "express";
import {
  createPost, getFeed, getUserPosts, getPost, deletePost,
  likePost, unlikePost, addComment, getComments,
} from "../controllers/postController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/feed", protect, getFeed);
router.get("/user/:userId", protect, getUserPosts);
router.get("/:id", protect, getPost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, likePost);
router.delete("/:id/like", protect, unlikePost);
router.post("/:id/comments", protect, addComment);
router.get("/:id/comments", protect, getComments);

export default router;
