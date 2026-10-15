import fs from 'fs';
import path from 'path';

let content = fs.readFileSync('src/pages/Profile.jsx', 'utf8');
content = content.replace(/className="mx-auto w-full max-w-4xl space-y-6"/g, 'className="w-full max-w-[1100px] space-y-6"');
fs.writeFileSync('src/pages/Profile.jsx', content);

const dir = 'src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let pageContent = fs.readFileSync(filePath, 'utf8');
  let original = pageContent;

  pageContent = pageContent.replace(/mx-auto max-w-(2xl|3xl|4xl|xl|lg|md|sm)/g, 'max-w-[1100px]');
  pageContent = pageContent.replace(/max-w-(2xl|3xl|4xl|xl|lg|md|sm) mx-auto/g, 'max-w-[1100px]');
  pageContent = pageContent.replace(/mx-auto w-full max-w-(2xl|3xl|4xl|xl|lg|md|sm)/g, 'w-full max-w-[1100px]');
  pageContent = pageContent.replace(/w-full max-w-(2xl|3xl|4xl|xl|lg|md|sm) mx-auto/g, 'w-full max-w-[1100px]');

  if (pageContent !== original) {
    fs.writeFileSync(filePath, pageContent);
    console.log('Fixed stragglers in:', file);
  }
});

