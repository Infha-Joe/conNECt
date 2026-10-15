import fetch from 'node-fetch';

const test = async () => {
  const res = await fetch('http://localhost:5005/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accountType: 'student',
      name: 'VerifyTest',
      email: 'verify6@nec.edu.in',
      password: 'password123',
      department: 'IT',
      collegeId: '106',
      year: 2
    })
  });
  console.log(await res.json());
  process.exit();
};
test();
