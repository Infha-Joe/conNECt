import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import crypto from 'crypto';
import Department from './models/Department.js';
import { generateConnectId } from './utils/generateConnectId.js';

dotenv.config();

async function createUnverifiedUser() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const token = crypto.randomBytes(32).toString("hex");
  const dept = await Department.findOne();

  const user = await User.create({
    name: "Test Unverified",
    email: "unverified@nec.edu.in",
    collegeEmail: "unverified@nec.edu.in",
    password: "password123",
    role: "student",
    department: dept ? dept._id : undefined,
    year: 1,
    collegeId: "TESTUNVERIFIED",
    verificationToken: token,
    verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    connectId: await generateConnectId()
  });

  console.log(`Created user. Token: ${token}`);
  await mongoose.disconnect();
}
createUnverifiedUser();
