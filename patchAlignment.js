import fs from 'fs';
let content = fs.readFileSync('client/src/pages/NetworkFeed.jsx', 'utf8');

content = content.replace(
  'h1 className="text-3xl font-display font-bold text-ink tracking-tight text-center mb-8 uppercase tracking-widest"',
  'h1 className="text-3xl font-display font-bold text-ink tracking-tight mb-8"'
);

fs.writeFileSync('client/src/pages/NetworkFeed.jsx', content);
console.log("Fixed NetworkFeed heading alignment");
