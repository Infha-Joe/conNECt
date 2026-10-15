import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import {
  getMyClasses,
  createClass,
  joinClass,
  getClassDetails,
  getClassMembers,
  handleJoinRequest,
  getAcademicRecords,
  addAcademicRecord,
  updateAcademicRecord,
  deleteAcademicRecord,
  inviteStudent,
  updateClass,
  deleteClass
} from "../controllers/classroomController.js";

const router = express.Router();

router.use(protect); // All routes require authentication

router.route("/")
  .get(getMyClasses)
  .post(restrictTo("teacher", "admin"), createClass);

router.post("/join", restrictTo("student"), joinClass);

router.route("/:id")
  .get(getClassDetails)
  .put(restrictTo("teacher", "admin"), updateClass)
  .delete(restrictTo("teacher", "admin"), deleteClass);

router.route("/:id/members")
  .get(getClassMembers);

router.post("/:id/invite", restrictTo("teacher", "admin"), inviteStudent);

router.patch("/:id/requests/:requestId", restrictTo("teacher", "admin"), handleJoinRequest);

router.route("/:id/records")
  .get(getAcademicRecords)
  .post(addAcademicRecord);

router.route("/:id/records/:recordId")
  .put(updateAcademicRecord)
  .delete(deleteAcademicRecord);

export default router;
