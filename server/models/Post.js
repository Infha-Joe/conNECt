import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String, // 'image' or 'video'
      enum: ['image', 'video'],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Require content OR mediaUrl
postSchema.pre('validate', function(next) {
  if (!this.content && !this.mediaUrl) {
    this.invalidate('content', 'Post must have either content or media');
  }
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
