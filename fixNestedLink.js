const fs = require('fs');

let code = fs.readFileSync('client/src/pages/MentorshipHub.jsx', 'utf8');

code = code.replace(
  '<Link key={p._id} to={`/projects/${p._id}`} className="flex flex-col justify-between rounded-xl border border-ink/10 bg-white p-5 transition hover:border-brand/50 hover:shadow-md">',
  '<div key={p._id} className="flex flex-col justify-between rounded-xl border border-ink/10 bg-white p-5 transition hover:border-brand/50 hover:shadow-md">\n                  <Link to={`/projects/${p._id}`} className="block flex-1">'
);

code = code.replace(
  '</div>\n                  </Link>\n                ))}',
  '</div>\n                </div>\n                ))}'
);

fs.writeFileSync('client/src/pages/MentorshipHub.jsx', code);
console.log("Fixed nested link");
