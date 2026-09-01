import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true, trim: true, maxlength: 300 },
    options: [{ text: { type: String, required: true, trim: true }, voteCount: { type: Number, default: 0 } }],
    voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

pollSchema.index({ createdAt: -1 });

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
