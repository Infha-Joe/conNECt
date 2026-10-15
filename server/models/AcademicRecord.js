import mongoose from "mongoose";

const academicRecordSchema = new mongoose.Schema({
  academicClass: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AcademicClass", 
    required: true 
  },
  date: { 
    type: String, 
    required: true,
    index: true // e.g., "YYYY-MM-DD"
  },
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  
  topic: { type: String, trim: true },
  notes: { type: String, trim: true },
  
  files: [{
    title: { type: String, trim: true },
    url: { type: String, trim: true }
  }],
  
  links: [{
    title: { type: String, trim: true },
    url: { type: String, trim: true }
  }],
  
  announcement: { type: String, trim: true },
  
  assignment: {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    dueDate: { type: String } // e.g. "YYYY-MM-DD"
  }
}, { timestamps: true });

export default mongoose.model("AcademicRecord", academicRecordSchema);
