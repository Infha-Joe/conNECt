import mongoose from 'mongoose';
const test = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
  const User = (await import('./models/User.js')).default;
  const user = await User.findOne({ email: 'verify4@nec.edu.in' });
  console.log("Token:", user.verificationToken);
  process.exit();
};
test();
