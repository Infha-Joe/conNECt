import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import HomeActionRow from "../components/HomeActionRow";
import CreatePost from "../components/CreatePost";
import { FiX } from "react-icons/fi";
import { FiAward, FiBriefcase, FiUsers, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import RecentlyAccessedWidget from "../components/RecentlyAccessedWidget";
import api from "../services/api";

const AlumniDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const { data } = await api.get("/posts/feed");
      setPosts(data.posts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handlePostCreated = (newPost) => {
    // If they have a feed, update it
    if (typeof setPosts !== 'undefined' && typeof posts !== 'undefined') {
       setPosts([newPost, ...posts]);
    }
    setShowCreatePost(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink font-display">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-slate-500 mt-1">Stay connected with your NEC community.</p>
      </div>

      <HomeActionRow onCreatePostClick={() => setShowCreatePost(true)} />

      {showCreatePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm" onClick={() => setShowCreatePost(false)}>
          <div className="relative w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCreatePost(false)} className="absolute -top-10 right-0 p-2 text-white hover:text-slate-200 transition-colors">
              <FiX size={24} />
            </button>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Link to="/memories" className="bg-gradient-to-br from-brand/10 to-brand/5 p-5 rounded-2xl border border-brand/20 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand mb-3 group-hover:scale-110 transition-transform">
            <FiAward size={20} />
          </div>
          <h3 className="font-bold text-ink mb-1">Your Memories</h3>
          <p className="text-xs text-slate-500">Relive your college journey</p>
        </Link>

        <Link to="/projects" className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <FiBriefcase size={20} />
          </div>
          <h3 className="font-bold text-ink mb-1">Collaborate</h3>
          <p className="text-xs text-slate-500">Join or start projects</p>
        </Link>

        <Link to="/mentorship" className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition-all group">
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
            <FiUsers size={20} />
          </div>
          <h3 className="font-bold text-ink mb-1">Mentorship</h3>
          <p className="text-xs text-slate-500">Guide junior students</p>
        </Link>

        <div className="bg-white p-5 rounded-2xl border border-slate-200">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-3">
            <FiTrendingUp size={20} />
          </div>
          <h3 className="font-bold text-ink mb-1">College Updates</h3>
          <p className="text-xs text-slate-500">2 New Announcements</p>
        </div>
      </div>

      <div className="w-full"><RecentlyAccessedWidget /></div>

      <div className="flex items-center gap-4 my-6">
        <hr className="flex-1 border-slate-200" />
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Alumni & Campus Feed</span>
        <hr className="flex-1 border-slate-200" />
      </div>

      <div className="space-y-4 max-w-[1100px]">
        {isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
            <Skeleton type="line" className="w-full h-20" />
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <EmptyState title="No updates yet" description="Check back later for college updates." />
        )}
      </div>

    </DashboardLayout>
  );
};

export default AlumniDashboard;
