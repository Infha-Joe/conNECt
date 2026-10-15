const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const mongoose = require('mongoose');

const test = async () => {
  // 1. Register
  const regRes = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountType: 'student',
      name: 'E2EVerify',
      email: 'e2e@nec.edu.in',
      password: 'password123',
      department: 'IT',
      collegeId: '999',
      year: 4
    })
  });
  console.log("Register:", await regRes.json());
  
  // 2. Get Token from DB
  await mongoose.connect('mongodb://127.0.0.1:27017/conNECt');
  const User = mongoose.connection.collection('users');
  const user = await User.findOne({ email: 'e2e@nec.edu.in' });
  console.log("Token from DB:", user.verificationToken);
  
  // 3. Verify Email
  const verRes = await fetch(`http://localhost:5005/api/auth/verify-email/${user.verificationToken}`);
  console.log("Verify:", await verRes.json());
  
  // 4. Login
  const logRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'e2e@nec.edu.in', password: 'password123' })
  });
  console.log("Login:", (await logRes.json()).success ? "Success" : "Failed");
  
  // Cleanup
  await User.deleteOne({ email: 'e2e@nec.edu.in' });
  process.exit();
};
test();
