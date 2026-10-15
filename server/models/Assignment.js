import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    deadline: { type: Date, required: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

assignmentSchema.index({ workspace: 1, deadline: 1 });

const Assignment = mongoose.model("Assignment", assignmentSchema);
export default Assignment;
