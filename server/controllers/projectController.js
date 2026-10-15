import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Roadmap from "../models/Roadmap.js";
import Mentorship from "../models/Mentorship.js";
import MentorRequest from "../models/MentorRequest.js";

const populateUser = "name role profilePhoto department";

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can create projects");
  }
  const { title, description, technologies, githubLink, projectLink, startDate, expectedEndDate, members } = req.body;
  if (!title || !title.trim()) {
    res.status(400);
    throw new Error("Project title is required");
  }

  const techArray = Array.isArray(technologies)
    ? technologies.map(t => String(t).trim()).filter(Boolean)
    : typeof technologies === "string"
    ? technologies.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const project = await Project.create({
    title: title.trim(),
    description: description ? description.trim() : "",
    leader: req.user._id,
    technologies: techArray,
    githubLink: githubLink ? githubLink.trim() : "",
    projectLink: projectLink ? projectLink.trim() : "",
    startDate,
    expectedEndDate,
  });
  
  // Add leader as member
  await ProjectMember.create({ project: project._id, user: req.user._id, roleInProject: "Leader" });
  
  // Add tagged students
  if (members && Array.isArray(members) && members.length > 0) {
    const memberDocs = members
      .filter(id => id && id.toString() !== req.user._id.toString())
      .map(userId => ({
        project: project._id,
        user: userId,
        roleInProject: "Member"
      }));
    if (memberDocs.length > 0) {
      await ProjectMember.insertMany(memberDocs);
    }
  }

  await project.populate("leader", populateUser);
  res.status(201).json({ success: true, project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const { mine, status } = req.query;
  const filter = {};
  
  if (status) filter.status = status;
  if (mine === "true") {
    const memberships = await ProjectMember.find({ user: req.user._id });
    const memberProjectIds = memberships.map((m) => m.project);
    filter.$or = [
      { _id: { $in: memberProjectIds } },
      { leader: req.user._id },
      { mentor: req.user._id }
    ];
  }

  const projects = await Project.find(filter)
    .populate("leader", populateUser)
    .populate("mentor", populateUser)
    .sort("-createdAt");

  res.json({ success: true, projects });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("leader", populateUser)
    .populate("mentor", populateUser);
  if (!project) { res.status(404); throw new Error("Project not found"); }

  const members = await ProjectMember.find({ project: project._id }).populate("user", populateUser);
  const isMember = members.some((m) => m.user && m.user._id.toString() === req.user._id.toString());
  const roadmap = await Roadmap.findOne({ entityType: "Project", entityId: project._id });
  
  const mentorship = await Mentorship.findOne({ project: project._id, status: "active" });
  const pendingRequest = await MentorRequest.findOne({ project: project._id, status: "pending" });

  res.json({
    success: true,
    project,
    members,
    isMember,
    roadmapId: roadmap?._id || null,
    workspaceId: mentorship?._id || null,
    hasPendingMentorRequest: !!pendingRequest
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.leader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the project leader can edit this project");
  }

  const { title, description, technologies, githubLink, projectLink, status } = req.body;
  if (title) project.title = title.trim();
  if (description !== undefined) project.description = description.trim();
  if (technologies !== undefined) {
    project.technologies = Array.isArray(technologies)
      ? technologies.map(t => String(t).trim()).filter(Boolean)
      : typeof technologies === "string"
      ? technologies.split(",").map(t => t.trim()).filter(Boolean)
      : [];
  }
  if (githubLink !== undefined) project.githubLink = githubLink.trim();
  if (projectLink !== undefined) project.projectLink = projectLink.trim();
  if (status && ["pending", "in_progress", "completed"].includes(status)) {
    project.status = status;
  }

  await project.save();
  await project.populate("leader", populateUser);
  await project.populate("mentor", populateUser);

  res.json({ success: true, project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.leader.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the project leader can delete this project");
  }

  // Delete project members
  await ProjectMember.deleteMany({ project: project._id });
  // Cancel pending requests
  await MentorRequest.deleteMany({ project: project._id, status: "pending" });
  // Remove project
  await project.deleteOne();

  res.json({ success: true, message: "Project deleted successfully" });
});

export const requestToJoinProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") { res.status(403); throw new Error("Only students can join projects"); }
  const { message } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }

  const existingMember = await ProjectMember.findOne({ project: project._id, user: req.user._id });
  if (existingMember) { res.status(400); throw new Error("You have already requested or are a member"); }

  const member = await ProjectMember.create({
    project: project._id, user: req.user._id, status: "pending", requestedMessage: message, roleInProject: "Member"
  });

  res.status(201).json({ success: true, message: "Request sent successfully" });
});

export const updateMemberStatus = asyncHandler(async (req, res) => {
  const { status, roleInProject } = req.body;
  const project = await Project.findById(req.params.projectId);
  if (!project || project.leader.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error("Not authorized");
  }

  const member = await ProjectMember.findOne({ project: project._id, user: req.params.userId });
  if (!member) { res.status(404); throw new Error("Member request not found"); }

  if (status) member.status = status;
  if (roleInProject) member.roleInProject = roleInProject;
  await member.save();

  res.json({ success: true, message: "Member status updated" });
});
