import fs from 'fs';

let content = fs.readFileSync('client/src/layouts/DashboardLayout.jsx', 'utf8');

const searchBlock = `{/* Search - Left Aligned inside main content */}
          <div className="hidden lg:flex items-center w-full max-w-lg relative">
            <FiSearch className="absolute left-4 text-ink-light" size={18} />
            <input 
              type="text" 
              placeholder="Search people, posts, and projects..." 
              className="w-full bg-surface border border-border rounded shadow-sm pl-12 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-ink placeholder:text-ink-light"
            />
          </div>`;

const newSearchBlock = `{/* Search - Conditionally hidden on Home (/dashboard) */}
          {location.pathname !== '/dashboard' && (
            <div className="hidden lg:flex items-center w-full max-w-lg relative">
              <FiSearch className="absolute left-4 text-ink-light" size={18} />
              <input 
                type="text" 
                placeholder="Search people, posts, and projects..." 
                className="w-full bg-surface border border-border rounded shadow-sm pl-12 pr-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-ink placeholder:text-ink-light"
              />
            </div>
          )}`;

content = content.replace(searchBlock, newSearchBlock);
fs.writeFileSync('client/src/layouts/DashboardLayout.jsx', content);
console.log("Updated DashboardLayout.jsx");
