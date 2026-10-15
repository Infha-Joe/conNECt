import fs from 'fs';

let content = fs.readFileSync('src/components/layout/LeftSidebar.jsx', 'utf8');

content = content.replace(
  /<Link\s+to="\/settings"\s+className=\{`flex items-center gap-4 pl-6 pr-4 py-2\.5 text-\[13px\] transition-all \$\{\s*isActive\("\/settings"\) \? activeClasses : inactiveClasses\s*\}\`\}\s*>\s*<FiSettings size=\{16\} className=\{isActive\("\/settings"\) \? "text-primary" : "text-ink-lighter"\} \/>\s*<span>Settings<\/span>\s*<\/Link>/g,
  `<button onClick={logout} className="w-full flex items-center gap-4 pl-6 pr-4 py-2.5 text-[13px] transition-all text-ink-light hover:text-danger hover:bg-danger/5 border-l-2 border-transparent">
          <FiLogOut size={16} className="text-ink-lighter group-hover:text-danger" />
          <span>Log Out</span>
        </button>`
);

fs.writeFileSync('src/components/layout/LeftSidebar.jsx', content);
