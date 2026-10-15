import fs from 'fs';
let content = fs.readFileSync('.env', 'utf8');
content = content.replace('VITE_API_URL=http://localhost:5000/api', 'VITE_API_URL=http://localhost:5005/api');
fs.writeFileSync('.env', content);
console.log("Changed frontend API URL to 5005");
