import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// Remove the state variable
content = content.replace(
  'const [showComposer, setShowComposer] = useState(false);',
  ''
);

// Remove the toggle button and replace the composer block
content = content.replace(
  /<div className="flex items-center gap-4 mb-6">[\s\S]*?<\/div>\s*\{showComposer && \(\s*<div className="mb-8 card-standard p-0 overflow-hidden border-brand\/30 ring-2 ring-brand\/5">\s*<CreatePost onPostCreated=\{handlePostCreated\} \/>\s*<\/div>\s*\)\}/,
  `<div className="flex items-center gap-4 mb-6">
              <h2 className="text-sm font-bold text-ink tracking-widest uppercase">My Posts</h2>
            </div>

            <div className="mb-8 card-standard p-0 overflow-hidden border-border/50 ring-1 ring-border shadow-sm">
              <CreatePost onPostCreated={handlePostCreated} />
            </div>`
);

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Updated UnifiedDashboard to always show composer");
