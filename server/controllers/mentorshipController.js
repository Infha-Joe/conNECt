import asyncHandler from "express-async-handler";
import MentorRequest from "../models/MentorRequest.js";
import Mentorship from "../models/Mentorship.js";
import MentorshipClass from "../models/MentorshipClass.js";
import MentorshipMessage from "../models/MentorshipMessage.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Workspace from "../models/Workspace.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

// @desc    Check if a mentorship is expired and update status
const checkAndExpireMentorship = async (mentorship) => {
  if (mentorship.status === "active" && new Date() >= new Date(mentorship.endDate)) {
    mentorship.status = "expired";
    await mentorship.save();
  }
  return mentorship;
};

// @desc    Verify if user is part of mentorship
const isUserInMentorship = (mentorship, userId) => {
  if (!mentorship || !userId) return false;
  const uid = userId.toString();
  const mentorId = (mentorship.mentor?._id || mentorship.mentor)?.toString();
  if (mentorId === uid) return true;
  
  const menteeId = (mentorship.mentee?._id || mentorship.mentee)?.toString();
  if (menteeId === uid) return true;
  
  if (mentorship.groupMembers && Array.isArray(mentorship.groupMembers)) {
    return mentorship.groupMembers.some(member => {
      const memberId = (member?._id || member)?.toString();
      return memberId === uid;
    });
  }
  return false;
};

// @desc    Get eligible mentorship providers (search)
// @route   GET /api/mentorship/providers
// @access  Private
export const getMentorshipProviders = asyncHandler(async (req, res) => {
  const { search = "" } = req.query;

  const filter = {
    role: { $in: ["teacher", "alumni"] }
  };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { skills: { $regex: search, $options: "i" } },
      { currentRole: { $regex: search, $options: "i" } },
      { designation: { $regex: search, $options: "i" } }
    ];
  }

  const providers = await User.find(filter)
    .select("name role profilePhoto skills designation currentRole department")
    .populate("department", "name code")
    .limit(50);

  res.json(providers);
});

// @desc    Create a new mentor request
// @route   POST /api/mentorship/request
// @access  Private (Students/Groups)
export const createMentorRequest = asyncHandler(async (req, res) => {
  const { mentorId, projectId, goals, message, requestedDuration } = req.body;

  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can request mentorship");
  }

  if (!projectId) {
    res.status(400);
    throw new Error("A project must be selected to request a mentor");
  }

  // Verify Project
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
    throw new Error("This project already has an active mentor");
  }

  // Verify Mentor
  const mentor = await User.findById(mentorId);
  if (!mentor || (mentor.role !== "teacher" && mentor.role !== "alumni")) {
    res.status(400);
    throw new Error("Selected user is not eligible to be a mentor");
  }

  // Prevent duplicate pending requests for this specific project and mentor
  const existingRequest = await MentorRequest.findOne({
    project: projectId,
    mentor: mentorId,
    status: "pending"
  });

  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending request with this mentor for this project");
  }

  const projectMembers = await ProjectMember.find({ project: projectId });
  const isGroup = projectMembers.length > 1;
  const groupMembers = isGroup ? projectMembers.filter(pm => pm.user.toString() !== req.user._id.toString()).map(pm => pm.user) : [];

  const mentorRequest = await MentorRequest.create({
    requester: req.user._id,
    mentor: mentorId,
    project: projectId,
    requestType: isGroup ? "group" : "individual",
    groupName: isGroup ? project.title : undefined,
    groupMembers: isGroup ? groupMembers : undefined,
    goals: goals || "Project guidance",
    message: message || "",
    requestedDuration: Number(requestedDuration) || 30,
    status: "pending"
  });

  const notification = await Notification.create({
    user: mentorId,
    type: "mentor_request",
    title: "New Mentor Request",
    message: `${req.user.name} requested you as a mentor for ${project.title}.`,
    relatedId: mentorRequest._id
  });
  emitToUser(mentorId.toString(), "notification:new", notification);

  res.status(201).json(mentorRequest);
});

