import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate requests in the same direction
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
// Fast lookup of "who's connected to me" from either side
connectionSchema.index({ recipient: 1, status: 1 });
connectionSchema.index({ requester: 1, status: 1 });

const Connection = mongoose.model("Connection", connectionSchema);
export default Connection;
