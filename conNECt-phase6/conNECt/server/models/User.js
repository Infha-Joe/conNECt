import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
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
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "alumni", "admin"],
      required: true,
      default: "student",
    },
    collegeId: { type: String, trim: true, unique: true, sparse: true },
    phone: { type: String, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    year: { type: Number },
    profilePhoto: { type: String, default: "" },
    bio: { type: String, maxlength: 500, default: "" },
    skills: [{ type: String, trim: true }],
    githubLink: { type: String, trim: true },
    linkedinLink: { type: String, trim: true },
    portfolioLink: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    internships: [{ company: String, role: String, duration: String }],
    streak: { type: Number, default: 0 },
    xpPoints: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.index({ department: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
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
