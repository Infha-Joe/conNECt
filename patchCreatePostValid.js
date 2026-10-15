import fs from 'fs';
let content = fs.readFileSync('client/src/pages/CreatePostPage.jsx', 'utf8');

content = content.replace(
  'await api.post("/posts", { content, mediaUrl, mediaType });',
  `const payload = { content };
      if (mediaUrl) {
        payload.mediaUrl = mediaUrl;
        payload.mediaType = mediaType;
      }
      await api.post("/posts", payload);`
);

// We must also ensure the submit button handles logic gracefully and has correct coloring
// Currently: disabled={isLoading || (!content.trim() && !mediaFile)}
// Let's modify the Button class so it doesn't turn white when disabled.
// "The button must always have a clear visual state... DO NOT make the disabled button white with white/invisible text."
// Let's look at Button.jsx.
fs.writeFileSync('client/src/pages/CreatePostPage.jsx', content);
console.log("Patched CreatePostPage.jsx validation");
