const fs = require('fs');
let code = fs.readFileSync('client/src/components/FinalYearPrompt.jsx', 'utf8');

// The Enter button is around line 93: <Button type="submit" className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm border-0" disabled={status === "loading"}>
code = code.replace(
    'className="bg-white text-indigo-600 hover:bg-indigo-50 shadow-sm border-0"',
    'variant="primary"'
);

fs.writeFileSync('client/src/components/FinalYearPrompt.jsx', code);
console.log("Fixed FinalYearPrompt.jsx button contrast");
