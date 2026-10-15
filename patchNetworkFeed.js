import fs from 'fs';
let content = fs.readFileSync('client/src/pages/NetworkFeed.jsx', 'utf8');

// Align max-width to 760px to perfectly match UnifiedDashboard's post column
content = content.replace('max-w-[800px]', 'max-w-[760px]');

// Header & Search Alignment
const oldHeader = `{/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight">Campus Feed</h1>
          
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" size={16} />
            <input
              type="text"
              placeholder="Search posts, people, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border-2 border-border bg-background pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-border/80 font-medium"
            />
          </div>
        </div>`;

const newHeaderAndSearch = `{/* Header & Search */}
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight text-center mb-8 uppercase tracking-widest">Campus Feed</h1>
          
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" size={18} />
            <input
              type="text"
              placeholder="Search campus posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/70 bg-white shadow-sm pl-12 pr-4 py-3.5 text-base text-ink outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10 font-medium placeholder:text-ink-lighter"
            />
          </div>
        </div>

        {/* Create Post Action */}
        <div className="mb-8">
          <Link to="/create-post" className="flex items-center gap-4 bg-white border border-border hover:border-brand/50 hover:shadow-md p-4 rounded-xl transition-all w-full text-left group">
            <div className="shrink-0 bg-brand/10 text-brand rounded-full w-11 h-11 flex items-center justify-center font-bold text-xl group-hover:bg-brand group-hover:text-white transition-colors">
              +
            </div>
            <div className="flex-1 text-ink-light group-hover:text-ink font-medium text-base">
              Create a Post...
            </div>
          </Link>
        </div>`;

content = content.replace(oldHeader, newHeaderAndSearch);

// Also add a separator before the feed posts
content = content.replace('{/* Feed Posts */}', '<hr className="border-border my-6" />\n        {/* Feed Posts */}');

// The post map is currently missing onDelete, meaning if a user deletes a post in Campus Feed, it doesn't vanish immediately.
content = content.replace(
  '<PostCard key={post._id} post={post} />',
  '<PostCard key={post._id} post={post} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />'
);

fs.writeFileSync('client/src/pages/NetworkFeed.jsx', content);
console.log("Updated NetworkFeed.jsx");