// @desc    Get requests sent by user
// @route   GET /api/mentorship/requests/outgoing
// @access  Private (Students)
export const getOutgoingRequests = asyncHandler(async (req, res) => {
  const requests = await MentorRequest.find({ requester: req.user._id })
    .populate("mentor", "name profilePhoto department designation role currentRole")
    .populate("project", "title")
    .sort("-createdAt");
  res.json(requests);
});

// @desc    Get incoming requests
// @route   GET /api/mentorship/requests/incoming
// @access  Private (Mentors)
export const getIncomingRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "teacher" && req.user.role !== "alumni") {
    res.status(403);
    throw new Error("Only mentors can view incoming requests");
  }

  const requests = await MentorRequest.find({ mentor: req.user._id, status: "pending" })
    .populate("requester", "name profilePhoto department year role")
    .populate("project", "title description technologies")
    .sort("-createdAt");
  res.json(requests);
});

// @desc    Accept mentor request
// @route   PATCH /api/mentorship/requests/:id/accept
// @access  Private (Mentors)
export const acceptRequest = asyncHandler(async (req, res) => {
  const { durationDays } = req.body;
  const request = await MentorRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to accept this request");
  }

  if (request.status === "accepted") {
    // If already accepted, return existing active mentorship
    const existing = await Mentorship.findOne({ request: request._id });
    if (existing) return res.json(existing);
  }

  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Request is not pending");
  }

  const days = Number(durationDays) || request.requestedDuration || 30;
  if (days <= 0) {
    res.status(400);
    throw new Error("Valid duration is required");
  }

  request.status = "accepted";
  await request.save();

  // Update Project status and mentor
  if (request.project) {
    const project = await Project.findById(request.project);
    if (project) {
      project.mentor = req.user._id;
      project.status = "in_progress";
      if (!project.startDate) project.startDate = new Date();
      await project.save();
    }
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + days);

  // Check if Mentorship already exists to prevent duplicate on retry
  let mentorship = await Mentorship.findOne({ request: request._id });
  if (!mentorship) {
    mentorship = await Mentorship.create({
      mentor: req.user._id,
      mentee: request.requester,
      project: request.project,
      requestType: request.requestType,
      groupName: request.groupName,
      groupMembers: request.groupMembers,
      request: request._id,
      status: "active",
      startDate,
      endDate,
      durationDays: days
    });
  }

  // Also create/sync Workspace
  if (request.project) {
    let workspace = await Workspace.findOne({ project: request.project });
    if (!workspace) {
      workspace = await Workspace.create({
        project: request.project,
        mentor: req.user._id,
        startDate,
        endDate,
        status: "active"
      });
    } else {
      workspace.mentor = req.user._id;
      workspace.startDate = startDate;
      workspace.endDate = endDate;
      workspace.status = "active";
      await workspace.save();
    }
  }

  const notification = await Notification.create({
    user: request.requester,
    type: "mentor_response",
    title: "Mentor Request Accepted",
    message: `${req.user.name} accepted your mentor request.`,
    relatedId: mentorship._id
  });
  emitToUser(request.requester.toString(), "notification:new", notification);

  res.json(mentorship);
});

// @desc    Reject mentor request
// @route   PATCH /api/mentorship/requests/:id/reject
// @access  Private (Mentors)
export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await MentorRequest.findById(req.params.id);

  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }

  if (request.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  request.status = "rejected";
  await request.save();

  const notification = await Notification.create({
    user: request.requester,
    type: "mentor_response",
    title: "Mentor Request Rejected",
    message: `${req.user.name} declined your mentor request.`,
    relatedId: request._id
  });
  emitToUser(request.requester.toString(), "notification:new", notification);

  res.json({ message: "Request rejected" });
});

// @desc    Get active mentorships
// @route   GET /api/mentorship/active
// @access  Private
export const getActiveMentorships = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { mentor: req.user._id },
      { mentee: req.user._id },
      { groupMembers: req.user._id }
    ]
  };

  let mentorships = await Mentorship.find(query)
    .populate("mentor", "name profilePhoto designation currentRole role department")
    .populate("mentee", "name profilePhoto year role department")
    .populate("groupMembers", "name profilePhoto role")
    .populate("project", "title status description technologies")
    .sort("-createdAt");

  // Verify expiration
  const verifiedMentorships = await Promise.all(
    mentorships.map(m => checkAndExpireMentorship(m))
  );

  res.json(verifiedMentorships);
});

