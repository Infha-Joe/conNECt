import mongoose from "mongoose";

const roadmapStageSchema = new mongoose.Schema({
  roadmap: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap", required: true },
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
  progress: { type: Number, default: 0 }, // 0 to 100
  startDate: { type: Date },
  targetDate: { type: Date },
  completionDate: { type: Date },
  responsiblePerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tasks: [{
    title: String,
    completed: { type: Boolean, default: false }
  }],
  history: [{
    date: { type: Date, default: Date.now },
    progress: Number,
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }]
}, { timestamps: true });

export default mongoose.model("RoadmapStage", roadmapStageSchema);
