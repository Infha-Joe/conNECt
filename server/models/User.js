/* =========================================================================
 * ❄️ AUTHENTICATION IS FROZEN ❄️
 * Do not modify authentication files or password/JWT/email-verification logic 
 * while implementing unrelated features.
 * Reuse the existing auth system.
 * ========================================================================= */

﻿import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    // The active, primary email used for communications
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    // The original college email (never changes once set)
    collegeEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    // The user's verified personal email
    personalEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.collegeGoogleId && !this.personalGoogleId;
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    connectId: {
      type: String,
      unique: true,
      sparse: true,
    },
    collegeGoogleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    personalGoogleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
      type: String,
      enum: ["student", "teacher", "alumni", "admin"],
      required: true,
      default: "student",
    },
    collegeId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    facultyId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    status: {
      type: String,
      enum: ["active", "pending_approval", "rejected"],
      default: "active",
    },
    alumniType: {
      type: String,
      enum: ["existing_student", "new_alumni"],
    },
    phone: {
      type: String,
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    year: {
      type: Number, 
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },
    skills: [{ type: String, trim: true }],
    githubLink: { type: String, trim: true },
    linkedinLink: { type: String, trim: true },
    portfolioLink: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    internships: [
      {
        company: String,
        role: String,
        duration: String,
      },
    ],
    streak: { type: Number, default: 0 },
    lastStreakDate: { type: String, default: "" }, 
    xpPoints: { type: Number, default: 0 },
    
    // --- Teacher Specific Fields ---
    designation: { type: String, trim: true },
    
    // --- Alumni Specific Fields ---
    graduationYear: { type: Number },
    alumniSince: { type: Date },
    batch: { type: String, trim: true },
    degree: { type: String, trim: true },
    currentCompany: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    location: { type: String, trim: true },
    
  },
  { timestamps: true }
);

userSchema.index({ department: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
