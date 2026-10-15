import fs from 'fs';

// 1. Fix DashboardLayout
let layoutContent = fs.readFileSync('client/src/layouts/DashboardLayout.jsx', 'utf8');
layoutContent = layoutContent.replace(
  '<main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-8">',
  '<main className="flex-1 w-full max-w-[1200px] px-6 lg:px-10 py-8">'
);
fs.writeFileSync('client/src/layouts/DashboardLayout.jsx', layoutContent);

// 2. Fix NetworkFeed
let feedContent = fs.readFileSync('client/src/pages/NetworkFeed.jsx', 'utf8');
feedContent = feedContent.replace(
  '<div className="w-full flex flex-col max-w-[900px] mx-auto pb-20">',
  '<div className="w-full flex flex-col max-w-[900px] pb-20">'
);
fs.writeFileSync('client/src/pages/NetworkFeed.jsx', feedContent);

// 3. Fix CreatePostPage
let createContent = fs.readFileSync('client/src/pages/CreatePostPage.jsx', 'utf8');
createContent = createContent.replace(
  '<div className="w-full flex flex-col max-w-[900px] mx-auto">',
  '<div className="w-full flex flex-col max-w-[900px]">'
);
fs.writeFileSync('client/src/pages/CreatePostPage.jsx', createContent);

console.log("Removed all mx-auto nested centering constraints");
