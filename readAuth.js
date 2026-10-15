import fs from 'fs';
const content = fs.readFileSync('server/controllers/authController.js', 'utf8');
const lines = content.split('\n');
const startIndex = lines.findIndex(l => l.includes('export const registerManual'));
console.log(lines.slice(startIndex, startIndex + 80).join('\n'));
