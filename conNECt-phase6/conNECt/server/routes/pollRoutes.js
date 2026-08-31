import express from "express";
import { createPoll, getPolls, voteOnPoll, deletePoll } from "../controllers/pollController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createPoll);
router.get("/", protect, getPolls);
router.post("/:id/vote", protect, voteOnPoll);
router.delete("/:id", protect, deletePoll);

export default router;
