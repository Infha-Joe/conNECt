import fs from 'fs';
let code = fs.readFileSync('src/layouts/DashboardLayout.jsx', 'utf8');

// The Logo container
code = code.replace(/<div className="p-6 pb-6 flex items-center gap-3">/, '<div className="px-6 py-6 flex items-center gap-3">');

// The Sidebar wrapper
code = code.replace(/<div className="flex-1 overflow-y-auto scrollbar-hide px-4">/, '<div className="flex-1 overflow-y-auto scrollbar-hide">');

fs.writeFileSync('src/layouts/DashboardLayout.jsx', code);
