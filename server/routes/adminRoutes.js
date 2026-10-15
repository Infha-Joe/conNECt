import express from "express";
import {
  getAnalytics,
  getUsers,
  verifyUser,
  updateUserRole,
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.put("/users/:id/verify", verifyUser);
router.put("/users/:id/role", updateUserRole);

export default router;
