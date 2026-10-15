import fs from 'fs';
let content = fs.readFileSync('client/src/components/PostCard.jsx', 'utf8');

// Import api to get the baseURL dynamically
content = content.replace(
  'import { Link } from "react-router-dom";',
  'import { Link } from "react-router-dom";\nimport { useMemo } from "react";'
);

content = content.replace(
  'const PostCard = ({ post }) => {',
  `const PostCard = ({ post }) => {
  const serverUrl = useMemo(() => api.defaults.baseURL.replace('/api', ''), []);`
);

content = content.replace(
  /\`http:\/\/localhost:5000\$\{post\.mediaUrl\}\`/g,
  "`${serverUrl}${post.mediaUrl}`"
);

fs.writeFileSync('client/src/components/PostCard.jsx', content);
console.log("Updated PostCard to use dynamic server URL for media");
