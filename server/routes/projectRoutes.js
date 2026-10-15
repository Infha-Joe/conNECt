import express from "express";
import { protect } from "../middleware/auth.js";
import { initializeRoadmap, updateTaskStatus, addMentorFeedback } from "../controllers/roadmapController.js";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  requestToJoinProject,
  updateMemberStatus
} from "../controllers/projectController.js";

const router = express.Router();

router.route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router.route("/:id")
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.post("/:id/request", protect, requestToJoinProject);
router.put("/:projectId/members/:userId", protect, updateMemberStatus);

router.post("/:id/roadmap/init", protect, initializeRoadmap);
router.put("/:id/roadmap/task", protect, updateTaskStatus);
router.put("/:id/roadmap/feedback", protect, addMentorFeedback);

export default router;
