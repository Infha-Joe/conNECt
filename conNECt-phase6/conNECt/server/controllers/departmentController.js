import asyncHandler from "express-async-handler";
import Department from "../models/Department.js";

export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.status(200).json({ success: true, departments });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, themeColor } = req.body;
  if (!name || !code) {
    res.status(400);
    throw new Error("Department name and code are required");
  }
  const department = await Department.create({ name, code, themeColor });
  res.status(201).json({ success: true, department });
});
