import asyncHandler from "express-async-handler";
import Suggestion from "../models/Suggestion.js";

const populateUser = "name role profilePhoto department";

export const createSuggestion = asyncHandler(async (req, res) => {
  const { type, targetType, text } = req.body;
  if (!type || !text) {
    res.status(400);
    throw new Error("Type and text are required");
  }
  if (!["suggestion", "feedback"].includes(type)) {
    res.status(400);
    throw new Error("Type must be 'suggestion' or 'feedback'");
  }
  const suggestion = await Suggestion.create({ user: req.user._id, type, targetType: targetType || "platform", text });
  await suggestion.populate("user", populateUser);
  res.status(201).json({ success: true, suggestion });
});

export const getSuggestions = asyncHandler(async (req, res) => {
  const { type, status } = req.query;
  const filter = {};
  if (req.user.role !== "admin") filter.user = req.user._id;
  if (type) filter.type = type;
  if (status) filter.status = status;
  const suggestions = await Suggestion.find(filter).sort({ createdAt: -1 }).populate("user", populateUser);
  res.status(200).json({ success: true, count: suggestions.length, suggestions });
});

export const reviewSuggestion = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only an admin can mark suggestions as reviewed");
  }
  const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { status: "reviewed" }, { new: true }).populate("user", populateUser);
  if (!suggestion) {
    res.status(404);
    throw new Error("Suggestion not found");
  }
  res.status(200).json({ success: true, suggestion });
});
