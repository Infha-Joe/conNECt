import express from "express";
import { submitAssignment, getSubmissions } from "../controllers/assignmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/submissions", protect, submitAssignment);
router.get("/:id/submissions", protect, getSubmissions);

export default router;
