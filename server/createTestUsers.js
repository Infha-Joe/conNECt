import mongoose from "mongoose";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/conNECt";

const createUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    const student = new User({
      name: "Test Student Two",
      email: "student2@nec.edu.in",
      password: "password123",
      role: "student",
      collegeId: "STU" + Date.now(),
      status: "active"
    });
    
    const teacher = new User({
      name: "Test Teacher Two",
      email: "teacher2@nec.edu.in",
      password: "password123",
      role: "teacher",
      facultyId: "FAC" + Date.now(),
      status: "active"
    });

    await student.save();
    console.log("Created Student:", student.email);

    await teacher.save();
    console.log("Created Teacher:", teacher.email);

    process.exit(0);
  } catch (err) {
    console.error("Error creating users:", err);
    process.exit(1);
  }
};

createUsers();
