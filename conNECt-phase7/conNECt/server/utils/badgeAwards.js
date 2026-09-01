import Badge from "../models/Badge.js";
import UserBadge from "../models/UserBadge.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

// Awards a badge by name to a user if they don't already have it.
// Safe to call repeatedly — silently no-ops if already awarded or badge doesn't exist.
export const awardBadge = async (userId, badgeName) => {
  const badge = await Badge.findOne({ name: badgeName });
  if (!badge) return null;

  try {
    const userBadge = await UserBadge.create({ user: userId, badge: badge._id });

    const notification = await Notification.create({
      user: userId,
      type: "badge",
      title: "Badge earned",
      message: `You earned the "${badgeName}" badge!`,
      relatedId: badge._id,
    });
    emitToUser(userId.toString(), "notification:new", notification);

    return userBadge;
  } catch (err) {
    if (err.code === 11000) return null; // already awarded
    throw err;
  }
};

// Default badge catalog — auto-seeded on server startup so admins don't have to create them manually.
export const DEFAULT_BADGES = [
  { name: "Community Helper", description: "Resolved 5 or more campus requests", criteria: "auto" },
  { name: "Project Leader", description: "Led a completed mentor-guided project", criteria: "auto" },
  { name: "Consistency Badge", description: "Maintained a 7-day activity streak", criteria: "auto" },
  { name: "College Topper", description: "Top academic performer", criteria: "manual" },
  { name: "Department Topper", description: "Top performer in their department", criteria: "manual" },
  { name: "Club President", description: "Leads a college club", criteria: "manual" },
  { name: "Club Coordinator", description: "Coordinates club activities", criteria: "manual" },
  { name: "Event Organizer", description: "Organized a successful campus event", criteria: "manual" },
  { name: "Mentor", description: "Guided a student project to completion", criteria: "manual" },
  { name: "Coding Champion", description: "Won a coding challenge", criteria: "manual" },
  { name: "Innovation Award", description: "Recognized for an innovative project", criteria: "manual" },
  { name: "Placement Achiever", description: "Secured a placement or internship", criteria: "manual" },
];
