import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config({ path: "./.env" });

const verifyUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "24205052@nec.edu.in";
    const result = await User.findOneAndUpdate(
      { email },
      { isVerified: true, verifyEmailToken: undefined, verifyEmailExpire: undefined },
      { new: true }
    );
    if (result) {
      console.log(`User ${email} has been manually verified.`);
    } else {
      console.log(`User ${email} not found.`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
  }
};
verifyUser();
