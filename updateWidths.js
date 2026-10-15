import fs from 'fs';
const files = ['client/src/pages/UnifiedDashboard.jsx', 'client/src/pages/NetworkFeed.jsx', 'client/src/pages/CreatePostPage.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/max-w-\[760px\]/g, 'max-w-[900px]');
  fs.writeFileSync(file, content);
});

console.log("Updated max-width to 900px to better utilize empty space");
