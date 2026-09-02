import express from "express";
import { getTodayTasks, completeTask } from "../controllers/dailyTaskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getTodayTasks);
router.put("/:id/complete", protect, completeTask);

export default router;
