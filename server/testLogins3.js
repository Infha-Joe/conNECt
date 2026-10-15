const testAccounts = [
  { email: 'student1@nec.edu.in', password: 'password123', expectedRole: 'student' },
  { email: 'student2@nec.edu.in', password: 'password123', expectedRole: 'student' },
  { email: 'teacher1@nec.edu.in', password: 'password123', expectedRole: 'teacher' },
  { email: 'teacher2@nec.edu.in', password: 'password123', expectedRole: 'teacher' },
  { email: 'alumni1@gmail.com', password: 'password123', expectedRole: 'alumni' },
  { email: 'alumni2@gmail.com', password: 'password123', expectedRole: 'alumni' },
  { email: 'admin1@nec.edu.in', password: 'password123', expectedRole: 'admin' }
];

async function testLogins() {
  let passed = 0;
  for (const account of testAccounts) {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, password: account.password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.token && data.user && data.user.role === account.expectedRole) {
        console.log(`✓ [${account.email}] Login Success - Role: ${data.user.role} | ID: ${data.user.connectId || 'N/A'}`);
        passed++;
      } else {
        console.log(`✗ [${account.email}] Login Failed or Role Mismatch: ${data.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.log(`✗ [${account.email}] Request Failed: ${err.message}`);
    }
  }
  console.log(`\nResults: ${passed}/${testAccounts.length} passed.`);
}
testLogins();
