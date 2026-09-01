import asyncHandler from "express-async-handler";
import DailyTask from "../models/DailyTask.js";
import User from "../models/User.js";
import { awardBadge } from "../utils/badgeAwards.js";

const TASK_TYPES = ["complete_profile", "attend_event", "help_student", "complete_assignment", "participate_discussion"];
const TASK_LABELS = {
  complete_profile: "Complete your profile",
  attend_event: "Attend an event",
  help_student: "Help another student",
  complete_assignment: "Complete an assignment",
  participate_discussion: "Participate in a discussion",
};
const XP_PER_TASK = 5;

const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// @desc    Get today's daily tasks for the current user (auto-created if missing)
// @route   GET /api/daily-tasks
// @access  Private
export const getTodayTasks = asyncHandler(async (req, res) => {
  const date = todayKey();

  const tasks = await Promise.all(
    TASK_TYPES.map(async (taskType) => {
      const task = await DailyTask.findOneAndUpdate(
        { user: req.user._id, taskType, date },
        { $setOnInsert: { user: req.user._id, taskType, date, completed: false, xpEarned: 0 } },
        { new: true, upsert: true }
      );
      return { ...task.toObject(), label: TASK_LABELS[taskType] };
    })
  );

  res.status(200).json({ success: true, tasks, streak: req.user.streak });
});

// @desc    Mark a daily task as completed — awards XP and updates streak
// @route   PUT /api/daily-tasks/:id/complete
// @access  Private
export const completeTask = asyncHandler(async (req, res) => {
  const task = await DailyTask.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only complete your own tasks");
  }
  if (task.completed) {
    res.status(400);
    throw new Error("Task already completed");
  }

  task.completed = true;
  task.xpEarned = XP_PER_TASK;
  await task.save();

  const user = await User.findById(req.user._id);
  user.xpPoints += XP_PER_TASK;

  // Streak logic: only the FIRST completed task of the day advances the streak
  const today = todayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (user.lastStreakDate !== today) {
    if (user.lastStreakDate === yesterday) {
      user.streak += 1;
    } else {
      user.streak = 1;
    }
    user.lastStreakDate = today;
  }

  await user.save();

  if (user.streak >= 7) {
    await awardBadge(user._id, "Consistency Badge");
  }

  res.status(200).json({ success: true, task, xpPoints: user.xpPoints, streak: user.streak });
});
