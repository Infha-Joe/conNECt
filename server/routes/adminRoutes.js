import express from "express";
import {
  getAnalytics,
  getAllUsers,
  setUserVerification,
  setUserRole,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/roleCheck.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getAllUsers);
router.put("/users/:id/verify", setUserVerification);
router.put("/users/:id/role", setUserRole);

export default router;
