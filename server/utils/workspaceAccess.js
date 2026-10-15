import ProjectMember from "../models/ProjectMember.js";

export const isWorkspaceMember = async (workspace, userId) => {
  if (workspace.mentor.toString() === userId.toString()) return true;
  const membership = await ProjectMember.findOne({ project: workspace.project, user: userId });
  return Boolean(membership);
};
