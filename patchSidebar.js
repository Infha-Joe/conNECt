import fs from 'fs';
let content = fs.readFileSync('client/src/components/layout/LeftSidebar.jsx', 'utf8');

// Insert Campus Feed for students
content = content.replace(
  '{ icon: FiHome, label: "Home", path: "/dashboard" },',
  '{ icon: FiHome, label: "Home", path: "/dashboard" },\n  { icon: FiCompass, label: "Campus Feed", path: "/network-feed" },'
);

// Insert Campus Feed for teachers (if not caught by global replace, let's just do it directly via regex for all occurrences)
content = fs.readFileSync('client/src/components/layout/LeftSidebar.jsx', 'utf8');
content = content.replace(
  /\{ icon: FiHome, label: "Home", path: "\/dashboard" \},/g,
  '{ icon: FiHome, label: "Home", path: "/dashboard" },\n  { icon: FiCompass, label: "Campus Feed", path: "/network-feed" },'
);

fs.writeFileSync('client/src/components/layout/LeftSidebar.jsx', content);
console.log("Updated LeftSidebar navigation");
