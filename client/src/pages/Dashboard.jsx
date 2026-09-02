import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import CreatePost from "../components/CreatePost";
import PostCard from "../components/PostCard";
import NECSpotlight from "../components/spotlight/NECSpotlight";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import api from "../services/api";
import { FiMessageSquare } from "react-icons/fi";

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "alumni") {
    return <Navigate to="/mentorship" replace />;
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/posts/feed");
      setPosts(data.posts);
    } catch (err) {
      console.error("Failed to fetch feed", err);
      setError("Failed to load feed. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <DashboardLayout>
      {/* Modern Horizontal Community Spotlight */}
      <NECSpotlight />

      {/* Create Post Area */}
      <CreatePost onPostCreated={handlePostCreated} />
      
      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Feed Updates</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      {/* Feed State Handling */}
      <div className="space-y-4">
        {isLoading ? (
          // Skeleton Loader
          [1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton type="avatar" />
                <div className="space-y-2 w-1/3">
                  <Skeleton type="line" className="w-full" />
                  <Skeleton type="line" className="w-2/3" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton type="line" className="w-full" />
                <Skeleton type="line" className="w-5/6" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 border border-red-100">
            <p className="font-medium text-sm">{error}</p>
            <button onClick={fetchFeed} className="mt-2 text-sm font-semibold hover:underline">
              Try again
            </button>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <EmptyState 
            icon={FiMessageSquare}
            title="No posts yet"
            description="Your feed is empty. Be the first to share an update with your network!"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
