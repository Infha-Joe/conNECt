/* =========================================================================
 * 🔒 ACADEMICS MODULE — FROZEN 🔒
 * Verified and frozen on 2026-10-09. All tests passed.
 * Do NOT modify this controller without an explicit Academic change request.
 * ========================================================================= */
import asyncHandler from "express-async-handler";
import AcademicClass from "../models/AcademicClass.js";
import ClassMembership from "../models/ClassMembership.js";
import AcademicRecord from "../models/AcademicRecord.js";
import User from "../models/User.js";
import crypto from "crypto";
import { emitToUser } from "../services/socket.service.js";
import Notification from "../models/Notification.js";

function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// @desc    Get all classes for logged in user (teacher or student)
// @route   GET /api/classrooms
// @access  Private
export const getMyClasses = asyncHandler(async (req, res) => {
  if (req.user.role === "teacher") {
    const classes = await AcademicClass.find({ teacher: req.user._id }).sort("-createdAt");
    res.json({ success: true, classes });
  } else {
    // Student
    const memberships = await ClassMembership.find({ user: req.user._id, status: "active" }).populate("academicClass");
    const classes = memberships.map(m => m.academicClass).filter(Boolean);
    res.json({ success: true, classes });
  }
});

// @desc    Create a new class (Teacher only)
// @route   POST /api/classrooms
// @access  Private/Teacher
export const createClass = asyncHandler(async (req, res) => {
  const { name, subject, section, semester, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Class Name is required");
  }
  
  const newClass = await AcademicClass.create({
    name,
    subject,
    section,
    semester,
    description,
    teacher: req.user._id,
    inviteCode: generateInviteCode()
  });

  res.status(201).json({ success: true, class: newClass });
});

// @desc    Join a class via code
// @route   POST /api/classrooms/join
// @access  Private/Student
export const joinClass = asyncHandler(async (req, res) => {
  const { code } = req.body;
  if (!code) {
    res.status(400);
    throw new Error("Join code is required");
  }

  const academicClass = await AcademicClass.findOne({ inviteCode: code.toUpperCase() });
  if (!academicClass) {
    res.status(404);
    throw new Error("Invalid join code or class not found");
  }

  const existing = await ClassMembership.findOne({ academicClass: academicClass._id, user: req.user._id });
  if (existing) {
    if (existing.status === "active") {
      res.status(400);
      throw new Error("You are already a member of this class");
    } else {
      res.status(400);
      throw new Error("You already have a pending request for this class");
    }
  }

  // We make them pending so teacher can accept
  await ClassMembership.create({
    academicClass: academicClass._id,
    user: req.user._id,
    status: "pending"
  });
  
  // Notify teacher
  if (academicClass.teacher) {
    const notification = await Notification.create({
      user: academicClass.teacher,
      type: "class_join_request",
      title: "New Join Request",
      message: `${req.user.name} requested to join ${academicClass.name}`,
      relatedId: academicClass._id
    });
    emitToUser(academicClass.teacher.toString(), "notification:new", notification);
  }

  res.status(200).json({ success: true, message: "Request to join sent successfully" });
});

// @desc    Get class overview & verify access
// @route   GET /api/classrooms/:id
// @access  Private
export const getClassDetails = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id).populate("teacher", "name profilePhoto role");
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  // Verify access
  const teacherId = (academicClass.teacher?._id || academicClass.teacher)?.toString();
  const isTeacher = teacherId === req.user._id.toString();
  
  let isMember = false;
  if (!isTeacher) {
    const membership = await ClassMembership.findOne({ academicClass: academicClass._id, user: req.user._id, status: "active" });
    if (!membership) {
      res.status(403);
      throw new Error("Not authorized to view this class");
    }
    isMember = true;
  }

  res.json({ success: true, class: academicClass, isTeacher, isMember });
});

