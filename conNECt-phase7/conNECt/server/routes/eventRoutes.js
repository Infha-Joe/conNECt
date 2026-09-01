import express from "express";
import {
  createEvent, getEvents, getEvent, updateEvent, deleteEvent,
  registerForEvent, cancelRegistration, getParticipants,
} from "../controllers/eventController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getEvents);
router.post("/", protect, createEvent);
router.get("/:id", protect, getEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.post("/:id/register", protect, registerForEvent);
router.delete("/:id/register", protect, cancelRegistration);
router.get("/:id/participants", protect, getParticipants);

export default router;
