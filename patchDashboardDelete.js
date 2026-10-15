import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

content = content.replace(
  '<PostCard post={post} />',
  '<PostCard post={post} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />'
);

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);

try {
  let feedContent = fs.readFileSync('client/src/pages/NetworkFeed.jsx', 'utf8');
  feedContent = feedContent.replace(
    '<PostCard post={post} />',
    '<PostCard post={post} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />'
  );
  fs.writeFileSync('client/src/pages/NetworkFeed.jsx', feedContent);
} catch(e) {}

console.log("Patched UnifiedDashboard and NetworkFeed to handle onDelete");
