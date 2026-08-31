import asyncHandler from "express-async-handler";
import MentorRequest from "../models/MentorRequest.js";
import Mentorship from "../models/Mentorship.js";
import MentorshipClass from "../models/MentorshipClass.js";
import MentorshipMessage from "../models/MentorshipMessage.js";
import User from "../models/User.js";

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
  const mentorId = mentorship.mentor._id || mentorship.mentor;
  if (mentorId.toString() === userId.toString()) return true;
  
  if (mentorship.requestType === "individual") {
    const menteeId = mentorship.mentee?._id || mentorship.mentee;
    if (menteeId?.toString() === userId.toString()) return true;
  }
  
  if (mentorship.requestType === "group" && mentorship.groupMembers) {
    return mentorship.groupMembers.some(member => {
      const memberId = member._id || member;
      return memberId.toString() === userId.toString();
    });
  }
  return false;
};

// @desc    Get eligible mentorship providers (search)
// @route   GET /api/mentorship/providers
// @access  Private (Students)
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
    .select("name role profilePhoto skills designation currentRole")
    .limit(20);

  res.json(providers);
});

// @desc    Create a new mentor request
// @route   POST /api/mentorship/request
// @access  Private (Students/Groups)
export const createMentorRequest = asyncHandler(async (req, res) => {
  const { mentorId, requestType, groupName, groupMembers, goals, message, requestedDuration } = req.body;

  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can request mentorship");
  }

  // 1. Verify Mentor Eligibility
  const mentor = await User.findById(mentorId);
  if (!mentor || (mentor.role !== "teacher" && mentor.role !== "alumni")) {
    res.status(400);
    throw new Error("Selected user is not eligible to be a mentor/teacher");
  }

  // 2. Validate Group Request
  let finalGroupMembers = [];
  if (requestType === "group") {
    if (!groupMembers || !Array.isArray(groupMembers)) {
      res.status(400);
      throw new Error("Group members are required for a group request");
    }

    // Ensure the leader is always in the group
    const memberSet = new Set(groupMembers);
    memberSet.add(req.user._id.toString());
    finalGroupMembers = Array.from(memberSet);

    // Verify all members exist and are students
    const membersInDb = await User.find({ _id: { $in: finalGroupMembers } });
    if (membersInDb.length !== finalGroupMembers.length) {
      res.status(400);
      throw new Error("One or more selected students do not exist");
    }
    const nonStudents = membersInDb.filter(u => u.role !== "student");
    if (nonStudents.length > 0) {
      res.status(400);
      throw new Error("Only students can be part of a group mentorship request");
    }
  }

  // 3. Prevent duplicate pending requests
  const existingRequest = await MentorRequest.findOne({
    requester: req.user._id,
    mentor: mentorId,
    status: "pending"
  });

  if (existingRequest) {
    res.status(400);
    throw new Error("You already have a pending request with this mentor");
  }

  // Check for active mentorship
  const activeMentorship = await Mentorship.findOne({
    status: "active",
    mentor: mentorId,
    $or: [
      { mentee: req.user._id },
      { groupMembers: req.user._id }
    ]
  });

  if (activeMentorship) {
    // Make sure it's actually active by checking date
    const verifiedMentorship = await checkAndExpireMentorship(activeMentorship);
    if (verifiedMentorship.status === "active") {
      res.status(400);
      throw new Error("You already have an active mentorship with this mentor");
    }
  }

  const mentorRequest = await MentorRequest.create({
    requester: req.user._id,
    mentor: mentorId,
    requestType: requestType || "individual",
    groupName: requestType === "group" ? groupName : undefined,
    groupMembers: requestType === "group" ? finalGroupMembers : [],
    goals,
    message,
    requestedDuration,
    status: "pending"
  });

  res.status(201).json(mentorRequest);
});

// @desc    Get requests sent by user
// @route   GET /api/mentorship/requests/outgoing
// @access  Private (Students)
export const getOutgoingRequests = asyncHandler(async (req, res) => {
  const requests = await MentorRequest.find({ requester: req.user._id })
    .populate("mentor", "name profilePhoto department designation")
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
    .populate("requester", "name profilePhoto department year")
    .populate("groupMembers", "name")
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

  if (request.status !== "pending") {
    res.status(400);
    throw new Error("Request is not pending");
  }

  if (!durationDays || durationDays <= 0) {
    res.status(400);
    throw new Error("Valid duration is required");
  }

  request.status = "accepted";
  await request.save();

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Number(durationDays));

  const mentorship = await Mentorship.create({
    mentor: req.user._id,
    mentee: request.requestType === "individual" ? request.requester : undefined,
    requestType: request.requestType,
    groupName: request.groupName,
    groupMembers: request.groupMembers,
    request: request._id,
    status: "active",
    startDate,
    endDate,
    durationDays
  });

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
    .populate("mentor", "name profilePhoto designation currentRole")
    .populate("mentee", "name profilePhoto year")
    .populate("groupMembers", "name profilePhoto")
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
    .populate("mentor", "name profilePhoto role designation currentRole")
    .populate("mentee", "name profilePhoto role")
    .populate("groupMembers", "name profilePhoto role")
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
