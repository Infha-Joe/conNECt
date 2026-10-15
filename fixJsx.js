const fs = require('fs');
let code = fs.readFileSync('client/src/pages/MentorshipHub.jsx', 'utf8');

code = code.replace(
`                  </div>
                  </Link>
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>
                    {p.mentor ? \`Mentor: \${p.mentor.name || 'Assigned'}\` : 'No active mentor'}
                    </span>
                    {activeMentorships.find(m => m.project?._id === p._id) && (
                      <Link onClick={(e) => e.stopPropagation()} to={\`/mentorship/\${activeMentorships.find(m => m.project?._id === p._id)._id}\`} className="font-bold text-brand hover:underline">
                        [Open Workspace]
                      </Link>
                    )}
                  </div>
                </Link>
              ))}
            </div>`,
`                  </div>
                  </Link>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
                    <span>
                    {p.mentor ? \`Mentor: \${p.mentor.name || 'Assigned'}\` : 'No active mentor'}
                    </span>
                    {activeMentorships.find(m => m.project?._id === p._id) && (
                      <Link onClick={(e) => e.stopPropagation()} to={\`/mentorship/\${activeMentorships.find(m => m.project?._id === p._id)._id}\`} className="font-bold text-brand hover:underline">
                        [Open Workspace]
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>`
);

fs.writeFileSync('client/src/pages/MentorshipHub.jsx', code);
console.log("Fixed JSX syntax perfectly");
