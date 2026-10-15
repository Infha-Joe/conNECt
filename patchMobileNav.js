import fs from 'fs';
let content = fs.readFileSync('client/src/layouts/DashboardLayout.jsx', 'utf8');

// Insert FiCompass into the import
if (!content.includes('FiCompass')) {
  content = content.replace(
    'import { FiHome, FiUser, FiSearch, FiBell, FiMenu, FiX, FiSettings } from "react-icons/fi";',
    'import { FiHome, FiUser, FiSearch, FiBell, FiMenu, FiX, FiSettings, FiCompass } from "react-icons/fi";'
  );
}

// Insert Campus Feed link into the mobile bottom nav
const campusFeedLink = `         <Link to="/network-feed" className={\`flex flex-col items-center gap-1.5 transition-colors \${isActive('/network-feed') ? 'text-primary' : 'text-ink-light'}\`}>
            <FiCompass size={22} />
            <span className="text-[10px] font-semibold">Feed</span>
         </Link>\n`;

content = content.replace(
  '<Link to="/network" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive(\'/network\') ? \'text-primary\' : \'text-ink-light\'}`}>',
  campusFeedLink + '         <Link to="/network" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive(\'/network\') ? \'text-primary\' : \'text-ink-light\'}`}>'
);

fs.writeFileSync('client/src/layouts/DashboardLayout.jsx', content);
console.log("Updated Mobile Bottom Nav");
