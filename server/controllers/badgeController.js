import asyncHandler from "express-async-handler";
import Badge from "../models/Badge.js";
import UserBadge from "../models/UserBadge.js";
import { awardBadge } from "../utils/badgeAwards.js";

// @desc    List all available badges
// @route   GET /api/badges
// @access  Private
export const getBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find().sort({ name: 1 });
  res.status(200).json({ success: true, badges });
});

// @desc    Get a user's earned badges
// @route   GET /api/badges/user/:userId
// @access  Private
export const getUserBadges = asyncHandler(async (req, res) => {
  const userBadges = await UserBadge.find({ user: req.params.userId })
    .sort({ awardedAt: -1 })
    .populate("badge");
  res.status(200).json({ success: true, count: userBadges.length, badges: userBadges.map((ub) => ({ ...ub.badge.toObject(), awardedAt: ub.awardedAt })) });
});

// @desc    Manually award a badge to a user (admin only)
// @route   POST /api/badges/award
// @access  Private/Admin
export const manuallyAwardBadge = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only an admin can manually award badges");
  }

  const { userId, badgeName } = req.body;
  if (!userId || !badgeName) {
    res.status(400);
    throw new Error("userId and badgeName are required");
  }

  const result = await awardBadge(userId, badgeName);
  if (!result) {
    res.status(400);
    throw new Error("Badge already awarded to this user, or badge does not exist");
  }

  res.status(201).json({ success: true, message: `${badgeName} awarded` });
});
