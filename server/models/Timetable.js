import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  academicClass: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicClass", required: true },
  dayOfWeek: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
  startTime: { type: String, required: true }, // e.g. "09:00"
  endTime: { type: String, required: true }, // e.g. "10:00"
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
}, { timestamps: true });

export default mongoose.model("Timetable", timetableSchema);
