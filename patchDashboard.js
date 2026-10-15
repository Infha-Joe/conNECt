import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// 1. Move View Campus Feed to the top
content = content.replace(
  '{/* Posts Section */}',
  `{/* Top Navigation Action */}
        <div className="flex justify-center mb-8">
          <Link to="/network-feed" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-brand text-white hover:bg-brand-dark font-bold tracking-wide rounded-full transition-colors shadow-sm">
            View Campus Feed &rarr;
          </Link>
        </div>

        {/* Posts Section */}`
);

// Remove the old View Campus Feed link
content = content.replace(
  /\{\/\* View Campus Feed Link \*\/\}[\s\S]*?<\/Link>\s*<\/div>/,
  ''
);

// 2. Change Create Post entry experience
content = content.replace(
  /<div className="mb-8 card-standard p-0 overflow-hidden border-border\/50 ring-1 ring-border shadow-sm">\s*<CreatePost onPostCreated=\{handlePostCreated\} \/>\s*<\/div>/,
  `<div className="mb-8">
              <Link to="/create-post" className="flex items-center gap-4 bg-white border border-border hover:border-brand/50 hover:shadow-md p-4 rounded-xl transition-all w-full text-left group">
                <Avatar name={user?.name} src={user?.profilePhoto} className="w-11 h-11 shrink-0" />
                <div className="flex-1 text-ink-light group-hover:text-ink font-medium text-base">
                  Share something with your campus...
                </div>
                <div className="shrink-0 bg-brand/10 text-brand rounded-full px-4 py-2 flex items-center gap-2 font-bold text-sm group-hover:bg-brand group-hover:text-white transition-colors">
                  <FiPlus /> Create a Post
                </div>
              </Link>
            </div>`
);

// Remove the unused import
content = content.replace('import CreatePost from "../components/CreatePost";\n', '');

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Updated UnifiedDashboard.jsx");
