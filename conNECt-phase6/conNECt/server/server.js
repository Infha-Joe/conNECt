import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";

import connectDB from "./config/db.js";
import { initSocket } from "./services/socket.service.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import pollRoutes from "./routes/pollRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import communityRequestRoutes from "./routes/communityRequestRoutes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

initSocket(httpServer);

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "conNECt API is running" });
});

// Phase 1
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);

// Phase 2
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Phase 3
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);

// Phase 4
app.use("/api/projects", projectRoutes);
app.use("/api/mentor-requests", mentorRoutes);
app.use("/api/workspaces", workspaceRoutes);

// Phase 5
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

// Phase 6
app.use("/api/polls", pollRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/community-requests", communityRequestRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`conNECt server running on port ${PORT}`);
});
