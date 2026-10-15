import fs from 'fs';

let content = fs.readFileSync('client/src/components/layout/NotificationDropdown.jsx', 'utf8');

content = content.replace(/text-brand/g, 'text-primary');

fs.writeFileSync('client/src/components/layout/NotificationDropdown.jsx', content);
console.log("Fixed text-brand in NotificationDropdown.jsx");
