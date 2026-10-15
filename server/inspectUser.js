import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const checkDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    const user = await User.findOne({ collegeId: '24205052' }).select('+password');
    if (!user) {
      console.log('User 24205052 not found.');
    } else {
      console.log('User found!');
      console.log('Password hash:', user.password ? user.password.substring(0, 15) + '...' : 'UNDEFINED OR NULL');
      console.log('emailVerified:', user.emailVerified);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
};
checkDb();