// @desc    Update class details
// @route   PUT /api/classrooms/:id
// @access  Private/Teacher
export const updateClass = asyncHandler(async (req, res) => {
  const { name, subject, section, semester, description } = req.body;
  
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  if (academicClass.teacher?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this class");
  }

  academicClass.name = name || academicClass.name;
  academicClass.subject = subject !== undefined ? subject : academicClass.subject;
  academicClass.section = section !== undefined ? section : academicClass.section;
  academicClass.semester = semester !== undefined ? semester : academicClass.semester;
  academicClass.description = description !== undefined ? description : academicClass.description;

  const updatedClass = await academicClass.save();
  res.json({ success: true, class: updatedClass });
});

// @desc    Delete a class
// @route   DELETE /api/classrooms/:id
// @access  Private/Teacher
export const deleteClass = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  if (academicClass.teacher?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this class");
  }

  // Delete associated memberships and records
  await ClassMembership.deleteMany({ academicClass: academicClass._id });
  await AcademicRecord.deleteMany({ academicClass: academicClass._id });
  
  await academicClass.deleteOne();
  res.json({ success: true, message: "Class deleted successfully" });
});

// @desc    Get members & requests
// @route   GET /api/classrooms/:id/members
// @access  Private
export const getClassMembers = asyncHandler(async (req, res) => {
  const memberships = await ClassMembership.find({ academicClass: req.params.id }).populate("user", "name profilePhoto department year role");
  const members = memberships.filter(m => m.status === "active").map(m => m.user);
  const requests = memberships.filter(m => m.status === "pending");

  res.json({ success: true, members, requests });
});

// @desc    Accept/Reject join request
// @route   PATCH /api/classrooms/:id/requests/:requestId
// @access  Private/Teacher
export const handleJoinRequest = asyncHandler(async (req, res) => {
  const { action } = req.body; // "accept" or "reject"
  
  const academicClass = await AcademicClass.findById(req.params.id);
  if (academicClass.teacher?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const membership = await ClassMembership.findById(req.params.requestId);
  if (!membership) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (action === "accept") {
    membership.status = "active";
    await membership.save();
    
    // Notify student
    const notification = await Notification.create({
      user: membership.user,
      type: "class_request_accepted",
      title: "Class Request Accepted",
      message: `Your request to join ${academicClass.name} was accepted.`,
      relatedId: academicClass._id
    });
    emitToUser(membership.user.toString(), "notification:new", notification);
    
  } else if (action === "reject") {
    await ClassMembership.findByIdAndDelete(req.params.requestId);
  }

  res.json({ success: true, message: `Request ${action}ed` });
});

// @desc    Get calendar records
// @route   GET /api/classrooms/:id/records
// @access  Private (teacher of class OR active member)
export const getAcademicRecords = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const isTeacher = (academicClass.teacher?._id || academicClass.teacher)?.toString() === req.user._id.toString();

  if (!isTeacher) {
    // Must be an active member
    const membership = await ClassMembership.findOne({ academicClass: req.params.id, user: req.user._id, status: "active" });
    if (!membership) {
      res.status(403);
      throw new Error("Not authorized to view records for this class");
    }
  }

  const { date } = req.query; // YYYY-MM-DD
  const filter = { academicClass: req.params.id };
  if (date) filter.date = date;

  const records = await AcademicRecord.find(filter)
    .populate("creator", "name profilePhoto role department")
    .sort("createdAt");
  res.json({ success: true, records });
});

