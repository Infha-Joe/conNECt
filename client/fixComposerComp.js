import fs from 'fs';
let code = fs.readFileSync('src/components/PostComposer.jsx', 'utf8');

code = code.replace(/className="rounded-xl border border-ink\/10 bg-white p-4 shadow-sm"/, 'className="p-5 bg-transparent"');
code = code.replace(/bg-ink\/5/g, 'bg-border/30');
code = code.replace(/bg-ink text-white hover:bg-ink\/90/g, 'btn-primary');
code = code.replace(/border border-ink\/10/g, 'border border-border');

fs.writeFileSync('src/components/PostComposer.jsx', code);
