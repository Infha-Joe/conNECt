import fs from 'fs';
let content = fs.readFileSync('.env', 'utf8');
content = content.replace('PORT=5000', 'PORT=5005');
fs.writeFileSync('.env', content);
console.log("Changed backend PORT to 5005");
