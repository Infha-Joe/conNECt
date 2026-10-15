import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

async function resetLegacy() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const emails = ['student@nec.edu.in', 'teacher@nec.edu.in', 'alumni@nec.edu.in'];
    for (const email of emails) {
       await User.deleteOne({ email });
       await User.create({
          name: "Legacy User",
          email: email,
          password: "password123",
          role: email.split('@')[0],
          emailVerified: true
       });
       console.log(`Reset ${email}`);
    }
  } catch(e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
}
resetLegacy();
