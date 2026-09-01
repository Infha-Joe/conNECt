import express from "express";
import {
  createProject, getProjects, getProject, updateProject, addProjectMember, removeProjectMember,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProject);
router.put("/:id", protect, updateProject);
router.post("/:id/members", protect, addProjectMember);
router.delete("/:id/members/:userId", protect, removeProjectMember);

export default router;
