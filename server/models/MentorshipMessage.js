import mongoose from "mongoose";

const mentorshipMessageSchema = new mongoose.Schema(
  {
    mentorship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentorship",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const MentorshipMessage = mongoose.model("MentorshipMessage", mentorshipMessageSchema);
export default MentorshipMessage;
