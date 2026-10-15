import fs from 'fs';
let code = fs.readFileSync('src/components/ui/EmptyState.jsx', 'utf8');

code = code.replace(/text-slate-500\/50/g, 'text-ink-lighter');
code = code.replace(/text-slate-500/g, 'text-ink-light');
code = code.replace(/border border-dashed border-slate-200 rounded-xl bg-slate-50\/50/g, 'border border-dashed border-border rounded-xl bg-background');
code = code.replace(/bg-white border border-slate-200/g, 'bg-surface border border-border');

fs.writeFileSync('src/components/ui/EmptyState.jsx', code);
