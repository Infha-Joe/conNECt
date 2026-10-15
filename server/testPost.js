import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@nec.edu.in', password: 'password123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  console.log('Got token');

  const postRes = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content: 'Test post content' })
  });
  const postData = await postRes.json();
  console.log('Post Status:', postRes.status);
  console.log('Post Data:', postData);
};
test();
