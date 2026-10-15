import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Login.jsx', 'utf8');

content = content.replace(
  'setError(err.response?.data?.message || "Invalid credentials.");',
  'setError(err.response?.data?.message || (err.message === "Network Error" ? "Network error: Cannot reach server." : "Server error or invalid credentials."));'
);

fs.writeFileSync('client/src/pages/Login.jsx', content);
console.log("Improved error handling in Login.jsx");
