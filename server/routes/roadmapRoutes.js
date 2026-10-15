import express from "express";
import { protect, restrictTo } from "../middleware/auth.js";
import Roadmap from "../models/Roadmap.js";
import RoadmapStage from "../models/RoadmapStage.js";
import ProjectMember from "../models/ProjectMember.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/:entityType/:entityId", protect, async (req, res) => {
  const roadmap = await Roadmap.findOne({ entityType: req.params.entityType, entityId: req.params.entityId });
  if (!roadmap) return res.json({ success: true, roadmap: null, stages: [] });
  const stages = await RoadmapStage.find({ roadmap: roadmap._id }).sort("order");
  res.json({ success: true, roadmap, stages });
});

router.post("/", protect, async (req, res) => {
  const { title, description, entityType, entityId } = req.body;
  let roadmap = await Roadmap.findOne({ entityType, entityId });
  if (!roadmap) {
    roadmap = await Roadmap.create({ title, description, entityType, entityId, createdBy: req.user._id });
  }
  res.status(201).json({ success: true, roadmap });
});

router.post("/:roadmapId/stages", protect, async (req, res) => {
  const stage = await RoadmapStage.create({ ...req.body, roadmap: req.params.roadmapId });
  res.status(201).json({ success: true, stage });
});

router.put("/stages/:stageId", protect, async (req, res) => {
  const stage = await RoadmapStage.findById(req.params.stageId);
  if (req.body.progress !== undefined && stage.progress !== req.body.progress) {
    stage.history.push({ progress: req.body.progress, note: req.body.note || "Progress updated", updatedBy: req.user._id });
    stage.progress = req.body.progress;
  }
  if (req.body.status) stage.status = req.body.status;
  if (req.body.completionDate) stage.completionDate = req.body.completionDate;
  await stage.save();
  
  // Check if ALL stages in this roadmap are completed
  const allStages = await RoadmapStage.find({ roadmap: stage.roadmap });
  const allCompleted = allStages.length > 0 && allStages.every(s => s.progress === 100);
  
  if (allCompleted) {
    const roadmap = await Roadmap.findById(stage.roadmap);
    if (roadmap && roadmap.entityType === "Project") {
      const project = await Project.findById(roadmap.entityId);
      if (project) {
        project.status = "completed";
        await project.save();
      }
    }
  }

  res.json({ success: true, stage });
});

export default router;
