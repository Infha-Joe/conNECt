import express from "express";
import {
  googleAuth,
  registerManual,
  verifyEmail,
  loginManual,
  completeRegistration,
  verifyPersonalEmail,
  linkGoogleAccount,
  graduateToAlumni,
  getMe,
  logoutUser,
  resendVerification,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public Routes
router.post("/google", googleAuth);
router.post("/register", registerManual);
router.post("/login", loginManual);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/complete-registration", completeRegistration);
router.post("/logout", logoutUser);

// Protected Routes
router.get("/me", protect, getMe);
router.post("/verify-personal-email", protect, verifyPersonalEmail);
router.post("/link-google", protect, linkGoogleAccount);
router.post("/graduate", protect, graduateToAlumni);

export default router;
