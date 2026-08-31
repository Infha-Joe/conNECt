import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Department from "../models/Department.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { 
    name, email, password, role, 
    collegeId, department, year, // Student / Teacher
    designation, // Teacher
    batch, degree, currentCompany, currentRole, location // Alumni
  } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("Name, email, password and role are required");
  }

  const allowedRoles = ["student", "teacher", "alumni", "admin"];
  if (!allowedRoles.includes(role)) {
    res.status(400);
    throw new Error("Invalid role specified");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Role-specific validation
  if (role === "student") {
    if (!collegeId) {
      res.status(400);
      throw new Error("College ID is required for students");
    }
    if (!year || ![1, 2, 3, 4].includes(Number(year))) {
      res.status(400);
      throw new Error("Student year must be 1, 2, 3, or 4");
    }
  }

  if (role === "alumni") {
    if (!batch) {
      res.status(400);
      throw new Error("Batch is required for alumni");
    }
  }

  // Allow department check for all roles (Students, Teachers, and Alumni (Completed Dept))
  if (department) {
    const deptExists = await Department.findById(department);
    if (!deptExists) {
      res.status(400);
      throw new Error("Selected department does not exist");
    }
  }

  // Build payload based on role
  const payload = { name, email, password, role };

  if (role === "student") {
    payload.collegeId = collegeId;
    payload.department = department || undefined;
    payload.year = Number(year);
  } else if (role === "teacher") {
    payload.designation = designation || undefined;
    payload.department = department || undefined;
  } else if (role === "alumni") {
    payload.batch = batch || undefined;
    payload.department = department || undefined;
    payload.degree = degree || undefined;
    payload.currentCompany = currentCompany || undefined;
    payload.currentRole = currentRole || undefined;
    payload.location = location || undefined;
  }

  const user = await User.create(payload);

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password").populate("department", "name code themeColor");

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

// @desc    Logout user (stateless JWT — client discards token; endpoint kept for symmetry / future blacklist)
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// @desc    Get currently logged-in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});
