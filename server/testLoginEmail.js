import fetch from 'node-fetch';
const runTest = async () => {
  const loginRes = await fetch('http://localhost:5005/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '24205052@nec.edu.in', password: 'password123' })
  });
  const data = await loginRes.json();
  console.log("Login with email response:", data);
};
runTest();
