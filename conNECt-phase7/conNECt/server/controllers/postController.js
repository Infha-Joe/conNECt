import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import PostLike from "../models/PostLike.js";
import Comment from "../models/Comment.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

const populateAuthor = "name role profilePhoto department";

export const createPost = asyncHandler(async (req, res) => {
  const { caption, media } = req.body;
  if (!caption && (!media || media.length === 0)) {
    res.status(400);
    throw new Error("A post needs a caption or media");
  }
  const post = await Post.create({ author: req.user._id, caption, media: media || [] });
  await post.populate("author", populateAuthor);
  res.status(201).json({ success: true, post });
});

export const getFeed = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const followedDocs = await Follow.find({ follower: req.user._id }).select("following");
  const followedIds = followedDocs.map((f) => f.following);
  const authorIds = [...followedIds, req.user._id];

  const posts = await Post.find({ author: { $in: authorIds } })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", populateAuthor);

  const postIds = posts.map((p) => p._id);
  const likes = await PostLike.find({ post: { $in: postIds }, user: req.user._id });
  const likedPostIds = new Set(likes.map((l) => l.post.toString()));

  const postsWithLikeState = posts.map((p) => ({
    ...p.toObject(),
    likedByMe: likedPostIds.has(p._id.toString()),
  }));

  res.status(200).json({ success: true, page, count: posts.length, posts: postsWithLikeState });
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 }).populate("author", populateAuthor);
  res.status(200).json({ success: true, count: posts.length, posts });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", populateAuthor);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  res.status(200).json({ success: true, post });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only delete your own posts");
  }
  await Promise.all([
    Post.findByIdAndDelete(post._id),
    PostLike.deleteMany({ post: post._id }),
    Comment.deleteMany({ post: post._id }),
  ]);
  res.status(200).json({ success: true, message: "Post deleted" });
});

export const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  try {
    await PostLike.create({ post: post._id, user: req.user._id });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("You already liked this post");
    }
    throw err;
  }

  post.likeCount += 1;
  await post.save();

  if (post.author.toString() !== req.user._id.toString()) {
    const notification = await Notification.create({
      user: post.author,
      type: "like",
      title: "New like",
      message: `${req.user.name} liked your post`,
      relatedId: post._id,
    });
    emitToUser(post.author.toString(), "notification:new", notification);
  }

  res.status(200).json({ success: true, likeCount: post.likeCount });
});

export const unlikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }
  const deleted = await PostLike.findOneAndDelete({ post: post._id, user: req.user._id });
  if (deleted) {
    post.likeCount = Math.max(0, post.likeCount - 1);
    await post.save();
  }
  res.status(200).json({ success: true, likeCount: post.likeCount });
});

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Comment text is required");
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  const comment = await Comment.create({ post: post._id, user: req.user._id, text: text.trim() });
  post.commentCount += 1;
  await post.save();
  await comment.populate("user", populateAuthor);

  if (post.author.toString() !== req.user._id.toString()) {
    const notification = await Notification.create({
      user: post.author,
      type: "comment",
      title: "New comment",
      message: `${req.user.name} commented on your post`,
      relatedId: post._id,
    });
    emitToUser(post.author.toString(), "notification:new", notification);
  }

  res.status(201).json({ success: true, comment });
});

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: -1 }).populate("user", populateAuthor);
  res.status(200).json({ success: true, count: comments.length, comments });
});
