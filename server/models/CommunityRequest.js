import mongoose from "mongoose";

const communityRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, maxlength: 1000 },
    category: { type: String, enum: ["item", "notes", "teammate", "help", "other"], default: "other" },
    status: { type: String, enum: ["open", "resolved"], default: "open" },
    helper: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

communityRequestSchema.index({ status: 1, createdAt: -1 });

const CommunityRequest = mongoose.model("CommunityRequest", communityRequestSchema);
export default CommunityRequest;
