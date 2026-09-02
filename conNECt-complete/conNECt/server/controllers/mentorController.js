import asyncHandler from "express-async-handler";
import MentorRequest from "../models/MentorRequest.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Workspace from "../models/Workspace.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto department";

export const sendMentorRequest = asyncHandler(async (req, res) => {
  const { projectId, mentorId, message, requestedDuration } = req.body;
  if (!projectId || !mentorId || !message) {
    res.status(400);
    throw new Error("Project, mentor, and a message describing the request are required");
  }
  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (project.leader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the project leader can request a mentor");
  }
  if (project.mentor) {
    res.status(400);
    throw new Error("This project already has a mentor");
  }
  const mentor = await User.findById(mentorId);
  if (!mentor || !["teacher", "alumni"].includes(mentor.role)) {
    res.status(400);
    throw new Error("Selected mentor must be a teacher or alumni");
  }
  const existingPending = await MentorRequest.findOne({ project: projectId, mentor: mentorId, status: "pending" });
  if (existingPending) {
    res.status(400);
    throw new Error("A pending request to this mentor already exists for this project");
  }

  const request = await MentorRequest.create({ project: projectId, student: req.user._id, mentor: mentorId, message, requestedDuration });
  await request.populate("project", "title description technologies");
  await request.populate("student", populateUser);
  await request.populate("mentor", populateUser);

  const notification = await Notification.create({
    user: mentorId, type: "mentor_request", title: "New mentor request",
    message: `${req.user.name} requested you to mentor "${project.title}"`, relatedId: request._id,
  });
  emitToUser(mentorId, "notification:new", notification);

  res.status(201).json({ success: true, request });
});

export const getMentorRequests = asyncHandler(async (req, res) => {
  const { type = "received", status } = req.query;
  const filter = type === "sent" ? { student: req.user._id } : { mentor: req.user._id };
  if (status) filter.status = status;

  const requests = await MentorRequest.find(filter)
    .sort({ createdAt: -1 })
    .populate("project", "title description technologies status")
    .populate("student", populateUser)
    .populate("mentor", populateUser);

  res.status(200).json({ success: true, count: requests.length, requests });
});

export const respondToMentorRequest = asyncHandler(async (req, res) => {
  const { action, durationWeeks, meetingLink } = req.body;
  if (!["accept", "reject"].includes(action)) {
    res.status(400);
    throw new Error("Action must be 'accept' or 'reject'");
  }
  const request = await MentorRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Mentor request not found");
  }
  if (request.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the requested mentor can respond to this request");
  }
  if (request.status !== "pending") {
    res.status(400);
    throw new Error("This request has already been responded to");
  }

  request.status = action === "accept" ? "accepted" : "rejected";
  request.respondedAt = new Date();
  await request.save();

  let workspace = null;

  if (action === "accept") {
    const project = await Project.findById(request.project);
    project.mentor = req.user._id;
    project.status = "in_progress";
    if (!project.startDate) project.startDate = new Date();
    await project.save();

    const weeks = parseInt(durationWeeks) || 8;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + weeks * 7);

    workspace = await Workspace.create({ project: project._id, mentor: req.user._id, startDate, endDate, meetingLink: meetingLink || "" });

    const members = await ProjectMember.find({ project: project._id });
    const notifyIds = new Set(members.map((m) => m.user.toString()));
    notifyIds.add(request.student.toString());

    for (const userId of notifyIds) {
      const notification = await Notification.create({
        user: userId, type: "mentor_response", title: "Mentor request accepted",
        message: `${req.user.name} accepted the mentor request for "${project.title}" — workspace created`,
        relatedId: workspace._id,
      });
      emitToUser(userId, "notification:new", notification);
    }
  } else {
    const notification = await Notification.create({
      user: request.student, type: "mentor_response", title: "Mentor request declined",
      message: `${req.user.name} declined your mentor request`, relatedId: request._id,
    });
    emitToUser(request.student.toString(), "notification:new", notification);
  }

  res.status(200).json({ success: true, request, workspace });
});
