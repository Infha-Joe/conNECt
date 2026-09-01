import asyncHandler from "express-async-handler";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Workspace from "../models/Workspace.js";
import { awardBadge } from "../utils/badgeAwards.js";

const populateUser = "name role profilePhoto department";

export const createProject = asyncHandler(async (req, res) => {
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can create projects");
  }
  const { title, description, technologies, githubLink, projectLink, startDate, expectedEndDate } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("Project title is required");
  }
  const project = await Project.create({
    title, description, leader: req.user._id, technologies: technologies || [],
    githubLink, projectLink, startDate, expectedEndDate,
  });
  await ProjectMember.create({ project: project._id, user: req.user._id, roleInProject: "Leader" });
  await project.populate("leader", populateUser);
  res.status(201).json({ success: true, project });
});

export const getProjects = asyncHandler(async (req, res) => {
  const { mine, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (mine === "true") {
    const memberships = await ProjectMember.find({ user: req.user._id }).select("project");
    const projectIds = memberships.map((m) => m.project);
    filter.$or = [{ _id: { $in: projectIds } }, { mentor: req.user._id }];
  }
  const projects = await Project.find(filter).sort({ createdAt: -1 }).populate("leader", populateUser).populate("mentor", populateUser);
  res.status(200).json({ success: true, count: projects.length, projects });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate("leader", populateUser).populate("mentor", populateUser);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  const members = await ProjectMember.find({ project: project._id }).populate("user", populateUser);
  const workspace = await Workspace.findOne({ project: project._id });
  res.status(200).json({
    success: true, project,
    members: members.map((m) => ({ ...m.user.toObject(), roleInProject: m.roleInProject })),
    workspaceId: workspace?._id || null,
  });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  const isLeader = project.leader.toString() === req.user._id.toString();
  const isMentor = project.mentor?.toString() === req.user._id.toString();
  if (!isLeader && !isMentor && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the project leader, mentor, or an admin can update this project");
  }
  const editable = ["title", "description", "technologies", "githubLink", "projectLink", "reportUrl", "progress", "status", "expectedEndDate", "actualEndDate"];
  editable.forEach((field) => {
    if (req.body[field] !== undefined) project[field] = req.body[field];
  });
  if (req.body.status === "completed" && !project.actualEndDate) {
    project.actualEndDate = new Date();
    await awardBadge(project.leader, "Project Leader");
  }
  await project.save();
  await project.populate("leader", populateUser);
  await project.populate("mentor", populateUser);
  res.status(200).json({ success: true, project });
});

export const addProjectMember = asyncHandler(async (req, res) => {
  const { userId, roleInProject } = req.body;
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (project.leader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the project leader can add members");
  }
  try {
    await ProjectMember.create({ project: project._id, user: userId, roleInProject: roleInProject || "Member" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      throw new Error("This user is already a project member");
    }
    throw err;
  }
  res.status(200).json({ success: true, message: "Member added" });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  if (project.leader.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the project leader can remove members");
  }
  if (req.params.userId === project.leader.toString()) {
    res.status(400);
    throw new Error("The project leader cannot be removed");
  }
  await ProjectMember.findOneAndDelete({ project: project._id, user: req.params.userId });
  res.status(200).json({ success: true, message: "Member removed" });
});
