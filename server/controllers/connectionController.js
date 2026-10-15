import asyncHandler from "express-async-handler";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import Follow from "../models/Follow.js";
import Notification from "../models/Notification.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto department";

// @desc    Send a connection request
// @route   POST /api/users/:id/connect
// @access  Private
export const sendConnectionRequest = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  if (targetId === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot connect with yourself");
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check both directions — either party may have already sent a request
  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: targetId },
      { requester: targetId, recipient: req.user._id },
    ],
  });

  if (existing) {
    if (existing.status === "accepted") {
      return res.status(200).json({ success: true, status: "accepted", message: "Already connected" });
    }
    if (existing.status === "pending") {
      const isIncoming = existing.recipient.toString() === req.user._id.toString();
      return res.status(200).json({ 
        success: true, 
        status: isIncoming ? "pending-incoming" : "pending-outgoing", 
        message: isIncoming ? "Incoming request exists" : "Request already sent" 
      });
    }
    // Previously rejected — allow a fresh request by resetting it
    existing.requester = req.user._id;
    existing.recipient = targetId;
    existing.status = "pending";
    existing.respondedAt = undefined;
    await existing.save();
  } else {
    // Add safety against race condition duplicates via upsert-style findOneAndUpdate
    const connection = await Connection.findOneAndUpdate(
      {
        $or: [
          { requester: req.user._id, recipient: targetId },
          { requester: targetId, recipient: req.user._id },
        ],
      },
      {
        $setOnInsert: { requester: req.user._id, recipient: targetId, status: "pending" }
      },
      { upsert: true, new: true, rawResult: true }
    );
    
    // If it wasn't an insert, someone beat us to it in a race condition
    if (!connection.lastErrorObject?.updatedExisting) {
       // Proceed to notification
    } else {
       // Race condition caught
       const isIncoming = connection.value.recipient.toString() === req.user._id.toString();
       return res.status(200).json({ 
         success: true, 
         status: isIncoming ? "pending-incoming" : "pending-outgoing", 
         message: "Request handled concurrently" 
       });
    }
  }

  const notification = await Notification.create({
    user: targetId,
    type: "connection_request",
    title: "New connection request",
    message: `${req.user.name} wants to connect with you`,
    relatedId: req.user._id,
  });
  emitToUser(targetId, "notification:new", notification);

  res.status(200).json({ success: true, status: "pending", message: "Connection request sent" });
});

// @desc    Respond to a connection request
// @route   PUT /api/connections/:id/respond
// @access  Private (recipient only)
export const respondToConnectionRequest = asyncHandler(async (req, res) => {
  const { action } = req.body; // "accept" | "reject"

  if (!["accept", "reject"].includes(action)) {
    res.status(400);
    throw new Error("Action must be 'accept' or 'reject'");
  }

  const connection = await Connection.findById(req.params.id);
  if (!connection) {
    res.status(404);
    throw new Error("Connection request not found");
  }

  if (connection.recipient.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the recipient can respond to this request");
  }

  if (connection.status !== "pending") {
    res.status(400);
    throw new Error("This request has already been responded to");
  }

    connection.status = action === "accept" ? "accepted" : "rejected";
  connection.respondedAt = new Date();
  await connection.save();

  if (action === "accept") {
    // Create mutual follow when connection is accepted
    await Follow.updateOne(
      { follower: connection.requester, following: connection.recipient },
      { $setOnInsert: { follower: connection.requester, following: connection.recipient } },
      { upsert: true }
    );
    await Follow.updateOne(
      { follower: connection.recipient, following: connection.requester },
      { $setOnInsert: { follower: connection.recipient, following: connection.requester } },
      { upsert: true }
    );
  }

  const notification = await Notification.create({
    user: connection.requester,
    type: "connection_response",
    title: action === "accept" ? "Connection accepted" : "Connection declined",
    message: action === "accept" ? `${req.user.name} accepted your connection request` : `${req.user.name} declined your connection request`,
    relatedId: connection._id,
  });
  emitToUser(connection.requester.toString(), "notification:new", notification);

  res.status(200).json({ success: true, connection });
});

// @desc    Remove/cancel a connection (either side) or withdraw a sent request
// @route   DELETE /api/users/:id/connect
// @access  Private
export const removeConnection = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  await Connection.findOneAndDelete({
    $or: [
      { requester: req.user._id, recipient: targetId },
      { requester: targetId, recipient: req.user._id },
    ],
  });

  res.status(200).json({ success: true, message: "Connection removed" });
});

// @desc    Get connection status between current user and another user
// @route   GET /api/users/:id/connection-status
// @access  Private
export const getConnectionStatus = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  const connection = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: targetId },
      { requester: targetId, recipient: req.user._id },
    ],
  });

  if (!connection) {
    return res.status(200).json({ success: true, status: "none" });
  }

  const isRequester = connection.requester.toString() === req.user._id.toString();

  res.status(200).json({
    success: true,
    status: connection.status, // "pending" | "accepted" | "rejected"
    direction: isRequester ? "outgoing" : "incoming",
    connectionId: connection._id,
  });
});

// @desc    Get a user's accepted connections (their "network")
// @route   GET /api/users/:id/connections
// @access  Private
export const getUserConnections = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  let connections = await Connection.find({
    status: "accepted",
    $or: [{ requester: targetId }, { recipient: targetId }],
  })
    .populate("requester", populateUser)
    .populate("recipient", populateUser);

  // Filter out cases where either side was deleted
  connections = connections.filter(c => c.requester != null && c.recipient != null);

  const users = connections.map((c) =>
    c.requester._id.toString() === targetId ? c.recipient : c.requester
  );

  res.status(200).json({ success: true, count: users.length, connections: users });
});

// @desc    Get my incoming pending connection requests
// @route   GET /api/connections/pending
// @access  Private
export const getPendingRequests = asyncHandler(async (req, res) => {
  let requests = await Connection.find({ recipient: req.user._id, status: "pending" })
    .sort({ createdAt: -1 })
    .populate("requester", populateUser);

  // Filter out cases where the requester was deleted
  requests = requests.filter(r => r.requester != null);

  res.status(200).json({ success: true, count: requests.length, requests });
});

// @desc    Connection count stats for a profile
// @route   GET /api/users/:id/connection-stats
// @access  Private
export const getConnectionStats = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const count = await Connection.countDocuments({
    status: "accepted",
    $or: [{ requester: targetId }, { recipient: targetId }],
  });

  res.status(200).json({ success: true, connectionCount: count });
});
