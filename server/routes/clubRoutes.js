import express from "express";
import {
  createClub, getClubs, getClub, updateClub, deleteClub, joinClub, leaveClub,
} from "../controllers/clubController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";

const router = express.Router();

router.get("/", protect, getClubs);
router.post("/", protect, authorize("admin"), createClub);
router.get("/:id", protect, getClub);
router.put("/:id", protect, updateClub);
router.delete("/:id", protect, authorize("admin"), deleteClub);
router.post("/:id/join", protect, joinClub);
router.delete("/:id/join", protect, leaveClub);

export default router;
