const fs = require('fs');
let code = fs.readFileSync('client/src/components/spotlight/NECSpotlight.jsx', 'utf8');

// Remove hardcoded SPOTLIGHT_DATA and ALL_SPOTLIGHT_USERS
code = code.replace(/const SPOTLIGHT_DATA = \{[\s\S]*?\};\n\n\/\/ Combine all users into a single list\nconst ALL_SPOTLIGHT_USERS = \[\n  \.\.\.SPOTLIGHT_DATA\.students,\n  \.\.\.SPOTLIGHT_DATA\.faculty,\n  \.\.\.SPOTLIGHT_DATA\.alumni\n\];/g, '');

// Add useEffect, useState, and api import
if (!code.includes('import api from')) {
   code = code.replace('import { useState } from "react";', 'import { useState, useEffect } from "react";\nimport api from "../../services/api";');
}

// Update component
code = code.replace(
    'const [isOpen, setIsOpen] = useState(false);',
    'const [isOpen, setIsOpen] = useState(false);\n  const [spotlightUsers, setSpotlightUsers] = useState([]);\n  const [isLoading, setIsLoading] = useState(false);\n\n  useEffect(() => {\n    if (isOpen && spotlightUsers.length === 0) {\n      setIsLoading(true);\n      api.get("/users/spotlight")\n        .then(res => setSpotlightUsers(res.data.spotlight || []))\n        .catch(err => console.error(err))\n        .finally(() => setIsLoading(false));\n    }\n  }, [isOpen]);'
);

code = code.replace(/ALL_SPOTLIGHT_USERS\.length === 0/g, 'spotlightUsers.length === 0');
code = code.replace(/ALL_SPOTLIGHT_USERS\.map/g, 'spotlightUsers.map');
code = code.replace(/<p className="text-center text-slate-500 py-10">No one is currently featured in NEC Spotlight.<\/p>/, '{isLoading ? <p className="text-center text-slate-500 py-10">Loading spotlight...</p> : <p className="text-center text-slate-500 py-10">No one is currently featured in NEC Spotlight.</p>}');

// Also fix role naming because the backend returns "teacher" instead of "faculty"
// Actually it's already "teacher" in some places.

fs.writeFileSync('client/src/components/spotlight/NECSpotlight.jsx', code);
console.log('Updated NECSpotlight.jsx to fetch real data');
