import asyncHandler from "express-async-handler";
import Workspace from "../models/Workspace.js";
import ChatMessage from "../models/ChatMessage.js";
import { isWorkspaceMember } from "../utils/workspaceAccess.js";

export const getMessages = asyncHandler(async (req, res) => {
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
  const messages = await ChatMessage.find({ workspace: workspace._id })
    .sort({ createdAt: 1 })
    .limit(200)
    .populate("sender", "name role profilePhoto");
  res.status(200).json({ success: true, messages });
});
