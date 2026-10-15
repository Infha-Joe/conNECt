import fetch from 'node-fetch';

const test = async () => {
  const regRes = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountType: 'student', name: 'Validator', email: 'valid2@nec.edu.in', password: 'password123', department: 'IT', collegeId: '102' })
  });
  
  // Force email verification in MongoDB
  const mongoose = await import('mongoose');
  await mongoose.default.connect('mongodb://127.0.0.1:27017/conNECt');
  const User = (await import('./models/User.js')).default;
  await User.updateOne({ email: 'valid2@nec.edu.in' }, { $set: { emailVerified: true } });

  const loginRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'valid2@nec.edu.in', password: 'password123' })
  });
  const { token } = await loginRes.json();

  const runTest = async (name, payload) => {
    const postRes = await fetch('http://localhost:5005/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    console.log(`TEST: ${name} -> Status: ${postRes.status}`);
    if (postRes.status >= 400) {
      console.log(await postRes.json());
    }
  };

  await runTest('Text only', { content: 'Hello conNECt' });
  await runTest('Media only', { mediaUrl: 'http://test.com/img.png', mediaType: 'image' });
  await runTest('Text + Media', { content: 'Look at this', mediaUrl: 'http://test.com/vid.mp4', mediaType: 'video' });
  await runTest('Empty Post', {});
  
  await User.deleteOne({ email: 'valid2@nec.edu.in' });
  process.exit();
};
test();
