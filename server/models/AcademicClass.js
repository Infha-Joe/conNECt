import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  // Existing fields (keep for backward compatibility with timetables)
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: false },
  name: { type: String, required: true }, // e.g., "Data Structures", "III Year"
  section: { type: String, required: false }, // e.g., "A"
  
  // New Workspace Fields
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  subject: { type: String, trim: true },
  semester: { type: String, trim: true },
  description: { type: String, trim: true, maxlength: 1000 },
  inviteCode: { type: String, unique: true, sparse: true, trim: true }
}, { timestamps: true });

export default mongoose.model("AcademicClass", classSchema);
