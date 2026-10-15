const fs = require('fs');

let code = fs.readFileSync('client/src/pages/MentorshipHub.jsx', 'utf8');

// Inject the title at the top of DashboardLayout content
code = code.replace(
  '<div className="mx-auto max-w-6xl space-y-12">',
  '<div className="mx-auto max-w-6xl space-y-12">\n\n        <div className="border-b border-slate-200 pb-5 mb-8">\n          <h1 className="text-3xl font-black text-ink tracking-tight uppercase">Projects &amp; Mentorship</h1>\n          <p className="text-slate-500 mt-2">Manage your projects, request mentorship, and collaborate in active workspaces.</p>\n        </div>\n'
);

// Add the [Open Workspace] button to the Project card
code = code.replace(
  /\{p\.mentor \? `Mentored by \$\{p\.mentor\.name \|\| 'Faculty'\}` : 'No active mentor'\}/g,
  "{p.mentor ? `Mentor: ${p.mentor.name || 'Assigned'}` : 'No active mentor'}\n                    </span>\n                    {activeMentorships.find(m => m.project?._id === p._id) && (\n                      <Link onClick={(e) => e.stopPropagation()} to={`/mentorship/${activeMentorships.find(m => m.project?._id === p._id)._id}`} className=\"font-bold text-brand hover:underline\">\n                        [Open Workspace]\n                      </Link>\n                    )}"
);

code = code.replace(
  /<div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">/g,
  '<div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">\n                    <span>'
);

fs.writeFileSync('client/src/pages/MentorshipHub.jsx', code);
console.log("Updated MentorshipHub.jsx with UI requirements");
