import fs from 'fs';

let code = fs.readFileSync('src/pages/UnifiedDashboard.jsx', 'utf8');

code = code.replace(/bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left/g, "card-standard mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left");

code = code.replace(/bg-ink\/5/g, "bg-border/30");
code = code.replace(/bg-white text-ink shadow-sm/g, "bg-surface text-ink border border-border shadow-sm");
code = code.replace(/text-slate-500 hover:bg-white\/50 hover:text-ink/g, "text-ink-light hover:bg-surface hover:text-ink");

code = code.replace(/flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-xl font-bold hover:bg-brand-dark transition-colors shadow-sm/g, "btn-primary flex items-center gap-2");
code = code.replace(/text-brand/g, "text-primary");
code = code.replace(/text-slate-600/g, "text-ink-light");

fs.writeFileSync('src/pages/UnifiedDashboard.jsx', code);
