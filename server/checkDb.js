import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkDb = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = (await import('./models/User.js')).default;
  const users = await User.find({ email: /gmail\.com$/ });
  console.log('Gmail users:', users.map(u => ({ email: u.email, role: u.role, collegeId: u.collegeId })));
  process.exit();
};
checkDb();
