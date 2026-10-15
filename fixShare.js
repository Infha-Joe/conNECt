import fs from 'fs';

let content = fs.readFileSync('client/src/components/PostCard.jsx', 'utf8');

// Fix the API call and data handling for fetchConnections
content = content.replace(
  /const fetchConnections = async \(\) => \{[\s\S]*?catch \(err\) \{/m,
  `const fetchConnections = async () => {
    try {
      if (!user?._id) return;
      const { data } = await api.get(\`/users/\${user._id}/connections\`);
      setConnections(data.connections || []);
    } catch (err) {`
);

// Fix the mapping logic since connections is an array of User objects, not Connection objects
const oldMap = `filteredConnections.map(conn => {
                      const friend = conn.requester._id === user?._id ? conn.recipient : conn.requester;
                      return (
                        <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={friend.name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-ink truncate">{friend.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleShare(friend._id)}
                            disabled={isSharing}
                            className="px-3 py-1.5 bg-brand text-white text-[12px] font-bold rounded-lg hover:bg-brand/90 disabled:opacity-50 transition-colors"
                          >
                            Share
                          </button>
                        </div>
                      );
                    })`;

const newMap = `filteredConnections.map(friend => {
                      return (
                        <div key={friend._id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={friend.name} size="sm" />
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-ink truncate">{friend.name}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleShare(friend._id)}
                            disabled={isSharing}
                            className="px-3 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg hover:bg-primary-dark disabled:opacity-50 transition-colors"
                          >
                            Share
                          </button>
                        </div>
                      );
                    })`;

content = content.replace(oldMap, newMap);

fs.writeFileSync('client/src/components/PostCard.jsx', content);
console.log("Patched PostCard Share functionality");
