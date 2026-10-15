import express from "express";
import { getRecentAccess, addRecentAccess } from "../controllers/recentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(protect, getRecentAccess).post(protect, addRecentAccess);

export default router;
