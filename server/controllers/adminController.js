import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Mentorship from "../models/Mentorship.js";
import Club from "../models/Club.js";
import Department from "../models/Department.js";
import Suggestion from "../models/Suggestion.js";
import CommunityRequest from "../models/CommunityRequest.js";
import Project from "../models/Project.js";

const populateDept = "name code themeColor";

export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers, students, teachers, alumni, admins, verifiedUsers,
    totalPosts, activeWorkspaces,
    totalClubs, pendingSuggestions, openCommunityRequests,
    totalProjects
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "alumni" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isVerified: true }),
    Post.countDocuments(),
    Mentorship.countDocuments({ status: "active" }),
    Club.countDocuments(),
    Suggestion.countDocuments({ status: "pending" }),
    CommunityRequest.countDocuments({ status: "open" }),
    Project.countDocuments(),
  ]);

  const departments = await Department.find();
  const departmentActivity = await Promise.all(
    departments.map(async (dept) => {
      const userCount = await User.countDocuments({ department: dept._id });
      return { department: { _id: dept._id, name: dept.name, code: dept.code }, userCount };
    })
  );

  res.status(200).json({
    success: true,
    analytics: {
      users: { total: totalUsers, students, teachers, alumni, admins, verified: verifiedUsers },
      content: { posts: totalPosts },
      projects: { total: totalProjects, activeMentorCollaborations: activeWorkspaces },
      community: { pendingSuggestions, openCommunityRequests },
      departmentActivity,
    }
  });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { role, department, verified, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = department;
  if (verified !== undefined) filter.isVerified = verified === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { connectId: { $regex: search, $options: "i" } }
    ];
  }
  const users = await User.find(filter).populate("department", populateDept).sort("-createdAt");
  res.status(200).json({ success: true, count: users.length, users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  if (req.user._id.toString() === id) { res.status(400); throw new Error("Cannot change your own role"); }
  const user = await User.findById(id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.role = role;
  await user.save();
  res.status(200).json({ success: true, user });
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  user.isVerified = true;
  await user.save();
  res.status(200).json({ success: true, user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user._id.toString() === id) { res.status(400); throw new Error("Cannot delete yourself"); }
  const user = await User.findById(id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  await user.deleteOne();
  res.status(200).json({ success: true, message: "User deleted successfully" });
});
