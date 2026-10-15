import express from "express";
import { getWorkspace, extendWorkspace, startMeeting, archiveWorkspace } from "../controllers/workspaceController.js";
import { createAssignment, getAssignments } from "../controllers/assignmentController.js";
import { getMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", protect, getWorkspace);
router.put("/:id/extend", protect, extendWorkspace);
router.put("/:id/archive", protect, archiveWorkspace);
router.post("/:id/meeting", protect, startMeeting);

router.get("/:workspaceId/assignments", protect, getAssignments);
router.post("/:workspaceId/assignments", protect, createAssignment);

router.get("/:workspaceId/messages", protect, getMessages);

export default router;
