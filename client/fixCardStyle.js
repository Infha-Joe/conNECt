import fs from 'fs';
let code = fs.readFileSync('src/components/ui/Card.jsx', 'utf8');

code = code.replace(/className={`[\s\S]*?`}/, "className={`bg-surface border border-border rounded-lg shadow-sm transition-all duration-300 ${hover ? 'hover:-translate-y-1 hover:shadow-hover hover:border-primary/30' : ''} ${className}`}");

fs.writeFileSync('src/components/ui/Card.jsx', code);
