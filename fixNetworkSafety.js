import fs from 'fs';

let content = fs.readFileSync('client/src/pages/Network.jsx', 'utf8');

// The UserCard component might be passed a null user
const safeUserCard = `  const UserCard = ({ u, showConnect = true }) => {
    if (!u) return null;
    return (
      <div className="flex items-center justify-between rounded-xl border border-ink/10 bg-white p-4 shadow-sm hover:shadow-md transition">
        <Link to={\`/profile/\${u._id}\`} className="flex items-center gap-4">
          {u.profilePhoto ? (
            <img src={u.profilePhoto} alt={u.name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 font-display text-lg font-medium text-ink">
              {(u?.name?.[0]?.toUpperCase() || "?")}
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-ink">{u.name}</p>
            <div className="text-sm text-slate-500">
              {u.role === "student" && <p>Student &middot; {u.department?.name}</p>}
              {u.role === "teacher" && <p>Faculty &middot; {u.department?.name}</p>}
              {u.role === "alumni" && <p>Alumni &middot; {u.company || "Professional"}</p>}
            </div>
          </div>
        </Link>
        <div onClick={handleRequestResponded}>
          {showConnect && <ConnectButton userId={u._id} />}
        </div>
      </div>
    );
  };`;

content = content.replace(/const UserCard = \(\{ u, showConnect = true \}\) => \([\s\S]*?<\/div>\n    \);/m, safeUserCard);

fs.writeFileSync('client/src/pages/Network.jsx', content);
console.log("Patched Network.jsx UserCard safety");
