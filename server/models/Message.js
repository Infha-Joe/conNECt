import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
      trim: true,
      maxlength: 2000,
    },
    sharedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String, // 'image', 'video', 'file'
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for fast lookup of conversations and unread counts
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.pre("validate", function (next) {
  const hasText = Boolean(this.text && this.text.trim().length > 0);
  const hasMedia = Boolean(this.mediaUrl && this.mediaUrl.trim().length > 0);
  const hasSharedPost = Boolean(this.sharedPost);
  if (!hasText && !hasMedia && !hasSharedPost) {
    this.invalidate("text", "A message must contain text, media, or a shared post.");
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
