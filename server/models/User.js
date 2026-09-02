import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned by default
    },
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
      sparse: true, // allows null for roles that may not have one (e.g. alumni)
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
      type: Number, // relevant for students
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
    lastStreakDate: { type: String, default: "" }, // YYYY-MM-DD of last streak-counted day
    xpPoints: { type: Number, default: 0 },
    // --- Teacher Specific Fields ---
    designation: { type: String, trim: true },
    
    // --- Alumni Specific Fields ---
    batch: { type: String, trim: true },
    degree: { type: String, trim: true },
    currentCompany: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    location: { type: String, trim: true },
    
  },
  { timestamps: true }
);

userSchema.index({ department: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive fields whenever a user doc is sent as JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
