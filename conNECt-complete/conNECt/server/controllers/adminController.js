import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import Event from "../models/Event.js";
import EventRegistration from "../models/EventRegistration.js";
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
    totalPosts, totalProjects, activeWorkspaces, totalEvents, totalRegistrations,
    totalClubs, pendingSuggestions, openCommunityRequests,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "alumni" }),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ isVerified: true }),
    Post.countDocuments(),
    Project.countDocuments(),
    Workspace.countDocuments({ status: "active" }),
    Event.countDocuments(),
    EventRegistration.countDocuments(),
    Club.countDocuments(),
    Suggestion.countDocuments({ status: "pending" }),
    CommunityRequest.countDocuments({ status: "open" }),
  ]);

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
