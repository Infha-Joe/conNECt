import Project from "../models/Project.js";
import asyncHandler from "express-async-handler";

// Default stages for a new project
const DEFAULT_STAGES = [
  { title: "Problem Identification", tasks: [{ title: "Define problem statement" }, { title: "Identify target audience" }] },
  { title: "Literature Survey", tasks: [{ title: "Review existing solutions" }, { title: "Gather academic papers" }] },
  { title: "System Design", tasks: [{ title: "Create architecture diagram" }, { title: "Design database schema" }] },
  { title: "Implementation", tasks: [{ title: "Setup frontend" }, { title: "Setup backend API" }] },
  { title: "Testing & Evaluation", tasks: [{ title: "Unit testing" }, { title: "User acceptance testing" }] }
];

export const initializeRoadmap = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if (!project) { res.status(404); throw new Error("Project not found"); }
    
    // Only leader can initialize
    if (project.leader.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error("Not authorized");
    }

    if (project.stages && project.stages.length > 0) {
        res.status(400); throw new Error("Roadmap already initialized");
    }

    project.stages = DEFAULT_STAGES;
    await project.save();
    res.json({ success: true, project });
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
    const { stageId, taskId, isCompleted } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) { res.status(404); throw new Error("Project not found"); }

    const stage = project.stages.id(stageId);
    if (!stage) { res.status(404); throw new Error("Stage not found"); }

    const task = stage.tasks.id(taskId);
    if (!task) { res.status(404); throw new Error("Task not found"); }

    task.isCompleted = isCompleted;
    task.completedAt = isCompleted ? Date.now() : null;

    // Recalculate progress
    let totalTasks = 0;
    let completedTasks = 0;
    project.stages.forEach(s => {
        s.tasks.forEach(t => {
            totalTasks++;
            if (t.isCompleted) completedTasks++;
        });
        
        // Auto-update stage status based on tasks
        const stageCompletedTasks = s.tasks.filter(t => t.isCompleted).length;
        if (stageCompletedTasks === 0) s.status = "pending";
        else if (stageCompletedTasks === s.tasks.length) {
            s.status = "completed";
            s.completedAt = s.completedAt || Date.now();
        } else {
            s.status = "in_progress";
        }
    });

    project.progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    await project.save();
    res.json({ success: true, project });
});

export const addMentorFeedback = asyncHandler(async (req, res) => {
    const { stageId, feedback } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) { res.status(404); throw new Error("Project not found"); }
    if (project.mentor?.toString() !== req.user._id.toString()) {
        res.status(403); throw new Error("Only the assigned mentor can provide feedback");
    }

    const stage = project.stages.id(stageId);
    if (!stage) { res.status(404); throw new Error("Stage not found"); }

    stage.mentorFeedback = feedback;
    await project.save();
    res.json({ success: true, project });
});
