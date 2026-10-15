import fs from 'fs';
let code = fs.readFileSync('src/layouts/DashboardLayout.jsx', 'utf8');

code = code.replace(/<main className="flex-1 px-4 lg:px-8 py-6 w-full max-w-\[1200px\] mx-auto">[\s\S]*?\{children\}[\s\S]*?<\/main>/, `<main className="flex-1 px-4 lg:px-8 py-6 w-full max-w-5xl mx-auto">\n          {children}\n        </main>`);

fs.writeFileSync('src/layouts/DashboardLayout.jsx', code);
