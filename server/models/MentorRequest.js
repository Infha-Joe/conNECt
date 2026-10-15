import mongoose from "mongoose";

const mentorRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    requestType: {
      type: String,
      enum: ["individual", "group"],
      required: true,
      default: "individual",
    },
    groupName: {
      type: String,
      trim: true,
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    goals: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    requestedDuration: {
      type: Number, // in days
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const MentorRequest = mongoose.model("MentorRequest", mentorRequestSchema);
export default MentorRequest;
