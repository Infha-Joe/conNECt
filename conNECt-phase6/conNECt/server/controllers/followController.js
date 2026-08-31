import asyncHandler from "express-async-handler";
import Follow from "../models/Follow.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto department";

export const followUser = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot follow yourself");
  }
  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  try {
    await Follow.create({ follower: req.user._id, following: targetId });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("You already follow this user");
    }
    throw err;
  }

  const notification = await Notification.create({
    user: targetId,
    type: "follow",
    title: "New follower",
    message: `${req.user.name} started following you`,
    relatedId: req.user._id,
  });
  emitToUser(targetId, "notification:new", notification);

  res.status(200).json({ success: true, message: "Followed successfully" });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  await Follow.findOneAndDelete({ follower: req.user._id, following: req.params.id });
  res.status(200).json({ success: true, message: "Unfollowed successfully" });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const follows = await Follow.find({ following: req.params.id }).populate("follower", populateUser);
  res.status(200).json({ success: true, count: follows.length, followers: follows.map((f) => f.follower) });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const follows = await Follow.find({ follower: req.params.id }).populate("following", populateUser);
  res.status(200).json({ success: true, count: follows.length, following: follows.map((f) => f.following) });
});

export const getFollowStats = asyncHandler(async (req, res) => {
  const [followerCount, followingCount, iFollow] = await Promise.all([
    Follow.countDocuments({ following: req.params.id }),
    Follow.countDocuments({ follower: req.params.id }),
    Follow.exists({ follower: req.user._id, following: req.params.id }),
  ]);
  res.status(200).json({ success: true, followerCount, followingCount, followedByMe: Boolean(iFollow) });
});
