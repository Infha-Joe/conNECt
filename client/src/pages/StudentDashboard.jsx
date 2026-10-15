import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import CreatePost from "../components/CreatePost";
import HomeActionRow from "../components/HomeActionRow";
import { FiX } from "react-icons/fi";
import PostCard from "../components/PostCard";
import NECSpotlight from "../components/spotlight/NECSpotlight";
import FinalYearPrompt from "../components/FinalYearPrompt";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import api from "../services/api";
import { FiMessageSquare } from "react-icons/fi";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
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
      <FinalYearPrompt />

      <HomeActionRow onCreatePostClick={() => setShowCreatePost(true)} />

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>
          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCreatePost(false)} className="absolute -top-10 right-0 p-2 text-white hover:text-slate-200 transition-colors">
              <FiX size={24} />
            </button>
            <CreatePost onPostCreated={(newPost) => { handlePostCreated(newPost); setShowCreatePost(false); }} />
          </div>
        </div>
      )}

      
      
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

export default StudentDashboard;
