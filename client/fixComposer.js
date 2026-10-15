import fs from 'fs';

let code = fs.readFileSync('src/pages/UnifiedDashboard.jsx', 'utf8');

// Replace the button and the modal with an inline composer wrapper
const oldPostSectionRegex = /<div className="flex justify-end mb-4">[\s\S]*?<\/button>\s*<\/div>/;
code = code.replace(oldPostSectionRegex, `<div className="card-standard mb-6 p-0 overflow-hidden">\n                <CreatePost onPostCreated={handlePostCreated} />\n              </div>`);

// Remove the modal entirely
const modalRegex = /\{showCreatePost && \([\s\S]*?\}\)/;
code = code.replace(modalRegex, '');

// Also fix the activeTab styles to have an underline or highlight instead of background
code = code.replace(/className={`flex flex-1 items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-bold transition-all \$\{[\s\S]*?activeTab === "posts"[\s\S]*?\? "bg-surface text-ink border border-border shadow-sm"[\s\S]*?: "text-ink-light hover:bg-surface hover:text-ink"[\s\S]*?\}`}/, 
`className={\`flex flex-1 items-center justify-center gap-2.5 rounded-lg py-3 text-sm font-bold transition-all \${activeTab === "posts" ? "bg-surface text-primary border border-border shadow-sm" : "text-ink-light hover:bg-surface hover:text-ink"}\`}`);

code = code.replace(/bg-white rounded-2xl shadow-xl overflow-hidden/g, 'card-standard');

fs.writeFileSync('src/pages/UnifiedDashboard.jsx', code);
console.log("UnifiedDashboard.jsx updated to inline composer");
