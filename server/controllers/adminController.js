import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Mentorship from "../models/Mentorship.js";
import Club from "../models/Club.js";
import Department from "../models/Department.js";
import Suggestion from "../models/Suggestion.js";
import CommunityRequest from "../models/CommunityRequest.js";

const populateDept = "name code themeColor";

// @desc    Platform-wide analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalUsers, students, teachers, alumni, admins, verifiedUsers,
    totalPosts, activeWorkspaces,
    totalClubs, pendingSuggestions, openCommunityRequests,
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
  ]);

  const totalProjects = 0;
  const totalEvents = 0;
  const totalRegistrations = 0;

  // Department activity — user count + post count per department
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
      content: { posts: totalPosts, clubs: totalClubs },
      projects: { total: totalProjects, activeMentorCollaborations: activeWorkspaces },
      events: { total: totalEvents, totalRegistrations },
      community: { pendingSuggestions, openCommunityRequests },
      departmentActivity,
    },
  });
});

// @desc    List all users with filters (admin)
// @route   GET /api/admin/users?role=&verified=&search=
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, verified, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (verified !== undefined) filter.isVerified = verified === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { collegeId: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 }).populate("department", populateDept);
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Verify (or unverify) a user
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
export const setUserVerification = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: Boolean(isVerified) },
    { new: true }
  ).populate("department", populateDept);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, user });
});

// @desc    Change a user's role (admin only, e.g. promoting to admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ["student", "teacher", "alumni", "admin"];
  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).populate("department", populateDept);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, user });
});
