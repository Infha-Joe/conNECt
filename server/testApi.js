import fetch from 'node-fetch';

const test = async () => {
  // Login first
  const loginRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '24205053@nec.edu.in', password: 'password123' })
  });
  
  const loginData = await loginRes.json();
  if(!loginData.token) {
    // If login fails, let's create a user
    const regRes = await fetch('http://localhost:5005/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountType: 'student', name: 'T', email: 't@nec.edu.in', password: 'password123', department: 'IT', collegeId: '123' })
    });
    // ... we don't have email verification skipped, so it might fail
  }
}
test();
