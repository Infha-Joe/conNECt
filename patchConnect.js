const fs = require('fs');
let code = fs.readFileSync('client/src/components/ConnectButton.jsx', 'utf8');

const importNav = `import { useNavigate } from "react-router-dom";\nimport { MessageSquare } from "lucide-react";`;
code = code.replace('import { UserPlus, Clock, UserCheck } from "lucide-react";', 'import { UserPlus, Clock, UserCheck } from "lucide-react";\n' + importNav);

code = code.replace('const ConnectButton = ({ userId }) => {', 'const ConnectButton = ({ userId }) => {\n  const navigate = useNavigate();');

const acceptedBlock = `  if (status === "accepted") {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/messages', { state: { activeUserId: userId } })}
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-50"
        >
          <MessageSquare size={15} className="-ml-0.5" />
          Message
        </button>
        <button
          onClick={disconnect}
          disabled={submitting}
          className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-4 py-1.5 text-sm font-semibold text-ink transition hover:bg-ink/5 disabled:opacity-50"
        >
          <UserCheck size={15} />
          Connected
        </button>
      </div>
    );
  }`;

code = code.replace(/if \(status === "accepted"\) \{[\s\S]*?Connected\n\s*<\/button>\n\s*\);\n\s*\}/m, acceptedBlock);

fs.writeFileSync('client/src/components/ConnectButton.jsx', code);
console.log("Updated ConnectButton.jsx with Message button");
