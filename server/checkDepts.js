import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
 
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Department = (await import('./models/Department.js')).default;
    const depts = await Department.find();
    console.log("Departments found:", depts.length);
    console.log(depts);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};
run();
