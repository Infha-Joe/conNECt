import fs from 'fs';
let content = fs.readFileSync('client/src/components/PostCard.jsx', 'utf8');

const mediaJSX = `      {/* Post Content */}
      {post.content && (
        <div className="mb-4 text-ink text-[14px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      )}

      {/* Post Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border bg-black/5 flex items-center justify-center">
          {post.mediaType === 'video' ? (
            <video 
              src={\`\${serverUrl}\${post.mediaUrl}\`} 
              controls 
              className="w-full max-h-[500px] bg-black rounded-xl"
            />
          ) : (
            <img 
              src={\`\${serverUrl}\${post.mediaUrl}\`} 
              alt="Post attachment" 
              className="w-full max-h-[500px] object-contain rounded-xl"
            />
          )}
        </div>
      )}`;

content = content.replace(
  /\{\/\* Post Content \*\/\}\s*<div className="mb-4 text-ink text-\[14px\] leading-relaxed whitespace-pre-wrap">\s*\{post\.content\}\s*<\/div>/,
  mediaJSX
);

fs.writeFileSync('client/src/components/PostCard.jsx', content);
console.log("Patched PostCard.jsx to include media rendering");
