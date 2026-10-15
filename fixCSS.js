import fs from 'fs';

let content = fs.readFileSync('client/src/components/ConnectButton.jsx', 'utf8');

content = content.replace(/bg-brand-dark/g, 'bg-primary-dark');
content = content.replace(/bg-brand/g, 'bg-primary');

fs.writeFileSync('client/src/components/ConnectButton.jsx', content);
console.log("Fixed ConnectButton CSS classes");
