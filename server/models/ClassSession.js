import mongoose from "mongoose";

const classSessionSchema = new mongoose.Schema({
  academicClass: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicClass", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionDate: { type: Date, required: true },
  startTime: { type: String },
  endTime: { type: String },
  topic: { type: String },
  materials: [{
    title: String,
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
    isOfficial: { type: Boolean, default: false } // true if uploaded by faculty
  }]
}, { timestamps: true });

export default mongoose.model("ClassSession", classSessionSchema);