// @desc    Get mentorship details
// @route   GET /api/mentorship/:id
// @access  Private
export const getMentorshipDetails = asyncHandler(async (req, res) => {
  let mentorship = await Mentorship.findById(req.params.id)
    .populate("mentor", "name profilePhoto role designation currentRole department")
    .populate("mentee", "name profilePhoto role department year")
    .populate("groupMembers", "name profilePhoto role")
    .populate("project", "title description githubLink projectLink status technologies")
    .populate("request", "requester");

  if (!mentorship) {
    res.status(404);
    throw new Error("Mentorship not found");
  }

  if (!isUserInMentorship(mentorship, req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to access this mentorship");
  }

  mentorship = await checkAndExpireMentorship(mentorship);

  res.json(mentorship);
});

// @desc    Create a mentorship class
// @route   POST /api/mentorship/:id/classes
// @access  Private (Mentors)
export const createClass = asyncHandler(async (req, res) => {
  const { title, description, scheduledAt, durationMinutes, meetingLink } = req.body;
  const mentorship = await Mentorship.findById(req.params.id);

  if (!mentorship) {
    res.status(404);
    throw new Error("Mentorship not found");
  }

  if (mentorship.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the mentor can create classes");
  }

  const verifiedMentorship = await checkAndExpireMentorship(mentorship);
  if (verifiedMentorship.status !== "active") {
    res.status(400);
    throw new Error("Cannot create class for an inactive or expired mentorship");
  }

  const classData = {
    mentorship: mentorship._id,
    mentor: req.user._id,
    title,
    description,
    scheduledAt,
    durationMinutes
  };
  
  if (meetingLink && meetingLink.trim() !== "") {
    classData.meetingLink = meetingLink;
  }

  const mentorshipClass = await MentorshipClass.create(classData);

  res.status(201).json(mentorshipClass);
});

// @desc    Get mentorship classes
// @route   GET /api/mentorship/:id/classes
// @access  Private
export const getClasses = asyncHandler(async (req, res) => {
  const mentorship = await Mentorship.findById(req.params.id);

  if (!mentorship) {
    res.status(404);
    throw new Error("Mentorship not found");
  }

  if (!isUserInMentorship(mentorship, req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to view these classes");
  }

  const classes = await MentorshipClass.find({ mentorship: req.params.id }).sort("scheduledAt");
  res.json(classes);
});

// @desc    Get mentorship chat history
// @route   GET /api/mentorship/:id/chat
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
  const mentorship = await Mentorship.findById(req.params.id);

  if (!mentorship) {
    res.status(404);
    throw new Error("Mentorship not found");
  }

  if (!isUserInMentorship(mentorship, req.user._id)) {
    res.status(403);
    throw new Error("Not authorized to view chat");
  }

  const messages = await MentorshipMessage.find({ mentorship: req.params.id })
    .populate("sender", "name profilePhoto role")
    .sort("createdAt");

  res.json(messages);
});

// @desc    Close a mentorship workspace
// @route   PATCH /api/mentorship/:id/close
// @access  Private (Mentors only)
export const closeMentorship = asyncHandler(async (req, res) => {
  const mentorship = await Mentorship.findById(req.params.id);

  if (!mentorship) {
    res.status(404);
    throw new Error("Mentorship not found");
  }

  if (mentorship.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the mentor can close this workspace");
  }

  mentorship.status = "completed";
  await mentorship.save();

  res.json(mentorship);
});

// @desc    Get all classes for current user
// @route   GET /api/mentorship/user/classes
// @access  Private
export const getMyClasses = asyncHandler(async (req, res) => {
  const query = {
    $or: [
      { mentor: req.user._id },
      { mentee: req.user._id },
      { groupMembers: req.user._id }
    ]
  };
  const mentorships = await Mentorship.find(query).select('_id');
  const mentorshipIds = mentorships.map(m => m._id);

  const classes = await MentorshipClass.find({ mentorship: { $in: mentorshipIds } })
    .populate("mentor", "name profilePhoto")
    .populate("mentorship", "title")
    .sort("scheduledAt");

  res.json(classes);
});
