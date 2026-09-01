import express from "express";
import { sendMentorRequest, getMentorRequests, respondToMentorRequest } from "../controllers/mentorController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, sendMentorRequest);
router.get("/", protect, getMentorRequests);
router.put("/:id/respond", protect, respondToMentorRequest);

export default router;
