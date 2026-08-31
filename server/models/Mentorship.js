import mongoose from "mongoose";

const mentorshipSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    requestType: {
      type: String,
      enum: ["individual", "group"],
      required: true,
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
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorRequest",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "expired", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Mentorship = mongoose.model("Mentorship", mentorshipSchema);
export default Mentorship;
