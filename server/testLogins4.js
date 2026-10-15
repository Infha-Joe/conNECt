const testAccounts = [
  { email: 'student1@nec.edu.in', password: 'password123', expectedRole: 'student' }
];

async function testLogins() {
  for (const account of testAccounts) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password })
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
}
testLogins();
