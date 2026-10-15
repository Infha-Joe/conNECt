const fs = require('fs');
let code = fs.readFileSync('client/src/components/spotlight/NECSpotlight.jsx', 'utf8');

code = code.replace(
    '{isLoading ? <p className="text-center text-slate-500 py-10">Loading spotlight...</p> : <p className="text-center text-slate-500 py-10">No one is currently featured in NEC Spotlight.</p>}',
    'isLoading ? <p className="text-center text-slate-500 py-10">Loading spotlight...</p> : <p className="text-center text-slate-500 py-10">No one is currently featured in NEC Spotlight.</p>'
);

fs.writeFileSync('client/src/components/spotlight/NECSpotlight.jsx', code);
console.log('Fixed syntax error in NECSpotlight.jsx');
