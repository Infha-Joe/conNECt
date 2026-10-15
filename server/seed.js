import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';
import Counter from './models/Counter.js';
import Project from './models/Project.js';
import Notification from './models/Notification.js';
import Connection from './models/Connection.js';
import HelpRequest from './models/HelpRequest.js';
import Post from './models/Post.js';
import Comment from './models/Comment.js';
import RecentAccess from './models/RecentAccess.js';
import { generateConnectId } from './utils/generateConnectId.js';

dotenv.config();

async function resetAndSeed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // PURGE ALL USERS AND DEPENDENT COLLECTIONS
  await User.deleteMany({});
  await Project.deleteMany({});
  await Notification.deleteMany({});
  await Connection.deleteMany({});
  await HelpRequest.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await RecentAccess.deleteMany({});
  
  // RESET COUNTER FOR CONNECT IDs
  await Counter.findOneAndUpdate(
    { _id: 'connectId' },
    { seq: 1 },
    { upsert: true }
  );

  const dept = await Department.findOne(); // Assume at least one exists
  const cseDept = dept ? dept._id : undefined;

  const users = [
    {
      name: "Student One",
      email: "student1@nec.edu.in",
      collegeEmail: "student1@nec.edu.in",
      password: "password123",
      role: "student",
      department: cseDept,
      year: 3,
      collegeId: "21CS001",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Student Two",
      email: "student2@nec.edu.in",
      collegeEmail: "student2@nec.edu.in",
      password: "password123",
      role: "student",
      department: cseDept,
      year: 2,
      collegeId: "22CS002",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Teacher One",
      email: "teacher1@nec.edu.in",
      collegeEmail: "teacher1@nec.edu.in",
      password: "password123",
      role: "teacher",
      department: cseDept,
      facultyId: "FAC001",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Teacher Two",
      email: "teacher2@nec.edu.in",
      collegeEmail: "teacher2@nec.edu.in",
      password: "password123",
      role: "teacher",
      department: cseDept,
      facultyId: "FAC002",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Alumni One",
      email: "alumni1@gmail.com",
      personalEmail: "alumni1@gmail.com",
      password: "password123",
      role: "alumni",
      department: cseDept,
      graduationYear: 2020,
      currentCompany: "Google",
      currentRole: "Software Engineer",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Alumni Two",
      email: "alumni2@gmail.com",
      personalEmail: "alumni2@gmail.com",
      password: "password123",
      role: "alumni",
      department: cseDept,
      graduationYear: 2019,
      currentCompany: "Microsoft",
      currentRole: "Product Manager",
      emailVerified: true,
      status: "active"
    },
    {
      name: "Admin One",
      email: "admin1@nec.edu.in",
      password: "password123",
      role: "admin",
      emailVerified: true,
      status: "active"
    }
  ];

  for (const u of users) {
    u.connectId = await generateConnectId();
    await User.create(u);
    console.log(`Created: ${u.name} | Role: ${u.role} | ID: ${u.connectId}`);
  }

  const finalCount = await User.countDocuments();
  console.log(`Final Database User Count: ${finalCount}`);

  await mongoose.disconnect();
}
resetAndSeed();
