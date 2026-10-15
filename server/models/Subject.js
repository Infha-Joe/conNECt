import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  academicClass: { type: mongoose.Schema.Types.ObjectId, ref: "AcademicClass", required: true },
  name: { type: String, required: true }, // e.g., "DBMS"
  code: { type: String, required: true }, // e.g., "CS301"
  faculty: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // assigned teachers
}, { timestamps: true });

export default mongoose.model("Subject", subjectSchema);
