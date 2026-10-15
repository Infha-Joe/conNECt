import mongoose from "mongoose";

const classMembershipSchema = new mongoose.Schema({
  academicClass: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "AcademicClass", 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["active", "pending", "invited"], 
    default: "pending" 
  }
}, { timestamps: true });

// Prevent duplicate memberships or requests
classMembershipSchema.index({ academicClass: 1, user: 1 }, { unique: true });

export default mongoose.model("ClassMembership", classMembershipSchema);
