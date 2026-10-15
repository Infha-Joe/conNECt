const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import mongoose from 'mongoose';

const recreate = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
  const User = mongoose.connection.collection('users');
  await User.deleteOne({ collegeId: '24205052' });

  console.log("-> Recreating 24205052");
  const regRes = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountType: 'student', name: 'Test User', email: 'test5052@nec.edu.in',
      password: 'password123', department: 'IT', collegeId: '24205052', year: 2
    })
  });
  const regData = await regRes.json();
  console.log("Registration:", regData);
  
  const user = await User.findOne({ collegeId: '24205052' });
  if(user) {
      await fetch(`http://localhost:5005/api/auth/verify-email/${user.verificationToken}`);
      console.log("Verified!");
  }
  
  await mongoose.disconnect();
  process.exit();
};
recreate();
