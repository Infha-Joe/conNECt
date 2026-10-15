import fs from 'fs';
let code = fs.readFileSync('src/components/layout/NotificationDropdown.jsx', 'utf8');

code = code.replace(/isOpen \? "bg-slate-50 border-brand\/20 text-brand" : "bg-white border-slate-200 text-slate-600 hover:text-brand hover:bg-slate-50"/g, 'isOpen ? "bg-background border-primary/20 text-primary" : "bg-surface border-border text-ink-light hover:text-primary hover:bg-background"');
code = code.replace(/bg-white shadow-\[0_10px_40px_-10px_rgba\(0,0,0,0\.15\)\] ring-1 ring-black ring-opacity-5/g, 'bg-surface shadow-card border border-border');
code = code.replace(/border-slate-100 bg-slate-50\/50/g, 'border-border bg-background/50');
code = code.replace(/notif\.isRead \? "bg-white cursor-default" : "bg-brand\/5 cursor-pointer"/g, 'notif.isRead ? "bg-surface cursor-default" : "bg-primary/5 cursor-pointer"');
code = code.replace(/bg-white p-1\.5 rounded-full border border-slate-200/g, 'bg-surface p-1.5 rounded-full border border-border');
code = code.replace(/hover:bg-white border border-transparent hover:border-slate-200 flex items-center justify-center text-brand/g, 'hover:bg-surface border border-transparent hover:border-border flex items-center justify-center text-primary');
code = code.replace(/text-slate-500 hover:text-brand/g, 'text-ink-light hover:text-primary');
code = code.replace(/bg-slate-50 text-slate-500/g, 'bg-background text-ink-light');
code = code.replace(/bg-brand text-white/g, 'bg-primary text-white');

fs.writeFileSync('src/components/layout/NotificationDropdown.jsx', code);
