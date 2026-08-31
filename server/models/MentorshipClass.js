import mongoose from "mongoose";

const mentorshipClassSchema = new mongoose.Schema(
  {
    mentorship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentorship",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    meetingLink: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const MentorshipClass = mongoose.model("MentorshipClass", mentorshipClassSchema);
export default MentorshipClass;
