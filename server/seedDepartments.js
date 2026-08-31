import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Department from "./models/Department.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const departments = [
  { name: "Information Technology (IT)", code: "IT" },
  { name: "Electrical and Electronics Engineering (EEE)", code: "EEE" },
  { name: "Electronics and Communication Engineering (ECE)", code: "ECE" },
  { name: "Computer Science and Engineering (CSE)", code: "CSE" },
  { name: "Mechanical Engineering", code: "MECH" },
  { name: "Artificial Intelligence (AI)", code: "AI" }
];

const seedDepartments = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/connect");
    
    // Upsert departments
    for (const dept of departments) {
      await Department.findOneAndUpdate(
        { code: dept.code },
        { name: dept.name, code: dept.code },
        { upsert: true, new: true }
      );
    }
    
    console.log("Departments seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding departments:", error);
    process.exit(1);
  }
};

seedDepartments();
