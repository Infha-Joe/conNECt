import mongoose from "mongoose";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/conNECt";

const verifyUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await User.updateMany(
      { email: { $in: ["student2@nec.edu.in", "teacher2@nec.edu.in"] } },
      { $set: { emailVerified: true } }
    );
    
    console.log("Users successfully verified!");

    process.exit(0);
  } catch (err) {
    console.error("Error verifying users:", err);
    process.exit(1);
  }
};

verifyUsers();
