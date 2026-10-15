import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function testAccountsDirectly() {
  await mongoose.connect(process.env.MONGO_URI);
  const emails = [
    'student1@nec.edu.in', 'student2@nec.edu.in',
    'teacher1@nec.edu.in', 'teacher2@nec.edu.in',
    'alumni1@gmail.com', 'alumni2@gmail.com',
    'admin1@nec.edu.in'
  ];

  let passed = 0;
  for (const email of emails) {
    const user = await User.findOne({ email }).select('+password');
    if (user) {
      const isMatch = await bcrypt.compare('password123', user.password);
      if (isMatch) {
         console.log(`✓ [${email}] Login Success - Role: ${user.role} | ID: ${user.connectId || 'N/A'}`);
         passed++;
      } else {
         console.log(`✗ [${email}] Password Mismatch! Hash: ${user.password}`);
      }
    } else {
       console.log(`✗ [${email}] User not found in DB!`);
    }
  }
  console.log(`\nResults: ${passed}/7 passed.`);
  await mongoose.disconnect();
}
testAccountsDirectly();
