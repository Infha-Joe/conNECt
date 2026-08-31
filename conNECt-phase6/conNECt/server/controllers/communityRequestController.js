import asyncHandler from "express-async-handler";
import CommunityRequest from "../models/CommunityRequest.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto department";

export const createRequest = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title) {
    res.status(400);
    throw new Error("A title is required (e.g. 'Need a calculator for tomorrow's exam')");
  }
  const request = await CommunityRequest.create({ user: req.user._id, title, description, category: category || "other" });
  await request.populate("user", populateUser);
  res.status(201).json({ success: true, request });
});

export const getRequests = asyncHandler(async (req, res) => {
  const { status, category } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  const requests = await CommunityRequest.find(filter).sort({ createdAt: -1 }).populate("user", populateUser).populate("helper", populateUser);
  res.status(200).json({ success: true, count: requests.length, requests });
});

export const resolveRequest = asyncHandler(async (req, res) => {
  const request = await CommunityRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }
  if (request.status === "resolved") {
    res.status(400);
    throw new Error("This request has already been resolved");
  }
  if (request.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot resolve your own request");
  }
  request.status = "resolved";
  request.helper = req.user._id;
  request.resolvedAt = new Date();
  await request.save();
  await request.populate("user", populateUser);
  await request.populate("helper", populateUser);

  await User.findByIdAndUpdate(req.user._id, { $inc: { xpPoints: 10 } });

  const notification = await Notification.create({
    user: request.user._id, type: "community", title: "Your request was resolved",
    message: `${req.user.name} helped with "${request.title}"`, relatedId: request._id,
  });
  emitToUser(request.user._id.toString(), "notification:new", notification);

  res.status(200).json({ success: true, request });
});

export const deleteRequest = asyncHandler(async (req, res) => {
  const request = await CommunityRequest.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error("Request not found");
  }
  if (request.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You can only delete your own requests");
  }
  await CommunityRequest.findByIdAndDelete(request._id);
  res.status(200).json({ success: true, message: "Request deleted" });
});
