import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const runCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({ emailVerified: false });
    console.log(`Unverified users in DB: ${users.length}`);
    users.forEach(u => console.log(`- Name: ${u.name}, Email: ${u.email}, CollegeID: ${u.collegeId}`));
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};
runCheck();
