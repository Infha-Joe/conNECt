import fs from 'fs';

let content = fs.readFileSync('src/pages/Register.jsx', 'utf8');

content = content.replace(
  /<div className="flex min-h-screen items-center justify-center bg-background font-sans py-12">\s*<div className="w-full max-w-lg p-6">/g,
  `<div className="flex min-h-screen items-center justify-center bg-background relative font-sans p-4 py-12">
      {/* Subtle abstract background accent */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary-light/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-[500px]">
        <div className="p-8 sm:p-10 shadow-[0_20px_50px_-12px_rgba(23,59,58,0.15)] border border-border bg-surface rounded-2xl">`
);

content = content.replace(
  /className={inputStyles}/g,
  `className={inputStyles + " bg-background"}`
);

// We need to close the div we opened for the card.
// Let's replace the bottom closing divs.
content = content.replace(
  /<\/div>\s*<\/div>\s*\);\s*};/g,
  `        </div>
      </div>
    </div>
  );
};`
);

fs.writeFileSync('src/pages/Register.jsx', content);
