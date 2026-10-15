import fs from 'fs';

let content = fs.readFileSync('src/pages/UnifiedDashboard.jsx', 'utf8');

// The current tabs container is:
// className="flex border-b border-border mb-10 w-full overflow-x-auto scrollbar-hide"
// Change it to center the tabs and space them out nicely
content = content.replace(
  /className="flex border-b border-border mb-10 w-full overflow-x-auto scrollbar-hide"/,
  'className="flex justify-center sm:justify-start lg:justify-center gap-4 sm:gap-12 border-b border-border mb-10 w-full overflow-x-auto scrollbar-hide"'
);

// We should also remove the `mr-10` from the buttons since we are using `gap` now.
content = content.replace(/mr-10 /g, '');

fs.writeFileSync('src/pages/UnifiedDashboard.jsx', content);
