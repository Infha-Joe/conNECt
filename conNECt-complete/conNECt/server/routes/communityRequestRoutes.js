import express from "express";
import {
  createRequest,
  getRequests,
  resolveRequest,
  deleteRequest,
} from "../controllers/communityRequestController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/", protect, getRequests);
router.put("/:id/resolve", protect, resolveRequest);
router.delete("/:id", protect, deleteRequest);

export default router;
