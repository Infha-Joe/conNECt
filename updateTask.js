const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\5f3df1ab-9f32-4007-829a-e29ad36dd5c1/task.md', 'utf8');
code = code.replace('- `[/]` Verify DB models.', '- `[x]` Verify DB models.')
           .replace('- `[ ]` Test sending connection request -> Receiving notification.', '- `[x]` Test sending connection request -> Receiving notification.')
           .replace('- `[ ]` Test accepting connection -> Receiving notification.', '- `[x]` Test accepting connection -> Receiving notification.')
           .replace('- `[ ]` Test sending message -> Real-time UI update -> Unread badge update.', '- `[x]` Test sending message -> Real-time UI update -> Unread badge update.');
fs.writeFileSync('C:\\Users\\ADMIN\\.gemini\\antigravity\\brain\\5f3df1ab-9f32-4007-829a-e29ad36dd5c1/task.md', code);
