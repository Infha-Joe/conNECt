import fs from 'fs';

let content = fs.readFileSync('client/src/pages/Messages.jsx', 'utf8');

// Replace outdated brand tailwind colors with primary
content = content.replace(/bg-brand/g, 'bg-primary');
content = content.replace(/text-brand/g, 'text-primary');

fs.writeFileSync('client/src/pages/Messages.jsx', content);
console.log("Fixed invisible message CSS bug");
