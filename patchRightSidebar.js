const fs = require('fs');
let code = fs.readFileSync('client/src/components/layout/RightSidebar.jsx', 'utf8');

if (!code.includes('RecentlyAccessedWidget')) {
    code = code.replace(
        'import { useAuth } from "../../context/AuthContext";',
        'import { useAuth } from "../../context/AuthContext";\nimport RecentlyAccessedWidget from "../RecentlyAccessedWidget";'
    );
    
    code = code.replace(
        '<div className="space-y-6">',
        '<div className="space-y-6">\n      <RecentlyAccessedWidget />'
    );

    fs.writeFileSync('client/src/components/layout/RightSidebar.jsx', code);
    console.log("Added RecentlyAccessedWidget to RightSidebar");
}
