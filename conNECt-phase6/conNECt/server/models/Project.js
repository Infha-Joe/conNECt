import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    technologies: [{ type: String, trim: true }],
    githubLink: { type: String, trim: true },
    projectLink: { type: String, trim: true },
    reportUrl: { type: String, trim: true },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    startDate: { type: Date },
    expectedEndDate: { type: Date },
    actualEndDate: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ status: 1 });
projectSchema.index({ mentor: 1 });
projectSchema.index({ leader: 1 });

const Project = mongoose.model("Project", projectSchema);
export default Project;
