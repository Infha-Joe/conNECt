import fs from 'fs';
let content = fs.readFileSync('client/src/pages/Messages.jsx', 'utf8');

const sharedPostJSX = `                            {msg.text && <span>{msg.text}</span>}
                            {msg.sharedPost && (
                              <div className={\`mt-1 p-3 rounded-lg border \${isMine ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-200'}\`}>
                                <p className="font-semibold text-[13px] mb-1">{msg.sharedPost.author?.name || "Shared Post"}</p>
                                <Link to={\`/post/\${msg.sharedPost._id || msg.sharedPost}\`} className={\`text-[12px] font-bold underline \${isMine ? 'text-white' : 'text-brand'}\`}>
                                  View Post &rarr;
                                </Link>
                              </div>
                            )}`;

content = content.replace(
  /\{msg\.text\}/,
  sharedPostJSX
);

fs.writeFileSync('client/src/pages/Messages.jsx', content);
console.log('Patched Messages.jsx to display sharedPost links');
