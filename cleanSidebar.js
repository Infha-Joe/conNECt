const fs = require('fs');
let code = fs.readFileSync('client/src/components/layout/LeftSidebar.jsx', 'utf8');

// The item is: { icon: FiCompass, label: "Explore", path: "/explore" },
code = code.replace(/\s*\{\s*icon:\s*FiCompass,\s*label:\s*"Explore",\s*path:\s*"\/explore"\s*\},/g, '');

fs.writeFileSync('client/src/components/layout/LeftSidebar.jsx', code);
console.log("Removed Explore from LeftSidebar.jsx");
