import fs from 'fs';
let code = fs.readFileSync('src/layouts/DashboardLayout.jsx', 'utf8');

// Strip out the Right Sidebar import and aside block entirely
code = code.replace(/import RightSidebar from "..\/components\/layout\/RightSidebar";\n/, "");
code = code.replace(/\{\!\(hideRightSidebar \|\| user\?\.role === "alumni" \|\| user\?\.role === "admin"\) && \([\s\S]*?<\/aside>\n\s*\)\}/, "");

fs.writeFileSync('src/layouts/DashboardLayout.jsx', code);
