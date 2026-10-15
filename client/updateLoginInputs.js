import fs from 'fs';
let content = fs.readFileSync('src/pages/Login.jsx', 'utf8');

content = content.replace(
  /w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary shadow-sm/g,
  "w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm"
);

fs.writeFileSync('src/pages/Login.jsx', content);
