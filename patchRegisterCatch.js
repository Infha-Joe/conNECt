import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Register.jsx', 'utf8');

content = content.replace(
  '.catch(() => setDepartments([]));',
  '.catch((err) => { console.error("Failed to load departments:", err); setDepartments([]); });'
);

fs.writeFileSync('client/src/pages/Register.jsx', content);
console.log("Added console error log for departments fetch failure in Register.jsx");
