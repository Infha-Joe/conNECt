const fs = require('fs');
let code = fs.readFileSync('client/src/pages/MentorshipHub.jsx', 'utf8');

code = code.replace(
  '<div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">',
  '</Link>\n                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">'
);

fs.writeFileSync('client/src/pages/MentorshipHub.jsx', code);
console.log("Added missing closing Link tag");
