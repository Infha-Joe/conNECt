const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AlumniDashboard.jsx', 'utf8');

if (!code.includes('RecentlyAccessedWidget')) {
    code = code.replace(
        'import EmptyState from "../components/ui/EmptyState";',
        'import EmptyState from "../components/ui/EmptyState";\nimport RecentlyAccessedWidget from "../components/RecentlyAccessedWidget";'
    );
    
    // Inject it just above the feed
    code = code.replace(
        '<div className="flex items-center gap-4 my-6">',
        '<div className="max-w-2xl mx-auto"><RecentlyAccessedWidget /></div>\n\n      <div className="flex items-center gap-4 my-6">'
    );

    fs.writeFileSync('client/src/pages/AlumniDashboard.jsx', code);
    console.log("Added RecentlyAccessedWidget to AlumniDashboard");
}
