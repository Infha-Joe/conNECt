import fs from 'fs';

let content = fs.readFileSync('client/src/components/PostCard.jsx', 'utf8');

// Replace the specific lines inside filteredConnections.map
content = content.replace(
  /filteredConnections\.map\(conn => \{\s+const friend = conn\.requester\._id === user\?\.id \? conn\.recipient : conn\.requester;/g,
  'filteredConnections.map(friend => {'
);
// In case the above didn't match because of user?._id
content = content.replace(
  /filteredConnections\.map\(conn => \{\s+const friend = conn\.requester\._id === user\?._id \? conn\.recipient : conn\.requester;/g,
  'filteredConnections.map(friend => {'
);

// Fix the bg-brand
content = content.replace(/bg-brand/g, 'bg-primary');
content = content.replace(/ring-brand/g, 'ring-primary');
content = content.replace(/border-brand/g, 'border-primary');

fs.writeFileSync('client/src/components/PostCard.jsx', content);
console.log("Patched PostCard mapping and CSS");
