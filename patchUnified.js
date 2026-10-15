import fs from 'fs';

let content = fs.readFileSync('client/src/pages/UnifiedDashboard.jsx', 'utf8');

// Add feed state
content = content.replace(
  'const [isLoading, setIsLoading] = useState(true);',
  `const [isLoading, setIsLoading] = useState(true);
  const [userError, setUserError] = useState(null);
  const [feedPosts, setFeedPosts] = useState([]);
  const [isFeedLoading, setIsFeedLoading] = useState(true);
  const [feedError, setFeedError] = useState(null);`
);

// Add fetchFeedPosts to useEffect
content = content.replace(
  /useEffect\(\(\) => \{\n\s*if \(activeTab === "posts"\) \{\n\s*fetchUserPosts\(\);\n\s*\}\n\s*\}, \[activeTab\]\);/g,
  `useEffect(() => {
    if (activeTab === "posts") {
      fetchUserPosts();
      fetchFeedPosts();
    }
  }, [activeTab]);`
);

// Update fetchUserPosts to handle error state
content = content.replace(
  /const fetchUserPosts = async \(\) => \{[\s\S]*?\};\n/g,
  `const fetchUserPosts = async () => {
    setIsLoading(true);
    setUserError(null);
    try {
      const { data } = await api.get("/posts/user");
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch user posts", err);
      setUserError("Unable to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedPosts = async () => {
    setIsFeedLoading(true);
    setFeedError(null);
    try {
      const { data } = await api.get("/posts/feed");
      // Filter out user's own posts so they aren't duplicated in the network feed
      const otherPosts = data.posts.filter(p => p.author._id !== user?._id);
      setFeedPosts(otherPosts);
    } catch (err) {
      console.error("Failed to fetch feed posts", err);
      setFeedError("Unable to load network posts. Please try again.");
    } finally {
      setIsFeedLoading(false);
    }
  };
`
);

// Add the feed UI below the user's posts
content = content.replace(
  /(\s*)<\/div>\n(\s*)\)}/g,
  `$1

            {/* Network Feed Section */}
            <div className="mt-16 w-full flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <hr className="flex-1 border-border" />
                <h2 className="text-sm font-bold text-ink-light tracking-widest uppercase whitespace-nowrap">Recent Posts From Your Network</h2>
                <hr className="flex-1 border-border" />
              </div>

              {isFeedLoading ? (
                <div className="space-y-6 w-full">
                  <Skeleton className="h-40 w-full rounded-md" />
                  <Skeleton className="h-40 w-full rounded-md" />
                </div>
              ) : feedError ? (
                <div className="py-4 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
                  {feedError}
                </div>
              ) : feedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
                  {feedPosts.map((post) => (
                    <div key={post._id} className="w-full">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-ink-light text-sm">
                  No posts from your network yet.
                </div>
              )}
            </div>

          </div>
        )}`
);

// Add error handling to user posts UI
content = content.replace(
  /\{isLoading \? \(/g,
  `{userError ? (
              <div className="py-4 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
                {userError}
              </div>
            ) : isLoading ? (`
);


fs.writeFileSync('client/src/pages/UnifiedDashboard.jsx', content);
console.log("Patched UnifiedDashboard.jsx");
