import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Department from "./models/Department.js";

dotenv.config({ path: "./.env" });

const createAlumni = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "alumni@nec.edu.in";
    const existing = await User.findOne({ email });
    if (existing) {
      console.log(`User ${email} already exists!`);
      process.exit();
    }

    const dept = await Department.findOne();
    if (!dept) {
       console.log("No department found. Cannot create user.");
       process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const alumni = await User.create({
      name: "Alumni Test User",
      email,
      password: hashedPassword,
      collegeId: "ALUMNI999",
      department: dept._id,
      year: 4,
      role: "alumni",
      emailVerified: true,
      connectId: "CNCT-ALUMNI-999"
    });

    console.log(`Successfully created test alumni account: ${alumni.email} / password123`);
  } catch (err) {
    console.error("Error creating alumni account:", err);
  } finally {
    await mongoose.connection.close();
  }
};

createAlumni();
