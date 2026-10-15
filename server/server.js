import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { setIO } from "./services/socket.service.js";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import envCheck from "./routes/envCheck.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import recentRoutes from "./routes/recentRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import communityRequestRoutes from "./routes/communityRequestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import helpRequestRoutes from "./routes/helpRequestRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import academicRoutes from "./routes/academicRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import classroomRoutes from "./routes/classroomRoutes.js";
import ChatMessage from "./models/ChatMessage.js";
import Workspace from "./models/Workspace.js";
import { isWorkspaceMember } from "./utils/workspaceAccess.js";


import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
connectDB();

const app = express();
const httpServer = createServer(app);

import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Mentorship from "./models/Mentorship.js";
import MentorshipMessage from "./models/MentorshipMessage.js";

export const io = new Server(httpServer, {

  cors: { origin: [process.env.CLIENT_URL, "http://127.0.0.1:5173", "http://localhost:5173"], credentials: true },
});
setIO(io);


io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
    }
    next();
  } catch (err) {
    next();
  }
});

io.on("connection", (socket) => {
  if (socket.userId) {
    socket.join(`user_${socket.userId}`);
  }

  socket.on("workspace:join", async (workspaceId, callback) => {
    try {
      if (!socket.userId) return callback?.({ error: "Unauthorized" });
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return callback?.({ error: "Workspace not found" });
      const allowed = await isWorkspaceMember(workspace, socket.userId);
      if (!allowed) return callback?.({ error: "Not a member" });
      socket.join(`workspace_${workspaceId}`);
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: "Server error" });
    }
  });

  socket.on("workspace:leave", (workspaceId) => {
    socket.leave(`workspace_${workspaceId}`);
  });

  socket.on("workspace:message", async ({ workspaceId, text }, callback) => {
    try {
      if (!socket.userId) return callback?.({ error: "Unauthorized" });
      if (!text || !text.trim()) return;
      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) return callback?.({ error: "Not found" });
      const allowed = await isWorkspaceMember(workspace, socket.userId);
      if (!allowed) return callback?.({ error: "Not a member" });

      const message = await ChatMessage.create({
        workspace: workspaceId,
        sender: socket.userId,
        text: text.trim(),
      });
      await message.populate("sender", "name role profilePhoto");

      io.to(`workspace_${workspaceId}`).emit("workspace:message", message);
      callback?.({ success: true });
    } catch (err) {
      callback?.({ error: "Failed to send" });
    }
  });

  // Join a mentorship room securely
  socket.on("join_mentorship", async ({ mentorshipId, token }) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return;

      const mentorship = await Mentorship.findById(mentorshipId);
      if (!mentorship || mentorship.status !== "active") return;

      const isParticipant =
        (mentorship.mentor._id || mentorship.mentor).toString() === user._id.toString() ||
        (mentorship.requestType === "individual" && (mentorship.mentee?._id || mentorship.mentee)?.toString() === user._id.toString()) ||
        (mentorship.requestType === "group" && mentorship.groupMembers && mentorship.groupMembers.some(id => (id._id || id).toString() === user._id.toString()));

      if (isParticipant) {
        socket.join(`mentorship:${mentorshipId}`);
      }
    } catch (err) {
      console.error("Socket join error:", err.message);
    }
  });

  // Handle incoming messages
  socket.on("send_message", async ({ mentorshipId, content, attachment, token }, callback) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return callback && callback({ error: "User not found" });

      const mentorship = await Mentorship.findById(mentorshipId);
      if (!mentorship || mentorship.status !== "active") return callback && callback({ error: "Mentorship inactive" });

      const isParticipant =
        (mentorship.mentor._id || mentorship.mentor).toString() === user._id.toString() ||
        (mentorship.requestType === "individual" && (mentorship.mentee?._id || mentorship.mentee)?.toString() === user._id.toString()) ||
        (mentorship.requestType === "group" && mentorship.groupMembers && mentorship.groupMembers.some(id => (id._id || id).toString() === user._id.toString()));

      if (isParticipant) {
        const trimmedContent = (content || "").trim();
        const hasAttachment = Boolean(attachment && attachment.url && String(attachment.url).trim() !== "");

        if (!trimmedContent && !hasAttachment) {
          if (callback) callback({ error: "Empty messages are not allowed. Message must include text or an attachment." });
          return;
        }

        // Save to DB
        const message = await MentorshipMessage.create({
          mentorship: mentorshipId,
          sender: user._id,
          content: trimmedContent,
          attachment: hasAttachment ? {
            url: String(attachment.url).trim(),
            type: attachment.type || "file",
            name: attachment.name || "Attachment"
          } : undefined
        });

        const populatedMessage = await message.populate("sender", "name profilePhoto role");

        // Broadcast to everyone in the room
        io.to(`mentorship:${mentorshipId}`).emit("receive_message", populatedMessage);
        
        if (callback) callback({ success: true, message: populatedMessage });
      } else {
        if (callback) callback({ error: "Unauthorized" });
      }
    } catch (err) {
      console.error("Socket message error:", err.message);
      if (callback) callback({ error: "Server error" });
    }
  });

  socket.on("toggle_reaction", async ({ messageId, emoji, token, mentorshipId }, callback) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return callback && callback({ error: "User not found" });

      const message = await MentorshipMessage.findById(messageId);
      if (!message) return callback && callback({ error: "Message not found" });

      let reaction = message.reactions.find(r => r.emoji === emoji);
      if (reaction) {
        if (reaction.users.includes(user._id)) {
          reaction.users = reaction.users.filter(id => id.toString() !== user._id.toString());
          if (reaction.users.length === 0) {
            message.reactions = message.reactions.filter(r => r.emoji !== emoji);
          }
        } else {
          reaction.users.push(user._id);
        }
      } else {
        message.reactions.push({ emoji, users: [user._id] });
      }

      await message.save();
      const populatedMessage = await message.populate("sender", "name profilePhoto role");

      // Broadcast reaction update
      io.to(`mentorship:${mentorshipId}`).emit("message_updated", populatedMessage);
      
      if (callback) callback({ success: true });
    } catch (err) {
      console.error("Socket reaction error:", err.message);
      if (callback) callback({ error: "Server error" });
    }
  });

});

app.use(cors({ origin: [process.env.CLIENT_URL, "http://127.0.0.1:5173", "http://localhost:5173"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "conNECt API is running" });
});

// Phase 1 routes
app.use("/api/auth", authRoutes);
app.use("/api/test", envCheck);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/community-requests", communityRequestRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/classrooms", classroomRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 + error handling
app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`conNECt server running on port ${PORT}`);
});

