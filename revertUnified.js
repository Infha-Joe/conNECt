import fs from 'fs';
let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// Remove feed states
content = content.replace(
  `  const [userError, setUserError] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(null);`,
  `  const [userError, setUserError] = useState(null);`
);

// Remove fetchFeedPosts call from useEffect
content = content.replace(
  `useEffect(() => {
    if (activeTab === "posts") {
      fetchUserPosts();
      fetchFeedPosts();
    }
  }, [activeTab]);`,
  `useEffect(() => {
    if (activeTab === "posts") {
      fetchUserPosts();
    }
  }, [activeTab]);`
);

// Remove fetchFeedPosts definition
content = content.replace(
  /const fetchFeedPosts = async \(\) => \{[\s\S]*?setIsFeedLoading\(false\);\n\s*\}\n\s*\};\n/g,
  ''
);

// Remove the network feed section entirely and add the Campus Feed link
content = content.replace(
  /\{\/\* Network Feed Section \*\/\}[\s\S]*?\}\)$/,
  `{/* View Campus Feed Link */}
            <div className="mt-12 text-center pb-8">
              <Link to="/network-feed" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand/10 text-brand hover:bg-brand/20 font-bold tracking-wide rounded-full transition-colors">
                View Campus Feed &rarr;
              </Link>
            </div>
          </div>
        )}`
);

fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Reverted feed and added Campus Feed link");
