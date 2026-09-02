import mongoose from "mongoose";

const mentorRequestSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    requestedDuration: { type: String, trim: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    respondedAt: { type: Date },
  },
  { timestamps: true }
);

mentorRequestSchema.index({ mentor: 1, status: 1 });
mentorRequestSchema.index({ student: 1, status: 1 });

const MentorRequest = mongoose.model("MentorRequest", mentorRequestSchema);
export default MentorRequest;
