import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'email role');
    console.log("Users in DB:");
    users.forEach(u => console.log(`- ${u.email} (${u.role})`));
  } catch(e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}
check();
