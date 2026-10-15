import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// Fix handlePostCreated
content = content.replace(
  /const handlePostCreated = \(newPost\) => \{\s*setPosts\(\[newPost, \.\.\.posts\]\);\s*setShowComposer\(false\);\s*\};/g,
  `const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };`
);

// Fix layout from grid to flex-col and max-width 760px
content = content.replace(
  /className="w-full flex flex-col"/g,
  `className="w-full flex flex-col max-w-[760px] mx-auto"`
);

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">/g,
  `<div className="flex flex-col gap-6 w-full">`
);

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Patched UnifiedDashboard.jsx");
