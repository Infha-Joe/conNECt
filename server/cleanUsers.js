import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.js";
import Post from "./models/Post.js";
import Notification from "./models/Notification.js";
import Message from "./models/Message.js";

const clean = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for auth cleanup");

    // Find one valid user for each role
    const student = await User.findOne({ role: "student" }).sort({ createdAt: 1 });
    const teacher = await User.findOne({ role: "teacher" }).sort({ createdAt: 1 });
    const alumni = await User.findOne({ role: "alumni" }).sort({ createdAt: 1 });
    const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 });

    const keepIds = [];
    if (student) { keepIds.push(student._id); console.log("Keeping student:", student.email); }
    if (teacher) { keepIds.push(teacher._id); console.log("Keeping teacher:", teacher.email); }
    if (alumni) { keepIds.push(alumni._id); console.log("Keeping alumni:", alumni.email); }
    if (admin) { keepIds.push(admin._id); console.log("Keeping admin:", admin.email); }

    if (keepIds.length === 0) {
      console.log("No users found to keep. Not deleting anything.");
      process.exit(0);
    }

    // Delete all other users
    const deleteResult = await User.deleteMany({ _id: { $nin: keepIds } });
    console.log(`Deleted ${deleteResult.deletedCount} unnecessary users.`);

    // Delete orphaned
    try { await Post.deleteMany({ author: { $nin: keepIds } }); } catch (e) {}
    try { await Notification.deleteMany({ user: { $nin: keepIds } }); } catch (e) {}
    try { await Message.deleteMany({ sender: { $nin: keepIds } }); } catch (e) {}

    console.log("Cleanup complete!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

clean();
