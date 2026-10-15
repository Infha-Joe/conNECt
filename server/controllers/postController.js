import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res) => {
  const { content, mediaUrl, mediaType } = req.body;

  if (!content && !mediaUrl) {
    res.status(400);
    throw new Error("Post content or media is required");
  }

  const post = await Post.create({
    author: req.user._id,
    content,
    mediaUrl,
    mediaType
  });

  const populatedPost = await post.populate("author", "name profilePhoto department year role");

  // Send notifications to all accepted connections
  try {
    const connections = await Connection.find({
      status: "accepted",
      $or: [{ requester: req.user._id }, { recipient: req.user._id }]
    });

    if (connections.length > 0) {
      const connectedUserIds = connections.map(conn => 
        conn.requester.toString() === req.user._id.toString() ? conn.recipient : conn.requester
      );

      const notifications = connectedUserIds.map(userId => ({
        user: userId,
        type: "post",
        title: "New Post from Connection",
        message: `${req.user.name} shared a new post`,
        relatedId: post._id
      }));

      const savedNotifications = await Notification.insertMany(notifications);
      
      savedNotifications.forEach(notif => {
        emitToUser(notif.user.toString(), "notification:new", notif);
      });
    }
  } catch (err) {
    console.error("Failed to send post notifications:", err);
    // Don't fail the post creation if notifications fail
  }

  res.status(201).json({ success: true, post: populatedPost });
});

// @desc    Get all feed posts
// @route   GET /api/posts/feed
// @access  Private
import User from "../models/User.js";

export const getFeedPosts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    const matchingUsers = await User.find({ name: { $regex: search, $options: "i" } }).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    query = {
      $or: [
        { content: { $regex: search, $options: "i" } },
        { author: { $in: userIds } }
      ]
    };
  }
  const posts = await Post.find(query)
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

export const getUserPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .populate("author", "name profilePhoto department year role")
    .lean();

  const postsWithCommentCounts = await Promise.all(
    posts.map(async (post) => {
      const commentCount = await Comment.countDocuments({ post: post._id });
      return { ...post, commentCount };
    })
  );

  res.status(200).json({ success: true, posts: postsWithCommentCounts });
});


// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  // Verify ownership
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("User not authorized to delete this post");
  }

  // Media cleanup
  if (post.mediaUrl) {
    import('path').then(path => {
      import('fs').then(fsModule => {
        // mediaUrl is typically '/uploads/filename.ext'
        const filePath = path.join(process.cwd(), post.mediaUrl);
        if (fsModule.existsSync(filePath)) {
          fsModule.unlinkSync(filePath);
        }
      });
    });
  }

  await post.deleteOne();
  res.status(200).json({ success: true, message: "Post removed" });
});


// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name profilePhoto department year role");

  if (!post) {
    res.status(404);
    throw new Error("Post not found");
  }

  res.status(200).json({ success: true, post });
});
