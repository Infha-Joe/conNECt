const fs = require('fs');
let code = fs.readFileSync('client/src/layouts/DashboardLayout.jsx', 'utf8');

// The item is:
/*
         <Link to="/explore" className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/explore') ? 'text-brand' : 'text-slate-400'}`}>
            <FiSearch size={20} />
            <span className="text-[10px] font-semibold">Explore</span>
         </Link>
*/
code = code.replace(/\s*<Link to="\/explore"[\s\S]*?<\/Link>/g, '');

fs.writeFileSync('client/src/layouts/DashboardLayout.jsx', code);
console.log("Removed Explore from DashboardLayout.jsx");
