const fs = require('fs');
let code = fs.readFileSync('client/src/pages/ProjectDetail.jsx', 'utf8');

if (!code.includes('useRecentAccess')) {
    code = code.replace(
        'import { useParams, useNavigate } from "react-router-dom";',
        'import { useParams, useNavigate } from "react-router-dom";\nimport useRecentAccess from "../hooks/useRecentAccess";'
    );
    
    // Inject right after project is fetched or derived.
    // It's easier to put the hook call at the top of the component
    // useRecentAccess("project", project?._id, project?.title, `/projects/${project?._id}`);
    
    code = code.replace(
        'const { user } = useAuth();',
        'const { user } = useAuth();\n  useRecentAccess(\n    project ? "project" : null,\n    project?._id,\n    project?.title,\n    project ? `/projects/${project._id}` : null\n  );'
    );
    fs.writeFileSync('client/src/pages/ProjectDetail.jsx', code);
    console.log('Patched ProjectDetail');
}
