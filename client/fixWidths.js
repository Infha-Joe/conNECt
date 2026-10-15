import fs from 'fs';
import path from 'path';

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace mx-auto max-w-2xl, max-w-3xl, etc with w-full
  content = content.replace(/className="mx-auto max-w-(2xl|3xl|4xl|xl|lg|md) px-4 py-8"/g, 'className="w-full px-4 py-8"');
  content = content.replace(/className="mx-auto max-w-(2xl|3xl|4xl|xl|lg|md)"/g, 'className="w-full"');
  content = content.replace(/className="max-w-(2xl|3xl|4xl|xl|lg|md) mx-auto"/g, 'className="w-full"');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', file);
  }
});
