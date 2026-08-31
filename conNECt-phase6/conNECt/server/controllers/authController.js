import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Department from "../models/Department.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, collegeId, department, year, phone } = req.body;

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

  if (department) {
    const deptExists = await Department.findById(department);
    if (!deptExists) {
      res.status(400);
      throw new Error("Selected department does not exist");
    }
  }

  const user = await User.create({ name, email, password, role, collegeId, department, year, phone });
  const token = generateToken(user._id);

  res.status(201).json({ success: true, token, user });
});

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
  res.status(200).json({ success: true, token, user });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
