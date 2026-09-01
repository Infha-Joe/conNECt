import express from "express";
import { giveFeedback } from "../controllers/assignmentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.put("/:id/feedback", protect, giveFeedback);

export default router;
