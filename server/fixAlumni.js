import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Department from "./models/Department.js";

dotenv.config({ path: "./.env" });

const fixAlumni = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const email = "alumni@nec.edu.in";
    await User.deleteOne({ email });
    console.log("Deleted old malformed user.");

    const dept = await Department.findOne();

    // Pass plaintext password, let Mongoose pre-save hook hash it
    const alumni = await User.create({
      name: "Alumni Test User",
      email,
      password: "password123",
      collegeId: "ALUMNI999",
      department: dept._id,
      year: 4,
      role: "alumni",
      emailVerified: true,
      connectId: "CNCT-ALUMNI-999"
    });

    console.log(`Successfully re-created test alumni account: ${alumni.email} / password123`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};

fixAlumni();
