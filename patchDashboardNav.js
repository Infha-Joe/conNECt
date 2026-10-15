import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// Remove the View Campus Feed button since it's now in the sidebar
content = content.replace(
  /\{\/\* Top Navigation Action \*\/\}[\s\S]*?<\/Link>\s*<\/div>/,
  ''
);

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Removed View Campus Feed link from Home");
