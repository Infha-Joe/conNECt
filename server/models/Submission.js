import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileUrl: { type: String, trim: true },
    comment: { type: String, trim: true, maxlength: 1000 },
    feedback: { type: String, trim: true, maxlength: 1000, default: "" },
    status: { type: String, enum: ["submitted", "reviewed", "resubmission_requested"], default: "submitted" },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
