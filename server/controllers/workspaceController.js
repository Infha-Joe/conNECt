import asyncHandler from "express-async-handler";
import Workspace from "../models/Workspace.js";
import { isWorkspaceMember } from "../utils/workspaceAccess.js";
import { getOrCreateWorkspaceRoom } from "../services/daily.service.js";

const populateUser = "name role profilePhoto department";

export const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id)
    .populate("mentor", populateUser)
    .populate("project", "title description technologies status progress");

  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }

  const allowed = await isWorkspaceMember(workspace, req.user._id);
  if (!allowed && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not a member of this workspace");
  }

  res.status(200).json({ success: true, workspace });
});

export const extendWorkspace = asyncHandler(async (req, res) => {
  const { newEndDate } = req.body;
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  if (workspace.mentor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the mentor can extend the workspace duration");
  }
  workspace.endDate = newEndDate;
  await workspace.save();
  res.status(200).json({ success: true, workspace });
});

export const startMeeting = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  const allowed = await isWorkspaceMember(workspace, req.user._id);
  if (!allowed && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not a member of this workspace");
  }
  const roomUrl = await getOrCreateWorkspaceRoom(workspace._id.toString());
  res.status(200).json({ success: true, roomUrl });
});

export const archiveWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) {
    res.status(404);
    throw new Error("Workspace not found");
  }
  if (workspace.mentor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only the mentor or an admin can archive this workspace");
  }
  workspace.status = "archived";
  await workspace.save();
  res.status(200).json({ success: true, workspace });
});
