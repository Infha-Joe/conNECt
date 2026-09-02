import express from "express";
import { createChallenge, getChallenges, declareWinner, getLeaderboard } from "../controllers/challengeController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getChallenges);
router.post("/", protect, createChallenge);
router.put("/:id/winner", protect, declareWinner);

export default router;
