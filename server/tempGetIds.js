import mongoose from 'mongoose';
import User from './models/User.js';

async function fetchIds() {
  await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
  const users = await User.find({}, 'email role _id connectId').lean();
  console.log(users.map(u => `${u.role.toUpperCase()}: ${u.email} | MongoDB ID: ${u._id} | ConnectID: ${u.connectId}`).join('\n'));
  process.exit(0);
}
fetchIds();
