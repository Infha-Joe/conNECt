import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanDb = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const User = (await import('./models/User.js')).default;
  const res = await User.deleteMany({ collegeId: '24205052' });
  console.log('Deleted users:', res.deletedCount);
  process.exit();
};
cleanDb();
