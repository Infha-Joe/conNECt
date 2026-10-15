import mongoose from "mongoose";

const mentorshipMessageSchema = new mongoose.Schema(
  {
    mentorship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentorship",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      default: "",
    },
    attachment: {
      url: { type: String, default: "" },
      type: { type: String, enum: ["image", "video", "file", ""] },
      name: { type: String },
    },
    reactions: [
      {
        emoji: { type: String },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
      }
    ],
  },
  { timestamps: true }
);

mentorshipMessageSchema.pre("validate", function (next) {
  const hasContent = Boolean(this.content && this.content.trim().length > 0);
  const hasAttachment = Boolean(this.attachment && this.attachment.url && this.attachment.url.trim().length > 0);
  if (!hasContent && !hasAttachment) {
    this.invalidate("content", "Message must contain at least text or an attachment.");
  }
  next();
});

const MentorshipMessage = mongoose.model("MentorshipMessage", mentorshipMessageSchema);
export default MentorshipMessage;
