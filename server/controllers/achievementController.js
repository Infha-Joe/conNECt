import asyncHandler from "express-async-handler";
import Achievement from "../models/Achievement.js";

// @desc    Get user's achievements
// @route   GET /api/achievements/user/:userId
// @access  Private
export const getUserAchievements = asyncHandler(async (req, res) => {
  const achievements = await Achievement.find({ user: req.params.userId }).sort({ date: -1 });
  res.status(200).json(achievements);
});

// @desc    Add an achievement
// @route   POST /api/achievements
// @access  Private
export const createAchievement = asyncHandler(async (req, res) => {
  const { title, category, description, organization, date, position, proofUrl, link } = req.body;

  const achievement = await Achievement.create({
    user: req.user._id,
    title,
    category,
    description,
    organization,
    date,
    position,
    proofUrl,
    link,
  });

  res.status(201).json(achievement);
});

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Private
export const updateAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    res.status(404);
    throw new Error("Achievement not found");
  }

  // Ensure the user owns the achievement
  if (achievement.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this achievement");
  }

  const updatedAchievement = await Achievement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedAchievement);
});

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private
export const deleteAchievement = asyncHandler(async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);

  if (!achievement) {
    res.status(404);
    throw new Error("Achievement not found");
  }

  if (achievement.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this achievement");
  }

  await achievement.deleteOne();

  res.status(200).json({ success: true, message: "Achievement removed" });
});
