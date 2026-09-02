import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import communityRequestRoutes from "./routes/communityRequestRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import dailyTaskRoutes from "./routes/dailyTaskRoutes.js";
import challengeRoutes from "./routes/challengeRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Mentorship from "./models/Mentorship.js";
import MentorshipMessage from "./models/MentorshipMessage.js";

export const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "*", credentials: true },
});

io.on("connection", (socket) => {
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
  socket.on("send_message", async ({ mentorshipId, content, token }, callback) => {
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
        // Save to DB
        const message = await MentorshipMessage.create({
          mentorship: mentorshipId,
          sender: user._id,
          content
        });

        const populatedMessage = await message.populate("sender", "name profilePhoto role");

        // Broadcast to everyone in the room
        io.to(`mentorship:${mentorshipId}`).emit("receive_message", populatedMessage);
        
        if (callback) callback({ success: true });
      } else {
        if (callback) callback({ error: "Unauthorized" });
      }
    } catch (err) {
      console.error("Socket message error:", err.message);
      if (callback) callback({ error: "Server error" });
    }
  });
});

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "conNECt API is running" });
});

// Phase 1 routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/mentorship", mentorshipRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/community-requests", communityRequestRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/daily-tasks", dailyTaskRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`conNECt server running on port ${PORT}`);
});
