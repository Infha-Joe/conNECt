import User from "../models/User.js";
import asyncHandler from "express-async-handler";

export const getSpotlightUsers = asyncHandler(async (req, res) => {
  // Get top users based on streak/xp or randomly if empty
  const students = await User.find({ role: "student" }).sort({ xpPoints: -1 }).limit(3).select("name role department year bio profilePhoto");
  const faculty = await User.find({ role: "teacher" }).limit(3).select("name role department designation bio profilePhoto");
  const alumni = await User.find({ role: "alumni" }).limit(3).select("name role department currentRole currentCompany bio profilePhoto");

  const spotlight = [...students, ...faculty, ...alumni];
  res.json({ success: true, spotlight });
});
