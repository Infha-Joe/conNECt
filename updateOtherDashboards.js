const fs = require('fs');

function addActionRowAndModal(file) {
    let code = fs.readFileSync(file, 'utf8');
    
    if (code.includes('HomeActionRow')) {
        return; // Already added
    }

    // Add imports
    code = code.replace(
        'import { useAuth } from "../context/AuthContext";',
        'import { useAuth } from "../context/AuthContext";\nimport HomeActionRow from "../components/HomeActionRow";\nimport CreatePost from "../components/CreatePost";\nimport { FiX } from "react-icons/fi";'
    );
    
    // Add state for modal
    if (code.includes('const [isLoading, setIsLoading] = useState(true);')) {
        code = code.replace(
            'const [isLoading, setIsLoading] = useState(true);',
            'const [isLoading, setIsLoading] = useState(true);\n  const [showCreatePost, setShowCreatePost] = useState(false);'
        );
    } else {
        code = code.replace(
            'const { user } = useAuth();',
            'const { user } = useAuth();\n  const [showCreatePost, setShowCreatePost] = useState(false);'
        );
    }
    
    // Add modal handle
    let handlePostCreated = `
  const handlePostCreated = (newPost) => {
    // If they have a feed, update it
    if (typeof setPosts !== 'undefined' && typeof posts !== 'undefined') {
       setPosts([newPost, ...posts]);
    }
    setShowCreatePost(false);
  };
`;
    
    // Insert handlePostCreated before return (
    code = code.replace(
        'return (',
        handlePostCreated + '\n  return ('
    );

    const actionRowAndModal = `
      <HomeActionRow onCreatePostClick={() => setShowCreatePost(true)} />

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>
          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCreatePost(false)} className="absolute -top-10 right-0 p-2 text-white hover:text-slate-200 transition-colors">
              <FiX size={24} />
            </button>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}
`;

    // Inject just below the header div
    code = code.replace(
        /<\/div>\s*<div className="grid grid-cols-1/,
        `</div>\n${actionRowAndModal}\n      <div className="grid grid-cols-1`
    );

    fs.writeFileSync(file, code);
    console.log("Updated " + file);
}

addActionRowAndModal('client/src/pages/FacultyDashboard.jsx');
addActionRowAndModal('client/src/pages/AlumniDashboard.jsx');
