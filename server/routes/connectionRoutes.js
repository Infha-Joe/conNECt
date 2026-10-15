import express from "express";
import { respondToConnectionRequest, getPendingRequests } from "../controllers/connectionController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/pending", protect, getPendingRequests);
router.put("/:id/respond", protect, respondToConnectionRequest);

export default router;
