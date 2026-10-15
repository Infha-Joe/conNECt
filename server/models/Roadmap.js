import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  entityType: { type: String, enum: ["Project", "Mentorship"], required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "entityType" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Roadmap", roadmapSchema);
