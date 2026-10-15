import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import PostCard from "../components/PostCard";
import Skeleton from "../components/ui/Skeleton";
import api from "../services/api";
import { FiArrowLeft, FiSearch, FiMessageSquare } from "react-icons/fi";

const NetworkFeed = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchFeed();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filter]);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = searchQuery ? `/posts/feed?search=${encodeURIComponent(searchQuery)}` : "/posts/feed";
      const { data } = await api.get(url);
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch feed", err);
      setError("Unable to load network posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full flex flex-col max-w-[900px] pb-20">
        
        

        {/* Header & Search */}
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight mb-8">Campus Feed</h1>
          
          <div className="relative w-full">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-light" size={18} />
            <input
              type="text"
              placeholder="Search campus posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border/70 bg-white shadow-sm pl-12 pr-4 py-3.5 text-base text-ink outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 font-medium placeholder:text-ink-lighter"
            />
          </div>
        </div>

        {/* Create Post Action */}
        <div className="mb-8">
          <Link to="/create-post" className="flex items-center gap-4 bg-white border border-border hover:border-primary/50 hover:shadow-md p-4 rounded-xl transition-all w-full text-left group">
            <div className="shrink-0 bg-primary/10 text-primary rounded-full w-11 h-11 flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-colors">
              +
            </div>
            <div className="flex-1 text-ink-light group-hover:text-ink font-medium text-base">
              Create a Post...
            </div>
          </Link>
        </div>

        {/* Filters - Optional easy filters */}
        <div className="flex gap-4 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setFilter("all")}
            className={`pb-3 px-1 text-sm font-bold tracking-wide transition-all whitespace-nowrap border-b-[3px] ${
              filter === "all" ? "border-primary text-primary" : "border-transparent text-ink-light hover:text-ink hover:border-border"
            }`}
          >
            ALL POSTS
          </button>
          {/* Note: In a real system you'd filter by connection/department in backend.
              Keeping this purely UI as a placeholder unless backend supports it easily.
              I will just use frontend filtering for these easy tabs to respect the prompt. */}
        </div>

        <hr className="border-border my-6" />
        {/* Feed Posts */}
        <div className="space-y-6">
          {isLoading ? (
            <>
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </>
          ) : error ? (
            <div className="py-4 text-center text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-100">
              {error}
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={(id) => setPosts(posts.filter(p => p._id !== id))} />
            ))
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-ink-light bg-surface border border-dashed border-border rounded-xl">
              <FiMessageSquare size={32} className="mb-3 text-ink-lighter" />
              <h3 className="font-bold text-ink text-base">No posts found</h3>
              <p className="text-sm mt-1">Try adjusting your search terms.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default NetworkFeed;
