const fs = require('fs');
const path = 'client/src/components/layout/LeftSidebar.jsx';
let code = fs.readFileSync(path, 'utf8');

// Remove the "My Classes" line from teacherNavItems
code = code.replace(
  /\s*{\s*icon:\s*FiBookOpen,\s*label:\s*"My Classes",\s*path:\s*"\/academic"\s*},/,
  ''
);

fs.writeFileSync(path, code);
console.log('Removed My Classes from sidebar.');
