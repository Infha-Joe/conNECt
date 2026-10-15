import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createMentorRequest,
  getOutgoingRequests,
  getIncomingRequests,
  acceptRequest,
  rejectRequest,
  getActiveMentorships,
  getMentorshipDetails,
  getMyClasses,
  createClass,
  getClasses,
  getChatHistory,
  getMentorshipProviders,
  closeMentorship
} from "../controllers/mentorshipController.js";

const router = express.Router();

router.use(protect); // All mentorship routes require authentication

router.post("/request", createMentorRequest);
router.get("/requests/outgoing", getOutgoingRequests);
router.get("/requests/incoming", getIncomingRequests);
router.get("/providers", getMentorshipProviders);
router.patch("/requests/:id/accept", acceptRequest);
router.patch("/requests/:id/reject", rejectRequest);

router.get("/active", getActiveMentorships);
router.get("/:id", getMentorshipDetails);
router.patch("/:id/close", closeMentorship);

router.post("/:id/classes", createClass);
router.get("/user/classes", getMyClasses);
router.get("/:id/classes", getClasses);

router.get("/:id/chat", getChatHistory);

export default router;
