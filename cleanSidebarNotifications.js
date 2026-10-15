const fs = require('fs');
let code = fs.readFileSync('client/src/components/layout/LeftSidebar.jsx', 'utf8');

// The item is: { icon: FiBell, label: "Notifications", path: "/notifications" },
code = code.replace(/\s*\{\s*icon:\s*FiBell,\s*label:\s*"Notifications",\s*path:\s*"\/notifications"\s*\},?/g, '');

// And we need to remove the rendering logic in the map function that renders the badge for the sidebar item.
// It looks like:
/*
              {item.path === "/notifications" && unreadNotifications > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-sm">
                  {unreadNotifications > 9 ? "9+" : unreadNotifications}
                </span>
              )}
*/
// The easiest way is to use regex.
const badgeRegex = /\{item\.path === "\/notifications"[\s\S]*?<\/span>\s*\n\s*\}/g;
code = code.replace(badgeRegex, '');

fs.writeFileSync('client/src/components/layout/LeftSidebar.jsx', code);
console.log("Removed Notifications from LeftSidebar.jsx");
