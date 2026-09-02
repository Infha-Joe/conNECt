import asyncHandler from "express-async-handler";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import Workspace from "../models/Workspace.js";
import ProjectMember from "../models/ProjectMember.js";
import Notification from "../models/Notification.js";
import { isWorkspaceMember } from "../utils/workspaceAccess.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto";

export const createAssignment = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.workspaceId);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  if (workspace.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the mentor can create assignments");
  }
  const { title, description, deadline, attachments } = req.body;
  if (!title || !deadline) {
    res.status(400);
    throw new Error("Assignment title and deadline are required");
  }
  const assignment = await Assignment.create({ workspace: workspace._id, title, description, deadline, attachments: attachments || [] });

  const members = await ProjectMember.find({ project: workspace.project });
  for (const m of members) {
    const notification = await Notification.create({
      user: m.user, type: "assignment", title: "New assignment",
      message: `New assignment "${title}" posted in your workspace`, relatedId: assignment._id,
    });
    emitToUser(m.user.toString(), "notification:new", notification);
  }

  res.status(201).json({ success: true, assignment });
});

export const getAssignments = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.workspaceId);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  const allowed = await isWorkspaceMember(workspace, req.user._id);
  if (!allowed && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not a member of this workspace");
  }
  const assignments = await Assignment.find({ workspace: workspace._id }).sort({ deadline: 1 });
  const withStatus = await Promise.all(
    assignments.map(async (a) => {
      const mySubmission = await Submission.findOne({ assignment: a._id, student: req.user._id });
      return { ...a.toObject(), mySubmission: mySubmission || null };
    })
  );
  res.status(200).json({ success: true, assignments: withStatus });
});

export const submitAssignment = asyncHandler(async (req, res) => {
  const { fileUrl, comment } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }
  const workspace = await Workspace.findById(assignment.workspace);
  const allowed = await isWorkspaceMember(workspace, req.user._id);
  if (!allowed) {
    res.status(403);
    throw new Error("You are not a member of this workspace");
  }
  if (workspace.mentor.toString() === req.user._id.toString()) {
    res.status(403);
    throw new Error("Mentors cannot submit assignments");
  }

  const submission = await Submission.findOneAndUpdate(
    { assignment: assignment._id, student: req.user._id },
    { fileUrl, comment, status: "submitted", submittedAt: new Date(), feedback: "" },
    { new: true, upsert: true, runValidators: true }
  );

  const notification = await Notification.create({
    user: workspace.mentor, type: "assignment", title: "New submission",
    message: `${req.user.name} submitted "${assignment.title}"`, relatedId: submission._id,
  });
  emitToUser(workspace.mentor.toString(), "notification:new", notification);

  res.status(200).json({ success: true, submission });
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }
  const workspace = await Workspace.findById(assignment.workspace);
  if (workspace.mentor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the mentor can view all submissions");
  }
  const submissions = await Submission.find({ assignment: assignment._id }).populate("student", populateUser);
  res.status(200).json({ success: true, count: submissions.length, submissions });
});

export const giveFeedback = asyncHandler(async (req, res) => {
  const { feedback, requestResubmission } = req.body;
  const submission = await Submission.findById(req.params.id).populate("assignment");
  if (!submission) {
    res.status(404);
    throw new Error("Submission not found");
  }
  const workspace = await Workspace.findById(submission.assignment.workspace);
  if (workspace.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the mentor can give feedback");
  }
  submission.feedback = feedback || "";
  submission.status = requestResubmission ? "resubmission_requested" : "reviewed";
  await submission.save();

  const notification = await Notification.create({
    user: submission.student, type: "assignment", title: "Feedback received",
    message: `Your mentor left feedback on "${submission.assignment.title}"`, relatedId: submission._id,
  });
  emitToUser(submission.student.toString(), "notification:new", notification);

  res.status(200).json({ success: true, submission });
});
