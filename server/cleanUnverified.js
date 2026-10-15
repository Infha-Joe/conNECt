import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const cleanUnverified = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.deleteMany({ emailVerified: false });
    console.log(`Successfully deleted ${result.deletedCount} unverified account(s).`);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};
cleanUnverified();
