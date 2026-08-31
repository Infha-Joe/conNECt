import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error("Post content is required");
  }

  const post = await Post.create({
    author: req.user._id,
    content,
  });

  const populatedPost = await post.populate("author", "name profilePhoto department year role");

  res.status(201).json({ success: true, post: populatedPost });
});

// @desc    Get all feed posts
// @route   GET /api/posts/feed
// @access  Private
export const getFeedPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author", "name profilePhoto department year role")
    .lean();

  // Attach comment counts
  const postsWithCommentCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    })
  );

  res.status(200).json({ success: true, posts: postsWithCommentCounts });
});

// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const isLiked = post.likes.includes(req.user._id);

  if (isLiked) {
    post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();

  res.status(200).json({ success: true, likes: post.likes });
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  if (!content) {
    res.status(400);
    throw new Error("Comment content is required");
  }

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({
    post: postId,
    author: req.user._id,
    content,
  });

  const populatedComment = await comment.populate("author", "name profilePhoto department year role");

  res.status(201).json({ success: true, comment: populatedComment });
});

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Private
export const getPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .sort({ createdAt: -1 })
    .populate("author", "name profilePhoto department year role");

  res.status(200).json({ success: true, comments });
});
