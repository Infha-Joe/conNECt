import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

const testHash = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    const user = await User.findOne({ collegeId: '24205052' }).select('+password');
    if (user) {
      const match = await bcrypt.compare('password123', user.password);
      console.log('Matches "password123":', match);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
};
testHash();
