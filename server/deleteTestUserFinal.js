import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const cleanDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const User = (await import('./models/User.js')).default;
    const res = await User.deleteMany({
      $or: [
        { collegeId: '24205052' },
        { email: '24205052@nec.edu.in' }
      ]
    });
    console.log('Successfully deleted ' + res.deletedCount + ' user(s) matching 24205052');
  } catch (err) {
    console.error('Error during deletion:', err);
  } finally {
    process.exit();
  }
};
cleanDb();
