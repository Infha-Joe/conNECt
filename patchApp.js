import fs from 'fs';
let content = fs.readFileSync('client/src/App.jsx', 'utf8');

if (!content.includes('CreatePostPage')) {
  content = content.replace(
    'import Dashboard from "./pages/Dashboard";',
    'import Dashboard from "./pages/Dashboard";\nimport CreatePostPage from "./pages/CreatePostPage";'
  );
  
  content = content.replace(
    '<Route path="/post/:id" element={<ProtectedRoute><SinglePostView /></ProtectedRoute>} />',
    '<Route path="/post/:id" element={<ProtectedRoute><SinglePostView /></ProtectedRoute>} />\n      <Route path="/create-post" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />'
  );
  
  fs.writeFileSync('client/src/App.jsx', content);
  console.log("Added CreatePostPage to App.jsx");
}
