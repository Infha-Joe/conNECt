import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts/feed");
      setPosts(data.posts);
    } catch (err) {
      setError("Couldn't load your feed. Try refreshing.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFeed(); }, [loadFeed]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [{ ...newPost, likedByMe: false }, ...prev]);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1100px] space-y-4">
        <PostComposer onPostCreated={handlePostCreated} />
        {loading && (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ink/20 border-t-brass" />
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && posts.length === 0 && (
          <div className="rounded-xl border border-dashed border-ink/15 bg-white px-6 py-10 text-center">
            <p className="font-display text-lg text-ink">Your feed is quiet</p>
            <p className="mt-1 text-sm text-slate-text">
              Follow classmates, teachers and alumni to see their posts here — or share something yourself to get started.
            </p>
          </div>
        )}
        {posts.map((post) => (<PostCard key={post._id} post={post} />))}
      </div>
    </DashboardLayout>
  );
};

export default Feed;
