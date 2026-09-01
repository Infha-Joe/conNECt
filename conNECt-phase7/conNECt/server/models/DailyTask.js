import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskType: {
      type: String,
      enum: ["complete_profile", "attend_event", "help_student", "complete_assignment", "participate_discussion"],
      required: true,
    },
    date: { type: String, required: true }, // YYYY-MM-DD, keyed per day
    completed: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

dailyTaskSchema.index({ user: 1, taskType: 1, date: 1 }, { unique: true });

const DailyTask = mongoose.model("DailyTask", dailyTaskSchema);
export default DailyTask;
