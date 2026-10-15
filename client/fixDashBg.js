import fs from 'fs';
let code = fs.readFileSync('src/layouts/DashboardLayout.jsx', 'utf8');

// Sidebar -> bg-surface
code = code.replace(/<aside className="hidden lg:flex flex-col h-full bg-background border-r border-border z-20">/, '<aside className="hidden lg:flex flex-col w-[260px] h-full bg-surface border-r border-border z-20">');

// Main app area -> bg-background
code = code.replace(/<div className="flex flex-col h-full min-w-0 overflow-y-auto scrollbar-hide relative bg-surface" id="main-scroll">/, '<div className="flex flex-col h-full min-w-0 overflow-y-auto scrollbar-hide relative bg-background" id="main-scroll">');

// Top bar -> bg-surface
code = code.replace(/<header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-12 py-4 bg-surface border-b border-border">/, '<header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-3 bg-surface border-b border-border">');

fs.writeFileSync('src/layouts/DashboardLayout.jsx', code);
