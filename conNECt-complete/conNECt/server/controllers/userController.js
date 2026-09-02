import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate("department", "name code themeColor");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, user });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  if (req.user._id.toString() !== req.params.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only update your own profile");
  }

  const editableFields = [
    "name", "phone", "bio", "skills", "githubLink", "linkedinLink",
    "portfolioLink", "resumeUrl", "internships", "profilePhoto", "department", "year",
  ];

  const updates = {};
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate("department", "name code themeColor");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, user });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { query = "", role } = req.query;

  const filter = {
    $or: [
      { name: { $regex: query, $options: "i" } },
      { collegeId: { $regex: query, $options: "i" } },
      { skills: { $regex: query, $options: "i" } },
    ],
  };
  if (role) filter.role = role;

  const users = await User.find(filter).limit(20).populate("department", "name code");
  res.status(200).json({ success: true, count: users.length, users });
});
