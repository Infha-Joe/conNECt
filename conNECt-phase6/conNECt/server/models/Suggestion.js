import mongoose from "mongoose";

const suggestionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["suggestion", "feedback"], required: true },
    targetType: { type: String, enum: ["event", "club", "facility", "platform", "other"], default: "platform" },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  },
  { timestamps: true }
);

suggestionSchema.index({ status: 1, createdAt: -1 });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);
export default Suggestion;
