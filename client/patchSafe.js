import fs from 'fs';

let content = fs.readFileSync('src/pages/Register.jsx', 'utf8');

// 1. Fix inputStyles
content = content.replace(
  /const inputStyles = "w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-ink outline-none transition-all focus:border-brand focus:bg-white focus:ring-1 focus:ring-brand";/,
  'const inputStyles = "w-full rounded-xl border-2 border-border bg-background px-4 py-3 text-sm text-primary-dark outline-none transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary placeholder:text-border/80 font-medium shadow-sm";'
);

// 2. Fix labelStyles
content = content.replace(
  /const labelStyles = "mb-1.5 block text-sm font-semibold text-ink";/,
  'const labelStyles = "mb-1.5 block text-xs font-bold text-primary-dark uppercase tracking-wider";'
);

// 3. Fix colors globally
content = content.replace(/bg-slate-50/g, 'bg-background');
content = content.replace(/bg-slate-100/g, 'bg-background');
content = content.replace(/border-slate-200/g, 'border-border');
content = content.replace(/border-slate-100/g, 'border-border/50');
content = content.replace(/text-slate-500/g, 'text-ink-light');
content = content.replace(/text-slate-400/g, 'text-border');
content = content.replace(/text-slate-700/g, 'text-primary-dark');
content = content.replace(/text-ink/g, 'text-primary-dark');
content = content.replace(/text-brand/g, 'text-primary');
content = content.replace(/bg-brand/g, 'bg-primary');
content = content.replace(/bg-brand-hover/g, 'bg-primary-hover');
content = content.replace(/bg-red-50/g, 'bg-danger/10');
content = content.replace(/text-red-700/g, 'text-danger');

// 4. Logo fix
content = content.replace(
  /<p className="font-display text-4xl font-bold tracking-tight text-primary-dark">\s*con<span className="text-primary">NEC<\/span>t\s*<\/p>/g,
  `<p className="font-display text-4xl font-bold tracking-tight text-primary-dark">con<span className="text-primary">NEC</span>t</p>`
);

// 5. Wrap the container in Card style (since they didn't use Card)
content = content.replace(
  /<div className="w-full max-w-lg p-6">/g,
  `<div className="w-full max-w-lg p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(23,59,58,0.15)] border border-border bg-surface rounded-2xl relative z-10">`
);

// Add the background abstract blob
content = content.replace(
  /<div className="flex min-h-screen items-center justify-center bg-background font-sans py-12">/g,
  `<div className="flex min-h-screen items-center justify-center bg-background relative font-sans p-4 py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light/40 rounded-full blur-[100px] pointer-events-none"></div>`
);


fs.writeFileSync('src/pages/Register.jsx', content);
