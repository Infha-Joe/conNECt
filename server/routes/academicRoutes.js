import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import AcademicClass from "../models/AcademicClass.js";
import Subject from "../models/Subject.js";
import Timetable from "../models/Timetable.js";
import ClassSession from "../models/ClassSession.js";

const router = express.Router();

router.use(protect, restrictTo("student", "teacher", "admin"));

// GET all classes
router.get("/classes", protect, async (req, res) => {
  const classes = await AcademicClass.find().populate("department");
  res.json({ success: true, classes });
});

// Create class (Admin only)
router.post("/classes", protect, restrictTo("admin"), async (req, res) => {
  const { department, name, section } = req.body;
  const newClass = await AcademicClass.create({ department, name, section });
  res.status(201).json({ success: true, class: newClass });
});

// Subject endpoints
router.get("/classes/:id/subjects", protect, async (req, res) => {
  const subjects = await Subject.find({ academicClass: req.params.id }).populate("faculty", "name email profilePhoto");
  res.json({ success: true, subjects });
});
router.post("/classes/:id/subjects", protect, restrictTo("admin"), async (req, res) => {
  const { name, code, faculty } = req.body;
  const subject = await Subject.create({ academicClass: req.params.id, name, code, faculty });
  res.status(201).json({ success: true, subject });
});

// Timetable endpoints
router.get("/classes/:id/timetable", protect, async (req, res) => {
  const timetable = await Timetable.find({ academicClass: req.params.id }).populate("subject");
  res.json({ success: true, timetable });
});
router.post("/classes/:id/timetable", protect, restrictTo("admin", "teacher"), async (req, res) => {
  const { dayOfWeek, startTime, endTime, subject } = req.body;
  const entry = await Timetable.create({ academicClass: req.params.id, dayOfWeek, startTime, endTime, subject });
  res.status(201).json({ success: true, entry });
});

// Sessions and Materials
router.get("/sessions", protect, async (req, res) => {
  const filters = {};
  if (req.query.academicClass) filters.academicClass = req.query.academicClass;
  if (req.query.subject) filters.subject = req.query.subject;
  
  const sessions = await ClassSession.find(filters)
    .populate("subject")
    .populate("faculty", "name profilePhoto")
    .populate("academicClass")
    .sort("-sessionDate");
  res.json({ success: true, sessions });
});

router.post("/sessions", protect, restrictTo("teacher", "admin"), async (req, res) => {
  const session = await ClassSession.create({ ...req.body, faculty: req.user._id });
  res.status(201).json({ success: true, session });
});

router.post("/sessions/:id/materials", protect, async (req, res) => {
  const { title, url } = req.body;
  const session = await ClassSession.findById(req.params.id);
  session.materials.push({
    title, url, uploadedBy: req.user._id, isOfficial: req.user.role === "teacher"
  });
  await session.save();
  res.json({ success: true, session });
});

export default router;
