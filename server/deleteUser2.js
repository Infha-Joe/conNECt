import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const runDelete = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "24205052@nec.edu.in";
    const result = await User.deleteOne({ email });
    if (result.deletedCount === 1) {
      console.log(`Successfully deleted user with email ${email}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};
runDelete();
