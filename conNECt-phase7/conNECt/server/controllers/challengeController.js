import asyncHandler from "express-async-handler";
import Challenge from "../models/Challenge.js";
import Department from "../models/Department.js";

const populateDept = "name code themeColor";

// @desc    Create a department challenge (admin only)
// @route   POST /api/challenges
// @access  Private/Admin
export const createChallenge = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only an admin can create challenges");
  }

  const { title, description, departments, startDate, endDate, points } = req.body;
  if (!title || !startDate || !endDate) {
    res.status(400);
    throw new Error("Title, start date, and end date are required");
  }

  const challenge = await Challenge.create({
    title, description, departments: departments || [], startDate, endDate, points: points || 100,
  });

  res.status(201).json({ success: true, challenge });
});

// @desc    List challenges
// @route   GET /api/challenges?status=
// @access  Private
export const getChallenges = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const challenges = await Challenge.find(filter)
    .sort({ startDate: -1 })
    .populate("departments", populateDept)
    .populate("winner", populateDept);

  res.status(200).json({ success: true, count: challenges.length, challenges });
});

// @desc    Declare a challenge winner (admin only)
// @route   PUT /api/challenges/:id/winner
// @access  Private/Admin
export const declareWinner = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only an admin can declare a challenge winner");
  }

  const { departmentId } = req.body;
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) {
    res.status(404);
    throw new Error("Challenge not found");
  }

  if (departmentId && !challenge.departments.some((d) => d.toString() === departmentId)) {
    res.status(400);
    throw new Error("Selected department did not participate in this challenge");
  }

  challenge.winner = departmentId;
  challenge.status = "completed";
  await challenge.save();
  await challenge.populate("winner", populateDept);

  res.status(200).json({ success: true, challenge });
});

// @desc    Department leaderboard — total points won across completed challenges
// @route   GET /api/departments/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req, res) => {
  const departments = await Department.find();

  const results = await Promise.all(
    departments.map(async (dept) => {
      const wonChallenges = await Challenge.find({ winner: dept._id, status: "completed" });
      const totalPoints = wonChallenges.reduce((sum, c) => sum + c.points, 0);
      return {
        department: { _id: dept._id, name: dept.name, code: dept.code, themeColor: dept.themeColor },
        totalPoints,
        challengesWon: wonChallenges.length,
      };
    })
  );

  results.sort((a, b) => b.totalPoints - a.totalPoints);

  res.status(200).json({ success: true, leaderboard: results });
});
