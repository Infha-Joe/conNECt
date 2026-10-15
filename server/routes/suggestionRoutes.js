import express from "express";
import {
  createSuggestion,
  getSuggestions,
  reviewSuggestion,
} from "../controllers/suggestionController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createSuggestion);
router.get("/", protect, getSuggestions);
router.put("/:id/review", protect, reviewSuggestion);

export default router;