// @desc    Add a daily record / note
// @route   POST /api/classrooms/:id/records
// @access  Private (Teacher or active class member)
export const addAcademicRecord = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const isTeacher = (academicClass.teacher?._id || academicClass.teacher)?.toString() === req.user._id.toString();
  let isMember = false;

  if (!isTeacher) {
    const membership = await ClassMembership.findOne({
      academicClass: req.params.id,
      user: req.user._id,
      status: "active"
    });
    if (!membership) {
      res.status(403);
      throw new Error("Not authorized to post notes in this class");
    }
    isMember = true;
  }

  const { date, topic, notes, files, links, announcement, assignment } = req.body;
  if (!date) {
    res.status(400);
    throw new Error("Date is required");
  }

  // Enforce that notes can only be posted for the current date (allowing standard timezone tolerance)
  const clientDate = new Date(date + "T12:00:00");
  const serverNow = new Date();
  const diffDays = Math.abs(clientDate.getTime() - serverNow.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 1.5) {
    res.status(400);
    throw new Error("Notes can only be posted for the current date");
  }

  const record = await AcademicRecord.create({
    academicClass: req.params.id,
    date,
    creator: req.user._id,
    topic: topic || "",
    notes: notes || "",
    files: files || [],
    links: links || [],
    announcement: isTeacher ? (announcement || "") : "",
    assignment: isTeacher ? assignment : undefined
  });

  const populated = await AcademicRecord.findById(record._id).populate("creator", "name profilePhoto role department");
  res.status(201).json({ success: true, record: populated });
});

// @desc    Update a daily record / note
// @route   PUT /api/classrooms/:id/records/:recordId
// @access  Private (Teacher or creator of record)
export const updateAcademicRecord = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const record = await AcademicRecord.findById(req.params.recordId);
  if (!record || record.academicClass.toString() !== req.params.id) {
    res.status(404);
    throw new Error("Record not found");
  }

  const isTeacher = (academicClass.teacher?._id || academicClass.teacher)?.toString() === req.user._id.toString();
  const isCreator = record.creator.toString() === req.user._id.toString();

  if (!isTeacher && !isCreator) {
    res.status(403);
    throw new Error("Not authorized to edit this record");
  }

  const { topic, notes, files, links, announcement, assignment } = req.body;

  record.topic = topic !== undefined ? topic : record.topic;
  record.notes = notes !== undefined ? notes : record.notes;
  record.files = files !== undefined ? files : record.files;
  record.links = links !== undefined ? links : record.links;
  if (isTeacher) {
    record.announcement = announcement !== undefined ? announcement : record.announcement;
    record.assignment = assignment !== undefined ? assignment : record.assignment;
  }

  const updatedRecord = await record.save();
  const populated = await AcademicRecord.findById(updatedRecord._id).populate("creator", "name profilePhoto role department");
  res.json({ success: true, record: populated });
});

// @desc    Delete a daily record / note
// @route   DELETE /api/classrooms/:id/records/:recordId
// @access  Private (Teacher or creator of record)
export const deleteAcademicRecord = asyncHandler(async (req, res) => {
  const academicClass = await AcademicClass.findById(req.params.id);
  if (!academicClass) {
    res.status(404);
    throw new Error("Class not found");
  }

  const record = await AcademicRecord.findById(req.params.recordId);
  if (!record || record.academicClass.toString() !== req.params.id) {
    res.status(404);
    throw new Error("Record not found");
  }

  const isTeacher = (academicClass.teacher?._id || academicClass.teacher)?.toString() === req.user._id.toString();
  const isCreator = record.creator.toString() === req.user._id.toString();

  if (!isTeacher && !isCreator) {
    res.status(403);
    throw new Error("Not authorized to delete this record");
  }

  await record.deleteOne();
  res.json({ success: true, message: "Record removed" });
});

// @desc    Invite student to class
// @route   POST /api/classrooms/:id/invite
// @access  Private/Teacher
export const inviteStudent = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const academicClass = await AcademicClass.findById(req.params.id);
  
  if (academicClass.teacher?.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const existing = await ClassMembership.findOne({ academicClass: academicClass._id, user: userId });
  if (existing) {
    res.status(400);
    throw new Error("User is already a member or has a pending request");
  }

  await ClassMembership.create({
    academicClass: academicClass._id,
    user: userId,
    status: "invited"
  });

  const notification = await Notification.create({
    user: userId,
    type: "class_invitation",
    title: "Class Invitation",
    message: `${req.user.name} invited you to join ${academicClass.name}. Use code ${academicClass.inviteCode} to join.`,
    relatedId: academicClass._id
  });
  emitToUser(userId.toString(), "notification:new", notification);

  res.json({ success: true, message: "Invitation sent successfully" });
});
