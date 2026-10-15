import fs from 'fs';
let content = fs.readFileSync('client/src/pages/NetworkFeed.jsx', 'utf8');

// Remove the Back to Home navigation
content = content.replace(
  /\{\/\* Back Navigation \*\/\}[\s\S]*?<\/Link>/,
  ''
);

fs.writeFileSync('client/src/pages/NetworkFeed.jsx', content);

let createContent = fs.readFileSync('client/src/pages/CreatePostPage.jsx', 'utf8');

// The back button should also go back to Campus Feed ideally, but let's change navigate("/dashboard") to navigate("/network-feed")
createContent = createContent.replace(
  'navigate("/dashboard");',
  'navigate("/network-feed");'
);
// And the Back button on Create Post page
createContent = createContent.replace(
  '<Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-background border border-border transition-colors">',
  '<button type="button" onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface hover:bg-background border border-border transition-colors">'
);
createContent = createContent.replace(
  /<\/Link>\s*<h2 className="text-xl font-bold text-ink tracking-tight">Create Post<\/h2>/,
  '</button>\n          <h2 className="text-xl font-bold text-ink tracking-tight">Create Post</h2>'
);

fs.writeFileSync('client/src/pages/CreatePostPage.jsx', createContent);

console.log("Removed Back to Home from Campus Feed and updated Create Post navigation");
