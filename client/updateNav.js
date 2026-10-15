import fs from 'fs';

let content = fs.readFileSync('src/pages/Landing.jsx', 'utf8');

// 1. Remove the middle links div completely
content = content.replace(
  /<div className="hidden lg:flex items-center gap-10 text-sm font-bold tracking-wide text-ink-light uppercase">[\s\S]*?<\/div>/,
  ''
);

// 2. Move ABOUT to sit next to the Auth Buttons and add color to LOGIN/DASHBOARD
content = content.replace(
  /<div className="flex items-center gap-4">\s*\{user \? \(\s*<Link to="\/dashboard" className="[^"]+">\s*DASHBOARD\s*<\/Link>\s*\) : \(\s*<Link to="\/login" className="[^"]+">\s*LOGIN\s*<\/Link>\s*\)\}\s*<\/div>/,
  `<div className="flex items-center gap-6">
          <button onClick={() => scrollToSection('about')} className="hidden lg:block font-bold text-sm tracking-wide text-ink-light hover:text-primary-dark transition-colors uppercase">
            About
          </button>
          {user ? (
            <Link to="/dashboard" className="font-bold text-sm text-white bg-primary hover:bg-primary-hover px-8 py-2.5 rounded-md shadow-sm transition-all uppercase tracking-wider">
              DASHBOARD
            </Link>
          ) : (
            <Link to="/login" className="font-bold text-sm text-white bg-primary hover:bg-primary-hover px-8 py-2.5 rounded-md shadow-sm transition-all uppercase tracking-wider">
              LOGIN
            </Link>
          )}
        </div>`
);

fs.writeFileSync('src/pages/Landing.jsx', content);
