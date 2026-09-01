import asyncHandler from "express-async-handler";
import Poll from "../models/Poll.js";

const populateUser = "name role profilePhoto";

export const createPoll = asyncHandler(async (req, res) => {
  const { question, options } = req.body;
  if (!question || !Array.isArray(options) || options.length < 2) {
    res.status(400);
    throw new Error("A poll needs a question and at least 2 options");
  }
  const poll = await Poll.create({ createdBy: req.user._id, question, options: options.map((text) => ({ text, voteCount: 0 })) });
  await poll.populate("createdBy", populateUser);
  res.status(201).json({ success: true, poll });
});

export const getPolls = asyncHandler(async (req, res) => {
  const polls = await Poll.find().sort({ createdAt: -1 }).populate("createdBy", populateUser);
  const withVoteState = polls.map((p) => ({
    ...p.toObject(),
    hasVoted: p.voters.some((v) => v.toString() === req.user._id.toString()),
    voters: undefined,
  }));
  res.status(200).json({ success: true, count: polls.length, polls: withVoteState });
});

export const voteOnPoll = asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;
  const poll = await Poll.findById(req.params.id);
  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }
  if (poll.voters.some((v) => v.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error("You have already voted on this poll");
  }
  if (optionIndex === undefined || !poll.options[optionIndex]) {
    res.status(400);
    throw new Error("Invalid option selected");
  }
  poll.options[optionIndex].voteCount += 1;
  poll.voters.push(req.user._id);
  await poll.save();
  res.status(200).json({ success: true, poll });
});

export const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);
  if (!poll) {
    res.status(404);
    throw new Error("Poll not found");
  }
  if (poll.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only delete your own polls");
  }
  await Poll.findByIdAndDelete(poll._id);
  res.status(200).json({ success: true, message: "Poll deleted" });
});
