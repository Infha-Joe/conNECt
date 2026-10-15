const fs = require('fs');
let code = fs.readFileSync('client/src/pages/FacultyDashboard.jsx', 'utf8');

if (!code.includes('NECSpotlight')) {
    code = code.replace(
        'import { Link } from "react-router-dom";',
        'import { Link } from "react-router-dom";\nimport NECSpotlight from "../components/spotlight/NECSpotlight";'
    );
    
    code = code.replace(
        '<DashboardLayout>',
        '<DashboardLayout>\n      <NECSpotlight />'
    );
    
    fs.writeFileSync('client/src/pages/FacultyDashboard.jsx', code);
    console.log("Added NECSpotlight to FacultyDashboard.jsx");
} else {
    console.log("NECSpotlight already present");
}
