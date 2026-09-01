import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String, trim: true, maxlength: 2000 },
    media: [{ type: String }],
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

const Post = mongoose.model("Post", postSchema);
export default Post;
