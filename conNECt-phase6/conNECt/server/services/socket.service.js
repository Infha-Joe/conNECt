import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import ChatMessage from "../models/ChatMessage.js";
import Workspace from "../models/Workspace.js";
import { isWorkspaceMember } from "../utils/workspaceAccess.js";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL || "*", credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user_${socket.userId}`);

    socket.on("workspace:join", async (workspaceId, callback) => {
      try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return callback?.({ error: "Workspace not found" });
        const allowed = await isWorkspaceMember(workspace, socket.userId);
        if (!allowed) return callback?.({ error: "Not a member of this workspace" });
        socket.join(`workspace_${workspaceId}`);
        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: "Failed to join workspace" });
      }
    });

    socket.on("workspace:leave", (workspaceId) => {
      socket.leave(`workspace_${workspaceId}`);
    });

    socket.on("workspace:message", async ({ workspaceId, text }, callback) => {
      try {
        if (!text || !text.trim()) return;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) return callback?.({ error: "Workspace not found" });
        const allowed = await isWorkspaceMember(workspace, socket.userId);
        if (!allowed) return callback?.({ error: "Not a member of this workspace" });

        const message = await ChatMessage.create({
          workspace: workspaceId,
          sender: socket.userId,
          text: text.trim(),
        });
        await message.populate("sender", "name role profilePhoto");

        io.to(`workspace_${workspaceId}`).emit("workspace:message", message);
        callback?.({ success: true });
      } catch (err) {
        callback?.({ error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized yet");
  return io;
};

export const emitToUser = (userId, event, payload) => {
  if (!io) return;
  io.to(`user_${userId}`).emit(event, payload);
};
