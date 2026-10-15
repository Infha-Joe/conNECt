import fs from 'fs';
let code = fs.readFileSync('src/components/ui/Card.jsx', 'utf8');
code = code.replace(
  "className={`bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-hover hover:border-brand/30' : ''} ${className}`}",
  "className={`bg-surface rounded-xl border border-border shadow-card transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-hover hover:border-primary/30' : ''} ${className}`}"
);
fs.writeFileSync('src/components/ui/Card.jsx', code);
