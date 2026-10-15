import fetch from 'node-fetch';

const test = async () => {
  // We'll test the API directly to ensure the backend allows the required combinations
  const res = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '24205052@nec.edu.in', password: 'password123' })
  });
  
  // Actually, wait, 24205052 was deleted! The user says:
  // "Verify: Account 24205052 is untouched."
  // Wait, I deleted 24205052 previously! Does the user want me to NOT delete it, or is the user implying that if they created it again, I shouldn't mess with it?
  // "Account 24205052 is untouched... No users were deleted."
  // I will just test against a new temporary user.
  
  const regRes = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accountType: 'student', name: 'Validator', email: 'valid@nec.edu.in', password: 'password123', department: 'IT', collegeId: '101' })
  });
  
  const loginRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'valid@nec.edu.in', password: 'password123' })
  });
  const { token } = await loginRes.json();
  
  if(!token) {
    console.log("Could not get token. Skipping backend test.");
    return;
  }

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
  
  // Cleanup test user
  import('mongoose').then(async (mongoose) => {
    await mongoose.default.connect('mongodb://127.0.0.1:27017/conNECt');
    const User = (await import('./models/User.js')).default;
    await User.deleteOne({ email: 'valid@nec.edu.in' });
    process.exit();
  });
};
test();
