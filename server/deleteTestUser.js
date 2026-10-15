import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    const res = await User.deleteMany({ collegeId: '24205052' });
    console.log('Successfully deleted ' + res.deletedCount + ' user(s) with collegeId 24205052');
  } catch (err) {
    console.error('Error during deletion:', err);
  } finally {
    process.exit();
  }
};
cleanDb();
