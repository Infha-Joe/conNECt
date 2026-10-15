import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Hackathon",
        "Coding Competition",
        "Project Competition",
        "Paper Presentation",
        "Technical Competition",
        "Academic Achievement",
        "Award/Prize",
        "Certification",
        "Workshop Achievement",
        "Internship Achievement",
        "Sports/Cultural Achievement",
        "Other",
      ],
    },
    description: { type: String, trim: true },
    organization: { type: String, trim: true, required: true },
    date: { type: Date, required: true },
    position: { type: String, trim: true }, // e.g., "Winner", "1st Place", "Runner-up", "Participant"
    proofUrl: { type: String, trim: true }, // Link to certificate/image from existing upload system
    link: { type: String, trim: true },
  },
  { timestamps: true }
);

achievementSchema.index({ user: 1, date: -1 });

const Achievement = mongoose.model("Achievement", achievementSchema);
export default Achievement;
