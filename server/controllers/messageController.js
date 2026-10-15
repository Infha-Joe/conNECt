import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";
import Connection from "../models/Connection.js";
import User from "../models/User.js";
import { emitToUser } from "../services/socket.service.js";

const populateUser = "name role profilePhoto department";

// @desc    Get all active conversations for the current user (including empty accepted connections)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch all accepted connections for this user
  const connections = await Connection.find({
    status: "accepted",
    $or: [{ requester: userId }, { recipient: userId }],
  })
    .populate("requester", populateUser)
    .populate("recipient", populateUser);

  const conversationsMap = new Map();

  // Populate map with all accepted connections initially
  connections.forEach((conn) => {
    const isRequester = conn.requester._id.toString() === userId.toString();
    const partner = isRequester ? conn.recipient : conn.requester;
    
    conversationsMap.set(partner._id.toString(), {
      partner,
      lastMessage: null,
      unreadCount: 0,
      updatedAt: conn.updatedAt // fallback sorting for empty conversations
    });
  });

  // 2. Fetch all messages involving the user
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }],
  })
    .sort({ createdAt: 1 }) // sort ascending so latest message processes last and overwrites
    .populate("sender", populateUser)
    .populate("recipient", populateUser);

  // 3. Overlay message data on top of connections
  messages.forEach((msg) => {
    const isSender = msg.sender._id.toString() === userId.toString();
    const partner = isSender ? msg.recipient : msg.sender;
    const partnerId = partner._id.toString();

    // Even if somehow the connection was deleted, we still want to show the conversation history
    if (!conversationsMap.has(partnerId)) {
      conversationsMap.set(partnerId, {
        partner,
        lastMessage: null,
        unreadCount: 0,
        updatedAt: msg.createdAt
      });
    }

    const convo = conversationsMap.get(partnerId);
    convo.lastMessage = {
      text: msg.text,
      createdAt: msg.createdAt,
      isMine: isSender,
    };
    convo.updatedAt = msg.createdAt;

    if (!isSender && !msg.isRead) {
      convo.unreadCount += 1;
    }
  });

  // 4. Convert to array and sort by latest update
  const conversations = Array.from(conversationsMap.values()).sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  res.status(200).json({ success: true, conversations });
});

// @desc    Get messages between current user and another user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  const myId = req.user._id;

  // Verify connection status
  const connection = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: myId, recipient: targetId },
      { requester: targetId, recipient: myId },
    ],
  });

  if (!connection) {
    res.status(403);
    throw new Error("You can only access messages with connected users");
  }

  const messages = await Message.find({
      $or: [
        { sender: myId, recipient: targetId },
        { sender: targetId, recipient: myId },
      ],
    })
      .populate({ path: 'sharedPost', populate: { path: 'author', select: 'name profilePhoto' } })
      .sort({ createdAt: 1 });

  res.status(200).json({ success: true, count: messages.length, messages });
});

// @desc    Send a message to another user
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  const { text, sharedPost, mediaUrl, mediaType } = req.body;
  const myId = req.user._id;

  if ((!text || !text.trim()) && !sharedPost && !mediaUrl) {
    res.status(400);
    throw new Error("Message text, shared post, or media is required");
  }

  if (targetId === myId.toString()) {
    res.status(400);
    throw new Error("You cannot message yourself");
  }

  // Verify connection status
  const connection = await Connection.findOne({
    status: "accepted",
    $or: [
      { requester: myId, recipient: targetId },
      { requester: targetId, recipient: myId },
    ],
  });

  if (!connection) {
    res.status(403);
    throw new Error("You can only message connected users");
  }

  const message = await Message.create({
    sender: myId,
    recipient: targetId,
    text: text ? text.trim() : (mediaUrl ? "Sent an attachment" : "Shared a post"),
    sharedPost,
    mediaUrl,
    mediaType,
  });

  await message.populate("sender", populateUser);
  await message.populate("recipient", populateUser);

  // Emit in real-time
  emitToUser(targetId, "private_message:new", message);

  res.status(201).json({ success: true, message });
});

// @desc    Mark all messages from a user as read
// @route   PUT /api/messages/:userId/read
// @access  Private
export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const targetId = req.params.userId;
  const myId = req.user._id;

  await Message.updateMany(
    { sender: targetId, recipient: myId, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({ success: true, message: "Messages marked as read" });
});

// @desc    Get total unread message count for badge
// @route   GET /api/messages/unread/count
// @access  Private
export const getUnreadMessageCount = asyncHandler(async (req, res) => {
  const count = await Message.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  res.status(200).json({ success: true, unreadCount: count });
});
