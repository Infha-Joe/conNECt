import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 2000 },
    attachmentUrl: { type: String, trim: true, default: "" },
    attachmentType: { type: String, enum: ["image", "video", "file", ""] },
    attachmentName: { type: String },
    reactions: [
      {
        emoji: { type: String },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
      }
    ]
  },
  { timestamps: true }
);

chatMessageSchema.index({ workspace: 1, createdAt: 1 });

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
