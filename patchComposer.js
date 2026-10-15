import fs from 'fs';
let content = fs.readFileSync('client/src/components/CreatePost.jsx', 'utf8');

content = content.replace(
  /<div className="flex gap-2">\s*<button\s*type="button"\s*className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-ink transition-colors"\s*>\s*<FiImage size=\{16\} className="text-brand" \/>\s*<span>Media<\/span>\s*<\/button>\s*<\/div>/g,
  '<div className="flex gap-2"></div>'
);

fs.writeFileSync('client/src/components/CreatePost.jsx', content);
console.log("Removed fake Media button");
