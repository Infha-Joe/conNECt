import fs from 'fs';

let content = fs.readFileSync('src/pages/Login.jsx', 'utf8');

// Replace deprecated slate/brand colors with the new theme colors
content = content.replace(/bg-slate-100 bg-\[url\('\/campus\.jpg'\)\] bg-cover bg-center bg-no-repeat relative/g, 'bg-background relative');
content = content.replace(/bg-slate-900\/65 backdrop-blur-\[2px\]/g, 'bg-background/40 backdrop-blur-sm');
content = content.replace(/bg-white\/95/g, 'bg-surface');
content = content.replace(/text-brand/g, 'text-primary');
content = content.replace(/focus:border-brand/g, 'focus:border-primary');
content = content.replace(/focus:ring-brand/g, 'focus:ring-primary');
content = content.replace(/text-slate-500/g, 'text-ink-light');
content = content.replace(/text-slate-700/g, 'text-primary-dark');
content = content.replace(/text-slate-400/g, 'text-border');
content = content.replace(/border-slate-200/g, 'border-border');
content = content.replace(/border-slate-100/g, 'border-border/50');
content = content.replace(/bg-red-50/g, 'bg-danger/10');
content = content.replace(/text-red-700/g, 'text-danger');
content = content.replace(/border-red-100/g, 'border-danger/20');
content = content.replace(/text-ink/g, 'text-primary-dark');

// Fix the conNECt logo color mapping
content = content.replace(
  /<p className="font-display text-3xl font-bold tracking-tight text-primary-dark">\s*con<span className="text-primary">NEC<\/span>t\s*<\/p>/,
  `<p className="font-display text-3xl font-bold tracking-tight text-primary-dark">con<span className="text-primary">NEC</span>t</p>`
);

fs.writeFileSync('src/pages/Login.jsx', content);
