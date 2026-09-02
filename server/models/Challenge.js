import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    points: { type: Number, default: 100 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    status: { type: String, enum: ["upcoming", "active", "completed"], default: "upcoming" },
  },
  { timestamps: true }
);

challengeSchema.index({ status: 1, startDate: 1 });

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
