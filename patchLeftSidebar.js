const fs = require('fs');

let code = fs.readFileSync('client/src/components/layout/LeftSidebar.jsx', 'utf8');

const importBadge = `import { useBadges } from "../../context/BadgeContext";`;
code = code.replace('import { useAuth } from "../../context/AuthContext";', 'import { useAuth } from "../../context/AuthContext";\n' + importBadge);

const addIcons = `import { FiMessageSquare, FiGlobe } from "react-icons/fi";`;
code = code.replace('import { FiHome,', 'import { FiHome, FiMessageSquare, FiGlobe,');

// Update arrays
// Student
code = code.replace('{ icon: FiCompass, label: "Explore", path: "/explore" },', 
`{ icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiCompass, label: "Explore", path: "/explore" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },`);

// Teacher
code = code.replace('{ icon: FiBookOpen, label: "My Classes", path: "/academic" },',
`{ icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiCompass, label: "Explore", path: "/explore" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },
  { icon: FiBookOpen, label: "My Classes", path: "/academic" },`);

// Alumni
code = code.replace('{ icon: FiAward, label: "Memories", path: "/memories" },',
`{ icon: FiGlobe, label: "Network", path: "/network" },
  { icon: FiCompass, label: "Explore", path: "/explore" },
  { icon: FiMessageSquare, label: "Messages", path: "/messages" },
  { icon: FiAward, label: "Memories", path: "/memories" },`);

// Add badges logic
const hookInject = `const { user, logout } = useAuth();\n  const { unreadMessages, unreadNotifications } = useBadges();`;
code = code.replace('const { user, logout } = useAuth();', hookInject);

// Render badge in link
const linkReplacement = `
            <item.icon size={18} className={isActive(item.path) ? "text-brand" : "text-slate-400"} />
            <span className="flex-1">{item.label}</span>
            {item.path === "/messages" && unreadMessages > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {unreadMessages > 9 ? "9+" : unreadMessages}
              </span>
            )}
            {item.path === "/notifications" && unreadNotifications > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
`;
code = code.replace(/<item\.icon size=\{18\} className=\{isActive\(item\.path\) \? "text-brand" : "text-slate-400"\} \/>[\s\S]*?<span>\{item\.label\}<\/span>/m, linkReplacement);

fs.writeFileSync('client/src/components/layout/LeftSidebar.jsx', code);
console.log("Updated LeftSidebar.jsx with badges");
