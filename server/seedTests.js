import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Manually load .env since we're running a script
dotenv.config();

const MONGO_URI = "mongodb://127.0.0.1:27017/conNECt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    connectId: { type: String, unique: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["student", "teacher", "alumni", "admin"], default: "student" },
    collegeId: { type: String, unique: true, sparse: true },
    year: { type: Number }
  },
  { strict: false } // We just want to insert/delete, allowing the real schema to be more complex
);

// Mongoose model
const User = mongoose.model("User", userSchema);

const seedTestAccounts = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    // Delete any existing users with these emails to avoid duplicates
    const emails = ["admin@nec.edu.in", "teacher@nec.edu.in", "student@nec.edu.in"];
    const deleteResult = await User.deleteMany({ email: { $in: emails } });
    console.log(`Deleted ${deleteResult.deletedCount} old test accounts.`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const testUsers = [
      {
        name: "System Admin",
        email: "admin@nec.edu.in",
        password: hashedPassword,
        connectId: "CNCT-ADMIN-001",
        collegeId: "ADM001",
        emailVerified: true,
        role: "admin",
      },
      {
        name: "Teacher Test",
        email: "teacher@nec.edu.in",
        password: hashedPassword,
        connectId: "CNCT-TCHR-001",
        collegeId: "TCH001",
        emailVerified: true,
        role: "teacher",
      },
      {
        name: "Student Test",
        email: "student@nec.edu.in",
        password: hashedPassword,
        connectId: "CNCT-STU-001",
        collegeId: "STU001",
        emailVerified: true,
        role: "student",
        year: 2,
      },
    ];

    await User.insertMany(testUsers);
    console.log("Successfully seeded 3 test accounts with password: password123");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding test accounts:", err);
    process.exit(1);
  }
};

seedTestAccounts();
