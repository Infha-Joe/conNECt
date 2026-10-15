import fs from 'fs';
const files = ['client/src/pages/UnifiedDashboard.jsx', 'client/src/pages/NetworkFeed.jsx', 'client/src/pages/CreatePostPage.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-brand/g, 'bg-primary');
  content = content.replace(/text-brand/g, 'text-primary');
  content = content.replace(/ring-brand/g, 'ring-primary');
  content = content.replace(/border-brand/g, 'border-primary');
  fs.writeFileSync(file, content);
});

// Also fix Button.jsx to accurately show custom disabled state instead of just opacity
let btnContent = fs.readFileSync('client/src/components/ui/Button.jsx', 'utf8');
btnContent = btnContent.replace(
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'disabled:bg-primary-light disabled:text-primary-dark disabled:opacity-100 disabled:cursor-not-allowed'
);
// And let's not override the children with "Loading..." if the consumer passes `{isLoading ? "Publishing..." : "Post"}`
btnContent = btnContent.replace(
  '{isLoading ? "Loading..." : children}',
  '{children}'
);
fs.writeFileSync('client/src/components/ui/Button.jsx', btnContent);
console.log("Fixed button colors and disabled states");
