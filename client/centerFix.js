import fs from 'fs';
let content = fs.readFileSync('src/pages/UnifiedDashboard.jsx', 'utf8');
content = content.replace('className="flex justify-center sm:justify-start lg:justify-center gap-4 sm:gap-12 border-b border-border mb-10 w-full overflow-x-auto scrollbar-hide"', 'className="flex justify-center gap-8 md:gap-16 border-b border-border mb-10 w-full overflow-x-auto scrollbar-hide"');
fs.writeFileSync('src/pages/UnifiedDashboard.jsx', content);
