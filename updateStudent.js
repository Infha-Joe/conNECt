const fs = require('fs');
let code = fs.readFileSync('client/src/pages/StudentDashboard.jsx', 'utf8');

if (!code.includes('HomeActionRow')) {
    code = code.replace(
        'import CreatePost from "../components/CreatePost";',
        'import CreatePost from "../components/CreatePost";\nimport HomeActionRow from "../components/HomeActionRow";\nimport { FiX } from "react-icons/fi";'
    );
    
    code = code.replace(
        'const [error, setError] = useState(null);',
        'const [error, setError] = useState(null);\n  const [showCreatePost, setShowCreatePost] = useState(false);'
    );

    code = code.replace(
        '<FinalYearPrompt />',
        '<FinalYearPrompt />\n\n      <HomeActionRow onCreatePostClick={() => setShowCreatePost(true)} />\n\n      {showCreatePost && (\n        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>\n          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>\n            <button onClick={() => setShowCreatePost(false)} className="absolute -top-10 right-0 p-2 text-white hover:text-slate-200 transition-colors">\n              <FiX size={24} />\n            </button>\n            <CreatePost onPostCreated={(newPost) => { handlePostCreated(newPost); setShowCreatePost(false); }} />\n          </div>\n        </div>\n      )}'
    );
    
    code = code.replace(
        /\{\/\* Create Post Area \*\/\}\s*<CreatePost onPostCreated=\{handlePostCreated\} \/>/,
        ''
    );
    
    fs.writeFileSync('client/src/pages/StudentDashboard.jsx', code);
    console.log("Updated StudentDashboard.jsx");
} else {
    console.log("StudentDashboard.jsx already updated");
}
