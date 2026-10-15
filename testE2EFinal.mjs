const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
import mongoose from 'mongoose';

const test = async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
  const User = mongoose.connection.collection('users');
  await User.deleteOne({ email: 'e2efinal@nec.edu.in' });

  // 1. Register
  console.log("-> Registering");
  const regRes = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountType: 'student', name: 'E2EFinal', email: 'e2efinal@nec.edu.in',
      password: 'password123', department: 'IT', collegeId: '998', year: 4
    })
  });
  console.log(await regRes.json());
  
  // 2. Get Token from DB
  const user = await User.findOne({ email: 'e2efinal@nec.edu.in' });
  const token = user.verificationToken;
  
  // 3. Verify
  console.log("-> Verifying");
  const verRes = await fetch(`http://localhost:5005/api/auth/verify-email/${token}`);
  console.log(await verRes.json());
  
  // 4. Verify AGAIN (Should be "Already verified")
  console.log("-> Verifying again");
  const verRes2 = await fetch(`http://localhost:5005/api/auth/verify-email/${token}`);
  console.log(await verRes2.json());
  
  // 5. Verify INVALID
  console.log("-> Verifying invalid");
  const verRes3 = await fetch(`http://localhost:5005/api/auth/verify-email/fake123`);
  console.log(await verRes3.json());

  // 6. Login
  console.log("-> Logging in");
  const logRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'e2efinal@nec.edu.in', password: 'password123' })
  });
  const loginData = await logRes.json();
  console.log("Login success:", loginData.success);
  
  await mongoose.disconnect();
  process.exit();
};
test();
